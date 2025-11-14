const express = require("express");
const authRoutes = require("./authRoutes");
const userRoutes = require("./userRoutes");
const transactionRoutes = require("./transactionRoutes");
const categoryRoutes = require("./categoryRoutes");
const budgetRoutes = require("./budgetRoutes");
const reportRoutes = require("./reportRoutes");
const goalRoutes = require("./goalRoutes");
const paymentRoutes = require("./paymentRoutes");
const rpgRoutes = require("./rpg");

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
router.use("/reports", reportRoutes);
router.use("/goals", goalRoutes);
router.use("/payments", paymentRoutes);
router.use("/rpg", rpgRoutes);

module.exports = router;
