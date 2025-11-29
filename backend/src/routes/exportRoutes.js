/**
 * @fileoverview Rotas para Exportação de Dados
 */

const express = require("express");
const exportController = require("../controllers/exportController");
const { authenticate } = require("../controllers/authController");
const {
  checkPremium,
  addSubscriptionInfo,
} = require("../middleware/checkPremium");

const router = express.Router();

// Aplicar autenticação em todas as rotas
router.use(authenticate);

// Exportar transações (CSV: FREE, Excel: PREMIUM)
router.get("/transactions/csv", exportController.exportTransactionsCSV);
router.get(
  "/transactions/excel",
  checkPremium,
  exportController.exportTransactionsExcel
);

// Relatórios (PREMIUM)
router.get(
  "/report/monthly",
  checkPremium,
  exportController.exportMonthlyReport
);

// Metas (PREMIUM)
router.get("/goals/pdf", checkPremium, exportController.exportGoalsPDF);

// Backup completo (PREMIUM)
router.get("/backup", checkPremium, exportController.exportUserBackup);

module.exports = router;
