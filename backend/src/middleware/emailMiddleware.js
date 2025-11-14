// Email Middleware for automated notifications
const EmailService = require("../services/emailService");

class EmailMiddleware {
  constructor() {
    this.emailService = new EmailService();
    this.setupEventListeners();
  }

  setupEventListeners() {
    // Event emitter for various app events
    const EventEmitter = require("events");
    this.eventEmitter = new EventEmitter();

    // Listen to user events
    this.eventEmitter.on(
      "user:registered",
      this.handleUserRegistration.bind(this)
    );
    this.eventEmitter.on(
      "user:passwordReset",
      this.handlePasswordReset.bind(this)
    );
    this.eventEmitter.on(
      "payment:completed",
      this.handlePaymentCompleted.bind(this)
    );
    this.eventEmitter.on("goal:completed", this.handleGoalCompleted.bind(this));
    this.eventEmitter.on("user:levelUp", this.handleLevelUp.bind(this));
    this.eventEmitter.on("reward:claimed", this.handleRewardClaimed.bind(this));
    this.eventEmitter.on(
      "subscription:renewed",
      this.handleSubscriptionRenewed.bind(this)
    );
    this.eventEmitter.on(
      "subscription:expired",
      this.handleSubscriptionExpired.bind(this)
    );
  }

  // Event handlers
  async handleUserRegistration(data) {
    const { user, confirmationToken } = data;
    const confirmationUrl = `${process.env.FRONTEND_URL}/confirmar-email?token=${confirmationToken}`;

    try {
      await this.emailService.sendWelcomeEmail(user, confirmationUrl);
      this.logEmailSent("welcome", user.email);
    } catch (error) {
      this.logEmailError("welcome", user.email, error);
    }
  }

  async handlePasswordReset(data) {
    const { user, resetToken } = data;
    const resetUrl = `${process.env.FRONTEND_URL}/nova-senha?token=${resetToken}`;

    try {
      await this.emailService.sendPasswordResetEmail(user, resetUrl);
      this.logEmailSent("password-reset", user.email);
    } catch (error) {
      this.logEmailError("password-reset", user.email, error);
    }
  }

  async handlePaymentCompleted(data) {
    const { user, payment } = data;

    const paymentDetails = {
      planName: payment.planName || "Premium",
      amount: this.formatCurrency(payment.amount),
      paymentMethod: this.getPaymentMethodName(payment.method),
      paymentDate: new Date(payment.createdAt).toLocaleDateString("pt-BR"),
      transactionId: payment.transactionId,
    };

    try {
      await this.emailService.sendPaymentConfirmationEmail(
        user,
        paymentDetails
      );
      this.logEmailSent("payment-confirmed", user.email);
    } catch (error) {
      this.logEmailError("payment-confirmed", user.email, error);
    }
  }

  async handleGoalCompleted(data) {
    const { user, goal, userStats } = data;

    const goalData = {
      ...goal,
      goalAmount: this.formatCurrency(goal.targetAmount),
      totalGoals: userStats.completedGoals || 1,
      currentLevel: user.level || 1,
      totalSaved: this.formatCurrency(userStats.totalSaved || 0),
      dashboardUrl: `${process.env.FRONTEND_URL}/metas`,
    };

    try {
      await this.emailService.sendGoalCompletedEmail(user, goalData);
      this.logEmailSent("goal-completed", user.email);
    } catch (error) {
      this.logEmailError("goal-completed", user.email, error);
    }
  }

  async handleLevelUp(data) {
    const { user, oldLevel, newLevel } = data;

    try {
      await this.emailService.sendLevelUpEmail(user, newLevel, oldLevel);
      this.logEmailSent("level-up", user.email);
    } catch (error) {
      this.logEmailError("level-up", user.email, error);
    }
  }

  async handleRewardClaimed(data) {
    const { user, reward } = data;

    const rewardData = {
      platform: reward.platform,
      months: reward.duration,
      code: reward.code,
      expiresAt: reward.expiresAt,
      instructions: this.getRedeemInstructions(reward.platform),
    };

    try {
      await this.emailService.sendRewardClaimedEmail(user, rewardData);
      this.logEmailSent("reward-claimed", user.email);
    } catch (error) {
      this.logEmailError("reward-claimed", user.email, error);
    }
  }

  async handleSubscriptionRenewed(data) {
    const { user, subscription } = data;

    try {
      // Send renewal confirmation
      await this.sendCustomEmail(
        user.email,
        "Assinatura Renovada - DespFinance Premium",
        "subscription-renewed",
        {
          name: user.name,
          renewalDate: new Date(subscription.renewedAt).toLocaleDateString(
            "pt-BR"
          ),
          nextBilling: new Date(subscription.nextBilling).toLocaleDateString(
            "pt-BR"
          ),
          amount: this.formatCurrency(subscription.amount),
        }
      );
      this.logEmailSent("subscription-renewed", user.email);
    } catch (error) {
      this.logEmailError("subscription-renewed", user.email, error);
    }
  }

