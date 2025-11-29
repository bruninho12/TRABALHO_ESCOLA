/**
 * Script para criar usuário de teste rápido
 */

const mongoose = require("mongoose");
const User = require("../src/models/User");
require("dotenv").config();

async function createTestUser() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Conectado ao MongoDB");

    // E-mail de teste do MercadoPago (não precisa de verificação real)
    const testEmail = "test_user_92801501@testuser.com";

    // Verificar se usuário já existe
    const existingUser = await User.findOne({
      email: testEmail,
    });

    if (existingUser) {
      console.log("✅ Usuário de teste já existe!");
      console.log(`\n📧 Email: ${testEmail}`);
      console.log("🔑 Senha: Teste@123");
      console.log("\n🌐 Acesse: http://localhost:5173/login");
      console.log("\n💡 Este é um e-mail de teste do MercadoPago");
      console.log(
        "   Códigos de verificação funcionam automaticamente no sandbox"
      );
      process.exit(0);
    }

    // Criar novo usuário
    const testUser = new User({
      username: "testuser_mp",
      email: testEmail,
      password: "Teste@123",
      fullName: "Test User",
      isVerified: true,
      subscription: {
        plan: "bronze",
        status: "active",
        startDate: new Date(),
      },
    });

    await testUser.save();

    console.log("✅ Usuário de teste criado com sucesso!");
    console.log(`\n📧 Email: ${testEmail}`);
    console.log("🔑 Senha: Teste@123");
    console.log("\n🌐 Acesse: http://localhost:5173/login");
    console.log("\n💡 Este é um e-mail de teste do MercadoPago");
    console.log(
      "   Códigos de verificação funcionam automaticamente no sandbox"
    );

    process.exit(0);
  } catch (error) {
    console.error("❌ Erro:", error.message);
    process.exit(1);
  }
}

createTestUser();
