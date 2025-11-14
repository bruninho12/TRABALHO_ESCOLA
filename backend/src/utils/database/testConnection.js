const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

async function testConnection() {
  try {
    const envPath = path.join(__dirname, "../../../.env");
    const envContent = fs.readFileSync(envPath, "utf-8");
    const mongoLine = envContent
      .split("\n")
      .find((l) => l.startsWith("MONGO_URI="));
    const mongoUri = mongoLine.replace("MONGO_URI=", "").trim();

    console.log("🔌 Conectando a:", mongoUri.split("/")[3]);

    const conn = await mongoose.connect(mongoUri);
    console.log("\n✅ Conectado!");

    // Listar collections
    const collections = await conn.connection.db.listCollections().toArray();
    console.log("\n📋 Collections encontradas:");
    collections.forEach((c, i) => {
      console.log(`${i + 1}. ${c.name}`);
    });

    // Contar cada uma
    console.log("\n📊 Documentos em cada collection:");
    for (const col of collections) {
      const count = await conn.connection.collection(col.name).countDocuments();
      console.log(`   ${col.name}: ${count}`);
    }

    mongoose.connection.close();
  } catch (err) {
    console.error("❌ Erro:", err.message);
  }
}

module.exports = testConnection;
