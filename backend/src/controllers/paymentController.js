const Payment = require("../models/Payment");
const User = require("../models/User");
const logger = require("../utils/logger");
const mongoose = require("mongoose");
const stripeService = require("../utils/stripeService");
const mercadoPagoService = require("../utils/mercadoPagoService");
const NotificationService = require("../services/notificationService");
const emailService = require("../utils/emailService");

// Obter todos os pagamentos do usuário
exports.getPayments = async (req, res) => {
  try {
    const userId = req.user.id;
    const { status, paymentMethod, limit = 20, page = 1 } = req.query;

    let filter = { userId };
    if (status) filter.status = status;
    if (paymentMethod) filter.paymentMethod = paymentMethod;

    const skip = (page - 1) * limit;

    const [payments, total] = await Promise.all([
      Payment.find(filter)
        .sort({ createdAt: -1 })
        .limit(parseInt(limit))
        .skip(skip),
      Payment.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      data: payments,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    logger.error("Erro ao obter pagamentos:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Erro ao obter pagamentos",
    });
  }
};

// Obter um pagamento específico
exports.getPaymentById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const payment = await Payment.findOne({ _id: id, userId });

    if (!payment) {
      return res.status(404).json({
        success: false,
        error: "Pagamento não encontrado",
      });
    }

    res.status(200).json({
      success: true,
      data: payment,
    });
  } catch (error) {
    logger.error("Erro ao obter pagamento:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Erro ao obter pagamento",
    });
  }
};

// Criar um novo pagamento (iniciar processo)
exports.createPayment = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      amount,
      description,
      paymentMethod = "credit_card",
      type = "purchase",
      item,
    } = req.body;

    // Validação básica
    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        error: "Valor inválido",
      });
    }

    const payment = new Payment({
      userId,
      amount,
      description,
      paymentMethod,
      type,
      item,
      status: "pending",
      metadata: {
        ipAddress: req.ip,
        userAgent: req.headers["user-agent"],
      },
    });

    await payment.save();

    res.status(201).json({
      success: true,
      data: payment,
      message: "Pagamento criado com sucesso",
    });
  } catch (error) {
    logger.error("Erro ao criar pagamento:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Erro ao criar pagamento",
    });
  }
};

