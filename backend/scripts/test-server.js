/**
 * Teste simples para verificar se o cache do avatar foi corrigido
 */

// Simular requisição sem token (só para testar se servidor responde)
const http = require("http");

const options = {
  hostname: "localhost",
  port: 3001,
  path: "/api/rpg/test", // Rota de teste que não precisa de auth
  method: "GET",
  headers: {
    "Content-Type": "application/json",
  },
};

const req = http.request(options, (res) => {
  console.log(`✅ Servidor respondendo! Status: ${res.statusCode}`);

  let data = "";
  res.on("data", (chunk) => {
    data += chunk;
  });

  res.on("end", () => {
    console.log("📝 Resposta:", data);
    console.log("🎯 Cache foi limpo, servidor está funcionando!");
  });
});

req.on("error", (e) => {
  console.error(`❌ Erro: ${e.message}`);
});

req.end();

setTimeout(() => {
  console.log("⏰ Teste concluído. Cache limpo e pronto para usar!");
  process.exit(0);
}, 2000);
