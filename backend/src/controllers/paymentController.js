const Payment = require("../models/Payment");
const User = require("../models/User");
const logger = require("../utils/logger");

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

    payment.markSuccess(externalId, data);
    await payment.save();

    // TODO: Adicionar lógica de processamento (créditos, assinatura, etc)

    res.status(200).json({
      success: true,
      data: payment,
      message: "Pagamento confirmado com sucesso",
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
          userId: require("mongoose").Types.ObjectId(userId),
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
