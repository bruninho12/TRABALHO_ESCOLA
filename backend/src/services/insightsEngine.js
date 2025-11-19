/**
 * 🤖 Sistema de Insights Inteligentes
 * Analisa padrões financeiros e gera recomendações personalizadas
 */

const Transaction = require("../models/Transaction");
const Budget = require("../models/Budget");
const Goal = require("../models/Goal");
const { logger } = require("../utils/logger");

class InsightsEngine {
  constructor() {
    this.insightTypes = {
      SPENDING_TREND: "spending_trend",
      BUDGET_ALERT: "budget_alert",
      SAVINGS_OPPORTUNITY: "savings_opportunity",
      CATEGORY_PATTERN: "category_pattern",
      GOAL_PREDICTION: "goal_prediction",
      UNUSUAL_EXPENSE: "unusual_expense",
      ACHIEVEMENT: "achievement",
    };
  }

  /**
   * 📊 Gera todos os insights para um usuário
   */
  async generateInsights(userId) {
    try {
      console.log(`🔍 [DEBUG] Gerando insights para usuário ${userId}`);

      if (!userId) {
        throw new Error("UserId é obrigatório");
      }

      const insights = [];

      try {
        // Análise de tendências de gastos
        const trendInsights = await this.analyzeSpendingTrends(userId);
        insights.push(...(trendInsights || []));
      } catch (error) {
        console.warn("⚠️ Erro ao analisar tendências:", error.message);
      }

      try {
        // Oportunidades de economia
        const savingsInsights = await this.findSavingsOpportunities(userId);
        insights.push(...(savingsInsights || []));
      } catch (error) {
        console.warn(
          "⚠️ Erro ao buscar oportunidades de economia:",
          error.message
        );
      }

      try {
        // Padrões de gastos por categoria
        const patternInsights = await this.detectCategoryPatterns(userId);
        insights.push(...(patternInsights || []));
      } catch (error) {
        console.warn("⚠️ Erro ao detectar padrões:", error.message);
      }

      try {
        // Previsão de metas
        const goalInsights = await this.predictGoalCompletion(userId);
        insights.push(...(goalInsights || []));
      } catch (error) {
        console.warn("⚠️ Erro ao prever metas:", error.message);
      }

      try {
        // Detecção de gastos incomuns
        const anomalyInsights = await this.detectAnomalies(userId);
        insights.push(...(anomalyInsights || []));
      } catch (error) {
        console.warn("⚠️ Erro ao detectar anomalias:", error.message);
      }

      try {
        // Conquistas e marcos
        const achievementInsights = await this.detectAchievements(userId);
        insights.push(...(achievementInsights || []));
      } catch (error) {
        console.warn("⚠️ Erro ao detectar conquistas:", error.message);
      }

      // Ordena por prioridade
      insights.sort((a, b) => (b.priority || 0) - (a.priority || 0));

      console.log(
        `✅ ${insights.length} insights gerados para usuário ${userId}`
      );
      return insights;
    } catch (error) {
      console.error("❌ Erro ao gerar insights:", error);
      logger.error("Erro ao gerar insights:", error);

      // Retornar insights básicos em caso de erro
      return [
        {
          id: "fallback-insight",
          type: "info",
          title: "Bem-vindo!",
          message:
            "Continue registrando suas transações para receber insights personalizados.",
          priority: 1,
          actionable: false,
        },
      ];
    }
  }

