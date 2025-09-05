/**
 * Função para testar a conexão com a API
 * Use essa função para verificar se a API está respondendo corretamente
 * e se os cabeçalhos CORS estão configurados corretamente
 */
async function testeCORS() {
  try {
    const start = performance.now();

    // Teste com diferentes URLs
    const urls = [
      "https://trabalho-escola-api.vercel.app/cors-test",
      api + "/cors-test",
      api,
    ];

    for (const url of urls) {
      console.log(`🔍 Testando conexão com: ${url}`);

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        mode: "cors",
        credentials: "omit",
      });

      const data = await response.json();
      console.log(`✅ Resposta de ${url}:`, data);
      console.log(`📋 Headers recebidos:`, {
        "access-control-allow-origin": response.headers.get(
          "access-control-allow-origin"
        ),
        "content-type": response.headers.get("content-type"),
      });
    }

    const end = performance.now();
    console.log(`⏱️ Teste CORS completado em ${(end - start).toFixed(2)}ms`);
    return true;
  } catch (error) {
    console.error("❌ Erro no teste CORS:", error);
    return false;
  }
}
