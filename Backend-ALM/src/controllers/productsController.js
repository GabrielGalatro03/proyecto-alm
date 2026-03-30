const {
  findProductByName,
  searchProductsByPrefix,
  updateProductPriceByName,
  createProduct,
  deleteProductByName
} = require("../db");

async function getProductPrice(req, res) {
  const { name } = req.query;

  if (!name || !name.trim()) {
    return res.status(400).json({
      error: "Debes enviar el nombre del producto en el query param 'name'"
    });
  }

  const product = await findProductByName(name);

  if (!product) {
    return res.status(404).json({
      error: `No se encontro el producto: ${name}`
    });
  }

  return res.json({
    name: product.name,
    price: product.price,
    currency: product.currency || "ARS"
  });
}

async function suggestProducts(req, res) {
  const { query } = req.query;
  const limitParam = Number.parseInt(req.query.limit, 10);

  if (!query || !query.trim()) {
    return res.status(400).json({
      error: "Debes enviar el query param 'query'"
    });
  }

  const suggestions = await searchProductsByPrefix(query, Number.isNaN(limitParam) ? 10 : limitParam);

  return res.json({
    query: query.trim(),
    suggestions
  });
}

async function patchProductPrice(req, res) {
  const { name, price } = req.body;

  if (!name || !String(name).trim()) {
    return res.status(400).json({
      error: "Debes enviar 'name' en el body"
    });
  }

  const parsedPrice = Number(price);
  if (!Number.isFinite(parsedPrice) || parsedPrice < 0) {
    return res.status(400).json({
      error: "Debes enviar un precio valido mayor o igual a 0"
    });
  }

  const updated = await updateProductPriceByName(String(name), parsedPrice);

  if (!updated) {
    return res.status(404).json({
      error: `No se encontro el producto: ${name}`
    });
  }

  return res.json(updated);
}

async function postProduct(req, res) {
  const { name, price, currency } = req.body;

  if (!name || !String(name).trim()) {
    return res.status(400).json({
      error: "Debes enviar 'name' en el body"
    });
  }

  const parsedPrice = Number(price);
  if (!Number.isFinite(parsedPrice) || parsedPrice < 0) {
    return res.status(400).json({
      error: "Debes enviar un precio valido mayor o igual a 0"
    });
  }

  const existing = await findProductByName(String(name));
  if (existing) {
    return res.status(409).json({
      error: `El producto ya existe: ${existing.name}`
    });
  }

  const created = await createProduct(String(name), parsedPrice, String(currency || "ARS"));
  return res.status(201).json(created);
}

async function removeProduct(req, res) {
  const { name } = req.query;

  if (!name || !String(name).trim()) {
    return res.status(400).json({
      error: "Debes enviar el query param 'name'"
    });
  }

  const deleted = await deleteProductByName(String(name));

  if (!deleted) {
    return res.status(404).json({
      error: `No se encontro el producto: ${name}`
    });
  }

  return res.json({
    message: "Producto eliminado",
    product: deleted
  });
}

module.exports = {
  getProductPrice,
  suggestProducts,
  patchProductPrice,
  postProduct,
  removeProduct
};
