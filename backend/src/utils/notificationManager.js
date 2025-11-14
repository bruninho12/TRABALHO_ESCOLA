/**
 * @fileoverview Sistema de Notificações do DespFinancee
 * Gerencia alertas, lembretes e notificações em tempo real
 */

const logger = require("./logger");

/**
 * Tipos de notificações
 */
const NotificationTypes = {
  BUDGET_WARNING: "budget_warning", // 80% do orçamento atingido
  BUDGET_EXCEEDED: "budget_exceeded", // Orçamento excedido
  GOAL_DEADLINE: "goal_deadline", // Meta próxima do prazo
  GOAL_COMPLETED: "goal_completed", // Meta completada
  RECURRING_TRANSACTION: "recurring_transaction", // Transação recorrente
  ACHIEVEMENT_UNLOCKED: "achievement_unlocked", // Conquista desbloqueada
  LEVEL_UP: "level_up", // Subiu de nível no RPG
  PAYMENT_REMINDER: "payment_reminder", // Lembrete de pagamento
  REPORT_READY: "report_ready", // Relatório mensal pronto
};

/**
 * Prioridades de notificações
 */
const NotificationPriority = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
  URGENT: "urgent",
};

/**
 * Canais de notificação
 */
const NotificationChannels = {
  IN_APP: "in_app", // Notificação no aplicativo
  EMAIL: "email", // Email
  PUSH: "push", // Push notification (futuro)
  SMS: "sms", // SMS (futuro)
};

/**
 * Gerenciador de Notificações
 */
class NotificationManager {
  constructor() {
    this.notifications = new Map(); // userId -> array de notificações
    this.preferences = new Map(); // userId -> preferências
    this.emailService = null; // Será injetado
  }

  /**
   * Configura o serviço de email
   */
  setEmailService(emailService) {
    this.emailService = emailService;
  }

  /**
   * Cria uma nova notificação
   */
  async createNotification(userId, data) {
    try {
      const notification = {
        id: this.generateNotificationId(),
        userId,
        type: data.type,
        priority: data.priority || NotificationPriority.MEDIUM,
        title: data.title,
        message: data.message,
        data: data.data || {},
        read: false,
        createdAt: new Date(),
        expiresAt: data.expiresAt || null,
      };

      // Adicionar à lista de notificações do usuário
      if (!this.notifications.has(userId)) {
        this.notifications.set(userId, []);
      }
      this.notifications.get(userId).push(notification);

      // Enviar por canais apropriados
      await this.dispatchNotification(userId, notification);

      logger.info(`Notification created for user ${userId}`, {
        type: notification.type,
        priority: notification.priority,
      });

      return notification;
    } catch (error) {
      logger.error("Error creating notification:", error);
      throw error;
    }
  }

  /**
   * Despacha notificação pelos canais configurados
   */
  async dispatchNotification(userId, notification) {
    const preferences = this.getUserPreferences(userId);

    // Notificação in-app (sempre ativa)
    this.sendInAppNotification(userId, notification);

    // Email (se habilitado)
    if (preferences.emailEnabled && this.shouldSendEmail(notification)) {
      await this.sendEmailNotification(userId, notification);
    }

    // Push notification (futuro)
    if (preferences.pushEnabled) {
      await this.sendPushNotification(userId, notification);
    }
  }

  /**
   * Envia notificação in-app
   */
  sendInAppNotification(userId, notification) {
    // Aqui você pode integrar com WebSocket para notificações em tempo real
    logger.debug(
      `In-app notification sent to user ${userId}: ${notification.title}`
    );
  }

  /**
   * Envia notificação por email
   */
  async sendEmailNotification(userId, notification) {
    if (!this.emailService) {
      logger.warn("Email service not configured");
      return;
    }

    try {
      // TODO: Buscar email do usuário do banco de dados
      const userEmail = await this.getUserEmail(userId);

      if (!userEmail) {
        logger.warn(`No email found for user ${userId}`);
        return;
      }

      await this.emailService.sendNotificationEmail({
        to: userEmail,
        subject: this.getEmailSubject(notification),
        template: this.getEmailTemplate(notification),
        data: {
          title: notification.title,
          message: notification.message,
          ...notification.data,
        },
      });

      logger.info(`Email notification sent to ${userEmail}`);
    } catch (error) {
      logger.error("Error sending email notification:", error);
    }
  }