  /**
   * 📈 Analisa tendências de gastos (comparação com mês anterior)
   */
  async analyzeSpendingTrends(userId) {
    const insights = [];

    try {
      // Mês atual
      const currentMonth = new Date();
      currentMonth.setDate(1);
      currentMonth.setHours(0, 0, 0, 0);

      // Mês anterior
      const lastMonth = new Date(currentMonth);
      lastMonth.setMonth(lastMonth.getMonth() - 1);

      // Gastos do mês atual
      const currentExpenses = await Transaction.aggregate([
        {
          $match: {
            userId: userId,
            type: "expense",
            date: { $gte: currentMonth },
          },
        },
        {
          $group: {
            _id: "$category",
            total: { $sum: "$amount" },
            count: { $sum: 1 },
          },
        },
      ]);

      // Gastos do mês anterior
      const lastExpenses = await Transaction.aggregate([
        {
          $match: {
            userId: userId,
            type: "expense",
            date: { $gte: lastMonth, $lt: currentMonth },
          },
        },
        {
          $group: {
            _id: "$category",
            total: { $sum: "$amount" },
            count: { $sum: 1 },
          },
        },
      ]);

      // Compara categorias
      const lastExpensesMap = new Map(
        lastExpenses.map((e) => [e._id?.toString(), e.total])
      );

      for (const current of currentExpenses) {
        const categoryId = current._id?.toString();
        const lastTotal = lastExpensesMap.get(categoryId) || 0;

        if (lastTotal > 0) {
          const difference = current.total - lastTotal;
          const percentChange = (difference / lastTotal) * 100;

          // Mudança significativa (>15%)
          if (Math.abs(percentChange) > 15) {
            const category = await this.getCategoryName(current._id);

            if (percentChange < 0) {
              // ECONOMIA! 🎉
              insights.push({
                type: this.insightTypes.SPENDING_TREND,
                title: "🎉 Parabéns! Você economizou!",
                message: `Você gastou ${Math.abs(percentChange).toFixed(
                  0
                )}% a menos em ${category} este mês!`,
                impact: "positive",
                priority: 8,
                data: {
                  category,
                  difference: Math.abs(difference),
                  percentChange: Math.abs(percentChange),
                  currentTotal: current.total,
                  lastTotal,
                },
              });
            } else {
              // AUMENTO DE GASTOS ⚠️
              insights.push({
                type: this.insightTypes.SPENDING_TREND,
                title: "⚠️ Atenção: Gastos aumentaram",
                message: `Você gastou ${percentChange.toFixed(
                  0
                )}% a mais em ${category} este mês.`,
                impact: "negative",
                priority: 7,
                data: {
                  category,
                  difference,
                  percentChange,
                  currentTotal: current.total,
                  lastTotal,
                },
              });
            }
          }
        }
      }
    } catch (error) {
      logger.error("Erro ao analisar tendências:", error);
    }

    return insights;
  }

  /**
   * 💡 Identifica oportunidades de economia
   */
  async findSavingsOpportunities(userId) {
    const insights = [];

    try {
      // Últimos 30 dias
      const last30Days = new Date();
      last30Days.setDate(last30Days.getDate() - 30);

      // Analisa gastos frequentes
      const frequentExpenses = await Transaction.aggregate([
        {
          $match: {
            userId: userId,
            type: "expense",
            date: { $gte: last30Days },
          },
        },
        {
          $group: {
            _id: {
              category: "$category",
              description: "$description",
            },
            count: { $sum: 1 },
            totalAmount: { $sum: "$amount" },
            avgAmount: { $avg: "$amount" },
          },
        },
        {
          $match: {
            count: { $gte: 4 }, // Pelo menos 4x no mês
          },
        },
        {
          $sort: { totalAmount: -1 },
        },
        {
          $limit: 5,
        },
      ]);

      for (const expense of frequentExpenses) {
        const category = await this.getCategoryName(expense._id.category);
        const potentialSavings = expense.totalAmount * 0.2; // 20% de economia

        insights.push({
          type: this.insightTypes.SAVINGS_OPPORTUNITY,
          title: "💰 Oportunidade de Economia",
          message: `Você gastou R$ ${expense.totalAmount.toFixed(2)} em "${
            expense._id.description
          }" (${
            expense.count
          }x). Reduzir em 20% economizaria R$ ${potentialSavings.toFixed(
            2
          )}/mês!`,
          impact: "neutral",
          priority: 6,
          data: {
            category,
            description: expense._id.description,
            frequency: expense.count,
            totalAmount: expense.totalAmount,
            potentialSavings,
          },
        });
      }
    } catch (error) {
      logger.error("Erro ao buscar oportunidades:", error);
    }

    return insights;
  }

