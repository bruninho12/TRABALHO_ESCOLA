const mongoose = require("mongoose");
const fs = require("fs");

// Forçar leitura do .env
const envPath = require("path").join(__dirname, ".env");
const envContent = fs.readFileSync(envPath, "utf-8");
const mongoLine = envContent
  .split("\n")
  .find((line) => line.startsWith("MONGO_URI="));
const mongoUri = mongoLine.replace("MONGO_URI=", "").trim();

console.log("🔌 Conectando com database:", mongoUri.split("/")[3]);

async function verify() {
  try {
    const conn = await mongoose.connect(mongoUri);

    const collections = await conn.connection.db.listCollections().toArray();
    console.log("✅ Collections encontradas:", collections.length);
    collections.forEach((c) => console.log(`   - ${c.name}`));

    // Contar mapa_mundo
    const count = await conn.connection
      .collection("mapa_mundo")
      .countDocuments();
    console.log(`\n✅ mapa_mundo tem ${count} documentos`);

    await mongoose.connection.close();
  } catch (err) {
    console.error("❌ Erro:", err.message);
  }
}

verify();
