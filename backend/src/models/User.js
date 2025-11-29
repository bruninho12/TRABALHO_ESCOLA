const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      default: () => new mongoose.Types.ObjectId().toString(),
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Por favor, forneça um email válido",
      ],
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: [3, "Username deve ter no mínimo 3 caracteres"],
      maxlength: [50, "Username deve ter no máximo 50 caracteres"],
    },
    password: {
      type: String,
      required: true,
      minlength: [8, "Senha deve ter no mínimo 8 caracteres"],
      select: false, // Por padrão não retorna a senha
    },
    fullName: {
      type: String,
      trim: true,
    },
    avatar: {
      type: String,
      default: null,
    },
    level: {
      type: Number,
      default: 1,
      min: 1,
    },
    experience: {
      type: Number,
      default: 0,
      min: 0,
    },
    score: {
      type: Number,
      default: 0,
      min: 0,
    },
    coins: {
      type: Number,
      default: 0,
      min: 0,
    },
    preferences: {
      theme: {
        type: String,
        enum: ["light", "dark"],
        default: "light",
      },
      notifications: {
        type: Boolean,
        default: true,
      },
      emailNotifications: {
        type: Boolean,
        default: true,
      },
      currency: {
        type: String,
        default: "BRL",
      },
    },
    twoFactorEnabled: {
      type: Boolean,
      default: false,
    },
    twoFactorSecret: {
      type: String,
      default: null,
      select: false,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerification: {
      code: {
        type: String,
        default: null,
        select: false,
      },
      token: {
        type: String,
        default: null,
        select: false,
      },
      expiresAt: {
        type: Date,
        default: null,
        select: false,
      },
      verified: {
        type: Boolean,
        default: false,
        select: false,
      },
      verifiedAt: {
        type: Date,
        default: null,
        select: false,
      },
      attempts: {
        type: Number,
        default: 0,
        select: false,
      },
    },
    emailVerificationToken: {
      type: String,
      default: null,
      select: false,
    },
    emailVerificationExpiry: {
      type: Date,
      default: null,
      select: false,
    },
    passwordResetToken: {
      type: String,
      default: null,
      select: false,
    },
    passwordResetExpiry: {
      type: Date,
      default: null,
      select: false,
    },
    lastLogin: {
      type: Date,
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    blockReason: {
      type: String,
      default: null,
    },
    subscription: {
      plan: {
        type: String,
        enum: ["free", "bronze", "silver", "gold"],
        default: "free",
      },
      status: {
        type: String,
        enum: ["active", "cancelled", "expired", "past_due", "trialing"],
        default: "active",
      },
      startDate: {
        type: Date,
        default: null,
      },
      expiresAt: {
        type: Date,
        default: null,
      },
      currentPeriodStart: {
        type: Date,
        default: null,
      },
      currentPeriodEnd: {
        type: Date,
        default: null,
      },
      cancelAtPeriodEnd: {
        type: Boolean,
        default: false,
      },
      canceledAt: {
        type: Date,
        default: null,
      },
      isActive: {
        type: Boolean,
        default: true,
      },
      // Stripe Integration
      stripeCustomerId: {
        type: String,
        default: null,
        select: false,
      },
      stripeSubscriptionId: {
        type: String,
        default: null,
        select: false,
      },
      stripePriceId: {
        type: String,
        default: null,
      },
      // MercadoPago Integration
      mercadoPagoCustomerId: {
        type: String,
        default: null,
        select: false,
      },
      mercadoPagoSubscriptionId: {
        type: String,
        default: null,
        select: false,
      },
      mercadoPagoPreferenceId: {
        type: String,
        default: null,
      },
    },
    paymentHistory: [
      {
        paymentId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Payment",
        },
        amount: Number,
        date: {
          type: Date,
          default: Date.now,
        },
        status: String,
        gateway: {
          type: String,
          enum: ["stripe", "mercadopago"],
        },
      },
    ],
  },
  {
    collection: "usuários",
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        delete ret.password;
        delete ret.emailVerificationToken;
        delete ret.passwordResetToken;
        delete ret.twoFactorSecret;
        return ret;
      },
    },
  }
);

// Índices para performance (removidos duplicados de campos unique)
// userSchema.index({ username: 1 }); // Já é unique no schema
userSchema.index({ createdAt: -1 });
userSchema.index({ level: -1, score: -1 }); // Para leaderboards

// Hash de senha antes de salvar
userSchema.pre("save", async function preHashPassword(next) {
  if (!this.isModified("password")) {
    return next();
  }

  try {
    const salt = await bcryptjs.genSalt(10);
    this.password = await bcryptjs.hash(this.password, salt);
    return next();
  } catch (err) {
    return next(err);
  }
});

