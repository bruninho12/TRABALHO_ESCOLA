const Avatar = require("../models/Avatar");
const Battle = require("../models/Battle");
const Achievement = require("../models/Achievement");
const WorldMap = require("../models/WorldMap");
const logger = require("../utils/logger");
const CacheMiddleware = require("../middleware/cacheMiddleware");

class RPGController {
  /**
   * CRIAR AVATAR
   * POST /api/rpg/avatar
   */
  static async createAvatar(req, res) {
    try {
      const { name, characterClass } = req.body;
      const userId = req.user.id;

      // Validate input
      if (!name || !characterClass) {
        return res.status(400).json({
          success: false,
          message: "Nome e classe são obrigatórios",
        });
      }

      const validClasses = ["Knight", "Mage", "Rogue", "Paladin"];
      if (!validClasses.includes(characterClass)) {
        return res.status(400).json({
          success: false,
          message: `Classe inválida. Escolha entre: ${validClasses.join(", ")}`,
        });
      }

      // Check if user already has an avatar
      const existingAvatar = await Avatar.findOne({ userId });
      if (existingAvatar) {
        return res.status(400).json({
          success: false,
          message:
            "Você já possui um avatar. Delete o anterior para criar novo.",
        });
      }

      // Determine starting stats based on class
      const startingStats = {
        Knight: { health: 150, mana: 30, strength: 15, intelligence: 8 },
        Mage: { health: 80, mana: 100, strength: 8, intelligence: 18 },
        Rogue: { health: 100, mana: 50, strength: 12, intelligence: 12 },
        Paladin: { health: 120, mana: 60, strength: 13, intelligence: 13 },
      };

      const baseStats = startingStats[characterClass] || startingStats.Knight;

      const newAvatar = new Avatar({
        userId,
        name,
        characterClass,
        stats: {
          ...baseStats,
          maxHealth: baseStats.health,
          maxMana: baseStats.mana,
          wisdom: 10,
          dexterity: 10,
          constitution: 10,
        },
      });

      await newAvatar.save();

      logger.info(`Avatar criado: ${newAvatar._id} para usuário ${userId}`);

      return res.status(201).json({
        success: true,
        message: "Avatar criado com sucesso!",
        avatar: newAvatar.toDTO(),
      });
    } catch (error) {
      logger.error("Erro ao criar avatar:", error);
      return res.status(500).json({
        success: false,
        message: "Erro ao criar avatar",
        error: error.message,
      });
    }
  }

  /**
   * GET AVATAR
   * GET /api/rpg/avatar
   */
  static async getAvatar(req, res) {
    try {
      const userId = req.user.id;

      // CACHE TEMPORARIAMENTE DESABILITADO - Bug de serialização
      // TODO: Reabilitar após correção completa
      if (false && req.cachedAvatar) {
        console.log("🚀 [CACHE] Avatar servido do cache para usuário:", userId);
        console.log(
          "🔍 [DEBUG] Tipo do cachedAvatar:",
          typeof req.cachedAvatar
        );
        console.log(
          "🔍 [DEBUG] É plain object?",
          req.cachedAvatar.constructor === Object
        );

        // Garantir que é um plain object
        let avatarData = req.cachedAvatar;
        if (typeof avatarData.toDTO === "function") {
          // Se ainda tem métodos Mongoose, converter para DTO
          avatarData = avatarData.toDTO();
          console.log("⚠️ [CACHE] Avatar convertido de Mongoose para DTO");
        }

        return res.status(200).json({
          success: true,
          data: {
            avatar: avatarData,
          },
        });
      }

      const avatar = await Avatar.findOne({ userId }).populate("achievements");

      // Armazenar no cache se encontrou avatar
      if (avatar) {
        const avatarDTO = avatar.toDTO();
        console.log(
          "🔍 [DEBUG] Tipo do avatarDTO antes do cache:",
          typeof avatarDTO
        );
        console.log(
          "🔍 [DEBUG] AvatarDTO é plain object?",
          avatarDTO.constructor === Object
        );

        // CACHE TEMPORARIAMENTE DESABILITADO
        // CacheMiddleware.storeAvatar(userId, avatarDTO);
        console.log("✅ Avatar encontrado no DB para usuário:", userId);
        return res.status(200).json({
          success: true,
          data: {
            avatar: avatarDTO, // Usar o DTO convertido
          },
        });
      } else {
        // Usuário não tem avatar ainda
        return res.status(200).json({
          success: true,
          data: {
            avatar: null,
          },
        });
      }
    } catch (error) {
      console.error("❌ [ERROR] Erro ao buscar avatar:", error);
      logger.error("Erro ao buscar avatar:", {
        error: error.message,
        stack: error.stack,
        userId: req.user?.id,
        hasCachedAvatar: !!req.cachedAvatar,
      });
      return res.status(500).json({
        success: false,
        message: "Erro interno do servidor",
        error:
          process.env.NODE_ENV === "development"
            ? error.message
            : "Erro interno",
      });
    }
  }

