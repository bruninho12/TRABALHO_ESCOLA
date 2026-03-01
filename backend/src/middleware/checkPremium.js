/**
 * 💎 Middleware de Verificação Premium
 * Verifica se o usuário tem assinatura Premium ativa
 */

const User = require("../models/User");
const logger = require("../utils/logger");

/**
 * Verificar se usuário é Premium (qualquer plano)
 */
const checkPremium = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);

    // Log detalhado do usuário e assinatura
    console.log("[checkPremium] user:", user);
    console.log("[checkPremium] subscription:", user?.subscription);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "Usuário não encontrado",
      });
    }

    // Verificar se é Premium
    if (!user.isPremium()) {
      // Verificar se expirou
      if (user.isSubscriptionExpired()) {
        // Atualizar status para expired
        await user.expireSubscription();

        return res.status(403).json({
          success: false,
          error: "Sua assinatura Premium expirou",
          code: "SUBSCRIPTION_EXPIRED",
          action: "renew",
          redirectTo: "/payments/plans",
        });
      }

      return res.status(403).json({
        success: false,
        error: "Recurso disponível apenas para usuários Premium",
        code: "PREMIUM_REQUIRED",
        action: "upgrade",
        redirectTo: "/payments/plans",
        plans: {
          bronze: { name: "Bronze", price: 0.0, features: 3 },
          silver: { name: "Silver", price: 9.9, features: 5 },
          gold: { name: "Gold", price: 19.9, features: 8 },
        },
      });
    }

    // Usuário é Premium - adicionar info ao request
    req.user.subscription = user.subscription;
    req.isPremium = true;
    req.premiumPlan = user.subscription.plan;

    next();
  } catch (error) {
    logger.error("Erro no middleware checkPremium:", error);
    return res.status(500).json({
      success: false,
      error: "Erro ao verificar assinatura",
    });
  }
};

/**
 * Verificar se usuário tem plano específico (Bronze, Silver, Gold)
 */
const checkPlan = (requiredPlan) => {
  // Hierarquia de planos (Tema RPG):
  // bronze = R$ 0,00 (Free/Trial 30 dias)
  // silver = R$ 9,90 (Algumas funcionalidades premium)
  // gold = R$ 19,90 (Acesso completo)
  const planHierarchy = {
    bronze: 1,
    silver: 2,
    gold: 3,
  };

  return async (req, res, next) => {
    try {
      const userId = req.user.id || req.user._id;
      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({
          success: false,
          error: "Usuário não encontrado",
        });
      }

      // Verificar se tem Premium
      if (!user.isPremium()) {
        return res.status(403).json({
          success: false,
          error: `Recurso disponível apenas para plano ${requiredPlan.toUpperCase()} ou superior`,
          code: "PLAN_REQUIRED",
          requiredPlan,
          action: "upgrade",
          redirectTo: "/payments/plans",
        });
      }

      // Verificar hierarquia de planos
      const userPlanLevel = planHierarchy[user.subscription.plan];
      const requiredPlanLevel = planHierarchy[requiredPlan];

      if (!userPlanLevel || userPlanLevel < requiredPlanLevel) {
        return res.status(403).json({
          success: false,
          error: `Recurso disponível apenas para plano ${requiredPlan.toUpperCase()} ou superior`,
          code: "PLAN_UPGRADE_REQUIRED",
          currentPlan: user.subscription.plan,
          requiredPlan,
          action: "upgrade",
          redirectTo: "/payments/plans",
        });
      }

      // Usuário tem plano adequado
      req.user.subscription = user.subscription;
      req.isPremium = true;
      req.premiumPlan = user.subscription.plan;

      next();
    } catch (error) {
      logger.error("Erro no middleware checkPlan:", error);
      return res.status(500).json({
        success: false,
        error: "Erro ao verificar plano",
      });
    }
  };
};

/**
 * Verificar se usuário tem limite de uso do plano free
 */
const checkFreeLimit = (resource, limit) => {
  return async (req, res, next) => {
    try {
      const userId = req.user.id || req.user._id;
      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({
          success: false,
          error: "Usuário não encontrado",
        });
      }

      // Se é Premium, não há limites
      if (user.isPremium()) {
        req.isPremium = true;
        return next();
      }

      // Verificar limite para plano free
      // Aqui você pode implementar lógica específica por recurso
      // Exemplo: limite de transações, metas, categorias, etc.

      req.isPremium = false;
      req.freeLimit = limit;
      req.limitResource = resource;

      next();
    } catch (error) {
      logger.error("Erro no middleware checkFreeLimit:", error);
      return res.status(500).json({
        success: false,
        error: "Erro ao verificar limite",
      });
    }
  };
};

/**
 * Opcional: Adicionar informações de assinatura ao request
 * (não bloqueia, apenas adiciona dados)
 */
const addSubscriptionInfo = async (req, res, next) => {
  try {
    if (!req.user) {
      return next();
    }

    const userId = req.user.id || req.user._id;
    const user = await User.findById(userId);

    if (!user) {
      return next();
    }

    // Adicionar informações de assinatura
    req.subscription = {
      isPremium: user.isPremium(),
      plan: user.subscription.plan,
      status: user.subscription.status,
      expiresAt: user.subscription.currentPeriodEnd,
      isExpired: user.isSubscriptionExpired(),
      cancelAtPeriodEnd: user.subscription.cancelAtPeriodEnd,
    };

    next();
  } catch (error) {
    logger.error("Erro no middleware addSubscriptionInfo:", error);
    next(); // Não bloqueia em caso de erro
  }
};

module.exports = {
  checkPremium,
  checkPlan,
  checkFreeLimit,
  addSubscriptionInfo,
};
