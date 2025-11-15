const express = require("express");
const userController = require("../controllers/userController");
const { authenticate } = require("../controllers/authController");
const { validate } = require("../middleware/validation-joi");
const { userSchemas } = require("../utils/validationSchemas");

const router = express.Router();

// Aplicar middleware de autenticação em todas as rotas
router.use(authenticate);

// Perfil do usuário
router.get("/profile", userController.getProfile);

// Atualizar perfil
router.put(
  "/update",
  validate(userSchemas.updateProfile),
  userController.updateProfile
);

// Configurações do usuário
router.get("/settings", userController.getUserSettings);

// Atualizar configurações
router.put(
  "/settings",
  validate(userSchemas.updateSettings),
  userController.updateUserSettings
);

// Atualizar plano de assinatura
router.put("/subscription/plan", userController.updateSubscriptionPlan);

module.exports = router;
