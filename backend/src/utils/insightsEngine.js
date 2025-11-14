/**
 * @fileoverview Sistema de Insights Inteligentes
 * Analisa padrões de gastos e gera sugestões personalizadas
 */

const mongoose = require("mongoose");
const { Transaction, Budget, Goal } = require("../models");
const logger = require("./logger");

class InsightsEngine {
  /**
   * Converte userId para ObjectId se necessário
   */
  toObjectId(userId) {
    if (typeof userId === "string") {
      return mongoose.Types.ObjectId(userId);
    }
    return userId;
  }

  /**
   * Gera todos os insights para um usuário
   */
  async generateInsights(userId) {
    try {
      const insights = [];

      // Análise de tendências de gastos
      const spendingTrends = await this.analyzeSpendingTrends(userId);
      if (spendingTrends) insights.push(spendingTrends);

      // Detecção de padrões
      const patterns = await this.detectSpendingPatterns(userId);
      insights.push(...patterns);

      // Comparação com orçamento
      const budgetComparison = await this.compareBudgetPerformance(userId);
      if (budgetComparison) insights.push(budgetComparison);

      // Previsão de gastos
      const prediction = await this.predictFutureExpenses(userId);
      if (prediction) insights.push(prediction);

      // Sugestões de economia
      const savingsSuggestions = await this.generateSavingsSuggestions(userId);
      insights.push(...savingsSuggestions);

      return insights;
    } catch (error) {
      logger.error(`Error generating insights: ${error.message}`);
      return [];
    }
  }

  /**
   * Analisa tendências de gastos (comparação com período anterior)
   */
  async analyzeSpendingTrends(userId) {
    try {
      const now = new Date();
      const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

      const userObjectId = new mongoose.Types.ObjectId(userId);

      // Gastos do mês atual
      const currentMonthExpenses = await Transaction.aggregate([
        {
          $match: {
            userId: userObjectId,
            type: "expense",
            date: { $gte: currentMonthStart },
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$amount" },
          },
        },
      ]);

      // Gastos do mês passado
      const lastMonthExpenses = await Transaction.aggregate([
        {
          $match: {
            userId: userObjectId,
            type: "expense",
            date: { $gte: lastMonthStart, $lte: lastMonthEnd },
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$amount" },
          },
        },
      ]);

      const currentTotal = currentMonthExpenses[0]?.total || 0;
      const lastTotal = lastMonthExpenses[0]?.total || 0;

      if (lastTotal === 0) return null;

      const difference = currentTotal - lastTotal;
      const percentChange = ((difference / lastTotal) * 100).toFixed(1);
      const isPositive = difference < 0; // negativo é bom (gastou menos)

      return {
        type: "trend",
        category: "spending_comparison",
        title: isPositive
          ? `Você gastou ${Math.abs(percentChange)}% a menos este mês! 🎉`
          : `Seus gastos aumentaram ${percentChange}% este mês`,
        description: `Comparado ao mês passado, você ${
          isPositive ? "economizou" : "gastou"
        } R$ ${Math.abs(difference).toFixed(2)}.`,
        impact: isPositive ? "positive" : "negative",
        priority: "high",
        savings: isPositive ? Math.abs(difference) : 0,
        icon: isPositive ? "📉" : "📈",
        action: isPositive ? null : "Revise seus gastos recentes",
      };
    } catch (error) {
      logger.error(`Error analyzing spending trends: ${error.message}`);
      return null;
    }
  }

