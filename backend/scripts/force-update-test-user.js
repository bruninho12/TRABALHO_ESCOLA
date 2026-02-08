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

    const testEmail = "souzacostabruno008@gmail.com";
    const testUsername = "Bruno Souza";
    const testPassword = "Bruninho007@";

    let user = await User.findOne({
      $or: [{ email: testEmail }, { username: testUsername }],
    });

    if (user) {
      user.username = testUsername;
      user.email = testEmail;
      user.password = testPassword;
      user.isVerified = true;
      user.fullName = "Bruno Souza";
      user.subscription = {
        plan: "gold",
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
        fullName: "Bruno Souza",
        isVerified: true,
        subscription: {
          plan: "gold",
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
