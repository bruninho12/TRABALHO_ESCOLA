/**
 * @fileoverview Middleware avançado de validação e sanitização de dados
 * Este arquivo contém validações robustas para proteger contra ataques
 */

const validator = require("validator");
const rateLimit = require("express-rate-limit");
const logger = require("../utils/logger");

/**
 * Middleware de sanitização avançada de input
 */
class AdvancedInputSanitizer {
  /**
   * Remove caracteres potencialmente perigosos
   */
  static sanitizeString(input, options = {}) {
    if (typeof input !== "string") return input;

    const {
      allowHTML = false,
      maxLength = 1000,
      trimWhitespace = true,
      removeNullBytes = true,
      escapeHTML = true,
    } = options;

    let sanitized = input;

    // Remover bytes nulos
    if (removeNullBytes) {
      // eslint-disable-next-line no-control-regex
      sanitized = sanitized.replace(/\u0000/g, "");
    }

    // Trim whitespace
    if (trimWhitespace) {
      sanitized = sanitized.trim();
    }

    // Remover/escapar HTML se não permitido
    if (!allowHTML && escapeHTML) {
      sanitized = validator.escape(sanitized);
    } else if (!allowHTML) {
      sanitized = sanitized.replace(/<[^>]*>/g, "");
    }

    // Limitar comprimento
    if (sanitized.length > maxLength) {
      sanitized = sanitized.substring(0, maxLength);
    }

    // Remover caracteres de controle perigosos
    // eslint-disable-next-line no-control-regex
    sanitized = sanitized.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "");

    return sanitized;
  }

  /**
   * Sanitiza objetos recursivamente
   */
  static sanitizeObject(obj, options = {}) {
    if (!obj || typeof obj !== "object") return obj;

    const sanitized = Array.isArray(obj) ? [] : {};

    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === "string") {
        sanitized[key] = this.sanitizeString(value, options);
      } else if (typeof value === "object" && value !== null) {
        sanitized[key] = this.sanitizeObject(value, options);
      } else {
        sanitized[key] = value;
      }
    }

    return sanitized;
  }

  /**
   * Middleware principal de sanitização
   */
  static middleware(options = {}) {
    return (req, res, next) => {
      try {
        // Sanitizar body
        if (req.body && typeof req.body === "object") {
          req.body = this.sanitizeObject(req.body, options);
        }

        // Sanitizar query parameters
        if (req.query && typeof req.query === "object") {
          req.query = this.sanitizeObject(req.query, {
            ...options,
            maxLength: 200, // Query params geralmente são menores
          });
        }

        // Sanitizar params
        if (req.params && typeof req.params === "object") {
          req.params = this.sanitizeObject(req.params, {
            ...options,
            maxLength: 100,
          });
        }

        next();
      } catch (error) {
        logger.error("Erro na sanitização de input:", error);
        res.status(400).json({
          success: false,
          message: "Dados de entrada inválidos",
        });
      }
    };
  }
}

/**
 * Validações de segurança específicas
 */
class SecurityValidation {
  /**
   * Valida senha forte
   */
  static validateStrongPassword(password) {
    const minLength = 8;
    const maxLength = 128;

    if (!password || password.length < minLength) {
      return {
        isValid: false,
        message: `Senha deve ter pelo menos ${minLength} caracteres`,
      };
    }

    if (password.length > maxLength) {
      return {
        isValid: false,
        message: `Senha não pode ter mais de ${maxLength} caracteres`,
      };
    }

    // Verificar caracteres obrigatórios
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (!hasUppercase) {
      return {
        isValid: false,
        message: "Senha deve conter pelo menos uma letra maiúscula",
      };
    }

    if (!hasLowercase) {
      return {
        isValid: false,
        message: "Senha deve conter pelo menos uma letra minúscula",
      };
    }

    if (!hasNumbers) {
      return {
        isValid: false,
        message: "Senha deve conter pelo menos um número",
      };
    }

    if (!hasSpecialChars) {
      return {
        isValid: false,
        message: "Senha deve conter pelo menos um caractere especial",
      };
    }

    if (!hasNumbers) {
      return {
        isValid: false,
        message: "Senha deve conter pelo menos um número",
      };
    }

    // Lista de senhas comuns proibidas
    const commonPasswords = [
      "12345678",
      "password",
      "senha123",
      "admin123",
      "qwerty",
      "123456789",
      "password123",
      "admin",
      "user",
      "guest",
      "test",
      "12345678",
    ];

    if (commonPasswords.includes(password.toLowerCase())) {
      return {
        isValid: false,
        message: "Senha muito comum. Escolha uma senha mais segura",
      };
    }

    return { isValid: true };
  }

  /**
   * Valida email com verificações avançadas
   */
  static validateEmail(email) {
    if (!email || typeof email !== "string") {
      return {
        isValid: false,
        message: "Email é obrigatório",
      };
    }

    // Sanitizar email
    const sanitizedEmail = validator.normalizeEmail(email.trim(), {
      all_lowercase: true,
      gmail_remove_dots: false,
    });

    if (!sanitizedEmail) {
      return {
        isValid: false,
        message: "Formato de email inválido",
      };
    }

    // Validar formato
    if (!validator.isEmail(sanitizedEmail)) {
      return {
        isValid: false,
        message: "Formato de email inválido",
      };
    }

    // Verificar domínios bloqueados (opcionalmente)
    const blockedDomains = [
      "tempmail.com",
      "10minutemail.com",
      "guerrillamail.com",
    ];
    const domain = sanitizedEmail.split("@")[1];

    if (blockedDomains.includes(domain)) {
      return {
        isValid: false,
        message: "Este provedor de email não é aceito",
      };
    }

    return { isValid: true, sanitizedEmail };
  }

