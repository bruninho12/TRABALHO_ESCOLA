const express = require("express");
const categoryController = require("../controllers/categoryController");
const { authenticate } = require("../controllers/authController");

const router = express.Router();

// Aplicar middleware de autenticação em todas as rotas
router.use(authenticate);

// Listar categorias
router.get("/", categoryController.getCategories);

// Criar categoria
router.post("/", categoryController.createCategory);

// Atualizar categoria
router.put("/:id", categoryController.updateCategory);

// Excluir categoria
router.delete("/:id", categoryController.deleteCategory);

module.exports = router;
