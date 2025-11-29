/**
 * 💳 Stripe Payment Service
 * Serviço completo de integração com Stripe
 */

const stripe = require("stripe");
const logger = require("./logger");

class StripeService {
  constructor() {
    // Inicializar Stripe com chave secreta
    this.stripe = stripe(process.env.STRIPE_SECRET_KEY);
    this.webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    // Planos Premium disponíveis (Tema RPG)
    // Bronze = R$ 0,00 (Free/Trial 30 dias)
    // Silver = R$ 9,90 (Algumas funcionalidades premium)
    // Gold = R$ 19,90 (Acesso completo)
    this.plans = {
      bronze: {
        priceId: null, // Bronze é gratuito (trial)
        name: "bronze",
        displayName: "Bronze",
        price: 0.0,
        currency: "brl",
        interval: "month",
        features: [
          "Trial 30 dias",
          "Funcionalidades básicas",
          "Orçamentos limitados",
          "Sistema de gamificação",
        ],
      },
      silver: {
        priceId: process.env.STRIPE_SILVER_PRICE_ID || "price_silver",
        name: "silver",
        displayName: "Silver",
        price: 9.9,
        currency: "brl",
        interval: "month",
        features: [
          "Acesso a algumas funcionalidades premium",
          "Insights avançados",
          "Até 10 orçamentos",
          "Exportação CSV",
          "Conquistas especiais RPG",
        ],
      },
      gold: {
        priceId: process.env.STRIPE_GOLD_PRICE_ID || "price_gold",
        name: "gold",
        displayName: "Gold",
        price: 19.9,
        currency: "brl",
        interval: "month",
        features: [
          "Acesso completo a tudo",
          "Todos os recursos premium",
          "Orçamentos ilimitados",
          "Exportações Excel/PDF",
          "Suporte prioritário",
          "Avatares e itens exclusivos RPG",
        ],
      },
    };
  }

  /**
   * Criar Customer no Stripe
   */
  async createCustomer(userData) {
    try {
      const customer = await this.stripe.customers.create({
        email: userData.email,
        name: userData.name,
        metadata: {
          userId: userData.userId.toString(),
          source: "despfinance",
        },
      });

      logger.info(
        `Stripe customer criado: ${customer.id} para usuário ${userData.userId}`
      );
      return customer;
    } catch (error) {
      logger.error("Erro ao criar customer Stripe:", error);
      throw new Error(`Falha ao criar customer: ${error.message}`);
    }
  }

  /**
   * Criar Payment Intent para compra única
   */
  async createPaymentIntent(paymentData) {
    try {
      const {
        amount,
        currency = "brl",
        customer,
        description,
        metadata,
      } = paymentData;

      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Converter para centavos
        currency,
        customer,
        description,
        metadata: {
          ...metadata,
          integration: "despfinance",
        },
        automatic_payment_methods: {
          enabled: true,
        },
      });

      logger.info(`Payment Intent criado: ${paymentIntent.id}`);

