// backend/config/env.js
/**
 * Environment Variables Validation
 * Verifica se todas as variáveis de ambiente necessárias estão configuradas
 */

const logger = require('../utils/logger');

class EnvValidator {
  constructor() {
    this.requiredVars = [
      'NODE_ENV',
      'PORT',
      'JWT_SECRET',
      'JWT_REFRESH_SECRET',
      'MONGODB_URI',
      'EMAIL_HOST',
      'EMAIL_USER',
      'EMAIL_PASSWORD'
    ];

    this.optionalVars = [
      'FRONTEND_URL',
      'STRIPE_SECRET_KEY',
      'MERCADO_PAGO_ACCESS_TOKEN',
      'BCRYPT_ROUNDS',
      'CORS_ORIGIN'
    ];

    this.validate();
  }

  validate() {
    const missing = [];

    // Verificar variáveis obrigatórias
    for (const variable of this.requiredVars) {
      if (!process.env[variable]) {
        missing.push(variable);
      }
    }

    if (missing.length > 0) {
      const message = `❌ Variáveis de ambiente obrigatórias faltando: ${missing.join(', ')}`;
      logger.error(message);
      throw new Error(message);
    }

    // Validações específicas
    this.validateJWT();
    this.validateEmail();
    this.validateDatabase();
    this.validatePort();

    logger.info('✅ Todas as variáveis de ambiente foram validadas com sucesso!');
  }

  validateJWT() {
    const secret = process.env.JWT_SECRET;
    const refreshSecret = process.env.JWT_REFRESH_SECRET;

    if (secret.length < 32) {
      logger.warn('⚠️  JWT_SECRET tem menos de 32 caracteres (recomendado para segurança)');
    }

    if (refreshSecret.length < 32) {
      logger.warn('⚠️  JWT_REFRESH_SECRET tem menos de 32 caracteres (recomendado para segurança)');
    }

    if (secret === refreshSecret) {
      throw new Error('❌ JWT_SECRET e JWT_REFRESH_SECRET devem ser diferentes!');
    }
  }

  validateEmail() {
    const { EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASSWORD } = process.env;

    if (!EMAIL_HOST || !EMAIL_USER || !EMAIL_PASSWORD) {
      logger.warn('⚠️  Configuração de email incompleta. Notificações por email não funcionarão.');
    }

    if (EMAIL_PORT && (EMAIL_PORT < 1 || EMAIL_PORT > 65535)) {
      throw new Error('❌ EMAIL_PORT deve estar entre 1 e 65535!');
    }
  }

  validateDatabase() {
    const { MONGODB_URI } = process.env;

    if (!MONGODB_URI) {
      throw new Error('❌ MONGODB_URI é obrigatório!');
    }

    if (!MONGODB_URI.startsWith('mongodb')) {
      logger.warn('⚠️  MONGODB_URI não parece ser uma URI MongoDB válida');
    }
  }

  validatePort() {
    const port = parseInt(process.env.PORT);

    if (isNaN(port) || port < 1 || port > 65535) {
      throw new Error('❌ PORT deve estar entre 1 e 65535!');
    }
  }

  static getConfig() {
    return {
      nodeEnv: process.env.NODE_ENV || 'development',
      port: parseInt(process.env.PORT) || 3001,
      frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
      jwtSecret: process.env.JWT_SECRET,
      jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
      jwtExpiration: process.env.JWT_EXPIRATION || '1h',
      mongodbUri: process.env.MONGODB_URI,
      emailHost: process.env.EMAIL_HOST,
      emailPort: parseInt(process.env.EMAIL_PORT) || 587,
      emailUser: process.env.EMAIL_USER,
      emailPassword: process.env.EMAIL_PASSWORD,
      stripeSecretKey: process.env.STRIPE_SECRET_KEY,
      mercadoPagoToken: process.env.MERCADO_PAGO_ACCESS_TOKEN,
      bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS) || 10,
      corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
      rateLimitWindow: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 900000,
      rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
      logLevel: process.env.LOG_LEVEL || 'debug'
    };
  }

  static isDevelopment() {
    return process.env.NODE_ENV === 'development';
  }

  static isProduction() {
    return process.env.NODE_ENV === 'production';
  }
}

// Executar validação ao carregar o módulo
if (require.main === module) {
  new EnvValidator();
  logger.info('✅ Environment validation passed!');
}

module.exports = EnvValidator;
