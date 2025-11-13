const mongoose = require("mongoose");

const AchievementSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Identificação
    name: {
      type: String,
      required: true,
      unique: true,
    },

    description: {
      type: String,
      required: true,
    },

    icon: {
      type: String,
      default: "🏆",
    },

    // Categoria
    category: {
      type: String,
      enum: [
        "combat", // Batalhas
        "progression", // Level/Exp
        "economy", // Ouro/Recursos
        "social", // Interação
        "milestone", // Marcos especiais
        "challenge", // Desafios
        "rare", // Raros
      ],
      required: true,
    },

    rarity: {
      type: String,
      enum: ["Common", "Uncommon", "Rare", "Epic", "Legendary"],
      default: "Common",
    },

    // Requisitos
    requirement: {
      type: String,
      description: "Descrição do que é preciso fazer",
    },

    // Rewards (quando unlock)
    rewards: {
      experience: { type: Number, default: 0 },
      gold: { type: Number, default: 0 },
      badge: {
        type: String,
        default: null,
      },
    },

    // Status do Usuário
    unlockedAt: {
      type: Date,
      default: null,
    },

    isUnlocked: {
      type: Boolean,
      default: false,
    },

    progress: {
      current: { type: Number, default: 0 },
      target: { type: Number, default: 1 },
    },

    // Timestamps
    createdAt: {
      type: Date,
      default: Date.now,
    },

    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    collection: "conquistas",
    timestamps: true,
  }
);

// Índices
AchievementSchema.index({ userId: 1 });
AchievementSchema.index({ name: 1 });
AchievementSchema.index({ category: 1 });
AchievementSchema.index({ isUnlocked: 1 });
AchievementSchema.index({ rarity: 1 });

// Métodos de instância
AchievementSchema.methods.unlock = function () {
  if (!this.isUnlocked) {
    this.isUnlocked = true;
    this.unlockedAt = new Date();
    this.progress.current = this.progress.target;
  }
  return this;
};

AchievementSchema.methods.incrementProgress = function (amount = 1) {
  this.progress.current += amount;

  if (this.progress.current >= this.progress.target) {
    this.unlock();
  }

  return this.progress;
};

AchievementSchema.methods.getProgress = function () {
  return Math.min(
    100,
    Math.round((this.progress.current / this.progress.target) * 100)
  );
};

AchievementSchema.methods.toDTO = function () {
  return {
    _id: this._id,
    name: this.name,
    description: this.description,
    icon: this.icon,
    category: this.category,
    rarity: this.rarity,
    isUnlocked: this.isUnlocked,
    unlockedAt: this.unlockedAt,
    progress: this.progress,
    progressPercent: this.getProgress(),
    rewards: this.rewards,
  };
};

module.exports = mongoose.model("Achievement", AchievementSchema);

// Predefined achievements templates
const ACHIEVEMENT_TEMPLATES = {
  // Combat Achievements
  FIRST_VICTORY: {
    name: "First Blood",
    description: "Win your first battle",
    icon: "⚔️",
    category: "combat",
    rarity: "Common",
    rewards: { experience: 50, gold: 0 },
    requirement: "Win 1 battle",
  },

  TEN_VICTORIES: {
    name: "Warrior",
    description: "Win 10 battles",
    icon: "🗡️",
    category: "combat",
    rarity: "Uncommon",
    rewards: { experience: 200, gold: 50 },
    requirement: "Win 10 battles",
  },

  HUNDRED_VICTORIES: {
    name: "Legend",
    description: "Win 100 battles",
    icon: "👑",
    category: "combat",
    rarity: "Rare",
    rewards: { experience: 1000, gold: 500 },
    requirement: "Win 100 battles",
  },

  WIN_STREAK_5: {
    name: "On Fire",
    description: "Win 5 battles in a row",
    icon: "🔥",
    category: "combat",
    rarity: "Rare",
    rewards: { experience: 300, gold: 200 },
    requirement: "Win 5 consecutive battles",
  },

  // Progression Achievements
  LEVEL_10: {
    name: "Novice",
    description: "Reach level 10",
    icon: "📈",
    category: "progression",
    rarity: "Common",
    rewards: { experience: 100, gold: 50 },
    requirement: "Reach level 10",
  },

  LEVEL_25: {
    name: "Seasoned",
    description: "Reach level 25",
    icon: "📈",
    category: "progression",
    rarity: "Uncommon",
    rewards: { experience: 300, gold: 150 },
    requirement: "Reach level 25",
  },

  LEVEL_50: {
    name: "Master",
    description: "Reach maximum level (50)",
    icon: "👨‍🎓",
    category: "progression",
    rarity: "Epic",
    rewards: { experience: 5000, gold: 1000 },
    requirement: "Reach level 50",
  },

  // Economy Achievements
  RICH_1000_GOLD: {
    name: "Rich",
    description: "Accumulate 1000 gold",
    icon: "💰",
    category: "economy",
    rarity: "Common",
    rewards: { experience: 100, gold: 0 },
    requirement: "Earn 1000 gold",
  },

  WEALTHY_10000_GOLD: {
    name: "Wealthy",
    description: "Accumulate 10000 gold",
    icon: "💵",
    category: "economy",
    rarity: "Uncommon",
    rewards: { experience: 300, gold: 0 },
    requirement: "Earn 10000 gold",
  },

  // Milestone Achievements
  ALL_CITIES_UNLOCKED: {
    name: "World Explorer",
    description: "Unlock all 10 cities",
    icon: "🗺️",
    category: "milestone",
    rarity: "Epic",
    rewards: { experience: 2000, gold: 500 },
    requirement: "Unlock all cities",
  },

  // Special
  FIRST_MONTH: {
    name: "Committed",
    description: "Play for 30 consecutive days",
    icon: "📅",
    category: "challenge",
    rarity: "Rare",
    rewards: { experience: 500, gold: 200 },
    requirement: "Play 30 days",
  },
};

module.exports.ACHIEVEMENT_TEMPLATES = ACHIEVEMENT_TEMPLATES;
