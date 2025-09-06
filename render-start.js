#!/usr/bin/env node

// Script específico para o Render que pode lidar com estrutura de diretórios diferente
const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");

console.log("Iniciando aplicação no Render...");

// Verificar a estrutura de diretórios
console.log("Estrutura de diretórios:");
const currentDir = process.cwd();
console.log(`Diretório atual: ${currentDir}`);
console.log("Conteúdo do diretório atual:");
try {
  const files = fs.readdirSync(currentDir);
  console.log(files);
} catch (err) {
  console.error("Erro ao ler diretório:", err);
}

// Tentar encontrar o backend
const possiblePaths = [
  path.join(currentDir, "backend"),
  path.join(currentDir, "..", "backend"),
  currentDir,
];

let backendDir = null;
for (const dir of possiblePaths) {
  try {
    if (fs.existsSync(dir) && fs.existsSync(path.join(dir, "index.js"))) {
      backendDir = dir;
      console.log(`Backend encontrado em: ${backendDir}`);
      break;
    }
  } catch (err) {
    console.error(`Erro ao verificar ${dir}:`, err);
  }
}

if (!backendDir) {
  console.error(
    "Não foi possível encontrar o diretório do backend com index.js!"
  );
  process.exit(1);
}

// Verificar se os diretórios de dados existem
const dataDir = path.join(backendDir, "data");
if (!fs.existsSync(dataDir)) {
  console.log(`Criando diretório de dados: ${dataDir}`);
  fs.mkdirSync(dataDir, { recursive: true });
}

// Iniciar o backend
console.log(`Iniciando backend em: ${backendDir}`);
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
