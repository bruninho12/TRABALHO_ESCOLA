/**
 * Hook customizado para gerenciar Relatórios
 * Responsável por obter dados de financeiros e gerar relatórios
 */

import { useState, useCallback } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

export const useReports = () => {
  const [reports, setReports] = useState({
    cashFlow: [],
    expensesByCategory: [],
    monthlyBalance: [],
    summary: null,
  });

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

  // Obter fluxo de caixa
  const getCashFlow = useCallback(
    async (startDate = null, endDate = null) => {
      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams();
        if (startDate) params.append("startDate", startDate);
        if (endDate) params.append("endDate", endDate);

        const response = await axios.get(
          `${API_URL}/finance/cash-flow${
            params.toString() ? "?" + params.toString() : ""
          }`,
          { headers: getAuthHeader() }
        );

        if (response.data.data) {
          setReports((prev) => ({
            ...prev,
            cashFlow: response.data.data,
          }));
        }

        return response.data;
      } catch (err) {
        const errorMsg = err.response?.data?.message || err.message;
        setError(errorMsg);
        console.error("Erro ao obter fluxo de caixa:", errorMsg);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [getAuthHeader]
  );

  // Obter despesas por categoria
  const getExpensesByCategory = useCallback(
    async (startDate = null, endDate = null) => {
      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams();
        if (startDate) params.append("startDate", startDate);
        if (endDate) params.append("endDate", endDate);

        const response = await axios.get(
          `${API_URL}/finance/expenses-by-category${
            params.toString() ? "?" + params.toString() : ""
          }`,
          { headers: getAuthHeader() }
        );

        if (response.data.data) {
          setReports((prev) => ({
            ...prev,
            expensesByCategory: response.data.data,
          }));
        }

        return response.data;
      } catch (err) {
        const errorMsg = err.response?.data?.message || err.message;
        setError(errorMsg);
        console.error("Erro ao obter despesas por categoria:", errorMsg);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [getAuthHeader]
  );

  // Obter saldo mensal
  const getMonthlyBalance = useCallback(
    async (period = 12) => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.get(
          `${API_URL}/finance/monthly-balance?period=${period}`,
          { headers: getAuthHeader() }
        );

        if (response.data.data) {
          setReports((prev) => ({
            ...prev,
            monthlyBalance: response.data.data,
          }));
        }

        return response.data;
      } catch (err) {
        const errorMsg = err.response?.data?.message || err.message;
        setError(errorMsg);
        console.error("Erro ao obter saldo mensal:", errorMsg);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [getAuthHeader]
  );

  // Obter resumo financeiro
  const getFinancialSummary = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(`${API_URL}/finance/summary`, {
        headers: getAuthHeader(),
      });

      if (response.data.data) {
        setReports((prev) => ({
          ...prev,
          summary: response.data.data,
        }));
      }

      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message;
      setError(errorMsg);
      console.error("Erro ao obter resumo financeiro:", errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [getAuthHeader]);

  // Obter dashboard completo
  const getDashboard = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(`${API_URL}/finance/dashboard`, {
        headers: getAuthHeader(),
      });

      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message;
      setError(errorMsg);
      console.error("Erro ao obter dashboard:", errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [getAuthHeader]);

  // Exportar relatório como PDF
  const exportToPDF = useCallback(
    async (reportType = "complete") => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.get(
          `${API_URL}/finance/export/pdf?type=${reportType}`,
          {
            headers: getAuthHeader(),
            responseType: "blob",
          }
        );

        // Criar URL de download
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `relatorio-financeiro-${Date.now()}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
        window.URL.revokeObjectURL(url);

        return { success: true };
      } catch (err) {
        const errorMsg = err.response?.data?.message || err.message;
        setError(errorMsg);
        console.error("Erro ao exportar PDF:", errorMsg);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [getAuthHeader]
  );

  // Exportar relatório como CSV
  const exportToCSV = useCallback(
    async (reportType = "transactions") => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.get(
          `${API_URL}/finance/export/csv?type=${reportType}`,
          {
            headers: getAuthHeader(),
            responseType: "blob",
          }
        );

        // Criar URL de download
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute(
          "download",
          `relatorio-${reportType}-${Date.now()}.csv`
        );
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
        window.URL.revokeObjectURL(url);

        return { success: true };
      } catch (err) {
        const errorMsg = err.response?.data?.message || err.message;
        setError(errorMsg);
        console.error("Erro ao exportar CSV:", errorMsg);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [getAuthHeader]
  );

  // Comparar períodos
  const comparePeriods = useCallback(
    async (period1Start, period1End, period2Start, period2End) => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.post(
          `${API_URL}/finance/compare`,
          {
            period1: { start: period1Start, end: period1End },
            period2: { start: period2Start, end: period2End },
          },
          { headers: getAuthHeader() }
        );

        return response.data;
      } catch (err) {
        const errorMsg = err.response?.data?.message || err.message;
        setError(errorMsg);
        console.error("Erro ao comparar períodos:", errorMsg);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [getAuthHeader]
  );

  // Obter previsão
  const getForecast = useCallback(
    async (months = 6) => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.get(
          `${API_URL}/finance/forecast?months=${months}`,
          { headers: getAuthHeader() }
        );

        return response.data;
      } catch (err) {
        const errorMsg = err.response?.data?.message || err.message;
        setError(errorMsg);
        console.error("Erro ao obter previsão:", errorMsg);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [getAuthHeader]
  );

  return {
    reports,
    loading,
    error,
    getCashFlow,
    getExpensesByCategory,
    getMonthlyBalance,
    getFinancialSummary,
    getDashboard,
    exportToPDF,
    exportToCSV,
    comparePeriods,
    getForecast,
  };
};

export default useReports;
