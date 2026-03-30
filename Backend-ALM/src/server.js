const { initDatabase } = require("./db");
const { createApp } = require("./app");
const { getCredentials } = require("./controllers/authController");

const PORT = process.env.PORT || 3000;
const app = createApp(PORT);

async function startServer() {
  try {
    getCredentials();
    await initDatabase();

    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
      console.log(`Swagger UI en http://localhost:${PORT}/api-docs`);
      console.log("Base de datos conectada y lista");
    });
  } catch (error) {
    const reason = error.message || error.code || "Error desconocido de conexion";
    console.error("No se pudo iniciar el backend por error de base de datos:", reason);

    if (error.code === "ECONNREFUSED") {
      console.error(
        "No hay PostgreSQL escuchando en el host/puerto configurado. Verifica .env o levanta el servidor PostgreSQL."
      );
    }

    process.exit(1);
  }
}

startServer();
