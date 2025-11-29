/**
 * @fileoverview Rotas de Insights Inteligentes
 * Endpoints para análises e sugestões personalizadas
 */

const express = require("express");
const router = express.Router();
const insightsController = require("../controllers/insightsController");
const { authenticate } = require("../middleware/auth");
const {
  checkPremium,
  addSubscriptionInfo,
} = require("../middleware/checkPremium");

// ==================== ROTAS DE INSIGHTS ====================

/**
 * @route   GET /api/insights
 * @desc    Obtém todos os insights do usuário (básico: FREE, avançado: PREMIUM)
 * @access  Private
 */
router.get(
  "/",
  authenticate,
  addSubscriptionInfo,
  insightsController.getInsights
);

/**
 * @route   GET /api/insights/score
 * @desc    Obtém score financeiro do usuário (0-100)
 * @access  Private
 */
router.get("/score", authenticate, insightsController.getFinancialScore);

/**
 * @route   GET /api/insights/trends
 * @desc    Análise de tendências de gastos (PREMIUM APENAS)
 * @access  Private (Premium)
 */
router.get(
  "/trends",
  authenticate,
  checkPremium,
  insightsController.getSpendingTrends
);

/**
 * @route   GET /api/insights/patterns
 * @desc    Detecção de padrões de gastos (PREMIUM APENAS)
 * @access  Private (Premium)
 */
router.get(
  "/patterns",
  authenticate,
  checkPremium,
  insightsController.getSpendingPatterns
);

/**
 * @route   GET /api/insights/prediction
 * @desc    Previsão de gastos futuros (PREMIUM APENAS)
 * @access  Private (Premium)
 */
router.get(
  "/prediction",
  authenticate,
  checkPremium,
  insightsController.getExpensePrediction
);

/**
 * @route   GET /api/insights/suggestions
 * @desc    Sugestões de economia personalizadas (PREMIUM APENAS)
 * @access  Private (Premium)
 */
router.get(
  "/suggestions",
  authenticate,
  checkPremium,
  insightsController.getSavingsSuggestions
);

/**
 * @route   GET /api/insights/budget-comparison
 * @desc    Comparação de desempenho dos orçamentos (PREMIUM APENAS)
 * @access  Private (Premium)
 */
router.get(
  "/budget-comparison",
  authenticate,
  checkPremium,
  insightsController.getBudgetComparison
);

/**
 * @route   GET /api/insights/report
 * @desc    Relatório completo de insights (PREMIUM APENAS)
 * @access  Private (Premium)
 */
router.get(
  "/report",
  authenticate,
  checkPremium,
  insightsController.getInsightsReport
);

module.exports = router;
