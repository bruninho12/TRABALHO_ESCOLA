/**
 * @fileoverview Rotas de Insights Inteligentes
 * Endpoints para análises e sugestões personalizadas
 */

const express = require("express");
const router = express.Router();
const insightsController = require("../controllers/insightsController");
const { authenticate } = require("../middleware/auth");

// ==================== ROTAS DE INSIGHTS ====================

/**
 * @route   GET /api/insights
 * @desc    Obtém todos os insights do usuário
 * @access  Private
 */
router.get("/", authenticate, insightsController.getInsights);

/**
 * @route   GET /api/insights/score
 * @desc    Obtém score financeiro do usuário (0-100)
 * @access  Private
 */
router.get("/score", authenticate, insightsController.getFinancialScore);

/**
 * @route   GET /api/insights/trends
 * @desc    Análise de tendências de gastos
 * @access  Private
 */
router.get("/trends", authenticate, insightsController.getSpendingTrends);

/**
 * @route   GET /api/insights/patterns
 * @desc    Detecção de padrões de gastos
 * @access  Private
 */
router.get("/patterns", authenticate, insightsController.getSpendingPatterns);

/**
 * @route   GET /api/insights/prediction
 * @desc    Previsão de gastos futuros
 * @access  Private
 */
router.get(
  "/prediction",
  authenticate,
  insightsController.getExpensePrediction
);

/**
 * @route   GET /api/insights/suggestions
 * @desc    Sugestões de economia personalizadas
 * @access  Private
 */
router.get(
  "/suggestions",
  authenticate,
  insightsController.getSavingsSuggestions
);

/**
 * @route   GET /api/insights/budget-comparison
 * @desc    Comparação de desempenho dos orçamentos
 * @access  Private
 */
router.get(
  "/budget-comparison",
  authenticate,
  insightsController.getBudgetComparison
);

/**
 * @route   GET /api/insights/report
 * @desc    Relatório completo de insights
 * @access  Private
 */
router.get("/report", authenticate, insightsController.getInsightsReport);

module.exports = router;
