/**
 * Teste de credenciais no banco - verificar usuários existentes
 */

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", "..", ".env") });

const User = require("../src/models/User");

const testCredentials = async () => {
  try {
    console.log("🧪 Conectando ao MongoDB...");
    const mongoUri =
      "mongodb+srv://despfinance:despfinancee00@cluster0.eksania.mongodb.net/despfinancee?retryWrites=true&w=majority&appName=Cluster0";
    console.log("🔗 URI:", mongoUri.replace(/\/\/.*@/, "//*****@"));
    await mongoose.connect(mongoUri);
    console.log("✅ Conectado ao MongoDB\n");

    // Listar todos os usuários
    const users = await User.find(
      {},
      "email username fullName password"
    ).lean();
    console.log(`👥 Usuários encontrados: ${users.length}`);

    for (const user of users) {
      console.log(`📧 Email: ${user.email}`);
      console.log(`👤 Username: ${user.username}`);
      console.log(`📛 Nome: ${user.fullName}`);
      console.log(`🔑 Hash senha: ${user.password.substring(0, 20)}...`);
      console.log("---");
    }

    console.log("\n🔍 Testando credenciais específicas...");

    const testCreds = [
      { email: "bruno@despfinance.com", password: "admin123" },
      { email: "bruno@despfinance.com", password: "Senha@123456" },
      { email: "admin@despfinance.com", password: "admin123" },
      { email: "admin@despfinance.com", password: "Senha@123456" },
    ];

    for (const cred of testCreds) {
      console.log(`\n🧪 Testando ${cred.email} com senha: ${cred.password}`);

      const user = await User.findOne({
        email: cred.email.toLowerCase(),
      }).select("+password");
      if (!user) {
        console.log("❌ Usuário não encontrado");
        continue;
      }

      if (!user.password) {
        console.log("❌ Campo password não encontrado no usuário");
        console.log("🔍 Campos disponíveis:", Object.keys(user.toObject()));
        continue;
      }

      console.log(`🔍 Hash encontrado: ${user.password.substring(0, 20)}...`);
      const isValid = await bcrypt.compare(cred.password, user.password);
      console.log(
        `${isValid ? "✅" : "❌"} Senha ${isValid ? "válida" : "inválida"}`
      );
    }

    console.log("\n✅ Teste concluído!");
  } catch (error) {
    console.error("💥 Erro:", error.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

testCredentials();