// Confirmar pagamento
exports.confirmPayment = async (req, res) => {
  try {
    const userId = req.user.id;
    const { paymentId, externalId, data } = req.body;

    const payment = await Payment.findOne({ _id: paymentId, userId });

    if (!payment) {
      return res.status(404).json({
        success: false,
        error: "Pagamento não encontrado",
      });
    }

    // Marcar pagamento como sucesso
    payment.markSuccess(externalId, data);
    await payment.save();

    // ===== PROCESSAMENTO DO PAGAMENTO =====
    const user = await User.findById(userId);

    if (!user) {
      logger.error(`Usuário ${userId} não encontrado ao processar pagamento`);
      return res.status(404).json({
        success: false,
        error: "Usuário não encontrado",
      });
    }

    // Processar baseado no tipo de pagamento
    if (payment.type === "subscription") {
      // Ativar assinatura Premium
      // bronze = Free, silver = FreePremium, gold = Premium
      const plan = payment.item?.name || payment.description;
      const planId =
        plan.toLowerCase().includes("bronze") ||
        plan.toLowerCase().includes("free")
          ? "bronze"
          : plan.toLowerCase().includes("silver") ||
            plan.toLowerCase().includes("freepremium")
          ? "silver"
          : plan.toLowerCase().includes("gold") ||
            plan.toLowerCase().includes("premium")
          ? "gold"
          : "bronze";

      // Calcular período (30 dias)
      const currentPeriodStart = new Date();
      const currentPeriodEnd = new Date();
      currentPeriodEnd.setDate(currentPeriodEnd.getDate() + 30);

      await user.activatePremium({
        plan: planId,
        status: "active",
        currentPeriodStart,
        currentPeriodEnd,
        stripeCustomerId: payment.stripeData?.chargeId
          ? user.subscription.stripeCustomerId
          : null,
        stripeSubscriptionId: payment.stripeData?.paymentIntentId || null,
        stripePriceId: payment.stripeData?.sessionId || null,
        mercadoPagoCustomerId: payment.mercadopagoData?.collectorId || null,
        mercadoPagoSubscriptionId: payment.mercadopagoData?.paymentId || null,
      });

      logger.info(`✅ Assinatura ${planId} ativada para usuário ${userId}`);

      // Adicionar ao histórico
      await user.addPaymentHistory({
        paymentId: payment._id,
        amount: payment.amount,
        status: "completed",
        gateway: payment.paymentMethod.includes("stripe")
          ? "stripe"
          : "mercadopago",
      });

      // Enviar notificação
      await NotificationService.createNotification(
        userId,
        "subscription_activated",
        "🎉 Assinatura Premium Ativada!",
        `Seu plano ${planId.toUpperCase()} foi ativado com sucesso. Aproveite todos os recursos premium!`,
        { plan: planId, paymentId: payment._id }
      );

      // Enviar email de confirmação
      try {
        await emailService.sendEmailFromTemplate(
          user.email,
          "Assinatura Premium Ativada - DespFinance",
          "subscription-activated",
          {
            name: user.fullName || user.username,
            plan: planId.toUpperCase(),
            amount: payment.amount.toFixed(2),
            expiresAt: currentPeriodEnd.toLocaleDateString("pt-BR"),
          }
        );
      } catch (emailError) {
        logger.error("Erro ao enviar email de confirmação:", emailError);
        // Não bloqueia o processo se email falhar
      }
    } else if (
      payment.type === "purchase" &&
      payment.item?.type === "coins_pack"
    ) {
      // Processar compra de moedas
      const coinAmount = payment.item.quantity || 1000;
      await user.addCoins(coinAmount);

      logger.info(`💰 ${coinAmount} coins adicionados para usuário ${userId}`);

      // Adicionar ao histórico
      await user.addPaymentHistory({
        paymentId: payment._id,
        amount: payment.amount,
        status: "completed",
        gateway: payment.paymentMethod.includes("stripe")
          ? "stripe"
          : "mercadopago",
      });

      // Enviar notificação
      await NotificationService.createNotification(
        userId,
        "coins_purchased",
        "💰 Coins Adicionados!",
        `${coinAmount} coins foram adicionados à sua conta!`,
        { coins: coinAmount, paymentId: payment._id }
      );
    } else if (payment.type === "refund") {
      // Processar reembolso
      if (payment.metadata?.originalPaymentId) {
        const originalPayment = await Payment.findById(
          payment.metadata.originalPaymentId
        );

        if (originalPayment && originalPayment.type === "subscription") {
          // Cancelar assinatura se foi reembolso de subscription
          await user.cancelSubscription(true);

          logger.info(
            `🔄 Assinatura cancelada devido a reembolso para usuário ${userId}`
          );
        }
      }

      await NotificationService.createNotification(
        userId,
        "refund_processed",
        "💸 Reembolso Processado",
        `Seu reembolso de R$ ${payment.amount.toFixed(
          2
        )} foi processado com sucesso.`,
        { paymentId: payment._id }
      );
    }

    res.status(200).json({
      success: true,
      data: payment,
      message: "Pagamento confirmado com sucesso",
      subscription: user.subscription,
    });
  } catch (error) {
    logger.error("Erro ao confirmar pagamento:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Erro ao confirmar pagamento",
    });
  }
};

// Cancelar pagamento
exports.cancelPayment = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { reason } = req.body;

    const payment = await Payment.findOne({ _id: id, userId });

    if (!payment) {
      return res.status(404).json({
        success: false,
        error: "Pagamento não encontrado",
      });
    }

    if (payment.status === "completed") {
      return res.status(400).json({
        success: false,
        error: "Não é possível cancelar um pagamento já confirmado",
      });
    }

    payment.status = "cancelled";
    payment.notes = reason || "Cancelado pelo usuário";
    await payment.save();

    res.status(200).json({
      success: true,
      data: payment,
      message: "Pagamento cancelado",
    });
  } catch (error) {
    logger.error("Erro ao cancelar pagamento:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Erro ao cancelar pagamento",
    });
  }
};