  async handleSubscriptionExpired(data) {
    const { user, subscription } = data;

    try {
      // Send expiration notice
      await this.sendCustomEmail(
        user.email,
        "Assinatura Expirada - DespFinance",
        "subscription-expired",
        {
          name: user.name,
          expiredDate: new Date(subscription.expiredAt).toLocaleDateString(
            "pt-BR"
          ),
          renewUrl: `${process.env.FRONTEND_URL}/premium`,
        }
      );
      this.logEmailSent("subscription-expired", user.email);
    } catch (error) {
      this.logEmailError("subscription-expired", user.email, error);
    }
  }

  // Utility methods
  formatCurrency(amount) {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(amount);
  }

  getPaymentMethodName(method) {
    const methods = {
      credit_card: "Cartão de Crédito",
      debit_card: "Cartão de Débito",
      pix: "PIX",
      boleto: "Boleto Bancário",
      stripe: "Cartão Internacional",
      mercadopago: "Mercado Pago",
    };
    return methods[method] || "Não especificado";
  }

  getRedeemInstructions(platform) {
    const instructions = {
      Netflix:
        "1. Acesse netflix.com/redeem\n2. Insira o código acima\n3. Aproveite seus meses grátis!",
      Spotify:
        "1. Acesse spotify.com/redeem\n2. Faça login na sua conta\n3. Insira o código\n4. Confirme o resgate",
      "Amazon Prime":
        '1. Acesse amazon.com.br/prime\n2. Vá em "Resgatar código"\n3. Digite o código\n4. Ative sua assinatura',
      "Disney+":
        '1. Acesse disneyplus.com\n2. Clique em "Resgatar"\n3. Insira o código\n4. Crie ou faça login na conta',
    };
    return (
      instructions[platform] ||
      "Siga as instruções da plataforma para resgatar seu código."
    );
  }

  async sendCustomEmail(to, subject, templateName, data) {
    return await this.emailService.sendEmail(to, subject, templateName, data);
  }

  // Email queue for bulk operations
  async sendBulkEmails(emails) {
    const results = [];
    const batchSize = 10;

    for (let i = 0; i < emails.length; i += batchSize) {
      const batch = emails.slice(i, i + batchSize);
      const batchPromises = batch.map((email) =>
        this.emailService.sendEmail(
          email.to,
          email.subject,
          email.templateName,
          email.data
        )
      );

      try {
        const batchResults = await Promise.allSettled(batchPromises);
        results.push(...batchResults);

        // Wait between batches to avoid rate limiting
        if (i + batchSize < emails.length) {
          await this.delay(1000);
        }
      } catch (error) {
        this.logEmailError("bulk-send", "batch", error);
      }
    }

    return results;
  }

  delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // Logging methods
  logEmailSent(type, recipient) {
    const timestamp = new Date().toISOString();
    // In production, use proper logging service
    if (process.env.NODE_ENV !== "production") {
      console.log(`[${timestamp}] Email enviado: ${type} para ${recipient}`);
    }
  }

  logEmailError(type, recipient, error) {
    const timestamp = new Date().toISOString();
    // In production, use proper error logging
    if (process.env.NODE_ENV !== "production") {
      console.error(
        `[${timestamp}] Erro ao enviar email ${type} para ${recipient}:`,
        error.message
      );
    }
  }

  // Test methods
  async testEmailService() {
    return await this.emailService.testConnection();
  }

  // Emit events (to be called from controllers)
  emitUserRegistered(user, confirmationToken) {
    this.eventEmitter.emit("user:registered", { user, confirmationToken });
  }

  emitPasswordReset(user, resetToken) {
    this.eventEmitter.emit("user:passwordReset", { user, resetToken });
  }

  emitPaymentCompleted(user, payment) {
    this.eventEmitter.emit("payment:completed", { user, payment });
  }

  emitGoalCompleted(user, goal, userStats) {
    this.eventEmitter.emit("goal:completed", { user, goal, userStats });
  }

  emitLevelUp(user, oldLevel, newLevel, levelData) {
    this.eventEmitter.emit("user:levelUp", {
      user,
      oldLevel,
      newLevel,
      levelData,
    });
  }

  emitRewardClaimed(user, reward) {
    this.eventEmitter.emit("reward:claimed", { user, reward });
  }

  emitSubscriptionRenewed(user, subscription) {
    this.eventEmitter.emit("subscription:renewed", { user, subscription });
  }

  emitSubscriptionExpired(user, subscription) {
    this.eventEmitter.emit("subscription:expired", { user, subscription });
  }
}

// Singleton instance
const emailMiddleware = new EmailMiddleware();

module.exports = emailMiddleware;
