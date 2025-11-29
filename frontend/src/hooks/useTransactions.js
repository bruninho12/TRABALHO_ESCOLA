import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { transactionService } from "../services/api";

// Mock data para desenvolvimento
const mockTransactions = [
  {
    id: "1",
    description: "Salário",
    amount: 5000,
    date: "2024-11-01T10:00:00Z",
    category: "salary",
    type: "income",
  },
  {
    id: "2",
    description: "Supermercado",
    amount: -350.5,
    date: "2024-11-15T14:30:00Z",
    category: "food",
    type: "expense",
  },
  {
    id: "3",
    description: "Conta de luz",
    amount: -150.0,
    date: "2024-11-10T09:00:00Z",
    category: "utilities",
    type: "expense",
  },
  {
    id: "4",
    description: "Freelance",
    amount: 800,
    date: "2024-11-12T16:20:00Z",
    category: "freelance",
    type: "income",
  },
  {
    id: "5",
    description: "Restaurante",
    amount: -85.9,
    date: "2024-11-16T19:45:00Z",
    category: "food",
    type: "expense",
  },
  {
    id: "6",
    description: "Gasolina",
    amount: -200.0,
    date: "2024-11-14T08:15:00Z",
    category: "transport",
    type: "expense",
  },
  {
    id: "7",
    description: "Dividendos",
    amount: 120.5,
    date: "2024-11-05T11:30:00Z",
    category: "investment",
    type: "income",
  },
  {
    id: "8",
    description: "Farmácia",
    amount: -45.8,
    date: "2024-11-13T15:10:00Z",
    category: "health",
    type: "expense",
  },
];

export function useTransactions() {
  const queryClient = useQueryClient();
  const [mockData, setMockData] = useState(mockTransactions);

  const transactions = useQuery("transactions", () =>
    transactionService
      .getAll()
      .then((res) => {
        const data = res.data?.data || res.data || [];
        return Array.isArray(data) ? data : [];
      })
      .catch(() => {
        // Retorna mock data em caso de erro
        return mockData;
      })
  );

  const createTransactionMutation = useMutation(
    (newTransaction) => transactionService.create(newTransaction),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("transactions");
        queryClient.invalidateQueries("stats");
      },
      onError: () => {
        // Simula criação no mock data
        const mockTransaction = {
          id: Date.now().toString(),
          ...arguments[0],
          date: arguments[0].date || new Date().toISOString(),
        };
        setMockData((prev) => [mockTransaction, ...prev]);
        queryClient.setQueryData("transactions", [
          mockTransaction,
          ...mockData,
        ]);
      },
    }
  );

  const updateTransactionMutation = useMutation(
    ({ id, transaction }) => transactionService.update(id, transaction),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("transactions");
        queryClient.invalidateQueries("stats");
      },
      onError: () => {
        // Simula atualização no mock data
        const updatedData = mockData.map((t) =>
          t.id === arguments[0].id || t._id === arguments[0].id
            ? { ...t, ...arguments[0].transaction }
            : t
        );
        setMockData(updatedData);
        queryClient.setQueryData("transactions", updatedData);
      },
    }
  );

  const deleteTransactionMutation = useMutation(
    (id) => transactionService.delete(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("transactions");
        queryClient.invalidateQueries("stats");
      },
      onError: () => {
        // Simula exclusão no mock data
        const filteredData = mockData.filter(
          (t) => t.id !== arguments[0] && t._id !== arguments[0]
        );
        setMockData(filteredData);
        queryClient.setQueryData("transactions", filteredData);
      },
    }
  );

  const stats = useQuery(
    "stats",
    () =>
      transactionService
        .getSummary()
        .then((res) => res.data?.data || res.data || {})
        .catch(() => ({})),
    { enabled: false }
  );

  // Interface compatível com a nova página
  const createTransaction = useCallback(
    async (transactionData) => {
      await createTransactionMutation.mutateAsync(transactionData);
    },
    [createTransactionMutation]
  );

  const updateTransaction = useCallback(
    async (id, transactionData) => {
      await updateTransactionMutation.mutateAsync({
        id,
        transaction: transactionData,
      });
    },
    [updateTransactionMutation]
  );

  const deleteTransaction = useCallback(
    async (id) => {
      await deleteTransactionMutation.mutateAsync(id);
    },
    [deleteTransactionMutation]
  );

  const refreshTransactions = useCallback(() => {
    queryClient.invalidateQueries("transactions");
  }, [queryClient]);

  return {
    // Interface original (react-query)
    transactions: Array.isArray(transactions.data) ? transactions.data : [],
    isLoading: transactions.isLoading,
    error: transactions.error,
    createTransaction: createTransaction,
    updateTransaction: updateTransaction,
    deleteTransaction: deleteTransaction,
    stats: stats.data,
    isStatsLoading: stats.isLoading,
    statsError: stats.error,

    // Interface nova (compatível com useState)
    loading: transactions.isLoading,
    refreshTransactions,
  };
}
