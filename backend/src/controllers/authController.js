// ===========================================
// 🔐 Controller de Autenticação (AuthController)
// ===========================================
// Responsável por gerenciar o registro, login, logout,
// atualização de perfil, troca e recuperação de senha,
// e validações de segurança relacionadas à autenticação.
// ===========================================

const Utils = require("../utils/utils");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const logger = require("../utils/logger");
const TokenManager = require("../utils/tokenManager");
const { authSchemas } = require("../utils/validationSchemas");

// Classe principal de controle de autenticação
class AuthController {
  constructor(dataManager) {
    this.dataManager = dataManager;
    this.tokenManager = new TokenManager();
  }

  // Método auxiliar para validação
  validateRequest(schema, data) {
    const { error, value } = schema.validate(data);
    return {
      isValid: !error,
      errors: error?.details?.map((detail) => detail.message) || [],
      data: value,
    };
  }

  // ===============================
  // 🧩 Registro de novo usuário
  // ===============================
  async register(req, res) {
    try {
      const { name, email, password, confirmPassword } = req.body;

      // Validação dos campos de cadastro
      const validation = this.validateRequest(authSchemas.register, {
        name,
        email,
        password,
      });

      if (!validation.isValid) {
        return res.status(400).json({
          success: false,
          message: "Erro de validação",
          detalhes: validation.errors,
        });
      }

      // Verifica se já existe usuário com o mesmo email
      const existingUser = await this.dataManager.getUserByEmail(email);
      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: "Já existe um usuário com este email.",
        });
      }

      // Cria e armazena o novo usuário
      const hashedPassword = await this.hashPassword(password);
      const userData = {
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        emailVerified: false,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
      };

      const user = await this.dataManager.createUser(userData);

      // Gera tokens de autenticação
      const tokens = await this.tokenManager.generateTokenPair({
        id: user._id,
        email: user.email,
        name: user.name,
      });

      // Envia email de boas-vindas (simulado)
      await this.sendWelcomeEmail(user);

      return res.status(201).json({
        success: true,
        message: "Cadastro realizado com sucesso!",
        data: {
          user: this.sanitizeUser(user),
          token: tokens.accessToken,
        },
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Erro ao registrar usuário.",
        error: error.message,
      });
    }
  }

  // ===============================
  // 🔑 Login de usuário
  // ===============================
  async login(req, res) {
    try {
      const { email, password, rememberMe } = req.body;

      // Valida dados de login
      const validation = this.validateRequest(authSchemas.login, {
        email,
        password,
        rememberMe,
      });
      if (!validation.isValid) {
        return res.status(400).json({
          success: false,
          message: "Erro de validação",
          detalhes: validation.errors,
        });
      }

      // Busca usuário no banco
      const user = await this.dataManager.getUserByEmail(email.toLowerCase());
      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Credenciais inválidas",
        });
      }

      // Verifica senha
      const senhaValida = await this.verifyPassword(password, user.password);
      if (!senhaValida) {
        await this.logFailedLoginAttempt(user._id, req.ip);
        return res.status(401).json({
          success: false,
          message: "Credenciais inválidas",
        });
      }

      // Gera novos tokens
      const tokens = await this.tokenManager.generateTokenPair(
        {
          id: user._id,
          email: user.email,
          name: user.name,
        },
        rememberMe ? { longLived: true } : {}
      );

      // Atualiza último login
      await this.dataManager.updateUser(user._id, {
        lastLogin: new Date().toISOString(),
      });

      await this.logLoginActivity(user._id, req.ip);

      return res.status(200).json({
        success: true,
        message: "Login realizado com sucesso!",
        data: {
          user: this.sanitizeUser(user),
          token: tokens.accessToken,
        },
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Erro ao efetuar login.",
        error: error.message,
      });
    }
  }

  // ===============================
  // 🚪 Logout
  // ===============================
  async logout(req, res) {
    try {
      const token = req.headers.authorization?.replace("Bearer ", "");
      if (token) await this.tokenManager.blacklistToken(token);

      await this.logLogoutActivity(req.user._id, req.ip);

      return res.status(200).json({
        success: true,
        message: "Logout realizado com sucesso.",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Erro ao sair da conta.",
        error: error.message,
      });
    }
  }

  // ===============================
  // ♻️ Atualizar token (refresh)
  // ===============================
  async refreshToken(req, res) {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) {
        return res.status(400).json({
          success: false,
          message: "Token de atualização é obrigatório.",
        });
      }

      const tokenData = await this.tokenManager.verifyRefreshToken(
        refreshToken
      );
      if (!tokenData) {
        return res
          .status(401)
          .json({ success: false, message: "Token de atualização inválido." });
      }

      const newTokens = await this.tokenManager.generateTokenPair(tokenData);
      await this.tokenManager.blacklistToken(refreshToken);

      return res.status(200).json({
        success: true,
        message: "Token renovado com sucesso!",
        data: { tokens: newTokens },
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Erro ao renovar token.",
        error: error.message,
      });
    }
  }

  // ===============================
  // 🔄 Esqueci minha senha
  // ===============================
  async forgotPassword(req, res) {
    try {
      const { email } = req.body;

      if (!email || !Utils.validateEmail(email)) {
        return res.status(400).json({
          success: false,
          message: "Email válido é obrigatório.",
        });
      }

      const user = await this.dataManager.getUserByEmail(email.toLowerCase());
      if (!user) {
        return res.status(200).json({
          success: true,
          message: "Se o email existir, um link de redefinição será enviado.",
        });
      }

      const resetToken = this.tokenManager.generateResetToken();
      const resetExpiry = new Date(Date.now() + 3600000); // 1h

      await this.dataManager.updateUser(user._id, {
        resetToken,
        resetTokenExpiry: resetExpiry.toISOString(),
      });

      await this.sendPasswordResetEmail(user, resetToken);

      return res.status(200).json({
        success: true,
        message: "Email de recuperação enviado com sucesso.",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Erro ao processar recuperação de senha.",
        error: error.message,
      });
    }
  }

  // ===============================
  // 🆕 Redefinir senha com token
  // ===============================
  async resetPassword(req, res) {
    try {
      const { token, password, confirmPassword } = req.body;

      const validation = this.validateRequest(authSchemas.resetPassword, {
        token,
        newPassword: password,
      });

      if (!validation.isValid) {
        return res.status(400).json({
          success: false,
          message: "Erro de validação",
          detalhes: validation.errors,
        });
      }

      const user = await this.dataManager.getUserByResetToken(token);
      if (!user || new Date(user.resetTokenExpiry) < new Date()) {
        return res.status(400).json({
          success: false,
          message: "Token inválido ou expirado.",
        });
      }

      const hashedPassword = await this.hashPassword(password);

      await this.dataManager.updateUser(user._id, {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      });

      await this.sendPasswordChangedEmail(user);

      return res.status(200).json({
        success: true,
        message: "Senha redefinida com sucesso.",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Erro ao redefinir senha.",
        error: error.message,
      });
    }
  }

  // ===============================
  // 🔁 Alterar senha autenticado
  // ===============================
  async changePassword(req, res) {
    try {
      const { currentPassword, newPassword, confirmPassword } = req.body;
      const userId = req.user._id;

      const validation = this.validateRequest(authSchemas.changePassword, {
        currentPassword,
        newPassword,
        confirmPassword,
      });

      if (!validation.isValid) {
        return res.status(400).json({
          success: false,
          message: "Erro de validação",
          detalhes: validation.errors,
        });
      }

      const user = await this.dataManager.getUserById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "Usuário não encontrado.",
        });
      }

      const senhaValida = await this.verifyPassword(
        currentPassword,
        user.password
      );
      if (!senhaValida) {
        return res.status(400).json({
          success: false,
          message: "Senha atual incorreta.",
        });
      }

      const hashedPassword = await this.hashPassword(newPassword);
      await this.dataManager.updateUser(userId, { password: hashedPassword });
      await this.sendPasswordChangedEmail(user);

      return res.status(200).json({
        success: true,
        message: "Senha alterada com sucesso.",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Erro ao alterar senha.",
        error: error.message,
      });
    }
  }

  // ===============================
  // 👤 Atualizar perfil do usuário
  // ===============================
  async updateProfile(req, res) {
    try {
      const userId = req.user._id;
      const { name, email } = req.body;

      if (!name || !email) {
        return res.status(400).json({
          success: false,
          message: "Nome e email são obrigatórios.",
        });
      }

      const updatedUser = await this.dataManager.updateUser(userId, {
        name,
        email: email.toLowerCase(),
        updatedAt: new Date().toISOString(),
      });

      if (!updatedUser) {
        return res.status(404).json({
          success: false,
          message: "Usuário não encontrado.",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Perfil atualizado com sucesso.",
        data: this.sanitizeUser(updatedUser),
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Erro ao atualizar perfil.",
        error: error.message,
      });
    }
  }

  // ===============================
  // 🧾 Obter perfil logado
  // ===============================
  async getProfile(req, res) {
    try {
      const user = await this.dataManager.getUserById(req.user._id);
      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "Usuário não encontrado." });
      }

      return res.status(200).json({
        success: true,
        data: this.sanitizeUser(user),
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Erro ao buscar perfil.",
        error: error.message,
      });
    }
  }

  // ===============================
  // 🧰 Métodos auxiliares
  // ===============================
  async hashPassword(password) {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
  }

  async verifyPassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
  }

  sanitizeUser(user) {
    // eslint-disable-next-line no-unused-vars
    const { password, resetToken, resetTokenExpiry, ...sanitized } = user;
    return sanitized;
  }

  async sendWelcomeEmail(user) {
    console.log(`📧 Email de boas-vindas enviado para ${user.email}`);
  }

  async sendPasswordResetEmail(user, token) {
    console.log(
      `📧 Email de redefinição enviado para ${user.email} com token: ${token}`
    );
  }

  async sendPasswordChangedEmail(user) {
    console.log(`📧 Notificação de senha alterada enviada para ${user.email}`);
  }

  async logFailedLoginAttempt(userId, ip) {
    console.log(
      `❌ Tentativa de login falhou para o usuário ${userId} de ${ip}`
    );
  }

  async logLoginActivity(userId, ip) {
    console.log(`✅ Usuário ${userId} fez login de ${ip}`);
  }

  async logLogoutActivity(userId, ip) {
    console.log(`🚪 Usuário ${userId} fez logout de ${ip}`);
  }
}