// Obter assinatura do usuário
exports.getSubscription = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "Usuário não encontrado",
      });
    }

    // Verificar se tem assinatura ativa
    const subscription = await Payment.findOne({
      userId,
      type: "subscription",
      status: "completed",
      createdAt: {
        $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // últimos 30 dias
      },
    });

    if (!subscription) {
      return res.status(200).json({
        success: true,
        data: null,
        message: "Nenhuma assinatura ativa",
      });
    }

    res.status(200).json({
      success: true,
      data: {
        plan: subscription.item?.name || "Premium",
        nextBillingDate: new Date(
          subscription.createdAt.getTime() + 30 * 24 * 60 * 60 * 1000
        ),
        status: "active",
        amount: subscription.amount,
      },
    });
  } catch (error) {
    logger.error("Erro ao obter assinatura:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Erro ao obter assinatura",
    });
  }
};

// Obter estatísticas de pagamentos
exports.getPaymentStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const { months = 12 } = req.query;

    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - months);

    const stats = await Payment.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          createdAt: { $gte: startDate },
          status: "completed",
        },
      },
      {
        $group: {
          _id: {
            month: { $month: "$createdAt" },
            year: { $year: "$createdAt" },
          },
          total: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    logger.error("Erro ao obter estatísticas de pagamentos:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Erro ao obter estatísticas",
    });
  }
};

// Reembolsar pagamento
exports.refundPayment = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { reason } = req.body;

    const payment = await Payment.findOne({ _id: id, userId });

    if (!payment) {
      return res.status(404).json({
        success: false,
        error: "Pagamento não encontrado",
      });
    }

    if (payment.status !== "completed") {
      return res.status(400).json({
        success: false,
        error: "Apenas pagamentos confirmados podem ser reembolsados",
      });
    }

    payment.status = "refunded";
    payment.notes = reason || "Reembolso solicitado";
    await payment.save();

    res.status(200).json({
      success: true,
      data: payment,
      message: "Reembolso processado com sucesso",
    });
  } catch (error) {
    logger.error("Erro ao processar reembolso:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Erro ao processar reembolso",
    });
  }
};

// ===================== MERCADO PAGO =====================

// Criar preferência de pagamento (Checkout Pro)
exports.createMercadoPagoPreference = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "Usuário não encontrado",
      });
    }

    const {
      amount,
      description,
      planType = "silver", // bronze, silver, gold
      type = "subscription",
    } = req.body;

    // Validação
    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        error: "Valor inválido",
      });
    }

    // Criar pagamento no banco
    const payment = new Payment({
      userId,
      amount,
      description:
        description || `Plano ${planType.toUpperCase()} - DespFinance`,
      paymentMethod: "mercadopago",
      type,
      item: {
        name: `Plano ${planType.toUpperCase()}`,
        type: type === "subscription" ? "subscription" : "purchase",
        planType,
      },
      status: "pending",
    });

    await payment.save();

    // Instanciar serviço MercadoPago
    const mercadoPago = new mercadoPagoService();

    // Dados para MercadoPago
    // Usar CPF de teste válido: 12345678909 (CPF de teste do MercadoPago)
    const paymentData = {
      title: `DespFinance - Plano ${planType.toUpperCase()}`,
      description:
        description ||
        `Assinatura ${planType.toUpperCase()} - DespFinance Premium`,
      amount,
      orderId: payment._id.toString(),
      customer: {
        name: user.fullName || user.username || "Test User",
        email: user.email,
        cpf: user.cpf || "12345678909", // CPF de teste válido do MercadoPago
        address: {
          street: user.address?.street || "Av Paulista",
          number: user.address?.number || "1000",
          zipcode: user.address?.zipcode || "01310100",
        },
      },
    };

    // Criar preferência no MercadoPago
    const preference = await mercadoPago.createPaymentPreference(paymentData);

    // Salvar dados do MercadoPago no pagamento
    payment.mercadopagoData = {
      preferenceId: preference.preferenceId,
      initPoint: preference.initPoint,
      sandboxInitPoint: preference.sandboxInitPoint,
    };
    await payment.save();

    logger.info(
      `✅ Preferência MercadoPago criada: ${preference.preferenceId} para usuário ${userId}`
    );

    // Retorno padrão MercadoPago: { id: ... }
    res.status(201).json({
      id: preference.preferenceId,
      initPoint: preference.initPoint,
      sandboxInitPoint: preference.sandboxInitPoint,
      paymentId: payment._id,
      message: "Preferência de pagamento criada com sucesso",
    });
  } catch (error) {
    logger.error("Erro ao criar preferência MercadoPago:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Erro ao processar pagamento",
    });
  }
};