  /**
   * Detecta padrões de gastos (dias específicos, valores recorrentes)
   */
  async detectSpendingPatterns(userId) {
    try {
      const insights = [];
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const userObjectId = this.toObjectId(userId);

      // Buscar todas as transações dos últimos 30 dias
      const transactions = await Transaction.find({
        userId: userObjectId,
        type: "expense",
        date: { $gte: thirtyDaysAgo },
      }).sort({ date: -1 });

      // Detectar gastos recorrentes por dia da semana
      const dayOfWeekExpenses = {};
      transactions.forEach((t) => {
        const dayOfWeek = new Date(t.date).getDay();
        dayOfWeekExpenses[dayOfWeek] = dayOfWeekExpenses[dayOfWeek] || [];
        dayOfWeekExpenses[dayOfWeek].push(t.amount);
      });

      // Encontrar dia da semana com mais gastos
      let maxDay = -1;
      let maxAvg = 0;
      const daysNames = [
        "domingo",
        "segunda",
        "terça",
        "quarta",
        "quinta",
        "sexta",
        "sábado",
      ];

      Object.keys(dayOfWeekExpenses).forEach((day) => {
        const avg =
          dayOfWeekExpenses[day].reduce((a, b) => a + b, 0) /
          dayOfWeekExpenses[day].length;
        if (avg > maxAvg) {
          maxAvg = avg;
          maxDay = parseInt(day);
        }
      });

      if (maxDay >= 0 && maxAvg > 50) {
        insights.push({
          type: "pattern",
          category: "day_of_week",
          title: `Padrão detectado: Gastos elevados às ${daysNames[maxDay]}s`,
          description: `Em média, você gasta R$ ${maxAvg.toFixed(2)} às ${
            daysNames[maxDay]
          }s.`,
          suggestion:
            "Planeje esses gastos com antecedência para melhor controle.",
          impact: "neutral",
          priority: "medium",
          icon: "📅",
        });
      }

      // Detectar categoria com mais gastos
      const categoryExpenses = {};
      transactions.forEach((t) => {
        categoryExpenses[t.category] =
          (categoryExpenses[t.category] || 0) + t.amount;
      });

      const topCategory = Object.keys(categoryExpenses).reduce(
        (a, b) => (categoryExpenses[a] > categoryExpenses[b] ? a : b),
        ""
      );

      if (topCategory && categoryExpenses[topCategory] > 300) {
        insights.push({
          type: "pattern",
          category: "top_category",
          title: `Categoria predominante: ${topCategory}`,
          description: `Você gastou R$ ${categoryExpenses[topCategory].toFixed(
            2
          )} em ${topCategory} nos últimos 30 dias.`,
          suggestion:
            "Considere revisar esses gastos para possíveis economias.",
          impact: "neutral",
          priority: "medium",
          icon: "📊",
        });
      }

      return insights;
    } catch (error) {
      logger.error(`Error detecting patterns: ${error.message}`);
      return [];
    }
  }

  /**
   * Compara desempenho com orçamentos
   */
  async compareBudgetPerformance(userId) {
    try {
      const now = new Date();
      const currentMonth = now.getMonth() + 1;
      const currentYear = now.getFullYear();

      const userObjectId = this.toObjectId(userId);

      // Buscar orçamentos do mês atual
      const budgets = await Budget.find({
        userId: userObjectId,
        month: currentMonth,
        year: currentYear,
      });

      if (budgets.length === 0) return null;

      // Encontrar orçamento mais próximo do limite
      let closestBudget = null;
      let maxPercentage = 0;

      for (const budget of budgets) {
        const percentage = (budget.spent / budget.limit) * 100;
        if (percentage > maxPercentage && percentage < 100) {
          maxPercentage = percentage;
          closestBudget = budget;
        }
      }

      if (!closestBudget) return null;

      const remaining = closestBudget.limit - closestBudget.spent;
      const isWarning = maxPercentage >= 80;

      return {
        type: "budget",
        category: "budget_status",
        title: isWarning
          ? `⚠️ Orçamento de ${
              closestBudget.category
            } em ${maxPercentage.toFixed(0)}%`
          : `Orçamento de ${closestBudget.category} sob controle`,
        description: `Você já gastou R$ ${closestBudget.spent.toFixed(
          2
        )} de R$ ${closestBudget.limit.toFixed(
          2
        )}. Restam R$ ${remaining.toFixed(2)}.`,
        impact: isWarning ? "warning" : "positive",
        priority: isWarning ? "high" : "low",
        icon: isWarning ? "⚠️" : "✅",
        action: isWarning ? "Reduza gastos nesta categoria" : null,
      };
    } catch (error) {
      logger.error(`Error comparing budget: ${error.message}`);
      return null;
    }
  }

  /**
   * Prevê gastos futuros baseado em histórico
   */
  async predictFutureExpenses(userId) {
    try {
      const now = new Date();
      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

      const userObjectId = this.toObjectId(userId);

      // Calcular média dos últimos 3 meses
      const expenses = await Transaction.aggregate([
        {
          $match: {
            userId: userObjectId,
            type: "expense",
            date: { $gte: threeMonthsAgo },
          },
        },
        {
          $group: {
            _id: {
              month: { $month: "$date" },
              year: { $year: "$date" },
            },
            total: { $sum: "$amount" },
          },
        },
      ]);

      if (expenses.length < 2) return null;

      const avgMonthlyExpense =
        expenses.reduce((sum, e) => sum + e.total, 0) / expenses.length;

      // Gastos do mês atual até agora
      const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const currentExpenses = await Transaction.aggregate([
        {
          $match: {
            userId: userObjectId,
            type: "expense",
            date: { $gte: currentMonthStart },
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$amount" },
          },
        },
      ]);

      const currentTotal = currentExpenses[0]?.total || 0;
      const daysInMonth = new Date(
        now.getFullYear(),
        now.getMonth() + 1,
        0
      ).getDate();
      const daysElapsed = now.getDate();
      const projected = (currentTotal / daysElapsed) * daysInMonth;

      const confidence = expenses.length >= 3 ? 0.85 : 0.65;

      return {
        type: "prediction",
        category: "future_expenses",
        title: "Previsão de gastos para este mês",
        description: `Com base no seu histórico, você deve gastar aproximadamente R$ ${projected.toFixed(
          2
        )} este mês.`,
        confidence: confidence,
        impact: projected > avgMonthlyExpense ? "warning" : "positive",
        priority: "medium",
        icon: "🔮",
        details: {
          current: currentTotal,
          projected: projected,
          average: avgMonthlyExpense,
        },
      };
    } catch (error) {
      logger.error(`Error predicting expenses: ${error.message}`);
      return null;
    }
  }

