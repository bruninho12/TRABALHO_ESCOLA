/**
 * 🔄 Serviço de Processamento de Transações Recorrentes
 * Executa automaticamente transações agendadas via cron job
 */

const cron = require("node-cron");
const RecurringTransaction = require("../models/RecurringTransaction");
const Transaction = require("../models/Transaction");
const User = require("../models/User");
const logger = require("../utils/logger");
const notificationService = require("./notificationService");

class RecurringTransactionProcessor {
  constructor() {
    this.isRunning = false;
    this.cronJob = null;
  }

  /**
   * Inicia o processamento automático
   * Roda a cada 1 hora
   */
  start() {
    if (this.cronJob) {
      logger.warn("Processador de transações recorrentes já está rodando");
      return;
    }

    // Roda às 9h da manhã todos os dias
    this.cronJob = cron.schedule("0 9 * * *", async () => {
      await this.processRecurringTransactions();
    });

    // Também verifica a cada 1 hora
    cron.schedule("0 * * * *", async () => {
      await this.processRecurringTransactions();
    });

    logger.info("✅ Processador de transações recorrentes iniciado");
  }

  /**
   * Para o processamento automático
   */
  stop() {
    if (this.cronJob) {
      this.cronJob.stop();
      this.cronJob = null;
      logger.info("⏹️ Processador de transações recorrentes parado");
    }
  }

  /**
   * Processa todas as transações recorrentes pendentes
   */
  async processRecurringTransactions() {
    if (this.isRunning) {
      logger.info("⏭️ Processamento já em andamento, pulando...");
      return;
    }

    this.isRunning = true;
    logger.info("🔄 Iniciando processamento de transações recorrentes...");

    try {
      // Busca todas as transações que devem ser executadas
      const dueTransactions = await RecurringTransaction.find({
        status: "active",
        nextExecutionDate: { $lte: new Date() },
      })
        .populate("userId", "email name")
        .populate("categoryId", "name type icon color");

      logger.info(
        `📋 Encontradas ${dueTransactions.length} transações para processar`
      );

      let successCount = 0;
      let errorCount = 0;

      // Processa cada transação
      for (const recurring of dueTransactions) {
        try {
          await this.executeRecurringTransaction(recurring);
          successCount++;
        } catch (error) {
          errorCount++;
          logger.error(
            `❌ Erro ao processar transação ${recurring._id}:`,
            error
          );

          // Registra falha
          recurring.recordFailure(error.message);
          await recurring.save();
        }
      }

      logger.info(
        `✅ Processamento concluído: ${successCount} sucessos, ${errorCount} erros`
      );
    } catch (error) {
      logger.error(
        "❌ Erro no processamento de transações recorrentes:",
        error
      );
    } finally {
      this.isRunning = false;
    }
  }

  /**
   * Executa uma transação recorrente específica
   */
  async executeRecurringTransaction(recurring) {
    logger.info(
      `💰 Executando: ${recurring.description} (R$ ${recurring.amount})`
    );

    // Calcula valor com ajuste se configurado
    const amount = recurring.getAdjustedAmount();

    // Cria a transação real
    const transaction = new Transaction({
      userId: recurring.userId._id,
      description: recurring.description,
      amount,
      type: recurring.type,
      categoryId: recurring.categoryId._id,
      paymentMethod: recurring.paymentMethod,
      notes: recurring.notes
        ? `${recurring.notes}\n\n🔄 Gerada automaticamente`
        : "🔄 Transação recorrente",
      date: new Date(),
      isRecurring: true,
      recurringTransactionId: recurring._id,
    });

    await transaction.save();

    // Atualiza saldo do usuário
    const user = await User.findById(recurring.userId._id);
    if (user) {
      if (recurring.type === "income") {
        user.totalIncome += amount;
      } else {
        user.totalExpenses += amount;
      }
      await user.save();
    }

    // Registra execução bem-sucedida
    recurring.recordExecution(transaction._id);
    await recurring.save();

    // Envia notificação ao usuário
    await this.notifyTransactionCreated(recurring, transaction);

    logger.info(`✅ Transação criada com sucesso: ${transaction._id}`);

    return transaction;
  }

