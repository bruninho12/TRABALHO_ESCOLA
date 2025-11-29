const stripeService = require("../utils/stripeService");
const mercadoPagoService = require("../utils/mercadoPagoService");
const Payment = require("../models/Payment");
const User = require("../models/User");
const NotificationService = require("../services/notificationService");
const logger = require("../utils/logger");

/**
 * Processar webhook do Stripe
 * POST /api/payments/webhook/stripe
 */
exports.handleStripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  const rawBody = req.rawBody; // Necessário middleware raw-body para webhooks

  try {
    // Verificar assinatura do webhook
    const event = stripeService.verifyWebhookSignature(rawBody, sig);

    logger.info(`📨 Webhook Stripe recebido: ${event.type}`);

    // Processar evento baseado no tipo
    switch (event.type) {
      // ===== ASSINATURAS =====
      case "customer.subscription.created":
        await handleSubscriptionCreated(event.data.object);
        break;

      case "customer.subscription.updated":
        await handleSubscriptionUpdated(event.data.object);
        break;

      case "customer.subscription.deleted":
        await handleSubscriptionDeleted(event.data.object);
        break;

      // ===== PAGAMENTOS =====
      case "payment_intent.succeeded":
        await handlePaymentIntentSucceeded(event.data.object);
        break;

      case "payment_intent.payment_failed":
        await handlePaymentIntentFailed(event.data.object);
        break;

      case "charge.succeeded":
        await handleChargeSucceeded(event.data.object);
        break;

      case "charge.refunded":
        await handleChargeRefunded(event.data.object);
        break;

      // ===== FATURAS =====
      case "invoice.payment_succeeded":
        await handleInvoicePaymentSucceeded(event.data.object);
        break;

      case "invoice.payment_failed":
        await handleInvoicePaymentFailed(event.data.object);
        break;

      default:
        logger.info(`ℹ️ Evento não tratado: ${event.type}`);
    }

    res.json({ received: true });
  } catch (err) {
    logger.error("❌ Erro ao processar webhook Stripe:", err);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
};

/**
 * Processar webhook do MercadoPago
 * POST /api/payments/webhook/mercadopago
 */
exports.handleMercadoPagoWebhook = async (req, res) => {
  try {
    const { type, data, action } = req.body;

    logger.info(`📨 Webhook MercadoPago recebido: ${type} - ${action}`);

    // MercadoPago envia diferentes tipos de notificações
    if (type === "payment") {
      const paymentId = data.id;

      // Buscar detalhes do pagamento na API do MercadoPago
      const paymentDetails = await mercadoPagoService.getPayment(paymentId);

      if (paymentDetails.status === "approved") {
        await handleMercadoPagoPaymentApproved(paymentDetails);
      } else if (paymentDetails.status === "rejected") {
        await handleMercadoPagoPaymentRejected(paymentDetails);
      } else if (paymentDetails.status === "refunded") {
        await handleMercadoPagoPaymentRefunded(paymentDetails);
      }
    }

    res.status(200).json({ success: true });
  } catch (err) {
    logger.error("❌ Erro ao processar webhook MercadoPago:", err);
    return res.status(400).json({ error: err.message });
  }
};

// ===== HANDLERS STRIPE =====

/**
 * Assinatura criada no Stripe
 */
async function handleSubscriptionCreated(subscription) {
  try {
    const customerId = subscription.customer;
    const subscriptionId = subscription.id;
    const priceId = subscription.items.data[0].price.id;

    // Encontrar usuário pelo Stripe Customer ID
    const user = await User.findOne({
      "subscription.stripeCustomerId": customerId,
    });

    if (!user) {
      logger.error(`Usuário não encontrado para customer ${customerId}`);
      return;
    }

    // Determinar plano baseado no priceId
    const planInfo = stripeService.getPlanInfo(priceId);

    if (!planInfo) {
      logger.error(`Plano não encontrado para priceId ${priceId}`);
      return;
    }

    // Ativar Premium
    await user.activatePremium({
      plan: planInfo.name,
      status: subscription.status === "trialing" ? "trialing" : "active",
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      stripeCustomerId: customerId,
      stripeSubscriptionId: subscriptionId,
      stripePriceId: priceId,
    });

    logger.info(
      `✅ Assinatura ${planInfo.name} criada para usuário ${user._id}`
    );

    // Criar notificação
    await NotificationService.createNotification(
      user._id,
      "subscription_created",
      "🎉 Assinatura Iniciada!",
      `Sua assinatura ${planInfo.name.toUpperCase()} foi criada com sucesso!`,
      { plan: planInfo.name, subscriptionId }
    );
  } catch (error) {
    logger.error("Erro ao processar subscription.created:", error);
  }
}

