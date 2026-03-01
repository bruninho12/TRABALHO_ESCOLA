/**
 * Admin Controller - Painel Administrativo
 * Gestão de usuários, relatórios financeiros e métricas do sistema
 */

const User = require("../models/User");
const Payment = require("../models/Payment");
const Transaction = require("../models/Transaction");
const logger = require("../utils/logger");
const mongoose = require("mongoose");

// ===================== DASHBOARD OVERVIEW =====================

/**
 * Obter estatísticas gerais do dashboard admin
 */
exports.getDashboardStats = async (req, res) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    // Estatísticas gerais
    const [
      totalUsers,
      activeUsers,
      premiumUsers,
      blockedUsers,
      totalPayments,
      monthlyRevenue,
      lastMonthRevenue,
      pendingPayments,
      totalTransactions,
      systemHealth,
    ] = await Promise.all([
      User.countDocuments({}),
      User.countDocuments({ isActive: true }),
      User.countDocuments({
        "subscription.plan": { $in: ["silver", "gold", "platinum"] },
        "subscription.status": "active",
      }),
      User.countDocuments({ isBlocked: true }),
      Payment.countDocuments({}),
      Payment.aggregate([
        {
          $match: {
            status: "paid",
            createdAt: { $gte: startOfMonth },
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$amount" },
          },
        },
      ]),
      Payment.aggregate([
        {
          $match: {
            status: "paid",
            createdAt: { $gte: startOfLastMonth, $lt: endOfLastMonth },
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$amount" },
          },
        },
      ]),
      Payment.countDocuments({ status: "pending" }),
      Transaction.countDocuments({}),
      getSystemHealth(),
    ]);

    const currentRevenue = monthlyRevenue[0]?.total || 0;
    const previousRevenue = lastMonthRevenue[0]?.total || 0;
    const revenueGrowth =
      previousRevenue > 0
        ? (
            ((currentRevenue - previousRevenue) / previousRevenue) *
            100
          ).toFixed(1)
        : 0;

    const stats = {
      users: {
        total: totalUsers,
        active: activeUsers,
        premium: premiumUsers,
        blocked: blockedUsers,
        conversionRate:
          totalUsers > 0 ? ((premiumUsers / totalUsers) * 100).toFixed(1) : 0,
      },
      payments: {
        total: totalPayments,
        pending: pendingPayments,
        monthlyRevenue: currentRevenue,
        revenueGrowth: parseFloat(revenueGrowth),
      },
      transactions: {
        total: totalTransactions,
      },
      system: systemHealth,
    };

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    logger.error("Erro ao obter estatísticas do dashboard:", error);
    res.status(500).json({
      success: false,
      error: "Erro ao carregar estatísticas",
    });
  }
};

/**
 * Verificar saúde do sistema
 */
async function getSystemHealth() {
  try {
    const dbStatus =
      mongoose.connection.readyState === 1 ? "healthy" : "unhealthy";
    const memoryUsage = process.memoryUsage();
    const uptime = process.uptime();

    return {
      database: dbStatus,
      uptime: Math.floor(uptime / 3600), // horas
      memory: {
        used: Math.round(memoryUsage.heapUsed / 1024 / 1024), // MB
        total: Math.round(memoryUsage.heapTotal / 1024 / 1024), // MB
      },
    };
  } catch (error) {
    return { status: "error", error: error.message };
  }
}

// ===================== GESTÃO DE USUÁRIOS =====================

/**
 * Listar todos os usuários com filtros e paginação
 */
