const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const logger = require("../utils/logger"); // Supondo que você tenha um logger
const { authenticate } = require("../middleware/auth");
const { requireAdmin } = require("../middleware/adminAuth");

// Simulação de um banco de dados em memória para feedbacks
const feedbacks = [];

// Rota para receber feedback (pode ser anônima)
router.post(
  "/",
  [
    body("message")
      .notEmpty()
      .withMessage("A mensagem de feedback não pode estar vazia.")
      .isLength({ min: 10 })
      .withMessage("O feedback deve ter pelo menos 10 caracteres."),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.warn("Tentativa de envio de feedback inválido", {
        errors: errors.array(),
      });
      return res.status(400).json({ errors: errors.array() });
    }

    const { message } = req.body;
    const newFeedback = {
      id: feedbacks.length + 1,
      message,
      createdAt: new Date(),
      user: req.user ? req.user.id : "anonymous", // Associa ao usuário se logado
    };

    feedbacks.push(newFeedback);
    logger.info("Novo feedback recebido", {
      feedbackId: newFeedback.id,
      userId: newFeedback.user,
    });

    res.status(201).json({
      message: "Feedback recebido com sucesso! Agradecemos sua contribuição.",
      feedback: newFeedback,
    });
  }
);

// Rota para administradores visualizarem os feedbacks (protegida)
router.get("/", authenticate, requireAdmin, (req, res) => {
  res.json(feedbacks);
});

module.exports = router;

