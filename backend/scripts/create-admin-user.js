/**
 * Script para criar um usuário admin temporário
 */

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

// Importar o modelo de usuário
const User = require("../src/models/User");

// Conectar ao MongoDB
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/despfinancee")
  .then(() => console.log("✅ Conectado ao MongoDB"))
  .catch((error) => {
    console.error("❌ Erro ao conectar ao MongoDB:", error);
    process.exit(1);
  });

async function createAdminUser() {
  try {
    // Verificar se já existe um admin
    const existingAdmin = await User.findOne({
      $or: [{ email: "admin@despfinancee.com" }, { username: "admin" }],
    });

    if (existingAdmin) {
      console.log("ℹ️  Usuário admin já existe:", existingAdmin.email);

      // Atualizar para garantir que seja admin
      existingAdmin.isAdmin = true;
      existingAdmin.role = "super_admin";
      existingAdmin.isActive = true;
      existingAdmin.emailVerified = true;
      await existingAdmin.save();

      console.log("✅ Usuário existente atualizado para super admin");
      return existingAdmin;
    }

    // Hash da senha
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash("admin123!@#", saltRounds);

    // Criar novo usuário admin
    const adminUser = new User({
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
      adminNotes:
        "Usuário administrador criado automaticamente pelo script de setup.",
      lastAdminAction: {
        action: "account_created",
        performedBy: null,
        date: new Date(),
        details: "Conta administrativa criada via script",
      },
    });

    const savedAdmin = await adminUser.save();
    console.log("✅ Usuário admin criado com sucesso!");
    console.log(`📧 Email: ${savedAdmin.email}`);
    console.log(`🔐 Senha: admin123!@#`);
    console.log(`👤 Username: ${savedAdmin.username}`);
    console.log(`🎖️  Nível admin: ${savedAdmin.role}`);

    return savedAdmin;
  } catch (error) {
    console.error("❌ Erro ao criar usuário admin:", error);
    throw error;
  }
}

// Função para listar todos os admins
async function listAdmins() {
  try {
    const admins = await User.find({
      $or: [{ isAdmin: true }, { role: { $in: ["admin", "super_admin"] } }],
    }).select("username email role isAdmin isActive");

    console.log("\n📋 Lista de administradores:");
    if (admins.length === 0) {
      console.log("   Nenhum administrador encontrado");
    } else {
      admins.forEach((admin, index) => {
        console.log(
          `   ${index + 1}. ${admin.username} (${admin.email}) - ${
            admin.role
          } - ${admin.isActive ? "Ativo" : "Inativo"}`
        );
      });
    }
  } catch (error) {
    console.error("❌ Erro ao listar admins:", error);
  }
}

// Executar o script
async function main() {
  try {
    console.log("🚀 Iniciando script de criação de admin...\n");

    await createAdminUser();
    await listAdmins();

    console.log("\n✅ Script executado com sucesso!");
    console.log("\n📝 Instruções:");
    console.log("   1. Acesse /login no frontend");
    console.log("   2. Use: admin@despfinancee.com / admin123!@#");
    console.log("   3. Após o login, acesse /dashboard/admin");
    console.log("   4. ⚠️  ALTERE A SENHA após o primeiro login!");
  } catch (error) {
    console.error("\n❌ Erro no script:", error);
  } finally {
    mongoose.connection.close();
    process.exit(0);
  }
}

main();
