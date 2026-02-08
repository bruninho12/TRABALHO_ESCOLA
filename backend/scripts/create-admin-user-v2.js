/**
 * Script para corrigir a senha do usuário admin - versão com debug
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

    // Deletar usuário admin existente
    await User.deleteOne({ email: "admin@despfinancee.com" });
    console.log("🗑️  Usuário admin anterior removido");

    // Criar nova senha hashada
    const newPassword = "admin123!@#";
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    console.log("🔐 Nova senha hashada criada");
    console.log("- Hash length:", hashedPassword.length);
    console.log("- Hash preview:", hashedPassword.substring(0, 20) + "...");

    // Criar novo usuário admin
    const newAdmin = new User({
      username: "admin",
      email: "admin@despfinancee.com",
      fullName: "Administrador do Sistema",
      password: hashedPassword,
      isAdmin: true,
      role: "super_admin",
      isActive: true,
      emailVerified: true,
      subscription: {
        plan: "platinum",
        status: "active",
        validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 ano
      },
      profile: {
        financialGoals: ["Controle total das finanças"],
        riskTolerance: "alto",
        investmentExperience: "avancado",
      },
      gameStats: {
        level: 100,
        experience: 50000,
        gold: 10000,
        avatar: {
          body: "warrior",
          weapon: "legendary_sword",
          armor: "platinum_armor",
          accessory: "admin_crown",
        },
      },
      adminNotes: "Usuário administrador criado automaticamente pelo script.",
      lastAdminAction: {
        action: "account_created",
        performedBy: null,
        date: new Date(),
        details: "Conta administrativa criada via script",
      },
    });

    const savedAdmin = await newAdmin.save();
    console.log("✅ Novo usuário admin criado com sucesso!");

    // Buscar do banco para verificar
    const adminFromDB = await User.findOne({
      email: "admin@despfinancee.com",
    }).select("+password");

    console.log("🔍 Verificando usuário criado:");
    console.log("- Email:", adminFromDB.email);
    console.log("- Username:", adminFromDB.username);
    console.log("- Password existe:", !!adminFromDB.password);
    console.log(
      "- Password length:",
      adminFromDB.password ? adminFromDB.password.length : "N/A"
    );
    console.log("- isAdmin:", adminFromDB.isAdmin);
    console.log("- role:", adminFromDB.role);

    // Testar se a senha funciona
    console.log("🧪 Testando senha...");
    const testPassword = await bcrypt.compare(
      newPassword,
      adminFromDB.password
    );
    console.log(
      "- Resultado:",
      testPassword ? "✅ SENHA FUNCIONA" : "❌ SENHA FALHOU"
    );

    if (testPassword) {
      console.log("🎉 Login admin está pronto para uso!");
      console.log("📧 Email: admin@despfinancee.com");
      console.log("🔐 Senha: admin123!@#");
      console.log("");
      console.log("🚀 Agora você pode:");
      console.log("1. Fazer login no frontend");
      console.log("2. Acessar /dashboard/admin");
      console.log("3. Usar o painel administrativo");
    } else {
      console.log("❌ Algo deu errado com a criação da senha");
    }
  } catch (error) {
    console.error("❌ Erro:", error);
  } finally {
    mongoose.connection.close();
    process.exit(0);
  }
}

fixAdminPassword();
