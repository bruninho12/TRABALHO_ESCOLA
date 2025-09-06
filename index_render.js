// Este arquivo é um redirecionador para o backend/index.js
// Específico para a plataforma Render
console.log("Iniciando aplicação no Render...");

// Usamos spawn para iniciar o processo como filho, já que o backend usa ES modules
const { spawn } = require("child_process");
const path = require("path");

// Definir o diretório do backend
const backendDir = path.join(__dirname, "backend");
console.log(`Diretório do backend: ${backendDir}`);

// Iniciar o backend
const backend = spawn("node", ["index.js"], {
  cwd: backendDir,
  stdio: "inherit",
});

backend.on("error", (err) => {
  console.error("Erro ao iniciar o backend:", err);
  process.exit(1);
});

backend.on("close", (code) => {
  console.log(`Backend encerrado com código ${code}`);
  process.exit(code);
});

// Capturar sinais para encerrar graciosamente
process.on("SIGTERM", () => {
  console.log("Recebido SIGTERM. Encerrando aplicação...");
  backend.kill("SIGTERM");
});

process.on("SIGINT", () => {
  console.log("Recebido SIGINT. Encerrando aplicação...");
  backend.kill("SIGINT");
});
