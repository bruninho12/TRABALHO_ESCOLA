// Arquivo de depuração para testar a API

// 1. Configuração para o ambiente de teste
const API_URL = "https://trabalho-escola-black.vercel.app";

// 2. Usuário de teste
const EMAIL_TESTE = "bruno@teste.com";
const SENHA_TESTE = "123456";

// 3. Função para testar a conexão básica
async function testarConexaoAPI() {
  try {
    console.log("Testando conexão com a API...");
    const resposta = await fetch(API_URL);
    const dados = await resposta.json();
    console.log("Conexão com API bem-sucedida:", dados);
    return dados;
  } catch (erro) {
    console.error("❌ Erro na conexão com API:", erro);
    return null;
  }
}

// 4. Função para testar login
async function testarLogin(email, senha) {
  try {
    console.log(`Testando login com ${email}...`);
    const resposta = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ email, senha }),
    });

    console.log("Status da resposta:", resposta.status);
    console.log("Headers:", Object.fromEntries(resposta.headers.entries()));

    const dados = await resposta.json();
    console.log("Resposta do login:", dados);
    return dados;
  } catch (erro) {
    console.error("❌ Erro ao fazer login:", erro);
    return null;
  }
}

// 5. Função para testar uma requisição autenticada
async function testarRequisicaoAutenticada(token) {
  try {
    console.log("Testando requisição autenticada...");
    const resposta = await fetch(`${API_URL}/resumo`, {
      headers: {
        Authorization: token,
      },
    });

    console.log("Status da resposta autenticada:", resposta.status);
    const dados = await resposta.json();
    console.log("Resposta da requisição autenticada:", dados);
    return dados;
  } catch (erro) {
    console.error("❌ Erro na requisição autenticada:", erro);
    return null;
  }
}

// 6. Função para executar todos os testes
async function executarTestes() {
  // Teste de conexão básica
  const conexao = await testarConexaoAPI();
  if (!conexao) {
    console.error("Teste de conexão falhou. Abortando os demais testes.");
    return;
  }

  // Teste de login
  const dadosLogin = await testarLogin(EMAIL_TESTE, SENHA_TESTE);
  if (!dadosLogin || !dadosLogin.token) {
    console.error("Teste de login falhou. Abortando os demais testes.");
    return;
  }

  // Teste de requisição autenticada com Bearer
  const token = "Bearer " + dadosLogin.token;
  console.log("Token formatado para teste: ", token);
  await testarRequisicaoAutenticada(token);

  // Teste também com o token simples para verificar o comportamento
  console.log("Testando também com token simples (sem Bearer)...");
  await testarRequisicaoAutenticada(dadosLogin.token);
}

// Executar os testes automaticamente
window.addEventListener("DOMContentLoaded", () => {
  const botaoTeste = document.createElement("button");
  botaoTeste.textContent = "Executar Testes de API";
  botaoTeste.style.position = "fixed";
  botaoTeste.style.bottom = "20px";
  botaoTeste.style.right = "20px";
  botaoTeste.style.zIndex = "9999";
  botaoTeste.style.padding = "10px 15px";
  botaoTeste.style.background = "#0078d7";
  botaoTeste.style.color = "white";
  botaoTeste.style.border = "none";
  botaoTeste.style.borderRadius = "4px";
  botaoTeste.style.cursor = "pointer";

  botaoTeste.addEventListener("click", executarTestes);
  document.body.appendChild(botaoTeste);

  console.log("Debug API carregado! Clique no botão para executar os testes.");
});
