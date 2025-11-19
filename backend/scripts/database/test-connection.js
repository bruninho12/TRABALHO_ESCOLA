const mongoose = require("mongoose");
require("dotenv").config({
  path: require("path").join(__dirname, "../..", ".env"),
});

const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;

console.log("Conectando a:", mongoUri?.replace(/:([^@]+)@/, ":***@"));

mongoose
  .connect(mongoUri)
  .then(async (conn) => {
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
  })
  .catch((err) => {
    console.error("❌ Erro:", err.message);
  });
