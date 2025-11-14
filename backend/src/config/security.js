/**
 * @fileoverview Configurações de segurança aprimoradas para o DespFinance
 * Este arquivo centraliza todas as configurações de segurança da aplicação
 */

const rateLimit = require("express-rate-limit");
const helmet = require("helmet");

/**
 * Configuração de Rate Limiting avançada
 */
const createRateLimitConfig = () => {
  // Rate limiting para autenticação (mais restritivo)
  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 5, // Máximo 5 tentativas por IP
    message: {
      status: 429,
      message: "Muitas tentativas de login. Tente novamente em 15 minutos.",
    },
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: true, // Não contar requests bem-sucedidos
  });

  // Rate limiting geral para API
  const generalLimiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW || 15) * 60 * 1000,
    max: parseInt(process.env.RATE_LIMIT_MAX || 100),
    message: {
      status: 429,
      message: "Muitas requisições. Tente novamente mais tarde.",
    },
    standardHeaders: true,
    legacyHeaders: false,
  });

  // Rate limiting para upload de arquivos
  const uploadLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 10, // Máximo 10 uploads por IP
    message: {
      status: 429,
      message: "Muitos uploads. Tente novamente em 15 minutos.",
    },
  });

  return {
    auth: authLimiter,
    general: generalLimiter,
    upload: uploadLimiter,
  };
};

/**
 * Configuração do Helmet para headers de segurança
 */
const createHelmetConfig = () => {
  return helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'"],
        frameSrc: ["'none'"],
        objectSrc: ["'none'"],
        baseUri: ["'self'"],
      },
      reportOnly: process.env.NODE_ENV === "development", // Modo report em dev
    },
    crossOriginEmbedderPolicy: false, // Pode causar problemas com alguns recursos
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
  });
};

/**
 * Configuração CORS aprimorada
 */
const createCorsConfig = () => {
  const allowedOrigins = [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:5173", // Vite dev server
    "http://127.0.0.1:5173",
    "http://localhost:8080",
    "http://127.0.0.1:5500",
    "http://localhost:5500",
    process.env.FRONTEND_URL,
    process.env.CORS_ORIGIN,
  ].filter(Boolean); // Remove valores undefined/null

  return {
    origin: (origin, callback) => {
      // Permitir requests sem origin (mobile apps, Postman, curl)
      if (!origin) return callback(null, true);

      // Em desenvolvimento, permitir todas as origens localhost
      if (process.env.NODE_ENV === "development") {
        if (origin.includes("localhost") || origin.includes("127.0.0.1")) {
          return callback(null, true);
        }
      }

      // Verificar lista de origens permitidas
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // Rejeitar origem não autorizada
      console.warn(`🚫 CORS blocked origin: ${origin}`);
      callback(new Error(`Origin ${origin} not allowed by CORS policy`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Accept",
      "Cache-Control",
      "Pragma",
      "Expires",
      "X-CSRF-Token",
    ],
    exposedHeaders: ["X-Total-Count", "X-Page-Count"],
    optionsSuccessStatus: 200, // Para suporte a browsers antigos
  };
};

/**
 * Configurações de sanitização de input
 */
const inputSanitationConfig = {
  // Lista de campos que nunca devem ser sanitizados (senhas, etc.)
  exemptFields: ["password", "currentPassword", "newPassword"],

  // Configurações para diferentes tipos de input
  stringLimits: {
    shortText: 100,
    mediumText: 500,
    longText: 2000,
    email: 320, // RFC 5321 limit
  },

  // Patterns para validação
  patterns: {
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    phone: /^\+?[1-9]\d{1,14}$/,
    alphanumeric: /^[a-zA-Z0-9\s]+$/,
    currency: /^\d+(\.\d{1,2})?$/,
  },
};

/**
 * Configurações de validação para uploads
 */
const uploadConfig = {
  maxFileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024, // 5MB
  allowedMimeTypes: [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",
    "application/pdf",
  ],
  maxFiles: 5, // Máximo de arquivos por upload
  sanitizeFilenames: true,
};

/**
 * Configurações de sessão e autenticação
 */
const authConfig = {
  jwt: {
    algorithm: "HS256",
    issuer: "despfinance-api",
    audience: "despfinance-app",
    clockTolerance: 60, // 1 minuto de tolerância
  },

  password: {
    minLength: 8,
    maxLength: 128,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSymbols: false,
    forbiddenPasswords: [
      "12345678",
      "password",
      "senha123",
      "admin123",
      "qwerty",
    ],
  },

  session: {
    maxAge: 24 * 60 * 60 * 1000, // 24 horas
    rolling: true, // Renovar sessão a cada request
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
  },
};

/**
 * Configurações de logging de segurança
 */
const securityLoggingConfig = {
  logFailedLogins: true,
  logSuspiciousActivity: true,
  logRateLimitHits: true,
  alertThresholds: {
    failedLoginsPerMinute: 10,
    rateLimitHitsPerMinute: 50,
    suspiciousRequestsPerMinute: 20,
  },
};

module.exports = {
  rateLimiting: createRateLimitConfig(),
  helmet: createHelmetConfig(),
  cors: createCorsConfig(),
  inputSanitation: inputSanitationConfig,
  upload: uploadConfig,
  auth: authConfig,
  logging: securityLoggingConfig,
};
