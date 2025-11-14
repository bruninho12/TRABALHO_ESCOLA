/**
 * Script para migrar/popular o banco de dados com as collections que estão faltando
 * Executa: npm run db:migrate
 */

const fs = require("fs");
const path = require("path");

// Forçar leitura do .env sem cache do Node
const envPath = path.join(__dirname, "..", ".env");
const envContent = fs.readFileSync(envPath, "utf-8");
const mongoLine = envContent
  .split("\n")
  .find((line) => line.startsWith("MONGO_URI="));
const mongoUri = mongoLine.replace("MONGO_URI=", "").trim();

const mongoose = require("mongoose");
const logger = require("../src/utils/logger");

// Importar modelos
const { WorldMap } = require("../src/models");

const { CITIES_TEMPLATES } = require("../src/models/WorldMap");

async function migrateDatabase() {
  try {
    // Conectar ao MongoDB
    await mongoose.connect(mongoUri);
    logger.info("✅ Conectado ao MongoDB");
    logger.info(`   Database: ${mongoUri.split("/")[3].split("?")[0]}`);

    // 1. Criar cidades do mapa-mundo
    logger.info("📍 Criando cidades do mapa-mundo...");
    for (const [cityNum, cityData] of Object.entries(CITIES_TEMPLATES)) {
      try {
        await WorldMap.findOneAndUpdate(
          { cityNumber: parseInt(cityNum) },
          cityData,
          { upsert: true, new: true }
        );
        logger.info(
          `   ✓ Cidade ${cityNum} criada/atualizada: ${cityData.name}`
        );
      } catch (err) {
        logger.warn(`   ⚠ Erro ao criar cidade ${cityNum}: ${err.message}`);
      }
    }

    // 2. Contar documentos em cada collection
    logger.info("\n📊 Status das collections:");
    const collections = {
      usuários: "User",
      despesas: "Transaction",
      pagamentos: "Payment",
      cupons: "Category",
      objetivos: "Goal",
      orçamentos: "Budget",
      avatares: "Avatar",
      batalhas: "Battle",
      conquistas: "Achievement",
      recompensas: "Reward",
      mapa_mundo: "WorldMap",
    };

    for (const [collectionName] of Object.entries(collections)) {
      try {
        const count = await mongoose.connection
          .collection(collectionName)
          .countDocuments();
        logger.info(`   ${collectionName}: ${count} documentos`);
      } catch (err) {
        logger.warn(
          `   ⚠ Erro ao contar documentos em ${collectionName}: ${err.message}`
        );
      }
    }

    logger.info("\n✅ Migração concluída com sucesso!");
    logger.info("\n📋 Próximos passos:");
    logger.info("   1. Verificar dados no MongoDB Atlas");
    logger.info("   2. Testar endpoints da API");
    logger.info("   3. Criar usuários de teste se necessário");

    process.exit(0);
  } catch (err) {
    logger.error("❌ Erro durante migração:", err);
    process.exit(1);
  }
}

// Executar migração
migrateDatabase();
