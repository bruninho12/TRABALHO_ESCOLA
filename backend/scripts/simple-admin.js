/**
 * Script simples para criar usuário admin
 */

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../src/models/User");
require("dotenv").config();

async function createAdmin() {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/despfinancee"
    );
    console.log("✅ Conectado ao MongoDB");

    // Deletar admin existente
    await User.deleteOne({ email: "admin@despfinancee.com" });
    console.log("🗑️  Admin anterior removido");

    // Criar admin com senha em texto simples (o hook fará o hash)
    const newAdmin = new User({
      username: "admin",
      email: "admin@despfinancee.com",
      fullName: "Administrador",
      password: "admin123!@#", // Texto simples - será hashado pelo hook
      isAdmin: true,
      role: "super_admin",
      isActive: true,
      emailVerified: true,
      subscription: {
        plan: "platinum",
        status: "active",
        validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      },
    });

    await newAdmin.save();
    console.log("✅ Admin criado!");

    // Verificar se funciona
    const admin = await User.findOne({
      email: "admin@despfinancee.com",
    }).select("+password");
    const testPassword = await bcrypt.compare("admin123!@#", admin.password);

    console.log(
      "🧪 Teste de senha:",
      testPassword ? "✅ SUCESSO" : "❌ FALHOU"
    );
    console.log("📧 Email: admin@despfinancee.com");
    console.log("🔐 Senha: admin123!@#");
  } catch (error) {
    console.error("❌ Erro:", error);
  } finally {
    mongoose.connection.close();
  }
}

createAdmin();