  /**
   * UPDATE AVATAR
   * PUT /api/rpg/avatar
   */
  static async updateAvatar(req, res) {
    try {
      const userId = req.user.id;
      const { name } = req.body;

      const avatar = await Avatar.findOne({ userId });

      if (!avatar) {
        return res.status(404).json({
          success: false,
          message: "Avatar não encontrado",
        });
      }

      if (name) {
        avatar.name = name;
      }

      await avatar.save();

      return res.status(200).json({
        success: true,
        message: "Avatar atualizado",
        avatar: avatar.toDTO(),
      });
    } catch (error) {
      logger.error("Erro ao atualizar avatar:", error);
      return res.status(500).json({
        success: false,
        message: "Erro ao atualizar avatar",
        error: error.message,
      });
    }
  }

  /**
   * DELETE AVATAR
   * DELETE /api/rpg/avatar
   */
  static async deleteAvatar(req, res) {
    try {
      const userId = req.user.id;

      const avatar = await Avatar.findOneAndDelete({ userId });

      if (!avatar) {
        return res.status(404).json({
          success: false,
          message: "Avatar não encontrado",
        });
      }

      logger.info(`Avatar deletado: ${avatar._id}`);

      return res.status(200).json({
        success: true,
        message: "Avatar deletado com sucesso",
      });
    } catch (error) {
      logger.error("Erro ao deletar avatar:", error);
      return res.status(500).json({
        success: false,
        message: "Erro ao deletar avatar",
        error: error.message,
      });
    }
  }

  /**
   * START BATTLE
   * POST /api/rpg/battle/start
   */
  static async startBattle(req, res) {
    try {
      const userId = req.user.id;
      const { cityNumber } = req.body;

      // Validate input
      if (!cityNumber) {
        return res.status(400).json({
          success: false,
          message: "cityNumber é obrigatório",
        });
      }

      // Get avatar
      const avatar = await Avatar.findOne({ userId });
      console.log("🎮 [DEBUG] Avatar encontrado:", !!avatar);

      if (!avatar) {
        return res.status(404).json({
          success: false,
          message: "Avatar não encontrado",
        });
      }

      console.log("🎮 [DEBUG] Procurando cidade:", cityNumber);
      // Get city
      const city = await WorldMap.findOne({ cityNumber });
      console.log("🎮 [DEBUG] Cidade encontrada:", !!city);

      if (!city) {
        return res.status(404).json({
          success: false,
          message: "Cidade não encontrada",
        });
      }

      // Check access
      console.log(
        "🎮 [DEBUG] Verificando acesso. Avatar level:",
        avatar.level,
        "City requirement:",
        city.levelRequirement
      );

      if (!city.canPlayerAccess(avatar.level)) {
        console.log("❌ [DEBUG] Acesso negado");
        return res.status(403).json({
          success: false,
          message: `Você precisa estar no nível ${city.levelRequirement} para acessar esta cidade`,
        });
      }

      console.log("✅ [DEBUG] Acesso permitido");

      // Get random enemy
      console.log("🎮 [DEBUG] Gerando inimigo...");
      const enemy = city.getRandomEnemy();
      console.log("🎮 [DEBUG] Inimigo gerado:", !!enemy, enemy);

      if (!enemy) {
        console.log("❌ [DEBUG] Nenhum inimigo disponível");
        return res.status(400).json({
          success: false,
          message: "Nenhum inimigo disponível nesta cidade",
        });
      }

      // Validar dados do inimigo antes de criar batalha
      if (!enemy.healthMax || isNaN(enemy.healthMax) || enemy.healthMax <= 0) {
        console.error("❌ [DEBUG] HealthMax inválido:", enemy.healthMax);
        return res.status(500).json({
          success: false,
          message: "Erro na geração do inimigo. Tente novamente.",
        });
      }

      // Create battle com validações
      const battleData = {
        userId,
        avatarId: avatar._id,
        enemy: {
          type: enemy.type,
          name: enemy.name,
          healthMax: Math.round(enemy.healthMax),
          health: Math.round(enemy.healthMax),
          difficulty: enemy.difficulty,
        },
      };

      console.log(
        "🎮 [DEBUG] Dados da batalha:",
        JSON.stringify(battleData, null, 2)
      );

      const battle = new Battle(battleData);
      await battle.save();

      city.incrementBattleCount();
      await city.save();

      return res.status(201).json({
        success: true,
        message: "Batalha iniciada!",
        data: {
          battle: battle.toDTO(),
          avatar: {
            health: avatar.stats.health,
            maxHealth: avatar.stats.maxHealth,
            mana: avatar.stats.mana,
            maxMana: avatar.stats.maxMana,
          },
        },
      });
    } catch (error) {
      logger.error("Erro ao iniciar batalha:", error);
      return res.status(500).json({
        success: false,
        message: "Erro ao iniciar batalha",
        error: error.message,
      });
    }
  }

