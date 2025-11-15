const Utils = require("../utils/utils");
const logger = require("../utils/logger");
const { Transaction } = require("../models");

// API Controller for Transactions
class TransactionController {
  constructor(dataManager) {
    this.dataManager = dataManager;
    this.validator = new TransactionValidator();
  }

  // GET /api/transactions
  async getTransactions(req, res) {
    try {
      const {
        page = 1,
        limit = 10,
        type,
        category,
        startDate,
        endDate,
      } = req.query;
      const userId = req.user._id;

      // Calcula skip baseado na página
      const skip = (parseInt(page) - 1) * parseInt(limit);

      // Monta filtros para getTransactionsByUserId
      const filters = {};
      if (type) filters.type = type;
      if (category) filters.category = category;
      if (startDate || endDate) {
        filters.startDate = startDate;
        filters.endDate = endDate;
      }

      const result = await this.dataManager.getTransactionsByUserId(
        userId,
        parseInt(limit),
        skip,
        filters
      );

      return res.status(200).json({
        success: true,
        data: result.data,
        pagination: {
          current: parseInt(page),
          pages: result.pages,
          total: result.total,
        },
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: "Failed to fetch transactions",
        details: error.message,
      });
    }
  }

  // GET /api/transactions/:id
  async getTransactionById(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user._id;

      const transaction = await this.dataManager.getTransactionById(id, userId);

      if (!transaction) {
        return res.status(404).json({
          success: false,
          error: "Transaction not found",
        });
      }

      return res.status(200).json({
        success: true,
        data: transaction,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: "Failed to fetch transaction",
        details: error.message,
      });
    }
  }

  // POST /api/transactions
  async createTransaction(req, res) {
    try {
      const transactionData = { ...req.body, userId: req.user._id };

      // Validate transaction data
      const validation = this.validator.validate(transactionData);
      if (!validation.isValid) {
        return res.status(400).json({
          success: false,
          error: "Validation failed",
          details: validation.errors,
        });
      }

      const transaction = await this.dataManager.createTransaction(
        transactionData
      );

      // Update user stats
      await this.updateUserStats(req.user._id);

      // INTEGRAÇÃO RPG: Ganhar XP/ouro ao registrar despesa
      try {
        const { Avatar } = require("../models");
        const avatar = await Avatar.findOne({ userId: req.user._id });
        if (avatar) {
          // Regras: só ganha XP/ouro se for despesa
          if (transaction.type === "expense") {
            avatar.gainExperience(10); // XP fixo por despesa
            avatar.addGold(5); // Ouro fixo por despesa
            await avatar.save();
          }
        }
      } catch (rpgErr) {
        logger.warn("Falha ao integrar RPG na transação:", rpgErr);
      }

      return res.status(201).json({
        success: true,
        data: transaction,
        message: "Transaction created successfully",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: "Failed to create transaction",
        details: error.message,
      });
    }
  }

  // PUT /api/transactions/:id
  async updateTransaction(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user._id;
      const updateData = req.body;

      // Check if transaction exists and belongs to user
      const existingTransaction = await this.dataManager.getTransactionById(
        id,
        userId
      );
      if (!existingTransaction) {
        return res.status(404).json({
          success: false,
          error: "Transaction not found",
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

      const updatedTransaction = await this.dataManager.updateTransaction(
        id,
        updateData,
        userId
      );

      // Update user stats
      await this.updateUserStats(userId);

      return res.status(200).json({
        success: true,
        data: updatedTransaction,
        message: "Transaction updated successfully",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: "Failed to update transaction",
        details: error.message,
      });
    }
  }

  // DELETE /api/transactions/:id
  async deleteTransaction(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user._id;

      const deleted = await this.dataManager.deleteTransaction(id, userId);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          error: "Transaction not found",
        });
      }

      // Update user stats
      await this.updateUserStats(userId);

      return res.status(200).json({
        success: true,
        message: "Transaction deleted successfully",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: "Failed to delete transaction",
        details: error.message,
      });
    }
  }

  // GET /api/transactions/stats
  async getTransactionStats(req, res) {
    try {
      const userId = req.user._id;
      const { period = "month" } = req.query;

      const stats = await this.dataManager.getTransactionStats(userId, period);

      return res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: "Failed to fetch transaction stats",
        details: error.message,
      });
    }
  }

  // GET /api/transactions/categories
  async getCategories(req, res) {
    try {
      const { type } = req.query;
      const categories = Transaction.getCategories();

      const result = type ? categories[type] : categories;

      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: "Failed to fetch categories",
        details: error.message,
      });
    }
  }

  // POST /api/transactions/bulk
  async bulkCreateTransactions(req, res) {
    try {
      const { transactions } = req.body;
      const userId = req.user._id;

      if (!Array.isArray(transactions) || transactions.length === 0) {
        return res.status(400).json({
          success: false,
          error: "Invalid transactions array",
        });
      }

      // Validate all transactions
      const validationResults = transactions.map((t) =>
        this.validator.validate({ ...t, userId })
      );

      const invalidTransactions = validationResults
        .map((result, index) => ({ index, result }))
        .filter(({ result }) => !result.isValid);

      if (invalidTransactions.length > 0) {
        return res.status(400).json({
          success: false,
          error: "Some transactions are invalid",
          details: invalidTransactions,
        });
      }

      const createdTransactions = await this.dataManager.bulkCreateTransactions(
        transactions.map((t) => ({ ...t, userId }))
      );

      // Update user stats
      await this.updateUserStats(userId);

      return res.status(201).json({
        success: true,
        data: createdTransactions,
        message: `${createdTransactions.length} transactions created successfully`,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: "Failed to create transactions",
        details: error.message,
      });
    }
  }

  // DELETE /api/transactions/bulk
  async bulkDeleteTransactions(req, res) {
    try {
      const { ids } = req.body;
      const userId = req.user._id;

      if (!Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({
          success: false,
          error: "Invalid transaction IDs array",
        });
      }

      const deletedCount = await this.dataManager.bulkDeleteTransactions(
        ids,
        userId
      );

      // Update user stats
      await this.updateUserStats(userId);

      return res.status(200).json({
        success: true,
        message: `${deletedCount} transactions deleted successfully`,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: "Failed to delete transactions",
        details: error.message,
      });
    }
  }

  async updateUserStats(userId) {
    // This would update user statistics after transaction changes
    // Implementation depends on the statistics tracking system
    try {
      await this.dataManager.updateUserStats(userId);
    } catch (error) {
      logger.error("Failed to update user stats:", error);
    }
  }
}

