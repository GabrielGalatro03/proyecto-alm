function createOpenApiSpec(port) {
  return {
    openapi: "3.0.3",
    info: {
      title: "API Almacen",
      version: "1.0.0",
      description: "API para consultar y administrar productos"
    },
    servers: [
      {
        url: `http://localhost:${port}`
      }
    ],
    paths: {
      "/health": {
        get: {
          summary: "Estado del servicio",
          responses: {
            200: {
              description: "Servicio activo"
            }
          }
        }
      },
      "/api/products/price": {
        get: {
          summary: "Obtiene el precio de un producto por nombre",
          parameters: [
            {
              in: "query",
              name: "name",
              required: true,
              schema: { type: "string" }
            }
          ],
          responses: {
            200: { description: "Precio encontrado" },
            400: { description: "Parametro name faltante" },
            404: { description: "Producto no encontrado" }
          }
        },
        patch: {
          summary: "Actualiza el precio de un producto por nombre",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["name", "price"],
                  properties: {
                    name: { type: "string" },
                    price: { type: "number" }
                  }
                }
              }
            }
          },
          responses: {
            200: { description: "Precio actualizado" },
            400: { description: "Body invalido" },
            404: { description: "Producto no encontrado" }
          }
        }
      },
      "/api/products/suggest": {
        get: {
          summary: "Devuelve sugerencias de productos por prefijo",
          parameters: [
            {
              in: "query",
              name: "query",
              required: true,
              schema: { type: "string" }
            },
            {
              in: "query",
              name: "limit",
              required: false,
              schema: {
                type: "integer",
                minimum: 1,
                maximum: 50,
                default: 10
              }
            }
          ],
          responses: {
            200: { description: "Sugerencias" },
            400: { description: "Query faltante" }
          }
        }
      },
      "/api/products": {
        post: {
          summary: "Agrega un nuevo producto",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["name", "price"],
                  properties: {
                    name: { type: "string" },
                    price: { type: "number" },
                    currency: { type: "string" }
                  }
                }
              }
            }
          },
          responses: {
            201: { description: "Producto creado" },
            400: { description: "Datos invalidos" },
            409: { description: "Producto ya existe" }
          }
        },
        delete: {
          summary: "Elimina un producto por nombre",
          parameters: [
            {
              in: "query",
              name: "name",
              required: true,
              schema: { type: "string" }
            }
          ],
          responses: {
            200: { description: "Producto eliminado" },
            400: { description: "Parametro faltante" },
            404: { description: "Producto no encontrado" }
          }
        }
      }
    }
  };
}

module.exports = {
  createOpenApiSpec
};
