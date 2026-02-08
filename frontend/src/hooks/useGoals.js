/**
 * Hook customizado para gerenciar Goals/Metas
 * Responsável por operações CRUD de metas
 */

import { useState, useCallback } from "react";
import api from "../services/api";

export const useGoals = () => {
  const [goals, setGoals] = useState([]);
  const [currentGoal, setCurrentGoal] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Listar metas
  const listGoals = useCallback(async (filters = {}) => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (filters.status) params.append("status", filters.status);
      if (filters.sortBy) params.append("sortBy", filters.sortBy);

      const response = await api.get(
        `/goals${params.toString() ? "?" + params.toString() : ""}`
      );

      if (response.data.data) {
        const goalsData = Array.isArray(response.data.data)
          ? response.data.data
          : [];
        setGoals(goalsData);
      }

      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message;
      setError(errorMsg);
      console.error("Erro ao listar metas:", errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Criar meta
  const createGoal = useCallback(async (goalData) => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.post("/goals", goalData);

      if (response.data.data) {
        setGoals((prev) => [...prev, response.data.data]);
      }

      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message;
      setError(errorMsg);
      console.error("Erro ao criar meta:", errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Obter meta por ID
  const getGoal = useCallback(async (goalId) => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get(`/goals/${goalId}`);

      if (response.data.data) {
        setCurrentGoal(response.data.data);
      }

      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message;
      setError(errorMsg);
      console.error("Erro ao obter meta:", errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Atualizar meta
  const updateGoal = useCallback(
    async (goalId, updateData) => {
      try {
        setLoading(true);
        setError(null);

        const response = await api.put(`/goals/${goalId}`, updateData);

        if (response.data.data) {
          setGoals((prev) =>
            prev.map((g) =>
              g._id === goalId || g.id === goalId ? response.data.data : g
            )
          );
          if (
            currentGoal &&
            (currentGoal._id === goalId || currentGoal.id === goalId)
          ) {
            setCurrentGoal(response.data.data);
          }
        }

        return response.data;
      } catch (err) {
        const errorMsg = err.response?.data?.message || err.message;
        setError(errorMsg);
        console.error("Erro ao atualizar meta:", errorMsg);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [currentGoal]
  );

  // Deletar meta
  const deleteGoal = useCallback(
    async (goalId) => {
      try {
        setLoading(true);
        setError(null);

        const response = await api.delete(`/goals/${goalId}`);

        setGoals((prev) =>
          prev.filter((g) => g._id !== goalId && g.id !== goalId)
        );

        if (
          currentGoal &&
          (currentGoal._id === goalId || currentGoal.id === goalId)
        ) {
          setCurrentGoal(null);
        }

        return response.data;
      } catch (err) {
        const errorMsg = err.response?.data?.message || err.message;
        setError(errorMsg);
        console.error("Erro ao deletar meta:", errorMsg);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [currentGoal]
  );

  // Adicionar contribuição à meta
  const contributeToGoal = useCallback(
    async (goalId, amount) => {
      try {
        setLoading(true);
        setError(null);

        const response = await api.post(`/goals/${goalId}/contribute`, {
          amount,
        });

        if (response.data.data) {
          setGoals((prev) =>
            prev.map((g) =>
              g._id === goalId || g.id === goalId ? response.data.data : g
            )
          );
          if (
            currentGoal &&
            (currentGoal._id === goalId || currentGoal.id === goalId)
          ) {
            setCurrentGoal(response.data.data);
          }
        }

        return response.data;
      } catch (err) {
        const errorMsg = err.response?.data?.message || err.message;
        setError(errorMsg);
        console.error("Erro ao contribuir para meta:", errorMsg);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [currentGoal]
  );

  // Marcar meta como concluída
  const completeGoal = useCallback(
    async (goalId) => {
      try {
        setLoading(true);
        setError(null);

        const response = await api.post(`/goals/${goalId}/complete`, {});

        if (response.data.data) {
          setGoals((prev) =>
            prev.map((g) =>
              g._id === goalId || g.id === goalId ? response.data.data : g
            )
          );
          if (
            currentGoal &&
            (currentGoal._id === goalId || currentGoal.id === goalId)
          ) {
            setCurrentGoal(response.data.data);
          }
        }

        return response.data;
      } catch (err) {
        const errorMsg = err.response?.data?.message || err.message;
        setError(errorMsg);
        console.error("Erro ao completar meta:", errorMsg);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [currentGoal]
  );

  // Calcular progresso em percentual
  const getGoalProgress = useCallback((goal) => {
    if (!goal || !goal.targetAmount) return 0;
    const progress = (goal.currentAmount / goal.targetAmount) * 100;
    return Math.min(progress, 100);
  }, []);

  // Obter estatísticas de metas
  const getGoalStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get("/goals/stats");

      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message;
      setError(errorMsg);
      console.error("Erro ao obter estatísticas de metas:", errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    goals,
    currentGoal,
    loading,
    error,
    listGoals,
    createGoal,
    getGoal,
    updateGoal,
    deleteGoal,
    contributeToGoal,
    completeGoal,
    getGoalProgress,
    getGoalStats,
  };
};

export default useGoals;
