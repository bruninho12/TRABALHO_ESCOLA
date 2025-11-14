/**
 * @fileoverview Logger profissional para o sistema
 * Integrado com Winston e Sentry
 */

const winston = require("winston");
const Sentry = require("@sentry/node");

if (process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV,
  });
}

const winstonLogger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [new winston.transports.Console()],
});

const colors = {
  reset: "\x1b[0m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
  gray: "\x1b[90m",
};

const levels = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  DEBUG: 3,
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
    case "DEBUG":
      color = colors.cyan;
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
};

module.exports = logger;
