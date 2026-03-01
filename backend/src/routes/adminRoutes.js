/**
 * Rotas do Painel Administrativo
 */

const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const {
  requireAdmin,
  requireAdminLevel,
  logAdminAction,
} = require("../middleware/adminAuth");
const { authenticate } = require("../middleware/auth");

// ===================== MIDDLEWARE =====================
// Todas as rotas requerem autenticação e permissões de admin
router.use(authenticate);
router.use(requireAdmin);

// ===================== DASHBOARD =====================

/**
 * GET /api/admin/dashboard
 * Obter estatísticas gerais do painel administrativo
 */
router.get("/dashboard", adminController.getDashboardStats);

// ===================== GESTÃO DE USUÁRIOS =====================

/**
 * GET /api/admin/users
 * Listar usuários com filtros e paginação
 * Query params: page, limit, search, plan, status, isBlocked, sortBy, sortOrder
 */
router.get("/users", adminController.getUsers);

/**
 * GET /api/admin/users/:userId
 * Obter detalhes de um usuário específico
 */
router.get("/users/:userId", adminController.getUserById);

/**
 * PUT /api/admin/users/:userId
 * Atualizar dados de usuário (requer admin nível 2+)
 */
router.put(
  "/users/:userId",
  requireAdminLevel(2),
  logAdminAction("user_update"),
  adminController.updateUser
);

/**
 * POST /api/admin/users/:userId/toggle-block
 * Bloquear/Desbloquear usuário (requer admin nível 2+)
 */
router.post(
  "/users/:userId/toggle-block",
  requireAdminLevel(2),
  // logAdminAction("user_block_toggle"), // <-- COMENTE ESTA LINHA
  adminController.toggleUserBlock
);

// ===================== RELATÓRIOS FINANCEIROS =====================

/**
 * GET /api/admin/reports/financial
 * Obter relatório financeiro detalhado
 * Query params: period, startDate, endDate, groupBy
 */
router.get("/reports/financial", adminController.getFinancialReport);

// ===================== LOGS E AUDITORIA =====================

/**
 * GET /api/admin/logs/admin-actions
 * Obter logs de ações administrativas (apenas super admin)
 */
router.get("/logs/admin-actions", requireAdminLevel(3), async (req, res) => {
  try {
    const {
      page = 1,
      limit = 50,
      adminId,
      action,
      startDate,
      endDate,
    } = req.query;
    const skip = (page - 1) * limit;

    // Construir filtro
    const filter = { lastAdminAction: { $exists: true } };

    if (adminId) {
      filter["lastAdminAction.performedBy"] = adminId;
    }

    if (action) {
      filter["lastAdminAction.action"] = action;
    }

    if (startDate && endDate) {
      filter["lastAdminAction.date"] = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const User = require("../models/User");

    const [logs, total] = await Promise.all([
      User.find(filter)
        .select("username email lastAdminAction")
        .populate("lastAdminAction.performedBy", "username email")
        .sort({ "lastAdminAction.date": -1 })
        .limit(parseInt(limit))
        .skip(skip),
      User.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      data: {
        logs: logs.map((user) => ({
          targetUser: {
            id: user._id,
            username: user.username,
            email: user.email,
          },
          action: user.lastAdminAction,
        })),
        pagination: {
          total,
          page: parseInt(page),
          pages: Math.ceil(total / limit),
          limit: parseInt(limit),
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Erro ao carregar logs de auditoria",
    });
  }
});

// ===================== CONFIGURAÇÕES DO SISTEMA =====================

/**
 * GET /api/admin/system/health
 * Verificar saúde do sistema
 */
router.get("/system/health", async (req, res) => {
  try {
    const mongoose = require("mongoose");

    const health = {
      status: "healthy",
      timestamp: new Date(),
      services: {
        database: {
          status:
            mongoose.connection.readyState === 1 ? "connected" : "disconnected",
          readyState: mongoose.connection.readyState,
        },
        server: {
          uptime: process.uptime(),
          memory: process.memoryUsage(),
          version: process.version,
        },
      },
    };

    res.status(200).json({
      success: true,
      data: health,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Erro ao verificar saúde do sistema",
      data: {
        status: "unhealthy",
        timestamp: new Date(),
        error: error.message,
      },
    });
  }
});

/**
 * GET /api/admin/system/stats
 * Estatísticas detalhadas do sistema
 */
router.get("/system/stats", async (req, res) => {
  try {
    const User = require("../models/User");
    const Payment = require("../models/Payment");
    const Transaction = require("../models/Transaction");

    const [
      totalUsers,
      usersToday,
      totalPayments,
      paymentsToday,
      totalTransactions,
      transactionsToday,
    ] = await Promise.all([
      User.countDocuments({}),
      User.countDocuments({
        createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) },
      }),
      Payment.countDocuments({}),
      Payment.countDocuments({
        createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) },
      }),
      Transaction.countDocuments({}),
      Transaction.countDocuments({
        createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) },
      }),
    ]);

    const stats = {
      users: {
        total: totalUsers,
        today: usersToday,
        growth: usersToday,
      },
      payments: {
        total: totalPayments,
        today: paymentsToday,
        growth: paymentsToday,
      },
      transactions: {
        total: totalTransactions,
        today: transactionsToday,
        growth: transactionsToday,
      },
      system: {
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        version: process.version,
        platform: process.platform,
      },
    };

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Erro ao carregar estatísticas do sistema",
    });
  }
});

// ===================== EXPORT DE DADOS =====================

/**
 * POST /api/admin/export/users
 * Exportar dados de usuários (CSV/JSON)
 */
router.post(
  "/export/users",
  requireAdminLevel(2),
  logAdminAction("users_export"),
  async (req, res) => {
    try {
      const { format = "json", filters = {} } = req.body;
      const User = require("../models/User");

      const users = await User.find(filters)
        .select("-password -twoFactorSecret -emailVerification")
        .lean();

      if (format === "csv") {
        const createCsvWriter = require("csv-writer").createObjectCsvWriter;
        const path = require("path");
        const fs = require("fs");

        const filename = `users-export-${Date.now()}.csv`;
        const filepath = path.join(__dirname, "../../../exports", filename);

        // Garantir que o diretório existe
        const dir = path.dirname(filepath);
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }

        const csvWriter = createCsvWriter({
          path: filepath,
          header: [
            { id: "_id", title: "ID" },
            { id: "username", title: "Username" },
            { id: "email", title: "Email" },
            { id: "fullName", title: "Nome Completo" },
            { id: "isActive", title: "Ativo" },
            { id: "isBlocked", title: "Bloqueado" },
            { id: "subscription.plan", title: "Plano" },
            { id: "subscription.status", title: "Status Assinatura" },
            { id: "createdAt", title: "Data Criação" },
          ],
        });

        await csvWriter.writeRecords(users);

        res.download(filepath, filename, (err) => {
          if (err) {
            console.error("Erro no download:", err);
          }
          // Limpar arquivo após download
          fs.unlink(filepath, () => {});
        });
      } else {
        res.status(200).json({
          success: true,
          data: users,
          count: users.length,
          exportedAt: new Date(),
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        error: "Erro ao exportar dados de usuários",
      });
    }
  }
);

// ===================== MIDDLEWARE DE ERRO =====================

router.use((error, req, res, _next) => {
  console.error("Erro nas rotas admin:", error);
  res.status(500).json({
    success: false,
    error: "Erro interno do servidor",
    message:
      process.env.NODE_ENV === "development" ? error.message : "Erro interno",
  });
});

module.exports = router;
