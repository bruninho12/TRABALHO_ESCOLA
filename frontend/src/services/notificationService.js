/**
 * 🔔 Sistema de Notificações Push Inteligentes
 * Gerencia notificações PWA, in-app e preferências do usuário
 */

class NotificationService {
  constructor() {
    this.permission = "default";
    this.isSupported = "Notification" in window;
  }

  /**
   * Solicita permissão para notificações push
   */
  async requestPermission() {
    if (!this.isSupported) {
      console.warn("Notificações não suportadas neste navegador");
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      this.permission = permission;
      return permission === "granted";
    } catch (error) {
      console.error("Erro ao solicitar permissão:", error);
      return false;
    }
  }

  /**
   * Envia notificação local (PWA)
   */
  async sendNotification(title, options = {}) {
    if (this.permission !== "granted") {
      console.warn("Permissão de notificação não concedida");
      return;
    }

    const defaultOptions = {
      icon: "/icons/icon-192x192.png",
      badge: "/icons/badge-72x72.png",
      vibrate: [200, 100, 200],
      requireInteraction: false,
      ...options,
    };

    try {
      const registration = await navigator.serviceWorker.ready;
      await registration.showNotification(title, defaultOptions);
    } catch (error) {
      // Fallback para notificação básica
      new Notification(title, defaultOptions);
    }
  }

  /**
   * 💰 Notificação de alerta de orçamento
   */
  async notifyBudgetAlert(budget) {
    const percentage = Math.round((budget.spent / budget.limit) * 100);

    let icon = "⚠️";
    let urgency = "high";

    if (percentage >= 90) {
      icon = "🚨";
      urgency = "urgent";
    }

    await this.sendNotification(`${icon} Alerta de Orçamento`, {
      body: `Você gastou ${percentage}% do orçamento de ${
        budget.category
      } (R$ ${budget.spent.toFixed(2)} de R$ ${budget.limit.toFixed(2)})`,
      tag: `budget-${budget.id}`,
      data: { type: "budget_alert", budgetId: budget.id },
      actions: [
        { action: "view", title: "Ver Orçamento" },
        { action: "dismiss", title: "Dispensar" },
      ],
      urgency,
    });
  }

  /**
   * 🎯 Notificação de meta atingida
   */
  async notifyGoalAchieved(goal) {
    await this.sendNotification("🎉 Meta Atingida!", {
      body: `Parabéns! Você atingiu a meta "${
        goal.name
      }" de R$ ${goal.targetAmount.toFixed(2)}!`,
      tag: `goal-${goal.id}`,
      data: { type: "goal_achieved", goalId: goal.id },
      badge: "/icons/trophy-badge.png",
      actions: [
        { action: "celebrate", title: "Comemorar 🎊" },
        { action: "view", title: "Ver Meta" },
      ],
      requireInteraction: true,
    });
  }

  /**
   * 🎮 Notificação de conquista desbloqueada
   */
  async notifyAchievement(achievement) {
    await this.sendNotification(`🏆 Conquista Desbloqueada!`, {
      body: `${achievement.name} - ${achievement.description}\n+${achievement.xp} XP`,
      tag: `achievement-${achievement.id}`,
      icon: `/icons/achievements/${achievement.icon}.png`,
      data: { type: "achievement", achievementId: achievement.id },
      actions: [{ action: "view", title: "Ver Conquistas" }],
    });
  }

  /**
   * 🧾 Notificação de conta próxima ao vencimento
   */
  async notifyBillDue(bill) {
    const daysLeft = Math.ceil(
      (new Date(bill.dueDate) - new Date()) / (1000 * 60 * 60 * 24)
    );

    let icon = "🧾";
    let urgency = "normal";

    if (daysLeft <= 1) {
      icon = "🚨";
      urgency = "urgent";
    } else if (daysLeft <= 3) {
      icon = "⚠️";
      urgency = "high";
    }

    await this.sendNotification(`${icon} Conta a Vencer`, {
      body: `${
        bill.description
      } vence em ${daysLeft} dia(s) - R$ ${bill.amount.toFixed(2)}`,
      tag: `bill-${bill.id}`,
      data: { type: "bill_due", billId: bill.id },
      actions: [
        { action: "pay", title: "Marcar como Pago" },
        { action: "view", title: "Ver Detalhes" },
      ],
      urgency,
    });
  }

  /**
   * 💡 Insight inteligente
   */
  async notifyInsight(insight) {
    await this.sendNotification(`💡 ${insight.title}`, {
      body: insight.message,
      tag: `insight-${insight.id}`,
      data: { type: "insight", insightId: insight.id },
      actions: [{ action: "view", title: "Saiba Mais" }],
    });
  }

  /**
   * 📊 Resumo semanal
   */
  async notifyWeeklySummary(summary) {
    const savings = summary.income - summary.expenses;
    const icon = savings >= 0 ? "📈" : "📉";

    await this.sendNotification(`${icon} Resumo Semanal`, {
      body: `Receitas: R$ ${summary.income.toFixed(
        2
      )}\nDespesas: R$ ${summary.expenses.toFixed(
        2
      )}\nEconomia: R$ ${savings.toFixed(2)}`,
      tag: "weekly-summary",
      data: { type: "weekly_summary" },
      actions: [{ action: "view-report", title: "Ver Relatório" }],
    });
  }

  /**
   * Agenda notificação para daqui a X minutos/horas
   */
  scheduleNotification(title, options, delayMs) {
    setTimeout(() => {
      this.sendNotification(title, options);
    }, delayMs);
  }

  /**
   * Verifica permissões atuais
   */
  checkPermission() {
    if (!this.isSupported) return "not-supported";
    return Notification.permission;
  }

  /**
   * Limpa notificações antigas
   */
  async clearAllNotifications() {
    if ("serviceWorker" in navigator) {
      const registration = await navigator.serviceWorker.ready;
      const notifications = await registration.getNotifications();
      notifications.forEach((notification) => notification.close());
    }
  }
}

// Singleton
const notificationService = new NotificationService();

export default notificationService;
