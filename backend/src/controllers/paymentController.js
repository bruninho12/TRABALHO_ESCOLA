// controllers/PaymentsController.js
const Payment = require("../models/Payment");
const User = require("../models/User");
const logger = require("../utils/logger");
const mongoose = require("mongoose");
const MercadoPagoService = require("../utils/mercadoPagoService");
const NotificationService = require("../services/notificationService");

// ===================== PAGAMENTOS =====================

// Obter todos os pagamentos do usuário
exports.getPayments = async (req, res) => {
  try {
    const userId = req.user.id;
    const { status, paymentMethod, limit = 20, page = 1 } = req.query;

    const filter = { userId };
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

    res.status(200).json({ success: true, data: payment });
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

    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, error: "Valor inválido" });
    }

    const payment = new Payment({
      userId,
      amount,
      description,
      paymentMethod,
      type,
      item,
      status: "pending",
      metadata: { ipAddress: req.ip, userAgent: req.headers["user-agent"] },
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
    if (!payment)
      return res
        .status(404)
        .json({ success: false, error: "Pagamento não encontrado" });

    payment.markSuccess(externalId, data);
    await payment.save();

    const user = await User.findById(userId);
    if (!user)
      return res
        .status(404)
        .json({ success: false, error: "Usuário não encontrado" });

    // Processamento baseado no tipo de pagamento
    await processUserPayment(user, payment);

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
    if (!payment)
      return res
        .status(404)
        .json({ success: false, error: "Pagamento não encontrado" });

    if (payment.status === "completed") {
      return res.status(400).json({
        success: false,
        error: "Não é possível cancelar um pagamento já confirmado",
      });
    }

    payment.status = "cancelled";
    payment.notes = reason || "Cancelado pelo usuário";
    await payment.save();

    res
      .status(200)
      .json({ success: true, data: payment, message: "Pagamento cancelado" });
  } catch (error) {
    logger.error("Erro ao cancelar pagamento:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Erro ao cancelar pagamento",
    });
  }
};

// ===================== ASSINATURAS =====================

// Obter assinatura do usuário
// Atualizar assinatura (upgrade/downgrade)
exports.updateSubscription = async (req, res) => {
  try {
    const userId = req.user.id;
    const { plan } = req.body;

    if (!["bronze", "silver", "gold", "platinum"].includes(plan)) {
      return res.status(400).json({
        success: false,
        error: "Plano inválido",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "Usuário não encontrado",
      });
    }

    // Atualizar plano
    user.subscription.plan = plan;
    user.subscription.status = "active";
    user.subscription.isActive = true;

    // Se não for bronze (gratuito), definir período
    if (plan !== "bronze") {
      const now = new Date();
      user.subscription.currentPeriodStart = now;
      user.subscription.currentPeriodEnd = new Date(
        now.getTime() + 30 * 24 * 60 * 60 * 1000
      ); // 30 dias
    }

    await user.save();

    res.status(200).json({
      success: true,
      data: user.subscription,
      message: `Plano alterado para ${plan.toUpperCase()} com sucesso`,
    });
  } catch (error) {
    logger.error("Erro ao atualizar assinatura:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Erro ao atualizar assinatura",
    });
  }
};

// Cancelar assinatura
exports.cancelSubscription = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "Usuário não encontrado",
      });
    }

    // Voltar para plano bronze (gratuito)
    user.subscription.plan = "bronze";
    user.subscription.status = "active";
    user.subscription.isActive = true;
    user.subscription.cancelAtPeriodEnd = false;
    user.subscription.currentPeriodStart = new Date();
    user.subscription.currentPeriodEnd = null;
    user.subscription.canceledAt = new Date();

    await user.save();

    res.status(200).json({
      success: true,
      data: user.subscription,
      message:
        "Assinatura cancelada. Você foi movido para o plano Bronze gratuito.",
    });
  } catch (error) {
    logger.error("Erro ao cancelar assinatura:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Erro ao cancelar assinatura",
    });
  }
};

// ===================== ESTATÍSTICAS =====================
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

    res.status(200).json({ success: true, data: stats });
  } catch (error) {
    logger.error("Erro ao obter estatísticas de pagamentos:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Erro ao obter estatísticas",
    });
  }
};

