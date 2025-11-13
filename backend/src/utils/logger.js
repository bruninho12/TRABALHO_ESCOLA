/**
 * @fileoverview Logger simples para o sistema
 * Pode ser expandido com Winston ou outro logger profissional
 */

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

const currentLogLevel =
  levels[process.env.LOG_LEVEL?.toUpperCase() || "INFO"] || 2;

const formatTimestamp = () => {
  return new Date().toLocaleTimeString("pt-BR", {
    hour12: false,
    timeZone: "America/Sao_Paulo",
  });
};

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
    if (levels.ERROR <= currentLogLevel) {
      console.error(formatMessage("ERROR", message, data));
    }
  },

  warn: (message, data = null) => {
    if (levels.WARN <= currentLogLevel) {
      console.warn(formatMessage("WARN", message, data));
    }
  },

  info: (message, data = null) => {
    if (levels.INFO <= currentLogLevel) {
      console.log(formatMessage("INFO", message, data));
    }
  },

  debug: (message, data = null) => {
    if (levels.DEBUG <= currentLogLevel) {
      console.log(formatMessage("DEBUG", message, data));
    }
  },

  success: (message, data = null) => {
    const timestamp = formatTimestamp();
    let output = `${colors.green}[${timestamp}] [✓ SUCCESS]${colors.reset} ${message}`;
    if (data) {
      output += `\n${JSON.stringify(data, null, 2)}`;
    }
    console.log(output);
  },

  section: (title) => {
    console.log(`\n${colors.blue}${"=".repeat(60)}${colors.reset}`);
    console.log(
      `${colors.blue}${title.padStart(title.length + 15).padEnd(60)}${
        colors.reset
      }`
    );
    console.log(`${colors.blue}${"=".repeat(60)}${colors.reset}\n`);
  },
};

module.exports = logger;
