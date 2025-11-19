const logger = require("../utils/logger");
const mongoose = require("mongoose");
const User = require("../models/User");
const Transaction = require("../models/Transaction");
const Goal = require("../models/Goal");
const Payment = require("../models/Payment");
const Reward = require("../models/Reward");

/**
 * MongoDataManager - Gerenciador de dados com MongoDB/Mongoose
 * Substitui o improvedDataManager com persistência real
 */
class MongoDataManager {
  // Converter string para ObjectId quando necessário
  toObjectId(id) {
    if (!id) return id;
    if (typeof id === "string") {
      try {
        return new mongoose.Types.ObjectId(id);
      } catch (err) {
        logger.warn(`Aviso: "${id}" não é um ObjectId válido`);
        return id; // Retorna a string como está
      }
    }
    return id;
  }

  // ==================== USUÁRIOS ====================

  async createUser(userData) {
    try {
      const user = new User(userData);
      await user.save();
      logger.info(`✅ Usuário criado: ${user.email}`);
      return user.toJSON();
    } catch (err) {
      logger.error("Erro ao criar usuário:", err);
      throw err;
    }
  }

  async getUserById(userId) {
    try {
      const user = await User.findById(userId).select(
        "-password -emailVerificationToken -passwordResetToken -twoFactorSecret"
      );
      if (!user) throw new Error("Usuário não encontrado");
      return user.toJSON();
    } catch (err) {
      logger.error("Erro ao buscar usuário:", err);
      throw err;
    }
  }

  async getUserByEmail(email) {
    try {
      const user = await User.findOne({ email: email.toLowerCase() }).select(
        "+password"
      );
      if (!user) throw new Error("Usuário não encontrado");
      return user;
    } catch (err) {
      logger.error("Erro ao buscar usuário por email:", err);
      throw err;
    }
  }

  async updateUser(userId, updateData) {
    try {
      const user = await User.findByIdAndUpdate(userId, updateData, {
        new: true,
        runValidators: true,
      });
      if (!user) throw new Error("Usuário não encontrado");
      return user.toJSON();
    } catch (err) {
      logger.error("Erro ao atualizar usuário:", err);
      throw err;
    }
  }

  async deleteUser(userId) {
    try {
      const user = await User.findByIdAndDelete(userId);
      if (!user) throw new Error("Usuário não encontrado");
      logger.info(`✅ Usuário deletado: ${user.email}`);
      return true;
    } catch (err) {
      logger.error("Erro ao deletar usuário:", err);
      throw err;
    }
  }

  // ==================== TRANSAÇÕES ====================

  async createTransaction(transactionData) {
    try {
      const transaction = new Transaction(transactionData);
      await transaction.save();
      return transaction.toObject();
    } catch (err) {
      logger.error("Erro ao criar transação:", err);
      throw err;
    }
  }

  async getTransactionById(transactionId) {
    try {
      const transaction = await Transaction.findById(transactionId);
      if (!transaction) throw new Error("Transação não encontrada");
      return transaction.toObject();
    } catch (err) {
      logger.error("Erro ao buscar transação:", err);
      throw err;
    }
  }

  async getTransactionsByUserId(userId, limit = 20, skip = 0, filters = {}) {
    try {
      const query = { userId: this.toObjectId(userId) };
      if (filters.type) query.type = filters.type;
      if (filters.category) query.category = filters.category;
      if (filters.status) query.status = filters.status;
      if (filters.startDate || filters.endDate) {
        query.date = {};
        if (filters.startDate) query.date.$gte = new Date(filters.startDate);
        if (filters.endDate) query.date.$lte = new Date(filters.endDate);
      }

      // Configurar ordenação
      const sortField = filters.sortField || "date";
      const sortDirection = filters.sortDirection === "asc" ? 1 : -1;
      const sortObj = { [sortField]: sortDirection };

      const transactions = await Transaction.find(query)
        .sort(sortObj)
        .limit(limit)
        .skip(skip);
      const total = await Transaction.countDocuments(query);
      const pages = Math.ceil(total / limit);
      return { data: transactions, total, pages };
    } catch (err) {
      logger.error("Erro ao buscar transações:", err);
      throw err;
    }
  }

  // ==================== OBJETIVOS (GOALS) ====================

  async createGoal(goalData) {
    try {
      // Converter userId para ObjectId se necessário
      if (goalData.userId) {
        goalData.userId = this.toObjectId(goalData.userId);
      }

      const goal = new Goal(goalData);
      await goal.save();
      logger.info(`✅ Objetivo criado: ${goal.title}`);
      return goal.toObject();
    } catch (err) {
      logger.error("Erro ao criar objetivo:", err);
      throw err;
    }
  }

  async getGoalById(goalId, userId) {
    try {
      // Converter IDs para ObjectId se necessário
      const query = {
        _id: this.toObjectId(goalId),
        userId: this.toObjectId(userId),
      };

      const goal = await Goal.findOne(query).lean();
      if (!goal) throw new Error("Objetivo não encontrado");
      return goal;
    } catch (err) {
      logger.error("Erro ao buscar objetivo:", err);
      throw err;
    }
  }

