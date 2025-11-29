/**
 * 🔔 Notification Service
 * Serviço para gerenciamento de notificações push
 */

const Notification = require("../models/Notification");
const logger = require("../utils/logger");

class NotificationService {
  /**
   * Cria uma nova notificação
   */
  static async createNotification(userId, type, title, message, data = {}) {
    try {
      const notification = new Notification({
        userId,
        type,
        title,
        message,
        data,
        isRead: false,
        createdAt: new Date(),
      });

      await notification.save();
      logger.info(`Notificação criada para usuário ${userId}: ${title}`);

      return notification;
    } catch (error) {
      logger.error("Erro ao criar notificação:", error);
      throw error;
    }
  }

  /**
   * Envia notificação push (placeholder para integração futura)
   */
  static async sendPushNotification(userId, title, message, data = {}) {
    try {
      // TODO: Implementar integração com serviço de push notifications
      logger.info(`Push notification para ${userId}: ${title}`);

      // Criar registro da notificação
      return await this.createNotification(
        userId,
        "push",
        title,
        message,
        data
      );
    } catch (error) {
      logger.error("Erro ao enviar push notification:", error);
      throw error;
    }
  }

  /**
   * Marca notificação como lida
   */
  static async markAsRead(notificationId, userId) {
    try {
      const notification = await Notification.findOneAndUpdate(
        { _id: notificationId, userId },
        { isRead: true, readAt: new Date() },
        { new: true }
      );

      return notification;
    } catch (error) {
      logger.error("Erro ao marcar notificação como lida:", error);
      throw error;
    }
  }

  /**
   * Busca notificações do usuário
   */
  static async getUserNotifications(userId, limit = 20, page = 1) {
    try {
      const skip = (page - 1) * limit;

      const notifications = await Notification.find({ userId })
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(skip);

      const total = await Notification.countDocuments({ userId });

      return {
        notifications,
        total,
        hasMore: skip + notifications.length < total,
      };
    } catch (error) {
      logger.error("Erro ao buscar notificações:", error);
      throw error;
    }
  }

  /**
   * Notificação de orçamento excedido
   */
  static async notifyBudgetExceeded(userId, budgetName, amount, limit) {
    const title = "⚠️ Orçamento Excedido";
    const message = `Seu orçamento "${budgetName}" excedeu o limite de R$ ${limit}. Atual: R$ ${amount}`;

    return await this.createNotification(
      userId,
      "budget_exceeded",
      title,
      message,
      {
        budgetName,
        amount,
        limit,
      }
    );
  }

  /**
   * Notificação de meta atingida
   */
  static async notifyGoalAchieved(userId, goalName, amount) {
    const title = "🎉 Meta Atingida!";
    const message = `Parabéns! Você atingiu sua meta "${goalName}" de R$ ${amount}`;

    return await this.createNotification(
      userId,
      "goal_achieved",
      title,
      message,
      {
        goalName,
        amount,
      }
    );
  }

  /**
   * Notificação de lembrete de conta
   */
  static async notifyBillReminder(userId, billName, amount, dueDate) {
    const title = "📅 Lembrete de Conta";
    const message = `A conta "${billName}" de R$ ${amount} vence em ${dueDate}`;

    return await this.createNotification(
      userId,
      "bill_reminder",
      title,
      message,
      {
        billName,
        amount,
        dueDate,
      }
    );
  }
}

module.exports = NotificationService;
