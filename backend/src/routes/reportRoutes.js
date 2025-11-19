const express = require("express");
const { authenticate } = require("../controllers/authController");
const { Transaction } = require("../models");

const router = express.Router();

// Aplicar middleware de autenticação
router.use(authenticate);

// Resumo do mês
router.get("/summary", async (req, res) => {
  try {
    const userId = req.user.id;
    const { period = "month" } = req.query;

    let startDate, endDate;
    const now = new Date();

    if (period === "month") {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
    } else if (period === "year") {
      startDate = new Date(now.getFullYear(), 0, 1);
      endDate = new Date(now.getFullYear(), 11, 31, 23, 59, 59);
    }

    const transactions = await Transaction.find({
      userId,
      date: { $gte: startDate, $lte: endDate },
    });

    const income = transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + (t.amount || 0), 0);

    const expenses = Math.abs(
      transactions
        .filter((t) => t.type === "expense")
        .reduce((sum, t) => sum + (t.amount || 0), 0)
    );

    res.json({
      success: true,
      data: {
        income,
        expenses,
        balance: income - expenses,
        transactionCount: transactions.length,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erro ao obter resumo",
      error: error.message,
    });
  }
});

// Dados mensais dos últimos N meses
router.get("/monthly", async (req, res) => {
  try {
    const userId = req.user.id;
    const { months = 6 } = req.query;

    const monthlyData = [];
    const now = new Date();

    for (let i = months - 1; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const startDate = new Date(date.getFullYear(), date.getMonth(), 1);
      const endDate = new Date(
        date.getFullYear(),
        date.getMonth() + 1,
        0,
        23,
        59,
        59
      );

      const transactions = await Transaction.find({
        userId,
        date: { $gte: startDate, $lte: endDate },
      });

      const income = transactions
        .filter((t) => t.type === "income")
        .reduce((sum, t) => sum + (t.amount || 0), 0);

      const expenses = Math.abs(
        transactions
          .filter((t) => t.type === "expense")
          .reduce((sum, t) => sum + (t.amount || 0), 0)
      );

      monthlyData.push({
        month: startDate.toLocaleDateString("pt-BR", {
          month: "short",
          year: "numeric",
        }),
        income,
        expenses,
        balance: income - expenses,
      });
    }

    res.json({
      success: true,
      data: {
        labels: monthlyData.map((m) => m.month),
        income: monthlyData.map((m) => m.income),
        expenses: monthlyData.map((m) => m.expenses),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erro ao obter dados mensais",
      error: error.message,
    });
  }
});

// Despesas por categoria
router.get("/categories", async (req, res) => {
  try {
    const userId = req.user.id;
    const { period = "month" } = req.query;

    let startDate, endDate;
    const now = new Date();

    if (period === "month") {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
    }

    const transactions = await Transaction.find({
      userId,
      date: { $gte: startDate, $lte: endDate },
    }).populate("category", "name");

    const categoryTotals = {};
    transactions.forEach((t) => {
      const categoryName = t.category?.name || "Sem categoria";
      if (!categoryTotals[categoryName]) {
        categoryTotals[categoryName] = 0;
      }
      categoryTotals[categoryName] += Math.abs(t.amount || 0);
    });

    res.json({
      success: true,
      data: {
        labels: Object.keys(categoryTotals),
        values: Object.values(categoryTotals),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erro ao obter dados por categoria",
      error: error.message,
    });
  }
});

// Fluxo de caixa
router.get("/cash-flow", async (req, res) => {
  try {
    const userId = req.user.id;
    const { months = 6 } = req.query;

    const cashFlowData = [];
    const now = new Date();

    for (let i = months - 1; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const startDate = new Date(date.getFullYear(), date.getMonth(), 1);
      const endDate = new Date(
        date.getFullYear(),
        date.getMonth() + 1,
        0,
        23,
        59,
        59
      );

      const transactions = await Transaction.find({
        userId,
        date: { $gte: startDate, $lte: endDate },
      });

      const income = transactions
        .filter((t) => t.type === "income")
        .reduce((sum, t) => sum + (t.amount || 0), 0);

      const expenses = Math.abs(
        transactions
          .filter((t) => t.type === "expense")
          .reduce((sum, t) => sum + (t.amount || 0), 0)
      );

      cashFlowData.push({
        month: startDate.toLocaleDateString("pt-BR", {
          month: "short",
          year: "numeric",
        }),
        income,
        expense: expenses,
        balance: income - expenses,
      });
    }

    res.json({
      success: true,
      data: cashFlowData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erro ao obter fluxo de caixa",
      error: error.message,
    });
  }
});

// Relatório mensal
router.get("/monthly-report", async (req, res) => {
  res.json({
    message: "Função de relatório mensal será implementada em breve",
  });
});

// Relatório anual
router.get("/annual", async (req, res) => {
  res.json({
    message: "Função de relatório anual será implementada em breve",
  });
});

// Exportar relatório (usando GET para permitir download do arquivo)
router.get("/export", async (req, res) => {
  res.json({ message: "Função de exportação será implementada em breve" });
});

module.exports = router;

module.exports = router;
