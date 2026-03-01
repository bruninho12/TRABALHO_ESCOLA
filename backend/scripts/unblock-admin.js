const mongoose = require("mongoose");
const path = require("path");

// Carrega variáveis de ambiente
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const User = require("../src/models/User");

async function unblockAdmin() {
  try {
    // Conectar ao MongoDB
    const uri = process.env.MONGO_URI || process.env.MONGODB_URI;
    if (!uri) {
      console.error("❌ MONGO_URI/MONGODB_URI não definido nas variáveis de ambiente");
      process.exit(1);
    }

    await mongoose.connect(uri);
    console.log("✅ Conectado ao MongoDB");

    // Buscar o usuário admin
    const admin = await User.findOne({ email: "admin@despfinancee.com" });

    if (!admin) {
      console.log("❌ Usuário admin não encontrado");
      process.exit(1);
    }

    console.log("👤 Usuário encontrado:", {
      id: admin._id,
      email: admin.email,
      username: admin.username,
      isBlocked: admin.isBlocked,
      blockReason: admin.blockReason,
    });

    // Desbloquear o usuário
    admin.isBlocked = false;
    admin.blockReason = null;
    admin.isActive = true;

    await admin.save();

    console.log("✅ Usuário admin desbloqueado com sucesso!");
    console.log("📊 Estado atualizado:", {
      isBlocked: admin.isBlocked,
      isActive: admin.isActive,
    });

    process.exit(0);
  } catch (error) {
    console.error("❌ Erro ao desbloquear admin:", error.message);
    process.exit(1);
  }
}

unblockAdmin();
