/**
 * @fileoverview Modelo de Transação Recorrente
 * Gerencia transações que se repetem automaticamente
 */

const mongoose = require("mongoose");

const recurringTransactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Dados da transação base
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 255,
    },

    amount: {
      type: Number,
      required: true,
      min: 0.01,
    },

    type: {
      type: String,
      required: true,
      enum: ["income", "expense"],
      default: "expense",
    },

    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    paymentMethod: {
      type: String,
      maxlength: 50,
    },

    notes: {
      type: String,
      maxlength: 500,
    },

    // Configurações de recorrência
    frequency: {
      type: String,
      required: true,
      enum: [
        "daily",
        "weekly",
        "biweekly",
        "monthly",
        "bimonthly",
        "quarterly",
        "yearly",
      ],
      default: "monthly",
    },

    // Dia do mês (1-31) ou dia da semana (0-6) dependendo da frequência
    dayOfMonth: {
      type: Number,
      min: 1,
      max: 31,
    },

    dayOfWeek: {
      type: Number,
      min: 0,
      max: 6,
    },

    // Data de início
    startDate: {
      type: Date,
      required: true,
      default: Date.now,
    },

    // Data de término (opcional - null = indefinido)
    endDate: {
      type: Date,
      default: null,
    },

    // Próxima execução agendada
    nextExecutionDate: {
      type: Date,
      required: true,
    },

    // Última execução
    lastExecutionDate: {
      type: Date,
    },

    // Status
    status: {
      type: String,
      enum: ["active", "paused", "completed", "cancelled"],
      default: "active",
    },

    // Contador de execuções
    executionCount: {
      type: Number,
      default: 0,
    },

    // Limite de execuções (opcional)
    maxExecutions: {
      type: Number,
      default: null,
    },

    // Histórico de transações criadas
    generatedTransactions: [
      {
        transactionId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Transaction",
        },
        executedAt: {
          type: Date,
          default: Date.now,
        },
        status: {
          type: String,
          enum: ["success", "failed", "skipped"],
          default: "success",
        },
        errorMessage: String,
      },
    ],

    // Configurações avançadas
    autoAdjustAmount: {
      type: Boolean,
      default: false,
    },

    adjustmentPercentage: {
      type: Number,
      default: 0,
    },

    notifyBeforeExecution: {
      type: Boolean,
      default: true,
    },

    notificationDaysBefore: {
      type: Number,
      default: 1,
    },

    skipWeekends: {
      type: Boolean,
      default: false,
    },

    skipHolidays: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Índices compostos
recurringTransactionSchema.index({ userId: 1, status: 1 });
recurringTransactionSchema.index({ nextExecutionDate: 1, status: 1 });
recurringTransactionSchema.index({ userId: 1, frequency: 1 });

// Virtual: Verifica se está ativo
recurringTransactionSchema.virtual("isActive").get(function () {
  return this.status === "active";
});

// Virtual: Verifica se expirou
recurringTransactionSchema.virtual("hasExpired").get(function () {
  if (!this.endDate) return false;
  return new Date() > this.endDate;
});

// Virtual: Verifica se atingiu limite de execuções
recurringTransactionSchema.virtual("hasReachedLimit").get(function () {
  if (!this.maxExecutions) return false;
  return this.executionCount >= this.maxExecutions;
});

// Virtual: Próxima execução em dias
recurringTransactionSchema.virtual("daysUntilNext").get(function () {
  const diff = this.nextExecutionDate - new Date();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
});

// Métodos de instância

/**
 * Calcula a próxima data de execução
 */
recurringTransactionSchema.methods.calculateNextExecution = function () {
  const current = this.nextExecutionDate || this.startDate;
  let next = new Date(current);

  switch (this.frequency) {
    case "daily":
      next.setDate(next.getDate() + 1);
      break;

    case "weekly":
      next.setDate(next.getDate() + 7);
      break;

    case "biweekly":
      next.setDate(next.getDate() + 14);
      break;

    case "monthly":
      next.setMonth(next.getMonth() + 1);
      // Ajustar para o dia do mês correto
      if (this.dayOfMonth) {
        next.setDate(Math.min(this.dayOfMonth, this.getDaysInMonth(next)));
      }
      break;

    case "bimonthly":
      next.setMonth(next.getMonth() + 2);
      if (this.dayOfMonth) {
        next.setDate(Math.min(this.dayOfMonth, this.getDaysInMonth(next)));
      }
      break;

    case "quarterly":
      next.setMonth(next.getMonth() + 3);
      if (this.dayOfMonth) {
        next.setDate(Math.min(this.dayOfMonth, this.getDaysInMonth(next)));
      }
      break;

    case "yearly":
      next.setFullYear(next.getFullYear() + 1);
      break;
  }

  // Pular fins de semana se configurado
  if (this.skipWeekends) {
    next = this.adjustForWeekend(next);
  }

  return next;
};

