const express = require("express");
const notificationController = require("../controllers/notificationController");
const { authenticate } = require("../controllers/authController");

const router = express.Router();

// Aplicar middleware de autenticação em todas as rotas
router.use(authenticate);

// Listar notificações
router.get("/", notificationController.getNotifications);

// Marcar todas como lidas
router.put("/read-all", notificationController.markAllNotificationsAsRead);

// Marcar uma notificação como lida
router.put("/read/:id", notificationController.markNotificationAsRead);

module.exports = router;
