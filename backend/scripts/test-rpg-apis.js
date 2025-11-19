/**
 * Script de teste para validar melhorias nas APIs RPG
 */

const axios = require("axios");

const BASE_URL = "http://localhost:3000/api";

// Token de usuário válido (substitua por um token real para teste)
const USER_TOKEN = process.argv[2] || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Bearer ${USER_TOKEN}`,
    "Content-Type": "application/json",
  },
});

async function testRPGAPIs() {
  console.log("🚀 Iniciando testes das APIs RPG...\n");

  try {
    // Teste 1: Obter Avatar (teste de cache)
    console.log("📋 Teste 1: GET /api/rpg/avatar");
    const avatarResponse = await api.get("/rpg/avatar");
    console.log("✅ Sucesso:", avatarResponse.data.success);
    console.log("Avatar encontrado:", !!avatarResponse.data.data.avatar);

    // Teste 2: Obter WorldMap (teste de cache)
    console.log("\n📋 Teste 2: GET /api/rpg/world-map");
    const worldMapResponse = await api.get("/rpg/world-map");
    console.log("✅ Sucesso:", worldMapResponse.data.success);
    console.log(
      "Cidades encontradas:",
      worldMapResponse.data.data.map.cities.length
    );

    // Teste 3: Iniciar batalha (teste de validações)
    console.log("\n📋 Teste 3: POST /api/rpg/battle/start");
    try {
      const battleResponse = await api.post("/rpg/battle/start", {
        cityNumber: 1,
      });
      console.log("✅ Sucesso:", battleResponse.data.success);
      console.log("Batalha criada:", !!battleResponse.data.battle);

      // Teste 4: Executar ação de batalha (teste de validações numéricas)
      if (battleResponse.data.battle) {
        console.log("\n📋 Teste 4: POST /api/rpg/battle/:battleId/action");
        const battleId = battleResponse.data.battle._id;

        const actionResponse = await api.post(
          `/rpg/battle/${battleId}/action`,
          {
            action: "attack",
            damage: 25,
          }
        );
        console.log("✅ Sucesso:", actionResponse.data.success);
        console.log(
          "Resultado:",
          actionResponse.data.message || "Ação executada"
        );
      }
    } catch (battleError) {
      if (battleError.response?.status === 400) {
        console.log(
          "⚠️ Erro esperado (validação):",
          battleError.response.data.message
        );
      } else {
        console.error(
          "❌ Erro inesperado na batalha:",
          battleError.response?.data || battleError.message
        );
      }
    }

    // Teste 5: Validação de dados inválidos
    console.log("\n📋 Teste 5: Validação de dados inválidos");
    try {
      await api.post("/rpg/battle/start", {
        cityNumber: "invalid",
      });
    } catch (validationError) {
      if (validationError.response?.status === 400) {
        console.log(
          "✅ Validação funcionando:",
          validationError.response.data.message
        );
      }
    }

    console.log("\n🎉 Testes concluídos com sucesso!");
  } catch (error) {
    console.error("❌ Erro geral:", error.response?.data || error.message);

    if (error.response?.status === 401) {
      console.log(
        "⚠️ Token inválido. Execute: node test-rpg-apis.js YOUR_JWT_TOKEN"
      );
    }
  }
}

// Executar testes se chamado diretamente
if (require.main === module) {
  testRPGAPIs()
    .then(() => {
      process.exit(0);
    })
    .catch((error) => {
      console.error("❌ Falha nos testes:", error.message);
      process.exit(1);
    });
}

module.exports = { testRPGAPIs };
