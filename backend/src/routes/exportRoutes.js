/**
 * @fileoverview Rotas para Exportação de Dados
 */

const express = require("express");
const exportController = require("../controllers/exportController");
const { authenticate } = require("../controllers/authController");

const router = express.Router();

// Aplicar autenticação em todas as rotas
router.use(authenticate);

// Exportar transações
router.get("/transactions/csv", exportController.exportTransactionsCSV);
router.get("/transactions/excel", exportController.exportTransactionsExcel);

// Relatórios
router.get("/report/monthly", exportController.exportMonthlyReport);

// Metas
router.get("/goals/pdf", exportController.exportGoalsPDF);

// Backup completo
router.get("/backup", exportController.exportUserBackup);

module.exports = router;