// ===========================================
// 🧩 Validador de Autenticação
// ===========================================
class AuthValidator {
  validateRegistration(data) {
    const errors = [];

    if (!data.name || data.name.trim().length < 2)
      errors.push("Nome deve ter pelo menos 2 caracteres.");

    if (!data.email || !Utils.validateEmail(data.email))
      errors.push("Email válido é obrigatório.");

    if (!data.password || data.password.length < 8)
      errors.push("Senha deve ter pelo menos 8 caracteres.");

    if (data.password !== data.confirmPassword)
      errors.push("As senhas não coincidem.");

    return { isValid: errors.length === 0, errors };
  }

  validateLogin(data) {
    const errors = [];
    if (!data.email || !Utils.validateEmail(data.email))
      errors.push("Email válido é obrigatório.");
    if (!data.password) errors.push("Senha é obrigatória.");
    return { isValid: errors.length === 0, errors };
  }

  validatePasswordReset(data) {
    const errors = [];
    if (!data.token) errors.push("Token é obrigatório.");
    if (!data.password || data.password.length < 8)
      errors.push("Senha deve ter pelo menos 8 caracteres.");
    if (data.password !== data.confirmPassword)
      errors.push("As senhas não coincidem.");
    return { isValid: errors.length === 0, errors };
  }

