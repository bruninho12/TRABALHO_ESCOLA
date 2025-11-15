import { useState, useCallback } from "react";

export function usePlan() {
  const [plan, setPlanState] = useState(() => {
    try {
      return localStorage.getItem("user_plan") || "free";
    } catch {
      return "free";
    }
  });

  const setPlan = useCallback((next) => {
    try {
      localStorage.setItem("user_plan", next);
    } catch {}
    setPlanState(next);
  }, []);

  const isFree = plan === "free";

  return { plan, setPlan, isFree };
}

export default usePlan;