// ===================== REEMBOLSO =====================
exports.refundPayment = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { reason } = req.body;

    const payment = await Payment.findOne({ _id: id, userId });
    if (!payment)
      return res
        .status(404)
        .json({ success: false, error: "Pagamento não encontrado" });

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
exports.createMercadoPagoPreference = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user)
      return res
        .status(404)
        .json({ success: false, error: "Usuário não encontrado" });

    const {
      amount,
      description,
      planType = "silver",
      type = "subscription",
    } = req.body;

    if (!amount || amount <= 0)
      return res.status(400).json({ success: false, error: "Valor inválido" });

    const payment = new Payment({
      userId,
      amount,
      description:
        description || `Plano ${planType.toUpperCase()} - DespFinance`,
      paymentMethod: "mercadopago",
      type,
      item: { name: `Plano ${planType.toUpperCase()}`, type, planType },
      status: "pending",
    });

    await payment.save();

    const mercadoPago = new MercadoPagoService();

    const preferenceData = {
      title: `DespFinance - Plano ${planType.toUpperCase()}`,
      description:
        description ||
        `Assinatura ${planType.toUpperCase()} - DespFinance Premium`,
      amount,
      orderId: payment._id.toString(),
      customer: {
        name: user.fullName || user.username || "Test User",
        email: user.email,
        cpf: user.cpf || "12345678909",
        address: {
          street: user.address?.street || "Av Paulista",
          number: user.address?.number || "1000",
          zipcode: user.address?.zipcode || "01310100",
        },
      },
    };

    const preference = await mercadoPago.createPaymentPreference(
      preferenceData
    );

    payment.mercadopagoData = {
      preferenceId: preference.preferenceId,
      initPoint: preference.initPoint,
      sandboxInitPoint: preference.sandboxInitPoint,
    };
    await payment.save();

    res.status(201).json({
      success: true,
      id: preference.preferenceId,
      initPoint: preference.initPoint,
      sandboxInitPoint: preference.sandboxInitPoint,
      paymentId: payment._id,
      message: "Preferência de pagamento criada com sucesso",
    });
  } catch (error) {
    logger.error("Erro ao criar preferência MercadoPago:", {
      error: error,
      stack: error.stack,
      body: req.body,
      userId: req.user?.id,
    });
    console.error("[MercadoPagoPreference] Erro detalhado:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Erro ao processar pagamento",
      details: error,
    });
  }
};

// Criar pagamento direto (PIX, cartão)
exports.createMercadoPagoDirectPayment = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user)
      return res
        .status(404)
        .json({ success: false, error: "Usuário não encontrado" });

    const {
      amount,
      description,
      paymentMethodId = "pix",
      planType,
      plan,
      type = "subscription",
      card,
      installments = 1,
    } = req.body;
    const selectedPlan = planType || plan || "silver";

    if (!amount || amount <= 0)
      return res.status(400).json({ success: false, error: "Valor inválido" });

    const payment = new Payment({
      userId,
      amount,
      description:
        description || `Plano ${selectedPlan.toUpperCase()} - DespFinance`,
      paymentMethod: `mercadopago_${paymentMethodId}`,
      type,
      item: {
        name: `Plano ${selectedPlan.toUpperCase()}`,
        type,
        planType: selectedPlan,
      },
      status: "pending",
    });

    await payment.save();

    const mercadoPago = new MercadoPagoService();
    const paymentData = {
      amount,
      description: payment.description,
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

    const mpPayment = await mercadoPago.createDirectPayment(paymentData);

    payment.mercadopagoData = {
      paymentId: mpPayment.paymentId,
      status: mpPayment.status,
      paymentMethod: mpPayment.paymentMethod,
      qrCode: mpPayment.qrCode,
      qrCodeBase64: mpPayment.qrCodeBase64,
      pixCopyPaste: mpPayment.pixCopyPaste,
    };

    payment.status = ["approved", "pending"].includes(mpPayment.status)
      ? mpPayment.status === "approved"
        ? "completed"
        : "pending"
      : "failed";
    await payment.save();

    const responseData = {
      paymentId: payment._id,
      mercadoPagoId: mpPayment.paymentId,
      status: mpPayment.status,
      paymentMethod: mpPayment.paymentMethod,
      pix:
        paymentMethodId === "pix"
          ? {
              qrCode: mpPayment.qrCode,
              qrCodeBase64: mpPayment.qrCodeBase64,
              copyPaste: mpPayment.pixCopyPaste,
            }
          : undefined,
    };

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
    const mercadoPago = new MercadoPagoService();
    const webhookResult = await mercadoPago.processWebhook(req.body);

    if (webhookResult.type === "payment") {
      const payment = await Payment.findById(webhookResult.externalReference);
      if (!payment)
        return res
          .status(404)
          .json({ success: false, error: "Pagamento não encontrado" });

      const oldStatus = payment.status;
      payment.status =
        webhookResult.status === "approved"
          ? "completed"
          : webhookResult.status === "pending"
          ? "pending"
          : "failed";
      payment.mercadopagoData = {
        ...payment.mercadopagoData,
        paymentId: webhookResult.paymentId,
        status: webhookResult.status,
        paymentMethod: webhookResult.paymentMethod,
        lastWebhookAction: webhookResult.action,
        lastWebhookDate: new Date(),
      };
      await payment.save();

      if (payment.status === "completed" && oldStatus !== "completed") {
        await processCompletedPayment(payment);
      }
    }

    res.status(200).json({ success: true });
  } catch (error) {
    logger.error("Erro ao processar webhook MercadoPago:", error);
    res
      .status(500)
      .json({ success: false, error: "Erro ao processar webhook" });
  }
};

