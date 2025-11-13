const express = require("express");
const transactionController = require("../controllers/transactionController");
const { authenticate } = require("../controllers/authController");

const router = express.Router();

// Aplicar middleware de autenticação em todas as rotas
router.use(authenticate);

// Listar todas as transações
router.get("/", transactionController.getTransactions);

// Obter resumo das transações
router.get("/summary", transactionController.getTransactionsSummary);

// Criar transação
router.post("/", transactionController.createTransaction);

// Obter transação específica
router.get("/:id", transactionController.getTransaction);

// Atualizar transação
router.put("/:id", transactionController.updateTransaction);

// Excluir transação
router.delete("/:id", transactionController.deleteTransaction);

module.exports = router;
