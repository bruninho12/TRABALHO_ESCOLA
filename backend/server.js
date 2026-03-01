const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });
const app = require("./src/index");
const fs = require("fs");
const https = require("https");

// Importar novos serviços
const recurringProcessor = require("./src/services/recurringTransactionProcessor");

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
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`✅ Servidor rodando em http://0.0.0.0:${PORT}`);
    console.log(`📚 Documentação API: http://localhost:${PORT}/api-docs`);
    console.log(`🌐 Acesso via rede: http://192.168.100.7:${PORT}`);

    // Iniciar serviços em background
    try {
      recurringProcessor.start();
      console.log(`🔄 Processador de transações recorrentes iniciado`);
    } catch (error) {
      console.error(`❌ Erro ao iniciar processador de recorrências:`, error);
    }
  });
}