      return {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
        amount: paymentIntent.amount / 100,
        status: paymentIntent.status,
      };
    } catch (error) {
      logger.error("Erro ao criar Payment Intent:", error);
      throw new Error(`Falha ao criar pagamento: ${error.message}`);
    }
  }

  /**
   * Criar Checkout Session para assinatura
   */
  async createCheckoutSession(sessionData) {
    try {
      const { priceId, customerId, successUrl, cancelUrl, metadata } =
        sessionData;

      const session = await this.stripe.checkout.sessions.create({
        customer: customerId,
        payment_method_types: ["card"],
        mode: "subscription",
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        success_url: successUrl,
        cancel_url: cancelUrl,
        metadata: {
          ...metadata,
          integration: "despfinance",
        },
        subscription_data: {
          metadata: {
            ...metadata,
          },
        },
      });

      logger.info(`Checkout Session criada: ${session.id}`);

      return {
        sessionId: session.id,
        url: session.url,
      };
    } catch (error) {
      logger.error("Erro ao criar Checkout Session:", error);
      throw new Error(`Falha ao criar sessão de checkout: ${error.message}`);
    }
  }

  /**
   * Criar assinatura diretamente
   */
  async createSubscription(subscriptionData) {
    try {
      const { customerId, priceId, trialDays, metadata } = subscriptionData;

      const subscriptionParams = {
        customer: customerId,
        items: [{ price: priceId }],
        metadata: {
          ...metadata,
          integration: "despfinance",
        },
        expand: ["latest_invoice.payment_intent"],
      };

      if (trialDays) {
        subscriptionParams.trial_period_days = trialDays;
      }

      const subscription = await this.stripe.subscriptions.create(
        subscriptionParams
      );

      logger.info(`Assinatura criada: ${subscription.id}`);

      return {
        subscriptionId: subscription.id,
        customerId: subscription.customer,
        status: subscription.status,
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        clientSecret:
          subscription.latest_invoice?.payment_intent?.client_secret,
      };
    } catch (error) {
      logger.error("Erro ao criar assinatura:", error);
      throw new Error(`Falha ao criar assinatura: ${error.message}`);
    }
  }

  /**
   * Cancelar assinatura
   */
  async cancelSubscription(subscriptionId, immediate = false) {
    try {
      let subscription;

      if (immediate) {
        subscription = await this.stripe.subscriptions.cancel(subscriptionId);
        logger.info(`Assinatura cancelada imediatamente: ${subscriptionId}`);
      } else {
        subscription = await this.stripe.subscriptions.update(subscriptionId, {
          cancel_at_period_end: true,
        });
        logger.info(
          `Assinatura marcada para cancelamento no fim do período: ${subscriptionId}`
        );
      }

      return {
        subscriptionId: subscription.id,
        status: subscription.status,
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      };
    } catch (error) {
      logger.error("Erro ao cancelar assinatura:", error);
      throw new Error(`Falha ao cancelar assinatura: ${error.message}`);
    }
  }

  /**
   * Reativar assinatura cancelada
   */
  async reactivateSubscription(subscriptionId) {
    try {
      const subscription = await this.stripe.subscriptions.update(
        subscriptionId,
        {
          cancel_at_period_end: false,
        }
      );

      logger.info(`Assinatura reativada: ${subscriptionId}`);

      return {
        subscriptionId: subscription.id,
        status: subscription.status,
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      };
    } catch (error) {
      logger.error("Erro ao reativar assinatura:", error);
      throw new Error(`Falha ao reativar assinatura: ${error.message}`);
    }
  }

  /**
   * Buscar assinatura
   */
  async getSubscription(subscriptionId) {
    try {
      const subscription = await this.stripe.subscriptions.retrieve(
        subscriptionId
      );

      return {
        subscriptionId: subscription.id,
        customerId: subscription.customer,
        status: subscription.status,
        currentPeriodStart: new Date(subscription.current_period_start * 1000),
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
        items: subscription.items.data.map((item) => ({
          priceId: item.price.id,
          productId: item.price.product,
        })),
      };
    } catch (error) {
      logger.error("Erro ao buscar assinatura:", error);
      throw new Error(`Falha ao buscar assinatura: ${error.message}`);
    }
  }

  /**
   * Criar reembolso
   */
  async createRefund(paymentIntentId, amount = null) {
    try {
      const refundParams = {
        payment_intent: paymentIntentId,
      };

      if (amount) {
        refundParams.amount = Math.round(amount * 100);
      }

      const refund = await this.stripe.refunds.create(refundParams);

      logger.info(`Reembolso criado: ${refund.id} para ${paymentIntentId}`);

      return {
        refundId: refund.id,
        amount: refund.amount / 100,
        status: refund.status,
      };
    } catch (error) {
      logger.error("Erro ao criar reembolso:", error);
      throw new Error(`Falha ao criar reembolso: ${error.message}`);
    }
  }

  /**
   * Verificar assinatura do webhook
   */
  verifyWebhookSignature(payload, signature) {
    try {
      const event = this.stripe.webhooks.constructEvent(
        payload,
        signature,
        this.webhookSecret
      );

      return event;
    } catch (error) {
      logger.error("Erro ao verificar assinatura do webhook:", error);
      throw new Error(
        `Webhook signature verification failed: ${error.message}`
      );
    }
  }

  /**
   * Buscar métodos de pagamento do cliente
   */
  async getPaymentMethods(customerId) {
    try {
      const paymentMethods = await this.stripe.paymentMethods.list({
        customer: customerId,
        type: "card",
      });

      return paymentMethods.data.map((pm) => ({
        id: pm.id,
        brand: pm.card.brand,
        last4: pm.card.last4,
        expMonth: pm.card.exp_month,
        expYear: pm.card.exp_year,
        isDefault:
          pm.id === customerId.invoice_settings?.default_payment_method,
      }));
    } catch (error) {
      logger.error("Erro ao buscar métodos de pagamento:", error);
      throw new Error(`Falha ao buscar métodos: ${error.message}`);
    }
  }

  /**
   * Atualizar método de pagamento padrão
   */
  async setDefaultPaymentMethod(customerId, paymentMethodId) {
    try {
      // Anexar método de pagamento ao cliente se ainda não estiver
      await this.stripe.paymentMethods.attach(paymentMethodId, {
        customer: customerId,
      });

      // Definir como padrão
      const customer = await this.stripe.customers.update(customerId, {
        invoice_settings: {
          default_payment_method: paymentMethodId,
        },
      });

      logger.info(`Método de pagamento padrão atualizado para ${customerId}`);

      return {
        customerId: customer.id,
        defaultPaymentMethod: paymentMethodId,
      };
    } catch (error) {
      logger.error("Erro ao atualizar método de pagamento:", error);
      throw new Error(`Falha ao atualizar método: ${error.message}`);
    }
  }

  /**
   * Buscar faturas do cliente
   */
  async getInvoices(customerId, limit = 10) {
    try {
      const invoices = await this.stripe.invoices.list({
        customer: customerId,
        limit,
      });

      return invoices.data.map((invoice) => ({
        id: invoice.id,
        number: invoice.number,
        status: invoice.status,
        amount: invoice.amount_paid / 100,
        currency: invoice.currency,
        created: new Date(invoice.created * 1000),
        pdfUrl: invoice.invoice_pdf,
        hostedUrl: invoice.hosted_invoice_url,
      }));
    } catch (error) {
      logger.error("Erro ao buscar faturas:", error);
      throw new Error(`Falha ao buscar faturas: ${error.message}`);
    }
  }

  /**
   * Obter informações de um plano
   */
  getPlanInfo(planId) {
    return this.plans[planId] || null;
  }

  /**
   * Listar todos os planos
   */
  getAllPlans() {
    return Object.entries(this.plans).map(([id, plan]) => ({
      id,
      ...plan,
    }));
  }
}

module.exports = new StripeService();
