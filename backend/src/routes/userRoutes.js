const express = require("express");
const userController = require("../controllers/userController");
const { authenticate } = require("../middleware/auth");
const { validate } = require("../middleware/validation-joi");
const { userSchemas } = require("../utils/validationSchemas");
const Joi = require("joi");

const router = express.Router();

// Esquemas de validação para usuários
const updateProfileValidation = Joi.object({
  body: userSchemas.updateProfile,
  params: Joi.object().unknown(true),
  query: Joi.object().unknown(true),
});

const updateSettingsValidation = Joi.object({
  body: userSchemas.updateSettings,
  params: Joi.object().unknown(true),
  query: Joi.object().unknown(true),
});

// Aplicar middleware de autenticação em todas as rotas
router.use(authenticate);

// Perfil do usuário
router.get("/profile", userController.getProfile);

// Atualizar perfil
router.put(
  "/update",
  validate(updateProfileValidation),
  userController.updateProfile
);

// Configurações do usuário
router.get("/settings", userController.getUserSettings);

// Atualizar configurações
router.put(
  "/settings",
  validate(updateSettingsValidation),
  userController.updateUserSettings
);

// Atualizar plano de assinatura
router.put("/subscription/plan", userController.updateSubscriptionPlan);

module.exports = router;

