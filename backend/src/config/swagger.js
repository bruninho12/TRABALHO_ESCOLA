const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

// Opções de definição do Swagger
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "DespFinancee API",
      version: "1.0.0",
      description: "API de gerenciamento de finanças pessoais do DespFinancee",
      contact: {
        name: "Bruno Souza",
        email: "contato@despfinancee.com",
      },
    },
    servers: [
      {
        url:
          process.env.NODE_ENV === "production"
            ? "https://api.despfinancee.com"
            : "http://localhost:3001",
        description:
          process.env.NODE_ENV === "production"
            ? "Servidor de Produção"
            : "Servidor Local",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./src/routes/*.js", "./src/models/*.js", "./src/swagger/*.js"],
};

// Gerar especificação Swagger
const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Função de configuração do Swagger
const setupSwagger = (app) => {
  // Rota para documentação Swagger UI
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  // Rota para obter a especificação JSON do Swagger
  app.get("/api-docs.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });

  console.log("Documentação Swagger disponível em /api-docs");
};

module.exports = { setupSwagger };
