import { useQuery } from "react-query";
import api from "../services/api";

export function useDashboardData() {
  const {
    data: summary,
    isLoading: summaryLoading,
    refetch: refetchSummary,
  } = useQuery(
    "dashboardSummary",
    () =>
      api
        .get("/reports/summary?period=month")
        .then((res) => res.data?.data || res.data || {}),
    {
      staleTime: 1000 * 60 * 5,
      retry: 2,
      retryDelay: 1000,
      onError: (error) => {
        console.error("Erro ao buscar resumo do dashboard:", error);
      },
    }
  );

  const {
    data: monthlyData,
    isLoading: monthlyLoading,
    refetch: refetchMonthly,
  } = useQuery(
    "dashboardMonthly",
    () =>
      api
        .get("/reports/monthly?months=6")
        .then((res) => res.data?.data || res.data || {}),
    {
      staleTime: 1000 * 60 * 5,
      retry: 2,
      retryDelay: 1000,
      onError: (error) => {
        console.error("Erro ao buscar dados mensais:", error);
      },
    }
  );

  const {
    data: categoriesData,
    isLoading: categoriesLoading,
    refetch: refetchCategories,
  } = useQuery(
    "dashboardCategories",
    () =>
      api
        .get("/reports/categories?period=month")
        .then((res) => res.data?.data || res.data || {}),
    {
      staleTime: 1000 * 60 * 5,
      retry: 2,
      retryDelay: 1000,
      onError: (error) => {
        console.error("Erro ao buscar dados de categorias:", error);
      },
    }
  );

  const {
    data: recentTransactions,
    isLoading: transactionsLoading,
    refetch: refetchTransactions,
  } = useQuery(
    "recentTransactions",
    () =>
      api
        .get("/transactions", {
          params: { limit: 5, sortField: "date", sortDirection: "desc" },
        })
        .then((res) => {
          const transactions = res.data?.data || res.data || [];
          return Array.isArray(transactions) ? transactions : [];
        }),
    {
      staleTime: 1000 * 60,
      retry: 2,
      retryDelay: 1000,
      onError: (error) => {
        console.error("Erro ao buscar transações recentes:", error);
      },
    }
  );

  const {
    data: budgetProgress,
    isLoading: budgetLoading,
    refetch: refetchBudgets,
  } = useQuery(
    "budgetProgress",
    () =>
      api.get("/budgets/progress").then((res) => {
        const budgets = res.data?.data || res.data || [];
        return Array.isArray(budgets) ? budgets : [];
      }),
    {
      staleTime: 1000 * 60,
      retry: 2,
      retryDelay: 1000,
      onError: (error) => {
        console.error("Erro ao buscar progresso dos orçamentos:", error);
      },
    }
  );

  const refreshData = async () => {
    try {
      await Promise.all([
        refetchSummary(),
        refetchMonthly(),
        refetchCategories(),
        refetchTransactions(),
        refetchBudgets(),
      ]);
    } catch (error) {
      console.error("Erro ao atualizar dados:", error);
      throw error;
    }
  };

  return {
    summary: summary || {},
    monthlyData: monthlyData || { labels: [], income: [], expenses: [] },
    categoriesData: categoriesData || { labels: [], data: [] },
    recentTransactions: Array.isArray(recentTransactions)
      ? recentTransactions
      : [],
    budgetProgress: Array.isArray(budgetProgress) ? budgetProgress : [],
    isLoading:
      summaryLoading ||
      monthlyLoading ||
      categoriesLoading ||
      transactionsLoading ||
      budgetLoading,
    refreshData,
    error: null, // Adicionar tratamento de erro se necessário
  };
}
