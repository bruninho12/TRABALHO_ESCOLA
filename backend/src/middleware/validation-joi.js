/**
 * Middleware de validação usando Joi
 */

const logger = require("../utils/logger");

/**
 * Cria um middleware de validação Joi
 */
function validate(schema) {
  // Se for um array (múltiplos middlewares), retornar array
  if (Array.isArray(schema)) {
    return schema;
  }

  // Se for um schema Joi, retornar middleware
  return (req, res, next) => {
    const dataToValidate = {
      body: req.body,
      params: req.params,
      query: req.query,
    };

    const { error, value } = schema.validate(dataToValidate, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errors = error.details.map((err) => ({
        field: err.path.join("."),
        message: err.message,
      }));

      logger.warn(`Validation error: ${JSON.stringify(errors)}`);
      return res.status(400).json({
        success: false,
        message: "Erros de validação",
        errors,
      });
    }

    // Atualizar req com valores validados
    req.body = value.body || req.body;
    req.params = value.params || req.params;
    req.query = value.query || req.query;

    next();
  };
}

module.exports = { validate };
