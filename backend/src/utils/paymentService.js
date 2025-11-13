// ============================================
// 💳 Serviço de Pagamentos (Stripe Simulado)
// ============================================
// Este serviço gerencia planos premium, pagamentos e recompensas.
// Em produção, as chaves da Stripe devem vir do arquivo .env
// ============================================

class PaymentService {
  constructor() {
    // ⚙️ Configurações das chaves Stripe (usando variáveis de ambiente)
    this.stripeSecretKey = process.env.STRIPE_SECRET_KEY || "sk_test_your_stripe_secret_key";
    this.stripePublishableKey = process.env.STRIPE_PUBLISHABLE_KEY || "pk_test_your_stripe_publishable_key";
    this.webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "whsec_your_webhook_secret";

    // 💎 Planos Premium disponíveis
    this.plans = {
      bronze: {
        id: "bronze_plan",
        name: "Bronze Premium",
        price: 9.99,
        currency: "brl",
        interval: "month",
        features: ["Análises Avançadas", "Categorias Personalizadas", "Exportar Relatórios"],
        streamingReward: 1, // 1 mês de streaming grátis
      },
      silver: {
        id: "silver_plan",
        name: "Silver Premium",
        price: 19.99,
        currency: "brl",
        interval: "month",
        features: ["Todos os recursos do Bronze", "Modelos de Metas", "Suporte Prioritário"],
        streamingReward: 2, // 2 meses grátis
      },
      gold: {
        id: "gold_plan",
        name: "Gold Premium",
        price: 29.99,
        currency: "brl",
        interval: "month",
        features: ["Todos os recursos do Silver", "Consultor Financeiro Pessoal", "Metas Ilimitadas"],
        streamingReward: 3, // 3 meses grátis
      },
    };

    // 🎬 Serviços de streaming disponíveis para recompensa
    this.streamingServices = {
      netflix: { name: "Netflix", logo: "netflix-logo.png", available: true },
      spotify: { name: "Spotify Premium", logo: "spotify-logo.png", available: true },
      prime: { name: "Amazon Prime Video", logo: "prime-logo.png", available: true },
      disney: { name: "Disney+", logo: "disney-logo.png", available: true },
    };
  }

  // ============================================
  // 🔹 Criação de pagamento (simulado Stripe)
  // ============================================
  async createPaymentIntent(userId, planId, paymentMethodId) {
    try {
      const plan = this.plans[planId];
      if (!plan) throw new Error("Plano inválido selecionado.");

      // Simula a criação de um PaymentIntent (Stripe)
      const paymentIntent = {
        id: `pi_${this.generateId()}`,
        amount: Math.round(plan.price * 100), // centavos
        currency: plan.currency,
        customer: userId,
        payment_method: paymentMethodId,
        status: "requires_confirmation",
        client_secret: `pi_${this.generateId()}_secret_${this.generateId()}`,
        metadata: { userId, planId, type: "subscription" },
      };

      await this.storePaymentIntent(paymentIntent); // Salva no "banco" (simulado)

      return {
        success: true,
        data: {
          clientSecret: paymentIntent.client_secret,
          paymentIntentId: paymentIntent.id,
        },
      };
    } catch (error) {
      throw new Error(`Falha ao criar pagamento: ${error.message}`);
    }
  }

  // ============================================
  // 🔹 Confirmação do pagamento
  // ============================================
  async confirmPayment(paymentIntentId, userId) {
    try {
      const paymentIntent = await this.getPaymentIntent(paymentIntentId);

      if (!paymentIntent || paymentIntent.metadata.userId !== userId) {
        throw new Error("Pagamento não encontrado ou não autorizado.");
      }

      const confirmedPayment = {
        ...paymentIntent,
        status: "succeeded",
        confirmedAt: new Date().toISOString(),
      };

      await this.updatePaymentIntent(paymentIntentId, confirmedPayment);

      const subscription = await this.createSubscription(
        userId,
        paymentIntent.metadata.planId
      );

      await this.activatePremiumFeatures(userId, paymentIntent.metadata.planId);

      return { success: true, data: { subscription, paymentIntent: confirmedPayment } };
    } catch (error) {
      throw new Error(`Falha ao confirmar pagamento: ${error.message}`);
    }
  }

  // ============================================
  // 🔹 Criação de assinatura Premium
  // ============================================
  async createSubscription(userId, planId) {
    const plan = this.plans[planId];
    const subscription = {
      id: `sub_${this.generateId()}`,
      userId,
      planId,
      status: "active",
      currentPeriodStart: new Date().toISOString(),
      currentPeriodEnd: this.calculateNextBillingDate().toISOString(),
      cancelAtPeriodEnd: false,
      createdAt: new Date().toISOString(),
    };

    await this.storeSubscription(subscription);
    return subscription;
  }

