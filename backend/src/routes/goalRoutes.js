const express = require("express");
const goalController = require("../controllers/goalController");
const { authenticate } = require("../controllers/authController");

const router = express.Router();

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
