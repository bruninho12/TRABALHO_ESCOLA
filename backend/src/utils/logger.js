/**
 * @fileoverview Logger profissional para o sistema
 * Integrado com Winston e Sentry + melhorias de segurança
 */

const winston = require("winston");
const Sentry = require("@sentry/node");
const path = require("path");
const fs = require("fs");

if (process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV,
  });
}

// Garantir que o diretório de logs existe
const logsDir = path.join(process.cwd(), "logs");
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Configuração de níveis customizados
const customLevels = {
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    security: 3,
    debug: 4,
    trace: 5,
  },
  colors: {
    error: "red",
    warn: "yellow",
    info: "green",
    security: "magenta",
    debug: "cyan",
    trace: "gray",
  },
};

winston.addColors(customLevels.colors);

const winstonLogger = winston.createLogger({
  levels: customLevels.levels,
  level: process.env.LOG_LEVEL || "info",
  format: winston.format.combine(
    winston.format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    // Console
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.printf(({ level, message, timestamp, ...meta }) => {
          return `[${timestamp}] ${level}: ${message} ${
            Object.keys(meta).length ? JSON.stringify(meta) : ""
          }`;
        })
      ),
    }),
    // Arquivo geral
    new winston.transports.File({
      filename: path.join(logsDir, "app.log"),
      level: "debug",
      maxsize: 10 * 1024 * 1024, // 10MB
      maxFiles: 5,
    }),
    // Arquivo de erros
    new winston.transports.File({
      filename: path.join(logsDir, "error.log"),
      level: "error",
      maxsize: 5 * 1024 * 1024, // 5MB
      maxFiles: 3,
    }),
    // Arquivo de segurança
    new winston.transports.File({
      filename: path.join(logsDir, "security.log"),
      level: "security",
      maxsize: 10 * 1024 * 1024, // 10MB
      maxFiles: 5,
    }),
  ],
});

const colors = {
  reset: "\x1b[0m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
  gray: "\x1b[90m",
  magenta: "\x1b[35m",
};

const levels = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  SECURITY: 3,
  DEBUG: 4,
  TRACE: 5,
};

// Log level pode ser configurado via env, padrão é INFO
// eslint-disable-next-line no-unused-vars
const currentLogLevel =
  levels[process.env.LOG_LEVEL?.toUpperCase() || "INFO"] || 2;

const formatTimestamp = () => {
  return new Date().toLocaleTimeString("pt-BR", {
    hour12: false,
    timeZone: "America/Sao_Paulo",
  });
};

// eslint-disable-next-line no-unused-vars
const formatMessage = (level, message, data = null) => {
  const timestamp = formatTimestamp();
  let color = colors.reset;

  switch (level) {
    case "ERROR":
      color = colors.red;
      break;
    case "WARN":
      color = colors.yellow;
      break;
    case "INFO":
      color = colors.green;
      break;
    case "SECURITY":
      color = colors.magenta;
      break;
    case "DEBUG":
      color = colors.cyan;
      break;
    case "TRACE":
      color = colors.gray;
      break;
  }

  let output = `${color}[${timestamp}] [${level}]${colors.reset} ${message}`;

  if (data) {
    if (typeof data === "object") {
      output += `\n${JSON.stringify(data, null, 2)}`;
    } else {
      output += `\n${data}`;
    }
  }

  return output;
};

const logger = {
  error: (message, data = null) => {
    winstonLogger.error(message, { data });
    if (process.env.SENTRY_DSN) Sentry.captureException(message);
  },
  warn: (message, data = null) => {
    winstonLogger.warn(message, { data });
  },
  info: (message, data = null) => {
    winstonLogger.info(message, { data });
  },
  debug: (message, data = null) => {
    winstonLogger.debug(message, { data });
  },
  success: (message, data = null) => {
    winstonLogger.info(`[SUCCESS] ${message}`, { data });
  },
  section: (title) => {
    winstonLogger.info(`[SECTION] ${title}`);
  },

  // ========= NOVOS MÉTODOS DE SEGURANÇA =========

  security: (message, meta = {}) => {
    winstonLogger.log("security", message, {
      ...meta,
      timestamp: new Date().toISOString(),
      type: "security_event",
    });
  },

  audit: (action, user, details = {}) => {
    logger.security(`AUDIT: ${action}`, {
      user: {
        id: user?.id || user?._id,
        email: user?.email,
        ip: details.ip,
      },
      action,
      details,
      timestamp: new Date().toISOString(),
    });
  },

  loginAttempt: (email, success, ip, userAgent = "") => {
    const message = success
      ? `LOGIN SUCCESS: ${email}`
      : `LOGIN FAILED: ${email}`;

    logger.security(message, {
      email,
      success,
      ip,
      userAgent,
      timestamp: new Date().toISOString(),
      type: "login_attempt",
    });
  },

  critical: (operation, user, details = {}) => {
    logger.error(`CRITICAL OPERATION: ${operation}`, {
      user: {
        id: user?.id || user?._id,
        email: user?.email,
      },
      operation,
      details,
      timestamp: new Date().toISOString(),
      type: "critical_operation",
    });
  },

  performance: (operation, duration, details = {}) => {
    const level = duration > 1000 ? "warn" : "info";
    logger[level](`PERFORMANCE: ${operation} took ${duration}ms`, {
      operation,
      duration,
      details,
      timestamp: new Date().toISOString(),
      type: "performance",
    });
  },

  suspiciousActivity: (activity, ip, details = {}) => {
    logger.security(`SUSPICIOUS ACTIVITY: ${activity}`, {
      ip,
      activity,
      details,
      timestamp: new Date().toISOString(),
      type: "suspicious_activity",
    });
  },
};

// Captura de erros não tratados
process.on("uncaughtException", (error) => {
  logger.error("Uncaught Exception:", error);
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  logger.error("Unhandled Rejection:", { promise, reason });
});

module.exports = logger;
