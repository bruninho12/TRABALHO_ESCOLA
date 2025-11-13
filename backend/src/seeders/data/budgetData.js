/**
 * @fileoverview Dados de exemplo para orçamentos
 * Este arquivo contém dados de exemplo para popular o banco de dados com orçamentos realistas
 */

// Função para gerar dados de orçamentos de exemplo
const getBudgetData = (userId, categories) => {
  // Filtrar categorias de despesa
  const expenseCategories = categories.filter((cat) => cat.type === "expense");

  // Calcular datas para o mês atual
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  const startOfMonth = new Date(currentYear, currentMonth, 1);
  const endOfMonth = new Date(currentYear, currentMonth + 1, 0);

  // Calcular datas para o próximo mês
  const startOfNextMonth = new Date(currentYear, currentMonth + 1, 1);
  const endOfNextMonth = new Date(currentYear, currentMonth + 2, 0);

  // Dados de orçamentos
  const budgets = [
    // Orçamento total mensal
    {
      user: userId,
      name: "Orçamento Mensal Total",
      amount: 3000,
      period: "monthly",
      startDate: startOfMonth,
      endDate: endOfMonth,
      categories: expenseCategories.map((cat) => cat._id),
    },

    // Orçamento para o próximo mês
    {
      user: userId,
      name: "Orçamento do Próximo Mês",
      amount: 3200,
      period: "monthly",
      startDate: startOfNextMonth,
      endDate: endOfNextMonth,
      categories: expenseCategories.map((cat) => cat._id),
    },

    // Orçamento alimentação
    {
      user: userId,
      name: "Alimentação",
      amount: 800,
      period: "monthly",
      startDate: startOfMonth,
      endDate: endOfMonth,
      categories: [
        expenseCategories.find((cat) => cat.name === "Alimentação")._id,
      ],
    },

    // Orçamento entretenimento
    {
      user: userId,
      name: "Entretenimento",
      amount: 300,
      period: "monthly",
      startDate: startOfMonth,
      endDate: endOfMonth,
      categories: [
        expenseCategories.find((cat) => cat.name === "Entretenimento")._id,
      ],
    },

    // Orçamento de transporte
    {
      user: userId,
      name: "Transporte",
      amount: 500,
      period: "monthly",
      startDate: startOfMonth,
      endDate: endOfMonth,
      categories: [
        expenseCategories.find((cat) => cat.name === "Transporte")._id,
      ],
    },

    // Orçamento de contas
    {
      user: userId,
      name: "Contas Fixas",
      amount: 450,
      period: "monthly",
      startDate: startOfMonth,
      endDate: endOfMonth,
      categories: [expenseCategories.find((cat) => cat.name === "Contas")._id],
    },

    // Orçamento de compras
    {
      user: userId,
      name: "Compras",
      amount: 400,
      period: "monthly",
      startDate: startOfMonth,
      endDate: endOfMonth,
      categories: [expenseCategories.find((cat) => cat.name === "Compras")._id],
    },

    // Orçamento anual para educação
    {
      user: userId,
      name: "Educação Anual",
      amount: 2000,
      period: "yearly",
      startDate: new Date(currentYear, 0, 1),
      endDate: new Date(currentYear, 11, 31),
      categories: [
        expenseCategories.find((cat) => cat.name === "Educação")._id,
      ],
    },

    // Orçamento anual para saúde
    {
      user: userId,
      name: "Saúde Anual",
      amount: 1500,
      period: "yearly",
      startDate: new Date(currentYear, 0, 1),
      endDate: new Date(currentYear, 11, 31),
      categories: [expenseCategories.find((cat) => cat.name === "Saúde")._id],
    },

    // Orçamento personalizado para férias (3 meses)
    {
      user: userId,
      name: "Férias de Fim de Ano",
      amount: 3000,
      period: "custom",
      startDate: new Date(currentYear, 9, 1), // Começa em Outubro
      endDate: new Date(currentYear, 11, 31), // Termina em Dezembro
      categories: [
        expenseCategories.find((cat) => cat.name === "Entretenimento")._id,
        expenseCategories.find((cat) => cat.name === "Transporte")._id,
      ],
    },
  ];

  return budgets;
};

module.exports = { getBudgetData };
