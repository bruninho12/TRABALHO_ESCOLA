/**
 * Script para criar índices otimizados no MongoDB
 * Melhora performance das queries mais frequentes
 */

const mongoose = require("mongoose");
require("../../src/config/database");

async function createOptimizedIndexes() {
  try {
    console.log("🚀 Criando índices otimizados...");

    // Aguardar conexão
    await new Promise((resolve) => {
      if (mongoose.connection.readyState === 1) {
        resolve();
      } else {
        mongoose.connection.once("open", resolve);
      }
    });

    // Avatar indexes
    const Avatar = require("../../src/models/Avatar");
    console.log("📊 Criando índices para Avatar...");
    await Avatar.collection.createIndex({ userId: 1 }, { unique: true });
    await Avatar.collection.createIndex({ level: -1 }); // Para rankings
    await Avatar.collection.createIndex({ "stats.totalExperience": -1 }); // Para leaderboards

    // Battle indexes
    const Battle = require("../../src/models/Battle");
    console.log("📊 Criando índices para Battle...");
    await Battle.collection.createIndex({ userId: 1, createdAt: -1 }); // Histórico de batalhas
    await Battle.collection.createIndex({ result: 1, createdAt: -1 }); // Filtrar por resultado
    await Battle.collection.createIndex({ avatarId: 1 }); // Buscar por avatar

    // WorldMap indexes
    const WorldMap = require("../../src/models/WorldMap");
    console.log("📊 Criando índices para WorldMap...");
    await WorldMap.collection.createIndex({ cityNumber: 1 }, { unique: true });
    await WorldMap.collection.createIndex({ levelRequirement: 1 }); // Filtrar por nível
    await WorldMap.collection.createIndex({ difficulty: 1 }); // Filtrar por dificuldade

    // Achievement indexes
    const Achievement = require("../../src/models/Achievement");
    console.log("📊 Criando índices para Achievement...");
    await Achievement.collection.createIndex({ type: 1, category: 1 }); // Buscar por tipo/categoria
    await Achievement.collection.createIndex({ isActive: 1 }); // Apenas ativos

    // User indexes (se ainda não existirem)
    const User = require("../../src/models/User");
    console.log("📊 Verificando índices para User...");
    await User.collection.createIndex({ email: 1 }, { unique: true });
    await User.collection.createIndex({ isEmailVerified: 1 }); // Filtrar verificados

    // Transaction indexes para integração RPG
    const Transaction = require("../../src/models/Transaction");
    console.log("📊 Criando índices para Transaction...");
    await Transaction.collection.createIndex({ userId: 1, date: -1 }); // Histórico por usuário
    await Transaction.collection.createIndex({ userId: 1, type: 1 }); // Filtrar por tipo
    await Transaction.collection.createIndex({ category: 1 }); // Popular categorias

    console.log("✅ Todos os índices foram criados com sucesso!");
    console.log("🎯 Performance das queries foi otimizada.");

    // Mostrar estatísticas
    const collections = [
      { name: "Avatar", model: Avatar },
      { name: "Battle", model: Battle },
      { name: "WorldMap", model: WorldMap },
      { name: "Achievement", model: Achievement },
      { name: "User", model: User },
      { name: "Transaction", model: Transaction },
    ];

    console.log("\n📈 Estatísticas dos índices:");
    for (const { name, model } of collections) {
      try {
        const indexes = await model.collection.listIndexes().toArray();
        console.log(`${name}: ${indexes.length} índices`);
      } catch (error) {
        console.log(`${name}: Erro ao listar índices`);
      }
    }
  } catch (error) {
    console.error("❌ Erro ao criar índices:", error.message);
  } finally {
    mongoose.connection.close();
  }
}

// Executar script
createOptimizedIndexes();
