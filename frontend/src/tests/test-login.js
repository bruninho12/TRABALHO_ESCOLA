/**
 * Teste de login - verificar se CORS e autenticação funcionam
 */

const testLogin = async () => {
  console.log("🧪 Teste de login iniciado...\n");

  const loginData = {
    email: "admin@despfinance.com",
    password: "admin123",
  };

  try {
    console.log("🔍 Testando login...");
    console.log("📧 Email:", loginData.email);
    console.log("🔑 URL:", "http://192.168.100.7:3001/api/auth/login");

    const response = await fetch("http://192.168.100.7:3001/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Requested-With": "XMLHttpRequest",
        "Cache-Control": "no-store",
        Pragma: "no-cache",
      },
      mode: "cors",
      credentials: "include",
      body: JSON.stringify(loginData),
    });

    console.log("📊 Status da resposta:", response.status);
    console.log("📋 Headers da resposta:");
    for (let [key, value] of response.headers.entries()) {
      console.log(`  ${key}: ${value}`);
    }

    if (response.ok) {
      const data = await response.json();
      console.log("✅ Login realizado com sucesso!");
      console.log("👤 Usuário:", data.user?.name || "N/A");
      console.log("🔑 Token presente:", !!data.token);
      return { success: true, data };
    } else {
      const errorData = await response
        .json()
        .catch(() => ({ message: "Erro desconhecido" }));
      console.log("❌ Erro no login:", errorData.message);
      return { success: false, error: errorData };
    }
  } catch (error) {
    console.log("💥 Erro de rede:", error.message);

    if (error.message.includes("CORS") || error.message.includes("blocked")) {
      console.log("🚨 ERRO DE CORS DETECTADO!");
    }

    return { success: false, error: error.message };
  }
};

// Executar teste
testLogin()
  .then((result) => {
    console.log("\n🏁 Resultado final:", result.success ? "SUCESSO" : "FALHA");
  })
  .catch(console.error);
