const logger = require("../utils/logger");
const _Utils = require("../utils/utils");
const { Goal } = require("../models");
const MongoDataManager = require("../utils/mongoDataManager");

// Goal Validator
class GoalValidator {
  validate(data) {
    const errors = [];

    // Required fields
    if (!data.title || data.title.trim().length === 0) {
      errors.push("Title is required");
    }

    if (
      !data.targetAmount ||
      typeof data.targetAmount !== "number" ||
      data.targetAmount <= 0
    ) {
      errors.push("Target amount must be a positive number");
    }

    if (!data.deadline || isNaN(Date.parse(data.deadline))) {
      errors.push("Valid deadline is required");
    }

    if (data.category && typeof data.category !== "string") {
      errors.push("Category must be a string");
    }

    if (data.description && data.description.length > 500) {
      errors.push("Description must be less than 500 characters");
    }

    return errors;
  }
}

// API Controller for Goals
class GoalController {
  constructor(dataManager) {
    this.dataManager = dataManager;
    this.validator = new GoalValidator();
  }

  // GET /api/goals
  async getAll(req, res) {
    try {
      const {
        page = 1,
        limit = 10,
        status,
        category,
        sortBy = "createdAt",
        sortOrder = "desc",
      } = req.query;

      let filters = {};
      let userId = null;

      console.log(
        "🔍 DEBUG getAll - req.user:",
        req.user ? { id: req.user.id, email: req.user.email } : "null"
      );

      if (req.user && req.user.id) {
        // Authenticated user - return their goals
        userId = req.user.id;
        filters = {
          userId,
          ...(status && { status }),
          ...(category && { category }),
        };
        console.log("✅ Filtros de goal:", filters);
      } else {
        // Unauthenticated - return only public goals
        filters = {
          isPublic: true,
          ...(status && { status }),
          ...(category && { category }),
        };
      }

      console.log("🔍 DEBUG - Buscando goals com filtros:", filters);

      const sort = {};
      sort[sortBy] = sortOrder === "desc" ? -1 : 1;

      const skip = (parseInt(page) - 1) * parseInt(limit);

      const goals = await Goal.find(filters)
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit))
        .populate("userId", "name email");

      const total = await Goal.countDocuments(filters);

