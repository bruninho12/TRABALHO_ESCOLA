/**
 * Script para limpar cache problemático e testar avatar
 */

const CacheMiddleware = require("../src/middleware/cacheMiddleware");

async function clearProblematicCache() {
  try {
    console.log("🧹 Limpando cache problemático...");

    // Limpar todo o cache para garantir que não há objetos corrompidos
    CacheMiddleware.clearAll();

    console.log("✅ Cache limpo com sucesso!");
    console.log("📊 Estatísticas do cache:", CacheMiddleware.getStats());
  } catch (error) {
    console.error("❌ Erro ao limpar cache:", error.message);
  }
}

if (require.main === module) {
  clearProblematicCache();
}

module.exports = { clearProblematicCache };
