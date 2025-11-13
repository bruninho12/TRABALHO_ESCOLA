const mongoose = require("mongoose");

const budgetSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    month: {
      type: Number,
      required: true,
      min: 1,
      max: 12,
    },
    year: {
      type: Number,
      required: true,
      min: 2000,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    collection: "orçamentos",
    timestamps: true,
  }
);

// Índices para melhorar a performance
budgetSchema.index({ user: 1, month: 1, year: 1 });
budgetSchema.index({ user: 1, category: 1 });

// Impedir que um usuário tenha mais de um orçamento para a mesma categoria no mesmo mês/ano
budgetSchema.index(
  { user: 1, category: 1, month: 1, year: 1 },
  { unique: true }
);

module.exports =
  mongoose.models.Budget || mongoose.model("Budget", budgetSchema);
