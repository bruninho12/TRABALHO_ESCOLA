const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const app = require("./src/index");
const fs = require("fs");
const https = require("https");

const PORT = process.env.PORT || 3001;

if (
  process.env.NODE_ENV === "production" &&
  process.env.SSL_KEY &&
  process.env.SSL_CERT
) {
  // Iniciar servidor HTTPS em produção se certificados estiverem configurados
  const sslOptions = {
    key: fs.readFileSync(process.env.SSL_KEY),
    cert: fs.readFileSync(process.env.SSL_CERT),
  };
  https.createServer(sslOptions, app).listen(PORT, () => {
    console.log(`✅ Servidor rodando em https://localhost:${PORT}`);
    console.log(`📚 Documentação API: https://localhost:${PORT}/api-docs`);
  });
} else {
  // Fallback para HTTP
  app.listen(PORT, () => {
    console.log(`✅ Servidor rodando em http://localhost:${PORT}`);
    console.log(`📚 Documentação API: http://localhost:${PORT}/api-docs`);
  });
}

// Auto-restart handling
if (process.env.AUTO_RESTART === "true") {
  process.on("uncaughtException", (error) => {
    console.error("Uncaught Exception:", error);
    process.exit(1);
  });
}
