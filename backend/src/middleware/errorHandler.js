/**
 * Middleware para tratamento de erros
 */
const errorHandler = (err, req, res, _next) => {
  // Erro padrão
  let statusCode = err.statusCode || 500;
  let message = err.message || "Erro interno no servidor";

  // Log do erro em ambiente de desenvolvimento
  if (process.env.NODE_ENV === "development") {
    console.error(`[${new Date().toISOString()}] Erro: ${err.stack}`);
  }

  // Resposta de erro padronizada
  res.status(statusCode).json({
    status: "error",
    message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

// Classe para erros de aplicação
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = {
  errorHandler,
  AppError,
};
