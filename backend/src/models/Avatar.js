const mongoose = require("mongoose");

const AvatarSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    // Informações Básicas
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },

    characterClass: {
      type: String,
      enum: ["Knight", "Mage", "Rogue", "Paladin"],
      required: true,
    },

    // Progression
    level: {
      type: Number,
      default: 1,
      min: 1,
      max: 50,
    },

    experience: {
      type: Number,
      default: 0,
      min: 0,
    },

    experienceNeeded: {
      type: Number,
      default: 100, // XP para próximo level
    },

    // Stats Principais
    stats: {
      health: { type: Number, default: 100 },
      maxHealth: { type: Number, default: 100 },
      mana: { type: Number, default: 50 },
      maxMana: { type: Number, default: 50 },
      strength: { type: Number, default: 10 },
      intelligence: { type: Number, default: 10 },
      wisdom: { type: Number, default: 10 },
      dexterity: { type: Number, default: 10 },
      constitution: { type: Number, default: 10 },
    },

    // Recursos do Jogo
    gold: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Progression do Mapa
    currentCity: {
      type: Number,
      default: 1,
      min: 1,
      max: 10,
    },

    citiesUnlocked: {
      type: [Number],
      default: [1],
    },

    // Batalhas
    battlesWon: {
      type: Number,
      default: 0,
    },

    battlesLost: {
      type: Number,
      default: 0,
    },

    battleStreak: {
      type: Number,
      default: 0,
    },

    // Equipamento
    equipment: {
      head: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Item",
        default: null,
      },
      chest: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Item",
        default: null,
      },
      legs: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Item",
        default: null,
      },
      feet: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Item",
        default: null,
      },
      hands: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Item",
        default: null,
      },
      mainHand: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Item",
        default: null,
      },
      offHand: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Item",
        default: null,
      },
    },

    // Inventário
    inventory: [
      {
        itemId: { type: mongoose.Schema.Types.ObjectId, ref: "Item" },
        quantity: { type: Number, default: 1 },
      },
    ],

    // Habilidades
    abilities: [
      {
        abilityId: { type: mongoose.Schema.Types.ObjectId, ref: "Ability" },
        level: { type: Number, default: 1 },
      },
    ],

    // Achievements
    achievements: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Achievement",
      },
    ],

    // Timestamps
    createdAt: {
      type: Date,
      default: Date.now,
    },

    updatedAt: {
      type: Date,
      default: Date.now,
    },

    lastBattleAt: {
      type: Date,
      default: null,
    },

    // Status do Avatar
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    collection: "avatares",
    timestamps: true,
  }
);

// Índices para performance
AvatarSchema.index({ userId: 1 });
AvatarSchema.index({ level: 1 });
AvatarSchema.index({ currentCity: 1 });
AvatarSchema.index({ createdAt: -1 });

// Métodos virtuais
AvatarSchema.virtual("totalBattles").get(function () {
  return this.battlesWon + this.battlesLost;
});

AvatarSchema.virtual("winRate").get(function () {
  const total = this.totalBattles;
  return total > 0 ? Math.round((this.battlesWon / total) * 100) : 0;
});

AvatarSchema.virtual("experiencePercent").get(function () {
  return Math.round((this.experience / this.experienceNeeded) * 100);
});

// Métodos de instância
AvatarSchema.methods.gainExperience = function (amount) {
  this.experience += amount;

  // Check level up
  while (this.experience >= this.experienceNeeded) {
    this.levelUp();
  }

  return this;
};

AvatarSchema.methods.levelUp = function () {
  this.level += 1;
  this.experience = 0;
  this.experienceNeeded = Math.ceil(this.experienceNeeded * 1.1); // 10% mais XP para próximo

  // Aumenta stats ao subir de level
  this.stats.maxHealth += 5;
  this.stats.health = this.stats.maxHealth;
  this.stats.maxMana += 3;
  this.stats.mana = this.stats.maxMana;
  this.stats.strength += 1;
  this.stats.intelligence += 1;
  this.stats.wisdom += 1;

  return this;
};

AvatarSchema.methods.takeDamage = function (amount) {
  this.stats.health = Math.max(0, this.stats.health - amount);
  return this.stats.health;
};

AvatarSchema.methods.heal = function (amount) {
  this.stats.health = Math.min(
    this.stats.maxHealth,
    this.stats.health + amount
  );
  return this.stats.health;
};

AvatarSchema.methods.addGold = function (amount) {
  this.gold += amount;
  return this.gold;
};

AvatarSchema.methods.removeGold = function (amount) {
  if (this.gold >= amount) {
    this.gold -= amount;
    return true;
  }
  return false;
};

AvatarSchema.methods.unlockCity = function (cityNumber) {
  if (cityNumber > this.currentCity + 1) {
    throw new Error("Você deve desbloquear cidades em ordem");
  }

  if (!this.citiesUnlocked.includes(cityNumber)) {
    this.citiesUnlocked.push(cityNumber);
    this.citiesUnlocked.sort();
  }

  return this.citiesUnlocked;
};

AvatarSchema.methods.moveToCity = function (cityNumber) {
  if (!this.citiesUnlocked.includes(cityNumber)) {
    throw new Error("Você não desbloqueou esta cidade ainda");
  }

  this.currentCity = cityNumber;
  return this.currentCity;
};

AvatarSchema.methods.recordBattle = function (won, xpGained, goldGained) {
  if (won) {
    this.battlesWon += 1;
    this.battleStreak += 1;
  } else {
    this.battlesLost += 1;
    this.battleStreak = 0;
  }

  this.lastBattleAt = new Date();

  if (xpGained) {
    this.gainExperience(xpGained);
  }

  if (goldGained) {
    this.addGold(goldGained);
  }

  return {
    won,
    newLevel: this.level,
    totalBattles: this.totalBattles,
    currentStreak: this.battleStreak,
  };
};

AvatarSchema.methods.toDTO = function () {
  return {
    _id: this._id,
    userId: this.userId,
    name: this.name,
    characterClass: this.characterClass,
    level: this.level,
    experience: this.experience,
    experiencePercent: this.experiencePercent,
    stats: this.stats,
    gold: this.gold,
    currentCity: this.currentCity,
    citiesUnlocked: this.citiesUnlocked,
    battlesWon: this.battlesWon,
    battlesLost: this.battlesLost,
    winRate: this.winRate,
    battleStreak: this.battleStreak,
    achievements: this.achievements,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

module.exports = mongoose.model("Avatar", AvatarSchema);
