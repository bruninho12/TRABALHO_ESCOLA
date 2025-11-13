import { useQuery } from "react-query";
import api from "../services/api";

export function useDashboardData() {
  const { data: summary, isLoading: summaryLoading } = useQuery(
    "dashboardSummary",
    () =>
      api
        .get("/reports/summary?period=month")
        .then((res) => res.data?.data || res.data || {}),
    { staleTime: 1000 * 60 * 5, enabled: false } // Desabilitado por enquanto
  );

  const { data: monthlyData, isLoading: monthlyLoading } = useQuery(
    "dashboardMonthly",
    () =>
      api
        .get("/reports/monthly?months=6")
        .then((res) => res.data?.data || res.data || {}),
    { staleTime: 1000 * 60 * 5, enabled: false }
  );

  const { data: categoriesData, isLoading: categoriesLoading } = useQuery(
    "dashboardCategories",
    () =>
      api
        .get("/reports/categories?period=month")
        .then((res) => res.data?.data || res.data || {}),
    { staleTime: 1000 * 60 * 5, enabled: false }
  );

  const { data: recentTransactions, isLoading: transactionsLoading } = useQuery(
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
    { staleTime: 1000 * 60 }
  );

  const { data: budgetProgress, isLoading: budgetLoading } = useQuery(
    "budgetProgress",
    () =>
      api.get("/budgets/progress").then((res) => {
        const budgets = res.data?.data || res.data || [];
        return Array.isArray(budgets) ? budgets : [];
      }),
    { staleTime: 1000 * 60, enabled: false }
  );

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
  };
}
