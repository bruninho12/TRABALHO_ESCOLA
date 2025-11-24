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
  const currentMonth = now.getMonth() + 1; // getMonth() retorna 0-11, mas o modelo espera 1-12

  // Dados de orçamentos
  const budgets = [];

  // Criar orçamentos para cada categoria de despesa
  expenseCategories.forEach((category) => {
    let amount;

    // Definir valores de orçamento baseados no tipo de categoria
    switch (category.name) {
      case "Alimentação":
        amount = 800;
        break;
      case "Moradia":
        amount = 1500;
        break;
      case "Transporte":
        amount = 400;
        break;
      case "Entretenimento":
        amount = 300;
        break;
      case "Saúde":
        amount = 200;
        break;
      case "Educação":
        amount = 250;
        break;
      case "Contas":
        amount = 500;
        break;
      case "Compras":
        amount = 300;
        break;
      case "Outros":
        amount = 200;
        break;
      default:
        amount = 200;
    }

    // Orçamento para o mês atual
    budgets.push({
      user: userId,
      month: currentMonth,
      year: currentYear,
      category: category._id,
      amount: amount,
    });

    // Orçamento para o próximo mês (com pequeno ajuste)
    const nextMonth = currentMonth === 12 ? 1 : currentMonth + 1;
    const nextYear = currentMonth === 12 ? currentYear + 1 : currentYear;

    budgets.push({
      user: userId,
      month: nextMonth,
      year: nextYear,
      category: category._id,
      amount: Math.floor(amount * (0.9 + Math.random() * 0.2)), // Variação de ±10%
    });
  });

  return budgets;
};

module.exports = { getBudgetData };
