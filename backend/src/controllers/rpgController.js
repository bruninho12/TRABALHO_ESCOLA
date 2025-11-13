const Avatar = require('../models/Avatar');
const Battle = require('../models/Battle');
const Achievement = require('../models/Achievement');
const WorldMap = require('../models/WorldMap');
const logger = require('../utils/logger');

class RPGController {
  /**
   * CREATE AVATAR
   * POST /api/rpg/avatar
   */
  static async createAvatar(req, res) {
    try {
      const { name, characterClass } = req.body;
      const userId = req.user._id;

      // Validate input
      if (!name || !characterClass) {
        return res.status(400).json({
          success: false,
          message: 'Nome e classe são obrigatórios'
        });
      }

      const validClasses = ['Knight', 'Mage', 'Rogue', 'Paladin'];
      if (!validClasses.includes(characterClass)) {
        return res.status(400).json({
          success: false,
          message: `Classe inválida. Escolha entre: ${validClasses.join(', ')}`
        });
      }

      // Check if user already has an avatar
      const existingAvatar = await Avatar.findOne({ userId });
      if (existingAvatar) {
        return res.status(400).json({
          success: false,
          message: 'Você já possui um avatar. Delete o anterior para criar novo.'
        });
      }

      // Determine starting stats based on class
      const startingStats = {
        Knight: { health: 150, mana: 30, strength: 15, intelligence: 8 },
        Mage: { health: 80, mana: 100, strength: 8, intelligence: 18 },
        Rogue: { health: 100, mana: 50, strength: 12, intelligence: 12 },
        Paladin: { health: 120, mana: 60, strength: 13, intelligence: 13 }
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
          constitution: 10
        }
      });

      await newAvatar.save();

      logger.info(`Avatar criado: ${newAvatar._id} para usuário ${userId}`);

