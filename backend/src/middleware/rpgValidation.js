/**
 * Middleware de validação para rotas RPG
 * Sanitiza e valida dados de entrada
 */

const { body, param, validationResult } = require("express-validator");

class RPGValidation {
  /**
   * Middleware para verificar erros de validação
   */
  static checkValidation(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Dados inválidos",
        errors: errors.array(),
      });
    }
    next();
  }

  /**
   * Validação para criação de avatar
   */
  static validateCreateAvatar() {
    return [
      body("name")
        .isString()
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage("Nome deve ter entre 2 e 50 caracteres")
        .matches(/^[a-zA-ZÀ-ÿ\s]+$/)
        .withMessage("Nome deve conter apenas letras e espaços"),

      body("characterClass")
        .isString()
        .trim()
        .isIn(["Knight", "Mage", "Rogue", "Paladin"])
        .withMessage("Classe inválida"),

      this.checkValidation,
    ];
  }

  /**
   * Validação para iniciar batalha
   */
  static validateStartBattle() {
    return [
      body("cityNumber")
        .isInt({ min: 1, max: 10 })
        .withMessage("cityNumber deve ser um número entre 1 e 10"),

      this.checkValidation,
    ];
  }

  /**
   * Validação para ação de batalha
   */
  static validateBattleAction() {
    return [
      param("battleId").isMongoId().withMessage("ID da batalha inválido"),

      body("action")
        .isString()
        .trim()
        .isIn(["attack", "defend", "special", "heal"])
        .withMessage("Ação inválida"),

      // damage é opcional - será calculado automaticamente no backend
      body("damage")
        .optional()
        .isFloat({ min: 0, max: 1000 })
        .withMessage("Dano deve ser um número entre 0 e 1000"),

      this.checkValidation,
    ];
  }

  /**
   * Validação para atualizar avatar
   */
  static validateUpdateAvatar() {
    return [
      body("name")
        .optional()
        .isString()
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage("Nome deve ter entre 2 e 50 caracteres"),

      body("characterClass")
        .optional()
        .isString()
        .trim()
        .isIn(["Knight", "Mage", "Rogue", "Paladin"])
        .withMessage("Classe inválida"),

      this.checkValidation,
    ];
  }

  /**
   * Validação para parâmetros de ID
   */
  static validateMongoId(paramName = "id") {
    return [
      param(paramName)
        .isMongoId()
        .withMessage(`${paramName} deve ser um ID válido do MongoDB`),

      this.checkValidation,
    ];
  }

  /**
   * Sanitização de entrada geral
   */
  static sanitizeInput() {
    return [body("*").trim().escape(), this.checkValidation];
  }
}

module.exports = RPGValidation;
