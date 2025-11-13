/**
 * Email Verification Routes
 * Rotas para gerenciamento de verificação de email
 */

const express = require('express');
const router = express.Router();

const EmailVerificationController = require('../api/emailVerificationController');
const {
  emailVerificationValidations,
  handleValidationErrors
} = require('../middleware/emailVerificationValidation');

/**
 * @route   POST /api/auth/send-verification-email
 * @desc    Envia email de verificação para usuário autenticado
 * @access  Private
 */
router.post(
  '/send-verification-email',
  emailVerificationValidations.sendVerificationEmail,
  handleValidationErrors,
  EmailVerificationController.sendVerificationEmail
);

/**
 * @route   POST /api/auth/verify-email-code
 * @desc    Verifica email usando código de 6 dígitos
 * @access  Public
 */
router.post(
  '/verify-email-code',
  emailVerificationValidations.verifyEmailCode,
  handleValidationErrors,
  EmailVerificationController.verifyEmailCode
);

/**
 * @route   POST /api/auth/verify-email-token
 * @desc    Verifica email usando token (link)
 * @access  Public
 */
router.post(
  '/verify-email-token',
  emailVerificationValidations.verifyEmailToken,
  handleValidationErrors,
  EmailVerificationController.verifyEmailToken
);

/**
 * @route   POST /api/auth/resend-verification-email
 * @desc    Reenvia email de verificação
 * @access  Public
 */
router.post(
  '/resend-verification-email',
  emailVerificationValidations.resendVerificationEmail,
  handleValidationErrors,
  EmailVerificationController.resendVerificationEmail
);

/**
 * @route   GET /api/auth/verification-status
 * @desc    Obtém status de verificação do usuário
 * @access  Private
 */
router.get(
  '/verification-status',
  EmailVerificationController.getVerificationStatus
);

/**
 * @route   POST /api/admin/cleanup-verifications
 * @desc    Limpa verificações expiradas (admin only)
 * @access  Private (Admin)
 */
router.post(
  '/cleanup-verifications',
  EmailVerificationController.cleanupExpiredVerifications
);

module.exports = router;
