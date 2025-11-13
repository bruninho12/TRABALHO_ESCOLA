const mongoose = require("mongoose");

const BattleSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    avatarId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Avatar",
      required: true,
    },

    // Informações do Inimigo
    enemy: {
      type: {
        type: String,
        enum: ["Pizza", "Dívida", "Juro", "Imposto", "Emergência"],
        required: true,
      },
      name: String,
      healthMax: Number,
      health: Number,
      difficulty: {
        type: String,
        enum: ["Fácil", "Médio", "Difícil", "Épico"],
        default: "Médio",
      },
    },

    // Recompensas
    rewards: {
      experienceGained: { type: Number, default: 0 },
      goldGained: { type: Number, default: 0 },
      itemsGained: [{ type: mongoose.Schema.Types.ObjectId, ref: "Item" }],
      achievementUnlocked: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Achievement",
        default: null,
      },
    },

    // Turno a Turno
    battleLog: [
      {
        turn: Number,
        action: {
          type: String,
          enum: ["attack", "defend", "special", "heal", "enemy_attack"],
          required: true,
        },
        actor: {
          type: String,
          enum: ["player", "enemy"],
          required: true,
        },
        damage: Number,
        healing: Number,
        description: String,
        timestamp: { type: Date, default: Date.now },
      },
    ],

    // Resultado
    result: {
      type: String,
      enum: ["won", "lost", "fled"],
      default: null,
    },

    // Estatísticas da Batalha
    stats: {
      totalTurns: { type: Number, default: 0 },
      playerDamageDealt: { type: Number, default: 0 },
      playerDamageTaken: { type: Number, default: 0 },
      playerHealing: { type: Number, default: 0 },
      enemyDamageDealt: { type: Number, default: 0 },
      specialAbilitiesUsed: { type: Number, default: 0 },
      criticalHits: { type: Number, default: 0 },
    },

    // Relacionado a Transação Real
    relatedTransaction: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Transaction",
      default: null,
    },

    relatedGoal: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Goal",
      default: null,
    },

    // Timestamps
    startedAt: {
      type: Date,
      default: Date.now,
    },

    endedAt: {
      type: Date,
      default: null,
    },

    durationSeconds: {
      type: Number,
      default: 0,
    },
  },
  {
    collection: "batalhas",
    timestamps: true,
  }
);

// Índices
BattleSchema.index({ userId: 1 });
BattleSchema.index({ avatarId: 1 });
BattleSchema.index({ result: 1 });
BattleSchema.index({ startedAt: -1 });
BattleSchema.index({ "enemy.type": 1 });

// Métodos de instância
BattleSchema.methods.addTurnLog = function (
  turn,
  action,
  actor,
  damage = 0,
  healing = 0,
  description = ""
) {
  this.battleLog.push({
    turn,
    action,
    actor,
    damage,
    healing,
    description,
    timestamp: new Date(),
  });

  this.stats.totalTurns = turn;

  // Update stats
  if (actor === "player") {
    if (action === "attack") this.stats.playerDamageDealt += damage;
    if (action === "heal") this.stats.playerHealing += healing;
    if (action === "special") {
      this.stats.specialAbilitiesUsed += 1;
      this.stats.playerDamageDealt += damage;
    }
    if (action === "enemy_attack") {
      this.stats.playerDamageTaken += damage;
    }
  } else {
    if (action === "attack") {
      this.stats.enemyDamageDealt += damage;
    }
  }

  return this;
};

BattleSchema.methods.finishBattle = function (
  result,
  experienceGained,
  goldGained
) {
  this.result = result;
  this.endedAt = new Date();
  this.durationSeconds = Math.round((this.endedAt - this.startedAt) / 1000);

  this.rewards.experienceGained = experienceGained;
  this.rewards.goldGained = goldGained;

  return this;
};

BattleSchema.methods.recordCriticalHit = function () {
  this.stats.criticalHits += 1;
  return this.stats.criticalHits;
};

BattleSchema.methods.toDTO = function () {
  return {
    _id: this._id,
    avatarId: this.avatarId,
    enemy: this.enemy,
    result: this.result,
    rewards: this.rewards,
    stats: this.stats,
    battleLog: this.battleLog.slice(-20), // Last 20 turns
    durationSeconds: this.durationSeconds,
    startedAt: this.startedAt,
    endedAt: this.endedAt,
  };
};

BattleSchema.methods.toDetailedDTO = function () {
  return {
    _id: this._id,
    avatarId: this.avatarId,
    enemy: this.enemy,
    result: this.result,
    rewards: this.rewards,
    stats: this.stats,
    battleLog: this.battleLog,
    durationSeconds: this.durationSeconds,
    startedAt: this.startedAt,
    endedAt: this.endedAt,
    relatedTransaction: this.relatedTransaction,
    relatedGoal: this.relatedGoal,
  };
};

module.exports = mongoose.model("Battle", BattleSchema);
