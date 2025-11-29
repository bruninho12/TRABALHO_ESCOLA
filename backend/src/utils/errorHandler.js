/**
 * @fileoverview Utilitário para tratamento padronizado de erros
 * Centraliza a lógica de error handling e logging
 */

const logger = require("./logger");

/**
 * Classe para tratamento de erros da aplicação
 */
class AppError extends Error {
  constructor(message, statusCode = 500, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.timestamp = new Date().toISOString();
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Handler centralizado de erros para controllers
 * @param {Function} fn - Função assíncrona do controller
 * @returns {Function} Função wrapper com try-catch
 */
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch((error) => {
      logger.error(`Erro no controller: ${error.message}`, {
        stack: error.stack,
        url: req.url,
        method: req.method,
      });

      const statusCode = error.statusCode || 500;
      const message = error.isOperational
        ? error.message
        : "Erro interno do servidor";

      res.status(statusCode).json({
        success: false,
        message,
        ...(process.env.NODE_ENV === "development" && {
          error: error.message,
          stack: error.stack,
        }),
      });
    });
  };
};

/**
 * Respostas padronizadas de erro
 */
const errorResponses = {
  /**
   * Erro de validação (400)
   */
  validation: (res, message, errors = []) => {
    return res.status(400).json({
      success: false,
      message: message || "Dados inválidos",
      errors,
    });
  },

  /**
   * Não autorizado (401)
   */
  unauthorized: (res, message = "Não autorizado") => {
    return res.status(401).json({
      success: false,
      message,
    });
  },

  /**
   * Proibido (403)
   */
  forbidden: (res, message = "Acesso negado") => {
    return res.status(403).json({
      success: false,
      message,
    });
  },

  /**
   * Não encontrado (404)
   */
  notFound: (res, resource = "Recurso") => {
    return res.status(404).json({
      success: false,
      message: `${resource} não encontrado`,
    });
  },

  /**
   * Conflito (409)
   */
  conflict: (res, message) => {
    return res.status(409).json({
      success: false,
      message: message || "Conflito ao processar requisição",
    });
  },

  /**
   * Erro interno do servidor (500)
   */
  internal: (res, error, message = "Erro interno do servidor") => {
    logger.error("Erro interno:", error);
    return res.status(500).json({
      success: false,
      message,
      ...(process.env.NODE_ENV === "development" && {
        error: error.message,
      }),
    });
  },

  /**
   * Erro de serviço indisponível (503)
   */
  serviceUnavailable: (
    res,
    message = "Serviço temporariamente indisponível"
  ) => {
    return res.status(503).json({
      success: false,
      message,
    });
  },
};

/**
 * Respostas padronizadas de sucesso
 */
const successResponses = {
  /**
   * Sucesso com dados (200)
   */
  ok: (res, data, message = "Operação realizada com sucesso") => {
    return res.status(200).json({
      success: true,
      message,
      data,
    });
  },

  /**
   * Recurso criado (201)
   */
  created: (res, data, message = "Recurso criado com sucesso") => {
    return res.status(201).json({
      success: true,
      message,
      data,
    });
  },

  /**
   * Sem conteúdo (204)
   */
  noContent: (res) => {
    return res.status(204).send();
  },
};

module.exports = {
  AppError,
  asyncHandler,
  errorResponses,
  successResponses,
};
