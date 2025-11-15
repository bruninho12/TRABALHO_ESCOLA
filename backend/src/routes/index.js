const express = require("express");
const authRoutes = require("./authRoutes");
const userRoutes = require("./userRoutes");
const transactionRoutes = require("./transactionRoutes");
const categoryRoutes = require("./categoryRoutes");
const budgetRoutes = require("./budgetRoutes");
const goalRoutes = require("./goalRoutes");
const reportRoutes = require("./reportRoutes");
const insightsRoutes = require("./insightsRoutes");
const rpgRoutes = require("./rpg");
const exportRoutes = require("./exportRoutes");
const paymentRoutes = require("./paymentRoutes");
const notificationRoutes = require("./notificationRoutes");
const recurringTransactionRoutes = require("./recurringTransactionRoutes");
// const emailVerificationRoutes = require("./emailVerification");
const feedbackRoutes = require("./feedbackRoutes"); // Importa a nova rota

const router = express.Router();

// Verificação de saúde do servidor
router.get("/health", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Servidor operando normalmente",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

// Rotas da API
router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/transactions", transactionRoutes);
router.use("/categories", categoryRoutes);
router.use("/budgets", budgetRoutes);
router.use("/goals", goalRoutes);
router.use("/reports", reportRoutes);
router.use("/insights", insightsRoutes);
router.use("/rpg", rpgRoutes);
router.use("/export", exportRoutes);
router.use("/payment", paymentRoutes);
router.use("/notifications", notificationRoutes);
router.use("/recurring", recurringTransactionRoutes);
// router.use("/email", emailVerificationRoutes);
router.use("/feedback", feedbackRoutes); // Usa a nova rota

module.exports = router;
