/**
 * @fileoverview Controller de Insights Inteligentes
 * Fornece análises e sugestões personalizadas para o usuário
 */

const insightsEngine = require("../services/insightsEngine");
const { logger } = require("../utils/logger");

class InsightsController {
  /**
   * Obtém todos os insights do usuário
   * GET /api/insights
   */
  async getInsights(req, res) {
    try {
      console.log("🔍 [DEBUG] getInsights - req.user:", req.user);

      if (!req.user || !req.user._id) {
        return res.status(401).json({
          success: false,
          message: "Usuário não autenticado",
        });
      }

      const userId = req.user._id;
      console.log("🔍 [DEBUG] userId:", userId);

      const insights = await insightsEngine.generateInsights(userId);

      res.json({
        success: true,
        count: insights.length,
        data: insights,
      });
    } catch (error) {
      console.error("❌ [ERROR] getInsights:", error);
      logger.error(`Error getting insights: ${error.message}`);
      res.status(500).json({
        success: false,
        message: "Erro ao buscar insights",
        error: error.message,
      });
    }
  }

  /**
   * Obtém score financeiro do usuário
   * GET /api/insights/score
   */
  async getFinancialScore(req, res) {
    try {
      const userId = req.user._id;

      const score = await insightsEngine.calculateFinancialScore(userId);

      // Determinar nível baseado no score
      let level = "Iniciante";
      let color = "#EF4444";
      if (score >= 80) {
        level = "Mestre";
        color = "#10B981";
      } else if (score >= 60) {
        level = "Avançado";
        color = "#3B82F6";
      } else if (score >= 40) {
        level = "Intermediário";
        color = "#F59E0B";
      }

      res.json({
        success: true,
        data: {
          score,
          level,
          color,
          message: this.getScoreMessage(score),
        },
      });
    } catch (error) {
      logger.error(`Error getting financial score: ${error.message}`);
      res.status(500).json({
        success: false,
        message: "Erro ao calcular score financeiro",
        error: error.message,
      });
    }
  }

  /**
   * Obtém tendências de gastos
   * GET /api/insights/trends
   */
  async getSpendingTrends(req, res) {
    try {
      const userId = req.user._id;

      const trend = await insightsEngine.analyzeSpendingTrends(userId);

      res.json({
        success: true,
        data: trend,
      });
    } catch (error) {
      logger.error(`Error getting spending trends: ${error.message}`);
      res.status(500).json({
        success: false,
        message: "Erro ao analisar tendências",
        error: error.message,
      });
    }
  }

  /**
   * Obtém padrões de gastos
   * GET /api/insights/patterns
   */
  async getSpendingPatterns(req, res) {
    try {
      const userId = req.user._id;

      const patterns = await insightsEngine.detectSpendingPatterns(userId);

      res.json({
        success: true,
        count: patterns.length,
        data: patterns,
      });
    } catch (error) {
      logger.error(`Error getting spending patterns: ${error.message}`);
      res.status(500).json({
        success: false,
        message: "Erro ao detectar padrões",
        error: error.message,
      });
    }
  }

  /**
   * Obtém previsão de gastos
   * GET /api/insights/prediction
   */
  async getExpensePrediction(req, res) {
    try {
      const userId = req.user._id;

      const prediction = await insightsEngine.predictFutureExpenses(userId);

      res.json({
        success: true,
        data: prediction,
      });
    } catch (error) {
      logger.error(`Error getting expense prediction: ${error.message}`);
      res.status(500).json({
        success: false,
        message: "Erro ao prever gastos",
        error: error.message,
      });
    }
  }

  /**
   * Obtém sugestões de economia
   * GET /api/insights/suggestions
   */
  async getSavingsSuggestions(req, res) {
    try {
      const userId = req.user._id;

      const suggestions = await insightsEngine.generateSavingsSuggestions(
        userId
      );

      res.json({
        success: true,
        count: suggestions.length,
        data: suggestions,
      });
    } catch (error) {
      logger.error(`Error getting savings suggestions: ${error.message}`);
      res.status(500).json({
        success: false,
        message: "Erro ao gerar sugestões",
        error: error.message,
      });
    }
  }