// Transaction Validator
class TransactionValidator {
  validate(data) {
    const errors = [];

    // Required fields
    if (!data.type || !["income", "expense"].includes(data.type)) {
      errors.push("Valid transaction type is required (income or expense)");
    }

    if (!data.description || data.description.trim().length === 0) {
      errors.push("Description is required");
    }

    if (!data.amount || typeof data.amount !== "number" || data.amount <= 0) {
      errors.push("Amount must be a positive number");
    }

    if (!data.category || data.category.trim().length === 0) {
      errors.push("Category is required");
    }

    if (!data.date || !Utils.isValidDate(data.date)) {
      errors.push("Valid date is required");
    }

    if (!data.userId || data.userId.trim().length === 0) {
      errors.push("User ID is required");
    }

    // Optional field validations
    if (data.description && data.description.length > 255) {
      errors.push("Description cannot exceed 255 characters");
    }

    if (data.notes && data.notes.length > 1000) {
      errors.push("Notes cannot exceed 1000 characters");
    }

    if (data.tags && !Array.isArray(data.tags)) {
      errors.push("Tags must be an array");
    }

    if (data.amount && data.amount > 1000000) {
      errors.push("Amount cannot exceed 1,000,000");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  validateUpdate(data) {
    const errors = [];

    // Optional fields validation for updates
    if (data.type && !["income", "expense"].includes(data.type)) {
      errors.push("Valid transaction type is required (income or expense)");
    }

    if (
      data.description !== undefined &&
      data.description.trim().length === 0
    ) {
      errors.push("Description cannot be empty");
    }

    if (
      data.amount !== undefined &&
      (typeof data.amount !== "number" || data.amount <= 0)
    ) {
      errors.push("Amount must be a positive number");
    }

    if (data.category !== undefined && data.category.trim().length === 0) {
      errors.push("Category cannot be empty");
    }

    if (data.date && !Utils.isValidDate(data.date)) {
      errors.push("Valid date is required");
    }

    if (data.description && data.description.length > 255) {
      errors.push("Description cannot exceed 255 characters");
    }

    if (data.notes && data.notes.length > 1000) {
      errors.push("Notes cannot exceed 1000 characters");
    }

    if (data.tags && !Array.isArray(data.tags)) {
      errors.push("Tags must be an array");
    }

    if (data.amount && data.amount > 1000000) {
      errors.push("Amount cannot exceed 1,000,000");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}

// Export para Node.js
const getTransactions = async (req, res) => {
  try {
    const userId = req.user.id;
    const { limit = 5, sortField = "date", sortDirection = "desc" } = req.query;

    const sortOrder = sortDirection === "asc" ? 1 : -1;
    const sortObj = { [sortField]: sortOrder };

    const transactions = await Transaction.find({ userId })
      .limit(parseInt(limit))
      .sort(sortObj)
      .populate("categoryId");

    return res.json({
      success: true,
      data: transactions || [],
      pagination: { current: 1, pages: 1, total: transactions.length },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Erro ao buscar transações",
      error: error.message,
    });
  }
};

const getTransactionsSummary = async (req, res) => {
  try {
    const userId = req.user.id;

    const transactions = await Transaction.find({ userId });

    const income = transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + (t.amount || 0), 0);

    const expenses = transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + (t.amount || 0), 0);

    return res.json({
      success: true,
      data: {
        income,
        expenses,
        balance: income - expenses,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Erro ao buscar resumo",
      error: error.message,
    });
  }
};

const getTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const transaction = await Transaction.findOne({
      _id: id,
      userId,
    });

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transação não encontrada",
      });
    }

    return res.json({
      success: true,
      data: transaction,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Erro ao buscar transação",
      error: error.message,
    });
  }
};

