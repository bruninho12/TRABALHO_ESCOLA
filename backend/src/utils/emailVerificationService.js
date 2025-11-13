/**
 * Email Verification Service
 * Gerencia verificação de emails, geração de códigos e validação
 */

const crypto = require('crypto');
const User = require('../models/User');
const emailService = require('./emailService');
const logger = require('../utils/logger');

// Duração do código de verificação (24 horas em ms)
const CODE_EXPIRATION = 24 * 60 * 60 * 1000;

// Número máximo de tentativas
const MAX_VERIFICATION_ATTEMPTS = 5;

class EmailVerificationService {
  /**
   * Gera um código de verificação de 6 dígitos
   */
  static generateVerificationCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  /**
   * Gera token único para link de verificação
   */
  static generateVerificationToken() {
    return crypto.randomBytes(32).toString('hex');
  }

  /**
   * Envia email de verificação para novo usuário
   */
  static async sendVerificationEmail(user) {
    try {
      // Gera código e token
      const verificationCode = this.generateVerificationCode();
      const verificationToken = this.generateVerificationToken();
      const expiresAt = new Date(Date.now() + CODE_EXPIRATION);

      // Atualiza usuário com código
      user.emailVerification = {
        code: verificationCode,
        token: verificationToken,
        expiresAt: expiresAt,
        attempts: 0,
        verified: false,
        verifiedAt: null
      };

      await user.save();

      // URL de verificação
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      const verificationLink = `${frontendUrl}/verify-email?token=${verificationToken}&code=${verificationCode}`;

      // Prepara dados para template
      const templateData = {
        fullName: user.fullName || user.username,
        email: user.email,
        username: user.username,
        verificationCode: verificationCode,
        verificationLink: verificationLink,
        registrationDate: new Date().toLocaleDateString('pt-BR')
      };

      // Envia email
      await emailService.sendEmailFromTemplate(
        user.email,
        'Verifique seu Email - DespFinance',
        'email-verification.html',
        templateData
      );

      logger.info(`Email de verificação enviado para ${user.email}`);

      return {
        success: true,
        message: 'Email de verificação enviado com sucesso',
        expiresAt: expiresAt
      };
    } catch (error) {
      logger.error(`Erro ao enviar email de verificação: ${error.message}`);
      throw new Error('Não foi possível enviar email de verificação');
    }
  }

  /**
   * Valida código de verificação
   */
  static async verifyEmailCode(email, code) {
    try {
      const user = await User.findOne({ email });

      if (!user) {
        return {
          success: false,
          error: 'Usuário não encontrado'
        };
      }

      // Verifica se já foi verificado
      if (user.emailVerification?.verified) {
        return {
          success: false,
          error: 'Email já foi verificado'
        };
      }

      // Verifica se tem verificação pendente
      if (!user.emailVerification) {
        return {
          success: false,
          error: 'Nenhuma verificação em andamento'
        };
      }

      // Verifica expiração
      if (new Date() > new Date(user.emailVerification.expiresAt)) {
        return {
          success: false,
          error: 'Código expirado. Solicite um novo código.',
          expired: true
        };
      }

      // Verifica tentativas
      if (user.emailVerification.attempts >= MAX_VERIFICATION_ATTEMPTS) {
        return {
          success: false,
          error: 'Máximo de tentativas excedido. Solicite um novo código.',
          maxAttemptsExceeded: true
        };
      }

      // Valida código
      if (user.emailVerification.code !== code) {
        user.emailVerification.attempts += 1;
        await user.save();

        const remainingAttempts = MAX_VERIFICATION_ATTEMPTS - user.emailVerification.attempts;

        return {
          success: false,
          error: `Código incorreto. ${remainingAttempts} tentativas restantes`,
          remainingAttempts: remainingAttempts
        };
      }

      // Código correto - marca como verificado
      user.emailVerification.verified = true;
      user.emailVerification.verifiedAt = new Date();
      user.emailVerified = true;

      await user.save();

      // Envia email de confirmação
      await this.sendVerificationSuccessEmail(user);

      logger.info(`Email verificado com sucesso para ${email}`);

      return {
        success: true,
        message: 'Email verificado com sucesso!',
        user: {
          id: user._id,
          email: user.email,
          username: user.username
        }
      };
    } catch (error) {
      logger.error(`Erro ao verificar código: ${error.message}`);
      throw error;
    }
  }

