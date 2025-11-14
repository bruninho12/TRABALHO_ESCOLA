const mongoose = require("mongoose");
require("dotenv").config();

async function checkDatabases() {
  try {
    console.log("🔌 Conectando ao MongoDB...");
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Conectado!\n");

    // Listar databases
    const admin = conn.connection.db.admin();
    const databases = await admin.listDatabases();

    console.log("📊 Databases encontrados:");
    console.log("════════════════════════════════");
    databases.databases.forEach((db) => {
      console.log(`  - ${db.name} (${db.sizeOnDisk} bytes)`);
    });

    // Mostrar database atual
    console.log(`\n📍 Database atual: ${conn.connection.db.name}`);

    // Listar collections do database atual
    console.log("\n📋 Collections no database atual:");
    console.log("════════════════════════════════");
    const collections = await conn.connection.db.listCollections().toArray();
    if (collections.length === 0) {
      console.log("  ⚠️  Nenhuma collection encontrada");
    } else {
      collections.forEach((col) => console.log(`  - ${col.name}`));
    }

    await mongoose.connection.close();
    console.log("\n✅ Desconectado");
  } catch (err) {
    console.error("❌ Erro:", err.message);
    process.exit(1);
  }
}

module.exports = checkDatabases;
