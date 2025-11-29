/**
 * @fileoverview Middleware global de tratamento de erros
 * Captura e trata erros não tratados na aplicação
 */

const logger = require("../utils/logger");
const { AppError } = require("../utils/errorHandler");

/**
 * Middleware de erro global
 * Deve ser o último middleware na cadeia
 */
const globalErrorHandler = (err, req, res) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  // Log do erro
  logger.error("Erro capturado:", {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userId: req.user?.id || "não autenticado",
  });

  // Desenvolvimento: enviar stack trace
  if (process.env.NODE_ENV === "development") {
    return res.status(err.statusCode).json({
      success: false,
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  }

  // Produção: mensagem limpa
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      success: false,
      status: err.status,
      message: err.message,
    });
  }

  // Erro de programação ou desconhecido: não expor detalhes
  return res.status(500).json({
    success: false,
    status: "error",
    message: "Algo deu errado!",
  });
};

/**
 * Handler para rotas não encontradas
 */
const notFoundHandler = (req, res, next) => {
  const err = new AppError(`Rota não encontrada: ${req.originalUrl}`, 404);
  next(err);
};

/**
 * Handler para erros não capturados
 */
const uncaughtExceptionHandler = () => {
  process.on("uncaughtException", (err) => {
    logger.error("UNCAUGHT EXCEPTION! 💥 Encerrando...", {
      error: err.message,
      stack: err.stack,
    });
    process.exit(1);
  });
};

/**
 * Handler para promessas rejeitadas não tratadas
 */
const unhandledRejectionHandler = () => {
  process.on("unhandledRejection", (err) => {
    logger.error("UNHANDLED REJECTION! 💥 Encerrando...", {
      error: err.message,
      stack: err.stack,
    });
    process.exit(1);
  });
};

module.exports = {
  globalErrorHandler,
  notFoundHandler,
  uncaughtExceptionHandler,
  unhandledRejectionHandler,
};