/**
 * Obtém número de dias no mês
 */
recurringTransactionSchema.methods.getDaysInMonth = function (date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
};

/**
 * Ajusta data para dia útil se cair no fim de semana
 */
recurringTransactionSchema.methods.adjustForWeekend = function (date) {
  const day = date.getDay();

  // Sábado (6) -> Segunda (adiciona 2 dias)
  if (day === 6) {
    date.setDate(date.getDate() + 2);
  }
  // Domingo (0) -> Segunda (adiciona 1 dia)
  else if (day === 0) {
    date.setDate(date.getDate() + 1);
  }

  return date;
};

/**
 * Atualiza para próxima execução
 */
recurringTransactionSchema.methods.updateNextExecution = function () {
  this.lastExecutionDate = this.nextExecutionDate;
  this.nextExecutionDate = this.calculateNextExecution();
  this.executionCount += 1;

  // Verificar se deve completar
  if (this.hasExpired || this.hasReachedLimit) {
    this.status = "completed";
  }
};

/**
 * Pausa a recorrência
 */
recurringTransactionSchema.methods.pause = function () {
  if (this.status === "active") {
    this.status = "paused";
    return true;
  }
  return false;
};

/**
 * Retoma a recorrência
 */
recurringTransactionSchema.methods.resume = function () {
  if (this.status === "paused") {
    this.status = "active";
    // Recalcular próxima execução se passou do prazo
    if (this.nextExecutionDate < new Date()) {
      this.nextExecutionDate = this.calculateNextExecution();
    }
    return true;
  }
  return false;
};

/**
 * Cancela a recorrência
 */
recurringTransactionSchema.methods.cancel = function () {
  if (["active", "paused"].includes(this.status)) {
    this.status = "cancelled";
    return true;
  }
  return false;
};

/**
 * Registra execução bem-sucedida
 */
recurringTransactionSchema.methods.recordExecution = function (transactionId) {
  this.generatedTransactions.push({
    transactionId,
    executedAt: new Date(),
    status: "success",
  });
  this.updateNextExecution();
};

/**
 * Registra falha na execução
 */
recurringTransactionSchema.methods.recordFailure = function (errorMessage) {
  this.generatedTransactions.push({
    executedAt: new Date(),
    status: "failed",
    errorMessage,
  });
};

/**
 * Calcula valor com ajuste (se configurado)
 */
recurringTransactionSchema.methods.getAdjustedAmount = function () {
  if (!this.autoAdjustAmount || !this.adjustmentPercentage) {
    return this.amount;
  }

  const adjustment = this.amount * (this.adjustmentPercentage / 100);
  return this.amount + adjustment;
};

// Métodos estáticos

/**
 * Busca transações prontas para executar
 */
recurringTransactionSchema.statics.findDueTransactions = function () {
  return this.find({
    status: "active",
    nextExecutionDate: { $lte: new Date() },
  })
    .populate("userId", "email name")
    .populate("categoryId", "name type");
};

/**
 * Busca transações que precisam de notificação
 */
recurringTransactionSchema.statics.findPendingNotifications = function () {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);

  return this.find({
    status: "active",
    notifyBeforeExecution: true,
    nextExecutionDate: {
      $gte: tomorrow,
      $lt: new Date(tomorrow.getTime() + 24 * 60 * 60 * 1000),
    },
  });
};

/**
 * Estatísticas de recorrências de um usuário
 */
recurringTransactionSchema.statics.getUserStats = async function (userId) {
  const stats = await this.aggregate([
    { $match: { userId: new mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
        totalAmount: { $sum: "$amount" },
      },
    },
  ]);

  return stats.reduce((acc, item) => {
    acc[item._id] = {
      count: item.count,
      totalAmount: item.totalAmount,
    };
    return acc;
  }, {});
};

// Middleware pre-save
recurringTransactionSchema.pre("save", function (next) {
  // Calcular próxima execução se for novo
  if (this.isNew && !this.nextExecutionDate) {
    this.nextExecutionDate = this.startDate || new Date();
  }

  // Definir dayOfMonth se frequência for mensal e não estiver definido
  if (
    ["monthly", "bimonthly", "quarterly"].includes(this.frequency) &&
    !this.dayOfMonth
  ) {
    this.dayOfMonth = this.startDate.getDate();
  }

  next();
});

const RecurringTransaction = mongoose.model(
  "RecurringTransaction",
  recurringTransactionSchema
);

module.exports = RecurringTransaction;