  /**
   * PERFORM BATTLE ACTION
   * POST /api/rpg/battle/:battleId/action
   */
  static async performBattleAction(req, res) {
    try {
      const { battleId } = req.params;
      const { action } = req.body;

      // Validações de entrada
      if (!action || typeof action !== "string") {
        return res.status(400).json({
          success: false,
          message: "Ação é obrigatória e deve ser uma string",
        });
      }

      // Gerar dano automaticamente baseado na ação
      let damage = 0;
      switch (action) {
        case "attack":
          damage = Math.floor(Math.random() * 20) + 10; // 10-30 de dano
          break;
        case "special":
          damage = Math.floor(Math.random() * 35) + 15; // 15-50 de dano
          break;
        case "defend":
          damage = Math.floor(Math.random() * 5) + 2; // 2-7 de dano (reduzido)
          break;
        case "heal":
          damage = 0; // Cura não causa dano ao inimigo
          break;
        default:
          damage = Math.floor(Math.random() * 15) + 5; // 5-20 padrão
      }

      console.log(`🎮 [BATTLE] Ação: ${action}, Dano calculado: ${damage}`);

      const battle = await Battle.findById(battleId);
      if (!battle) {
        return res.status(404).json({
          success: false,
          message: "Batalha não encontrada",
        });
      }

      if (battle.result) {
        return res.status(400).json({
          success: false,
          message: "Batalha já finalizou",
        });
      }

      // Validar dados do inimigo na batalha
      if (isNaN(battle.enemy.health) || battle.enemy.health < 0) {
        console.error(
          "❌ [DEBUG] Saúde do inimigo inválida:",
          battle.enemy.health
        );
        return res.status(500).json({
          success: false,
          message: "Estado da batalha corrompido. Contate o suporte.",
        });
      }

      const avatar = await Avatar.findById(battle.avatarId);
      if (!avatar) {
        return res.status(404).json({
          success: false,
          message: "Avatar não encontrado",
        });
      }

      // Calculate enemy damage com validações
      const currentTurn = battle.stats.totalTurns + 1;
      const baseDamage = Math.floor(Math.random() * 20) + 5;
      const enemyDamage = Math.max(1, Math.round(baseDamage)); // Garantir pelo menos 1 de dano
      const playerDamage = Math.max(1, Math.round(damage)); // Validar dano do jogador

      console.log(
        `🎮 [DEBUG] Turno ${currentTurn}: Jogador causa ${playerDamage}, Inimigo causa ${enemyDamage}`
      );

      // Add turn log
      battle.addTurnLog(
        currentTurn,
        action,
        "player",
        playerDamage,
        0,
        `Jogador usa ${action}`
      );
      battle.addTurnLog(
        currentTurn,
        "attack",
        "enemy",
        enemyDamage,
        0,
        `Inimigo ataca`
      );

      // Update battle state com validações
      const newEnemyHealth = Math.max(
        0,
        Math.round(battle.enemy.health - playerDamage)
      );
      const newPlayerHealth = Math.max(
        0,
        Math.round(avatar.stats.health - enemyDamage)
      );

      battle.enemy.health = newEnemyHealth;
      avatar.stats.health = newPlayerHealth;

      console.log(
        `🎮 [DEBUG] Nova saúde - Inimigo: ${newEnemyHealth}, Jogador: ${newPlayerHealth}`
      );

      // Check if battle is over
      if (battle.enemy.health <= 0) {
        // Player wins
        const xpGain = Math.floor(Math.random() * 50) + 50;
        const goldGain = Math.floor(Math.random() * 30) + 20;

        battle.finishBattle("won", xpGain, goldGain);
        avatar.recordBattle(true, xpGain, goldGain);

        await battle.save();
        await avatar.save();

        return res.status(200).json({
          success: true,
          message: "Você venceu!",
          battleResult: {
            result: "won",
            experienceGained: xpGain,
            goldGained: goldGain,
            newLevel: avatar.level,
          },
          battle: battle.toDTO(),
        });
      } else if (avatar.stats.health <= 0) {
        // Player loses
        battle.finishBattle("lost", 0, 0);
        avatar.recordBattle(false, 0, 0);

        await battle.save();
        await avatar.save();

        return res.status(200).json({
          success: true,
          message: "Você foi derrotado!",
          battleResult: {
            result: "lost",
            experienceGained: 0,
            goldGained: 0,
          },
          battle: battle.toDTO(),
        });
      }

      await battle.save();
      await avatar.save();

      return res.status(200).json({
        success: true,
        message: "Ação realizada",
        battle: battle.toDTO(),
        playerHealth: avatar.stats.health,
        enemyHealth: battle.enemy.health,
      });
    } catch (error) {
      logger.error("Erro ao executar ação de batalha:", error);
      return res.status(500).json({
        success: false,
        message: "Erro ao executar ação",
        error: error.message,
      });
    }
  }

