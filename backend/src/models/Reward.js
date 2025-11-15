const mongoose = require("mongoose");

const rewardSchema = new mongoose.Schema(
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
      enum: ["achievement", "level_up", "goal_completed", "streak", "bonus"],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      trim: true,
    },
    icon: String, // URL ou identificador do ícone
    xpReward: {
      type: Number,
      default: 0,
    },
    coinsReward: {
      type: Number,
      default: 0,
    },
    badge: {
      name: String,
      rarity: {
        type: String,
        enum: ["common", "uncommon", "rare", "epic", "legendary"],
        default: "common",
      },
    },
    criteria: {
      type: String, // Descrição técnica do critério
      trim: true,
    },
    unlockedAt: {
      type: Date,
      default: Date.now,
    },
    progress: {
      current: {
        type: Number,
        default: 0,
      },
      target: Number,
    },
    isHidden: {
      type: Boolean,
      default: false,
    },
  },
  {
    collection: "recompensas",
    timestamps: true,
  }
);

// Índices
rewardSchema.index({ userId: 1, unlockedAt: -1 });
rewardSchema.index({ type: 1 });

// Tipos de conquistas pré-definidas
const ACHIEVEMENT_TYPES = {
  FIRST_TRANSACTION: {
    title: "Primeira Transação",
    description: "Registre sua primeira transação",
    xpReward: 50,
    coinsReward: 10,
    badge: { name: "Iniciante", rarity: "common" },
  },
  FIRST_GOAL: {
    title: "Primeiro Objetivo",
    description: "Crie seu primeiro objetivo financeiro",
    xpReward: 100,
    coinsReward: 25,
    badge: { name: "Planejador", rarity: "common" },
  },
  GOAL_COMPLETED: {
    title: "Meta Alcançada",
    description: "Complete um objetivo financeiro",
    xpReward: 500,
    coinsReward: 100,
    badge: { name: "Realizador", rarity: "rare" },
  },
  STREAK_7_DAYS: {
    title: "Semana Ativa",
    description: "Registre transações por 7 dias seguidos",
    xpReward: 200,
    coinsReward: 50,
    badge: { name: "Consistente", rarity: "uncommon" },
  },
  STREAK_30_DAYS: {
    title: "Mês Ativo",
    description: "Registre transações por 30 dias seguidos",
    xpReward: 1000,
    coinsReward: 250,
    badge: { name: "Dedicado", rarity: "epic" },
  },
  LEVEL_5: {
    title: "Nível 5",
    description: "Alcance o nível 5",
    xpReward: 300,
    coinsReward: 75,
    badge: { name: "Experiente", rarity: "uncommon" },
  },
  LEVEL_10: {
    title: "Nível 10",
    description: "Alcance o nível 10",
    xpReward: 1000,
    coinsReward: 300,
    badge: { name: "Mestre", rarity: "epic" },
  },
  MULTIPLE_GOALS: {
    title: "Gestor de Metas",
    description: "Tenha 5 objetivos ativos simultaneamente",
    xpReward: 250,
    coinsReward: 60,
    badge: { name: "Estrategista", rarity: "uncommon" },
  },
  BIG_SAVER: {
    title: "Poupador Grande",
    description: "Economize R$10.000 em um objetivo",
    xpReward: 500,
    coinsReward: 150,
    badge: { name: "Capitalista", rarity: "rare" },
  },
  PERFECT_MONTH: {
    title: "Mês Perfeito",
    description: "Complete todos os objetivos em um mês",
    xpReward: 1500,
    coinsReward: 500,
    badge: { name: "Perfeição", rarity: "legendary" },
  },
};

module.exports = mongoose.model("Reward", rewardSchema);
module.exports.ACHIEVEMENT_TYPES = ACHIEVEMENT_TYPES;
