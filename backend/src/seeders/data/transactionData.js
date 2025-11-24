/**
 * @fileoverview Dados de exemplo para transações
 * Este arquivo contém dados de exemplo para popular o banco de dados com transações realistas
 */

// Função para gerar datas aleatórias nos últimos 3 meses
const generateRandomDate = (monthsBack = 3) => {
  const now = new Date();
  const pastDate = new Date(
    now.getFullYear(),
    now.getMonth() - Math.floor(Math.random() * monthsBack),
    Math.floor(Math.random() * 28) + 1
  );
  return pastDate;
};

// Função para gerar dados de transações de exemplo
const getTransactionData = (userId, categories) => {
  // Separar categorias por tipo
  const incomeCategories = categories.filter((cat) => cat.type === "income");
  const expenseCategories = categories.filter((cat) => cat.type === "expense");

  // Data para transações fixas
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  // Meses anteriores para dados históricos
  const months = [
    { month: currentMonth, year: currentYear },
    {
      month: currentMonth - 1 >= 0 ? currentMonth - 1 : 11,
      year: currentMonth - 1 >= 0 ? currentYear : currentYear - 1,
    },
    {
      month: currentMonth - 2 >= 0 ? currentMonth - 2 : 10,
      year: currentMonth - 2 >= 0 ? currentYear : currentYear - 1,
    },
  ];

  // Dados de transações
  const transactions = [];

  // Receitas fixas para os últimos 3 meses
  months.forEach(({ month, year }) => {
    // Salário mensal - no dia 5 de cada mês
    transactions.push({
      userId: userId,
      category: incomeCategories.find((cat) => cat.name === "Salário")._id,
      description: "Salário mensal",
      amount: 3500,
      type: "income",
      date: new Date(year, month, 5),
      paymentMethod: "Transferência",
      notes: "Pagamento mensal",
      isRecurring: true,
      recurrenceInterval: "monthly",
    });

    // Adicionar rendimento de investimentos - no dia 10 de cada mês
    if (Math.random() > 0.3) {
      // 70% de chance de ter rendimento no mês
      transactions.push({
        userId: userId,
        category: incomeCategories.find((cat) => cat.name === "Investimentos")
          ._id,
        description: "Rendimento de investimentos",
        amount: Math.floor(Math.random() * 200) + 50, // Entre 50 e 250
        type: "income",
        date: new Date(year, month, 10),
        paymentMethod: "Transferência",
        notes: "Rendimento mensal de aplicações",
        isRecurring: false,
      });
    }
  });

  // Trabalho freelance ocasional (1-2 por período de 3 meses)
  for (let i = 0; i < Math.floor(Math.random() * 2) + 1; i++) {
    transactions.push({
      userId: userId,
      category: incomeCategories.find((cat) => cat.name === "Freelance")._id,
      description:
        "Projeto freelance " +
        ["website", "design", "consultoria"][Math.floor(Math.random() * 3)],
      amount: Math.floor(Math.random() * 1000) + 500, // Entre 500 e 1500
      type: "income",
      date: generateRandomDate(),
      paymentMethod: "Transferência",
      isRecurring: false,
    });
  }

  // Presente de aniversário (ocasional)
  if (Math.random() > 0.5) {
    // 50% de chance
    transactions.push({
      userId: userId,
      category: incomeCategories.find((cat) => cat.name === "Presentes")._id,
      description: "Presente de aniversário",
      amount: Math.floor(Math.random() * 200) + 100, // Entre 100 e 300
      type: "income",
      date: generateRandomDate(),
      paymentMethod: "Dinheiro",
      isRecurring: false,
    });
  }

  // Despesas fixas para os últimos 3 meses
  months.forEach(({ month, year }) => {
    // Aluguel - dia 15 de cada mês
    transactions.push({
      userId: userId,
      category: expenseCategories.find((cat) => cat.name === "Moradia")._id,
      description: "Aluguel",
      amount: 1200,
      type: "expense",
      date: new Date(year, month, 15),
      paymentMethod: "Transferência",
      notes: "Aluguel mensal",
      isRecurring: true,
      recurrenceInterval: "monthly",
    });

    // Conta de luz - dia 20 de cada mês
    transactions.push({
      userId: userId,
      category: expenseCategories.find((cat) => cat.name === "Contas")._id,
      description: "Conta de luz",
      amount: Math.floor(Math.random() * 50) + 120, // Entre 120 e 170
      type: "expense",
      date: new Date(year, month, 20),
      paymentMethod: "Débito automático",
      notes: "Conta mensal",
      isRecurring: true,
      recurrenceInterval: "monthly",
    });

    // Conta de água - dia 18 de cada mês
    transactions.push({
      userId: userId,
      category: expenseCategories.find((cat) => cat.name === "Contas")._id,
      description: "Conta de água",
      amount: Math.floor(Math.random() * 30) + 60, // Entre 60 e 90
      type: "expense",
      date: new Date(year, month, 18),
      paymentMethod: "Débito automático",
      isRecurring: true,
      recurrenceInterval: "monthly",
    });

    // Internet - dia 25 de cada mês
    transactions.push({
      userId: userId,
      category: expenseCategories.find((cat) => cat.name === "Contas")._id,
      description: "Internet",
      amount: 99.9,
      type: "expense",
      date: new Date(year, month, 25),
      paymentMethod: "Cartão de crédito",
      isRecurring: true,
      recurrenceInterval: "monthly",
    });

    // Assinatura streaming - dia 22 de cada mês
    transactions.push({
      userId: userId,
      category: expenseCategories.find((cat) => cat.name === "Entretenimento")
        ._id,
      description: "Assinatura streaming",
      amount: 45.9,
      type: "expense",
      date: new Date(year, month, 22),
      paymentMethod: "Cartão de crédito",
      isRecurring: true,
      recurrenceInterval: "monthly",
    });

    // Supermercado - 2-3 vezes por mês
    for (let i = 0; i < Math.floor(Math.random() * 2) + 2; i++) {
      const day = Math.floor(Math.random() * 28) + 1;
      transactions.push({
        userId: userId,
        category: expenseCategories.find((cat) => cat.name === "Alimentação")
          ._id,
        description: "Supermercado",
        amount: Math.floor(Math.random() * 150) + 200, // Entre 200 e 350
        type: "expense",
        date: new Date(year, month, day),
        paymentMethod:
          Math.random() > 0.5 ? "Cartão de crédito" : "Cartão de débito",
        isRecurring: false,
      });
    }

    // Restaurantes - 1-4 vezes por mês
    for (let i = 0; i < Math.floor(Math.random() * 4) + 1; i++) {
      const day = Math.floor(Math.random() * 28) + 1;
      transactions.push({
        userId: userId,
        category: expenseCategories.find((cat) => cat.name === "Alimentação")
          ._id,
        description:
          "Restaurante " +
          ["italiano", "japonês", "hamburgueria", "pizzaria"][
            Math.floor(Math.random() * 4)
          ],
        amount: Math.floor(Math.random() * 60) + 40, // Entre 40 e 100
        type: "expense",
        date: new Date(year, month, day),
        paymentMethod: "Cartão de crédito",
        isRecurring: false,
      });
    }

    // Transporte (gasolina/transporte público) - 2-4 vezes por mês
    for (let i = 0; i < Math.floor(Math.random() * 3) + 2; i++) {
      const day = Math.floor(Math.random() * 28) + 1;
      const isGas = Math.random() > 0.5;
      transactions.push({
        userId: userId,
        category: expenseCategories.find((cat) => cat.name === "Transporte")
          ._id,
        description: isGas ? "Abastecimento" : "Transporte público",
        amount: isGas
          ? Math.floor(Math.random() * 50) + 100
          : Math.floor(Math.random() * 20) + 15,
        type: "expense",
        date: new Date(year, month, day),
        paymentMethod: isGas ? "Cartão de crédito" : "Dinheiro",
        isRecurring: false,
      });
    }
  });

  // Despesas ocasionais

  // Compras
  for (let i = 0; i < Math.floor(Math.random() * 3) + 2; i++) {
    transactions.push({
      userId: userId,
      category: expenseCategories.find((cat) => cat.name === "Compras")._id,
      description:
        "Compra " +
        ["roupas", "eletrônicos", "livros", "calçados"][
          Math.floor(Math.random() * 4)
        ],
      amount: Math.floor(Math.random() * 150) + 50, // Entre 50 e 200
      type: "expense",
      date: generateRandomDate(),
      paymentMethod: "Cartão de crédito",
      isRecurring: false,
    });
  }

  // Saúde - 0-2 vezes no período
  for (let i = 0; i < Math.floor(Math.random() * 3); i++) {
    transactions.push({
      userId: userId,
      category: expenseCategories.find((cat) => cat.name === "Saúde")._id,
      description:
        "Consulta " +
        ["médica", "dentista", "exames", "farmácia"][
          Math.floor(Math.random() * 4)
        ],
      amount: Math.floor(Math.random() * 150) + 100, // Entre 100 e 250
      type: "expense",
      date: generateRandomDate(),
      paymentMethod: "Cartão de crédito",
      isRecurring: false,
    });
  }

  // Educação - cursos ocasionais
  if (Math.random() > 0.7) {
    // 30% de chance
    transactions.push({
      userId: userId,
      category: expenseCategories.find((cat) => cat.name === "Educação")._id,
      description: "Curso online",
      amount: Math.floor(Math.random() * 300) + 200, // Entre 200 e 500
      type: "expense",
      date: generateRandomDate(),
      paymentMethod: "Cartão de crédito",
      isRecurring: false,
    });
  }

  return transactions;
};

module.exports = { getTransactionData, generateRandomDate };
