// ===========================================
// 🔐 Middlewares de Autenticação e Segurança
// ===========================================

const Utils = require('../utils/utils');
const logger = require('../utils/logger');

// ===========================================
// 🧩 Middleware de Autenticação (AuthMiddleware)
// ===========================================
class AuthMiddleware {
  constructor(tokenManager) {
    this.tokenManager = tokenManager;
    this.authenticateToken = this.authenticateToken.bind(this);
    this.optionalAuth = this.optionalAuth.bind(this);
  }

  // 🔑 Verifica o token JWT de autenticação
  async authenticateToken(req, res, next) {
    try {
      const authHeader = req.headers['authorization'];
      const token = authHeader && authHeader.split(' ')[1]; // Formato: Bearer TOKEN

      if (!token) {
        return res.status(401).json({
          success: false,
          error: 'Token de acesso é obrigatório',
        });
      }

      const decoded = await this.tokenManager.verifyToken(token);

      if (!decoded) {
        return res.status(403).json({
          success: false,
          error: 'Token inválido ou expirado',
        });
      }

      // Renomear 'id' para '_id' para compatibilidade com MongoDB
      if (decoded.id && !decoded._id) {
        decoded._id = decoded.id;
      }
      
      req.user = decoded;
      next();
    } catch (error) {
      logger.error('Falha ao verificar token:', error.message);
      return res.status(403).json({
        success: false,
        error: 'Falha na verificação do token',
      });
    }
  }

  // 🟢 Autenticação opcional (não gera erro se não houver token)
  async optionalAuth(req, res, next) {
    try {
      const authHeader = req.headers["authorization"];
      const token = authHeader && authHeader.split(" ")[1];

      if (!token) {
        req.user = null;
        return next();
      }

      const decoded = await this.tokenManager.verifyToken(token);
      
      // Renomear 'id' para '_id' para compatibilidade com MongoDB
      if (decoded && decoded.id && !decoded._id) {
        decoded._id = decoded.id;
      }
      
      req.user = decoded || null;
      next();
    } catch (error) {
      req.user = null;
      next();
    }
  }

  // 🚦 Limitador de requisições (rate limiting simples em memória)
  rateLimit(options = {}) {
    const windowMs = options.windowMs || 15 * 60 * 1000; // 15 minutos
    const max = options.max || 100; // Máximo de 100 requisições por IP
    const message = options.message || "Muitas requisições — tente novamente mais tarde";

    const requests = new Map();

    return (req, res, next) => {
      const key = req.ip;
      const now = Date.now();
      const windowStart = now - windowMs;

      const userRequests = (requests.get(key) || []).filter((time) => time > windowStart);
      requests.set(key, userRequests);

      if (userRequests.length >= max) {
        return res.status(429).json({
          success: false,
          error: message,
          retryAfter: Math.ceil(windowMs / 1000),
        });
      }

      userRequests.push(now);
      requests.set(key, userRequests);
      next();
    };
  }

  // 🌍 Middleware de CORS (controle de origem cruzada)
  corsMiddleware(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");

    if (req.method === "OPTIONS") {
      return res.sendStatus(200);
    }
    next();
  }

  // 🧾 Middleware de log de requisições
  requestLogger(req, res, next) {
    const inicio = Date.now();

    res.on('finish', () => {
      const duracao = Date.now() - inicio;
      logger.http(`${req.method} ${req.url} - ${res.statusCode} - ${duracao}ms - ${req.ip}`);
    });

    next();
  }

  // 📦 Middleware para tratar JSON no corpo das requisições
  jsonParser(req, res, next) {
    if (req.headers["content-type"] === "application/json") {
      let body = "";

      req.on("data", (chunk) => {
        body += chunk.toString();
      });

      req.on("end", () => {
        try {
          req.body = JSON.parse(body);
          next();
        } catch {
          res.status(400).json({
            success: false,
            error: "JSON inválido no corpo da requisição",
          });
        }
      });
    } else {
      req.body = {};
      next();
    }
  }

  // ❌ Middleware de tratamento de erros globais
  errorHandler(err, req, res) {
    logger.error('Error:', err);

    // Erros de validação do Mongoose
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors || {}).map((e) => e.message);
      return res.status(400).json({
        success: false,
        error: 'Erro de validação',
        detalhes: errors,
      });
    }

    // Erros de token JWT
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ success: false, error: 'Token inválido' });
    }

    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, error: 'Token expirado' });
    }

    // Erro genérico
    res.status(err.status || 500).json({
      success: false,
      error: err.message || 'Erro interno no servidor',
    });
  }

  // 🕳️ Middleware para tratar rotas inexistentes (404)
  notFoundHandler(req, res) {
    res.status(404).json({
      success: false,
      error: "Rota não encontrada",
    });
  }
}

// ===========================================
// ⚖️ Middleware de Autorização
// ===========================================
class AuthorizationMiddleware {
  constructor(dataManager) {
    this.dataManager = dataManager;
  }

  // 🔒 Verifica se o recurso pertence ao usuário autenticado
  requireOwnership(resourceType) {
    return async (req, res, next) => {
      try {
        const userId = req.user?.id;
        const resourceId = req.params.id;

        if (!userId || !resourceId) {
          return res.status(400).json({ success: false, error: "ID de usuário ou recurso ausente" });
        }

        let resource;
        switch (resourceType) {
          case "transaction":
            resource = await this.dataManager.getTransactionById(resourceId);
            break;
          case "goal":
            resource = await this.dataManager.getGoalById(resourceId);
            break;
          default:
            return res.status(400).json({
              success: false,
              error: "Tipo de recurso inválido",
            });
        }

        if (!resource) {
          return res.status(404).json({ success: false, error: `${resourceType} não encontrado` });
        }

        if (resource.userId !== userId) {
          return res.status(403).json({
            success: false,
            error: "Acesso negado: você não é o proprietário deste recurso",
          });
        }

        req.resource = resource;
        next();
      } catch (error) {
        logger.error('Falha na verificação de autorização:', error);
        res.status(500).json({ success: false, error: 'Falha na verificação de autorização' });
      }
    };
  }