/**
 * Assinatura atualizada no Stripe
 */
async function handleSubscriptionUpdated(subscription) {
  try {
    const subscriptionId = subscription.id;
    const user = await User.findOne({
      "subscription.stripeSubscriptionId": subscriptionId,
    });

    if (!user) {
      logger.error(
        `Usuário não encontrado para subscription ${subscriptionId}`
      );
      return;
    }

    // Atualizar status da assinatura
    user.subscription.status = subscription.status;
    user.subscription.currentPeriodStart = new Date(
      subscription.current_period_start * 1000
    );
    user.subscription.currentPeriodEnd = new Date(
      subscription.current_period_end * 1000
    );
    user.subscription.cancelAtPeriodEnd = subscription.cancel_at_period_end;

    if (subscription.canceled_at) {
      user.subscription.canceledAt = new Date(subscription.canceled_at * 1000);
    }

    await user.save();

    logger.info(
      `📝 Assinatura atualizada para usuário ${user._id}: ${subscription.status}`
    );

    // Notificar mudanças importantes
    if (
      subscription.cancel_at_period_end &&
      !user.subscription.cancelAtPeriodEnd
    ) {
      await NotificationService.createNotification(
        user._id,
        "subscription_cancelled",
        "⚠️ Assinatura Cancelada",
        `Sua assinatura será cancelada em ${user.subscription.currentPeriodEnd.toLocaleDateString(
          "pt-BR"
        )}`,
        { subscriptionId }
      );
    }
  } catch (error) {
    logger.error("Erro ao processar subscription.updated:", error);
  }
}

/**
 * Assinatura deletada/expirada no Stripe
 */
async function handleSubscriptionDeleted(subscription) {
  try {
    const subscriptionId = subscription.id;
    const user = await User.findOne({
      "subscription.stripeSubscriptionId": subscriptionId,
    });

    if (!user) {
      logger.error(
        `Usuário não encontrado para subscription ${subscriptionId}`
      );
      return;
    }

    // Expirar assinatura
    await user.expireSubscription();

    logger.info(`❌ Assinatura expirada para usuário ${user._id}`);

    // Criar notificação
    await NotificationService.createNotification(
      user._id,
      "subscription_expired",
      "⏰ Assinatura Expirada",
      "Sua assinatura Premium expirou. Renove para continuar aproveitando os benefícios!",
      { subscriptionId }
    );
  } catch (error) {
    logger.error("Erro ao processar subscription.deleted:", error);
  }
}

/**
 * Payment Intent bem-sucedido (pagamento único)
 */
async function handlePaymentIntentSucceeded(paymentIntent) {
  try {
    const amount = paymentIntent.amount / 100; // Stripe usa centavos
    const paymentIntentId = paymentIntent.id;

    // Buscar pagamento pendente no banco
    const payment = await Payment.findOne({
      "stripeData.paymentIntentId": paymentIntentId,
      status: { $in: ["pending", "processing"] },
    });

    if (payment) {
      payment.markSuccess(paymentIntentId, {
        stripe: {
          chargeId: paymentIntent.latest_charge,
          paymentIntentId: paymentIntentId,
          amount: amount,
        },
      });
      await payment.save();

      logger.info(
        `✅ Payment Intent ${paymentIntentId} processado - R$ ${amount}`
      );

      // Processar conforme tipo de pagamento
      const user = await User.findById(payment.userId);

      if (payment.type === "purchase" && payment.item?.type === "coins_pack") {
        await user.addCoins(payment.item.quantity);

        await NotificationService.createNotification(
          user._id,
          "coins_purchased",
          "💰 Coins Adicionados!",
          `${payment.item.quantity} coins foram adicionados à sua conta!`,
          { paymentId: payment._id }
        );
      }
    }
  } catch (error) {
    logger.error("Erro ao processar payment_intent.succeeded:", error);
  }
}

/**
 * Payment Intent falhou
 */
