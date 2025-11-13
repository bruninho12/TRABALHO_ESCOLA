const express = require("express");
const budgetController = require("../controllers/budgetController");
const { authenticate } = require("../controllers/authController");
const { validate } = require("../middleware/validation-joi");
const { budgetSchemas } = require("../utils/validationSchemas");

const router = express.Router();

// Aplicar middleware de autenticação em todas as rotas
router.use(authenticate);

// Listar orçamentos
router.get("/", budgetController.getBudgets);

// Progresso dos orçamentos
router.get("/progress", budgetController.getBudgetProgress);

// Criar orçamento
router.post("/", validate(budgetSchemas.create), budgetController.createBudget);

// Atualizar orçamento
router.put(
  "/:id",
  validate(budgetSchemas.update),
  budgetController.updateBudget
);

// Excluir orçamento
router.delete("/:id", budgetController.deleteBudget);

module.exports = router;
