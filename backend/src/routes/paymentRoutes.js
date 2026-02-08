const express = require("express");
const paymentController = require("../controllers/paymentController");
const webhookController = require("../controllers/webhookController");
const { authenticate } = require("../middleware/auth");

const router = express.Router();

// ===== WEBHOOKS (SEM AUTENTICAÇÃO) =====
// Webhooks precisam receber raw body, configurado no server.js
router.post("/webhook/stripe", webhookController.handleStripeWebhook);
router.post("/webhook/mercadopago", paymentController.mercadoPagoWebhook);

// ===== ROTAS AUTENTICADAS =====
router.use(authenticate);

// Middleware de debug
router.use((req, res, next) => {
  console.log(`🔍 [Payment Route] ${req.method} ${req.path}`);
  next();
});

// ===== ROTAS ESPECÍFICAS (DEVEM VIR ANTES DE /:id) =====

// Rotas de stats e métodos de pagamento
router.get("/stats", paymentController.getPaymentStats);
router.get("/methods", paymentController.getPaymentMethods);
router.post("/methods", paymentController.addPaymentMethod);
router.delete("/methods/:methodId", paymentController.removePaymentMethod);
router.put(
  "/methods/:methodId/default",
  paymentController.setDefaultPaymentMethod
);

// Histórico de pagamentos
router.get("/billing/history", paymentController.getBillingHistory);
router.get("/history", paymentController.getBillingHistory); // Alias para compatibilidade

// Configurações de assinatura
router.get("/subscription", paymentController.getSubscription);
router.get("/subscription/details", paymentController.getSubscription);
router.put("/subscription", paymentController.updateSubscription);
router.delete("/subscription", paymentController.cancelSubscription);
router.put("/subscription/auto-renewal", paymentController.updateAutoRenewal);

// MercadoPago métodos de pagamento
router.get(
  "/mercadopago/methods",
  paymentController.getMercadoPagoPaymentMethods
);
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

// Ações de confirmação e refund (específicas)
router.post("/confirm", paymentController.confirmPayment);

// ===== ROTAS GERAIS (MAIS GENÉRICAS POR ÚLTIMO) =====
router.get("/", paymentController.getPayments);
router.post("/", paymentController.createPayment);
router.get("/:id", paymentController.getPaymentById);
router.post("/:id/refund", paymentController.refundPayment);
router.delete("/:id", paymentController.cancelPayment);

module.exports = router;
