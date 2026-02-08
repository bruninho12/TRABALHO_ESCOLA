/**
 * Script para criar usuário Premium corretamente
 */

const mongoose = require("mongoose");
const User = require("../src/models/User");
require("dotenv").config();

async function createTestUser() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Conectado ao MongoDB");

    const testEmail = "souzacostabruno008@gmail.com";

    let user = await User.findOne({ email: testEmail });

    if (user) {
      console.log("⚠️ Usuário já existe, convertendo para PREMIUM...");
    } else {
      user = new User({
        username: "Bruno Souza",
        email: testEmail,
        password: "Bruninho007@",
        fullName: "Bruno Souza",
        emailVerified: true,
      });
      await user.save();
    }

    // ATIVAÇÃO PREMIUM CORRETA
    await user.activatePremium({
      plan: "gold",
      status: "active",
      currentPeriodStart: new Date(),
      currentPeriodEnd: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 dias premium
    });

    console.log("\n🎉 Usuário Premium criado/atualizado com sucesso!");
    console.log("📧 Email:", testEmail);
    console.log("🔑 Senha: Bruninho007@");
    console.log("💎 Plano:", user.subscription.plan);
    console.log("📅 Expira em:", user.subscription.currentPeriodEnd);

    process.exit(0);
  } catch (error) {
    console.error("❌ Erro:", error);
    process.exit(1);
  }
}

createTestUser();
