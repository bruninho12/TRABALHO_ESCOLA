/**
 * Middleware de cache para otimização de performance
 * Implementa cache em memória e Redis (se disponível)
 */

const NodeCache = require("node-cache");

// Cache em memória (fallback se Redis não estiver disponível)
const memoryCache = new NodeCache({
  stdTTL: 300, // 5 minutos
  checkperiod: 60, // verifica expiração a cada 1 minuto
});

class CacheMiddleware {
  /**
   * Cache para WorldMap - dados raramente mudam
   */
  static worldMapCache() {
    // 10 minutos (TTL configurado no NodeCache)
    return async (req, res, next) => {
      const cacheKey = "worldmap_all";

      try {
        const cachedData = memoryCache.get(cacheKey);

        if (cachedData) {
          console.log("🚀 [CACHE] WorldMap servido do cache");
          req.cachedWorldMap = cachedData;
          return next();
        }

        // Se não há cache, continua para buscar no DB
        // O resultado será armazenado após a consulta
        next();
      } catch (error) {
        console.error("❌ [CACHE] Erro no cache:", error);
        next(); // Continua sem cache em caso de erro
      }
    };
  }

  /**
   * Cache para avatar do usuário
   */
  static avatarCache() {
    // 3 minutos (TTL configurado no NodeCache)
    return async (req, res, next) => {
      const userId = req.user.id;
      const cacheKey = `avatar_${userId}`;

      try {
        const cachedAvatar = memoryCache.get(cacheKey);

        if (cachedAvatar) {
          console.log(
            "🚀 [CACHE] Avatar servido do cache para usuário:",
            userId
          );
          console.log(
            "🔍 [MIDDLEWARE] Tipo do cachedAvatar:",
            typeof cachedAvatar
          );
          console.log(
            "🔍 [MIDDLEWARE] Tem método toDTO?",
            typeof cachedAvatar.toDTO
          );
          req.cachedAvatar = cachedAvatar;
        }

        next();
      } catch (error) {
        console.error(
          "❌ [CACHE] Erro no cache do avatar:",
          error?.message || error
        );
        next();
      }
    };
  }

  /**
   * Armazenar dados no cache após consulta
   */
  static storeWorldMap(data) {
    try {
      memoryCache.set("worldmap_all", data, 600);
      console.log("✅ [CACHE] WorldMap armazenado no cache");
    } catch (error) {
      console.error("❌ [CACHE] Erro ao armazenar WorldMap:", error);
    }
  }

  /**
   * Armazenar avatar no cache
   */
  static storeAvatar(userId, avatar) {
    try {
      const cacheKey = `avatar_${userId}`;

      // Garantir que é um plain object para evitar problemas de serialização
      let plainAvatar = avatar;
      if (typeof avatar.toDTO === "function") {
        plainAvatar = avatar.toDTO();
      } else if (typeof avatar.toObject === "function") {
        plainAvatar = avatar.toObject();
      }

      // Verificar se é um plain object válido
      const isPlainObject =
        plainAvatar &&
        typeof plainAvatar === "object" &&
        plainAvatar.constructor === Object;

      if (!isPlainObject) {
        console.warn(
          "⚠️ [CACHE] Avatar não é plain object, convertendo:",
          typeof plainAvatar
        );
        plainAvatar = JSON.parse(JSON.stringify(plainAvatar));
      }

      memoryCache.set(cacheKey, plainAvatar, 180);
      console.log("✅ [CACHE] Avatar armazenado no cache como plain object");
    } catch (error) {
      console.error(
        "❌ [CACHE] Erro ao armazenar avatar:",
        error?.message || error
      );
    }
  }

  /**
   * Invalidar cache do avatar quando alterado
   */
  static invalidateAvatar(userId) {
    try {
      const cacheKey = `avatar_${userId}`;
      memoryCache.del(cacheKey);
      console.log("🗑️ [CACHE] Cache do avatar invalidado");
    } catch (error) {
      console.error("❌ [CACHE] Erro ao invalidar cache:", error);
    }
  }

  /**
   * Limpar todo o cache (útil para debug)
   */
  static clearAll() {
    try {
      memoryCache.flushAll();
      console.log("🗑️ [CACHE] Todo cache foi limpo");
    } catch (error) {
      console.error("❌ [CACHE] Erro ao limpar cache:", error);
    }
  }

  /**
   * Obter estatísticas do cache
   */
  static getStats() {
    return {
      keys: memoryCache.keys().length,
      stats: memoryCache.getStats(),
    };
  }
}

module.exports = CacheMiddleware;
