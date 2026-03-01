#!/usr/bin/env node

/**
 * Script de inicialização inteligente
 * Detecta automaticamente a melhor configuração de rede
 */

import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import os from "os";
import { fileURLToPath } from "url";
import process from "process";

// Compatibilidade ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("🚀 Iniciando DespFinancee...\n");

/**
 * Detecta IPs da rede local
 */
function getLocalIPs() {
  const interfaces = os.networkInterfaces();
  const ips = [];

  for (const name of Object.keys(interfaces)) {
    for (const net of interfaces[name]) {
      // Pular endereços internos e IPv6
      if (net.family === "IPv4" && !net.internal) {
        ips.push(net.address);
      }
    }
  }

  return ips;
}

/**
 * Testa se um IP está acessível na porta 3001
 */
async function testApiConnection(ip) {
  try {
    // Usar fetch nativo do Node.js 18+ ou importar node-fetch
    let fetch;
    try {
      fetch = globalThis.fetch;
    } catch {
      const nodeFetch = await import("node-fetch");
      fetch = nodeFetch.default;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    const response = await fetch(`http://${ip}:3001/api/health`, {
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Detecta qual IP do backend está funcionando
 */
async function detectBackendIP() {
  const ips = ["localhost", "127.0.0.1", ...getLocalIPs()];

  console.log("🔍 Detectando backend disponível...");

  for (const ip of ips) {
    console.log(`   Testando ${ip}:3001...`);

    if (await testApiConnection(ip)) {
      console.log(`✅ Backend encontrado em ${ip}:3001\n`);
      return ip;
    }
  }

  console.log("❌ Nenhum backend encontrado\n");
  return null;
}

/**
 * Cria arquivo .env automático
 */
function createEnvFile(backendIP) {
  const envPath = path.join(__dirname, ".env");
  let envContent = "";

  // Detectar se estamos usando rede ou localhost
  const isNetworkMode =
    backendIP && backendIP !== "localhost" && backendIP !== "127.0.0.1";

  if (backendIP && backendIP !== "localhost") {
    envContent += `# Configuração automática - Backend detectado em ${backendIP}\n`;
    envContent += `VITE_API_URL=http://${backendIP}:3001/api\n`;
  } else {
    envContent += `# Configuração padrão - Backend local\n`;
    envContent += `VITE_API_URL=http://localhost:3001/api\n`;
  }

  envContent += `VITE_ENV=development\n`;
  envContent += `VITE_DEBUG=true\n`;

  // Configurar modo de rede para HMR
  if (isNetworkMode) {
    envContent += `VITE_NETWORK_MODE=true\n`;
    envContent += `# HMR configurado para rede local\n`;
  } else {
    envContent += `VITE_NETWORK_MODE=false\n`;
    envContent += `# HMR configurado para localhost\n`;
  }

  fs.writeFileSync(envPath, envContent);
  console.log(`📝 Arquivo .env criado com configuração automática\n`);
}

/**
 * Função principal
 */
async function main() {
  try {
    // Detectar backend
    const backendIP = await detectBackendIP();

    if (backendIP) {
      createEnvFile(backendIP);
    } else {
      console.log("⚠️  Backend não detectado. Usando configuração padrão.\n");
      createEnvFile("localhost");
    }

    // Limpar cache do Vite
    console.log("🧹 Limpando cache...");
    try {
      // Verificar se é Windows
      if (process.platform === "win32") {
        execSync(
          'if exist "node_modules\\.vite" rmdir /s /q "node_modules\\.vite"',
          { stdio: "inherit" }
        );
      } else {
        execSync("rm -rf node_modules/.vite", { stdio: "inherit" });
      }
    } catch {
      // Ignorar erro se diretório não existe
      console.log("   Cache já limpo ou não encontrado");
    }

    // Iniciar servidor de desenvolvimento
    console.log("🎉 Iniciando servidor de desenvolvimento...\n");

    // Mostrar informações úteis
    console.log("📋 Informações de acesso:");
    console.log("   Local:   http://localhost:5173");

    const localIPs = getLocalIPs();
    localIPs.forEach((ip) => {
      console.log(`   Rede:    http://${ip}:5173`);
    });

    if (backendIP) {
      console.log(`\n🔗 API configurada: http://${backendIP}:3001/api`);
    }

    console.log("\n🚀 Pressione Ctrl+C para parar o servidor\n");

    // Iniciar Vite
    execSync("npm run dev", { stdio: "inherit" });
  } catch (error) {
    console.error("❌ Erro na inicialização:", error.message);
    process.exit(1);
  }
}

// Executar apenas se chamado diretamente (ESM)
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
