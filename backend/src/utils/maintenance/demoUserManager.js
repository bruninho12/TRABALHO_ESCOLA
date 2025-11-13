/**
 * @fileoverview Gerenciador do usuário demo para o sistema DespFinancee
 * Este arquivo consolida as funções para criar, verificar e resetar o usuário demo.
 */

require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../../models/User");

const DEMO_EMAIL = "demo@despfinancee.com";
const DEMO_PASSWORD = "senha123";

/**
 * Conecta ao MongoDB usando a URI do arquivo .env
 * @returns {Promise<mongoose.Connection>} Conexão com o MongoDB
 */
async function connectToDB() {
  try {
    const mongoUri = process.env.MONGO_URI;
    console.log("Tentando conectar ao MongoDB...");

    await mongoose.connect(mongoUri);
    console.log("Conectado ao MongoDB com sucesso");
    return mongoose.connection;
  } catch (err) {
    console.error("Erro ao conectar ao MongoDB:", err);
    throw err;
  }
}

/**
 * Verifica se o usuário demo existe
 * @returns {Promise<Object|null>} Objeto do usuário demo ou null
 */
async function checkDemoUser() {
  try {
    const demoUser = await User.findOne({
      email: DEMO_EMAIL,
    }).select("+password");

    if (demoUser) {
      console.log("Usuário demo encontrado:");
      console.log(`ID: ${demoUser._id}`);
      console.log(`Nome: ${demoUser.name}`);
      console.log(`Email: ${demoUser.email}`);
      console.log(`Senha (hash): ${demoUser.password?.substring(0, 10)}...`);
      return demoUser;
    }

    console.log("Usuário demo não encontrado.");
    return null;
  } catch (err) {
    console.error("Erro ao verificar usuário demo:", err);
    throw err;
  }
}

/**
 * Cria um novo usuário demo
 * @returns {Promise<Object>} Objeto do usuário demo criado
 */
async function createDemoUser() {
  try {
    console.log("Criando usuário demo...");

    // Gerar hash da senha
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(DEMO_PASSWORD, salt);

    // Criar usuário demo
    const newUser = await User.create({
      name: "Usuário Demo",
      email: DEMO_EMAIL,
      password: hashedPassword,
      isActive: true,
      isVerified: true,
      settings: {
        theme: "light",
        notificationsEnabled: true,
        showCents: true,
        currency: "BRL",
        language: "pt-BR",
        dateFormat: "DD/MM/YYYY",
      },
    });

    console.log("Usuário demo criado com sucesso:", newUser.email);
    return newUser;
  } catch (err) {
    console.error("Erro ao criar usuário demo:", err);
    throw err;
  }
}

/**
 * Reseta a senha do usuário demo para o valor padrão
 * @param {Object} demoUser Objeto do usuário demo
 * @returns {Promise<boolean>} True se a senha foi resetada com sucesso
 */
async function resetDemoPassword(demoUser) {
  try {
    console.log("Verificando senha do usuário demo...");

    // Testar senha
    const senhaCorreta = await bcrypt.compare(DEMO_PASSWORD, demoUser.password);
    console.log(`Senha "${DEMO_PASSWORD}" é válida? ${senhaCorreta}`);

    // Se a senha estiver incorreta, atualizar
    if (!senhaCorreta) {
      console.log("Senha incorreta, atualizando...");

      // Gerar novo hash
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(DEMO_PASSWORD, salt);

      // Atualizar usuário
      demoUser.password = hashedPassword;
      await demoUser.save();

      console.log(`Senha atualizada para '${DEMO_PASSWORD}'`);

      // Verificar novamente
      const novoCheck = await bcrypt.compare(DEMO_PASSWORD, demoUser.password);
      console.log(
        `Verificação após atualização - Senha "${DEMO_PASSWORD}" é válida? ${novoCheck}`
      );

      return true;
    }

    console.log("Senha do usuário demo já está correta.");
    return false;
  } catch (err) {
    console.error("Erro ao resetar senha do usuário demo:", err);
    throw err;
  }
}

/**
 * Gerencia o usuário demo: verifica se existe, cria se necessário, e reseta a senha
 */
async function manageDemoUser() {
  let connection;

  try {
    // Conectar ao MongoDB
    connection = await connectToDB();

    // Verificar usuário demo
    let demoUser = await checkDemoUser();

    // Se não existir, criar
    if (!demoUser) {
      demoUser = await createDemoUser();
    }
    // Se existir, resetar a senha se necessário
    else {
      await resetDemoPassword(demoUser);
    }

    console.log("Gerenciamento do usuário demo concluído com sucesso.");
  } catch (err) {
    console.error("Erro no gerenciamento do usuário demo:", err);
  } finally {
    // Fechar conexão
    if (connection) {
      await mongoose.disconnect();
      console.log("Conexão com o MongoDB encerrada.");
    }
  }
}

// Se executado diretamente
if (require.main === module) {
  manageDemoUser()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error("Erro fatal:", err);
      process.exit(1);
    });
}

// Exportar funções para uso em outros módulos
module.exports = {
  checkDemoUser,
  createDemoUser,
  resetDemoPassword,
  manageDemoUser,
};

