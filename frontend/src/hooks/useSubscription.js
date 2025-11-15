import { useState, useCallback } from "react";
import api from "../services/api";

/**
 * Hook para gerenciar assinatura/plano do usuário
 * Sincroniza com localStorage e backend
 */
export function useSubscription() {
  const [plan, setPlanState] = useState(() => {
    try {
      return localStorage.getItem("user_plan") || "free";
    } catch {
      return "free";
    }
  });

  const [isUpdating, setIsUpdating] = useState(false);

  // Atualizar plano localmente e no backend
  const updatePlan = useCallback(async (newPlan) => {
    if (!["free", "premium", "anual", "vitalicio"].includes(newPlan)) {
      console.error("Plano inválido:", newPlan);
      return false;
    }

    try {
      setIsUpdating(true);

      // Enviar para backend
      await api.put("/users/subscription/plan", { plan: newPlan });

      // Salvar localmente
      localStorage.setItem("user_plan", newPlan);
      setPlanState(newPlan);

      return true;
    } catch (error) {
      console.error("Erro ao atualizar plano:", error);
      return false;
    } finally {
      setIsUpdating(false);
    }
  }, []);

  return { plan, updatePlan, isUpdating };
}

export default useSubscription;
