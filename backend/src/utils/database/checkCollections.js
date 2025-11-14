const mongoose = require("mongoose");
require("dotenv").config();

async function checkCollections() {
  try {
    console.log("🔌 Conectando ao MongoDB...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Conectado ao MongoDB Atlas\n");

    // Listar todas as collections
    const collections = await mongoose.connection.db
      .listCollections()
      .toArray();

    console.log("📋 Collections no banco de dados:");
    console.log("════════════════════════════════");
    collections.forEach((col, index) => {
      console.log(`${index + 1}. ${col.name}`);
    });

    console.log("\n📊 Total:", collections.length, "collections\n");

    // Contar documentos em cada collection
    console.log("📈 Documentos por collection:");
    console.log("════════════════════════════════");
    for (const col of collections) {
      const count = await mongoose.connection
        .collection(col.name)
        .countDocuments();
      console.log(`${col.name}: ${count} documentos`);
    }

    await mongoose.connection.close();
    console.log("\n✅ Desconectado");
  } catch (err) {
    console.error("❌ Erro:", err.message);
    process.exit(1);
  }
}

module.exports = checkCollections;