  /**
   * Gera sugestões de economia
   */
  async generateSavingsSuggestions(userId) {
    try {
      const suggestions = [];
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const userObjectId = this.toObjectId(userId);

      // Analisar categorias com potencial de economia
      const categoryExpenses = await Transaction.aggregate([
        {
          $match: {
            userId: userObjectId,
            type: "expense",
            date: { $gte: thirtyDaysAgo },
          },
        },
        {
          $group: {
            _id: "$category",
            total: { $sum: "$amount" },
            count: { $sum: 1 },
          },
        },
        { $sort: { total: -1 } },
      ]);

      // Sugestões baseadas em categorias com alto gasto
      const savingsTips = {
        Alimentação: {
          title: "Economize com alimentação",
          suggestion:
            "Prepare refeições em casa 3x por semana e economize até 30%",
          icon: "🍱",
        },
        Transporte: {
          title: "Reduza custos de transporte",
          suggestion: "Considere transporte público ou carona compartilhada",
          icon: "🚌",
        },
        Lazer: {
          title: "Otimize gastos com lazer",
          suggestion: "Busque atividades gratuitas ou descontos em aplicativos",
          icon: "🎬",
        },
        Compras: {
          title: "Compre de forma consciente",
          suggestion: "Faça uma lista de compras e evite compras por impulso",
          icon: "🛒",
        },
      };

      categoryExpenses.slice(0, 2).forEach((cat) => {
        if (savingsTips[cat._id] && cat.total > 300) {
          const potentialSavings = cat.total * 0.2; // 20% de economia possível
          suggestions.push({
            type: "suggestion",
            category: "savings",
            title: savingsTips[cat._id].title,
            description: savingsTips[cat._id].suggestion,
            potentialSavings: potentialSavings,
            difficulty: "medium",
            impact: "positive",
            priority: "medium",
            icon: savingsTips[cat._id].icon,
          });
        }
      });

      return suggestions;
    } catch (error) {
      logger.error(`Error generating savings suggestions: ${error.message}`);
      return [];
    }
  }

  /**
   * Calcula score financeiro do usuário (0-100)
   */
  async calculateFinancialScore(userId) {
    try {
      let score = 0;
      const userObjectId = this.toObjectId(userId);

      // 1. Orçamento (25 pontos)
      const budgets = await Budget.find({ userId: userObjectId });
      if (budgets.length > 0) {
        score += 10; // Tem orçamentos definidos
        const budgetsOnTrack = budgets.filter(
          (b) => (b.spent / b.limit) * 100 < 90
        );
        score += (budgetsOnTrack.length / budgets.length) * 15;
      }

      // 2. Metas (25 pontos)
      const goals = await Goal.find({ userId: userObjectId });
      if (goals.length > 0) {
        score += 10; // Tem metas definidas
        const activeGoals = goals.filter((g) => g.status === "active");
        const progress =
          activeGoals.reduce(
            (sum, g) => sum + (g.current / g.target) * 100,
            0
          ) / activeGoals.length;
        score += (progress / 100) * 15;
      }

      // 3. Consistência (25 pontos)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const transactions = await Transaction.find({
        userId: userObjectId,
        date: { $gte: thirtyDaysAgo },
      });

      // Verifica se registrou transações em pelo menos 20 dias
      const daysWithTransactions = new Set(
        transactions.map((t) => t.date.toDateString())
      ).size;
      score += (daysWithTransactions / 30) * 25;

      // 4. Economia (25 pontos)
      const income = await Transaction.aggregate([
        {
          $match: {
            userId: userObjectId,
            type: "income",
            date: { $gte: thirtyDaysAgo },
          },
        },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]);

      const expenses = await Transaction.aggregate([
        {
          $match: {
            userId: userObjectId,
            type: "expense",
            date: { $gte: thirtyDaysAgo },
          },
        },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]);

      const totalIncome = income[0]?.total || 0;
      const totalExpenses = expenses[0]?.total || 0;

      if (totalIncome > 0) {
        const savingsRate = ((totalIncome - totalExpenses) / totalIncome) * 100;
        score += Math.min(savingsRate / 4, 25); // Máximo 25 pontos
      }

      return Math.min(Math.round(score), 100);
    } catch (error) {
      logger.error(`Error calculating financial score: ${error.message}`);
      return 0;
    }
  }
}

// Singleton
const insightsEngine = new InsightsEngine();

module.exports = insightsEngine;