exports.getUsers = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      search,
      plan,
      status,
      isBlocked,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    const skip = (page - 1) * limit;

    // Construir filtros
    const filter = {};

    if (search) {
      filter.$or = [
        { username: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { fullName: { $regex: search, $options: "i" } },
      ];
    }

    if (plan && plan !== "all") {
      filter["subscription.plan"] = plan;
    }

    if (status && status !== "all") {
      if (status === "active") {
        filter.isActive = true;
      } else if (status === "inactive") {
        filter.isActive = false;
      }
    }

    if (isBlocked && isBlocked !== "all") {
      filter.isBlocked = isBlocked === "true";
    }

    // Ordenação
    const sort = {};
    sort[sortBy] = sortOrder === "desc" ? -1 : 1;

    const [users, total] = await Promise.all([
      User.find(filter)
        .select("-password -twoFactorSecret")
        .sort(sort)
        .limit(parseInt(limit))
        .skip(skip)
        .populate("lastAdminAction.performedBy", "username email"),
      User.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      data: {
        users,
        pagination: {
          total,
          page: parseInt(page),
          pages: Math.ceil(total / limit),
          limit: parseInt(limit),
        },
      },
    });
  } catch (error) {
    logger.error("Erro ao listar usuários:", error);
    res.status(500).json({
      success: false,
      error: "Erro ao carregar usuários",
    });
  }
};

/**
 * Obter detalhes de um usuário específico
 */
exports.getUserById = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId)
      .select("-password -twoFactorSecret")
      .populate("lastAdminAction.performedBy", "username email");

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "Usuário não encontrado",
      });
    }

    // Obter estatísticas do usuário
    const [paymentStats, transactionStats] = await Promise.all([
      Payment.aggregate([
        { $match: { userId: new mongoose.Types.ObjectId(userId) } },
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
            total: { $sum: "$amount" },
          },
        },
      ]),
      Transaction.aggregate([
        { $match: { userId: new mongoose.Types.ObjectId(userId) } },
        {
          $group: {
            _id: "$type",
            count: { $sum: 1 },
            total: { $sum: "$amount" },
          },
        },
      ]),
    ]);

    const userData = {
      ...user.toObject(),
      stats: {
        payments: paymentStats,
        transactions: transactionStats,
      },
    };

    res.status(200).json({
      success: true,
      data: userData,
    });
  } catch (error) {
    logger.error("Erro ao obter usuário:", error);
    res.status(500).json({
      success: false,
      error: "Erro ao carregar usuário",
    });
  }
};

/**
 * Atualizar usuário (admin)
 */
exports.updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const updates = req.body;
    const adminId = req.user._id;

    // Campos permitidos para atualização
    const allowedFields = [
      "fullName",
      "isActive",
      "isBlocked",
      "blockReason",
      "subscription",
      "adminNotes",
      "role",
    ];

    const updateData = {};
    allowedFields.forEach((field) => {
      if (updates[field] !== undefined) {
        updateData[field] = updates[field];
      }
    });

    // Registrar ação admin
    updateData.lastAdminAction = {
      action: "user_update",
      performedBy: adminId,
      date: new Date(),
      details: JSON.stringify(updates),
    };

    const user = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    }).select("-password -twoFactorSecret");

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "Usuário não encontrado",
      });
    }

    logger.info(`Usuário ${userId} atualizado pelo admin ${req.user.email}`, {
      adminId,
      userId,
      changes: updates,
    });

    res.status(200).json({
      success: true,
      data: user,
      message: "Usuário atualizado com sucesso",
    });
  } catch (error) {
    logger.error("Erro ao atualizar usuário:", error);
    res.status(500).json({
      success: false,
      error: "Erro ao atualizar usuário",
    });
  }
};

/**
 * Bloquear/Desbloquear usuário
 */
exports.toggleUserBlock = async (req, res) => {
  try {
    const { userId } = req.params;
    const { reason } = req.body;
    const adminId = req.user._id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "Usuário não encontrado",
      });
    }

    // Inverte o status de bloqueio
    const newBlockStatus = !user.isBlocked;

    user.isBlocked = newBlockStatus;
    user.blockReason = newBlockStatus
      ? reason || "Bloqueio administrativo"
      : "";

    // Auditoria
    user.lastAdminAction = {
      action: newBlockStatus ? "user_blocked" : "user_unblocked",
      performedBy: adminId,
      date: new Date(),
      details: newBlockStatus ? `Motivo: ${reason}` : "Usuário desbloqueado",
    };

    await user.save();

    res.status(200).json({
      success: true,
      data: { isBlocked: user.isBlocked },
      message: `Usuário ${
        user.isBlocked ? "bloqueado" : "desbloqueado"
      } com sucesso`,
    });
  } catch (error) {
    logger.error("Erro ao alternar bloqueio:", error);
    res.status(500).json({
      success: false,
      error: "Erro ao processar bloqueio de usuário",
    });
  }
};

