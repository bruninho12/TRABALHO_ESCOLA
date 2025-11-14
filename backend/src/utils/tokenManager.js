/**
 * @fileoverview Sistema avançado de gerenciamento de tokens JWT
 * Suporta blacklist com Redis, rotação de tokens e rastreamento de dispositivos
 */

const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const logger = require("./logger");

/**
 * Gerenciador avançado de tokens JWT
 */
class TokenManager {
  constructor(options = {}) {
    this.accessTokenSecret =
      process.env.JWT_SECRET || "your-secret-key-change-in-production";
    this.refreshTokenSecret =
      process.env.JWT_REFRESH_SECRET ||
      "your-refresh-secret-key-change-in-production";

    // Configurações de expiração
    this.accessTokenExpiry = options.accessTokenExpiry || "1h";
    this.refreshTokenExpiry = options.refreshTokenExpiry || "30d";
    this.longLivedTokenExpiry = options.longLivedTokenExpiry || "7d";

    // Blacklist (em memória por padrão, Redis em produção)
    this.blacklist = new Set();
    this.redisClient = options.redisClient || null;

    // Rastreamento de dispositivos
    this.deviceSessions = new Map(); // userId -> Set de refresh tokens
  }

  /**
   * Gera par de tokens (access + refresh)
   */
  async generateTokenPair(payload, options = {}) {
    try {
      const {
        longLived = false,
        deviceId = null,
        ipAddress = null,
        userAgent = null,
      } = options;

      // Token de acesso
      const accessTokenExpiry = longLived
        ? this.longLivedTokenExpiry
        : this.accessTokenExpiry;
      const accessToken = jwt.sign(
        {
          ...payload,
          type: "access",
          iat: Math.floor(Date.now() / 1000),
        },
        this.accessTokenSecret,
        {
          expiresIn: accessTokenExpiry,
          algorithm: "HS256",
          issuer: "despfinance-api",
        }
      );

      // Refresh token com informações do dispositivo
      const refreshTokenId = crypto.randomBytes(16).toString("hex");
      const refreshToken = jwt.sign(
        {
          id: payload.id,
          email: payload.email,
          tokenId: refreshTokenId,
          type: "refresh",
          deviceId,
          iat: Math.floor(Date.now() / 1000),
        },
        this.refreshTokenSecret,
        {
          expiresIn: this.refreshTokenExpiry,
          algorithm: "HS256",
          issuer: "despfinance-api",
        }
      );

      // Rastrear sessão do dispositivo
      if (deviceId && payload.id) {
        this.trackDeviceSession(payload.id, refreshTokenId, {
          deviceId,
          ipAddress,
          userAgent,
          createdAt: new Date(),
        });
      }

      // Salvar em Redis se disponível
      if (this.redisClient) {
        await this.saveRefreshTokenToRedis(refreshTokenId, {
          userId: payload.id,
          deviceId,
          ipAddress,
          userAgent,
          expiresAt: Date.now() + this.parseExpiryToMs(this.refreshTokenExpiry),
        });
      }

      logger.info(`Token pair generated for user ${payload.id}`, {
        userId: payload.id,
        deviceId,
        longLived,
      });

      return {
        accessToken,
        refreshToken,
        refreshTokenId,
        expiresIn: accessTokenExpiry,
        tokenType: "Bearer",
      };
    } catch (error) {
      logger.error("Error generating token pair:", error);
      throw new Error("Failed to generate authentication tokens");
    }
  }