      const response = {
        success: true,
        data: goals,
        meta: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit)),
        },
      };

      return res.status(200).json(response);
    } catch (error) {
      logger.error("Erro ao buscar goals:", error);
      return res.status(500).json({
        success: false,
        message: "Erro interno do servidor",
        error: error.message,
      });
    }
  }

  // GET /api/goals/:id
  async getById(req, res) {
    try {
      const { id } = req.params;
      const goal = await Goal.findById(id).populate("userId", "name email");

      if (!goal) {
        return res.status(404).json({
          success: false,
          message: "Meta não encontrada",
        });
      }

      // Check if user can access this goal
      if (req.user && req.user.id) {
        if (goal.userId._id.toString() !== req.user.id && !goal.isPublic) {
          return res.status(403).json({
            success: false,
            message: "Acesso negado a esta meta",
          });
        }
      } else if (!goal.isPublic) {
        return res.status(403).json({
          success: false,
          message: "Meta não é pública",
        });
      }

      return res.status(200).json({
        success: true,
        data: goal,
      });
    } catch (error) {
      logger.error("Erro ao buscar goal por ID:", error);
      return res.status(500).json({
        success: false,
        message: "Erro interno do servidor",
        error: error.message,
      });
    }
  }

  // POST /api/goals
  async create(req, res) {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({
          success: false,
          message: "Usuário não autenticado",
        });
      }

      const goalData = {
        ...req.body,
        userId: req.user.id,
      };

      const errors = this.validator.validate(goalData);
      if (errors.length > 0) {
        return res.status(400).json({
          success: false,
          message: "Dados inválidos",
          errors,
        });
      }

      const goal = new Goal(goalData);
      await goal.save();

      return res.status(201).json({
        success: true,
        data: goal,
        message: "Meta criada com sucesso",
      });
    } catch (error) {
      logger.error("Erro ao criar goal:", error);
      return res.status(500).json({
        success: false,
        message: "Erro interno do servidor",
        error: error.message,
      });
    }
  }

  // PUT /api/goals/:id
  async update(req, res) {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({
          success: false,
          message: "Usuário não autenticado",
        });
      }

      const { id } = req.params;
      const goal = await Goal.findById(id);

      if (!goal) {
        return res.status(404).json({
          success: false,
          message: "Meta não encontrada",
        });
      }

      // Check ownership
      if (goal.userId.toString() !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: "Acesso negado a esta meta",
        });
      }

      const updatedGoal = await Goal.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
      });

      return res.status(200).json({
        success: true,
        data: updatedGoal,
        message: "Meta atualizada com sucesso",
      });
    } catch (error) {
      logger.error("Erro ao atualizar goal:", error);
      return res.status(500).json({
        success: false,
        message: "Erro interno do servidor",
        error: error.message,
      });
    }
  }

  // DELETE /api/goals/:id
  async delete(req, res) {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({
          success: false,
          message: "Usuário não autenticado",
        });
      }

      const { id } = req.params;
      const goal = await Goal.findById(id);

      if (!goal) {
        return res.status(404).json({
          success: false,
          message: "Meta não encontrada",
        });
      }

      // Check ownership
      if (goal.userId.toString() !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: "Acesso negado a esta meta",
        });
      }

      await Goal.findByIdAndDelete(id);

      return res.status(200).json({
        success: true,
        message: "Meta excluída com sucesso",
      });
    } catch (error) {
      logger.error("Erro ao deletar goal:", error);
      return res.status(500).json({
        success: false,
        message: "Erro interno do servidor",
        error: error.message,
      });
    }
  }

  // POST /api/goals/:id/add-value
  async addValue(req, res) {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({
          success: false,
          message: "Usuário não autenticado",
        });
      }

      const { id } = req.params;
      const { amount } = req.body;

      if (!amount || typeof amount !== "number" || amount <= 0) {
        return res.status(400).json({
          success: false,
          message: "Valor deve ser um número positivo",
        });
      }

      const goal = await Goal.findById(id);
      if (!goal) {
        return res.status(404).json({
          success: false,
          message: "Meta não encontrada",
        });
      }

      if (goal.userId.toString() !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: "Acesso negado a esta meta",
        });
      }

      goal.currentAmount = (goal.currentAmount || 0) + amount;

      // Check if goal is completed
      if (goal.currentAmount >= goal.targetAmount) {
        goal.status = "completed";
        goal.completedAt = new Date();
      }

      await goal.save();

      return res.status(200).json({
        success: true,
        data: goal,
        message: "Valor adicionado com sucesso",
      });
    } catch (error) {
      logger.error("Erro ao adicionar valor à meta:", error);
      return res.status(500).json({
        success: false,
        message: "Erro interno do servidor",
        error: error.message,
      });
    }
  }

  // GET /api/goals/summary
  async getSummary(req, res) {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({
          success: false,
          message: "Usuário não autenticado",
        });
      }

      const userId = req.user.id;

      const summary = await Goal.aggregate([
        { $match: { userId: userId } },
        {
          $group: {
            _id: null,
            totalGoals: { $sum: 1 },
            activeGoals: {
              $sum: { $cond: [{ $eq: ["$status", "active"] }, 1, 0] },
            },
            completedGoals: {
              $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] },
            },
            totalTargetAmount: { $sum: "$targetAmount" },
            totalCurrentAmount: { $sum: "$currentAmount" },
          },
        },
      ]);

      const result =
        summary.length > 0
          ? summary[0]
          : {
              totalGoals: 0,
              activeGoals: 0,
              completedGoals: 0,
              totalTargetAmount: 0,
              totalCurrentAmount: 0,
            };

      // Calculate progress percentage
      result.progressPercentage =
        result.totalTargetAmount > 0
          ? Math.round(
              (result.totalCurrentAmount / result.totalTargetAmount) * 100
            )
          : 0;

      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      logger.error("Erro ao buscar resumo de metas:", error);
      return res.status(500).json({
        success: false,
        message: "Erro interno do servidor",
        error: error.message,
      });
    }
  }

  // GET /api/goals/deadlines
  async getUpcomingDeadlines(req, res) {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({
          success: false,
          message: "Usuário não autenticado",
        });
      }

      const userId = req.user.id;
      const today = new Date();
      const nextMonth = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);

      const goals = await Goal.find({
        userId,
        status: "active",
        targetDate: {
          $gte: today,
          $lte: nextMonth,
        },
      })
        .sort({ targetDate: 1 })
        .limit(10);

      return res.status(200).json({
        success: true,
        data: goals,
      });
    } catch (error) {
      logger.error("Erro ao buscar deadlines de metas:", error);
      return res.status(500).json({
        success: false,
        message: "Erro interno do servidor",
        error: error.message,
      });
    }
  }

  async getGoalsProgress(req, res) {
    return this.getSummary(req, res);
  }
}

// Export
if (typeof module !== "undefined" && module.exports) {
  // Criar instância do dataManager
  const dataManager = new MongoDataManager();

  // Criar instância do controller
  const goalControllerInstance = new GoalController(dataManager);

  // Exportar métodos do controller como funções para compatibilidade com as rotas
  module.exports = {
    getAll: goalControllerInstance.getAll.bind(goalControllerInstance),
    getById: goalControllerInstance.getById.bind(goalControllerInstance),
    create: goalControllerInstance.create.bind(goalControllerInstance),
    update: goalControllerInstance.update.bind(goalControllerInstance),
    delete: goalControllerInstance.delete.bind(goalControllerInstance),
    addValue: goalControllerInstance.addValue.bind(goalControllerInstance),
    getSummary: goalControllerInstance.getSummary.bind(goalControllerInstance),
    getUpcomingDeadlines: goalControllerInstance.getUpcomingDeadlines.bind(
      goalControllerInstance
    ),
    GoalController,
  };
}
