const express = require("express");
const RPGController = require("../controllers/rpgController");
const { authenticate } = require("../controllers/authController");

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
router.post("/avatar", RPGController.createAvatar);

/**
 * GET /api/rpg/avatar
 * Obter avatar do usuário
 */
router.get("/avatar", RPGController.getAvatar);

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
router.post("/battle/start", RPGController.startBattle);

/**
 * POST /api/rpg/battle/:battleId/action
 * Executar ação em uma batalha
 */
router.post("/battle/:battleId/action", RPGController.performBattleAction);

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
router.get("/world-map", RPGController.getWorldMap);

/**
 * POST /api/rpg/city/:cityNumber/unlock
 * Desbloquear uma cidade
 */
router.post("/city/:cityNumber/unlock", RPGController.unlockCity);

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
