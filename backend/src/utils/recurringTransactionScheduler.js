/**
 * @fileoverview Scheduler de Transações Recorrentes
 * Executa transações recorrentes automaticamente
 */

const cron = require("node-cron");
const RecurringTransaction = require("../models/RecurringTransaction");
const { Transaction } = require("../models");
const logger = require("./logger");
const { notificationManager } = require("./notificationManager");

class RecurringTransactionScheduler {
  constructor() {
    this.jobs = new Map();
    this.isRunning = false;
  }

  /**
   * Inicia o scheduler
   */
  start() {
    if (this.isRunning) {
      logger.warn("Scheduler already running");
      return;
    }

    // Executar a cada hora
    this.jobs.set(
      "processRecurring",
      cron.schedule("0 * * * *", async () => {
        await this.processRecurringTransactions();
      })
    );

    // Verificar notificações a cada 6 horas
    this.jobs.set(
      "checkNotifications",
      cron.schedule("0 */6 * * *", async () => {
        await this.sendNotifications();
      })
    );

    // Limpar transações completadas a cada dia
    this.jobs.set(
      "cleanup",
      cron.schedule("0 0 * * *", async () => {
        await this.cleanup();
      })
    );

    this.isRunning = true;
    logger.info("Recurring transaction scheduler started");
  }

  /**
   * Para o scheduler
   */
  stop() {
    this.jobs.forEach((job) => job.stop());
    this.jobs.clear();
    this.isRunning = false;
    logger.info("Recurring transaction scheduler stopped");
  }

  /**
   * Processa transações recorrentes pendentes
   */
  async processRecurringTransactions() {
    try {
      logger.info("Processing recurring transactions...");

      const dueTransactions = await RecurringTransaction.findDueTransactions();

      logger.info(`Found ${dueTransactions.length} due transactions`);

      let processed = 0;
      let failed = 0;

      for (const recurring of dueTransactions) {
        try {
          await this.executeRecurringTransaction(recurring);
          processed++;
        } catch (error) {
          failed++;
          logger.error(
            `Failed to execute recurring transaction ${recurring._id}:`,
            error
          );
          recurring.recordFailure(error.message);
          await recurring.save();
        }
      }

      logger.info(`Processed: ${processed}, Failed: ${failed}`);

      return { processed, failed };
    } catch (error) {
      logger.error("Error processing recurring transactions:", error);
      throw error;
    }
  }

  /**
   * Executa uma transação recorrente específica
   */
  async executeRecurringTransaction(recurring) {
    try {
      // Criar transação normal
      const transaction = new Transaction({
        userId: recurring.userId,
        description: recurring.description,
        amount: recurring.getAdjustedAmount(),
        type: recurring.type,
        categoryId: recurring.categoryId,
        paymentMethod: recurring.paymentMethod,
        notes: recurring.notes,
        date: recurring.nextExecutionDate,
        isRecurring: true,
        recurringTransactionId: recurring._id,
      });

      await transaction.save();

      // Registrar execução bem-sucedida
      recurring.recordExecution(transaction._id);
      await recurring.save();

      // Integração RPG (se for despesa)
      if (recurring.type === "expense") {
        try {
          const { Avatar } = require("../models");
          const avatar = await Avatar.findOne({ userId: recurring.userId });
          if (avatar) {
            avatar.gainExperience(10);
            avatar.addGold(5);
            await avatar.save();
          }
        } catch (rpgError) {
          logger.warn("RPG integration failed:", rpgError);
        }
      }

      logger.info(
        `Recurring transaction executed: ${recurring._id} -> ${transaction._id}`
      );

      return transaction;
    } catch (error) {
      logger.error("Error executing recurring transaction:", error);
      throw error;
    }
  }

  /**
   * Envia notificações de transações próximas
   */
  async sendNotifications() {
    try {
      logger.info("Checking for notification reminders...");

      const pendingNotifications =
        await RecurringTransaction.findPendingNotifications();

      logger.info(
        `Found ${pendingNotifications.length} transactions needing notification`
      );

      for (const recurring of pendingNotifications) {
        try {
          await notificationManager.createNotification(recurring.userId, {
            type: "recurring_transaction",
            priority: "medium",
            title: "Transação Recorrente Agendada",
            message: `"${
              recurring.description
            }" será processada amanhã (${this.formatCurrency(
              recurring.amount
            )})`,
            data: {
              recurringId: recurring._id,
              amount: recurring.amount,
              type: recurring.type,
              nextDate: recurring.nextExecutionDate,
            },
          });

          logger.debug(`Notification sent for recurring ${recurring._id}`);
        } catch (error) {
          logger.error(
            `Failed to send notification for ${recurring._id}:`,
            error
          );
        }
      }

      return pendingNotifications.length;
    } catch (error) {
      logger.error("Error sending notifications:", error);
      throw error;
    }
  }

  /**
   * Limpa transações antigas e completadas
   */
  async cleanup() {
    try {
      logger.info("Running cleanup...");

      // Remover transações completadas há mais de 90 dias
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - 90);

      const result = await RecurringTransaction.deleteMany({
        status: { $in: ["completed", "cancelled"] },
        updatedAt: { $lt: cutoffDate },
      });

      logger.info(
        `Cleaned up ${result.deletedCount} old recurring transactions`
      );

      return result.deletedCount;
    } catch (error) {
      logger.error("Error during cleanup:", error);
      throw error;
    }
  }

  /**
   * Executa manualmente uma transação recorrente (fora do schedule)
   */
  async executeManually(recurringId) {
    try {
      const recurring = await RecurringTransaction.findById(recurringId)
        .populate("userId", "email name")
        .populate("categoryId", "name type");

      if (!recurring) {
        throw new Error("Recurring transaction not found");
      }

      if (recurring.status !== "active") {
        throw new Error("Recurring transaction is not active");
      }

      const transaction = await this.executeRecurringTransaction(recurring);

      logger.info(`Manual execution of recurring ${recurringId} successful`);

      return transaction;
    } catch (error) {
      logger.error(`Error in manual execution of ${recurringId}:`, error);
      throw error;
    }
  }

  /**
   * Obtém estatísticas do scheduler
   */
  getStats() {
    return {
      isRunning: this.isRunning,
      activeJobs: this.jobs.size,
      jobs: Array.from(this.jobs.keys()),
    };
  }

  // ==================== Métodos Auxiliares ====================

  formatCurrency(amount) {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(amount);
  }

  formatDate(date) {
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(new Date(date));
  }
}

// Singleton
const scheduler = new RecurringTransactionScheduler();

module.exports = {
  RecurringTransactionScheduler,
  scheduler,
};