  async updateGoal(goalId, updateData, userId) {
    try {
      const query = {
        _id: this.toObjectId(goalId),
        userId: this.toObjectId(userId),
      };

      const goal = await Goal.findOneAndUpdate(query, updateData, {
        new: true,
        runValidators: true,
      });
      if (!goal) throw new Error("Objetivo não encontrado");
      return goal.toObject();
    } catch (err) {
      logger.error("Erro ao atualizar objetivo:", err);
      throw err;
    }
  }

  async deleteGoal(goalId, userId) {
    try {
      const query = {
        _id: this.toObjectId(goalId),
        userId: this.toObjectId(userId),
      };

      const goal = await Goal.findOneAndDelete(query);
      if (!goal) throw new Error("Objetivo não encontrado");
      logger.info(`✅ Objetivo deletado: ${goal.title}`);
      return true;
    } catch (err) {
      logger.error("Erro ao deletar objetivo:", err);
      throw err;
    }
  }

  async getGoals(
    filters = {},
    { page = 1, limit = 10, sort = { createdAt: -1 } } = {}
  ) {
    try {
      // Converter userId para ObjectId se necessário
      if (filters.userId) {
        filters.userId = this.toObjectId(filters.userId);
      }

      const skip = (page - 1) * limit;
      const goals = await Goal.find(filters)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean();
      const totalCount = await Goal.countDocuments(filters);
      const totalPages = Math.ceil(totalCount / limit);
      return { goals, currentPage: page, totalPages, totalCount };
    } catch (err) {
      logger.error("Erro ao buscar metas (getGoals):", err);
      throw new Error("Erro ao buscar metas no banco de dados");
    }
  }

  async logGoalContribution(contributionData) {
    try {
      logger.info(
        `📘 Contribuição registrada: ${JSON.stringify(contributionData)}`
      );
      return true;
    } catch (err) {
      logger.error("Erro ao registrar contribuição:", err);
      throw err;
    }
  }

  async getUpcomingGoalDeadlines(userId, days = 30) {
    try {
      const now = new Date();
      const future = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
      return await Goal.find({
        userId,
        deadline: { $gte: now, $lte: future },
      }).lean();
    } catch (err) {
      logger.error("Erro ao buscar prazos próximos:", err);
      throw err;
    }
  }

  async getCompletedGoalsCount(userId) {
    try {
      return await Goal.countDocuments({ userId, status: "completed" });
    } catch (err) {
      logger.error("Erro ao contar metas completas:", err);
      throw err;
    }
  }

  async updateUserLevel(userId, completedGoals) {
    try {
      const user = await User.findById(userId);
      if (!user) return;
      user.level = Math.floor(completedGoals / 5) + 1;
      await user.save();
      logger.info(
        `🏆 Nível do usuário ${user.email} atualizado para ${user.level}`
      );
    } catch (err) {
      logger.error("Erro ao atualizar nível do usuário:", err);
    }
  }

  // ==================== PAGAMENTOS ====================

  async createPayment(paymentData) {
    try {
      const payment = new Payment(paymentData);
      await payment.save();
      return payment.toObject();
    } catch (err) {
      logger.error("Erro ao criar pagamento:", err);
      throw err;
    }
  }

  async getPaymentById(paymentId) {
    try {
      const payment = await Payment.findById(paymentId);
      if (!payment) throw new Error("Pagamento não encontrado");
      return payment.toObject();
    } catch (err) {
      logger.error("Erro ao buscar pagamento:", err);
      throw err;
    }
  }

  // ==================== RECOMPENSAS ====================

  async createReward(rewardData) {
    try {
      const reward = new Reward(rewardData);
      await reward.save();
      return reward.toObject();
    } catch (err) {
      logger.error("Erro ao criar recompensa:", err);
      throw err;
    }
  }

  async getRewardsByUserId(userId, limit = 10, skip = 0) {
    try {
      const rewards = await Reward.find({ userId })
        .sort({ unlockedAt: -1 })
        .limit(limit)
        .skip(skip);
      const total = await Reward.countDocuments({ userId });
      return { data: rewards, total };
    } catch (err) {
      logger.error("Erro ao buscar recompensas:", err);
      throw err;
    }
  }

  // ==================== HEALTH CHECK ====================

  async healthCheck() {
    try {
      const userCount = await User.countDocuments();
      const transactionCount = await Transaction.countDocuments();
      const goalCount = await Goal.countDocuments();

      return {
        status: "healthy",
        database: "MongoDB",
        collections: {
          users: userCount,
          transactions: transactionCount,
          goals: goalCount,
        },
      };
    } catch (err) {
      logger.error("Health check falhou:", err);
      return { status: "unhealthy", error: err.message };
    }
  }
}

module.exports = MongoDataManager;