// Método para comparar senhas
userSchema.methods.comparePassword = async function comparePassword(
  candidatePassword
) {
  try {
    return await bcryptjs.compare(candidatePassword, this.password);
  } catch (err) {
    throw new Error(`Erro ao comparar senhas: ${err.message}`);
  }
};

// Método para atualizar XP
userSchema.methods.addExperience = function addExperience(amount) {
  this.experience += amount;
  // Calcular novo level baseado em XP (100 XP por level)
  const newLevel = Math.floor(this.experience / 100) + 1;
  if (newLevel > this.level) {
    this.level = newLevel;
  }
  return this;
};

// ===== MÉTODOS DE ASSINATURA E PAGAMENTO =====

// Verificar se usuário é Premium
userSchema.methods.isPremium = function isPremium() {
  return (
    this.subscription.plan !== "free" &&
    this.subscription.status === "active" &&
    (!this.subscription.currentPeriodEnd ||
      new Date() < this.subscription.currentPeriodEnd)
  );
};

// Verificar se plano específico está ativo
userSchema.methods.hasPlan = function hasPlan(planName) {
  return this.subscription.plan === planName && this.isPremium();
};

// Verificar se assinatura expirou
userSchema.methods.isSubscriptionExpired = function isSubscriptionExpired() {
  if (this.subscription.plan === "free") return false;
  if (!this.subscription.currentPeriodEnd) return false;
  return new Date() > this.subscription.currentPeriodEnd;
};

// Ativar plano Premium
userSchema.methods.activatePremium = function activatePremium(planData) {
  this.subscription.plan = planData.plan;
  this.subscription.status = planData.status || "active";
  this.subscription.currentPeriodStart =
    planData.currentPeriodStart || new Date();
  this.subscription.currentPeriodEnd = planData.currentPeriodEnd;
  this.subscription.isActive = true;

  // Stripe
  if (planData.stripeCustomerId) {
    this.subscription.stripeCustomerId = planData.stripeCustomerId;
  }
  if (planData.stripeSubscriptionId) {
    this.subscription.stripeSubscriptionId = planData.stripeSubscriptionId;
  }
  if (planData.stripePriceId) {
    this.subscription.stripePriceId = planData.stripePriceId;
  }

  // MercadoPago
  if (planData.mercadoPagoCustomerId) {
    this.subscription.mercadoPagoCustomerId = planData.mercadoPagoCustomerId;
  }
  if (planData.mercadoPagoSubscriptionId) {
    this.subscription.mercadoPagoSubscriptionId =
      planData.mercadoPagoSubscriptionId;
  }

  return this.save();
};

// Cancelar assinatura
userSchema.methods.cancelSubscription = function cancelSubscription(
  immediate = false
) {
  if (immediate) {
    this.subscription.status = "cancelled";
    this.subscription.canceledAt = new Date();
    this.subscription.currentPeriodEnd = new Date();
    this.subscription.isActive = false;
  } else {
    this.subscription.cancelAtPeriodEnd = true;
    this.subscription.canceledAt = new Date();
  }

  return this.save();
};

// Reativar assinatura
userSchema.methods.reactivateSubscription = function reactivateSubscription() {
  this.subscription.cancelAtPeriodEnd = false;
  this.subscription.canceledAt = null;
  this.subscription.status = "active";

  return this.save();
};

// Expirar assinatura (chamado por cron job)
userSchema.methods.expireSubscription = function expireSubscription() {
  this.subscription.status = "expired";
  this.subscription.isActive = false;

  return this.save();
};

// Adicionar coins
userSchema.methods.addCoins = function addCoins(amount) {
  this.coins = (this.coins || 0) + amount;
  return this.save();
};

// Adicionar registro de pagamento
userSchema.methods.addPaymentHistory = function addPaymentHistory(paymentData) {
  if (!this.paymentHistory) {
    this.paymentHistory = [];
  }

  this.paymentHistory.push({
    paymentId: paymentData.paymentId,
    amount: paymentData.amount,
    status: paymentData.status,
    gateway: paymentData.gateway,
    date: new Date(),
  });

  return this.save();
};

// Remover senha antes de serializar
userSchema.methods.toJSON = function toJSON() {
  /* eslint-disable no-unused-vars */
  const {
    password,
    emailVerificationToken,
    passwordResetToken,
    twoFactorSecret,
    ...userWithoutPassword
  } = this.toObject();
  return userWithoutPassword;
};

module.exports = mongoose.model("User", userSchema);
