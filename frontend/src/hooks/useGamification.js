/**
 * Hook customizado para gerenciar dados de gamificação
 * Responsável por manter estado de pontos, níveis, conquistas
 */

import { useState, useEffect, useCallback } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

export const useGamification = () => {
  const [data, setData] = useState({
    points: 0,
    level: 1,
    experience: 0,
    achievements: [],
    streaks: 0,
    badges: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Obter dados de gamificação
  const loadGamificationData = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("finance_flow_token");

      const response = await axios.get(`${API_URL}/gamification/data`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.data.data) {
        setData(response.data.data);
      }
      setError(null);
    } catch (err) {
      console.error("Erro ao carregar dados de gamificação:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Obter conquistas
  const loadAchievements = useCallback(async () => {
    try {
      const token = localStorage.getItem("finance_flow_token");

      const response = await axios.get(`${API_URL}/gamification/achievements`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.data.data) {
        setData((prev) => ({
          ...prev,
          achievements: response.data.data,
        }));
      }
    } catch (err) {
      console.error("Erro ao carregar conquistas:", err);
    }
  }, []);

  // Adicionar pontos
  const addPoints = useCallback(async (amount, reason = "") => {
    try {
      const token = localStorage.getItem("finance_flow_token");

      const response = await axios.post(
        `${API_URL}/gamification/add-points`,
        { amount, reason },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.data) {
        setData((prev) => ({
          ...prev,
          points: response.data.data.points,
          level: response.data.data.level,
        }));
      }

      return response.data;
    } catch (err) {
      console.error("Erro ao adicionar pontos:", err);
      throw err;
    }
  }, []);

  // Aumentar streak
  const increaseStreak = useCallback(async () => {
    try {
      const token = localStorage.getItem("finance_flow_token");

      const response = await axios.post(
        `${API_URL}/gamification/streak`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.data) {
        setData((prev) => ({
          ...prev,
          streaks: response.data.data.streaks,
        }));
      }

      return response.data;
    } catch (err) {
      console.error("Erro ao aumentar streak:", err);
      throw err;
    }
  }, []);

  // Recarregar dados ao montar componente
  useEffect(() => {
    loadGamificationData();
  }, [loadGamificationData]);

  return {
    data,
    loading,
    error,
    loadGamificationData,
    loadAchievements,
    addPoints,
    increaseStreak,
  };
};

export default useGamification;
