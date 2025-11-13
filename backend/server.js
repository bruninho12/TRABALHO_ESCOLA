const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const app = require("./src/index");

// Inicia o servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✅ Servidor rodando em http://localhost:${PORT}`);
  console.log(`📚 Documentação API: http://localhost:${PORT}/api-docs`);
});

// Auto-restart handling
if (process.env.AUTO_RESTART === "true") {
  process.on("uncaughtException", (error) => {
    console.error("Uncaught Exception:", error);
    setTimeout(() => {
      startServer();
    }, 5000);
  });
}
