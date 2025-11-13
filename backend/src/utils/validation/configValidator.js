/**
 * @fileoverview Verificador de configurações de ambiente para o sistema DespFinancee
 * Este arquivo contém utilitários para verificar e validar configurações do ambiente
 */

require("dotenv").config();

/**
 * Verifica as configurações críticas do ambiente
 * @returns {Object} Resultado da verificação com status e mensagens
 */
function checkEnvironmentConfig() {
  const results = {
    success: true,
    warnings: [],
    criticalIssues: [],
    config: {},
  };

  // Verificar variáveis de ambiente obrigatórias
  const requiredVars = ["MONGO_URI", "JWT_SECRET", "PORT"];

  // Verificar variáveis de ambiente opcionais com defaults
  const optionalVars = {
    NODE_ENV: "development",
    JWT_EXPIRES_IN: "7d",
    JWT_REFRESH_EXPIRES_IN: "30d",
    CORS_ORIGIN: "*",
  };

  // Verificar as variáveis obrigatórias
  for (const varName of requiredVars) {
    if (!process.env[varName]) {
      results.criticalIssues.push(
        `${varName} não está definido no arquivo .env`
      );
      results.success = false;
    } else {
      results.config[varName] =
        varName === "JWT_SECRET" ? "***" : process.env[varName];
    }
  }

  // Verificar as variáveis opcionais
  for (const [varName, defaultValue] of Object.entries(optionalVars)) {
    const value = process.env[varName] || defaultValue;
    results.config[varName] = value;

    if (!process.env[varName]) {
      results.warnings.push(
        `${varName} não está definido, usando valor padrão: ${defaultValue}`
      );
    }
  }

  // Verificações adicionais específicas

  // Verificar configuração de CORS
  if (!process.env.CORS_ORIGIN) {
    results.warnings.push(
      "CORS_ORIGIN não está definido. Usando '*' (permite todas as origens)."
    );
  } else {
    if (
      process.env.NODE_ENV === "production" &&
      process.env.CORS_ORIGIN === "*"
    ) {
      results.warnings.push(
        "CORS_ORIGIN está configurado para aceitar todas as origens ('*') em ambiente de produção."
      );
    }

    if (
      process.env.CORS_ORIGIN !== "http://127.0.0.1:5500" &&
      process.env.CORS_ORIGIN !== "http://localhost:5500" &&
      !process.env.CORS_ORIGIN.includes("*")
    ) {
      results.warnings.push(
        `CORS_ORIGIN (${process.env.CORS_ORIGIN}) pode não corresponder à origem do frontend (localhost:5500 ou 127.0.0.1:5500).`
      );
    }
  }

  // Verificar variáveis de conexão do MongoDB
  if (process.env.MONGO_URI) {
    const isAtlasConnection = process.env.MONGO_URI.includes("mongodb+srv://");
    results.config.DB_TYPE = isAtlasConnection
      ? "MongoDB Atlas"
      : "MongoDB Local";

    if (process.env.NODE_ENV === "production" && !isAtlasConnection) {
      results.warnings.push(
        "Em produção, é recomendável usar MongoDB Atlas em vez de uma instância local."
      );
    }
  }

  return results;
}

/**
 * Imprime um relatório de configuração do ambiente
 */
function printConfigReport() {
  console.log("===== RELATÓRIO DE CONFIGURAÇÃO DO AMBIENTE =====");

  const results = checkEnvironmentConfig();

  // Imprimir configurações
  console.log("\nConfigurações do ambiente:");
  console.log("-------------------------");
  for (const [key, value] of Object.entries(results.config)) {
    console.log(`${key}: ${value}`);
  }

  // Imprimir avisos
  if (results.warnings.length > 0) {
    console.log("\nAvisos:");
    console.log("-------------------------");
    results.warnings.forEach((warning, index) => {
      console.log(`⚠️ ${index + 1}. ${warning}`);
    });
  }

  // Imprimir problemas críticos
  if (results.criticalIssues.length > 0) {
    console.log("\nProblemas críticos:");
    console.log("-------------------------");
    results.criticalIssues.forEach((issue, index) => {
      console.log(`❌ ${index + 1}. ${issue}`);
    });
  }

  // Imprimir resultado final
  console.log("\n=== Resultado da verificação ===");
  if (results.success) {
    console.log("✅ Todas as configurações críticas estão presentes.");
    if (results.warnings.length > 0) {
      console.log(`⚠️ ${results.warnings.length} avisos encontrados.`);
    }
  } else {
    console.log(
      `❌ Configuração incompleta: ${results.criticalIssues.length} problemas críticos.`
    );
  }

  return results;
}

// Se executado diretamente
if (require.main === module) {
  const results = printConfigReport();
  process.exit(results.success ? 0 : 1);
}

// Exportar funções para uso em outros módulos
module.exports = {
  checkEnvironmentConfig,
  printConfigReport,
};
