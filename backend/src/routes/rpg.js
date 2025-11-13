const express = require('express');
const RPGController = require('../api/rpgController');

const router = express.Router();

// Middleware de autenticação será adicionado pelo app.js
// ou pode ser aplicado via app.use('/api/rpg', authenticate, rpgRoutes)

// ============================================
// AVATAR ENDPOINTS
// ============================================

/**
 * POST /api/rpg/avatar
 * Criar novo avatar
 */
router.post('/avatar', (req, res) => RPGController.createAvatar(req, res));

/**
 * GET /api/rpg/avatar
 * Obter avatar do usuário
 */
router.get('/avatar', (req, res) => RPGController.getAvatar(req, res));

/**
 * PUT /api/rpg/avatar
 * Atualizar avatar
 */
router.put('/avatar', (req, res) => RPGController.updateAvatar(req, res));

/**
 * DELETE /api/rpg/avatar
 * Deletar avatar
 */
router.delete('/avatar', (req, res) => RPGController.deleteAvatar(req, res));

// ============================================
// BATTLE ENDPOINTS
// ============================================

/**
 * POST /api/rpg/battle/start
 * Iniciar nova batalha
 */
router.post('/battle/start', (req, res) => RPGController.startBattle(req, res));

/**
 * POST /api/rpg/battle/:battleId/action
 * Executar ação em uma batalha
 */
router.post('/battle/:battleId/action', (req, res) => RPGController.performBattleAction(req, res));

/**
 * GET /api/rpg/battles
 * Obter histórico de batalhas
 */
router.get('/battles', (req, res) => RPGController.getBattleHistory(req, res));

// ============================================
// WORLD MAP ENDPOINTS
// ============================================

/**
 * GET /api/rpg/world-map
 * Obter mapa do mundo
 */
router.get('/world-map', (req, res) => RPGController.getWorldMap(req, res));

/**
 * POST /api/rpg/city/:cityNumber/unlock
 * Desbloquear uma cidade
 */
router.post('/city/:cityNumber/unlock', (req, res) => RPGController.unlockCity(req, res));

// ============================================
// ACHIEVEMENTS ENDPOINTS
// ============================================

/**
 * GET /api/rpg/achievements
 * Obter achievements do usuário
 */
router.get('/achievements', (req, res) => RPGController.getAchievements(req, res));

// ============================================
// LEADERBOARD ENDPOINTS
// ============================================

/**
 * GET /api/rpg/leaderboard
 * Obter leaderboard global
 */
router.get('/leaderboard', (req, res) => RPGController.getLeaderboard(req, res));

module.exports = router;