  /**
   * Envia push notification (futuro)
   */
  async sendPushNotification(userId, notification) {
    // Implementação futura com Firebase Cloud Messaging ou similar
    logger.debug(
      `Push notification would be sent to user ${userId}: ${notification.title}`
    );
  }

  /**
   * Verifica se deve enviar email baseado na prioridade
   */
  shouldSendEmail(notification) {
    const emailPriorities = [
      NotificationPriority.HIGH,
      NotificationPriority.URGENT,
    ];
    return emailPriorities.includes(notification.priority);
  }

  /**
   * Obtém subject do email baseado no tipo de notificação
   */
  getEmailSubject(notification) {
    const subjects = {
      [NotificationTypes.BUDGET_WARNING]:
        "⚠️ Atenção: Orçamento quase excedido!",
      [NotificationTypes.BUDGET_EXCEEDED]: "🚨 Alerta: Orçamento excedido!",
      [NotificationTypes.GOAL_DEADLINE]: "📅 Lembrete: Meta próxima do prazo",
      [NotificationTypes.GOAL_COMPLETED]: "🎉 Parabéns: Meta completada!",
      [NotificationTypes.ACHIEVEMENT_UNLOCKED]:
        "🏆 Nova conquista desbloqueada!",
      [NotificationTypes.LEVEL_UP]: "⬆️ Level Up! Novo nível alcançado",
      [NotificationTypes.PAYMENT_REMINDER]: "💳 Lembrete de pagamento",
      [NotificationTypes.REPORT_READY]: "📊 Seu relatório mensal está pronto",
    };

    return subjects[notification.type] || "📬 Nova notificação - DespFinancee";
  }

  /**
   * Obtém template do email
   */
  getEmailTemplate(notification) {
    // Retorna o nome do template baseado no tipo
    return notification.type;
  }

  /**
   * Lista notificações de um usuário
   */
  getUserNotifications(userId, options = {}) {
    const { unreadOnly = false, limit = 50, type = null } = options;

    let notifications = this.notifications.get(userId) || [];

    // Filtrar por não lidas
    if (unreadOnly) {
      notifications = notifications.filter((n) => !n.read);
    }

    // Filtrar por tipo
    if (type) {
      notifications = notifications.filter((n) => n.type === type);
    }

    // Remover notificações expiradas
    notifications = notifications.filter((n) => {
      if (!n.expiresAt) return true;
      return new Date(n.expiresAt) > new Date();
    });

    // Limitar quantidade
    notifications = notifications.slice(0, limit);

    return notifications;
  }

  /**
   * Marca notificação como lida
   */
  markAsRead(userId, notificationId) {
    const notifications = this.notifications.get(userId);
    if (!notifications) return false;

    const notification = notifications.find((n) => n.id === notificationId);
    if (notification) {
      notification.read = true;
      logger.debug(`Notification ${notificationId} marked as read`);
      return true;
    }

    return false;
  }

  /**
   * Marca todas as notificações como lidas
   */
  markAllAsRead(userId) {
    const notifications = this.notifications.get(userId);
    if (!notifications) return 0;

    let count = 0;
    notifications.forEach((notification) => {
      if (!notification.read) {
        notification.read = true;
        count++;
      }
    });

    logger.info(`${count} notifications marked as read for user ${userId}`);
    return count;
  }

  /**
   * Deleta notificação
   */
  deleteNotification(userId, notificationId) {
    const notifications = this.notifications.get(userId);
    if (!notifications) return false;

    const index = notifications.findIndex((n) => n.id === notificationId);
    if (index !== -1) {
      notifications.splice(index, 1);
      logger.debug(`Notification ${notificationId} deleted`);
      return true;
    }

    return false;
  }

  /**
   * Limpa notificações antigas
   */
  clearOldNotifications(userId, daysOld = 30) {
    const notifications = this.notifications.get(userId);
    if (!notifications) return 0;

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    const beforeCount = notifications.length;
    const filtered = notifications.filter(
      (n) => new Date(n.createdAt) > cutoffDate
    );

    this.notifications.set(userId, filtered);
    const deleted = beforeCount - filtered.length;

    logger.info(`Cleared ${deleted} old notifications for user ${userId}`);
    return deleted;
  }

