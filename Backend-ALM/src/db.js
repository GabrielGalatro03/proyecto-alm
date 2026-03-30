require("dotenv").config({ quiet: true });

const { Pool } = require("pg");

function buildConnectionConfig() {
  if (process.env.DATABASE_URL) {
    return {
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : false
    };
  }

  const requiredVars = ["DB_HOST", "DB_NAME", "DB_USER", "DB_PASSWORD"];
  const missingVars = requiredVars.filter((key) => !process.env[key]);

  if (missingVars.length > 0) {
    throw new Error(
      `Faltan variables de entorno para DB: ${missingVars.join(", ")}. Configura DATABASE_URL o las variables separadas.`
    );
  }

  return {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 5432),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : false
  };
}

const connectionConfig = buildConnectionConfig();

const pool = new Pool(connectionConfig);

async function initDatabase() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS products (
      id SERIAL PRIMARY KEY,
      name VARCHAR(120) UNIQUE NOT NULL,
      price NUMERIC(12, 2) NOT NULL CHECK (price >= 0),
      currency VARCHAR(10) NOT NULL DEFAULT 'ARS',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);
}

async function findProductByName(name) {
  const { rows } = await pool.query(
    `
      SELECT name, price::float8 AS price, currency
      FROM products
      WHERE LOWER(name) = LOWER($1)
      LIMIT 1;
    `,
    [name.trim()]
  );

  return rows[0] || null;
}

async function searchProductsByPrefix(query, limit = 10) {
  const normalizedLimit = Number.isFinite(limit) ? Math.max(1, Math.min(50, Math.trunc(limit))) : 10;
  const prefix = `${query.trim()}%`;

  const { rows } = await pool.query(
    `
      SELECT name
      FROM products
      WHERE name ILIKE $1
      ORDER BY name
      LIMIT $2;
    `,
    [prefix, normalizedLimit]
  );

  return rows.map((row) => row.name);
}

async function updateProductPriceByName(name, price) {
  const { rows } = await pool.query(
    `
      UPDATE products
      SET price = $2
      WHERE LOWER(name) = LOWER($1)
      RETURNING name, price::float8 AS price, currency;
    `,
    [name.trim(), price]
  );

  return rows[0] || null;
}

async function createProduct(name, price, currency = "ARS") {
  const { rows } = await pool.query(
    `
      INSERT INTO products (name, price, currency)
      VALUES ($1, $2, $3)
      RETURNING name, price::float8 AS price, currency;
    `,
    [name.trim(), price, currency]
  );

  return rows[0];
}

async function deleteProductByName(name) {
  const { rows } = await pool.query(
    `
      DELETE FROM products
      WHERE LOWER(name) = LOWER($1)
      RETURNING name, price::float8 AS price, currency;
    `,
    [name.trim()]
  );

  return rows[0] || null;
}

async function loadDefaultProducts() {
  try {
    const { rows } = await pool.query("SELECT COUNT(*) as count FROM products");
    const count = parseInt(rows[0].count, 10);
    
    if (count > 0) {
      console.log(`Database already has ${count} products, skipping default load`);
      return;
    }

    console.log("Database is empty, loading default products...");
    const fs = require("fs");
    const path = require("path");
    const defaultFile = path.join(__dirname, "default-products.json");
    
    if (!fs.existsSync(defaultFile)) {
      console.log("No default products file found, skipping");
      return;
    }

    const products = JSON.parse(fs.readFileSync(defaultFile, "utf-8"));
    
    for (const product of products) {
      await pool.query(
        "INSERT INTO products (name, price, currency) VALUES ($1, $2, $3) ON CONFLICT (name) DO NOTHING",
        [product.name, product.price, product.currency || "ARS"]
      );
    }
    
    console.log(`Loaded ${products.length} default products`);
  } catch (error) {
    console.error("Error loading default products:", error.message);
  }
}

module.exports = {
  initDatabase,
  findProductByName,
  searchProductsByPrefix,
  updateProductPriceByName,
  createProduct,
  deleteProductByName,
  loadDefaultProducts,
  pool
};
