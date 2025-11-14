/**
 * @fileoverview Controller para Transações Recorrentes
 * Gerencia operações CRUD de transações recorrentes
 */

const RecurringTransaction = require("../models/RecurringTransaction");
const logger = require("../utils/logger");
const { scheduler } = require("../utils/recurringTransactionScheduler");

class RecurringTransactionController {
  /**
   * Lista transações recorrentes do usuário
   * GET /api/recurring-transactions
   */
  async getAll(req, res) {
    try {
      const { status, frequency, page = 1, limit = 20 } = req.query;
      const userId = req.user._id;

      const query = { userId };
      if (status) query.status = status;
      if (frequency) query.frequency = frequency;

      const skip = (parseInt(page) - 1) * parseInt(limit);

      const [recurring, total] = await Promise.all([
        RecurringTransaction.find(query)
          .populate("categoryId", "name type color")
          .sort({ nextExecutionDate: 1 })
          .limit(parseInt(limit))
          .skip(skip),
        RecurringTransaction.countDocuments(query),
      ]);

      return res.status(200).json({
        success: true,
        data: recurring,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / parseInt(limit)),
          total,
          limit: parseInt(limit),
        },
      });
    } catch (error) {
      logger.error("Error fetching recurring transactions:", error);
      return res.status(500).json({
        success: false,
        message: "Erro ao buscar transações recorrentes",
        error: error.message,
      });
    }
  }

  /**
   * Busca transação recorrente por ID
   * GET /api/recurring-transactions/:id
   */
  async getById(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user._id;

      const recurring = await RecurringTransaction.findOne({
        _id: id,
        userId,
      }).populate("categoryId", "name type color");

      if (!recurring) {
        return res.status(404).json({
          success: false,
          message: "Transação recorrente não encontrada",
        });
      }

      return res.status(200).json({
        success: true,
        data: recurring,
      });
    } catch (error) {
      logger.error("Error fetching recurring transaction:", error);
      return res.status(500).json({
        success: false,
        message: "Erro ao buscar transação recorrente",
        error: error.message,
      });
    }
  }

  /**
   * Cria nova transação recorrente
   * POST /api/recurring-transactions
   */
  async create(req, res) {
    try {
      const userId = req.user._id;
      const data = { ...req.body, userId };

      // Validações básicas
      if (!data.description || !data.amount || !data.type || !data.categoryId) {
        return res.status(400).json({
          success: false,
          message: "Campos obrigatórios: description, amount, type, categoryId",
        });
      }

      if (!data.frequency) {
        data.frequency = "monthly";
      }

      if (!data.startDate) {
        data.startDate = new Date();
      }

      const recurring = new RecurringTransaction(data);
      await recurring.save();

      await recurring.populate("categoryId", "name type color");

      logger.info(`Recurring transaction created: ${recurring._id}`);

      return res.status(201).json({
        success: true,
        message: "Transação recorrente criada com sucesso",
        data: recurring,
      });
    } catch (error) {
      logger.error("Error creating recurring transaction:", error);
      return res.status(500).json({
        success: false,
        message: "Erro ao criar transação recorrente",
        error: error.message,
      });
    }
  }

  /**
   * Atualiza transação recorrente
   * PUT /api/recurring-transactions/:id
   */
  async update(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user._id;
      const updates = req.body;

      const recurring = await RecurringTransaction.findOne({
        _id: id,
        userId,
      });

      if (!recurring) {
        return res.status(404).json({
          success: false,
          message: "Transação recorrente não encontrada",
        });
      }

      // Atualizar campos permitidos
      const allowedUpdates = [
        "description",
        "amount",
        "categoryId",
        "paymentMethod",
        "notes",
        "frequency",
        "dayOfMonth",
        "dayOfWeek",
        "endDate",
        "maxExecutions",
        "autoAdjustAmount",
        "adjustmentPercentage",
        "notifyBeforeExecution",
        "notificationDaysBefore",
        "skipWeekends",
        "skipHolidays",
      ];

      allowedUpdates.forEach((field) => {
        if (updates[field] !== undefined) {
          recurring[field] = updates[field];
        }
      });

      // Recalcular próxima execução se mudou a frequência
      if (updates.frequency && updates.frequency !== recurring.frequency) {
        recurring.nextExecutionDate = recurring.calculateNextExecution();
      }

      await recurring.save();
      await recurring.populate("categoryId", "name type color");

      logger.info(`Recurring transaction updated: ${recurring._id}`);

      return res.status(200).json({
        success: true,
        message: "Transação recorrente atualizada com sucesso",
        data: recurring,
      });
    } catch (error) {
      logger.error("Error updating recurring transaction:", error);
      return res.status(500).json({
        success: false,
        message: "Erro ao atualizar transação recorrente",
        error: error.message,
      });
    }
  }

  /**
   * Remove transação recorrente
   * DELETE /api/recurring-transactions/:id
   */
  async delete(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user._id;

      const recurring = await RecurringTransaction.findOne({
        _id: id,
        userId,
      });

      if (!recurring) {
        return res.status(404).json({
          success: false,
          message: "Transação recorrente não encontrada",
        });
      }

      await recurring.deleteOne();

      logger.info(`Recurring transaction deleted: ${id}`);

      return res.status(200).json({
        success: true,
        message: "Transação recorrente removida com sucesso",
      });
    } catch (error) {
      logger.error("Error deleting recurring transaction:", error);
      return res.status(500).json({
        success: false,
        message: "Erro ao remover transação recorrente",
        error: error.message,
      });
    }
  }

  /**
   * Pausa transação recorrente
   * POST /api/recurring-transactions/:id/pause
   */
  async pause(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user._id;

      const recurring = await RecurringTransaction.findOne({
        _id: id,
        userId,
      });

      if (!recurring) {
        return res.status(404).json({
          success: false,
          message: "Transação recorrente não encontrada",
        });
      }

      if (!recurring.pause()) {
        return res.status(400).json({
          success: false,
          message: "Transação não pode ser pausada no estado atual",
        });
      }

      await recurring.save();

      logger.info(`Recurring transaction paused: ${id}`);

      return res.status(200).json({
        success: true,
        message: "Transação recorrente pausada com sucesso",
        data: recurring,
      });
    } catch (error) {
      logger.error("Error pausing recurring transaction:", error);
      return res.status(500).json({
        success: false,
        message: "Erro ao pausar transação recorrente",
        error: error.message,
      });
    }
  }

  /**
   * Retoma transação recorrente
   * POST /api/recurring-transactions/:id/resume
   */
  async resume(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user._id;

      const recurring = await RecurringTransaction.findOne({
        _id: id,
        userId,
      });

      if (!recurring) {
        return res.status(404).json({
          success: false,
          message: "Transação recorrente não encontrada",
        });
      }

      if (!recurring.resume()) {
        return res.status(400).json({
          success: false,
          message: "Transação não pode ser retomada no estado atual",
        });
      }

      await recurring.save();

      logger.info(`Recurring transaction resumed: ${id}`);

      return res.status(200).json({
        success: true,
        message: "Transação recorrente retomada com sucesso",
        data: recurring,
      });
    } catch (error) {
      logger.error("Error resuming recurring transaction:", error);
      return res.status(500).json({
        success: false,
        message: "Erro ao retomar transação recorrente",
        error: error.message,
      });
    }
  }

  /**
   * Cancela transação recorrente
   * POST /api/recurring-transactions/:id/cancel
   */
  async cancel(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user._id;

      const recurring = await RecurringTransaction.findOne({
        _id: id,
        userId,
      });

      if (!recurring) {
        return res.status(404).json({
          success: false,
          message: "Transação recorrente não encontrada",
        });
      }

      if (!recurring.cancel()) {
        return res.status(400).json({
          success: false,
          message: "Transação não pode ser cancelada no estado atual",
        });
      }

      await recurring.save();

      logger.info(`Recurring transaction cancelled: ${id}`);

      return res.status(200).json({
        success: true,
        message: "Transação recorrente cancelada com sucesso",
        data: recurring,
      });
    } catch (error) {
      logger.error("Error cancelling recurring transaction:", error);
      return res.status(500).json({
        success: false,
        message: "Erro ao cancelar transação recorrente",
        error: error.message,
      });
    }
  }

  /**
   * Executa manualmente uma transação recorrente
   * POST /api/recurring-transactions/:id/execute
   */
  async executeNow(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user._id;

      const recurring = await RecurringTransaction.findOne({
        _id: id,
        userId,
      });

      if (!recurring) {
        return res.status(404).json({
          success: false,
          message: "Transação recorrente não encontrada",
        });
      }

      const transaction = await scheduler.executeManually(id);

      return res.status(200).json({
        success: true,
        message: "Transação executada com sucesso",
        data: {
          recurring,
          transaction,
        },
      });
    } catch (error) {
      logger.error("Error executing recurring transaction:", error);
      return res.status(500).json({
        success: false,
        message: "Erro ao executar transação recorrente",
        error: error.message,
      });
    }
  }

  /**
   * Obtém histórico de execuções
   * GET /api/recurring-transactions/:id/history
   */
  async getHistory(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user._id;

      const recurring = await RecurringTransaction.findOne({
        _id: id,
        userId,
      }).populate({
        path: "generatedTransactions.transactionId",
        select: "description amount date type",
      });

      if (!recurring) {
        return res.status(404).json({
          success: false,
          message: "Transação recorrente não encontrada",
        });
      }

      return res.status(200).json({
        success: true,
        data: {
          recurring: {
            id: recurring._id,
            description: recurring.description,
            executionCount: recurring.executionCount,
          },
          history: recurring.generatedTransactions,
        },
      });
    } catch (error) {
      logger.error("Error fetching recurring transaction history:", error);
      return res.status(500).json({
        success: false,
        message: "Erro ao buscar histórico",
        error: error.message,
      });
    }
  }

  /**
   * Obtém estatísticas de recorrências do usuário
   * GET /api/recurring-transactions/stats
   */
  async getStats(req, res) {
    try {
      const userId = req.user._id;

      const stats = await RecurringTransaction.getUserStats(userId);

      const total = await RecurringTransaction.countDocuments({ userId });

      return res.status(200).json({
        success: true,
        data: {
          total,
          byStatus: stats,
        },
      });
    } catch (error) {
      logger.error("Error fetching recurring transaction stats:", error);
      return res.status(500).json({
        success: false,
        message: "Erro ao buscar estatísticas",
        error: error.message,
      });
    }
  }
}

// Criar instância e exportar métodos
const controller = new RecurringTransactionController();

module.exports = {
  getAll: controller.getAll.bind(controller),
  getById: controller.getById.bind(controller),
  create: controller.create.bind(controller),
  update: controller.update.bind(controller),
  delete: controller.delete.bind(controller),
  pause: controller.pause.bind(controller),
  resume: controller.resume.bind(controller),
  cancel: controller.cancel.bind(controller),
  executeNow: controller.executeNow.bind(controller),
  getHistory: controller.getHistory.bind(controller),
  getStats: controller.getStats.bind(controller),
};
