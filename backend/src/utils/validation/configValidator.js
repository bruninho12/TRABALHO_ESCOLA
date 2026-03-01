const fs = require("fs");
const path = require("path");

const REQUIRED_VARS = ["MONGO_URI", "JWT_SECRET", "CORS_ORIGIN"];

function loadEnvFile() {
  const envPath = path.join(__dirname, "../../../.env");
  if (!fs.existsSync(envPath)) {
    return null;
  }

  const content = fs.readFileSync(envPath, "utf-8");
  const lines = content.split("\n");
  const envFromFile = {};

  lines.forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) return;
    const [key, ...rest] = trimmed.split("=");
    envFromFile[key] = rest.join("=").trim();
  });

  return envFromFile;
}

function validateConfig() {
  console.log("🔍 Validando configuração do backend (.env)...\n");

  const fileEnv = loadEnvFile() || {};
  let errors = 0;

  REQUIRED_VARS.forEach((key) => {
    const value = process.env[key] || fileEnv[key];

    if (!value) {
      console.error(`❌ ${key} não definido em variáveis de ambiente ou .env`);
      errors += 1;
      return;
    }

    if (key === "JWT_SECRET" && value.length < 32) {
      console.warn(
        "⚠️ JWT_SECRET muito curto (recomendado mínimo de 32 caracteres)"
      );
    }

    console.log(`✅ ${key} configurado`);
  });

  if (errors > 0) {
    console.error(
      `\n❌ Configuração inválida. Corrija as variáveis acima antes de iniciar em produção.`
    );
    process.exit(1);
  }

  console.log("\n🎉 Configuração básica validada com sucesso!");
}

if (require.main === module) {
  validateConfig();
}

module.exports = { validateConfig };

