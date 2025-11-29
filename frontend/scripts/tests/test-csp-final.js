/**
 * Teste final da CSP - verificar se as conexões funcionam sem violar CSP
 */

const testCSP = async () => {
  console.log("🧪 Teste final da CSP iniciado...\n");

  const urls = [
    "http://localhost:3001/api/health",
    "http://192.168.100.7:3001/api/health",
  ];

  for (const url of urls) {
    try {
      console.log(`🔍 Testando: ${url}`);

      const response = await fetch(url, {
        method: "GET",
        mode: "cors",
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        console.log(`✅ ${url} - OK:`, data.status);
      } else {
        console.log(`❌ ${url} - Erro HTTP:`, response.status);
      }
    } catch (error) {
      console.log(`💥 ${url} - Erro:`, error.message);

      // Verificar se é erro de CSP
      if (
        error.message.includes("Content Security Policy") ||
        error.message.includes("violates") ||
        error.message.includes("blocked")
      ) {
        console.log("🚨 ERRO DE CSP DETECTADO!");
      }
    }
    console.log(""); // linha em branco
  }

  // Testar WebSocket
  console.log("🔍 Testando WebSocket (HMR)...");
  try {
    const ws = new WebSocket("ws://localhost:24678/?token=test");
    ws.onopen = () => {
      console.log("✅ WebSocket conectado com sucesso");
      ws.close();
    };
    ws.onerror = (error) => {
      console.log("❌ Erro WebSocket:", error);
    };
  } catch (error) {
    console.log("💥 Erro WebSocket:", error.message);
  }

  console.log("\n🏁 Teste concluído!");
};

// Executar teste
testCSP().catch(console.error);