// Criar pagamento direto (PIX, cartão)
exports.createMercadoPagoDirectPayment = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "Usuário não encontrado",
      });
    }

    const {
      amount,
      description,
      paymentMethodId = "pix", // Default para PIX
      planType,
      plan, // Aceitar tanto planType quanto plan
      type = "subscription",
      card, // dados do cartão se necessário
      installments = 1,
    } = req.body;

    // Determinar o plano
    const selectedPlan = planType || plan || "silver";

    // Validação
    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        error: "Valor inválido",
      });
    }

    // Criar pagamento no banco
    const payment = new Payment({
      userId,
      amount,
      description:
        description || `Plano ${selectedPlan.toUpperCase()} - DespFinance`,
      paymentMethod: `mercadopago_${paymentMethodId}`,
      type,
      item: {
        name: `Plano ${selectedPlan.toUpperCase()}`,
        type: type === "subscription" ? "subscription" : "purchase",
        planType: selectedPlan,
      },
      status: "pending",
    });

    await payment.save();

    // Instanciar serviço MercadoPago
    const mercadoPago = new mercadoPagoService();

    // Dados para pagamento direto
    const paymentData = {
      amount,
      description:
        description || `Plano ${selectedPlan.toUpperCase()} - DespFinance`,
      paymentMethodId,
      orderId: payment._id.toString(),
      installments,
      customer: {
        email: user.email,
        firstName: user.fullName ? user.fullName.split(" ")[0] : user.username,
        lastName: user.fullName
          ? user.fullName.split(" ").slice(1).join(" ")
          : "",
        cpf: user.cpf || "00000000000",
      },
      card,
    };

    // Criar pagamento direto no MercadoPago
    const mpPayment = await mercadoPago.createDirectPayment(paymentData);

    // Salvar dados do MercadoPago no pagamento
    payment.mercadopagoData = {
      paymentId: mpPayment.paymentId,
      status: mpPayment.status,
      paymentMethod: mpPayment.paymentMethod,
      qrCode: mpPayment.qrCode,
      qrCodeBase64: mpPayment.qrCodeBase64,
      pixCopyPaste: mpPayment.pixCopyPaste,
    };

    // Atualizar status baseado na resposta do MercadoPago
    if (mpPayment.status === "approved") {
      payment.status = "completed";
    } else if (mpPayment.status === "pending") {
      payment.status = "pending";
    } else {
      payment.status = "failed";
    }

    await payment.save();

    logger.info(
      `✅ Pagamento direto MercadoPago criado: ${mpPayment.paymentId} para usuário ${userId}`
    );

    const responseData = {
      paymentId: payment._id,
      mercadoPagoId: mpPayment.paymentId,
      status: mpPayment.status,
      paymentMethod: mpPayment.paymentMethod,
    };

    // Adicionar dados específicos do PIX se for PIX
    if (paymentMethodId === "pix") {
      responseData.pix = {
        qrCode: mpPayment.qrCode,
        qrCodeBase64: mpPayment.qrCodeBase64,
        copyPaste: mpPayment.pixCopyPaste,
      };
    }

    res.status(201).json({
      success: true,
      data: responseData,
      message: "Pagamento criado com sucesso",
    });
  } catch (error) {
    logger.error("Erro ao criar pagamento direto MercadoPago:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Erro ao processar pagamento",
    });
  }
};

