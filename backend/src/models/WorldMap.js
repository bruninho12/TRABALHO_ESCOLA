const mongoose = require("mongoose");

const WorldMapSchema = new mongoose.Schema(
  {
    cityNumber: {
      type: Number,
      required: true,
      unique: true,
      min: 1,
      max: 10,
    },

    name: {
      type: String,
      required: true,
    },

    description: String,

    // Localização visual (para mapa 2D)
    position: {
      x: Number,
      y: Number,
    },

    // Dificuldade de Inimigos
    difficulty: {
      type: String,
      enum: ["Fácil", "Médio", "Difícil", "Épico"],
      default: "Médio",
    },

    levelRequirement: {
      type: Number,
      default: 1,
    },

    // Inimigos disponíveis nesta cidade
    enemies: [
      {
        type: {
          type: String,
          enum: ["Pizza", "Dívida", "Juro", "Imposto", "Emergência"],
          required: true,
        },
        name: String,
        healthMin: Number,
        healthMax: Number,
        spawnRate: { type: Number, default: 0.5 }, // 0-1
      },
    ],

    // Boss da cidade
    boss: {
      name: String,
      type: { type: String, default: "Boss" },
      health: Number,
      difficulty: { type: String, default: "Épico" },
      defeated: { type: Boolean, default: false },
    },

    // Rewards por derrotar boss
    bossRewards: {
      experience: { type: Number, default: 500 },
      gold: { type: Number, default: 200 },
      item: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Item",
        default: null,
      },
    },

    // POIs (Points of Interest)
    pointsOfInterest: [
      {
        name: String,
        type: String,
        description: String,
        position: {
          x: Number,
          y: Number,
        },
      },
    ],

    // Conexões com outras cidades
    connections: [
      {
        cityNumber: Number,
        distance: Number,
        requirement: {
          minLevel: Number,
          itemRequired: mongoose.Schema.Types.ObjectId,
        },
      },
    ],

    // Ambiente/Tema
    theme: {
      name: String,
      color: String,
      backgroundColor: String,
      music: String,
    },

    // Estatísticas
    stats: {
      totalBattles: { type: Number, default: 0 },
      totalBossesBeat: { type: Number, default: 0 },
      playersReached: { type: Number, default: 0 },
    },

    // Ativo?
    isActive: {
      type: Boolean,
      default: true,
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    collection: "mapa_mundo",
    timestamps: true,
  }
);

// Índices

WorldMapSchema.index({ difficulty: 1 });
WorldMapSchema.index({ levelRequirement: 1 });

// Métodos de instância
WorldMapSchema.methods.canPlayerAccess = function (playerLevel) {
  return playerLevel >= this.levelRequirement;
};

WorldMapSchema.methods.getRandomEnemy = function () {
  if (this.enemies.length === 0) return null;

  // Weighted random selection
  const totalSpawn = this.enemies.reduce((sum, e) => sum + e.spawnRate, 0);
  let random = Math.random() * totalSpawn;

  for (const enemy of this.enemies) {
    random -= enemy.spawnRate;
    if (random <= 0) {
      return {
        type: enemy.type,
        name: enemy.name,
        healthMax:
          enemy.healthMin + Math.random() * (enemy.healthMax - enemy.healthMin),
        difficulty: this.difficulty,
      };
    }
  }

  return this.enemies[0];
};

WorldMapSchema.methods.markBossDefeated = function () {
  this.boss.defeated = true;
  this.stats.totalBossesBeat += 1;
  return this;
};

WorldMapSchema.methods.incrementBattleCount = function () {
  this.stats.totalBattles += 1;
  return this.stats.totalBattles;
};

WorldMapSchema.methods.recordPlayerVisit = function () {
  this.stats.playersReached += 1;
  return this.stats.playersReached;
};

WorldMapSchema.methods.toDTO = function () {
  return {
    _id: this._id,
    cityNumber: this.cityNumber,
    name: this.name,
    description: this.description,
    position: this.position,
    difficulty: this.difficulty,
    levelRequirement: this.levelRequirement,
    boss: this.boss,
    theme: this.theme,
    stats: this.stats,
    pointsOfInterest: this.pointsOfInterest,
  };
};

module.exports = mongoose.model("WorldMap", WorldMapSchema);