  // 🧾 Verifica se o usuário tem a permissão necessária
  requirePermission(permission) {
    return async (req, res, next) => {
      try {
        const user = await this.dataManager.getUserById(req.user.id);
        if (!user) {
          return res.status(404).json({ success: false, error: 'Usuário não encontrado' });
        }

        if (user.role === 'admin' || user.permissions?.includes(permission)) {
          return next();
        }

        res.status(403).json({ success: false, error: `Permissão necessária: ${permission}` });
      } catch (error) {
        logger.error('Falha ao verificar permissões:', error);
        res.status(500).json({ success: false, error: 'Falha na verificação de permissão' });
      }
    };
  }

  // ⚙️ Verifica se a conta do usuário está ativa
  requireActiveAccount(req, res, next) {
    if (req.user.accountStatus !== "active") {
      return res.status(403).json({ success: false, error: "Conta inativa" });
    }
    next();
  }

  // 📧 Verifica se o e-mail do usuário está verificado
  requireVerifiedEmail(req, res, next) {
    if (!req.user.emailVerified) {
      return res.status(403).json({ success: false, error: "Verificação de e-mail necessária" });
    }
    next();
  }
}

// ===========================================
// 🔰 Middleware de Segurança (headers e sanitização)
// ===========================================
class SecurityMiddleware {
  // Cabeçalhos de segurança padrão
  static securityHeaders(req, res, next) {
    res.header("X-Frame-Options", "DENY");
    res.header("X-Content-Type-Options", "nosniff");
    res.header("X-XSS-Protection", "1; mode=block");
    res.header("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
    res.header(
      "Content-Security-Policy",
      "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';"
    );
    next();
  }

  // Sanitiza entradas do usuário para evitar XSS/injeções
  static sanitizeInput(req, res, next) {
    if (req.body) req.body = SecurityMiddleware.sanitizeObject(req.body);
    if (req.query) req.query = SecurityMiddleware.sanitizeObject(req.query);
    if (req.params) req.params = SecurityMiddleware.sanitizeObject(req.params);
    next();
  }

  static sanitizeObject(obj) {
    const sanitized = {};
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === "string") {
        sanitized[key] = value
          .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
          .replace(/javascript:/gi, "")
          .replace(/on\w+\s*=/gi, "");
      } else if (typeof value === "object" && value !== null) {
        sanitized[key] = SecurityMiddleware.sanitizeObject(value);
      } else {
        sanitized[key] = value;
      }
    }
    return sanitized;
  }
}

// ===========================================
// 💾 Middleware de Cache em Memória
// ===========================================
class CacheMiddleware {
  constructor() {
    this.cache = new Map();
    this.maxAge = 5 * 60 * 1000; // 5 minutos por padrão
  }

  cacheResponse(duration = this.maxAge) {
    return (req, res, next) => {
      const key = this.generateCacheKey(req);
      const cached = this.cache.get(key);

      if (cached && Date.now() - cached.timestamp < duration) {
        return res.json(cached.data);
      }

      const originalJson = res.json;
      res.json = (data) => {
        if (res.statusCode === 200) {
          this.cache.set(key, { data, timestamp: Date.now() });
        }
        return originalJson.call(res, data);
      };

      next();
    };
  }

  generateCacheKey(req) {
    return `${req.method}:${req.url}:${JSON.stringify(req.query)}:${req.user?.id || "anonimo"}`;
  }

  invalidateCache(pattern) {
    for (const key of this.cache.keys()) {
      if (key.includes(pattern)) this.cache.delete(key);
    }
  }

  clearCache() {
    this.cache.clear();
  }
}

// ===========================================
// 🧠 Middleware de Validação
// ===========================================
class ValidationMiddleware {
  static validateId(req, res, next) {
    const id = req.params.id;

    if (!id || !Utils.isValidId(id)) {
      return res.status(400).json({
        success: false,
        error: "ID inválido ou ausente",
      });
    }

    next();
  }

  static validatePagination(req, res, next) {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    if (page < 1) {
      return res.status(400).json({ success: false, error: "A página deve ser maior que 0" });
    }

    if (limit < 1 || limit > 100) {
      return res.status(400).json({ success: false, error: "O limite deve ser entre 1 e 100" });
    }

    req.pagination = { page, limit };
    next();
  }

  static validateDateRange(req, res, next) {
    const { startDate, endDate } = req.query;

    if (startDate && !Utils.isValidDate(startDate)) {
      return res.status(400).json({ success: false, error: "Data inicial inválida" });
    }

    if (endDate && !Utils.isValidDate(endDate)) {
      return res.status(400).json({ success: false, error: "Data final inválida" });
    }

    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      return res.status(400).json({ success: false, error: "A data inicial deve ser anterior à final" });
    }

    next();
  }
}

// ===========================================
// 🧾 Exportação dos Middlewares
// ===========================================
module.exports = {
  AuthMiddleware,
  AuthorizationMiddleware,
  SecurityMiddleware,
  CacheMiddleware,
  ValidationMiddleware,
  authenticate: function(tokenManager) {
    const authMiddleware = new AuthMiddleware(tokenManager);
    return authMiddleware.authenticateToken.bind(authMiddleware);
  }
};
