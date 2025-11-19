const express = require("express");
const RPGController = require("../controllers/rpgController");
const { authenticate } = require("../controllers/authController");
const RPGValidation = require("../middleware/rpgValidation");
const CacheMiddleware = require("../middleware/cacheMiddleware");

const router = express.Router();

// Apply authentication middleware to all RPG routes
router.use(authenticate);

// Rota de teste
router.get("/test", (req, res) => {
  res.json({ message: "RPG router is working", user: req.user });
});

// ============================================
// AVATAR ENDPOINTS
// ============================================

/**
 * POST /api/rpg/avatar
 * Criar novo avatar
 */
router.post(
  "/avatar",
  RPGValidation.validateCreateAvatar(),
  RPGController.createAvatar
);

/**
 * GET /api/rpg/avatar
 * Obter avatar do usuário
 */
router.get("/avatar", CacheMiddleware.avatarCache(), RPGController.getAvatar);

/**
 * PUT /api/rpg/avatar
 * Atualizar avatar
 */
router.put("/avatar", RPGController.updateAvatar);

/**
 * DELETE /api/rpg/avatar
 * Deletar avatar
 */
router.delete("/avatar", RPGController.deleteAvatar);

// ============================================
// BATTLE ENDPOINTS
// ============================================

/**
 * POST /api/rpg/battle/start
 * Iniciar nova batalha
 */
router.post(
  "/battle/start",
  RPGValidation.validateStartBattle(),
  CacheMiddleware.worldMapCache(),
  RPGController.startBattle
);

/**
 * POST /api/rpg/battle/:battleId/action
 * Executar ação em uma batalha
 */
router.post(
  "/battle/:battleId/action",
  RPGValidation.validateBattleAction(),
  RPGController.performBattleAction
);

/**
 * GET /api/rpg/battles
 * Obter histórico de batalhas
 */
router.get("/battles", RPGController.getBattleHistory);

// ============================================
// WORLD MAP ENDPOINTS
// ============================================

/**
 * GET /api/rpg/world-map
 * Obter mapa do mundo
 */
router.get(
  "/world-map",
  CacheMiddleware.worldMapCache(),
  RPGController.getWorldMap
);

/**
 * POST /api/rpg/city/:cityNumber/unlock
 * Desbloquear uma cidade
 */
router.post(
  "/city/:cityNumber/unlock",
  RPGValidation.validateMongoId("cityNumber"),
  RPGController.unlockCity
);

// ============================================
// ACHIEVEMENTS ENDPOINTS
// ============================================

/**
 * GET /api/rpg/achievements
 * Obter achievements do usuário
 */
router.get("/achievements", RPGController.getAchievements);

// ============================================
// LEADERBOARD ENDPOINTS
// ============================================

/**
 * GET /api/rpg/leaderboard
 * Obter leaderboard global
 */
router.get("/leaderboard", RPGController.getLeaderboard);

module.exports = router;