  validatePasswordChange(data) {
    const errors = [];
    if (!data.currentPassword) errors.push("Senha atual é obrigatória.");
    if (!data.newPassword || data.newPassword.length < 8)
      errors.push("Nova senha deve ter pelo menos 8 caracteres.");
    if (data.newPassword !== data.confirmPassword)
      errors.push("As senhas não coincidem.");
    return { isValid: errors.length === 0, errors };
  }
}

// ===========================================
// Exportações
// ===========================================
// Criar método de login simplificado sem dependências de classe
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validação básica
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email e senha são obrigatórios",
      });
    }

    // Buscar usuário no banco de dados
    const User = require("../models/User");
    const user = await User.findOne({ email: email.toLowerCase() }).select(
      "+password"
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Credenciais inválidas",
      });
    }

    // Comparar senha
    let isPasswordValid;
    try {
      isPasswordValid = await user.comparePassword(password);
    } catch (compareError) {
      logger.error("Password comparison error:", compareError);
      return res.status(500).json({
        success: false,
        message: "Erro ao validar credenciais",
        error: compareError.message,
      });
    }

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Credenciais inválidas",
      });
    }

    // Gerar token JWT
    const token = jwt.sign(
      { email: user.email, id: user._id, username: user.username },
      process.env.JWT_SECRET ||
        "chave_secreta_muito_segura_para_autenticacao_jwt",
      { expiresIn: "24h" }
    );

    // Atualizar último login
    user.lastLogin = new Date();
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Login realizado com sucesso!",
      data: {
        token,
        user: {
          email: user.email,
          username: user.username,
          fullName: user.fullName,
        },
      },
    });
  } catch (error) {
    logger.error("Login error:", error);
    return res.status(500).json({
      success: false,
      message: "Erro ao fazer login",
      error: error.message,
    });
  }
};