  /**
   * GET WORLD MAP
   * GET /api/rpg/world-map
   */
  static async getWorldMap(req, res) {
    try {
      const userId = req.user.id;

      // Verificar cache para WorldMap
      if (req.cachedWorldMap) {
        const avatar = await Avatar.findOne({ userId });

        // Adicionar informações específicas do usuário
        const citiesWithAccess = req.cachedWorldMap.cities.map((city) => ({
          ...city,
          canAccess: avatar ? city.levelRequirement <= avatar.level : false,
          isUnlocked: avatar
            ? avatar.citiesUnlocked.includes(city.cityNumber)
            : false,
        }));

        return res.status(200).json({
          success: true,
          data: {
            map: {
              cities: citiesWithAccess,
            },
          },
        });
      }

      const avatar = await Avatar.findOne({ userId });
      const cities = await WorldMap.find().sort({ cityNumber: 1 }).lean();

      const citiesDTO = cities.map((city) => ({
        _id: city._id,
        cityNumber: city.cityNumber,
        name: city.name,
        description: city.description,
        position: city.position,
        difficulty: city.difficulty,
        levelRequirement: city.levelRequirement,
        boss: city.boss,
        theme: city.theme,
        stats: city.stats,
        hasEnemies: city.enemies && city.enemies.length > 0,
        canAccess: avatar ? city.levelRequirement <= avatar.level : false,
        isUnlocked: avatar
          ? avatar.citiesUnlocked.includes(city.cityNumber)
          : false,
      }));

      // Armazenar versão base no cache (sem informações de usuário)
      const cacheData = {
        cities: cities.map((city) => ({
          _id: city._id,
          cityNumber: city.cityNumber,
          name: city.name,
          description: city.description,
          position: city.position,
          difficulty: city.difficulty,
          levelRequirement: city.levelRequirement,
          boss: city.boss,
          theme: city.theme,
          stats: city.stats,
          hasEnemies: city.enemies && city.enemies.length > 0,
        })),
      };
      CacheMiddleware.storeWorldMap(cacheData);

      return res.status(200).json({
        success: true,
        data: {
          map: {
            cities: citiesDTO,
          },
        },
      });
    } catch (error) {
      logger.error("Erro ao buscar mapa:", error);
      return res.status(500).json({
        success: false,
        message: "Erro ao buscar mapa",
        error: error.message,
      });
    }
  }

