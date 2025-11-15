const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      default: () => new mongoose.Types.ObjectId().toString(),
      unique: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["income", "expense", "transfer"],
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: [0, "Valor deve ser maior que 0"],
    },
    currency: {
      type: String,
      default: "BRL",
    },
    description: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["pending", "completed", "failed", "cancelled"],
      default: "completed",
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    attachments: [
      {
        url: String,
        filename: String,
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    relatedGoalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Goal",
      default: null,
    },
    metadata: {
      paymentMethod: String,
      referenceId: String,
    },
  },
  {
    collection: "despesas",
    timestamps: true,
  }
);

// Índices para performance e queries comuns
transactionSchema.index({ userId: 1, date: -1 });
transactionSchema.index({ userId: 1, type: 1 });
transactionSchema.index({ userId: 1, category: 1 });
transactionSchema.index({ date: -1 });

// Middleware para atualizar score do usuário quando uma transação é registrada
transactionSchema.post("save", async function postSave(doc) {
  try {
    const User = require("./User");
    const user = await User.findById(doc.userId);
    if (user) {
      if (doc.type === "expense") {
        user.score += 1; // +1 ponto por despesa registrada
        user.experience += 5; // +5 XP
      } else if (doc.type === "income") {
        user.score += 2; // +2 pontos por renda registrada
        user.experience += 10; // +10 XP
      }
      await user.save();
    }
  } catch (err) {
    const logger = require("../utils/logger");
    logger.error("Erro ao atualizar score do usuário:", err);
  }
});

module.exports = mongoose.model("Transaction", transactionSchema);
