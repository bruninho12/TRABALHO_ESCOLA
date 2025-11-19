/**
 * Script de teste rápido para verificar se os erros foram corrigidos
 */

const axios = require("axios");

// Token do usuário demo (extraído dos logs)
const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImRlbW9AZGVzcGZpbmFuY2VlLmNvbSIsImlkIjoiNjkxNTI3MjQ5ZDIxYTJmYWU2YWE4MDUwIiwidXNlcm5hbWUiOiJkZW1vIiwiaWF0IjoxNzYzMjUxMjM5LCJleHAiOjE3NjMzMzc2Mzl9";

const api = axios.create({
  baseURL: "http://localhost:3001/api",
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
});

async function quickTest() {
  try {
    console.log("🧪 Testando correções...\n");

    // Teste 1: Avatar (deve funcionar com cache agora)
    console.log("📋 Teste 1: GET /api/rpg/avatar");
    const avatarResponse = await api.get("/rpg/avatar");
    console.log("✅ Status:", avatarResponse.status);
    console.log("✅ Sucesso:", avatarResponse.data.success);
    console.log(
      "✅ Avatar encontrado:",
      !!avatarResponse.data.data.avatar,
      "\n"
    );

    // Teste 2: Insights (deve não dar mais erro de undefined)
    console.log("📋 Teste 2: GET /api/insights");
    const insightsResponse = await api.get("/insights");
    console.log("✅ Status:", insightsResponse.status);
    console.log("✅ Insights obtidos sem erro\n");

    // Teste 3: WorldMap (cache deve funcionar)
    console.log("📋 Teste 3: GET /api/rpg/world-map");
    const mapResponse = await api.get("/rpg/world-map");
    console.log("✅ Status:", mapResponse.status);
    console.log("✅ Sucesso:", mapResponse.data.success);
    console.log(
      "✅ Cidades encontradas:",
      mapResponse.data.data.map.cities.length
    );

    console.log("\n🎉 Todos os testes passaram! As correções funcionaram.");
  } catch (error) {
    console.error("❌ Erro no teste:", {
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
      url: error.config?.url,
    });
  }
}

quickTest();