  /**
   * Obtém preferências de notificação do usuário
   */
  getUserPreferences(userId) {
    return (
      this.preferences.get(userId) || {
        emailEnabled: true,
        pushEnabled: false,
        budgetAlerts: true,
        goalReminders: true,
        achievementNotifications: true,
        weeklyReport: true,
      }
    );
  }

  /**
   * Atualiza preferências de notificação
   */
  updateUserPreferences(userId, preferences) {
    const current = this.getUserPreferences(userId);
    const updated = { ...current, ...preferences };
    this.preferences.set(userId, updated);

    logger.info(`Notification preferences updated for user ${userId}`);
    return updated;
  }

  /**
   * Notificações específicas por tipo
   */

  // Alerta de orçamento
  async notifyBudgetWarning(userId, budgetData) {
    return this.createNotification(userId, {
      type: NotificationTypes.BUDGET_WARNING,
      priority: NotificationPriority.HIGH,
      title: "Orçamento Quase Excedido",
      message: `Você já gastou ${budgetData.percentage}% do orçamento de ${budgetData.categoryName}`,
      data: budgetData,
    });
  }

  async notifyBudgetExceeded(userId, budgetData) {
    return this.createNotification(userId, {
      type: NotificationTypes.BUDGET_EXCEEDED,
      priority: NotificationPriority.URGENT,
      title: "Orçamento Excedido",
      message: `Você excedeu o orçamento de ${budgetData.categoryName} em ${budgetData.exceededAmount}`,
      data: budgetData,
    });
  }

  // Alertas de metas
  async notifyGoalDeadline(userId, goalData) {
    return this.createNotification(userId, {
      type: NotificationTypes.GOAL_DEADLINE,
      priority: NotificationPriority.MEDIUM,
      title: "Meta Próxima do Prazo",
      message: `A meta "${goalData.name}" vence em ${goalData.daysRemaining} dias`,
      data: goalData,
    });
  }

  async notifyGoalCompleted(userId, goalData) {
    return this.createNotification(userId, {
      type: NotificationTypes.GOAL_COMPLETED,
      priority: NotificationPriority.MEDIUM,
      title: "Meta Completada!",
      message: `Parabéns! Você completou a meta "${goalData.name}"`,
      data: goalData,
    });
  }

  // Conquistas RPG
  async notifyAchievementUnlocked(userId, achievementData) {
    return this.createNotification(userId, {
      type: NotificationTypes.ACHIEVEMENT_UNLOCKED,
      priority: NotificationPriority.LOW,
      title: "Nova Conquista!",
      message: `Você desbloqueou: ${achievementData.name}`,
      data: achievementData,
    });
  }

  async notifyLevelUp(userId, levelData) {
    return this.createNotification(userId, {
      type: NotificationTypes.LEVEL_UP,
      priority: NotificationPriority.MEDIUM,
      title: "Level Up!",
      message: `Parabéns! Você alcançou o nível ${levelData.newLevel}`,
      data: levelData,
    });
  }

  // Lembretes
  async notifyPaymentReminder(userId, paymentData) {
    return this.createNotification(userId, {
      type: NotificationTypes.PAYMENT_REMINDER,
      priority: NotificationPriority.HIGH,
      title: "Lembrete de Pagamento",
      message: `Não esqueça: ${paymentData.description} vence em ${paymentData.daysUntilDue} dias`,
      data: paymentData,
    });
  }

  async notifyReportReady(userId, reportData) {
    return this.createNotification(userId, {
      type: NotificationTypes.REPORT_READY,
      priority: NotificationPriority.LOW,
      title: "Relatório Pronto",
      message: `Seu relatório de ${reportData.period} está disponível`,
      data: reportData,
    });
  }

  // ==================== Métodos Auxiliares ====================

  generateNotificationId() {
    return `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  async getUserEmail(userId) {
    try {
      const User = require("../models/User");
      const user = await User.findById(userId).select("email");
      return user?.email || null;
    } catch (error) {
      logger.error(`Error fetching user email for ${userId}: ${error.message}`);
      return null;
    }
  }
}

// Singleton
const notificationManager = new NotificationManager();

module.exports = {
  NotificationManager,
  NotificationTypes,
  NotificationPriority,
  NotificationChannels,
  notificationManager, // Instância singleton
};
