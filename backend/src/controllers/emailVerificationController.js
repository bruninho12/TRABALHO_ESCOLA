/**
 * Email Verification Controller
 * Gerencia endpoints de verificação de email
 */

const EmailVerificationService = require('../services/emailVerificationService');
const { validationResult } = require('express-validator');
const logger = require('../utils/logger');
const apiResponse = require('../utils/apiResponse');

class EmailVerificationController {
  /**
   * POST /api/auth/send-verification-email
   * Envia email de verificação para novo usuário
   */
  static async sendVerificationEmail(req, res) {
    try {
      // Validação de erros
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return apiResponse.error(res, 400, 'Dados inválidos', errors.array());
      }

      const { userId } = req.body;

      // Verifica se usuário está autenticado
      if (req.user._id !== userId) {
        return apiResponse.error(res, 403, 'Acesso negado');
      }

      const user = req.user;

      // Verifica se email já foi verificado
      if (user.emailVerified) {
        return apiResponse.error(res, 400, 'Email já foi verificado');
      }

      // Envia email
      const result = await EmailVerificationService.sendVerificationEmail(user);

      return apiResponse.success(res, 200, result.message, {
        email: user.email,
        expiresAt: result.expiresAt,
        codeLength: 6
      });
    } catch (error) {
      logger.error(`Erro ao enviar verificação: ${error.message}`);
      return apiResponse.error(res, 500, 'Erro ao enviar email de verificação');
    }
  }

  /**
   * POST /api/auth/verify-email-code
   * Verifica usando código de 6 dígitos
   */
  static async verifyEmailCode(req, res) {
    try {
      // Validação de erros
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return apiResponse.error(res, 400, 'Dados inválidos', errors.array());
      }

      const { email, code } = req.body;

      // Valida código
      const result = await EmailVerificationService.verifyEmailCode(email, code);

      if (!result.success) {
        const statusCode = result.expired || result.maxAttemptsExceeded ? 400 : 400;
        return apiResponse.error(res, statusCode, result.error);
      }

      return apiResponse.success(res, 200, result.message, {
        user: result.user,
        verified: true
      });
    } catch (error) {
      logger.error(`Erro ao verificar código: ${error.message}`);
      return apiResponse.error(res, 500, 'Erro ao verificar email');
    }
  }

  /**
   * POST /api/auth/verify-email-token
   * Verifica usando token (link de verificação)
   */
  static async verifyEmailToken(req, res) {
    try {
      // Validação de erros
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return apiResponse.error(res, 400, 'Dados inválidos', errors.array());
      }

      const { token } = req.body;

      // Valida token
      const result = await EmailVerificationService.verifyEmailToken(token);

      if (!result.success) {
        return apiResponse.error(res, 400, result.error);
      }

      return apiResponse.success(res, 200, result.message, {
        user: result.user,
        verified: true
      });
    } catch (error) {
      logger.error(`Erro ao verificar token: ${error.message}`);
      return apiResponse.error(res, 500, 'Erro ao verificar email');
    }
  }

  /**
   * POST /api/auth/resend-verification-email
   * Reenvia email de verificação
   */
  static async resendVerificationEmail(req, res) {
    try {
      // Validação de erros
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return apiResponse.error(res, 400, 'Dados inválidos', errors.array());
      }

      const { email } = req.body;

      // Reenvia email
      const result = await EmailVerificationService.resendVerificationEmail(email);

      if (!result.success) {
        return apiResponse.error(res, 400, result.error);
      }

      return apiResponse.success(res, 200, result.message, {
        email: email,
        expiresAt: result.expiresAt,
        message: 'Novo código enviado para seu email'
      });
    } catch (error) {
      logger.error(`Erro ao reenviar email: ${error.message}`);
      return apiResponse.error(res, 500, 'Erro ao reenviar email');
    }
  }

  /**
   * GET /api/auth/verification-status
   * Obtém status de verificação do usuário
   */
  static async getVerificationStatus(req, res) {
    try {
      // Verifica se autenticado
      if (!req.user) {
        return apiResponse.error(res, 401, 'Não autenticado');
      }

      // Obtém status
      const result = await EmailVerificationService.getVerificationStatus(req.user._id);

      if (!result.success) {
        return apiResponse.error(res, 404, result.error);
      }

      return apiResponse.success(res, 200, 'Status obtido com sucesso', result);
    } catch (error) {
      logger.error(`Erro ao obter status: ${error.message}`);
      return apiResponse.error(res, 500, 'Erro ao obter status');
    }
  }

  /**
   * POST /api/admin/cleanup-verifications
   * Limpa verificações expiradas (admin only)
   */
  static async cleanupExpiredVerifications(req, res) {
    try {
      // Verifica se é admin
      if (req.user?.role !== 'admin') {
        return apiResponse.error(res, 403, 'Acesso negado. Apenas admins podem executar esta ação');
      }

      // Limpa
      const result = await EmailVerificationService.cleanupExpiredVerifications();

      return apiResponse.success(res, 200, 'Limpeza concluída', result);
    } catch (error) {
      logger.error(`Erro ao limpar: ${error.message}`);
      return apiResponse.error(res, 500, 'Erro ao limpar verificações');
    }
  }
}

module.exports = EmailVerificationController;