  /**
   * Notifica usuário sobre transação criada
   */
  async notifyTransactionCreated(recurring, transaction) {
    try {
      const icon = recurring.type === "income" ? "💰" : "💸";
      const typeLabel = recurring.type === "income" ? "Receita" : "Despesa";

      // Aqui você integraria com seu sistema de notificações
      logger.info(`📧 Notificando usuário ${recurring.userId.email}`);

      // Exemplo de notificação
      const notification = {
        userId: recurring.userId._id,
        title: `${icon} ${typeLabel} Recorrente Registrada`,
        message: `${recurring.description} - R$ ${transaction.amount.toFixed(
          2
        )}`,
        type: "recurring_transaction",
        data: {
          transactionId: transaction._id,
          recurringId: recurring._id,
        },
      };

      // Salvar notificação no banco (se tiver modelo de notificação)
      // await Notification.create(notification);
    } catch (error) {
      logger.error("Erro ao enviar notificação:", error);
    }
  }

  /**
   * Envia lembretes de transações que ocorrerão em breve
   */
  async sendUpcomingReminders() {
    try {
      const upcomingTransactions = await RecurringTransaction.find({
        status: "active",
        notifyBeforeExecution: true,
      })
        .populate("userId", "email name")
        .populate("categoryId", "name type");

      for (const recurring of upcomingTransactions) {
        const daysUntil = recurring.daysUntilNext;

        if (daysUntil === recurring.notificationDaysBefore) {
          await this.sendReminder(recurring);
        }
      }
    } catch (error) {
      logger.error("Erro ao enviar lembretes:", error);
    }
  }

  /**
   * Envia lembrete individual
   */
  async sendReminder(recurring) {
    logger.info(`🔔 Enviando lembrete para: ${recurring.userId.email}`);

    const icon = recurring.type === "income" ? "💰" : "💸";
    const typeLabel = recurring.type === "income" ? "Receita" : "Despesa";

    // Aqui você integraria com seu sistema de notificações/email
    const reminder = {
      userId: recurring.userId._id,
      title: `🔔 Lembrete: ${typeLabel} Recorrente`,
      message: `${recurring.description} será registrada em ${
        recurring.daysUntilNext
      } dia(s) - R$ ${recurring.amount.toFixed(2)}`,
      type: "reminder",
      data: {
        recurringId: recurring._id,
      },
    };

    // Salvar notificação
    // await Notification.create(reminder);
  }

  /**
   * Limpa transações recorrentes completadas antigas
   */
  async cleanupCompletedTransactions(daysOld = 90) {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysOld);

      const result = await RecurringTransaction.deleteMany({
        status: { $in: ["completed", "cancelled"] },
        updatedAt: { $lt: cutoffDate },
      });

      logger.info(
        `🧹 Limpeza: ${result.deletedCount} transações antigas removidas`
      );
      return result.deletedCount;
    } catch (error) {
      logger.error("Erro na limpeza:", error);
      throw error;
    }
  }

  /**
   * Retorna estatísticas do processador
   */
  async getStats() {
    try {
      const stats = await RecurringTransaction.aggregate([
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
            totalAmount: { $sum: "$amount" },
          },
        },
      ]);

      const nextExecutions = await RecurringTransaction.find({
        status: "active",
      })
        .sort({ nextExecutionDate: 1 })
        .limit(10)
        .populate("userId", "name")
        .populate("categoryId", "name");

      return {
        byStatus: stats,
        nextExecutions,
        isRunning: this.isRunning,
      };
    } catch (error) {
      logger.error("Erro ao obter estatísticas:", error);
      throw error;
    }
  }

  /**
   * Executa manualmente uma transação recorrente específica
   */
  async executeManually(recurringId) {
    const recurring = await RecurringTransaction.findById(recurringId)
      .populate("userId", "email name")
      .populate("categoryId", "name type");

    if (!recurring) {
      throw new Error("Transação recorrente não encontrada");
    }

    if (recurring.status !== "active") {
      throw new Error("Transação não está ativa");
    }

    return await this.executeRecurringTransaction(recurring);
  }
}

// Singleton
const processor = new RecurringTransactionProcessor();

module.exports = processor;