// Buscar métodos de pagamento MercadoPago
exports.getMercadoPagoPaymentMethods = async (req, res) => {
  try {
    const mercadoPago = new MercadoPagoService();
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

// ===================== FUNÇÕES AUXILIARES =====================
async function processUserPayment(user, payment) {
  try {
    if (payment.type === "subscription") {
      const plan = payment.item?.planType || "silver";
      const currentPeriodStart = new Date();
      const currentPeriodEnd = new Date();
      currentPeriodEnd.setDate(currentPeriodEnd.getDate() + 30);

      await user.activatePremium({
        plan,
        status: "active",
        currentPeriodStart,
        currentPeriodEnd,
        mercadoPagoCustomerId: payment.mercadopagoData?.payerId || null,
        mercadoPagoSubscriptionId: payment.mercadopagoData?.paymentId || null,
      });

      await NotificationService.createNotification(
        user._id,
        "subscription_activated",
        "🎉 Assinatura Premium Ativada!",
        `Seu plano ${plan.toUpperCase()} foi ativado com sucesso!`,
        { plan, paymentId: payment._id }
      );
      await user.addPaymentHistory({
        paymentId: payment._id,
        amount: payment.amount,
        status: "completed",
        gateway: payment.paymentMethod.includes("mercadopago")
          ? "mercadopago"
          : "stripe",
      });
    } else if (
      payment.type === "purchase" &&
      payment.item?.type === "coins_pack"
    ) {
      const coins = payment.item.quantity || 1000;
      await user.addCoins(coins);
      await NotificationService.createNotification(
        user._id,
        "coins_purchased",
        "💰 Coins Adicionados!",
        `${coins} coins foram adicionados à sua conta!`,
        { coins, paymentId: payment._id }
      );
      await user.addPaymentHistory({
        paymentId: payment._id,
        amount: payment.amount,
        status: "completed",
        gateway: "mercadopago",
      });
    }
  } catch (error) {
    logger.error("Erro ao processar pagamento do usuário:", error);
  }
}

async function processCompletedPayment(payment) {
  const user = await User.findById(payment.userId);
  if (!user) return;
  await processUserPayment(user, payment);
}

// ===================== MÉTODOS DE PAGAMENTO =====================

// Obter métodos de pagamento do usuário
exports.getPaymentMethods = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("paymentMethods");

    res.status(200).json({
      success: true,
      data: user?.paymentMethods || [],
    });
  } catch (error) {
    logger.error("Erro ao obter métodos de pagamento:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Erro ao obter métodos de pagamento",
    });
  }
};

// Adicionar método de pagamento
exports.addPaymentMethod = async (req, res) => {
  try {
    const userId = req.user.id;
    const { number, name, expiry, cvv, type = "card" } = req.body;

    // Validação básica
    if (!number || !name || !expiry || !cvv) {
      return res.status(400).json({
        success: false,
        error: "Todos os campos são obrigatórios",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "Usuário não encontrado",
      });
    }

    // Criar método de pagamento
    const paymentMethod = {
      id: new mongoose.Types.ObjectId(),
      type,
      last4: number.slice(-4),
      brand: getBrandFromNumber(number),
      expiryMonth: expiry.split("/")[0],
      expiryYear: `20${expiry.split("/")[1]}`,
      isDefault: (user.paymentMethods || []).length === 0,
      createdAt: new Date(),
    };

    if (!user.paymentMethods) {
      user.paymentMethods = [];
    }

    user.paymentMethods.push(paymentMethod);
    await user.save();

    res.status(201).json({
      success: true,
      data: paymentMethod,
    });
  } catch (error) {
    logger.error("Erro ao adicionar método de pagamento:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Erro ao adicionar método de pagamento",
    });
  }
};