  /**
   * UNLOCK CITY
   * POST /api/rpg/city/:cityNumber/unlock
   */
  static async unlockCity(req, res) {
    try {
      const userId = req.user.id;
      const { cityNumber } = req.params;

      const avatar = await Avatar.findOne({ userId });
      if (!avatar) {
        return res.status(404).json({
          success: false,
          message: "Avatar não encontrado",
        });
      }

      try {
        avatar.unlockCity(parseInt(cityNumber));
        await avatar.save();

        return res.status(200).json({
          success: true,
          message: `Cidade ${cityNumber} desbloqueada!`,
          citiesUnlocked: avatar.citiesUnlocked,
        });
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: error.message,
        });
      }
    } catch (error) {
      logger.error("Erro ao desbloquear cidade:", error);
      return res.status(500).json({
        success: false,
        message: "Erro ao desbloquear cidade",
        error: error.message,
      });
    }
  }

  /**
   * GET ACHIEVEMENTS
   * GET /api/rpg/achievements
   */
  static async getAchievements(req, res) {
    try {
      const userId = req.user.id;

      const achievements = await Achievement.find({ userId });

      const achievementsDTO = achievements.map((a) => a.toDTO());

      return res.status(200).json({
        success: true,
        data: {
          achievements: achievementsDTO,
          summary: {
            total: achievements.length,
            unlocked: achievements.filter((a) => a.isUnlocked).length,
            progress: Math.round(
              (achievements.filter((a) => a.isUnlocked).length /
                achievements.length) *
                100
            ),
          },
        },
      });
    } catch (error) {
      logger.error("Erro ao buscar achievements:", error);
      return res.status(500).json({
        success: false,
        message: "Erro ao buscar achievements",
        error: error.message,
      });
    }
  }

  /**
   * GET BATTLE HISTORY
   * GET /api/rpg/battles
   */
  static async getBattleHistory(req, res) {
    try {
      const userId = req.user.id;
      const { limit = 10, skip = 0 } = req.query;

      const battles = await Battle.find({ userId })
        .sort({ startedAt: -1 })
        .limit(parseInt(limit))
        .skip(parseInt(skip));

      const total = await Battle.countDocuments({ userId });

      const battlesDTO = battles.map((b) => b.toDTO());

      return res.status(200).json({
        success: true,
        data: {
          battles: battlesDTO,
          pagination: {
            total,
            limit: parseInt(limit),
            skip: parseInt(skip),
          },
        },
      });
    } catch (error) {
      logger.error("Erro ao buscar histórico de batalhas:", error);
      return res.status(500).json({
        success: false,
        message: "Erro ao buscar histórico",
        error: error.message,
      });
    }
  }

  /**
   * GET LEADERBOARD
   * GET /api/rpg/leaderboard
   */
  static async getLeaderboard(req, res) {
    try {
      const { limit = 10 } = req.query;

      const leaderboard = await Avatar.find()
        .sort({ level: -1, experience: -1 })
        .limit(parseInt(limit))
        .select("name characterClass level experience battlesWon winRate");

      const leaderboardDTO = leaderboard.map((avatar, index) => ({
        rank: index + 1,
        name: avatar.name,
        characterClass: avatar.characterClass,
        level: avatar.level,
        experience: avatar.experience,
        battlesWon: avatar.battlesWon,
        winRate: avatar.winRate,
      }));

      return res.status(200).json({
        success: true,
        data: {
          leaderboard: leaderboardDTO,
        },
      });
    } catch (error) {
      logger.error("Erro ao buscar leaderboard:", error);
      return res.status(500).json({
        success: false,
        message: "Erro ao buscar leaderboard",
        error: error.message,
      });
    }
  }
}

module.exports = RPGController;
