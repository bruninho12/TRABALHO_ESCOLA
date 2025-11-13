const express = require("express");
const paymentController = require("../controllers/paymentController");
const { authenticate } = require("../controllers/authController");

const router = express.Router();

// Todas as rotas requerem autenticação
router.use(authenticate);

// Rotas de pagamentos
router.get("/", paymentController.getPayments);
router.get("/stats", paymentController.getPaymentStats);
router.get("/subscription", paymentController.getSubscription);
router.get("/:id", paymentController.getPaymentById);
router.post("/", paymentController.createPayment);
router.post("/confirm", paymentController.confirmPayment);
router.post("/:id/refund", paymentController.refundPayment);
router.delete("/:id", paymentController.cancelPayment);

module.exports = router;
