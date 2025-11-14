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

// Listar metas
router.get("/", goalController.getAll);

// Obter meta por ID
router.get("/:id", goalController.getById);

// Criar meta
router.post("/", goalController.create);

// Atualizar meta
router.put("/:id", goalController.update);

// Excluir meta
router.delete("/:id", goalController.delete);

module.exports = router;
