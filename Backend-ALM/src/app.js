const express = require("express");
const cors = require("cors");
const path = require("path");
const helmet = require("helmet");
const session = require("express-session");
const rateLimit = require("express-rate-limit");
const swaggerUi = require("swagger-ui-express");
const productsRoutes = require("./routes/productsRoutes");
const authRoutes = require("./routes/authRoutes");
const { requireAuth } = require("./middleware/requireAuth");
const { createOpenApiSpec } = require("./docs/openapi");

function createApp(port) {
  const app = express();
  const frontendPath = path.join(__dirname, "..", "..", "Frontend-ALM");
  const openApiSpec = createOpenApiSpec(port);
  const sessionSecret = process.env.SESSION_SECRET;

  if (process.env.NODE_ENV === "production" && !sessionSecret) {
    throw new Error("SESSION_SECRET es obligatorio en produccion.");
  }

  app.set("trust proxy", 1);

  app.use(cors());
  app.use(
    helmet({
      contentSecurityPolicy: false
    })
  );
  app.use(express.json());
  app.use(
    session({
      name: "alm.sid",
      secret: sessionSecret || "dev-session-secret-change-me",
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: 1000 * 60 * 60 * 12
      }
    })
  );

  const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    standardHeaders: true,
    legacyHeaders: false
  });

  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openApiSpec));
  app.get("/openapi.json", (_req, res) => res.json(openApiSpec));
  app.get("/health", (_req, res) => res.json({ status: "ok" }));

  app.use("/api/auth/login", loginLimiter);
  app.use("/api/auth", authRoutes);
  app.use("/api", requireAuth, productsRoutes);
  app.use(express.static(frontendPath));

  return app;
}

module.exports = {
  createApp
};
