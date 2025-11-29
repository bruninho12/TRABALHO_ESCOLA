/**
 * Teste direto da API do avatar sem cache
 */

const http = require("http");

// Token fake só para teste da estrutura
const fakeToken = "Bearer test123";

const options = {
  hostname: "localhost",
  port: 3001,
  path: "/api/rpg/avatar",
  method: "GET",
  headers: {
    "Content-Type": "application/json",
    Authorization: fakeToken,
  },
};

console.log("🧪 Testando API do avatar sem cache...");

const req = http.request(options, (res) => {
  console.log(`📊 Status: ${res.statusCode}`);
  console.log(`📋 Headers:`, res.headers);

  let data = "";
  res.on("data", (chunk) => {
    data += chunk;
  });

  res.on("end", () => {
    try {
      const response = JSON.parse(data);
      console.log("📝 Resposta:", JSON.stringify(response, null, 2));

      if (res.statusCode === 401) {
        console.log("✅ Erro de autenticação esperado (token inválido)");
        console.log("🎯 Estrutura da API funcionando!");
      } else if (res.statusCode === 200) {
        console.log("✅ API funcionando perfeitamente!");
      } else {
        console.log("⚠️ Status inesperado:", res.statusCode);
      }
    } catch (e) {
      console.log("📝 Resposta raw:", data);
    }
  });
});

req.on("error", (e) => {
  console.error(`❌ Erro na requisição: ${e.message}`);
});

req.end();

setTimeout(() => {
  process.exit(0);
}, 3000);
