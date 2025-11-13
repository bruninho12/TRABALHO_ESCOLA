const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const { connectDB } = require("../config/mongoConfig");
const User = require("../models/User");
const Category = require("../models/Category");
const Transaction = require("../models/Transaction");
const Budget = require("../models/Budget");
const logger = require("../utils/logger");

// Importar dados de exemplo
const { getTransactionData } = require("./data/transactionData");
const { getBudgetData } = require("./data/budgetData");
const { getNotificationData } = require("./data/notificationData");

// Carregar variáveis de ambiente
dotenv.config();

// Função para seed de usuário demo
const seedDemoUser = async () => {
  logger.info("Criando usuário demo...");

  // Verificar se o usuário demo já existe
  const existingUser = await User.findOne({ email: "demo@despfinancee.com" });

  if (existingUser) {
    logger.info("✓ Usuário demo já existe. Pulando criação...");
    return existingUser;
  }

  // Hash da senha diretamente para evitar middleware
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash("senha123", salt);

  const demoUser = await User.create({
    name: "Usuário Demo",
    email: "demo@despfinancee.com",
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

  logger.success("Usuário demo criado com sucesso!", {
    id: demoUser._id,
    email: demoUser.email,
  });
  return demoUser;
};

// Função para seed de categorias padrão
const seedDefaultCategories = async (userId) => {
  logger.info("Criando categorias padrão...");

  // Verificar se já existem categorias para o usuário
  const existingCategories = await Category.countDocuments({ user: userId });

  if (existingCategories > 0) {
    logger.info(
      `✓ ${existingCategories} categorias já existem. Pulando criação...`
    );
    return await Category.find({ user: userId });
  }

  // Categorias de receita
  const incomeCategories = [
    {
      name: "Salário",
      type: "income",
      color: "#10B981",
      icon: "cash",
      isDefault: true,
    },
    {
      name: "Investimentos",
      type: "income",
      color: "#3B82F6",
      icon: "trending-up",
      isDefault: true,
    },
    {
      name: "Freelance",
      type: "income",
      color: "#6366F1",
      icon: "laptop",
      isDefault: true,
    },
    {
      name: "Presentes",
      type: "income",
      color: "#EC4899",
      icon: "gift",
      isDefault: true,
    },
    {
      name: "Outros",
      type: "income",
      color: "#8B5CF6",
      icon: "plus-circle",
      isDefault: true,
    },
  ];

  // Categorias de despesa
  const expenseCategories = [
    {
      name: "Alimentação",
      type: "expense",
      color: "#EF4444",
      icon: "restaurant",
      isDefault: true,
    },
    {
      name: "Moradia",
      type: "expense",
      color: "#F59E0B",
      icon: "home",
      isDefault: true,
    },
    {
      name: "Transporte",
      type: "expense",
      color: "#10B981",
      icon: "car",
      isDefault: true,
    },
    {
      name: "Entretenimento",
      type: "expense",
      color: "#3B82F6",
      icon: "film",
      isDefault: true,
    },
    {
      name: "Saúde",
      type: "expense",
      color: "#EC4899",
      icon: "heart",
      isDefault: true,
    },
    {
      name: "Educação",
      type: "expense",
      color: "#8B5CF6",
      icon: "book",
      isDefault: true,
    },
    {
      name: "Contas",
      type: "expense",
      color: "#F97316",
      icon: "credit-card",
      isDefault: true,
    },
    {
      name: "Compras",
      type: "expense",
      color: "#06B6D4",
      icon: "shopping-bag",
      isDefault: true,
    },
    {
      name: "Outros",
      type: "expense",
      color: "#6B7280",
      icon: "help-circle",
      isDefault: true,
    },
  ];

  // Adicionar userId a todas as categorias
  const allCategories = [...incomeCategories, ...expenseCategories].map(
    (category) => ({
      ...category,
      user: userId,
    })
  );

  // Criar categorias no banco de dados
  const createdCategories = await Category.insertMany(allCategories);

  console.log(`${createdCategories.length} categorias criadas com sucesso!`);
  return createdCategories;
};

// Função para seed de transações de exemplo
const seedSampleTransactions = async (userId, categories) => {
  console.log("Criando transações de exemplo...");

  // Verificar se já existem transações para o usuário
  const existingTransactions = await Transaction.countDocuments({
    user: userId,
  });

  if (existingTransactions > 0) {
    console.log("Transações já existem para este usuário. Pulando criação...");
    return;
  }

  // Obter dados de transações de exemplo
  const sampleTransactions = getTransactionData(userId, categories);

  // Criar transações no banco de dados
  await Transaction.insertMany(sampleTransactions);

  console.log(`${sampleTransactions.length} transações criadas com sucesso!`);
};

// Função para seed de orçamentos de exemplo
const seedSampleBudgets = async (userId, categories) => {
  console.log("Criando orçamentos de exemplo...");

  // Verificar se já existem orçamentos para o usuário
  const existingBudgets = await Budget.countDocuments({ user: userId });

  if (existingBudgets > 0) {
    console.log("Orçamentos já existem para este usuário. Pulando criação...");
    return;
  }

  // Obter dados de orçamentos de exemplo
  const sampleBudgets = getBudgetData(userId, categories);

  // Criar orçamentos no banco de dados
  await Budget.insertMany(sampleBudgets);

  console.log(`${sampleBudgets.length} orçamentos criados com sucesso!`);
};

// Função para seed de notificações de exemplo
const seedSampleNotifications = async (userId) => {
  console.log("Criando notificações de exemplo...");

  // Verificar se já existem notificações para o usuário
  const existingNotifications = await Notification.countDocuments({
    user: userId,
  });

  if (existingNotifications > 0) {
    console.log(
      "Notificações já existem para este usuário. Pulando criação..."
    );
    return;
  }

  // Obter dados de notificações de exemplo
  const sampleNotifications = getNotificationData(userId);

  // Criar notificações no banco de dados
  await Notification.insertMany(sampleNotifications);

  logger.success(
    `${sampleNotifications.length} notificações criadas com sucesso!`
  );
};

// Função principal para executar todos os seeders
const seedAll = async () => {
  try {
    logger.section("🌱 INICIANDO SEEDS DO BANCO DE DADOS");

    // Conectar ao banco de dados
    await connectDB();
    logger.success("✓ Conexão com o banco de dados estabelecida");

    // Executar seeders em sequência
    logger.section("👤 CRIANDO USUÁRIOS");
    const demoUser = await seedDemoUser();

    logger.section("🏷️ CRIANDO CATEGORIAS");
    const categories = await seedDefaultCategories(demoUser._id);
    logger.success(`✓ ${categories.length} categorias criadas`);

    logger.section("💳 CRIANDO TRANSAÇÕES");
    await seedSampleTransactions(demoUser._id, categories);

    logger.section("💼 CRIANDO ORÇAMENTOS");
    await seedSampleBudgets(demoUser._id, categories);

    logger.section("🔔 CRIANDO NOTIFICAÇÕES");
    await seedSampleNotifications(demoUser._id);

    logger.success("\n✓ Todos os seeders foram executados com sucesso!");
    logger.info(
      "Usuário Demo - Email: demo@despfinancee.com | Senha: senha123"
    );

    // Fechar a conexão com o banco de dados
    await mongoose.disconnect();
    logger.info("Conexão com o banco de dados encerrada");

    process.exit(0);
  } catch (error) {
    logger.error("❌ Erro ao executar seeders:", error);

    // Fechar a conexão com o banco de dados em caso de erro
    try {
      await mongoose.disconnect();
      logger.info("Conexão com o banco de dados encerrada após erro");
    } catch (disconnectError) {
      logger.error("Erro ao desconectar do banco:", disconnectError);
    }

    process.exit(1);
  }
};

// Executar a função principal
seedAll();