// Webhook do MercadoPago
exports.mercadoPagoWebhook = async (req, res) => {
  try {
    logger.info("📨 Webhook MercadoPago recebido:", req.body);

    const { type, data, action } = req.body;

    // Validar se é um webhook válido
    if (!type || !data || !data.id) {
      return res.status(400).json({
        success: false,
        error: "Webhook inválido",
      });
    }

    // Instanciar serviço MercadoPago
    const mercadoPago = new mercadoPagoService();

    // Processar webhook
    const webhookResult = await mercadoPago.processWebhook(req.body);

    if (webhookResult.type === "payment") {
      // Buscar pagamento no banco pelo external_reference
      const payment = await Payment.findById(webhookResult.externalReference);

      if (!payment) {
        logger.warn(
          `⚠️ Pagamento não encontrado no webhook: ${webhookResult.externalReference}`
        );
        return res.status(404).json({
          success: false,
          error: "Pagamento não encontrado",
        });
      }

      // Atualizar status do pagamento
      const oldStatus = payment.status;

      switch (webhookResult.status) {
        case "approved":
          payment.status = "completed";
          break;
        case "pending":
          payment.status = "pending";
          break;
        case "rejected":
        case "cancelled":
          payment.status = "failed";
          break;
        default:
          payment.status = "pending";
      }

      // Atualizar dados do MercadoPago
      payment.mercadopagoData = {
        ...payment.mercadopagoData,
        paymentId: webhookResult.paymentId,
        status: webhookResult.status,
        paymentMethod: webhookResult.paymentMethod,
        lastWebhookAction: action,
        lastWebhookDate: new Date(),
      };

      await payment.save();

      logger.info(
        `🔄 Pagamento ${payment._id} atualizado: ${oldStatus} → ${payment.status}`
      );

      // Processar pagamento aprovado (ativar premium, etc.)
      if (payment.status === "completed" && oldStatus !== "completed") {
        await processCompletedPayment(payment);
      }
    }

    res.status(200).json({ success: true });
  } catch (error) {
    logger.error("Erro ao processar webhook MercadoPago:", error);
    res.status(500).json({
      success: false,
      error: "Erro ao processar webhook",
    });
  }
};

// Função auxiliar para processar pagamento concluído
async function processCompletedPayment(payment) {
  try {
    const user = await User.findById(payment.userId);

    if (!user) {
      logger.error(
        `Usuário ${payment.userId} não encontrado ao processar pagamento`
      );
      return;
    }

    if (payment.type === "subscription") {
      // Ativar premium baseado no plano
      const planType = payment.item?.planType || "silver";

      const currentPeriodStart = new Date();
      const currentPeriodEnd = new Date();
      currentPeriodEnd.setDate(currentPeriodEnd.getDate() + 30); // 30 dias

      await user.activatePremium({
        plan: planType,
        status: "active",
        currentPeriodStart,
        currentPeriodEnd,
        mercadoPagoCustomerId: payment.mercadopagoData?.payerId || null,
        mercadoPagoSubscriptionId: payment.mercadopagoData?.paymentId || null,
      });

      logger.info(
        `✅ Premium ${planType} ativado para usuário ${payment.userId}`
      );

      // Enviar notificação
      await NotificationService.createNotification(
        payment.userId,
        "subscription_activated",
        "🎉 Assinatura Premium Ativada!",
        `Seu plano ${planType.toUpperCase()} foi ativado com sucesso via MercadoPago!`,
        { plan: planType, paymentId: payment._id }
      );

      // Adicionar ao histórico
      await user.addPaymentHistory({
        paymentId: payment._id,
        amount: payment.amount,
        status: "completed",
        gateway: "mercadopago",
      });
    } else if (
      payment.type === "purchase" &&
      payment.item?.type === "coins_pack"
    ) {
      // Processar compra de moedas
      const coinAmount = payment.item.quantity || 1000;
      await user.addCoins(coinAmount);

      logger.info(
        `💰 ${coinAmount} coins adicionados para usuário ${payment.userId} via MercadoPago`
      );

      // Enviar notificação
      await NotificationService.createNotification(
        payment.userId,
        "coins_purchased",
        "💰 Coins Adicionados!",
        `${coinAmount} coins foram adicionados à sua conta via MercadoPago!`,
        { coins: coinAmount, paymentId: payment._id }
      );

      // Adicionar ao histórico
      await user.addPaymentHistory({
        paymentId: payment._id,
        amount: payment.amount,
        status: "completed",
        gateway: "mercadopago",
      });
    }
  } catch (error) {
    logger.error("Erro ao processar pagamento concluído:", error);
  }
}

// Buscar métodos de pagamento do MercadoPago
exports.getMercadoPagoPaymentMethods = async (req, res) => {
  try {
    const mercadoPago = new mercadoPagoService();
    const result = await mercadoPago.getPaymentMethods();

    res.status(200).json({
      success: true,
      data: result.paymentMethods,
      message: "Métodos de pagamento obtidos com sucesso",
    });
  } catch (error) {
    logger.error("Erro ao obter métodos de pagamento MercadoPago:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Erro ao obter métodos de pagamento",
    });
  }
};
