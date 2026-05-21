const express = require("express");
const categoryController = require("../controllers/categoryController");
const { authenticate } = require("../middleware/auth");
const { validate } = require("../middleware/validation-joi");
const { categorySchemas } = require("../utils/validationSchemas");
const Joi = require("joi");

const router = express.Router();

// Esquemas de validação para categorias
const createCategoryValidation = Joi.object({
  body: categorySchemas.create,
  params: Joi.object().unknown(true),
  query: Joi.object().unknown(true),
});

const updateCategoryValidation = Joi.object({
  body: categorySchemas.update,
  params: Joi.object().unknown(true),
  query: Joi.object().unknown(true),
});

// Aplicar middleware de autenticação em todas as rotas
router.use(authenticate);

// Listar categorias
router.get("/", categoryController.getCategories);

// Criar categoria
router.post(
  "/",
  validate(createCategoryValidation),
  categoryController.createCategory
);

// Atualizar categoria
router.put(
  "/:id",
  validate(updateCategoryValidation),
  categoryController.updateCategory
);

// Excluir categoria
router.delete("/:id", categoryController.deleteCategory);

module.exports = router;