async function handlePaymentIntentFailed(paymentIntent) {
  try {
    const paymentIntentId = paymentIntent.id;

    const payment = await Payment.findOne({
      "stripeData.paymentIntentId": paymentIntentId,
    });

    if (payment) {
      payment.markFailed("Falha no processamento do pagamento");
      await payment.save();

      logger.error(`❌ Payment Intent ${paymentIntentId} falhou`);

      await NotificationService.createNotification(
        payment.userId,
        "payment_failed",
        "❌ Pagamento Falhou",
        "Houve um problema ao processar seu pagamento. Tente novamente.",
        { paymentId: payment._id }
      );
    }
  } catch (error) {
    logger.error("Erro ao processar payment_intent.failed:", error);
  }
}

/**
 * Cobrança bem-sucedida
 */
async function handleChargeSucceeded(charge) {
  logger.info(
    `✅ Charge ${charge.id} bem-sucedido - R$ ${charge.amount / 100}`
  );
}

/**
 * Cobrança reembolsada
 */
async function handleChargeRefunded(charge) {
  try {
    const chargeId = charge.id;
    const amount = charge.amount_refunded / 100;

    const payment = await Payment.findOne({
      "stripeData.chargeId": chargeId,
    });

    if (payment) {
      // Criar registro de reembolso
      const refundPayment = new Payment({
        userId: payment.userId,
        amount: amount,
        type: "refund",
        status: "completed",
        paymentMethod: "stripe",
        metadata: {
          originalPaymentId: payment._id,
          chargeId: chargeId,
        },
      });
      await refundPayment.save();

      logger.info(
        `💸 Reembolso de R$ ${amount} processado para pagamento ${payment._id}`
      );

      // Se foi assinatura, cancelar
      if (payment.type === "subscription") {
        const user = await User.findById(payment.userId);
        await user.cancelSubscription(true);
      }

      await NotificationService.createNotification(
        payment.userId,
        "refund_processed",
        "💸 Reembolso Processado",
        `Seu reembolso de R$ ${amount.toFixed(2)} foi processado com sucesso.`,
        { paymentId: payment._id }
      );
    }
  } catch (error) {
    logger.error("Erro ao processar charge.refunded:", error);
  }
}

/**
 * Fatura paga com sucesso (renovação de assinatura)
 */
async function handleInvoicePaymentSucceeded(invoice) {
  try {
    const subscriptionId = invoice.subscription;
    const amount = invoice.amount_paid / 100;

    const user = await User.findOne({
      "subscription.stripeSubscriptionId": subscriptionId,
    });

    if (!user) {
      logger.error(
        `Usuário não encontrado para subscription ${subscriptionId}`
      );
      return;
    }

    // Adicionar ao histórico de pagamentos
    await user.addPaymentHistory({
      amount: amount,
      status: "completed",
      gateway: "stripe",
      metadata: {
        invoiceId: invoice.id,
        subscriptionId: subscriptionId,
      },
    });

    logger.info(
      `💳 Renovação de assinatura paga - Usuário ${user._id} - R$ ${amount}`
    );

    await NotificationService.createNotification(
      user._id,
      "subscription_renewed",
      "✅ Assinatura Renovada!",
      `Sua assinatura foi renovada com sucesso por R$ ${amount.toFixed(2)}`,
      { invoiceId: invoice.id }
    );
  } catch (error) {
    logger.error("Erro ao processar invoice.payment_succeeded:", error);
  }
}

/**
 * Fatura não paga (renovação falhou)
 */
async function handleInvoicePaymentFailed(invoice) {
  try {
    const subscriptionId = invoice.subscription;

    const user = await User.findOne({
      "subscription.stripeSubscriptionId": subscriptionId,
    });

    if (!user) {
      logger.error(
        `Usuário não encontrado para subscription ${subscriptionId}`
      );
      return;
    }

    // Atualizar status para past_due
    user.subscription.status = "past_due";
    await user.save();

    logger.warn(`⚠️ Falha na renovação da assinatura - Usuário ${user._id}`);

    await NotificationService.createNotification(
      user._id,
      "subscription_payment_failed",
      "⚠️ Falha no Pagamento",
      "Não conseguimos processar o pagamento da sua assinatura. Atualize seu método de pagamento para evitar o cancelamento.",
      { invoiceId: invoice.id }
    );
  } catch (error) {
    logger.error("Erro ao processar invoice.payment_failed:", error);
  }
}

// ===== HANDLERS MERCADOPAGO =====

/**
 * Pagamento aprovado no MercadoPago
 */