  // ============================================
  // 🎁 Resgate de Recompensas de Streaming
  // ============================================
  async redeemStreamingReward(userId, goalId, streamingService) {
    try {
      const goal = await this.getGoalById(goalId);
      const user = await this.getUserById(userId);

      if (!goal || goal.userId !== userId) throw new Error("Meta não encontrada ou não autorizada.");
      if (!goal.completed) throw new Error("A meta precisa estar concluída para resgatar.");
      if (goal.rewardRedeemed) throw new Error("Recompensa já foi resgatada.");

      const rewardMonths = this.getRewardMonthsByLevel(user.level);
      if (rewardMonths === 0) throw new Error("Nível de usuário sem direito a recompensas.");

      if (!this.streamingServices[streamingService]?.available)
        throw new Error("Serviço de streaming indisponível.");

      const redemption = {
        id: `reward_${this.generateId()}`,
        userId,
        goalId,
        streamingService,
        rewardMonths,
        status: "pending",
        redemptionCode: this.generateRedemptionCode(),
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      };

      await this.storeRedemption(redemption);
      await this.updateGoal(goalId, { rewardRedeemed: true, redemptionId: redemption.id });

      const giftCode = await this.generateStreamingGiftCode(streamingService, rewardMonths);

      redemption.giftCode = giftCode;
      redemption.status = "completed";
      await this.updateRedemption(redemption.id, redemption);

      return {
        success: true,
        data: {
          redemption,
          giftCode,
          instructions: this.getRedemptionInstructions(streamingService),
        },
      };
    } catch (error) {
      throw new Error(`Falha ao resgatar recompensa: ${error.message}`);
    }
  }

  // ============================================
  // 🔹 Cancelamento de assinatura
  // ============================================
  async cancelSubscription(userId, subscriptionId) {
    try {
      const subscription = await this.getSubscription(subscriptionId);

      if (!subscription || subscription.userId !== userId)
        throw new Error("Assinatura não encontrada ou não autorizada.");

      const updatedSubscription = {
        ...subscription,
        cancelAtPeriodEnd: true,
        canceledAt: new Date().toISOString(),
      };

      await this.updateSubscription(subscriptionId, updatedSubscription);

      return {
        success: true,
        data: updatedSubscription,
        message: "Assinatura será cancelada ao final do ciclo atual.",
      };
    } catch (error) {
      throw new Error(`Falha ao cancelar assinatura: ${error.message}`);
    }
  }

  // ============================================
  // 🧾 Métodos auxiliares / simulados
  // ============================================

  getRewardMonthsByLevel(level) {
    const levels = { Bronze: 1, Silver: 2, Gold: 3 };
    return levels[level] || 0;
  }

  calculateNextBillingDate() {
    const date = new Date();
    date.setMonth(date.getMonth() + 1);
    return date;
  }

  generateId() {
    return Math.random().toString(36).substring(2, 10);
  }

  generateRedemptionCode() {
    return `DESP${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
  }

  async generateStreamingGiftCode(service, months) {
    return `${service.toUpperCase()}-${months}M-${this.generateId().toUpperCase()}`;
  }

  getRedemptionInstructions(service) {
    const msg = {
      netflix: "Acesse netflix.com/redeem e insira seu código.",
      spotify: "Acesse spotify.com/redeem e insira seu código.",
      prime: "Acesse primevideo.com/redeem e insira seu código.",
      disney: "Acesse disneyplus.com/redeem e insira seu código.",
    };
    return msg[service] || "Siga as instruções da plataforma.";
  }

  verifyWebhookSignature(payload, signature) {
    return signature && signature.includes("stripe");
  }

  // ============================================
  // 🔄 Simulações de banco de dados / logs
  // ============================================
  async storePaymentIntent(pi) { console.log(`💾 PaymentIntent salvo: ${pi.id}`); }
  async getPaymentIntent(id) { console.log(`📦 Buscar PaymentIntent: ${id}`); return null; }
  async updatePaymentIntent(id, data) { console.log(`🔄 Atualizar PaymentIntent: ${id}`); }

  async storeSubscription(sub) { console.log(`💾 Assinatura salva: ${sub.id}`); }
  async getSubscription(id) { console.log(`📦 Buscar assinatura: ${id}`); return null; }
  async updateSubscription(id, data) { console.log(`🔄 Atualizar assinatura: ${id}`); }

  async storeRedemption(red) { console.log(`💾 Resgate salvo: ${red.id}`); }
  async updateRedemption(id, data) { console.log(`🔄 Atualizar resgate: ${id}`); }

  async activatePremiumFeatures(userId, planId) {
    console.log(`🚀 Ativando recursos premium para usuário ${userId} (plano ${planId})`);
  }

  async getUserById(id) { console.log(`👤 Buscar usuário: ${id}`); return { id, level: "Bronze" }; }
  async getGoalById(id) { console.log(`🎯 Buscar meta: ${id}`); return null; }
  async updateGoal(id, data) { console.log(`🔄 Atualizar meta: ${id}`); }
  async getCompletedGoalsByUser(userId) { console.log(`🏁 Buscar metas concluídas de: ${userId}`); return []; }
}

// ✅ Exportação correta (resolve o erro “is not a constructor”)
module.exports = PaymentService;
