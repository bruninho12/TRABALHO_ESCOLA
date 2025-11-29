/**
 * Script para atualizar ou criar usuário de teste MercadoPago
 * Execute: node backend/scripts/force-update-test-user.js
 */

const mongoose = require("mongoose");
const User = require("../src/models/User");
require("dotenv").config();

async function forceUpdateTestUser() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Conectado ao MongoDB");

    const testEmail = "test_user_92801501@testuser.com";
    const testUsername = "testuser_mp";
    const testPassword = "Teste@123";

    let user = await User.findOne({
      $or: [{ email: testEmail }, { username: testUsername }],
    });

    if (user) {
      user.username = testUsername;
      user.email = testEmail;
      user.password = testPassword;
      user.isVerified = true;
      user.fullName = "Usuário de Teste MercadoPago";
      user.subscription = {
        plan: "bronze",
        status: "active",
        startDate: new Date(),
      };
      await user.save();
      console.log("✅ Usuário de teste atualizado!");
    } else {
      user = new User({
        username: testUsername,
        email: testEmail,
        password: testPassword,
        fullName: "Usuário de Teste MercadoPago",
        isVerified: true,
        subscription: {
          plan: "bronze",
          status: "active",
          startDate: new Date(),
        },
      });
      await user.save();
      console.log("✅ Usuário de teste criado!");
    }

    console.log(`\n📧 Email: ${testEmail}`);
    console.log(`🔑 Senha: ${testPassword}`);
    console.log("\n🌐 Acesse: http://localhost:5173/login");
    process.exit(0);
  } catch (error) {
    console.error("❌ Erro ao atualizar/criar usuário:", error);
    process.exit(1);
  }
}

forceUpdateTestUser();