  /**
   * Valida usando token (link de verificação)
   */
  static async verifyEmailToken(token) {
    try {
      const user = await User.findOne({
        'emailVerification.token': token
      });

      if (!user) {
        return {
          success: false,
          error: 'Token inválido ou expirado'
        };
      }

      // Verifica expiração
      if (new Date() > new Date(user.emailVerification.expiresAt)) {
        return {
          success: false,
          error: 'Link expirado. Solicite um novo email.',
          expired: true
        };
      }

      // Marca como verificado
      user.emailVerification.verified = true;
      user.emailVerification.verifiedAt = new Date();
      user.emailVerified = true;

      await user.save();

      // Envia email de confirmação
      await this.sendVerificationSuccessEmail(user);

      logger.info(`Email verificado via token para ${user.email}`);

      return {
        success: true,
        message: 'Email verificado com sucesso!',
        user: {
          id: user._id,
          email: user.email,
          username: user.username
        }
      };
    } catch (error) {
      logger.error(`Erro ao verificar token: ${error.message}`);
      throw error;
    }
  }

  /**
   * Reenvia código de verificação
   */
  static async resendVerificationEmail(email) {
    try {
      const user = await User.findOne({ email });

      if (!user) {
        return {
          success: false,
          error: 'Usuário não encontrado'
        };
      }

      // Verifica se já foi verificado
      if (user.emailVerified) {
        return {
          success: false,
          error: 'Email já foi verificado'
        };
      }

      // Gera novo código
      const verificationCode = this.generateVerificationCode();
      const verificationToken = this.generateVerificationToken();
      const expiresAt = new Date(Date.now() + CODE_EXPIRATION);

      user.emailVerification = {
        code: verificationCode,
        token: verificationToken,
        expiresAt: expiresAt,
        attempts: 0,
        verified: false,
        verifiedAt: null
      };

      await user.save();

      // URL de verificação
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      const verificationLink = `${frontendUrl}/verify-email?token=${verificationToken}&code=${verificationCode}`;

      // Prepara dados para template
      const templateData = {
        fullName: user.fullName || user.username,
        email: user.email,
        verificationCode: verificationCode,
        verificationLink: verificationLink,
        requestDateTime: new Date().toLocaleString('pt-BR'),
        remainingAttempts: MAX_VERIFICATION_ATTEMPTS
      };

      // Envia email
      await emailService.sendEmailFromTemplate(
        user.email,
        'Novo Código de Verificação - DespFinance',
        'email-verification-resend.html',
        templateData
      );

      logger.info(`Email de reenvio enviado para ${email}`);

      return {
        success: true,
        message: 'Email de verificação reenviado com sucesso',
        expiresAt: expiresAt
      };
    } catch (error) {
      logger.error(`Erro ao reenviar email: ${error.message}`);
      throw new Error('Não foi possível reenviar email de verificação');
    }
  }

  /**
   * Envia email de confirmação de verificação
   */
  static async sendVerificationSuccessEmail(user) {
    try {
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      const loginLink = `${frontendUrl}/login`;

      const templateData = {
        fullName: user.fullName || user.username,
        email: user.email,
        loginLink: loginLink,
        twoFactorStatus: 'Desativado',
        lastActivityTime: new Date().toLocaleString('pt-BR')
      };

      await emailService.sendEmailFromTemplate(
        user.email,
        'Email Verificado com Sucesso - DespFinance',
        'email-verification-success.html',
        templateData
      );

      logger.info(`Email de sucesso enviado para ${user.email}`);
    } catch (error) {
      logger.error(`Erro ao enviar email de sucesso: ${error.message}`);
      // Não lança erro pois já foi verificado
    }
  }

  /**
   * Obtém status de verificação do usuário
   */
  static async getVerificationStatus(userId) {
    try {
      const user = await User.findById(userId);

      if (!user) {
        return {
          success: false,
          error: 'Usuário não encontrado'
        };
      }

      return {
        success: true,
        verified: user.emailVerified,
        email: user.email,
        verificationInfo: {
          verified: user.emailVerification?.verified || false,
          verifiedAt: user.emailVerification?.verifiedAt || null,
          expiresAt: user.emailVerification?.expiresAt || null,
          attempts: user.emailVerification?.attempts || 0
        }
      };
    } catch (error) {
      logger.error(`Erro ao obter status: ${error.message}`);
      throw error;
    }
  }

  /**
   * Limpa dados de verificação expirados (janela de manutenção)
   */
  static async cleanupExpiredVerifications() {
    try {
      const result = await User.updateMany(
        {
          'emailVerification.verified': false,
          'emailVerification.expiresAt': { $lt: new Date() }
        },
        {
          $unset: { emailVerification: 1 }
        }
      );

      logger.info(`Limpeza de verificações expiradas: ${result.modifiedCount} usuários`);

      return {
        success: true,
        cleanedCount: result.modifiedCount
      };
    } catch (error) {
      logger.error(`Erro ao limpar verificações: ${error.message}`);
      throw error;
    }
  }
}

module.exports = EmailVerificationService;
