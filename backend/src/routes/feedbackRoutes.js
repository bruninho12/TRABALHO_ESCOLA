const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const logger = require("../utils/logger"); // Supondo que você tenha um logger

// Simulação de um banco de dados em memória para feedbacks
const feedbacks = [];

// Rota para receber feedback
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
// Você precisaria de um middleware de autenticação e autorização aqui
// Ex: router.get('/', authMiddleware, adminMiddleware, (req, res) => { ... });
router.get("/", (req, res) => {
  // Em um app real, proteja esta rota!
  res.json(feedbacks);
});

module.exports = router;
