/**
 * Middleware de autenticação e autorização para administradores
 */

const jwt = require("jsonwebtoken");
const User = require("../models/User");
const logger = require("../utils/logger");

/**
 * Middleware para verificar se o usuário é administrador
 */
const requireAdmin = async (req, res, next) => {
  try {
    // Verificar se o usuário está autenticado
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        error: "Token de acesso requerido",
      });
    }

    // Verificar token JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        error: "Usuário não encontrado",
      });
    }

    // Verificar se é administrador
    if (!user.isAdmin && user.role !== "admin" && user.role !== "super_admin") {
      logger.warn(
        `Tentativa de acesso admin negada para usuário ${user.email}`,
        {
          userId: user._id,
          ip: req.ip,
          userAgent: req.get("User-Agent"),
        }
      );

      return res.status(403).json({
        success: false,
        error: "Acesso negado. Permissões de administrador requeridas.",
      });
    }

    // Adicionar dados do usuário admin na request
    req.user = user;
    req.adminLevel = user.role || (user.isAdmin ? "admin" : "user");

    logger.info(`Acesso admin autorizado para ${user.email}`, {
      adminLevel: req.adminLevel,
      userId: user._id,
    });

    next();
  } catch (error) {
    logger.error("Erro na verificação admin:", error);

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        error: "Token inválido",
      });
    }

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        error: "Token expirado",
      });
    }

    return res.status(500).json({
      success: false,
      error: "Erro interno do servidor",
    });
  }
};

/**
 * Middleware para verificar nível específico de admin
 */
const requireAdminLevel = (requiredLevel) => {
  const levels = {
    admin: 1,
    super_admin: 2,
  };

  return (req, res, next) => {
    const userLevel = levels[req.adminLevel] || 0;
    const required = levels[requiredLevel] || 1;

    if (userLevel < required) {
      return res.status(403).json({
        success: false,
        error: `Nível de acesso insuficiente. Requerido: ${requiredLevel}`,
      });
    }

    next();
  };
};

/**
 * Log de ações administrativas
 */
const logAdminAction = (action) => {
  return (req, res, next) => {
    // Middleware para interceptar resposta e logar ação
    const originalSend = res.send;

    res.send = function (data) {
      // Log da ação admin
      logger.info(`Ação admin executada: ${action}`, {
        admin: {
          id: req.user._id,
          email: req.user.email,
          level: req.adminLevel,
        },
        action: action,
        method: req.method,
        url: req.originalUrl,
        body: req.method !== "GET" ? req.body : undefined,
        ip: req.ip,
        userAgent: req.get("User-Agent"),
        timestamp: new Date(),
      });

      originalSend.call(this, data);
    };

    next();
  };
};

module.exports = {
  requireAdmin,
  requireAdminLevel,
  logAdminAction,
};
