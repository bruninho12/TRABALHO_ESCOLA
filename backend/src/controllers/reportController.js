const { Transaction, Budget } = require("../models");

// Relatório mensal
exports.getMonthlyReport = async (req, res) => {
  try {
    const { month, year } = req.query;

    if (!month || !year) {
      return res.status(400).json({ message: "Mês e ano são obrigatórios" });
    }

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    // Buscar transações do mês
    const transactions = await Transaction.find({
      user: req.user.id,
      date: { $gte: startDate, $lte: endDate },
    }).populate("category", "name type color");

    // Buscar orçamentos do mês
    const budgets = await Budget.find({
      user: req.user.id,
      month: parseInt(month),
      year: parseInt(year),
    }).populate("category", "name type color");

    // Calcular totais por categoria
    const categoryTotals = transactions.reduce((acc, curr) => {
      const key = curr.category._id.toString();
      if (!acc[key]) {
        acc[key] = {
          category: curr.category,
          total: 0,
          count: 0,
          budget: null,
        };
      }
      acc[key].total += Math.abs(curr.amount);
      acc[key].count++;
      return acc;
    }, {});

    // Adicionar informações de orçamento
    budgets.forEach((budget) => {
      const key = budget.category._id.toString();
      if (categoryTotals[key]) {
        categoryTotals[key].budget = budget;
      } else {
        categoryTotals[key] = {
          category: budget.category,
          total: 0,
          count: 0,
          budget,
        };
      }
    });

    // Calcular totais gerais
    const summary = transactions.reduce(
      (acc, curr) => {
        if (curr.type === "income") {
          acc.totalIncome += curr.amount;
          acc.incomeCount++;
        } else {
          acc.totalExpenses += Math.abs(curr.amount);
          acc.expenseCount++;
        }
        return acc;
      },
      {
        totalIncome: 0,
        totalExpenses: 0,
        incomeCount: 0,
        expenseCount: 0,
      }
    );

    res.json({
      summary,
      categoryTotals: Object.values(categoryTotals),
      transactions,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erro ao gerar relatório", error: error.message });
  }
};

// Relatório anual
exports.getAnnualReport = async (req, res) => {
  try {
    const { year } = req.query;

    if (!year) {
      return res.status(400).json({ message: "Ano é obrigatório" });
    }

    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31, 23, 59, 59);

    // Buscar transações do ano
    const monthlyTotals = await Transaction.aggregate([
      {
        $match: {
          user: req.user.id,
          date: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: {
            month: { $month: "$date" },
            type: "$type",
          },
          total: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { "_id.month": 1 },
      },
    ]);

    // Organizar dados por mês
    const report = Array.from({ length: 12 }, (_, i) => {
      const month = i + 1;
      const monthData = monthlyTotals.filter((t) => t._id.month === month);
      const income = monthData.find((t) => t._id.type === "income") || {
        total: 0,
        count: 0,
      };
      const expenses = monthData.find((t) => t._id.type === "expense") || {
        total: 0,
        count: 0,
      };

      return {
        month,
        income: Math.abs(income.total),
        incomeCount: income.count,
        expenses: Math.abs(expenses.total),
        expenseCount: expenses.count,
        balance: income.total - Math.abs(expenses.total),
      };
    });

    // Calcular totais anuais
    const annualSummary = report.reduce(
      (acc, curr) => {
        acc.totalIncome += curr.income;
        acc.totalExpenses += curr.expenses;
        acc.incomeCount += curr.incomeCount;
        acc.expenseCount += curr.expenseCount;
        return acc;
      },
      {
        totalIncome: 0,
        totalExpenses: 0,
        incomeCount: 0,
        expenseCount: 0,
      }
    );

    annualSummary.balance =
      annualSummary.totalIncome - annualSummary.totalExpenses;

    res.json({
      summary: annualSummary,
      monthlyData: report,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erro ao gerar relatório", error: error.message });
  }
};
