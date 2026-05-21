const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const logger = require("../utils/logger");

/**
 * Gerar token JWT
 */
const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

/**
 * Sanitizar dados do usuário
 */
const sanitizeUser = (user) => {
  const userObj = user.toObject();
  delete userObj.password;
  delete userObj.twoFactorSecret;
  return userObj;
};

/**
 * Login de usuário
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Log para debug
    console.log("🔐 [LOGIN] Tentativa de login:");
    console.log("📧 Email:", email);
    console.log("🌐 IP:", req.ip);

    // Validação básica
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: "Email e senha são obrigatórios",
      });
    }

    // Buscar usuário no banco
    const user = await User.findOne({
      email: email.toLowerCase(),
    }).select("+password");

    if (!user) {
      console.log("❌ [LOGIN] Usuário não encontrado:", email);
      return res.status(401).json({
        success: false,
        error: "Credenciais inválidas",
      });
    }

    console.log("👤 [LOGIN] Usuário encontrado:", {
      id: user._id,
      email: user.email,
      username: user.username,
    });

    // Verificar senha
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      console.log("❌ [LOGIN] Senha inválida para:", email);
      return res.status(401).json({
        success: false,
        error: "Credenciais inválidas",
      });
    }

    // Verificar se a conta está ativa
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        error: "Conta desativada",
      });
    }

    // Verificar se o usuário está bloqueado
    if (user.isBlocked) {
      console.log("❌ [LOGIN] Usuário bloqueado:", email);
      return res.status(403).json({
        success: false,
        error: "Sua conta foi bloqueada",
        reason: user.blockReason || "Motivo não informado",
      });
    }

    // Gerar token
    const tokenPayload = {
      id: user._id,
      email: user.email,
      username: user.username,
      isAdmin: user.isAdmin,
      role: user.role,
    };

    const token = generateToken(tokenPayload);

    // Atualizar último login
    user.lastLogin = new Date();
    await user.save();

    console.log("✅ [LOGIN] Login realizado com sucesso para:", email);

    // Log de segurança
    logger.info(`Login realizado com sucesso: ${email}`, {
      userId: user._id,
      ip: req.ip,
      userAgent: req.get("User-Agent"),
    });

    return res.status(200).json({
      success: true,
      message: "Login realizado com sucesso",
      data: {
        user: sanitizeUser(user),
        token: token,
      },
    });
  } catch (error) {
    console.error("❌ [LOGIN] Erro:", error);
    logger.error("Erro no login:", error);

    return res.status(500).json({
      success: false,
      error: "Erro interno do servidor",
    });
  }
};

/**
 * Registro de novo usuário
 *
 * Compatível com o frontend atual, que envia:
 * { name, email, password, confirmPassword }
 */
exports.register = async (req, res) => {
  try {
    const {
      username: rawUsername,
      name,
      fullName: rawFullName,
      email,
      password,
      confirmPassword,
    } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email e senha são obrigatórios",
        error: "Email e senha são obrigatórios",
      });
    }

    if (confirmPassword && password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "As senhas não coincidem",
        error: "As senhas não coincidem",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Gerar username automaticamente se o frontend não enviar
    let username =
      rawUsername ||
      (name
        ? name
            .trim()
            .toLowerCase()
            .replace(/\s+/g, ".")
            .replace(/[^a-z0-9.]/g, "")
        : normalizedEmail.split("@")[0]);

    if (!username || username.length < 3) {
      username = `${normalizedEmail.split("@")[0]}`.slice(0, 20) || "user";
    }

    const fullName = rawFullName || name || username;

    // Verificar se já existe usuário com mesmo email ou username
    const existingUser = await User.findOne({
      $or: [{ email: normalizedEmail }, { username }],
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email ou nome de usuário já está em uso",
        error: "Email ou nome de usuário já está em uso",
      });
    }

    // Criar usuário (hash é feito pelo hook pre-save do modelo)
    const newUser = new User({
      username,
      email: normalizedEmail,
      fullName,
      password,
      isActive: true,
      emailVerified: true, // Por simplicidade, vamos considerar verificado
      subscription: {
        plan: "free",
        status: "active",
      },
    });

    await newUser.save();

    // Gerar token
    const tokenPayload = {
      id: newUser._id,
      email: newUser.email,
      username: newUser.username,
      isAdmin: newUser.isAdmin,
      role: newUser.role,
    };

    const token = generateToken(tokenPayload);

    logger.info(`Novo usuário registrado: ${normalizedEmail}`, {
      userId: newUser._id,
      ip: req.ip,
    });

    return res.status(201).json({
      success: true,
      message: "Usuário criado com sucesso",
      data: {
        user: sanitizeUser(newUser),
        token,
      },
    });
  } catch (error) {
    console.error("❌ [REGISTER] Erro:", error);
    logger.error("Erro no registro:", error);

    return res.status(500).json({
      success: false,
      message: "Erro interno do servidor",
      error: "Erro interno do servidor",
    });
  }
};

/**
 * Logout (placeholder)
 */
exports.logout = async (req, res) => {
  try {
    // Para JWT, o logout é principalmente do lado do cliente
    // Aqui podemos implementar uma blacklist de tokens se necessário

    return res.status(200).json({
      success: true,
      message: "Logout realizado com sucesso",
    });
  } catch (error) {
    console.error("❌ [LOGOUT] Erro:", error);

    return res.status(500).json({
      success: false,
      error: "Erro interno do servidor",
    });
  }
};

/**
 * Refresh Token (placeholder)
 */
exports.refreshToken = async (req, res) => {
  try {
    // Implementar lógica de refresh token se necessário

    return res.status(501).json({
      success: false,
      error: "Não implementado",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Erro interno do servidor",
    });
  }
};

/**
 * Esqueci a senha (placeholder)
 */
exports.forgotPassword = async (req, res) => {
  return res.status(501).json({
    success: false,
    error: "Funcionalidade não implementada",
  });
};

/**
 * Redefinir senha (placeholder)
 */
exports.resetPassword = async (req, res) => {
  return res.status(501).json({
    success: false,
    error: "Funcionalidade não implementada",
  });
};

/**
 * Verificar conta (placeholder)
 */
exports.verifyAccount = async (req, res) => {
  return res.status(501).json({
    success: false,
    error: "Funcionalidade não implementada",
  });
};

/**
 * Middleware de autenticação
 */
exports.authenticate = async (req, res, next) => {
  try {
    const authorization = req.headers.authorization;

    if (!authorization) {
      return res.status(401).json({
        success: false,
        error: "Token de acesso requerido",
      });
    }

    const token = authorization.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        error: "Token de acesso requerido",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        error: "Usuário não encontrado",
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        error: "Conta desativada",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("❌ [AUTH] Erro:", error);

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
 * Obter perfil do usuário
 */
exports.getProfile = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      data: sanitizeUser(req.user),
    });
  } catch (error) {
    console.error("❌ [PROFILE] Erro:", error);

    return res.status(500).json({
      success: false,
      error: "Erro interno do servidor",
    });
  }
};