async function handleMercadoPagoPaymentApproved(paymentDetails) {
  try {
    const paymentId = paymentDetails.id;
    const amount = paymentDetails.transaction_amount;

    // Buscar pagamento no banco
    const payment = await Payment.findOne({
      "mercadopagoData.paymentId": paymentId,
      status: { $in: ["pending", "processing"] },
    });

    if (payment) {
      payment.markSuccess(paymentId, {
        mercadopago: {
          paymentId: paymentId,
          status: paymentDetails.status,
          statusDetail: paymentDetails.status_detail,
          paymentMethodId: paymentDetails.payment_method_id,
        },
      });
      await payment.save();

      logger.info(
        `✅ Pagamento MercadoPago ${paymentId} aprovado - R$ ${amount}`
      );

      // Processar conforme tipo
      const user = await User.findById(payment.userId);

      if (payment.type === "subscription") {
        const plan = payment.item?.name || "bronze";
        const planId = plan.toLowerCase().includes("bronze")
          ? "bronze"
          : plan.toLowerCase().includes("silver")
          ? "silver"
          : plan.toLowerCase().includes("gold")
          ? "gold"
          : "bronze";

        const currentPeriodEnd = new Date();
        currentPeriodEnd.setDate(currentPeriodEnd.getDate() + 30);

        await user.activatePremium({
          plan: planId,
          status: "active",
          currentPeriodStart: new Date(),
          currentPeriodEnd,
          mercadoPagoCustomerId: paymentDetails.payer?.id,
          mercadoPagoSubscriptionId: paymentId,
        });

        await NotificationService.createNotification(
          user._id,
          "subscription_activated",
          "🎉 Assinatura Ativada!",
          `Seu plano ${planId.toUpperCase()} foi ativado via PIX/MercadoPago!`,
          { plan: planId, paymentId: payment._id }
        );
      } else if (payment.type === "purchase") {
        await user.addCoins(payment.item?.quantity || 1000);

        await NotificationService.createNotification(
          user._id,
          "coins_purchased",
          "💰 Coins Adicionados!",
          `${payment.item?.quantity || 1000} coins foram adicionados via PIX!`,
          { paymentId: payment._id }
        );
      }

      // Adicionar ao histórico
      await user.addPaymentHistory({
        paymentId: payment._id,
        amount: amount,
        status: "completed",
        gateway: "mercadopago",
      });
    }
  } catch (error) {
    logger.error("Erro ao processar pagamento MercadoPago aprovado:", error);
  }
}

/**
 * Pagamento rejeitado no MercadoPago
 */
async function handleMercadoPagoPaymentRejected(paymentDetails) {
  try {
    const paymentId = paymentDetails.id;

    const payment = await Payment.findOne({
      "mercadopagoData.paymentId": paymentId,
    });

    if (payment) {
      payment.markFailed(
        `Pagamento rejeitado: ${paymentDetails.status_detail}`
      );
      await payment.save();

      logger.error(`❌ Pagamento MercadoPago ${paymentId} rejeitado`);

      await NotificationService.createNotification(
        payment.userId,
        "payment_failed",
        "❌ Pagamento Rejeitado",
        "Seu pagamento via MercadoPago foi rejeitado. Tente novamente ou use outro método.",
        { paymentId: payment._id }
      );
    }
  } catch (error) {
    logger.error("Erro ao processar pagamento MercadoPago rejeitado:", error);
  }
}

/**
 * Pagamento reembolsado no MercadoPago
 */
async function handleMercadoPagoPaymentRefunded(paymentDetails) {
  try {
    const paymentId = paymentDetails.id;
    const amount = paymentDetails.transaction_amount;

    const payment = await Payment.findOne({
      "mercadopagoData.paymentId": paymentId,
    });

    if (payment) {
      const refundPayment = new Payment({
        userId: payment.userId,
        amount: amount,
        type: "refund",
        status: "completed",
        paymentMethod: "mercadopago",
        metadata: {
          originalPaymentId: payment._id,
          paymentId: paymentId,
        },
      });
      await refundPayment.save();

      logger.info(`💸 Reembolso MercadoPago de R$ ${amount} processado`);

      // Se foi assinatura, cancelar
      if (payment.type === "subscription") {
        const user = await User.findById(payment.userId);
        await user.cancelSubscription(true);
      }

      await NotificationService.createNotification(
        payment.userId,
        "refund_processed",
        "💸 Reembolso Processado",
        `Seu reembolso de R$ ${amount.toFixed(2)} foi processado com sucesso.`,
        { paymentId: payment._id }
      );
    }
  } catch (error) {
    logger.error("Erro ao processar reembolso MercadoPago:", error);
  }
}

module.exports = exports;