      return res.status(201).json({
        success: true,
        message: 'Avatar criado com sucesso!',
        avatar: newAvatar.toDTO()
      });
    } catch (error) {
      logger.error('Erro ao criar avatar:', error);
      return res.status(500).json({
        success: false,
        message: 'Erro ao criar avatar',
        error: error.message
      });
    }
  }

  /**
   * GET AVATAR
   * GET /api/rpg/avatar
   */
  static async getAvatar(req, res) {
    try {
      const userId = req.user._id;

      const avatar = await Avatar.findOne({ userId }).populate('achievements');

      if (!avatar) {
        return res.status(404).json({
          success: false,
          message: 'Avatar não encontrado'
        });
      }

      return res.status(200).json({
        success: true,
        avatar: avatar.toDTO()
      });
    } catch (error) {
      logger.error('Erro ao buscar avatar:', error);
      return res.status(500).json({
        success: false,
        message: 'Erro ao buscar avatar',
        error: error.message
      });
    }
  }

  /**
   * UPDATE AVATAR
   * PUT /api/rpg/avatar
   */
  static async updateAvatar(req, res) {
    try {
      const userId = req.user._id;
      const { name } = req.body;

      const avatar = await Avatar.findOne({ userId });

      if (!avatar) {
        return res.status(404).json({
          success: false,
          message: 'Avatar não encontrado'
        });
      }

      if (name) {
        avatar.name = name;
      }

      await avatar.save();

      return res.status(200).json({
        success: true,
        message: 'Avatar atualizado',
        avatar: avatar.toDTO()
      });
    } catch (error) {
      logger.error('Erro ao atualizar avatar:', error);
      return res.status(500).json({
        success: false,
        message: 'Erro ao atualizar avatar',
        error: error.message
      });
    }
  }

  /**
   * DELETE AVATAR
   * DELETE /api/rpg/avatar
   */
  static async deleteAvatar(req, res) {
    try {
      const userId = req.user._id;

      const avatar = await Avatar.findOneAndDelete({ userId });

      if (!avatar) {
        return res.status(404).json({
          success: false,
          message: 'Avatar não encontrado'
        });
      }

      logger.info(`Avatar deletado: ${avatar._id}`);

      return res.status(200).json({
        success: true,
        message: 'Avatar deletado com sucesso'
      });
    } catch (error) {
      logger.error('Erro ao deletar avatar:', error);
      return res.status(500).json({
        success: false,
        message: 'Erro ao deletar avatar',
        error: error.message
      });
    }
  }

  /**
   * START BATTLE
   * POST /api/rpg/battle/start
   */
  static async startBattle(req, res) {
    try {
      const userId = req.user._id;
      const { cityNumber } = req.body;

      // Get avatar
      const avatar = await Avatar.findOne({ userId });
      if (!avatar) {
        return res.status(404).json({
          success: false,
          message: 'Avatar não encontrado'
        });
      }

      // Get city
      const city = await WorldMap.findOne({ cityNumber });
      if (!city) {
        return res.status(404).json({
          success: false,
          message: 'Cidade não encontrada'
        });
      }

      // Check access
      if (!city.canPlayerAccess(avatar.level)) {
        return res.status(403).json({
          success: false,
          message: `Você precisa estar no nível ${city.levelRequirement} para acessar esta cidade`
        });
      }

      // Get random enemy
      const enemy = city.getRandomEnemy();
      if (!enemy) {
        return res.status(400).json({
          success: false,
          message: 'Nenhum inimigo disponível nesta cidade'
        });
      }

      // Create battle
      const battle = new Battle({
        userId,
        avatarId: avatar._id,
        enemy: {
          ...enemy,
          health: enemy.healthMax
        }
      });

      await battle.save();

      city.incrementBattleCount();
      await city.save();

      return res.status(201).json({
        success: true,
        message: 'Batalha iniciada!',
        battle: battle.toDTO(),
        avatar: {
          health: avatar.stats.health,
          maxHealth: avatar.stats.maxHealth,
          mana: avatar.stats.mana,
          maxMana: avatar.stats.maxMana
        }
      });
    } catch (error) {
      logger.error('Erro ao iniciar batalha:', error);
      return res.status(500).json({
        success: false,
        message: 'Erro ao iniciar batalha',
        error: error.message
      });
    }
  }

  /**
   * PERFORM BATTLE ACTION
   * POST /api/rpg/battle/:battleId/action
   */
  static async performBattleAction(req, res) {
    try {
      const userId = req.user._id;
      const { battleId } = req.params;
      const { action, damage } = req.body;

      const battle = await Battle.findById(battleId);
      if (!battle) {
        return res.status(404).json({
          success: false,
          message: 'Batalha não encontrada'
        });
      }

      if (battle.result) {
        return res.status(400).json({
          success: false,
          message: 'Batalha já finalizou'
        });
      }

      const avatar = await Avatar.findById(battle.avatarId);

      // Calculate enemy damage
      const currentTurn = battle.stats.totalTurns + 1;
      const enemyDamage = Math.floor(Math.random() * 20) + 5;

      // Add turn log
      battle.addTurnLog(currentTurn, action, 'player', damage, 0, `Jogador usa ${action}`);
      battle.addTurnLog(currentTurn, 'attack', 'enemy', enemyDamage, 0, `Inimigo ataca`);

      // Update battle state
      battle.enemy.health = Math.max(0, battle.enemy.health - damage);
      avatar.stats.health = Math.max(0, avatar.stats.health - enemyDamage);

      // Check if battle is over
      if (battle.enemy.health <= 0) {
        // Player wins
        const xpGain = Math.floor(Math.random() * 50) + 50;
        const goldGain = Math.floor(Math.random() * 30) + 20;

        battle.finishBattle('won', xpGain, goldGain);
        avatar.recordBattle(true, xpGain, goldGain);

        await battle.save();
        await avatar.save();

        return res.status(200).json({
          success: true,
          message: 'Você venceu!',
          battleResult: {
            result: 'won',
            experienceGained: xpGain,
            goldGained: goldGain,
            newLevel: avatar.level
          },
          battle: battle.toDTO()
        });
      } else if (avatar.stats.health <= 0) {
        // Player loses
        battle.finishBattle('lost', 0, 0);
        avatar.recordBattle(false, 0, 0);

        await battle.save();
        await avatar.save();

        return res.status(200).json({
          success: true,
          message: 'Você foi derrotado!',
          battleResult: {
            result: 'lost',
            experienceGained: 0,
            goldGained: 0
          },
          battle: battle.toDTO()
        });
      }

      await battle.save();
      await avatar.save();

      return res.status(200).json({
        success: true,
        message: 'Ação realizada',
        battle: battle.toDTO(),
        playerHealth: avatar.stats.health,
        enemyHealth: battle.enemy.health
      });
    } catch (error) {
      logger.error('Erro ao executar ação de batalha:', error);
      return res.status(500).json({
        success: false,
        message: 'Erro ao executar ação',
        error: error.message
      });
    }
  }

  /**
   * GET WORLD MAP
   * GET /api/rpg/world-map
   */
  static async getWorldMap(req, res) {
    try {
      const userId = req.user._id;

      const avatar = await Avatar.findOne({ userId });
      if (!avatar) {
        return res.status(404).json({
          success: false,
          message: 'Avatar não encontrado'
        });
      }

      const cities = await WorldMap.find().sort({ cityNumber: 1 });

      const citiesDTO = cities.map(city => ({
        ...city.toDTO(),
        canAccess: city.canPlayerAccess(avatar.level),
        isUnlocked: avatar.citiesUnlocked.includes(city.cityNumber)
      }));

      return res.status(200).json({
        success: true,
        cities: citiesDTO
      });
    } catch (error) {
      logger.error('Erro ao buscar mapa:', error);
      return res.status(500).json({
        success: false,
        message: 'Erro ao buscar mapa',
        error: error.message
      });
    }
  }

  /**
   * UNLOCK CITY
   * POST /api/rpg/city/:cityNumber/unlock
   */
  static async unlockCity(req, res) {
    try {
      const userId = req.user._id;
      const { cityNumber } = req.params;

      const avatar = await Avatar.findOne({ userId });
      if (!avatar) {
        return res.status(404).json({
          success: false,
          message: 'Avatar não encontrado'
        });
      }

      try {
        avatar.unlockCity(parseInt(cityNumber));
        await avatar.save();

        return res.status(200).json({
          success: true,
          message: `Cidade ${cityNumber} desbloqueada!`,
          citiesUnlocked: avatar.citiesUnlocked
        });
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: error.message
        });
      }
    } catch (error) {
      logger.error('Erro ao desbloquear cidade:', error);
      return res.status(500).json({
        success: false,
        message: 'Erro ao desbloquear cidade',
        error: error.message
      });
    }
  }

  /**
   * GET ACHIEVEMENTS
   * GET /api/rpg/achievements
   */
  static async getAchievements(req, res) {
    try {
      const userId = req.user._id;

      const achievements = await Achievement.find({ userId });

      const achievementsDTO = achievements.map(a => a.toDTO());

      return res.status(200).json({
        success: true,
        achievements: achievementsDTO,
        summary: {
          total: achievements.length,
          unlocked: achievements.filter(a => a.isUnlocked).length,
          progress: Math.round(
            (achievements.filter(a => a.isUnlocked).length / achievements.length) * 100
          )
        }
      });
    } catch (error) {
      logger.error('Erro ao buscar achievements:', error);
      return res.status(500).json({
        success: false,
        message: 'Erro ao buscar achievements',
        error: error.message
      });
    }
  }

  /**
   * GET BATTLE HISTORY
   * GET /api/rpg/battles
   */
  static async getBattleHistory(req, res) {
    try {
      const userId = req.user._id;
      const { limit = 10, skip = 0 } = req.query;

      const battles = await Battle.find({ userId })
        .sort({ startedAt: -1 })
        .limit(parseInt(limit))
        .skip(parseInt(skip));

      const total = await Battle.countDocuments({ userId });

      const battlesDTO = battles.map(b => b.toDTO());

      return res.status(200).json({
        success: true,
        battles: battlesDTO,
        pagination: {
          total,
          limit: parseInt(limit),
          skip: parseInt(skip)
        }
      });
    } catch (error) {
      logger.error('Erro ao buscar histórico de batalhas:', error);
      return res.status(500).json({
        success: false,
        message: 'Erro ao buscar histórico',
        error: error.message
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
        .select('name characterClass level experience battlesWon winRate');

      const leaderboardDTO = leaderboard.map((avatar, index) => ({
        rank: index + 1,
        name: avatar.name,
        characterClass: avatar.characterClass,
        level: avatar.level,
        experience: avatar.experience,
        battlesWon: avatar.battlesWon,
        winRate: avatar.winRate
      }));

      return res.status(200).json({
        success: true,
        leaderboard: leaderboardDTO
      });
    } catch (error) {
      logger.error('Erro ao buscar leaderboard:', error);
      return res.status(500).json({
        success: false,
        message: 'Erro ao buscar leaderboard',
        error: error.message
      });
    }
  }
}

module.exports = RPGController;
