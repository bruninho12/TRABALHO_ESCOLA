const express = require("express");
const goalController = require("../controllers/goalController");
const { authenticate } = require("../controllers/authController");

const router = express.Router();

// Evitar cache
router.use((req, res, next) => {
  res.setHeader(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, max-age=0"
  );
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  next();
});

// Autenticação obrigatória
router.use(authenticate);

// Rotas específicas **ANTES** das dinâmicas
router.get("/summary", goalController.getSummary);
router.get("/deadlines", goalController.getUpcomingDeadlines);
router.get("/progress", goalController.getGoalsProgress);

// Criar meta (POST precisa vir ANTES de GET "/")
router.post("/", goalController.create);

// Listar metas
router.get("/", goalController.getAll);

// Adicionar valor
router.post("/:id/add-value", goalController.addValue);

// Obter meta por ID
router.get("/:id", goalController.getById);

// Atualizar meta
router.put("/:id", goalController.update);

// Excluir meta
router.delete("/:id", goalController.delete);

module.exports = router;