  /**
   * Verifica token de acesso
   */
  async verifyAccessToken(token) {
    try {
      // Verificar se está na blacklist
      if (await this.isBlacklisted(token)) {
        logger.warn("Attempted to use blacklisted token");
        return null;
      }

      const decoded = jwt.verify(token, this.accessTokenSecret, {
        algorithms: ["HS256"],
        issuer: "despfinance-api",
      });

      // Verificar tipo de token
      if (decoded.type !== "access") {
        logger.warn("Invalid token type used for access");
        return null;
      }

      return decoded;
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        logger.debug("Access token expired");
      } else if (error.name === "JsonWebTokenError") {
        logger.warn("Invalid access token:", error.message);
      } else {
        logger.error("Token verification error:", error);
      }
      return null;
    }
  }

  /**
   * Verifica refresh token
   */
  async verifyRefreshToken(token) {
    try {
      // Verificar se está na blacklist
      if (await this.isBlacklisted(token)) {
        logger.warn("Attempted to use blacklisted refresh token");
        return null;
      }

      const decoded = jwt.verify(token, this.refreshTokenSecret, {
        algorithms: ["HS256"],
        issuer: "despfinance-api",
      });

      // Verificar tipo de token
      if (decoded.type !== "refresh") {
        logger.warn("Invalid token type used for refresh");
        return null;
      }

      // Verificar se existe no Redis
      if (this.redisClient) {
        const exists = await this.checkRefreshTokenInRedis(decoded.tokenId);
        if (!exists) {
          logger.warn("Refresh token not found in Redis", {
            tokenId: decoded.tokenId,
          });
          return null;
        }
      }

      return decoded;
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        logger.debug("Refresh token expired");
      } else if (error.name === "JsonWebTokenError") {
        logger.warn("Invalid refresh token:", error.message);
      } else {
        logger.error("Refresh token verification error:", error);
      }
      return null;
    }
  }

  /**
   * Renova tokens usando refresh token
   */
  async refreshTokenPair(refreshToken, options = {}) {
    try {
      const decoded = await this.verifyRefreshToken(refreshToken);

      if (!decoded) {
        throw new Error("Invalid or expired refresh token");
      }

      // Invalidar refresh token antigo
      await this.blacklistToken(refreshToken);

      // Remover do Redis
      if (this.redisClient && decoded.tokenId) {
        await this.removeRefreshTokenFromRedis(decoded.tokenId);
      }

      // Gerar novo par de tokens
      const newTokens = await this.generateTokenPair(
        {
          id: decoded.id,
          email: decoded.email,
        },
        {
          deviceId: decoded.deviceId,
          ipAddress: options.ipAddress,
          userAgent: options.userAgent,
        }
      );

      logger.info(`Tokens refreshed for user ${decoded.id}`, {
        userId: decoded.id,
        deviceId: decoded.deviceId,
      });

      return newTokens;
    } catch (error) {
      logger.error("Error refreshing tokens:", error);
      throw error;
    }
  }

  /**
   * Adiciona token à blacklist
   */
  async blacklistToken(token) {
    try {
      const tokenHash = this.hashToken(token);

      // Adicionar à blacklist em memória
      this.blacklist.add(tokenHash);

      // Adicionar ao Redis se disponível
      if (this.redisClient) {
        const decoded = jwt.decode(token);
        const ttl = decoded?.exp
          ? decoded.exp - Math.floor(Date.now() / 1000)
          : 3600;
        await this.redisClient.setex(
          `blacklist:${tokenHash}`,
          Math.max(ttl, 0),
          "1"
        );
      }

      logger.info(`Token blacklisted: ${tokenHash.slice(0, 10)}...`);
    } catch (error) {
      logger.error("Error blacklisting token:", error);
    }
  }

  /**
   * Verifica se token está na blacklist
   */
  async isBlacklisted(token) {
    const tokenHash = this.hashToken(token);

    // Verificar em memória
    if (this.blacklist.has(tokenHash)) {
      return true;
    }

    // Verificar no Redis
    if (this.redisClient) {
      try {
        const exists = await this.redisClient.exists(`blacklist:${tokenHash}`);
        return exists === 1;
      } catch (error) {
        logger.error("Error checking blacklist in Redis:", error);
        return false;
      }
    }

    return false;
  }

  /**
   * Revoga todos os tokens de um usuário
   */
  async revokeAllUserTokens(userId) {
    try {
      // Remover sessões do dispositivo
      const sessions = this.deviceSessions.get(userId);
      if (sessions) {
        for (const tokenId of sessions) {
          if (this.redisClient) {
            await this.removeRefreshTokenFromRedis(tokenId);
          }
        }
        this.deviceSessions.delete(userId);
      }

      logger.info(`All tokens revoked for user ${userId}`);
    } catch (error) {
      logger.error("Error revoking user tokens:", error);
      throw error;
    }
  }

  /**
   * Lista dispositivos/sessões ativas de um usuário
   */
  getActiveDevices(userId) {
    const sessions = this.deviceSessions.get(userId);
    if (!sessions) {
      return [];
    }

    return Array.from(sessions).map((tokenId) => ({
      tokenId,
      ...this.getDeviceInfo(tokenId),
    }));
  }

  /**
   * Revoga sessão específica
   */
  async revokeDeviceSession(userId, tokenId) {
    try {
      const sessions = this.deviceSessions.get(userId);
      if (sessions) {
        sessions.delete(tokenId);
      }

      if (this.redisClient) {
        await this.removeRefreshTokenFromRedis(tokenId);
      }

      logger.info(`Device session revoked`, { userId, tokenId });
    } catch (error) {
      logger.error("Error revoking device session:", error);
      throw error;
    }
  }

  /**
   * Gera token para reset de senha
   */
  generatePasswordResetToken(userId) {
    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // Log de segurança
    logger.security(`Password reset token generated for user ${userId}`);

    return {
      token: resetToken,
      hashedToken,
      expiresAt: Date.now() + 3600000, // 1 hora
    };
  }

  /**
   * Verifica token de reset de senha
   */
  verifyPasswordResetToken(token, hashedToken) {
    const hash = crypto.createHash("sha256").update(token).digest("hex");
    return hash === hashedToken;
  }

  // ==================== Métodos Privados ====================

  /**
   * Hash de token para armazenamento seguro
   */
  hashToken(token) {
    return crypto.createHash("sha256").update(token).digest("hex");
  }

  /**
   * Converte string de expiry para milissegundos
   */
  parseExpiryToMs(expiry) {
    const units = {
      s: 1000,
      m: 60000,
      h: 3600000,
      d: 86400000,
    };

    const match = expiry.match(/^(\d+)([smhd])$/);
    if (!match) return 3600000; // 1h padrão

    const value = parseInt(match[1]);
    const unit = match[2];

    return value * units[unit];
  }

  /**
   * Rastreia sessão de dispositivo
   */
  trackDeviceSession(userId, tokenId, deviceInfo) {
    if (!this.deviceSessions.has(userId)) {
      this.deviceSessions.set(userId, new Map());
    }

    this.deviceSessions.get(userId).set(tokenId, deviceInfo);
  }

  /**
   * Obtém informações do dispositivo
   */
  getDeviceInfo(tokenId) {
    // eslint-disable-next-line no-unused-vars
    for (const [_userId, sessions] of this.deviceSessions.entries()) {
      if (sessions.has(tokenId)) {
        return sessions.get(tokenId);
      }
    }
    return null;
  }

  /**
   * Salva refresh token no Redis
   */
  async saveRefreshTokenToRedis(tokenId, data) {
    if (!this.redisClient) return;

    try {
      const ttl = Math.floor((data.expiresAt - Date.now()) / 1000);
      await this.redisClient.setex(
        `refresh:${tokenId}`,
        ttl,
        JSON.stringify(data)
      );
    } catch (error) {
      logger.error("Error saving refresh token to Redis:", error);
    }
  }

  /**
   * Verifica se refresh token existe no Redis
   */
  async checkRefreshTokenInRedis(tokenId) {
    if (!this.redisClient) return true;

    try {
      const exists = await this.redisClient.exists(`refresh:${tokenId}`);
      return exists === 1;
    } catch (error) {
      logger.error("Error checking refresh token in Redis:", error);
      return true; // Fallback para permitir acesso se Redis falhar
    }
  }

  /**
   * Remove refresh token do Redis
   */
  async removeRefreshTokenFromRedis(tokenId) {
    if (!this.redisClient) return;

    try {
      await this.redisClient.del(`refresh:${tokenId}`);
    } catch (error) {
      logger.error("Error removing refresh token from Redis:", error);
    }
  }
}

module.exports = TokenManager;
