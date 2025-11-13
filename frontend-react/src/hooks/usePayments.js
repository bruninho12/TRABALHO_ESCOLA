/**
 * Hook customizado para gerenciar Pagamentos
 * Responsável por operações CRUD de pagamentos
 */

import { useState, useCallback } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

export const usePayments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Obter token de autorização
  const getAuthHeader = useCallback(() => {
    const token = localStorage.getItem("finance_flow_token");
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  }, []);

  // Listar pagamentos
  const listPayments = useCallback(
    async (filters = {}) => {
      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams();
        if (filters.status) params.append("status", filters.status);
        if (filters.startDate) params.append("startDate", filters.startDate);
        if (filters.endDate) params.append("endDate", filters.endDate);

        const response = await axios.get(
          `${API_URL}/payments${
            params.toString() ? "?" + params.toString() : ""
          }`,
          { headers: getAuthHeader() }
        );

        if (response.data.data) {
          setPayments(
            Array.isArray(response.data.data) ? response.data.data : []
          );
        }

        return response.data;
      } catch (err) {
        const errorMsg = err.response?.data?.message || err.message;
        setError(errorMsg);
        console.error("Erro ao listar pagamentos:", errorMsg);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [getAuthHeader]
  );

  // Criar pagamento
  const createPayment = useCallback(
    async (paymentData) => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.post(`${API_URL}/payments`, paymentData, {
          headers: getAuthHeader(),
        });

        if (response.data.data) {
          setPayments((prev) => [...prev, response.data.data]);
        }

        return response.data;
      } catch (err) {
        const errorMsg = err.response?.data?.message || err.message;
        setError(errorMsg);
        console.error("Erro ao criar pagamento:", errorMsg);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [getAuthHeader]
  );

  // Obter pagamento por ID
  const getPayment = useCallback(
    async (paymentId) => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.get(`${API_URL}/payments/${paymentId}`, {
          headers: getAuthHeader(),
        });

        return response.data;
      } catch (err) {
        const errorMsg = err.response?.data?.message || err.message;
        setError(errorMsg);
        console.error("Erro ao obter pagamento:", errorMsg);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [getAuthHeader]
  );

  // Atualizar pagamento
  const updatePayment = useCallback(
    async (paymentId, updateData) => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.put(
          `${API_URL}/payments/${paymentId}`,
          updateData,
          { headers: getAuthHeader() }
        );

        setPayments((prev) =>
          prev.map((p) => (p._id === paymentId ? response.data.data : p))
        );

        return response.data;
      } catch (err) {
        const errorMsg = err.response?.data?.message || err.message;
        setError(errorMsg);
        console.error("Erro ao atualizar pagamento:", errorMsg);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [getAuthHeader]
  );

  // Deletar pagamento
  const deletePayment = useCallback(
    async (paymentId) => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.delete(
          `${API_URL}/payments/${paymentId}`,
          { headers: getAuthHeader() }
        );

        setPayments((prev) => prev.filter((p) => p._id !== paymentId));

        return response.data;
      } catch (err) {
        const errorMsg = err.response?.data?.message || err.message;
        setError(errorMsg);
        console.error("Erro ao deletar pagamento:", errorMsg);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [getAuthHeader]
  );

  // Processar pagamento
  const processPayment = useCallback(
    async (paymentId, method = "card") => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.post(
          `${API_URL}/payments/${paymentId}/process`,
          { method },
          { headers: getAuthHeader() }
        );

        // Atualizar status do pagamento na lista
        setPayments((prev) =>
          prev.map((p) =>
            p._id === paymentId ? { ...p, status: "processed" } : p
          )
        );

        return response.data;
      } catch (err) {
        const errorMsg = err.response?.data?.message || err.message;
        setError(errorMsg);
        console.error("Erro ao processar pagamento:", errorMsg);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [getAuthHeader]
  );

  // Confirmar pagamento
  const confirmPayment = useCallback(
    async (paymentId) => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.post(
          `${API_URL}/payments/${paymentId}/confirm`,
          {},
          { headers: getAuthHeader() }
        );

        setPayments((prev) =>
          prev.map((p) =>
            p._id === paymentId ? { ...p, status: "confirmed" } : p
          )
        );

        return response.data;
      } catch (err) {
        const errorMsg = err.response?.data?.message || err.message;
        setError(errorMsg);
        console.error("Erro ao confirmar pagamento:", errorMsg);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [getAuthHeader]
  );

  // Obter resumo de pagamentos
  const getPaymentSummary = useCallback(
    async (period = "month") => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.get(
          `${API_URL}/payments/summary?period=${period}`,
          { headers: getAuthHeader() }
        );

        return response.data;
      } catch (err) {
        const errorMsg = err.response?.data?.message || err.message;
        setError(errorMsg);
        console.error("Erro ao obter resumo de pagamentos:", errorMsg);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [getAuthHeader]
  );

  return {
    payments,
    loading,
    error,
    listPayments,
    createPayment,
    getPayment,
    updatePayment,
    deletePayment,
    processPayment,
    confirmPayment,
    getPaymentSummary,
  };
};

export default usePayments;
