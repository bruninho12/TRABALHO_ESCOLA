const path = require("path");
const mongoose = require("mongoose");
const { connectDB } = require("../../config/mongoConfig");
const User = require("../../models/User");

async function resetDemoUser() {
  try {
    // Garantir que o .env do backend foi carregado
    // (em scripts diretos, server.js não é executado)
    // eslint-disable-next-line global-require
    require("dotenv").config({ path: path.join(__dirname, "../../../.env") });

    await connectDB();

    const email = process.env.DEMO_USER_EMAIL || "demo@despfinancee.com";
    const password =
      process.env.DEMO_USER_PASSWORD || "senha123";

    let user = await User.findOne({ email });

    if (!user) {
      console.log("ℹ️ Usuário demo não encontrado. Criando novo usuário demo...");
      user = new User({
        email,
        password,
        name: "Demo User",
        isBlocked: false,
        isActive: true,
      });
    } else {
      console.log("ℹ️ Atualizando usuário demo existente...");
      user.password = password;
      user.isBlocked = false;
      user.blockReason = null;
      user.isActive = true;
    }

    await user.save();

    console.log("✅ Usuário demo configurado com sucesso:");
    console.log(`   Email: ${email}`);
    console.log(`   Senha: ${password}`);

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("❌ Erro ao resetar usuário demo:", error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  resetDemoUser();
}

module.exports = { resetDemoUser };

