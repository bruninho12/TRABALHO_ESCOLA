const crypto = require("crypto");

function checkJwtSecret() {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    console.error("❌ JWT_SECRET não definido nas variáveis de ambiente");
    return false;
  }

  if (secret.length < 32) {
    console.warn(
      "⚠️ JWT_SECRET muito curto (recomendado mínimo de 32 caracteres)"
    );
  }

  if (
    secret.includes("chave_secreta_muito_segura_para_autenticacao_jwt") ||
    secret.toLowerCase().includes("senha") ||
    secret.toLowerCase().includes("secret")
  ) {
    console.warn(
      "⚠️ JWT_SECRET parece estar usando um valor de exemplo. Troque antes de ir para produção."
    );
  }

  return true;
}

function checkNodeEnv() {
  if (!process.env.NODE_ENV) {
    console.warn("⚠️ NODE_ENV não definido. Usando 'development' por padrão.");
    return false;
  }

  if (!["development", "production", "test"].includes(process.env.NODE_ENV)) {
    console.warn(`⚠️ NODE_ENV com valor não padrão: ${process.env.NODE_ENV}`);
  }

  return true;
}

function checkHelmetAndRateLimit() {
  // Esses checks são mais conceituais; aqui apenas lembramos o dev
  console.log(
    "ℹ️ Certifique-se de que Helmet e Rate Limiting estão habilitados em produção (veja src/index.js)."
  );
}

function generateStrongSecret() {
  const secret = crypto.randomBytes(48).toString("hex");
  console.log("\n🔐 Sugestão de JWT_SECRET forte:\n");
  console.log(secret);
}

function runSecurityChecks() {
  console.log("🛡️ Verificando configuração de segurança do backend...\n");

  let ok = true;

  if (!checkJwtSecret()) ok = false;
  if (!checkNodeEnv()) ok = false;

  checkHelmetAndRateLimit();

  if (!ok) {
    console.warn(
      "\n⚠️ Algumas configurações de segurança precisam de atenção antes do deploy."
    );
    generateStrongSecret();
    process.exit(1);
  }

  console.log("\n🎉 Verificação básica de segurança concluída sem erros críticos.");
}

if (require.main === module) {
  runSecurityChecks();
}

module.exports = { runSecurityChecks };