  /**
   * 🔍 Detecta padrões de gastos por dia/hora
   */
  async detectCategoryPatterns(userId) {
    const insights = [];

    try {
      // Últimos 60 dias
      const last60Days = new Date();
      last60Days.setDate(last60Days.getDate() - 60);

      // Analisa gastos por dia da semana
      const dayPatterns = await Transaction.aggregate([
        {
          $match: {
            userId: userId,
            type: "expense",
            date: { $gte: last60Days },
          },
        },
        {
          $group: {
            _id: {
              dayOfWeek: { $dayOfWeek: "$date" },
              category: "$category",
            },
            count: { $sum: 1 },
            avgAmount: { $avg: "$amount" },
            totalAmount: { $sum: "$amount" },
          },
        },
        {
          $match: {
            count: { $gte: 3 },
          },
        },
        {
          $sort: { totalAmount: -1 },
        },
      ]);

      if (dayPatterns.length > 0) {
        const topPattern = dayPatterns[0];
        const dayNames = [
          "Domingo",
          "Segunda",
          "Terça",
          "Quarta",
          "Quinta",
          "Sexta",
          "Sábado",
        ];
        const dayName = dayNames[topPattern._id.dayOfWeek - 1];
        const category = await this.getCategoryName(topPattern._id.category);

        insights.push({
          type: this.insightTypes.CATEGORY_PATTERN,
          title: "📅 Padrão Detectado",
          message: `Toda ${dayName} você tende a gastar cerca de R$ ${topPattern.avgAmount.toFixed(
            2
          )} em ${category}.`,
          impact: "neutral",
          priority: 5,
          data: {
            dayOfWeek: dayName,
            category,
            avgAmount: topPattern.avgAmount,
            frequency: topPattern.count,
          },
        });
      }
    } catch (error) {
      logger.error("Erro ao detectar padrões:", error);
    }

    return insights;
  }

  /**
   * 🎯 Prevê quando o usuário atingirá suas metas
   */
  async predictGoalCompletion(userId) {
    const insights = [];

    try {
      const activeGoals = await Goal.find({
        userId,
        status: "active",
      });

      for (const goal of activeGoals) {
        const remaining = goal.targetAmount - goal.currentAmount;

        if (remaining > 0) {
          // Calcula média de contribuições dos últimos 30 dias
          const contributions = goal.contributions || [];
          const last30Days = new Date();
          last30Days.setDate(last30Days.getDate() - 30);

          const recentContributions = contributions.filter(
            (c) => new Date(c.date) >= last30Days
          );

          if (recentContributions.length > 0) {
            const totalContributed = recentContributions.reduce(
              (sum, c) => sum + c.amount,
              0
            );
            const avgPerMonth = totalContributed;

            if (avgPerMonth > 0) {
              const monthsToComplete = Math.ceil(remaining / avgPerMonth);
              const completionDate = new Date();
              completionDate.setMonth(
                completionDate.getMonth() + monthsToComplete
              );

              const isOnTrack = goal.deadline
                ? completionDate <= new Date(goal.deadline)
                : true;

              insights.push({
                type: this.insightTypes.GOAL_PREDICTION,
                title: isOnTrack
                  ? "🎯 Meta no Caminho Certo!"
                  : "⚠️ Meta em Risco",
                message: `Com o ritmo atual, você atingirá a meta "${goal.name}" em ${monthsToComplete} mês(es).`,
                impact: isOnTrack ? "positive" : "negative",
                priority: isOnTrack ? 6 : 8,
                data: {
                  goalName: goal.name,
                  remaining,
                  avgPerMonth,
                  monthsToComplete,
                  estimatedDate: completionDate,
                  isOnTrack,
                },
              });
            }
          }
        }
      }
    } catch (error) {
      logger.error("Erro ao prever metas:", error);
    }

    return insights;
  }

