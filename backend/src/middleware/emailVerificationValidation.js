/**
 * Email Verification Validations
 * Validações para endpoints de email verification
 */

const { body, validationResult } = require('express-validator');

const emailVerificationValidations = {
  // Validação para enviar email
  sendVerificationEmail: [
    body('userId')
      .isMongoId()
      .withMessage('ID de usuário inválido')
  ],

  // Validação para verificar código
  verifyEmailCode: [
    body('email')
      .isEmail()
      .withMessage('Email inválido')
      .normalizeEmail(),
    body('code')
      .isLength({ min: 6, max: 6 })
      .withMessage('Código deve ter 6 dígitos')
      .isNumeric()
      .withMessage('Código deve conter apenas números')
  ],

  // Validação para verificar token
  verifyEmailToken: [
    body('token')
      .isLength({ min: 64 })
      .withMessage('Token inválido')
      .isHexadecimal()
      .withMessage('Token deve ser hexadecimal')
  ],

  // Validação para reenviar email
  resendVerificationEmail: [
    body('email')
      .isEmail()
      .withMessage('Email inválido')
      .normalizeEmail()
  ]
};

/**
 * Middleware para verificar erros de validação
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }
  next();
};

module.exports = {
  emailVerificationValidations,
  handleValidationErrors
};
