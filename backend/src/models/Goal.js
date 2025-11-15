const mongoose = require("mongoose");

const goalSchema = new mongoose.Schema(
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
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    category: {
      type: String,
      enum: [
        "emergency",
        "savings",
        "investment",
        "purchase",
        "travel",
        "education",
        "home",
        "other",
      ],
      default: "savings",
    },
    targetAmount: {
      type: Number,
      required: true,
      min: [0, "Valor alvo deve ser maior que 0"],
    },
    currentAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    currency: {
      type: String,
      default: "BRL",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      default: "medium",
    },
    status: {
      type: String,
      enum: ["active", "paused", "completed", "cancelled"],
      default: "active",
    },
    deadline: {
      type: Date,
      required: true,
    },
    completionDate: {
      type: Date,
      default: null,
    },
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    contributions: [
      {
        date: {
          type: Date,
          default: Date.now,
        },
        amount: Number,
        description: String,
      },
    ],
    milestones: [
      {
        name: String,
        targetAmount: Number,
        achieved: {
          type: Boolean,
          default: false,
        },
        achievedAt: Date,
      },
    ],
    rewards: {
      onCompletion: Number, // XP dado ao completar
      onMilestone: Number, // XP por milestone
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
    tags: [String],
  },
  {
    collection: "objetivos",
    timestamps: true,
  }
);

// Índices para performance
goalSchema.index({ userId: 1, status: 1 });
goalSchema.index({ userId: 1, deadline: 1 });
goalSchema.index({ userId: 1, priority: -1 });
goalSchema.index({ deadline: 1 });

// Virtual para calcular progresso automático
goalSchema.virtual("progressPercentage").get(function getProgress() {
  if (this.targetAmount === 0) return 0;
  return Math.round((this.currentAmount / this.targetAmount) * 100);
});

// Middleware para atualizar progresso
goalSchema.pre("save", function preSave() {
  this.progress = this.progressPercentage;
});

// Método para adicionar contribuição
goalSchema.methods.addContribution = function addContribution(
  amount,
  description
) {
  this.contributions.push({
    date: new Date(),
    amount,
    description,
  });
  this.currentAmount += amount;

  // Verificar milestones
  if (this.milestones && this.milestones.length > 0) {
    this.milestones.forEach((milestone) => {
      if (!milestone.achieved && this.currentAmount >= milestone.targetAmount) {
        milestone.achieved = true;
        milestone.achievedAt = new Date();
      }
    });
  }

  // Verificar se completou
  if (this.currentAmount >= this.targetAmount && this.status === "active") {
    this.status = "completed";
    this.completionDate = new Date();
  }

  return this;
};

// Método para calcular dias restantes
goalSchema.methods.daysRemaining = function daysRemaining() {
  const now = new Date();
  const diff = this.deadline - now;
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

module.exports = mongoose.model("Goal", goalSchema);
