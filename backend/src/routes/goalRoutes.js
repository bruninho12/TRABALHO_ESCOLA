const express = require("express");
const goalController = require("../controllers/goalController");
const { authenticate } = require("../controllers/authController");

const router = express.Router();

// Middleware para desabilitar cache nas rotas de goals
router.use((req, res, next) => {
  res.setHeader(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, max-age=0"
  );
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  next();
});

// Aplicar middleware de autenticação em todas as rotas
router.use(authenticate);

// Rotas específicas devem vir ANTES das rotas com parâmetros dinâmicos
// Resumo das metas
router.get("/summary", goalController.getSummary);

// Prazos próximos
router.get("/deadlines", goalController.getUpcomingDeadlines);

// Progresso das metas (alias para summary)
router.get("/progress", goalController.getGoalsProgress);

// Listar metas
router.get("/", goalController.getAll);

// Adicionar valor à meta
router.post("/:id/add-value", goalController.addValue);

// Obter meta por ID
router.get("/:id", goalController.getById);

// Criar meta
router.post("/", goalController.create);

// Atualizar meta
router.put("/:id", goalController.update);

// Excluir meta
router.delete("/:id", goalController.delete);

module.exports = router;
