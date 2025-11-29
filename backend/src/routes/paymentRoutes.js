const express = require("express");
const paymentController = require("../controllers/paymentController");
const webhookController = require("../controllers/webhookController");
const { authenticate } = require("../controllers/authController");

const router = express.Router();

// ===== WEBHOOKS (SEM AUTENTICAÇÃO) =====
// Webhooks precisam receber raw body, configurado no server.js
router.post("/webhook/stripe", webhookController.handleStripeWebhook);
router.post("/webhook/mercadopago", paymentController.mercadoPagoWebhook);

// ===== ROTAS AUTENTICADAS =====
router.use(authenticate);

// Rotas de pagamentos gerais
router.get("/", paymentController.getPayments);
router.get("/stats", paymentController.getPaymentStats);
router.get("/subscription", paymentController.getSubscription);
router.get("/:id", paymentController.getPaymentById);
router.post("/", paymentController.createPayment);
router.post("/confirm", paymentController.confirmPayment);
router.post("/:id/refund", paymentController.refundPayment);
router.delete("/:id", paymentController.cancelPayment);

// ===== MERCADO PAGO =====
router.post(
  "/mercadopago/preference",
  paymentController.createMercadoPagoPreference
);
router.post(
  "/mercadopago/create-preference",
  paymentController.createMercadoPagoPreference
);
router.post(
  "/mercadopago/create-pix",
  paymentController.createMercadoPagoDirectPayment
);
router.post(
  "/mercadopago/direct",
  paymentController.createMercadoPagoDirectPayment
);
router.get(
  "/mercadopago/methods",
  paymentController.getMercadoPagoPaymentMethods
);

module.exports = router;
