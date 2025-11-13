/**
 * Hook customizado para gerenciar dados do RPG
 * Responsável por gerenciar avatar, batalhas, mundo
 */

import { useState, useEffect, useCallback } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

export const useRPGGame = () => {
  const [avatar, setAvatar] = useState({
    id: null,
    name: "Herói",
    level: 1,
    experience: 0,
    health: 100,
    maxHealth: 100,
    mana: 50,
    maxMana: 50,
    strength: 10,
    defense: 5,
    speed: 8,
    equipment: {
      weapon: null,
      armor: null,
      accessory: null,
    },
  });

  const [world, setWorld] = useState({
    currentLocation: "Aldeia Inicial",
    locations: [],
    enemies: [],
    quests: [],
  });

  const [battles, setBattles] = useState({
    history: [],
    active: null,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Obter dados do avatar
  const loadAvatar = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("finance_flow_token");

      const response = await axios.get(`${API_URL}/rpg/avatar`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.data.data) {
        setAvatar(response.data.data);
      }
      setError(null);
    } catch (err) {
      console.error("Erro ao carregar avatar:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Obter dados do mundo
  const loadWorld = useCallback(async () => {
    try {
      const token = localStorage.getItem("finance_flow_token");

      const response = await axios.get(`${API_URL}/rpg/world`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.data.data) {
        setWorld(response.data.data);
      }
    } catch (err) {
      console.error("Erro ao carregar mundo:", err);
    }
  }, []);

  // Iniciar batalha
  const startBattle = useCallback(async (enemyId) => {
    try {
      const token = localStorage.getItem("finance_flow_token");

      const response = await axios.post(
        `${API_URL}/rpg/battle/start`,
        { enemyId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.data) {
        setBattles((prev) => ({
          ...prev,
          active: response.data.data,
        }));
      }

      return response.data;
    } catch (err) {
      console.error("Erro ao iniciar batalha:", err);
      throw err;
    }
  }, []);

  // Executar ação em batalha
  const executeBattleAction = useCallback(async (action, target = null) => {
    try {
      const token = localStorage.getItem("finance_flow_token");

      const response = await axios.post(
        `${API_URL}/rpg/battle/action`,
        { action, target },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.data) {
        setBattles((prev) => ({
          ...prev,
          active: response.data.data.battleState,
        }));

        // Se batalha terminou, atualizar avatar
        if (response.data.data.battleState.status === "finished") {
          setAvatar((prev) => ({
            ...prev,
            experience: response.data.data.newExperience,
            level: response.data.data.newLevel,
            health: response.data.data.newHealth,
          }));
        }
      }

      return response.data;
    } catch (err) {
      console.error("Erro ao executar ação de batalha:", err);
      throw err;
    }
  }, []);

  // Mover para localização
  const moveToLocation = useCallback(async (locationId) => {
    try {
      const token = localStorage.getItem("finance_flow_token");

      const response = await axios.post(
        `${API_URL}/rpg/move`,
        { locationId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.data) {
        setWorld((prev) => ({
          ...prev,
          currentLocation: response.data.data.currentLocation,
          enemies: response.data.data.enemies,
        }));
      }

      return response.data;
    } catch (err) {
      console.error("Erro ao mover para localização:", err);
      throw err;
    }
  }, []);

  // Curar avatar
  const heal = useCallback(async (amount = 50) => {
    try {
      const token = localStorage.getItem("finance_flow_token");

      const response = await axios.post(
        `${API_URL}/rpg/heal`,
        { amount },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.data) {
        setAvatar((prev) => ({
          ...prev,
          health: response.data.data.health,
        }));
      }

      return response.data;
    } catch (err) {
      console.error("Erro ao curar:", err);
      throw err;
    }
  }, []);

  // Obter histórico de batalhas
  const loadBattleHistory = useCallback(async () => {
    try {
      const token = localStorage.getItem("finance_flow_token");

      const response = await axios.get(`${API_URL}/rpg/battles/history`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.data.data) {
        setBattles((prev) => ({
          ...prev,
          history: response.data.data,
        }));
      }
    } catch (err) {
      console.error("Erro ao carregar histórico de batalhas:", err);
    }
  }, []);

  // Recarregar dados ao montar componente
  useEffect(() => {
    loadAvatar();
    loadWorld();
    loadBattleHistory();
  }, [loadAvatar, loadWorld, loadBattleHistory]);

  return {
    avatar,
    world,
    battles,
    loading,
    error,
    loadAvatar,
    loadWorld,
    loadBattleHistory,
    startBattle,
    executeBattleAction,
    moveToLocation,
    heal,
  };
};

export default useRPGGame;
