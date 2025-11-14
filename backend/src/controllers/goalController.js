const logger = require("../utils/logger");
const Utils = require("../utils/utils");
const { Goal } = require("../models");
const MongoDataManager = require("../utils/mongoDataManager");

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
      const result = await this.dataManager.getGoals(filters, {
        page: parseInt(page),
        limit: parseInt(limit),
        sort: { [sortBy]: sortOrder === "desc" ? -1 : 1 },
      });
      console.log("🔍 DEBUG - Resultado:", {
        total: result.totalCount,
        goals: result.goals.length,
      });

      const summary = userId ? await this.getGoalsSummary(userId) : null;

      return res.status(200).json({
        success: true,
        data: result.goals,
        pagination: {
          current: result.currentPage,
          pages: result.totalPages,
          total: result.totalCount,
        },
        ...(summary && { summary }),
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: "Failed to fetch goals",
        details: error.message,
      });
    }
  }

  // GET /api/goals/:id
  async getById(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const goal = await this.dataManager.getGoalById(id, userId);

      if (!goal) {
        return res.status(404).json({
          success: false,
          error: "Goal not found",
        });
      }

      // Add computed properties
      const enrichedGoal = {
        ...goal,
        progress: goal.getProgress(),
        remainingAmount: goal.getRemainingAmount(),
        daysUntilDeadline: goal.getDaysUntilDeadline(),
        isOverdue: goal.isOverdue(),
      };

      return res.status(200).json({
        success: true,
        data: enrichedGoal,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: "Failed to fetch goal",
        details: error.message,
      });
    }
  }

  // POST /api/goals
  async create(req, res) {
    try {
      console.log(
        "📝 DEBUG CREATE - req.user:",
        req.user ? { id: req.user.id, email: req.user.email } : "null"
      );
      const goalData = { ...req.body, userId: req.user.id };
      console.log(
        "📝 DEBUG - goalData antes da validação:",
        JSON.stringify(goalData, null, 2)
      );

      // Validate goal data
      const validation = this.validator.validate(goalData);
      console.log("📝 DEBUG - Resultado validação:", validation);
      if (!validation.isValid) {
        console.error("❌ Validação falhou:", validation.errors);
        return res.status(400).json({
          success: false,
          error: "Validation failed",
          details: validation.errors,
        });
      }

      const goal = await this.dataManager.createGoal(goalData);
      console.log("✅ Goal criado:", {
        _id: goal._id,
        title: goal.title,
        userId: goal.userId,
      });

      // Update user level if goal is completed
      if (goal.status === "completed") {
        await this.updateUserLevel(req.user.id);
      }

      return res.status(201).json({
        success: true,
        data: goal,
        message: "Goal created successfully",
      });
    } catch (error) {
      console.error("❌ Erro ao criar goal:", error.message);
      return res.status(500).json({
        success: false,
        error: "Failed to create goal",
        details: error.message,
      });
    }
  }

  // PUT /api/goals/:id
  async update(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const updateData = req.body;

      // Check if goal exists and belongs to user
      const existingGoal = await this.dataManager.getGoalById(id, userId);
      if (!existingGoal) {
        return res.status(404).json({
          success: false,
          error: "Goal not found",
        });
      }

      // Validate update data
      const validation = this.validator.validateUpdate(updateData);
      if (!validation.isValid) {
        return res.status(400).json({
          success: false,
          error: "Validation failed",
          details: validation.errors,
        });
      }

      const updatedGoal = await this.dataManager.updateGoal(
        id,
        updateData,
        userId
      );

      // Update user level if goal was completed
      if (
        updatedGoal.status === "completed" &&
        existingGoal.status !== "completed"
      ) {
        await this.updateUserLevel(userId);
      }

      return res.status(200).json({
        success: true,
        data: updatedGoal,
        message: "Goal updated successfully",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: "Failed to update goal",
        details: error.message,
      });
    }
  }

  // DELETE /api/goals/:id
  async delete(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const deleted = await this.dataManager.deleteGoal(id, userId);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          error: "Goal not found",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Goal deleted successfully",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: "Failed to delete goal",
        details: error.message,
      });
    }
  }

  // POST /api/goals/:id/add-value
  async addValue(req, res) {
    try {
      const { id } = req.params;
      const { amount, description } = req.body;
      const userId = req.user._id;

      if (!amount || amount <= 0) {
        return res.status(400).json({
          success: false,
          error: "Valid amount is required",
        });
      }

      const goal = await this.dataManager.getGoalById(id, userId);
      if (!goal) {
        return res.status(404).json({
          success: false,
          error: "Goal not found",
        });
      }

      if (goal.status === "completed") {
        return res.status(400).json({
          success: false,
          error: "Cannot add value to completed goal",
        });
      }

      const wasCompleted = goal.addValue(amount);
      const updatedGoal = await this.dataManager.updateGoal(
        id,
        goal.toJSON(),
        userId
      );

      // Log the contribution
      await this.dataManager.logGoalContribution({
        goalId: id,
        userId,
        amount,
        description,
        date: new Date().toISOString(),
      });

      // Update user level if goal was completed
      if (wasCompleted) {
        await this.updateUserLevel(userId);
      }

      return res.status(200).json({
        success: true,
        data: updatedGoal,
        message: wasCompleted
          ? "Congratulations! Goal completed!"
          : "Value added successfully",
        goalCompleted: wasCompleted,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: "Failed to add value to goal",
        details: error.message,
      });
    }
  }

  // GET /api/goals/categories
  async getCategories(req, res) {
    try {
      const categories = Goal.getCategories();

      return res.status(200).json({
        success: true,
        data: categories,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: "Failed to fetch categories",
        details: error.message,
      });
    }
  }

  // GET /api/goals/priorities
  async getPriorities(req, res) {
    try {
      const priorities = Goal.getPriorities();

      return res.status(200).json({
        success: true,
        data: priorities,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: "Failed to fetch priorities",
        details: error.message,
      });
    }
  }

  // GET /api/goals/summary
  async getSummary(req, res) {
    try {
      const userId = req.user.id;
      const summary = await this.getGoalsSummary(userId);

      return res.status(200).json({
        success: true,
        data: summary,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: "Failed to fetch goals summary",
        details: error.message,
      });
    }
  }

  // GET /api/goals/upcoming-deadlines
  async getUpcomingDeadlines(req, res) {
    try {
      const userId = req.user.id;
      const { days = 30 } = req.query;

      const deadlines = await this.dataManager.getUpcomingGoalDeadlines(
        userId,
        parseInt(days)
      );

      return res.status(200).json({
        success: true,
        data: deadlines,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: "Failed to fetch upcoming deadlines",
        details: error.message,
      });
    }
  }

  async getGoalsSummary(userId) {
    const goals = await this.dataManager.getGoals({ userId });

    const summary = {
      total: goals.length,
      active: goals.filter((g) => g.status === "active").length,
      completed: goals.filter((g) => g.status === "completed").length,
      paused: goals.filter((g) => g.status === "paused").length,
      totalTargetAmount: goals.reduce((sum, g) => sum + g.targetAmount, 0),
      totalCurrentAmount: goals.reduce((sum, g) => sum + g.currentAmount, 0),
      overallProgress: 0,
      overdue: goals.filter((g) => g.isOverdue()).length,
    };

    summary.overallProgress =
      summary.totalTargetAmount > 0
        ? (summary.totalCurrentAmount / summary.totalTargetAmount) * 100
        : 0;

    summary.completionRate =
      summary.total > 0 ? (summary.completed / summary.total) * 100 : 0;

    return summary;
  }

  async updateUserLevel(userId) {
    try {
      const completedGoals = await this.dataManager.getCompletedGoalsCount(
        userId
      );
      await this.dataManager.updateUserLevel(userId, completedGoals);
    } catch (error) {
      logger.error("Failed to update user level:", error);
    }
  }

  // Aliases para compatibilidade com as rotas
  async getGoals(req, res) {
    return this.getAll(req, res);
  }

  async getGoalById(req, res) {
    return this.getById(req, res);
  }

  async createGoal(req, res) {
    return this.create(req, res);
  }

  async updateGoal(req, res) {
    return this.update(req, res);
  }

  async deleteGoal(req, res) {
    return this.delete(req, res);
  }

  async addContribution(req, res) {
    return this.addValue(req, res);
  }

  async getGoalsProgress(req, res) {
    return this.getSummary(req, res);
  }
}

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

    if (
      data.currentAmount !== undefined &&
      (typeof data.currentAmount !== "number" || data.currentAmount < 0)
    ) {
      errors.push("Current amount must be a non-negative number");
    }

    if (!data.userId || data.userId.trim().length === 0) {
      errors.push("User ID is required");
    }

    // Optional field validations
    if (data.title && data.title.length > 100) {
      errors.push("Title cannot exceed 100 characters");
    }

    if (data.description && data.description.length > 500) {
      errors.push("Description cannot exceed 500 characters");
    }

    if (data.deadline && !Utils.isValidDate(data.deadline)) {
      errors.push("Valid deadline date is required");
    }

    // Validar que a deadline é no futuro (comparar apenas a data, não a hora)
    if (data.deadline) {
      const deadlineDate = new Date(data.deadline);
      const today = new Date();
      // Zerar horas para comparação apenas de data
      today.setHours(0, 0, 0, 0);
      deadlineDate.setHours(0, 0, 0, 0);

      if (deadlineDate < today) {
        errors.push("Deadline must be in the future");
      }
    }

    if (
      data.category &&
      ![
        "emergency",
        "savings",
        "investment",
        "purchase",
        "travel",
        "education",
        "home",
        "other",
      ].includes(data.category)
    ) {
      errors.push("Invalid category");
    }

    if (
      data.priority &&
      !["low", "medium", "high", "critical"].includes(data.priority)
    ) {
      errors.push("Invalid priority");
    }

    if (data.targetAmount && data.targetAmount > 10000000) {
      errors.push("Target amount cannot exceed 10,000,000");
    }

    if (
      data.currentAmount &&
      data.targetAmount &&
      data.currentAmount > data.targetAmount
    ) {
      errors.push("Current amount cannot exceed target amount");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  validateUpdate(data) {
    const errors = [];

    // Optional fields validation for updates
    if (data.title !== undefined && data.title.trim().length === 0) {
      errors.push("Title cannot be empty");
    }

    if (
      data.targetAmount !== undefined &&
      (typeof data.targetAmount !== "number" || data.targetAmount <= 0)
    ) {
      errors.push("Target amount must be a positive number");
    }

    if (
      data.currentAmount !== undefined &&
      (typeof data.currentAmount !== "number" || data.currentAmount < 0)
    ) {
      errors.push("Current amount must be a non-negative number");
    }

    if (data.title && data.title.length > 100) {
      errors.push("Title cannot exceed 100 characters");
    }

    if (data.description && data.description.length > 500) {
      errors.push("Description cannot exceed 500 characters");
    }

    if (data.deadline && !Utils.isValidDate(data.deadline)) {
      errors.push("Valid deadline date is required");
    }

    // Validar que a deadline é no futuro (comparar apenas a data, não a hora)
    if (data.deadline) {
      const deadlineDate = new Date(data.deadline);
      const today = new Date();
      // Zerar horas para comparação apenas de data
      today.setHours(0, 0, 0, 0);
      deadlineDate.setHours(0, 0, 0, 0);

      if (deadlineDate < today) {
        errors.push("Deadline must be in the future");
      }
    }

    if (
      data.category &&
      ![
        "emergency",
        "savings",
        "investment",
        "purchase",
        "travel",
        "education",
        "home",
        "other",
      ].includes(data.category)
    ) {
      errors.push("Invalid category");
    }

    if (
      data.priority &&
      !["low", "medium", "high", "critical"].includes(data.priority)
    ) {
      errors.push("Invalid priority");
    }

    if (
      data.status &&
      !["active", "completed", "paused"].includes(data.status)
    ) {
      errors.push("Invalid status");
    }

    if (data.targetAmount && data.targetAmount > 10000000) {
      errors.push("Target amount cannot exceed 10,000,000");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  validateSubscriptionUpdate(data) {
    const errors = [];

    if (data.planId && !["bronze", "silver", "gold"].includes(data.planId)) {
      errors.push("Valid plan ID is required (bronze, silver, or gold)");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
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
