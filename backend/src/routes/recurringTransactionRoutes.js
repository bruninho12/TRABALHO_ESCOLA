/**
 * @fileoverview Rotas para Transações Recorrentes
 */

const express = require("express");
const recurringController = require("../controllers/recurringTransactionController");
const { authenticate } = require("../controllers/authController");

const router = express.Router();

// Aplicar autenticação em todas as rotas
router.use(authenticate);

// Estatísticas (deve vir antes de /:id)
router.get("/stats", recurringController.getStats);

// CRUD básico
router.get("/", recurringController.getAll);
router.get("/:id", recurringController.getById);
router.post("/", recurringController.create);
router.put("/:id", recurringController.update);
router.delete("/:id", recurringController.delete);

// Ações específicas
router.post("/:id/pause", recurringController.pause);
router.post("/:id/resume", recurringController.resume);
router.post("/:id/cancel", recurringController.cancel);
router.post("/:id/execute", recurringController.executeNow);
router.get("/:id/history", recurringController.getHistory);

module.exports = router;
