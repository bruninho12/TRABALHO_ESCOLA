import { useQuery, useMutation, useQueryClient } from "react-query";
import { transactionService } from "../services/api";

export function useTransactions() {
  const queryClient = useQueryClient();

  const transactions = useQuery("transactions", () =>
    transactionService
      .getAll()
      .then((res) => {
        // Garantir que sempre retorna um array
        const data = res.data?.data || res.data || [];
        return Array.isArray(data) ? data : [];
      })
      .catch(() => [])
  );

  const createTransaction = useMutation(
    (newTransaction) => transactionService.create(newTransaction),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("transactions");
        queryClient.invalidateQueries("stats");
      },
    }
  );

  const updateTransaction = useMutation(
    ({ id, transaction }) => transactionService.update(id, transaction),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("transactions");
        queryClient.invalidateQueries("stats");
      },
    }
  );

  const deleteTransaction = useMutation((id) => transactionService.delete(id), {
    onSuccess: () => {
      queryClient.invalidateQueries("transactions");
      queryClient.invalidateQueries("stats");
    },
  });

  const stats = useQuery(
    "stats",
    () =>
      transactionService
        .getSummary()
        .then((res) => res.data?.data || res.data || {})
        .catch(() => ({})),
    { enabled: false } // Desabilitado por enquanto
  );

  return {
    transactions: Array.isArray(transactions.data) ? transactions.data : [],
    isLoading: transactions.isLoading,
    error: transactions.error,
    createTransaction: createTransaction.mutate,
    updateTransaction: updateTransaction.mutate,
    deleteTransaction: deleteTransaction.mutate,
    stats: stats.data,
    isStatsLoading: stats.isLoading,
    statsError: stats.error,
  };
}