// Remover método de pagamento
exports.removePaymentMethod = async (req, res) => {
  try {
    const userId = req.user._id;
    const { methodId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "Usuário não encontrado",
      });
    }

    user.paymentMethods = user.paymentMethods.filter(
      (method) => method.id.toString() !== methodId
    );

    await user.save();

    res.status(200).json({
      success: true,
      message: "Método de pagamento removido com sucesso",
    });
  } catch (error) {
    logger.error("Erro ao remover método de pagamento:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Erro ao remover método de pagamento",
    });
  }
};

// Definir método de pagamento padrão
exports.setDefaultPaymentMethod = async (req, res) => {
  try {
    const userId = req.user._id;
    const { methodId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "Usuário não encontrado",
      });
    }

    // Remover padrão de todos e definir o novo
    user.paymentMethods.forEach((method) => {
      method.isDefault = method.id.toString() === methodId;
    });

    await user.save();

    res.status(200).json({
      success: true,
      message: "Método de pagamento padrão definido com sucesso",
    });
  } catch (error) {
    logger.error("Erro ao definir método padrão:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Erro ao definir método padrão",
    });
  }
};

// ===================== HISTÓRICO DE PAGAMENTOS =====================

// Obter histórico de pagamentos
exports.getBillingHistory = async (req, res) => {
  try {
    const userId = req.user._id;
    const { limit = 10, page = 1 } = req.query;

    const skip = (page - 1) * limit;

    const [payments, total] = await Promise.all([
      Payment.find({ userId })
        .sort({ createdAt: -1 })
        .limit(parseInt(limit))
        .skip(skip)
        .select("amount status description createdAt type paymentMethod"),
      Payment.countDocuments({ userId }),
    ]);

    const billingHistory = payments.map((payment) => ({
      id: payment._id,
      amount: payment.amount,
      status: payment.status,
      description: payment.description || `Pagamento ${payment.type}`,
      date: payment.createdAt,
      method: payment.paymentMethod,
    }));

    res.status(200).json({
      success: true,
      data: billingHistory,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    logger.error("Erro ao obter histórico:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Erro ao obter histórico",
    });
  }
};

// ===================== ASSINATURA =====================

// Obter assinatura atual
exports.getSubscription = async (req, res) => {
  try {
    console.log(
      "🔍 [getSubscription] Rota acionada para usuário:",
      req.user._id
    );
    const userId = req.user._id;
    const user = await User.findById(userId).select(
      "subscription plan premiumFeatures"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "Usuário não encontrado",
      });
    }

    const subscription = {
      plan: user.plan || "bronze",
      status: user.subscription?.status || "inactive",
      isActive: user.subscription?.isActive || false,
      nextBilling: user.subscription?.nextBilling,
      features: user.premiumFeatures || {},
    };

    res.status(200).json({
      success: true,
      data: subscription,
    });
  } catch (error) {
    logger.error("Erro ao obter assinatura:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Erro ao obter assinatura",
    });
  }
};

// Atualizar renovação automática
exports.updateAutoRenewal = async (req, res) => {
  try {
    const userId = req.user.id;
    const { enabled } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "Usuário não encontrado",
      });
    }

    if (!user.subscription) {
      user.subscription = {};
    }

    user.subscription.autoRenewal = enabled;
    await user.save();

    res.status(200).json({
      success: true,
      message: `Renovação automática ${
        enabled ? "ativada" : "desativada"
      } com sucesso`,
    });
  } catch (error) {
    logger.error("Erro ao atualizar renovação automática:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Erro ao atualizar renovação automática",
    });
  }
};

// Função auxiliar para detectar bandeira do cartão
function getBrandFromNumber(number) {
  const firstDigit = number.charAt(0);
  const firstTwoDigits = number.substring(0, 2);
  const firstFourDigits = number.substring(0, 4);

  if (firstDigit === "4") return "Visa";
  if (["51", "52", "53", "54", "55"].includes(firstTwoDigits))
    return "Mastercard";
  if (["34", "37"].includes(firstTwoDigits)) return "American Express";
  if (firstFourDigits === "6011") return "Discover";

  return "Desconhecido";
}