// ===================== RELATÓRIOS FINANCEIROS =====================

/**
 * Obter relatório financeiro detalhado
 */
exports.getFinancialReport = async (req, res) => {
  try {
    const { period = "month", startDate, endDate, groupBy = "day" } = req.query;

    let dateFilter = {};

    if (startDate && endDate) {
      dateFilter = {
        createdAt: {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        },
      };
    } else {
      // Período padrão
      const now = new Date();
      switch (period) {
        case "week":
          dateFilter.createdAt = {
            $gte: new Date(now.setDate(now.getDate() - 7)),
          };
          break;
        case "month":
          dateFilter.createdAt = {
            $gte: new Date(now.setMonth(now.getMonth() - 1)),
          };
          break;
        case "year":
          dateFilter.createdAt = {
            $gte: new Date(now.setFullYear(now.getFullYear() - 1)),
          };
          break;
      }
    }

    // Agrupar dados por período
    let groupFormat;
    switch (groupBy) {
      case "hour":
        groupFormat = {
          $dateToString: { format: "%Y-%m-%d %H:00", date: "$createdAt" },
        };
        break;
      case "day":
        groupFormat = {
          $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
        };
        break;
      case "week":
        groupFormat = {
          $dateToString: { format: "%Y-W%U", date: "$createdAt" },
        };
        break;
      case "month":
        groupFormat = {
          $dateToString: { format: "%Y-%m", date: "$createdAt" },
        };
        break;
      default:
        groupFormat = {
          $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
        };
    }

    const [revenueByPeriod, paymentsByStatus, planDistribution, topUsers] =
      await Promise.all([
        // Receita por período
        Payment.aggregate([
          { $match: { status: "paid", ...dateFilter } },
          {
            $group: {
              _id: groupFormat,
              revenue: { $sum: "$amount" },
              count: { $sum: 1 },
            },
          },
          { $sort: { _id: 1 } },
        ]),

        // Pagamentos por status
        Payment.aggregate([
          { $match: dateFilter },
          {
            $group: {
              _id: "$status",
              count: { $sum: 1 },
              total: { $sum: "$amount" },
            },
          },
        ]),

        // Distribuição por plano
        Payment.aggregate([
          { $match: { status: "paid", ...dateFilter } },
          {
            $group: {
              _id: "$metadata.plan",
              count: { $sum: 1 },
              revenue: { $sum: "$amount" },
            },
          },
          { $sort: { revenue: -1 } },
        ]),

        // Top usuários por valor
        Payment.aggregate([
          { $match: { status: "paid", ...dateFilter } },
          {
            $group: {
              _id: "$userId",
              totalSpent: { $sum: "$amount" },
              paymentCount: { $sum: 1 },
            },
          },
          { $sort: { totalSpent: -1 } },
          { $limit: 10 },
          {
            $lookup: {
              from: "usuários",
              localField: "_id",
              foreignField: "_id",
              as: "user",
            },
          },
          { $unwind: "$user" },
          {
            $project: {
              userId: "$_id",
              username: "$user.username",
              email: "$user.email",
              totalSpent: 1,
              paymentCount: 1,
            },
          },
        ]),
      ]);

    const report = {
      period: { period, startDate, endDate, groupBy },
      summary: {
        totalRevenue: revenueByPeriod.reduce(
          (sum, item) => sum + item.revenue,
          0
        ),
        totalPayments: revenueByPeriod.reduce(
          (sum, item) => sum + item.count,
          0
        ),
        averageTicket: 0,
      },
      revenueByPeriod,
      paymentsByStatus,
      planDistribution,
      topUsers,
    };

    // Calcular ticket médio
    if (report.summary.totalPayments > 0) {
      report.summary.averageTicket =
        report.summary.totalRevenue / report.summary.totalPayments;
    }

    res.status(200).json({
      success: true,
      data: report,
    });
  } catch (error) {
    logger.error("Erro ao gerar relatório financeiro:", error);
    res.status(500).json({
      success: false,
      error: "Erro ao gerar relatório financeiro",
    });
  }
};

module.exports = exports;
