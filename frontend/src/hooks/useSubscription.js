/**
 * Hook para gerenciar assinaturas
 * Fornece estado e ações para planos premium
 */

import { useState, useEffect, useCallback } from "react";
import paymentApi from "../services/paymentApi";
import { useAuth } from "../contexts/AuthContext";

// Planos disponíveis com preços e features
const PLANS = {
  bronze: {
    name: "Bronze",
    price: 0,
    icon: "🥉",
    color: "#CD7F32",
    features: ["Dashboard básico", "Até 3 categorias", "Relatórios simples"],
  },
  silver: {
    name: "Silver",
    price: 9.9,
    icon: "🥈",
    color: "#C0C0C0",
    features: [
      "Dashboard avançado",
      "Até 10 categorias",
      "Insights com IA",
      "Gamificação",
    ],
  },
  gold: {
    name: "Gold",
    price: 19.9,
    icon: "🥇",
    color: "#FFD700",
    features: [
      "Categorias ilimitadas",
      "Sistema RPG completo",
      "Análise preditiva",
    ],
  },
  platinum: {
    name: "Platinum",
    price: 29.9,
    icon: "💎",
    color: "#E5E4E2",
    features: ["Consultoria financeira", "API integração", "Suporte exclusivo"],
  },
};

export const useSubscription = () => {
  const { user, refreshUser } = useAuth();
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Carregar assinatura atual
  const loadSubscription = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await paymentApi.getSubscription();
      setSubscription(response.data);
    } catch (err) {
      setError(err.message || "Erro ao carregar assinatura");
      console.error("Erro ao carregar assinatura:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Atualizar plano (upgrade/downgrade)
  const updatePlan = useCallback(
    async (newPlan) => {
      try {
        setLoading(true);
        setError(null);
        const response = await paymentApi.updateSubscription(newPlan);
        setSubscription(response.data);
        // Atualizar dados do usuário no contexto
        if (refreshUser) {
          await refreshUser();
        }
        return response;
      } catch (err) {
        setError(err.message || "Erro ao atualizar plano");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [refreshUser]
  );

  // Cancelar assinatura
  const cancelSubscription = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await paymentApi.cancelSubscription();
      setSubscription(response.data);
      // Atualizar dados do usuário no contexto
      if (refreshUser) {
        await refreshUser();
      }
      return response;
    } catch (err) {
      setError(err.message || "Erro ao cancelar assinatura");
      throw err;
    } finally {
      setLoading(false);
    }
  }, [refreshUser]);

  // Verificar se tem acesso a funcionalidade premium
  const hasAccess = useCallback(
    (feature) => {
      if (!subscription) return false;

      const currentPlan = subscription.plan || "bronze";

      // Funcionalidades por plano
      const featureAccess = {
        insights: ["silver", "gold", "platinum"],
        gamification: ["silver", "gold", "platinum"],
        advanced_reports: ["gold", "platinum"],
        unlimited_categories: ["gold", "platinum"],
        api_access: ["platinum"],
        priority_support: ["gold", "platinum"],
        consultation: ["platinum"],
      };

      return featureAccess[feature]?.includes(currentPlan) || false;
    },
    [subscription]
  );

  // Obter informações do plano atual
  const getCurrentPlan = useCallback(() => {
    if (!subscription) return PLANS.bronze;
    return PLANS[subscription.plan] || PLANS.bronze;
  }, [subscription]);

  // Verificar se assinatura está ativa
  const isActive = useCallback(() => {
    if (!subscription) return false;
    return subscription.status === "active" && subscription.isActive;
  }, [subscription]);

  // Verificar se pode fazer upgrade
  const canUpgrade = useCallback(
    (targetPlan) => {
      if (!subscription) return true;
      const currentPlan = subscription.plan || "bronze";
      return PLANS[targetPlan]?.price > PLANS[currentPlan]?.price;
    },
    [subscription]
  );

  // Verificar se pode fazer downgrade
  const canDowngrade = useCallback(
    (targetPlan) => {
      if (!subscription) return false;
      const currentPlan = subscription.plan || "bronze";
      return PLANS[targetPlan]?.price < PLANS[currentPlan]?.price;
    },
    [subscription]
  );

  // Carregar dados na inicialização
  useEffect(() => {
    if (user) {
      loadSubscription();
    }
  }, [user, loadSubscription]);

  return {
    // Estado
    subscription,
    loading,
    error,
    plans: PLANS,

    // Informações da assinatura
    currentPlan: getCurrentPlan(),
    isActive: isActive(),

    // Ações
    loadSubscription,
    updatePlan,
    cancelSubscription,

    // Verificações
    hasAccess,
    canUpgrade,
    canDowngrade,

    // Utils
    clearError: () => setError(null),
  };
};

export default useSubscription;