const register = async (req, res) => {
  try {
    const { name, email, password, confirmPassword, username } = req.body;

    // Validações
    if (!email || !password || !name) {
      return res.status(400).json({
        success: false,
        message: "Nome, email e senha são obrigatórios",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "As senhas não coincidem",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Senha deve ter no mínimo 8 caracteres",
      });
    }

    // Verificar se usuário já existe
    const User = require("../models/User");
    const existingUser = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { username: username || email }],
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Usuário com este email ou username já existe",
      });
    }

    // Criar novo usuário
    const newUser = new User({
      email: email.toLowerCase(),
      username: username || email.split("@")[0],
      password: password,
      fullName: name,
    });

    await newUser.save();

    // Gerar token JWT
    const token = jwt.sign(
      { email: newUser.email, id: newUser._id, username: newUser.username },
      process.env.JWT_SECRET ||
        "chave_secreta_muito_segura_para_autenticacao_jwt",
      { expiresIn: "24h" }
    );

    return res.status(201).json({
      success: true,
      message: "Cadastro realizado com sucesso!",
      data: {
        token,
        user: {
          email: newUser.email,
          username: newUser.username,
          fullName: newUser.fullName,
        },
      },
    });
  } catch (error) {
    logger.error("Register error:", error);
    return res.status(500).json({
      success: false,
      message: "Erro ao registrar",
      error: error.message,
    });
  }
};

const logout = (req, res) => {
  res.status(200).json({
    success: true,
    message: "Logout realizado com sucesso",
  });
};

const refreshToken = (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: "Refresh token é obrigatório",
      });
    }

    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_SECRET ||
        "chave_secreta_muito_segura_para_autenticacao_jwt"
    );

    const newToken = jwt.sign(
      { email: decoded.email, id: decoded.id },
      process.env.JWT_SECRET ||
        "chave_secreta_muito_segura_para_autenticacao_jwt",
      { expiresIn: "24h" }
    );

    res.json({ success: true, token: newToken });
  } catch (error) {
    res.status(401).json({ success: false, message: "Token inválido" });
  }
};

const forgotPassword = (req, res) => {
  res.json({
    success: true,
    message: "Email de recuperação será implementado em breve",
  });
};

const resetPassword = (req, res) => {
  res.json({
    success: true,
    message: "Reset de senha será implementado em breve",
  });
};

const verifyAccount = (req, res) => {
  res.json({
    success: true,
    message: "Verificação de email será implementada em breve",
  });
};

// Obter perfil do usuário autenticado
const getProfile = async (req, res) => {
  try {
    const User = require("../models/User");

    // O middleware authenticate já adicionou req.user
    const userId = req.user.id || req.user._id;

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Usuário não encontrado",
      });
    }

    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    logger.error("Get profile error:", error);
    return res.status(500).json({
      success: false,
      message: "Erro ao carregar perfil",
      error: error.message,
    });
  }
};

// Middleware de autenticação
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Token não fornecido" });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET ||
        "chave_secreta_muito_segura_para_autenticacao_jwt"
    );
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Token inválido" });
  }
};

module.exports = {
  AuthController,
  authenticate,
  login,
  register,
  logout,
  refreshToken,
  forgotPassword,
  resetPassword,
  verifyAccount,
  getProfile,
};
