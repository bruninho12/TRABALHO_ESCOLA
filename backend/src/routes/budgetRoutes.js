const express = require("express");
const budgetController = require("../controllers/budgetController");
const { authenticate } = require("../middleware/auth");
const { validate } = require("../middleware/validation-joi");
const { budgetSchemas } = require("../utils/validationSchemas");
const Joi = require("joi");

const router = express.Router();

// Esquemas de validação para orçamentos
const createBudgetValidation = Joi.object({
  body: budgetSchemas.create,
  params: Joi.object().unknown(true),
  query: Joi.object().unknown(true),
});

const updateBudgetValidation = Joi.object({
  body: budgetSchemas.update,
  params: Joi.object().unknown(true),
  query: Joi.object().unknown(true),
});

// Aplicar middleware de autenticação em todas as rotas
router.use(authenticate);

// Listar orçamentos
router.get("/", budgetController.getBudgets);

// Progresso dos orçamentos
router.get("/progress", budgetController.getBudgetProgress);

// Criar orçamento
router.post(
  "/",
  validate(createBudgetValidation),
  budgetController.createBudget,
);

// Atualizar orçamento
router.put(
  "/:id",
  validate(updateBudgetValidation),
  budgetController.updateBudget,
);

// Excluir orçamento
router.delete("/:id", budgetController.deleteBudget);

module.exports = router;