  /**
   * Obtém comparação de orçamentos
   * GET /api/insights/budget-comparison
   */
  async getBudgetComparison(req, res) {
    try {
      const userId = req.user._id;

      const comparison = await insightsEngine.compareBudgetPerformance(userId);

      res.json({
        success: true,
        data: comparison,
      });
    } catch (error) {
      logger.error(`Error getting budget comparison: ${error.message}`);
      res.status(500).json({
        success: false,
        message: "Erro ao comparar orçamentos",
        error: error.message,
      });
    }
  }

  /**
   * Obtém relatório completo de insights
   * GET /api/insights/report
   */
  async getInsightsReport(req, res) {
    try {
      const userId = req.user._id;

      // Gerar todos os dados
      const [
        insights,
        score,
        trends,
        patterns,
        prediction,
        suggestions,
        budgetComparison,
      ] = await Promise.all([
        insightsEngine.generateInsights(userId),
        insightsEngine.calculateFinancialScore(userId),
        insightsEngine.analyzeSpendingTrends(userId),
        insightsEngine.detectSpendingPatterns(userId),
        insightsEngine.predictFutureExpenses(userId),
        insightsEngine.generateSavingsSuggestions(userId),
        insightsEngine.compareBudgetPerformance(userId),
      ]);

      // Determinar nível do score
      let level = "Iniciante";
      let color = "#EF4444";
      if (score >= 80) {
        level = "Mestre";
        color = "#10B981";
      } else if (score >= 60) {
        level = "Avançado";
        color = "#3B82F6";
      } else if (score >= 40) {
        level = "Intermediário";
        color = "#F59E0B";
      }

      res.json({
        success: true,
        data: {
          summary: {
            totalInsights: insights.length,
            score: {
              value: score,
              level,
              color,
              message: this.getScoreMessage(score),
            },
          },
          insights: insights,
          trends: trends,
          patterns: patterns,
          prediction: prediction,
          suggestions: suggestions,
          budgetComparison: budgetComparison,
          generatedAt: new Date(),
        },
      });
    } catch (error) {
      logger.error(`Error getting insights report: ${error.message}`);
      res.status(500).json({
        success: false,
        message: "Erro ao gerar relatório de insights",
        error: error.message,
      });
    }
  }

  /**
   * Mensagem personalizada baseada no score
   */
  getScoreMessage(score) {
    if (score >= 90) {
      return "Excelente! Você é um mestre das finanças! 🏆";
    } else if (score >= 80) {
      return "Muito bom! Suas finanças estão sob controle! 🎯";
    } else if (score >= 60) {
      return "Bom trabalho! Continue assim! 👍";
    } else if (score >= 40) {
      return "Você está no caminho certo! Pequenas melhorias fazem diferença. 💪";
    } else if (score >= 20) {
      return "Há espaço para melhorias. Vamos trabalhar nisso juntos! 🌱";
    } else {
      return "Comece definindo orçamentos e metas. Você consegue! 🚀";
    }
  }
}

// Criar instância e exportar
const controller = new InsightsController();

module.exports = {
  getInsights: (req, res) => controller.getInsights(req, res),
  getFinancialScore: (req, res) => controller.getFinancialScore(req, res),
  getSpendingTrends: (req, res) => controller.getSpendingTrends(req, res),
  getSpendingPatterns: (req, res) => controller.getSpendingPatterns(req, res),
  getExpensePrediction: (req, res) => controller.getExpensePrediction(req, res),
  getSavingsSuggestions: (req, res) =>
    controller.getSavingsSuggestions(req, res),
  getBudgetComparison: (req, res) => controller.getBudgetComparison(req, res),
  getInsightsReport: (req, res) => controller.getInsightsReport(req, res),
};