const createTransaction = async (req, res) => {
  try {
    console.log("🔍 [DEBUG] createTransaction - req.body:", req.body);
    console.log("🔍 [DEBUG] createTransaction - req.user:", req.user);

    const userId = req.user.id;
    const { description, amount, date, category, type } = req.body;

    // Validações básicas
    if (!description || !amount || !date || !category || !type) {
      return res.status(400).json({
        success: false,
        message: "Campos obrigatórios faltando",
        details: {
          description: !description ? "Descrição é obrigatória" : null,
          amount: !amount ? "Valor é obrigatório" : null,
          date: !date ? "Data é obrigatória" : null,
          category: !category ? "Categoria é obrigatória" : null,
          type: !type ? "Tipo é obrigatório" : null,
        },
      });
    }

    // Validar tipo
    if (!["income", "expense"].includes(type)) {
      return res.status(400).json({
        success: false,
        message: "Tipo de transação inválido. Use 'income' ou 'expense'",
      });
    }

    console.log("🔍 [DEBUG] Criando transação com dados:", {
      description,
      amount,
      date,
      category: category,
      type,
      userId,
    });

    const transaction = new Transaction({
      description,
      amount: parseFloat(amount),
      date: new Date(date),
      category: category,
      type,
      userId,
    });

    await transaction.save();

    console.log("✅ [DEBUG] Transação criada com sucesso:", transaction._id);

    return res.status(201).json({
      success: true,
      message: "Transação criada com sucesso",
      data: transaction,
    });
  } catch (error) {
    console.error("❌ [ERROR] createTransaction:", error);
    return res.status(500).json({
      success: false,
      message: "Erro ao criar transação",
      error: error.message,
    });
  }
};

const updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { description, amount, date, category, type } = req.body;

    const transaction = await Transaction.findOne({
      _id: id,
      userId,
    });

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transação não encontrada",
      });
    }

    transaction.description = description || transaction.description;
    transaction.amount = amount !== undefined ? amount : transaction.amount;
    transaction.date = date || transaction.date;
    transaction.categoryId = category || transaction.categoryId;
    transaction.type = type || transaction.type;

    await transaction.save();

    return res.json({
      success: true,
      message: "Transação atualizada com sucesso",
      data: transaction,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Erro ao atualizar transação",
      error: error.message,
    });
  }
};

const deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const transaction = await Transaction.findOne({
      _id: id,
      userId,
    });

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transação não encontrada",
      });
    }

    await Transaction.deleteOne({ _id: id });

    return res.json({
      success: true,
      message: "Transação deletada com sucesso",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Erro ao deletar transação",
      error: error.message,
    });
  }
};

module.exports = {
  TransactionController,
  getTransactions,
  getTransactionsSummary,
  getTransaction,
  createTransaction,
  updateTransaction,
  deleteTransaction,
};
