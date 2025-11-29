/**
 * Script auxiliar para configurar credenciais do MercadoPago
 * Execute: node scripts/setup-mercadopago.js
 */

const readline = require("readline");
const fs = require("fs");
const path = require("path");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const envPath = path.join(__dirname, "..", ".env");

console.log(
  "\n╔══════════════════════════════════════════════════════════════╗"
);
console.log("║  🔧 CONFIGURAÇÃO DO MERCADOPAGO - DespFinancee              ║");
console.log(
  "╚══════════════════════════════════════════════════════════════╝\n"
);

console.log("📋 Primeiro, obtenha suas credenciais:\n");
console.log("1. Acesse: https://www.mercadopago.com.br/developers/panel");
console.log("2. Faça login e crie uma aplicação");
console.log("3. Copie as credenciais de TESTE (começam com TEST-)\n");

function question(query) {
  return new Promise((resolve) => rl.question(query, resolve));
}

async function setup() {
  try {
    console.log(
      "═══════════════════════════════════════════════════════════════\n"
    );

    const accessToken = await question("🔑 Cole seu Access Token (TEST-...): ");
    const publicKey = await question("🔑 Cole seu Public Key (TEST-...): ");

    if (!accessToken.startsWith("TEST-") || !publicKey.startsWith("TEST-")) {
      console.log(
        '\n⚠️  ATENÇÃO: As credenciais devem começar com "TEST-" para ambiente de testes!'
      );
      console.log("Para produção, use credenciais sem o prefixo TEST-\n");
    }

    // Ler arquivo .env atual
    let envContent = fs.readFileSync(envPath, "utf8");

    // Atualizar credenciais
    envContent = envContent.replace(
      /MERCADO_PAGO_ACCESS_TOKEN=.*/,
      `MERCADO_PAGO_ACCESS_TOKEN=${accessToken}`
    );
    envContent = envContent.replace(
      /MERCADO_PAGO_PUBLIC_KEY=.*/,
      `MERCADO_PAGO_PUBLIC_KEY=${publicKey}`
    );

    // Salvar arquivo
    fs.writeFileSync(envPath, envContent);

    console.log("\n✅ Credenciais configuradas com sucesso!");
    console.log("📁 Arquivo atualizado: backend/.env\n");
    console.log("🧪 Teste agora com: node scripts/test-mercadopago.js\n");
  } catch (error) {
    console.error("\n❌ Erro ao configurar:", error.message);
  } finally {
    rl.close();
  }
}

setup();
