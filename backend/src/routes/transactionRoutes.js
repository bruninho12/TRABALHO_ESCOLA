const express = require("express");
const transactionController = require("../controllers/transactionController");
const { authenticate } = require("../middleware/auth");
const { validate } = require("../middleware/validation-joi");
const { transactionSchemas } = require("../utils/validationSchemas");
const Joi = require("joi");

const router = express.Router();

// Esquemas de validação para transações
const createTransactionValidation = Joi.object({
  body: transactionSchemas.create,
  params: Joi.object().unknown(true),
  query: Joi.object().unknown(true),
});

const updateTransactionValidation = Joi.object({
  body: transactionSchemas.update,
  params: Joi.object().unknown(true),
  query: Joi.object().unknown(true),
});

// Aplicar middleware de autenticação em todas as rotas
router.use(authenticate);

// Listar todas as transações
router.get("/", transactionController.getTransactions);

// Obter resumo das transações
router.get("/summary", transactionController.getTransactionsSummary);

// Criar transação
router.post(
  "/",
  validate(createTransactionValidation),
  transactionController.createTransaction
);

// Obter transação específica
router.get("/:id", transactionController.getTransaction);

// Atualizar transação
router.put(
  "/:id",
  validate(updateTransactionValidation),
  transactionController.updateTransaction
);

// Excluir transação
router.delete("/:id", transactionController.deleteTransaction);

module.exports = router;

