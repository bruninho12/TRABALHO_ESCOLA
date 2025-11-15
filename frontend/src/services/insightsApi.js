/**
 * 🤖 API de Insights
 * Comunicação com o backend para insights inteligentes
 */

import api from "./api";

/**
 * Busca todos os insights do usuário
 */
export const getInsights = async () => {
  try {
    const response = await api.get("/insights");
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar insights:", error);
    throw error;
  }
};

/**
 * Busca o score financeiro
 */
export const getFinancialScore = async () => {
  try {
    const response = await api.get("/insights/score");
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar score:", error);
    throw error;
  }
};

/**
 * Busca tendências de gastos
 */
export const getSpendingTrends = async () => {
  try {
    const response = await api.get("/insights/trends");
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar tendências:", error);
    throw error;
  }
};

/**
 * Busca padrões de gastos
 */
export const getSpendingPatterns = async () => {
  try {
    const response = await api.get("/insights/patterns");
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar padrões:", error);
    throw error;
  }
};

/**
 * Busca previsão de gastos
 */
export const getExpensePrediction = async () => {
  try {
    const response = await api.get("/insights/prediction");
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar previsão:", error);
    throw error;
  }
};

/**
 * Busca sugestões de economia
 */
export const getSavingsSuggestions = async () => {
  try {
    const response = await api.get("/insights/suggestions");
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar sugestões:", error);
    throw error;
  }
};

/**
 * Busca comparação de orçamentos
 */
export const getBudgetComparison = async () => {
  try {
    const response = await api.get("/insights/budget-comparison");
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar comparação:", error);
    throw error;
  }
};

/**
 * Busca relatório completo de insights
 */
export const getInsightsReport = async () => {
  try {
    const response = await api.get("/insights/report");
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar relatório:", error);
    throw error;
  }
};

export default {
  getInsights,
  getFinancialScore,
  getSpendingTrends,
  getSpendingPatterns,
  getExpensePrediction,
  getSavingsSuggestions,
  getBudgetComparison,
  getInsightsReport,
};