  /**
   * Valida valores monetários
   */
  static validateCurrency(amount) {
    if (amount === null || amount === undefined) {
      return {
        isValid: false,
        message: "Valor é obrigatório",
      };
    }

    const numericAmount = parseFloat(amount);

    if (isNaN(numericAmount)) {
      return {
        isValid: false,
        message: "Valor deve ser numérico",
      };
    }

    if (numericAmount < 0) {
      return {
        isValid: false,
        message: "Valor não pode ser negativo",
      };
    }

    if (numericAmount > 999999999.99) {
      return {
        isValid: false,
        message: "Valor muito alto",
      };
    }

    // Verificar máximo de 2 casas decimais
    if (!/^\d+(\.\d{1,2})?$/.test(amount.toString())) {
      return {
        isValid: false,
        message: "Valor deve ter no máximo 2 casas decimais",
      };
    }

    return { isValid: true, sanitizedAmount: numericAmount };
  }
}

/**
 * Rate limiting específico para diferentes endpoints
 */
class AdaptiveRateLimiting {
  /**
   * Rate limiting para login/autenticação
   */
  static authLimiter() {
    return rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutos
      max: 5, // 5 tentativas por IP
      skipSuccessfulRequests: true,
      keyGenerator: (req) => {
        // Combinar IP e email para rate limiting mais preciso
        const email = req.body?.email || "unknown";
        return `auth_${req.ip}_${email}`;
      },
      message: {
        success: false,
        message: "Muitas tentativas de login. Tente novamente em 15 minutos.",
        retryAfter: 15 * 60,
      },
      standardHeaders: true,
      legacyHeaders: false,
    });
  }

  /**
   * Rate limiting para criação de recursos
   */
  static createResourceLimiter(resourceName, maxPerHour = 10) {
    return rateLimit({
      windowMs: 60 * 60 * 1000, // 1 hora
      max: maxPerHour,
      keyGenerator: (req) => `create_${resourceName}_${req.user?.id || req.ip}`,
      message: {
        success: false,
        message: `Muitas criações de ${resourceName}. Tente novamente em 1 hora.`,
        retryAfter: 60 * 60,
      },
    });
  }

  /**
   * Rate limiting para uploads
   */
  static uploadLimiter() {
    return rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutos
      max: 5, // 5 uploads por usuário
      keyGenerator: (req) => `upload_${req.user?.id || req.ip}`,
      message: {
        success: false,
        message: "Muitos uploads. Tente novamente em 15 minutos.",
        retryAfter: 15 * 60,
      },
    });
  }
}

/**
 * Middleware de detecção de anomalias
 */
class AnomalyDetection {
  constructor() {
    if (!AnomalyDetection.suspiciousPatterns) {
      AnomalyDetection.suspiciousPatterns = new Map();
    }
  }

  /**
   * Detecta padrões suspeitos de requisições
   */
  static detectSuspiciousActivity() {
    return (req, res, next) => {
      const clientId = req.ip;
      const userAgent = req.get("User-Agent") || "unknown";
      const endpoint = req.path;

      // Detectar user agents suspeitos
      const suspiciousUserAgents = [
        "sqlmap",
        "nmap",
        "nikto",
        "curl/7",
        "wget",
        "python-requests",
        "bot",
        "crawler",
        "spider",
      ];

      const isSuspiciousUserAgent = suspiciousUserAgents.some((pattern) =>
        userAgent.toLowerCase().includes(pattern)
      );

      if (isSuspiciousUserAgent) {
        logger.warn(
          `Suspicious user agent detected: ${userAgent} from ${clientId}`
        );
      }

      // Detectar tentativas de path traversal
      if (endpoint.includes("../") || endpoint.includes("..\\")) {
        logger.warn(
          `Path traversal attempt detected: ${endpoint} from ${clientId}`
        );
        return res.status(400).json({
          success: false,
          message: "Requisição inválida",
        });
      }

      // Detectar tentativas de injeção
      const sqlInjectionPatterns = [
        /union\s+select/i,
        /drop\s+table/i,
        /delete\s+from/i,
        /insert\s+into/i,
        /update\s+set/i,
        /'.*or.*'/i,
        /1=1/i,
      ];

      const requestString = JSON.stringify({
        query: req.query,
        body: req.body,
        params: req.params,
      }).toLowerCase();

      const hasSQLInjection = sqlInjectionPatterns.some((pattern) =>
        pattern.test(requestString)
      );

      if (hasSQLInjection) {
        logger.warn(
          `SQL injection attempt detected from ${clientId}: ${requestString}`
        );
        return res.status(400).json({
          success: false,
          message: "Requisição contém dados suspeitos",
        });
      }

      next();
    };
  }
}

module.exports = {
  AdvancedInputSanitizer,
  SecurityValidation,
  AdaptiveRateLimiting,
  AnomalyDetection,
};
