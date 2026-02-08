/**
 * Script para corrigir a senha do usuário admin
 */

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../src/models/User");
require("dotenv").config();

async function fixAdminPassword() {
  try {
    // Conectar ao MongoDB
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/despfinancee"
    );
    console.log("✅ Conectado ao MongoDB");

    // Buscar usuário admin (incluindo password)
    const admin = await User.findOne({
      email: "admin@despfinancee.com",
    }).select("+password");

    if (!admin) {
      console.log("❌ Usuário admin não encontrado");
      process.exit(1);
    }

    console.log("🔍 Usuário admin encontrado:");
    console.log("- Email:", admin.email);
    console.log("- Username:", admin.username);
    console.log("- Password existe:", !!admin.password);
    console.log(
      "- Password length:",
      admin.password ? admin.password.length : "N/A"
    );

    // Criar nova senha hashada
    const newPassword = "admin123!@#";
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    console.log("🔐 Nova senha hashada criada");
    console.log("- Hash length:", hashedPassword.length);

    // Atualizar senha no banco
    admin.password = hashedPassword;
    await admin.save();

    console.log("✅ Senha do admin atualizada com sucesso!");

    // Testar se a senha funciona
    const testPassword = await bcrypt.compare(newPassword, admin.password);
    console.log(
      "🧪 Teste de verificação de senha:",
      testPassword ? "✅ PASSOU" : "❌ FALHOU"
    );

    if (testPassword) {
      console.log("🎉 Login admin está pronto para uso!");
      console.log("📧 Email: admin@despfinancee.com");
      console.log("🔐 Senha: admin123!@#");
    }
  } catch (error) {
    console.error("❌ Erro:", error);
  } finally {
    mongoose.connection.close();
    process.exit(0);
  }
}

fixAdminPassword();
