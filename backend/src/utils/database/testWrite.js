const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

async function testWrite() {
  try {
    const envPath = path.join(__dirname, "../../../.env");
    const envContent = fs.readFileSync(envPath, "utf-8");
    const mongoLine = envContent
      .split("\n")
      .find((l) => l.startsWith("MONGO_URI="));
    const mongoUri = mongoLine.replace("MONGO_URI=", "").trim();

    console.log("🔌 Conectando ao MongoDB...");
    console.log("   URI:", mongoUri.split("/")[3]);

    const conn = await mongoose.connect(mongoUri);
    console.log("✅ Conectado!\n");

    // Importar User model
    const User = require("../../models/User");

    // Criar um usuário de teste
    const testUser = new User({
      email: `teste_${Date.now()}@test.com`,
      username: `usuario_${Date.now()}`,
      password: "Senha@12345",
      fullName: "Usuário Teste",
    });

    console.log("📝 Criando usuário...");
    const savedUser = await testUser.save();
    console.log("✅ Usuário criado com sucesso!");
    console.log("   ID:", savedUser._id);
    console.log("   Email:", savedUser.email);
    console.log("   Username:", savedUser.username);

    // Verificar se foi salvo
    const count = await User.countDocuments();
    console.log("\n📊 Total de usuários no banco:", count);

    // Listar collections
    const collections = await conn.connection.db.listCollections().toArray();
    console.log("\n📋 Collections no banco:");
    for (const col of collections) {
      const docCount = await conn.connection
        .collection(col.name)
        .countDocuments();
      console.log(`   ${col.name}: ${docCount} documentos`);
    }

    await mongoose.connection.close();
    console.log("\n✅ Teste concluído!");
  } catch (err) {
    console.error("❌ Erro:", err.message);
    process.exit(1);
  }
}

module.exports = testWrite;