// Cidades pré-definidas
const CITIES_TEMPLATES = {
  1: {
    cityNumber: 1,
    name: "Vilarejo da Esperança",
    description: "Seu primeiro passo para a liberdade financeira",
    position: { x: 50, y: 50 },
    difficulty: "Fácil",
    levelRequirement: 1,
    boss: {
      name: "O Pequeno Desperdício",
      health: 50,
      difficulty: "Fácil",
    },
    theme: {
      name: "green_forest",
      color: "#2ecc71",
      backgroundColor: "#27ae60",
      music: "peaceful.mp3",
    },
  },

  2: {
    cityNumber: 2,
    name: "Forja da Disciplina",
    description: "Onde a vontade é testada",
    position: { x: 100, y: 50 },
    difficulty: "Médio",
    levelRequirement: 5,
    boss: {
      name: "O Dragão da Ganância",
      health: 150,
      difficulty: "Médio",
    },
    theme: {
      name: "dark_cave",
      color: "#e74c3c",
      backgroundColor: "#c0392b",
      music: "intense.mp3",
    },
  },

  3: {
    cityNumber: 3,
    name: "Torre da Sabedoria",
    description: "Conhecimento é poder financeiro",
    position: { x: 150, y: 100 },
    difficulty: "Médio",
    levelRequirement: 10,
    boss: {
      name: "O Gênio Enganador",
      health: 200,
      difficulty: "Difícil",
    },
    theme: {
      name: "mystical_tower",
      color: "#9b59b6",
      backgroundColor: "#8e44ad",
      music: "magical.mp3",
    },
  },

  4: {
    cityNumber: 4,
    name: "Castelo da Fortuna",
    description: "Riqueza ao alcance",
    position: { x: 200, y: 50 },
    difficulty: "Difícil",
    levelRequirement: 15,
    boss: {
      name: "A Sombra da Dívida",
      health: 300,
      difficulty: "Difícil",
    },
    theme: {
      name: "gold_castle",
      color: "#f39c12",
      backgroundColor: "#d68910",
      music: "epic.mp3",
    },
  },

  5: {
    cityNumber: 5,
    name: "Santuário da Confiança",
    description: "Segurança financeira",
    position: { x: 250, y: 100 },
    difficulty: "Difícil",
    levelRequirement: 20,
    boss: {
      name: "Titã da Incerteza",
      health: 400,
      difficulty: "Épico",
    },
    theme: {
      name: "holy_sanctuary",
      color: "#3498db",
      backgroundColor: "#2980b9",
      music: "triumphant.mp3",
    },
  },

  6: {
    cityNumber: 6,
    name: "Tundra da Austeridade",
    description: "Severidade do planejamento",
    position: { x: 300, y: 50 },
    difficulty: "Épico",
    levelRequirement: 25,
    boss: {
      name: "Rei dos Gastos Desnecessários",
      health: 500,
      difficulty: "Épico",
    },
    theme: {
      name: "frozen_tundra",
      color: "#1abc9c",
      backgroundColor: "#16a085",
      music: "frozen.mp3",
    },
  },

  7: {
    cityNumber: 7,
    name: "Vulcão da Paixão",
    description: "Investimentos ardentes",
    position: { x: 350, y: 100 },
    difficulty: "Épico",
    levelRequirement: 30,
    boss: {
      name: "Dragão do Risco",
      health: 600,
      difficulty: "Épico",
    },
    theme: {
      name: "volcanic_land",
      color: "#e67e22",
      backgroundColor: "#d35400",
      music: "volcanic.mp3",
    },
  },

  8: {
    cityNumber: 8,
    name: "Cidade Flutuante",
    description: "Acima das limitações",
    position: { x: 400, y: 50 },
    difficulty: "Épico",
    levelRequirement: 35,
    boss: {
      name: "Anjo do Conformismo",
      health: 700,
      difficulty: "Épico",
    },
    theme: {
      name: "sky_city",
      color: "#34495e",
      backgroundColor: "#2c3e50",
      music: "ethereal.mp3",
    },
  },

  9: {
    cityNumber: 9,
    name: "Dimensão da Abundância",
    description: "Além da compreensão",
    position: { x: 450, y: 100 },
    difficulty: "Épico",
    levelRequirement: 40,
    boss: {
      name: "Sábio do Medo",
      health: 800,
      difficulty: "Épico",
    },
    theme: {
      name: "ethereal_realm",
      color: "#16a085",
      backgroundColor: "#117a65",
      music: "ethereal_battle.mp3",
    },
  },

  10: {
    cityNumber: 10,
    name: "Trono da Liberdade Financeira",
    description: "O objetivo final",
    position: { x: 500, y: 50 },
    difficulty: "Épico",
    levelRequirement: 45,
    boss: {
      name: "Imperador da Limitação",
      health: 1000,
      difficulty: "Épico",
    },
    theme: {
      name: "golden_throne",
      color: "#f39c12",
      backgroundColor: "#e67e22",
      music: "final_boss.mp3",
    },
  },
};

module.exports.CITIES_TEMPLATES = CITIES_TEMPLATES;