  /**
   * 🚨 Detecta gastos incomuns (anomalias)
   */
  async detectAnomalies(userId) {
    const insights = [];

    try {
      // Últimos 90 dias para baseline
      const last90Days = new Date();
      last90Days.setDate(last90Days.getDate() - 90);

      // Últimos 7 dias para análise
      const last7Days = new Date();
      last7Days.setDate(last7Days.getDate() - 7);

      // Calcula média e desvio padrão por categoria
      const baselineStats = await Transaction.aggregate([
        {
          $match: {
            userId: userId,
            type: "expense",
            date: { $gte: last90Days, $lt: last7Days },
          },
        },
        {
          $group: {
            _id: "$category",
            avgAmount: { $avg: "$amount" },
            stdDev: { $stdDevPop: "$amount" },
            count: { $sum: 1 },
          },
        },
      ]);

      // Busca transações recentes que desviam muito da média
      const recentTransactions = await Transaction.find({
        userId,
        type: "expense",
        date: { $gte: last7Days },
      }).populate("category", "name");

      const statsMap = new Map(
        baselineStats.map((s) => [s._id?.toString(), s])
      );

      for (const transaction of recentTransactions) {
        const categoryId = transaction.category._id.toString();
        const stats = statsMap.get(categoryId);

        if (stats && stats.count >= 5) {
          const threshold = stats.avgAmount + 2 * stats.stdDev;

          if (transaction.amount > threshold) {
            insights.push({
              type: this.insightTypes.UNUSUAL_EXPENSE,
              title: "🚨 Gasto Incomum Detectado",
              message: `O gasto de R$ ${transaction.amount.toFixed(2)} em ${
                transaction.category.name
              } está acima do seu padrão habitual (média: R$ ${stats.avgAmount.toFixed(
                2
              )}).`,
              impact: "negative",
              priority: 7,
              data: {
                transactionId: transaction._id,
                category: transaction.category.name,
                amount: transaction.amount,
                avgAmount: stats.avgAmount,
                difference: transaction.amount - stats.avgAmount,
              },
            });
          }
        }
      }
    } catch (error) {
      console.warn("⚠️ Erro ao detectar anomalias:", error?.message || error);
      logger.error("Erro ao detectar anomalias:", {
        error: error?.message || error,
        stack: error?.stack,
        userId,
      });
    }

    return insights;
  }

