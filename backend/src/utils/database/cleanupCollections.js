const mongoose = require("mongoose");
require("dotenv").config();

async function cleanupOldCollections() {
  try {
    console.log("🔌 Conectando ao MongoDB...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Conectado ao MongoDB Atlas\n");

    // Collections que DEVEM permanecer (em português)
    const validCollections = [
      "usuários", // User
      "despesas", // Transaction
      "pagamentos", // Payment
      "cupons", // Category
      "objetivos", // Goal
      "orçamentos", // Budget
      "avatares", // Avatar
      "batalhas", // Battle
      "conquistas", // Achievement
      "recompensas", // Reward
      "mapa_mundo", // WorldMap
    ];

    console.log("🧹 Removendo TODAS as collections para recriação limpa...");
    console.log("════════════════════════════════════════════════════════════");

    // Listar todas as collections
    const allCollections = await mongoose.connection.db
      .listCollections()
      .toArray();

    console.log("\n❌ Removendo collections:");
    for (const col of allCollections) {
      try {
        await mongoose.connection.collection(col.name).drop();
        console.log(`   ✓ ${col.name}`);
      } catch (err) {
        console.log(`   ⚠ ${col.name} - ${err.message}`);
      }
    }

    console.log("\n✅ Todas as collections foram removidas!\n");

    // Agora vamos recriar apenas as válidas
    console.log("📋 Collections que serão usadas:");
    console.log("════════════════════════════════");
    validCollections.forEach((col) => console.log(`   - ${col}`));

    console.log("\n💡 Para popular o banco, execute:");
    console.log("   npm run db:migrate");

    await mongoose.connection.close();
    console.log("\n✅ Limpeza concluída!");
  } catch (err) {
    console.error("❌ Erro:", err.message);
    process.exit(1);
  }
}

module.exports = cleanupOldCollections;
