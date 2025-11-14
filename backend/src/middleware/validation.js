/**
 * Validações para DespFinance
 * Usando Joi para validação robusta
 */

const { body, param, query, validationResult } = require("express-validator");
const logger = require("../utils/logger");

class ValidationRules {
  // ==================== AUTH ====================

  static registerRules() {
    return [
      body("name")
        .trim()
        .notEmpty()
        .withMessage("Nome é obrigatório")
        .isLength({ min: 2, max: 100 })
        .withMessage("Nome deve ter entre 2 e 100 caracteres"),
      body("email")
        .trim()
        .isEmail()
        .withMessage("Email inválido")
        .normalizeEmail(),
      body("password")
        .isLength({ min: 8 })
        .withMessage("Senha deve ter no mínimo 8 caracteres")
        .matches(/[A-Z]/)
        .withMessage("Senha deve conter pelo menos uma letra maiúscula")
        .matches(/[a-z]/)
        .withMessage("Senha deve conter pelo menos uma letra minúscula")
        .matches(/[0-9]/)
        .withMessage("Senha deve conter pelo menos um número"),
      body("confirmPassword")
        .custom((value, { req }) => value === req.body.password)
        .withMessage("As senhas não coincidem"),
    ];
  }

  static loginRules() {
    return [
      body("email")
        .trim()
        .isEmail()
        .withMessage("Email inválido")
        .normalizeEmail(),
      body("password").notEmpty().withMessage("Senha é obrigatória"),
    ];
  }

  static changePasswordRules() {
    return [
      body("currentPassword")
        .notEmpty()
        .withMessage("Senha atual é obrigatória"),
      body("newPassword")
        .isLength({ min: 8 })
        .withMessage("Nova senha deve ter no mínimo 8 caracteres")
        .matches(/[A-Z]/)
        .withMessage("Nova senha deve conter pelo menos uma letra maiúscula")
        .matches(/[0-9]/)
        .withMessage("Nova senha deve conter pelo menos um número"),
      body("confirmPassword")
        .custom((value, { req }) => value === req.body.newPassword)
        .withMessage("As senhas não coincidem"),
    ];
  }

  // ==================== TRANSACTIONS ====================

  static createTransactionRules() {
    return [
      body("description")
        .trim()
        .notEmpty()
        .withMessage("Descrição é obrigatória")
        .isLength({ max: 200 })
        .withMessage("Descrição não pode ter mais de 200 caracteres"),
      body("amount")
        .notEmpty()
        .withMessage("Valor é obrigatório")
        .isFloat({ gt: 0 })
        .withMessage("Valor deve ser maior que zero"),
      body("type")
        .notEmpty()
        .withMessage("Tipo é obrigatório")
        .isIn(["income", "expense"])
        .withMessage("Tipo deve ser income ou expense"),
      body("category").trim().notEmpty().withMessage("Categoria é obrigatória"),
      body("date")
        .notEmpty()
        .withMessage("Data é obrigatória")
        .isISO8601()
        .withMessage("Data inválida"),
    ];
  }

  static updateTransactionRules() {
    return [
      body("description")
        .optional()
        .trim()
        .isLength({ max: 200 })
        .withMessage("Descrição não pode ter mais de 200 caracteres"),
      body("amount")
        .optional()
        .isFloat({ gt: 0 })
        .withMessage("Valor deve ser maior que zero"),
      body("type")
        .optional()
        .isIn(["income", "expense"])
        .withMessage("Tipo deve ser income ou expense"),
      body("category").optional().trim(),
      body("date").optional().isISO8601().withMessage("Data inválida"),
    ];
  }

  // ==================== GOALS ====================

  static createGoalRules() {
    return [
      body("title")
        .trim()
        .notEmpty()
        .withMessage("Título é obrigatório")
        .isLength({ max: 100 })
        .withMessage("Título não pode ter mais de 100 caracteres"),
      body("description")
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage("Descrição não pode ter mais de 500 caracteres"),
      body("targetAmount")
        .notEmpty()
        .withMessage("Valor alvo é obrigatório")
        .isFloat({ gt: 0 })
        .withMessage("Valor alvo deve ser maior que zero"),
      body("deadline")
        .notEmpty()
        .withMessage("Data limite é obrigatória")
        .isISO8601()
        .withMessage("Data inválida")
        .custom((value) => {
          const deadline = new Date(value);
          if (deadline < new Date()) {
            throw new Error("Data limite deve estar no futuro");
          }
          return true;
        }),
    ];
  }

  static updateGoalRules() {
    return [
      body("title")
        .optional()
        .trim()
        .isLength({ max: 100 })
        .withMessage("Título não pode ter mais de 100 caracteres"),
      body("description")
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage("Descrição não pode ter mais de 500 caracteres"),
      body("targetAmount")
        .optional()
        .isFloat({ gt: 0 })
        .withMessage("Valor alvo deve ser maior que zero"),
      body("deadline").optional().isISO8601().withMessage("Data inválida"),
    ];
  }

  static addContributionRules() {
    return [
      body("amount")
        .notEmpty()
        .withMessage("Valor é obrigatório")
        .isFloat({ gt: 0 })
        .withMessage("Valor deve ser maior que zero"),
    ];
  }

  // ==================== COMMON ====================

  static paginationRules() {
    return [
      query("page")
        .optional()
        .isInt({ min: 1 })
        .withMessage("Página deve ser um número maior que 0"),
      query("limit")
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage("Limite deve estar entre 1 e 100"),
    ];
  }

  static idParamRules() {
    return [param("id").notEmpty().withMessage("ID é obrigatório")];
  }

  // ==================== MIDDLEWARE ====================

  static validate(req, res, next) {
    if (!next || typeof next !== "function") {
      logger.error("Validation middleware called without proper next function");
      return res.status(500).json({
        success: false,
        message: "Erro interno do servidor",
      });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.warn(`Validation error: ${JSON.stringify(errors.array())}`);
      return res.status(400).json({
        success: false,
        message: "Erros de validação",
        errors: errors.array().map((err) => ({
          field: err.param,
          message: err.msg,
        })),
      });
    }
    next();
  }
}

// Função utilitária para criar middleware que valida usando as rules
function validate(rules) {
  return [...(Array.isArray(rules) ? rules : []), ValidationRules.validate];
}

module.exports = ValidationRules;
module.exports.validate = validate;