  /**
   * 🏆 Detecta conquistas e marcos financeiros
   */
  async detectAchievements(userId) {
    const insights = [];

    try {
      // Verifica se economizou por 30 dias consecutivos
      const last30Days = new Date();
      last30Days.setDate(last30Days.getDate() - 30);

      const dailyBalance = await Transaction.aggregate([
        {
          $match: {
            userId: userId,
            date: { $gte: last30Days },
          },
        },
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m-%d", date: "$date" },
            },
            income: {
              $sum: {
                $cond: [{ $eq: ["$type", "income"] }, "$amount", 0],
              },
            },
            expenses: {
              $sum: {
                $cond: [{ $eq: ["$type", "expense"] }, "$amount", 0],
              },
            },
          },
        },
        {
          $project: {
            balance: { $subtract: ["$income", "$expenses"] },
          },
        },
        {
          $sort: { _id: 1 },
        },
      ]);

      const positiveDays = dailyBalance.filter((d) => d.balance >= 0).length;

      if (positiveDays >= 25) {
        insights.push({
          type: this.insightTypes.ACHIEVEMENT,
          title: "🏆 Conquista Desbloqueada!",
          message: `Você teve ${positiveDays} dias com saldo positivo nos últimos 30 dias! Continue assim!`,
          impact: "positive",
          priority: 9,
          data: {
            positiveDays,
            totalDays: dailyBalance.length,
            percentage: (positiveDays / dailyBalance.length) * 100,
          },
        });
      }
    } catch (error) {
      logger.error("Erro ao detectar conquistas:", error);
    }

    return insights;
  }

  /**
   * Helper: Busca nome da categoria
   */
  async getCategoryName(categoryId) {
    try {
      const Category = require("../models/Category");
      const category = await Category.findById(categoryId);
      return category ? category.name : "Outros";
    } catch (error) {
      return "Outros";
    }
  }

  /**
   * 💾 Salva insights no banco (opcional)
   */
  async saveInsights(userId, insights) {
    // Se você quiser persistir os insights:
    // const Insight = require('../models/Insight');
    // await Insight.insertMany(insights.map(i => ({ ...i, userId })));
    return insights;
  }

  /**
   * 📊 Calcula score financeiro (0-100)
   */
  async calculateFinancialScore(userId) {
    try {
      let score = 0;

      // Critério 1: Tem orçamentos definidos? (+20 pontos)
      const budgets = await Budget.find({ userId });
      if (budgets.length > 0) {
        score += 20;
      }

      // Critério 2: Está dentro dos orçamentos? (+20 pontos)
      const withinBudget = budgets.filter((b) => b.spent <= b.limit).length;
      if (budgets.length > 0) {
        score += Math.round((withinBudget / budgets.length) * 20);
      }

      // Critério 3: Tem metas ativas? (+15 pontos)
      const goals = await Goal.find({ userId, status: "active" });
      if (goals.length > 0) {
        score += 15;
      }

      // Critério 4: Registra transações regularmente? (+15 pontos)
      const last30Days = new Date();
      last30Days.setDate(last30Days.getDate() - 30);
      const recentTransactions = await Transaction.countDocuments({
        userId,
        date: { $gte: last30Days },
      });
      if (recentTransactions >= 10) score += 15;
      else if (recentTransactions >= 5) score += 10;
      else if (recentTransactions >= 1) score += 5;

      // Critério 5: Saldo positivo? (+15 pontos)
      const transactions = await Transaction.find({ userId });
      const income = transactions
        .filter((t) => t.type === "income")
        .reduce((sum, t) => sum + t.amount, 0);
      const expenses = transactions
        .filter((t) => t.type === "expense")
        .reduce((sum, t) => sum + t.amount, 0);
      if (income > expenses) {
        score += 15;
      } else if (income > expenses * 0.8) {
        score += 10;
      }

      // Critério 6: Economizando para metas? (+15 pontos)
      const goalsWithProgress = goals.filter((g) => g.currentAmount > 0).length;
      if (goals.length > 0) {
        score += Math.round((goalsWithProgress / goals.length) * 15);
      }

      return Math.min(score, 100);
    } catch (error) {
      logger.error("Erro ao calcular score:", error);
      return 0;
    }
  }

  /**
   * 🔍 Detecta padrões de gastos
   */
  async detectSpendingPatterns(userId) {
    return await this.detectCategoryPatterns(userId);
  }

  /**
   * 📈 Prevê gastos futuros
   */
  async predictFutureExpenses(userId) {
    try {
      const last90Days = new Date();
      last90Days.setDate(last90Days.getDate() - 90);

      const expenses = await Transaction.aggregate([
        {
          $match: {
            userId,
            type: "expense",
            date: { $gte: last90Days },
          },
        },
        {
          $group: {
            _id: "$category",
            avgAmount: { $avg: "$amount" },
            count: { $sum: 1 },
          },
        },
        {
          $lookup: {
            from: "categories",
            localField: "_id",
            foreignField: "_id",
            as: "category",
          },
        },
        {
          $unwind: "$category",
        },
      ]);

      const totalPredicted = expenses.reduce(
        (sum, e) => sum + e.avgAmount * (e.count / 3),
        0
      );

      return {
        totalPredicted,
        byCategory: expenses.map((e) => ({
          category: e.category.name,
          predicted: e.avgAmount * (e.count / 3),
          confidence: Math.min(e.count / 30, 1) * 100,
        })),
        confidence: expenses.length > 0 ? 75 : 50,
      };
    } catch (error) {
      logger.error("Erro ao prever gastos:", error);
      return { totalPredicted: 0, byCategory: [], confidence: 0 };
    }
  }

  /**
   * 💡 Gera sugestões de economia
   */
  async generateSavingsSuggestions(userId) {
    return await this.findSavingsOpportunities(userId);
  }

  /**
   * 📊 Compara performance dos orçamentos
   */
  async compareBudgetPerformance(userId) {
    try {
      const budgets = await Budget.find({ userId }).populate(
        "category",
        "name"
      );

      const performance = budgets.map((budget) => {
        const percentage = (budget.spent / budget.limit) * 100;
        let status = "good";
        if (percentage >= 100) status = "exceeded";
        else if (percentage >= 80) status = "warning";

        return {
          category: budget.category.name,
          limit: budget.limit,
          spent: budget.spent,
          remaining: budget.limit - budget.spent,
          percentage: Math.min(percentage, 100),
          status,
        };
      });

      return {
        budgets: performance,
        summary: {
          total: budgets.length,
          exceeded: performance.filter((p) => p.status === "exceeded").length,
          warning: performance.filter((p) => p.status === "warning").length,
          good: performance.filter((p) => p.status === "good").length,
        },
      };
    } catch (error) {
      logger.error("Erro ao comparar orçamentos:", error);
      return {
        budgets: [],
        summary: { total: 0, exceeded: 0, warning: 0, good: 0 },
      };
    }
  }
}

module.exports = new InsightsEngine();
