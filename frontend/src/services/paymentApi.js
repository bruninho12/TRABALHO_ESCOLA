/**
 * Payment API Service
 * Centraliza todas as chamadas para a API de pagamentos
 */

import api from "./api";

// ==================== MERCADO PAGO ====================

/**
 * Criar preferência de pagamento (Checkout Pro)
 */
export const createMercadoPagoPreference = async (data) => {
  try {
    const response = await api.post("/payments/mercadopago/preference", data);
    return response.data;
  } catch (error) {
    console.error("Erro ao criar preferência MercadoPago:", error);
    throw error;
  }
};

/**
 * Criar pagamento PIX direto
 */
export const createPixPayment = async (data) => {
  try {
    const response = await api.post("/payments/mercadopago/create-pix", {
      ...data,
      paymentMethodId: "pix",
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao criar pagamento PIX:", error);
    throw error;
  }
};

/**
 * Criar pagamento direto (cartão, etc)
 */
export const createDirectPayment = async (data) => {
  try {
    const response = await api.post("/payments/mercadopago/direct", data);
    return response.data;
  } catch (error) {
    console.error("Erro ao criar pagamento direto:", error);
    throw error;
  }
};

/**
 * Obter métodos de pagamento disponíveis
 */
export const getPaymentMethods = async () => {
  try {
    const response = await api.get("/payments/mercadopago/methods");
    return response.data;
  } catch (error) {
    console.error("Erro ao obter métodos de pagamento:", error);
    throw error;
  }
};

// ==================== PAGAMENTOS GERAIS ====================

/**
 * Listar pagamentos do usuário
 */
export const getPayments = async (params = {}) => {
  try {
    const response = await api.get("/payments", { params });
    return response.data;
  } catch (error) {
    console.error("Erro ao obter pagamentos:", error);
    throw error;
  }
};

/**
 * Obter estatísticas de pagamentos
 */
export const getPaymentStats = async () => {
  try {
    const response = await api.get("/payments/stats");
    return response.data;
  } catch (error) {
    console.error("Erro ao obter estatísticas:", error);
    throw error;
  }
};

/**
 * Obter detalhes de um pagamento
 */
export const getPaymentById = async (id) => {
  try {
    const response = await api.get(`/payments/${id}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao obter pagamento:", error);
    throw error;
  }
};

/**
 * Confirmar pagamento
 */
export const confirmPayment = async (data) => {
  try {
    const response = await api.post("/payments/confirm", data);
    return response.data;
  } catch (error) {
    console.error("Erro ao confirmar pagamento:", error);
    throw error;
  }
};

/**
 * Solicitar reembolso
 */
export const refundPayment = async (id, data) => {
  try {
    const response = await api.post(`/payments/${id}/refund`, data);
    return response.data;
  } catch (error) {
    console.error("Erro ao solicitar reembolso:", error);
    throw error;
  }
};

/**
 * Cancelar pagamento
 */
export const cancelPayment = async (id) => {
  try {
    const response = await api.delete(`/payments/${id}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao cancelar pagamento:", error);
    throw error;
  }
};

// ==================== ASSINATURAS ====================

/**
 * Obter assinatura atual do usuário
 */
export const getSubscription = async () => {
  try {
    const response = await api.get("/payments/subscription");
    return response.data;
  } catch (error) {
    console.error("Erro ao obter assinatura:", error);
    throw error;
  }
};

/**
 * Criar assinatura premium
 */
export const createSubscription = async (
  plan,
  paymentMethod = "mercadopago"
) => {
  try {
    const planPrices = {
      bronze: 0,
      silver: 9.9,
      gold: 19.9,
      platinum: 29.9,
    };

    const response = await api.post("/payments", {
      type: "subscription",
      amount: planPrices[plan],
      description: `Assinatura ${plan.toUpperCase()} - DespFinancee`,
      item: {
        name: plan,
        description: `Plano ${plan.charAt(0).toUpperCase() + plan.slice(1)}`,
        price: planPrices[plan],
      },
      paymentProvider: paymentMethod,
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao criar assinatura:", error);
    throw error;
  }
};

/**
 * Atualizar plano da assinatura
 */
export const updateSubscription = async (newPlan) => {
  try {
    const response = await api.put("/payments/subscription", { plan: newPlan });
    return response.data;
  } catch (error) {
    console.error("Erro ao atualizar assinatura:", error);
    throw error;
  }
};

/**
 * Cancelar assinatura
 */
export const cancelSubscription = async () => {
  try {
    const response = await api.delete("/payments/subscription");
    return response.data;
  } catch (error) {
    console.error("Erro ao cancelar assinatura:", error);
    throw error;
  }
};

// ==================== UTILS ====================

/**
 * Verificar status de um pagamento
 */
export const checkPaymentStatus = async (paymentId) => {
  try {
    const response = await api.get(`/payments/${paymentId}/status`);
    return response.data;
  } catch (error) {
    console.error("Erro ao verificar status:", error);
    throw error;
  }
};

/**
 * Obter histórico de transações
 */
export const getTransactionHistory = async (params = {}) => {
  try {
    const response = await api.get("/payments/history", { params });
    return response.data;
  } catch (error) {
    console.error("Erro ao obter histórico:", error);
    throw error;
  }
};

/**
 * Remover método de pagamento
 */
export const removePaymentMethod = async (methodId) => {
  try {
    const response = await api.delete(`/payments/methods/${methodId}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao remover método de pagamento:", error);
    throw error;
  }
};

/**
 * Definir método de pagamento padrão
 */
export const setDefaultPaymentMethod = async (methodId) => {
  try {
    const response = await api.put(`/payments/methods/${methodId}/default`);
    return response.data;
  } catch (error) {
    console.error("Erro ao definir método padrão:", error);
    throw error;
  }
};

// Exportação default com todos os métodos
export default {
  // MercadoPago
  createMercadoPagoPreference,
  createPixPayment,
  createDirectPayment,
  getPaymentMethods,

  // Pagamentos gerais
  getPayments,
  getPaymentStats,
  getPaymentById,
  confirmPayment,
  refundPayment,
  cancelPayment,

  // Assinaturas
  getSubscription,
  createSubscription,
  updateSubscription,
  cancelSubscription,

  // Utils
  checkPaymentStatus,
  getTransactionHistory,
  removePaymentMethod,
  setDefaultPaymentMethod,
};
