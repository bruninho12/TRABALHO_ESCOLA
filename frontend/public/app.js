// API URL - detecção automática de ambiente
let api;

// Configuração de ambientes - Simplificado para usar apenas o Render em produção
const environments = {
  local: "http://localhost:3001", // Backend local para desenvolvimento
  production: "https://controle-despesas-c7oj.onrender.com", // URL do backend no Render para produção
};

// Detectar ambiente - Versão simples e robusta
function detectEnvironment() {
  const hostname = window.location.hostname;

  // Ambiente local - usa a API local
  if (
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname.startsWith("192.168.")
  ) {
    console.log("🏠 Ambiente local detectado - usando API local");
    return environments.local;
  }

  // Qualquer outro ambiente (Vercel em produção) - usa a API no Render
  console.log("🌐 Ambiente de produção detectado - usando API no Render");
  return environments.production;
}

api = detectEnvironment();

// Log para debug
console.log(`🌐 Ambiente detectado: ${api}`);

// Função para verificar autenticação
function verificarLogin() {
  const token = localStorage.getItem("authToken");
  const usuario = localStorage.getItem("usuario");

  if (token && usuario) {
    try {
      // Adicionar o prefixo "Bearer " ao token
      authToken = "Bearer " + token;
      usuarioAtual = JSON.parse(usuario);
      console.log("Usuário autenticado:", usuarioAtual);
      console.log("Token formatado para backend:", authToken);

      // Validar o token fazendo uma requisição simples ao servidor
      fetch(api + "/resumo", {
        headers: { Authorization: authToken },
      })
        .then((res) => {
          if (res.ok) {
            // Token válido, mostrar página principal
            mostrarPaginaPrincipal();
          } else {
            // Token inválido ou expirado, fazer logout
            console.log("Token inválido ou expirado, realizando logout");
            logout();
          }
        })
        .catch((err) => {
          console.error("Erro ao validar token:", err);
          // Em caso de erro de conectividade, mostrar página principal de qualquer forma
          // O usuário receberá erros de conexão ao tentar usar a aplicação
          mostrarPaginaPrincipal();
        });
    } catch (err) {
      console.error("Erro ao processar dados salvos:", err);
      logout();
    }
  } else {
    mostrarPaginaLogin();
  }
}

// Função helper para requisições HTTP com configurações CORS robustas
async function apiRequest(endpoint, options = {}) {
  // Identificar o ambiente atual para logs de forma simples
  const env =
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1"
      ? "Local"
      : "Produção";

  const defaultOptions = {
    mode: "cors",
    credentials: "omit",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Origin: window.location.origin,
      "X-Requested-With": "XMLHttpRequest", // Adicional para alguns servidores
      ...options.headers,
    },
  };

  const finalOptions = { ...defaultOptions, ...options };

  try {
    console.log(`🔄 [${env}] Fazendo requisição para: ${api}${endpoint}`, {
      url: `${api}${endpoint}`,
      method: finalOptions.method || "GET",
      headers: finalOptions.headers,
      fromOrigin: window.location.origin,
      toOrigin: new URL(api).origin,
    });
    const response = await fetch(`${api}${endpoint}`, finalOptions);

    if (!response.ok) {
      console.error(
        `❌ Erro na resposta: ${response.status} ${response.statusText}`
      );
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("❌ Erro na requisição:", error);

    // Log detalhado para diagnóstico
    console.log("Detalhes da requisição que falhou:", {
      url: `${api}${endpoint}`,
      options: finalOptions,
      error: error.message,
    });

    throw error;
  }
}

// Função para tentar o cadastro com múltiplos métodos
async function tentarCadastro(dados) {
  // Usamos método simples: estamos em produção ou local?
  const isProduction =
    window.location.hostname !== "localhost" &&
    window.location.hostname !== "127.0.0.1";

  console.log(
    `🔄 Cadastro: usando API ${api} em ambiente ${
      isProduction ? "de produção" : "local"
    }`
  );

  try {
    // Primeira tentativa com apiRequest padrão

    return await apiRequest("/cadastro", {
      method: "POST",
      body: JSON.stringify(dados),
    });
  } catch (error) {
    console.log(
      "Primeira tentativa de cadastro falhou, tentando com configuração alternativa para Vercel->Render"
    );

    try {
      // Segunda tentativa com fetch direto e headers adicionais otimizados para Vercel->Render
      console.log(
        `🔄 Segunda tentativa para ${api}/cadastro com headers especiais`
      );

      // Verificar URL do Render para garantir HTTPS
      let apiUrl = api;
      if (api.includes("render.com") && !api.startsWith("https:")) {
        apiUrl = api.replace("http:", "https:");
        console.log("⚠️ Convertendo URL para HTTPS:", apiUrl);
      }

      const response = await fetch(`${apiUrl}/cadastro`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "Access-Control-Request-Method": "POST",
          "Access-Control-Request-Headers": "content-type, accept",
          Origin: window.location.origin,
          "X-Requested-With": "XMLHttpRequest",
        },
        mode: "cors",
        credentials: "omit",
        body: JSON.stringify(dados),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (secondError) {
      console.error("Segunda tentativa falhou:", secondError);

      // Terceira tentativa com XMLHttpRequest (pode contornar alguns problemas de CORS)
      return new Promise((resolve, reject) => {
        console.log(
          "Tentando cadastro com XMLHttpRequest como último recurso (Vercel->Render)"
        );

        // Verificar URL do Render para garantir HTTPS
        let apiUrl = api;
        if (api.includes("render.com") && !api.startsWith("https:")) {
          apiUrl = api.replace("http:", "https:");
          console.log("⚠️ Convertendo URL para HTTPS:", apiUrl);
        }

        const xhr = new XMLHttpRequest();
        xhr.open("POST", `${apiUrl}/cadastro`, true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.setRequestHeader("Accept", "application/json");
        xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
        xhr.setRequestHeader("Origin", window.location.origin);
        xhr.withCredentials = false;

        xhr.onload = function () {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const data = JSON.parse(xhr.responseText);
              resolve(data);
            } catch (e) {
              reject(new Error("Erro ao analisar resposta JSON"));
            }
          } else {
            reject(new Error(`XHR Error: ${xhr.status}`));
          }
        };

        xhr.onerror = function () {
          reject(new Error("Erro de rede ao tentar cadastro"));
        };

        xhr.send(JSON.stringify(dados));
      });
    }
  }
}

// Estado da aplicação
let usuarioAtual = null;
let authToken = null;

function showMessage(msg, type = "success") {
  let msgDiv = document.getElementById("msg-feedback");
  if (!msgDiv) {
    msgDiv = document.createElement("div");
    msgDiv.id = "msg-feedback";
    msgDiv.style.position = "fixed";
    msgDiv.style.top = "20px";
    msgDiv.style.left = "50%";
    msgDiv.style.transform = "translateX(-50%)";
    msgDiv.style.zIndex = "9999";
    msgDiv.style.padding = "14px 32px";
    msgDiv.style.borderRadius = "8px";
    msgDiv.style.fontWeight = "bold";
    msgDiv.style.fontSize = "1.1rem";
    msgDiv.style.boxShadow = "0 2px 12px #00eaff55";
    document.body.appendChild(msgDiv);
  }
  msgDiv.innerText = msg;
  msgDiv.style.background =
    type === "success" ? "linear-gradient(90deg,#00eaff,#0078d7)" : "#ff3b3b";
  msgDiv.style.color = type === "success" ? "#0f2027" : "#fff";
  msgDiv.style.display = "block";
  setTimeout(() => {
    msgDiv.style.display = "none";
  }, 2500);
}

// Funções de autenticação
function realizarLogin(event) {
  event.preventDefault();
  const email = document.getElementById("email").value.trim();
  const senha = document.getElementById("senha").value.trim();

  if (!email || !senha) {
    showMessage("Preencha todos os campos!", "error");
    return;
  }

  // Desabilitar o botão durante o processo de login
  const submitBtn = document.querySelector("#form-login button[type='submit']");
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = "Entrando...";
  }

  console.log("Tentando login com:", { email });

  apiRequest("/login", {
    method: "POST",
    body: JSON.stringify({ email, senha }),
  })
    .then((data) => {
      console.log("Resposta do login:", data);
      if (data.status === "success" && data.token) {
        usuarioAtual = data.usuario;
        // Salvamos o token sem o prefixo no localStorage
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("usuario", JSON.stringify(usuarioAtual));
        // Para uso imediato, adicionamos o prefixo "Bearer "
        authToken = "Bearer " + data.token;
        showMessage("Login realizado com sucesso!");
        mostrarPaginaPrincipal();
      } else {
        showMessage(data.message || "Erro no login", "error");
        // Reabilitar o botão se o login falhar
        const submitBtn = document.querySelector(
          "#form-login button[type='submit']"
        );
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = "Entrar";
        }
      }
    })
    .catch((err) => {
      showMessage("Erro ao fazer login", "error");
      console.error(err);

      // Reabilitar o botão em caso de erro
      const submitBtn = document.querySelector(
        "#form-login button[type='submit']"
      );
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = "Entrar";
      }
    });
}

function realizarCadastro(event) {
  event.preventDefault();
  const nome = document.getElementById("nome-cadastro").value.trim();
  const email = document.getElementById("email-cadastro").value.trim();
  const senha = document.getElementById("senha-cadastro").value.trim();

  if (!nome || !email || !senha) {
    showMessage("Preencha todos os campos!", "error");
    return;
  }

  // Validação básica de email no frontend
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    showMessage("Formato de email inválido", "error");
    return;
  }

  // Validação básica de senha
  if (senha.length < 6) {
    showMessage("A senha deve ter pelo menos 6 caracteres", "error");
    return;
  }

  // Desabilitar o botão durante o processo de cadastro
  const submitBtn = document.querySelector(
    "#form-cadastro button[type='submit']"
  );
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = "Cadastrando...";
  }

  console.log("Tentando cadastro com:", { email, nome });

  // Exibe informações de debug sobre a chamada API que vai ser feita
  console.log("Informações de CORS Debug:", {
    apiUrl: api,
    endpoint: "/cadastro",
    currentOrigin: window.location.origin,
    browserInfo: navigator.userAgent,
  });

  // Usa a função robusta que implementamos para lidar com CORS
  tentarCadastro({ nome, email, senha })
    .then((data) => {
      console.log("Resposta do cadastro:", data);
      if (data.status === "success" && data.token) {
        usuarioAtual = data.usuario;
        // Salvamos o token sem o prefixo no localStorage
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("usuario", JSON.stringify(usuarioAtual));
        // Para uso imediato, adicionamos o prefixo "Bearer "
        authToken = "Bearer " + data.token;
        showMessage("Cadastro realizado com sucesso!");
        mostrarPaginaPrincipal();
      } else {
        showMessage(data.message || "Erro no cadastro", "error");
        // Reabilitar o botão se o cadastro falhar
        const submitBtn = document.querySelector(
          "#form-cadastro button[type='submit']"
        );
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = "Cadastrar";
        }
      }
    })
    .catch((err) => {
      showMessage("Erro ao fazer cadastro", "error");
      console.error(err);
      // Reabilitar o botão em caso de erro
      const submitBtn = document.querySelector(
        "#form-cadastro button[type='submit']"
      );
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = "Cadastrar";
      }
    });
}

function logout() {
  usuarioAtual = null;
  authToken = null;
  localStorage.removeItem("authToken");
  localStorage.removeItem("usuario");
  mostrarPaginaLogin();
  showMessage("Logout realizado com sucesso!");
}

// Funções de navegação entre páginas
function mostrarPaginaLogin() {
  const loginPage = document.getElementById("login-page");
  const cadastroPage = document.getElementById("cadastro-page");
  const mainPage = document.getElementById("main-page");
  const navbarUser = document.getElementById("navbar-user");

  if (loginPage) loginPage.style.display = "flex";
  if (cadastroPage) cadastroPage.style.display = "none";
  if (mainPage) mainPage.style.display = "none";
  if (navbarUser) navbarUser.style.display = "none";
}

function mostrarPaginaCadastro() {
  const loginPage = document.getElementById("login-page");
  const cadastroPage = document.getElementById("cadastro-page");
  const mainPage = document.getElementById("main-page");

  if (loginPage) loginPage.style.display = "none";
  if (cadastroPage) cadastroPage.style.display = "flex";
  if (mainPage) mainPage.style.display = "none";
}

function mostrarPaginaPrincipal() {
  const loginPage = document.getElementById("login-page");
  const cadastroPage = document.getElementById("cadastro-page");
  const mainPage = document.getElementById("main-page");
  const navbarUser = document.getElementById("navbar-user");
  const userName = document.getElementById("user-name");

  if (loginPage) loginPage.style.display = "none";
  if (cadastroPage) cadastroPage.style.display = "none";
  if (mainPage) mainPage.style.display = "block";
  if (navbarUser) navbarUser.style.display = "flex";
  if (userName && usuarioAtual) userName.textContent = usuarioAtual.nome;
  carregarDados();
}

// Funções de dados
function carregarDados() {
  console.log("Carregando dados com token:", authToken);
  carregarResumo();
  carregarDespesas();
  carregarReceitas();
  carregarHistoricoCompleto();
}

function carregarResumo() {
  console.log("Carregando resumo com token:", authToken);
  apiRequest("/resumo", {
    headers: { Authorization: authToken },
  })
    .then((response) => {
      console.log("Resposta de resumo:", response);

      // Verificar se a resposta tem a estrutura esperada
      if (!response || !response.status) {
        console.error("Formato de resposta inválido:", response);
        return;
      }

      // Se não tiver success no status, mostrar erro
      if (response.status !== "success") {
        console.error(
          "Erro na resposta:",
          response.message || "Erro desconhecido"
        );
        return;
      }

      // Verificar se os dados existem
      if (!response.data) {
        console.error("Dados inválidos na resposta:", response.data);
        return;
      }

      const data = response.data;

      const totalReceitasEl = document.getElementById("total-receitas");
      if (totalReceitasEl) {
        const valor = data.totalReceitas || 0;
        totalReceitasEl.textContent = `R$ ${valor.toLocaleString("pt-BR", {
          minimumFractionDigits: 2,
        })}`;
      }

      const totalDespesasEl = document.getElementById("total-despesas");
      if (totalDespesasEl) {
        const valor = data.totalDespesas || 0;
        totalDespesasEl.textContent = `R$ ${valor.toLocaleString("pt-BR", {
          minimumFractionDigits: 2,
        })}`;
      }

      const saldoTotalEl = document.getElementById("saldo-total");
      if (saldoTotalEl) {
        const saldo = data.saldo || 0;
        saldoTotalEl.textContent = `R$ ${saldo.toLocaleString("pt-BR", {
          minimumFractionDigits: 2,
        })}`;

        // Atualiza classe do saldo baseado no valor
        if (saldo >= 0) {
          saldoTotalEl.style.color = "#28a745";
          saldoTotalEl.style.fontWeight = "bold";
        } else {
          saldoTotalEl.style.color = "#dc3545";
          saldoTotalEl.style.fontWeight = "bold";
        }
      }

      // Exibe categorias
      const categoriasLista = document.getElementById("categorias-lista");
      if (categoriasLista && data.despesasPorCategoria) {
        categoriasLista.innerHTML = "";
        Object.entries(data.despesasPorCategoria).forEach(
          ([categoria, valor]) => {
            const div = document.createElement("div");
            div.className = "categoria-item";
            div.innerHTML = `
            <span>${categoria}</span>
            <span>R$ ${valor.toLocaleString("pt-BR", {
              minimumFractionDigits: 2,
            })}</span>
          `;
            categoriasLista.appendChild(div);
          }
        );
      }
    })
    .catch((err) => {
      showMessage("Erro ao carregar resumo", "error");
      console.error(err);
    });
}

function adicionarDespesa(event) {
  event.preventDefault();
  const descricao = document.getElementById("descricao-despesa").value.trim();
  const valor = document.getElementById("valor-despesa").value.trim();
  const categoria = document.getElementById("categoria-despesa").value.trim();
  const data = document.getElementById("data-despesa").value;

  // Validações aprimoradas
  if (!descricao || !valor || !categoria || !data) {
    showMessage("Preencha todos os campos!", "error");
    return;
  }

  if (descricao.length < 3) {
    showMessage("A descrição deve ter pelo menos 3 caracteres", "error");
    return;
  }

  const valorNumerico = parseFloat(valor);
  if (isNaN(valorNumerico) || valorNumerico <= 0) {
    showMessage("O valor deve ser um número positivo", "error");
    return;
  }

  if (categoria.length < 2) {
    showMessage("Informe uma categoria válida", "error");
    return;
  }

  // Desabilitar o botão durante o processamento
  const submitBtn = document.querySelector(
    "#form-despesa button[type='submit']"
  );
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = "Adicionando...";
    submitBtn.classList.add("loading");
  }

  console.log("Adicionando despesa com token:", authToken);
  fetch(api + "/despesas", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: authToken,
    },
    body: JSON.stringify({
      descricao,
      valor: valorNumerico,
      categoria,
      data,
      tipo: "despesa",
    }),
  })
    .then((res) => {
      console.log("Status da resposta de adicionar despesa:", res.status);
      if (!res.ok) {
        console.error(
          "Erro na resposta de adicionar despesa:",
          res.status,
          res.statusText
        );
        throw new Error(`Erro ${res.status}: ${res.statusText}`);
      }
      return res.json();
    })
    .then((response) => {
      console.log("Resposta de adicionar despesa:", response);
      if (response.status === "success") {
        showMessage("Despesa adicionada com sucesso!");
        document.getElementById("form-despesa").reset();
        carregarDados();
      } else {
        showMessage(response.message || "Erro ao adicionar despesa", "error");
        console.error("Erro na resposta:", response);
      }
    })
    .catch((err) => {
      showMessage("Erro ao adicionar despesa: " + err.message, "error");
      console.error(err);
    })
    .finally(() => {
      // Reabilitar o botão após o processamento
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = "Adicionar Despesa";
        submitBtn.classList.remove("loading");
      }
    });
}

function adicionarReceita(event) {
  event.preventDefault();
  const descricao = document.getElementById("descricao-receita").value.trim();
  const valor = document.getElementById("valor-receita").value.trim();
  const categoria = document.getElementById("categoria-receita").value.trim();
  const data = document.getElementById("data-receita").value;

  // Validações aprimoradas
  if (!descricao || !valor || !categoria || !data) {
    showMessage("Preencha todos os campos!", "error");
    return;
  }

  if (descricao.length < 3) {
    showMessage("A descrição deve ter pelo menos 3 caracteres", "error");
    return;
  }

  const valorNumerico = parseFloat(valor);
  if (isNaN(valorNumerico) || valorNumerico <= 0) {
    showMessage("O valor deve ser um número positivo", "error");
    return;
  }

  if (categoria.length < 2) {
    showMessage("Informe uma categoria válida", "error");
    return;
  }

  // Desabilitar o botão durante o processamento
  const submitBtn = document.querySelector(
    "#form-receita button[type='submit']"
  );
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = "Adicionando...";
    submitBtn.classList.add("loading");
  }

  console.log("Adicionando receita com token:", authToken);
  fetch(api + "/despesas", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: authToken,
    },
    body: JSON.stringify({
      descricao,
      valor: valorNumerico,
      categoria,
      data,
      tipo: "receita",
    }),
  })
    .then((res) => {
      console.log("Status da resposta de adicionar receita:", res.status);
      if (!res.ok) {
        console.error(
          "Erro na resposta de adicionar receita:",
          res.status,
          res.statusText
        );
        throw new Error(`Erro ${res.status}: ${res.statusText}`);
      }
      return res.json();
    })
    .then((response) => {
      console.log("Resposta de adicionar receita:", response);
      if (response.status === "success") {
        showMessage("Receita adicionada com sucesso!");
        document.getElementById("form-receita").reset();
        carregarDados();
      } else {
        showMessage(response.message || "Erro ao adicionar receita", "error");
        console.error("Erro na resposta:", response);
      }
    })
    .catch((err) => {
      showMessage("Erro ao adicionar receita: " + err.message, "error");
      console.error(err);
    })
    .finally(() => {
      // Reabilitar o botão após o processamento
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = "Adicionar Receita";
        submitBtn.classList.remove("loading");
      }
    });
}

function carregarDespesas() {
  console.log("Carregando despesas com token:", authToken);
  fetch(api + "/despesas", {
    headers: { Authorization: authToken },
  })
    .then((res) => {
      console.log("Status da resposta de despesas:", res.status);
      if (!res.ok) {
        console.error(
          "Erro na resposta de despesas:",
          res.status,
          res.statusText
        );
      }
      return res.json();
    })
    .then((response) => {
      console.log("Resposta de despesas:", response);

      // Verificar se a resposta tem a estrutura esperada
      if (!response || !response.status) {
        console.error("Formato de resposta inválido:", response);
        return;
      }

      // Se não tiver success no status, mostrar erro
      if (response.status !== "success") {
        console.error(
          "Erro na resposta:",
          response.message || "Erro desconhecido"
        );
        return;
      }

      // Verificar se os dados existem e são um array
      if (!response.data || !Array.isArray(response.data)) {
        console.error("Dados inválidos na resposta:", response.data);
        return;
      }

      const despesas = response.data;
      const listaDespesas = document.getElementById("lista-despesas");
      if (!listaDespesas) {
        console.warn("Elemento lista-despesas não encontrado");
        return;
      }
      listaDespesas.innerHTML = "";

      const despesasFiltradas = despesas.filter((d) => d.tipo === "despesa");
      despesasFiltradas.forEach((despesa) => {
        const div = document.createElement("div");
        div.className = "item-financeiro";
        div.innerHTML = `
          <div class="item-info">
            <h4>${despesa.descricao}</h4>
            <p>Categoria: ${despesa.categoria}</p>
            <p>Data: ${new Date(despesa.data).toLocaleDateString()}</p>
          </div>
          <div class="item-valor despesa-valor">
            R$ ${despesa.valor.toLocaleString("pt-BR", {
              minimumFractionDigits: 2,
            })}
          </div>
          <div class="item-acoes">
            <button onclick="excluirItem(${
              despesa.id
            })" class="btn-excluir-item">Excluir</button>
          </div>
        `;
        listaDespesas.appendChild(div);
      });
    })
    .catch((err) => {
      showMessage("Erro ao carregar despesas", "error");
      console.error(err);
    });
}

function carregarReceitas() {
  console.log("Carregando receitas com token:", authToken);
  fetch(api + "/despesas", {
    headers: { Authorization: authToken },
  })
    .then((res) => {
      console.log("Status da resposta de receitas:", res.status);
      if (!res.ok) {
        console.error(
          "Erro na resposta de receitas:",
          res.status,
          res.statusText
        );
      }
      return res.json();
    })
    .then((response) => {
      console.log("Resposta de receitas:", response);

      // Verificar se a resposta tem a estrutura esperada
      if (!response || !response.status) {
        console.error("Formato de resposta inválido:", response);
        return;
      }

      // Se não tiver success no status, mostrar erro
      if (response.status !== "success") {
        console.error(
          "Erro na resposta:",
          response.message || "Erro desconhecido"
        );
        return;
      }

      // Verificar se os dados existem e são um array
      if (!response.data || !Array.isArray(response.data)) {
        console.error("Dados inválidos na resposta:", response.data);
        return;
      }

      const despesas = response.data;
      const listaReceitas = document.getElementById("lista-receitas");
      if (!listaReceitas) {
        console.warn("Elemento lista-receitas não encontrado");
        return;
      }
      listaReceitas.innerHTML = "";

      const receitasFiltradas = despesas.filter((d) => d.tipo === "receita");
      receitasFiltradas.forEach((receita) => {
        const div = document.createElement("div");
        div.className = "item-financeiro";
        div.innerHTML = `
          <div class="item-info">
            <h4>${receita.descricao}</h4>
            <p>Categoria: ${receita.categoria}</p>
            <p>Data: ${new Date(receita.data).toLocaleDateString()}</p>
          </div>
          <div class="item-valor receita-valor">
            R$ ${receita.valor.toLocaleString("pt-BR", {
              minimumFractionDigits: 2,
            })}
          </div>
          <div class="item-acoes">
            <button onclick="excluirItem(${
              receita.id
            })" class="btn-excluir-item">Excluir</button>
          </div>
        `;
        listaReceitas.appendChild(div);
      });
    })
    .catch((err) => {
      showMessage("Erro ao carregar receitas", "error");
      console.error(err);
    });
}

function carregarHistoricoCompleto() {
  console.log("Carregando histórico com token:", authToken);

  // Mostrar indicador de carregamento
  const historicoCompleto = document.getElementById("historico-completo");
  if (historicoCompleto) {
    historicoCompleto.innerHTML =
      '<div class="loading-indicator">Carregando histórico...</div>';
  }

  fetch(api + "/despesas", {
    headers: { Authorization: authToken },
  })
    .then((res) => {
      console.log("Status da resposta de histórico:", res.status);
      if (!res.ok) {
        console.error(
          "Erro na resposta de histórico:",
          res.status,
          res.statusText
        );
        throw new Error(`Erro ${res.status}: ${res.statusText}`);
      }
      return res.json();
    })
    .then((response) => {
      console.log("Resposta de histórico:", response);

      // Verificar se a resposta tem a estrutura esperada
      if (!response || !response.status) {
        console.error("Formato de resposta inválido:", response);
        throw new Error("Formato de resposta inválido");
      }

      // Se não tiver success no status, mostrar erro
      if (response.status !== "success") {
        console.error(
          "Erro na resposta:",
          response.message || "Erro desconhecido"
        );
        throw new Error(response.message || "Erro desconhecido");
      }

      // Verificar se os dados existem e são um array
      if (!response.data || !Array.isArray(response.data)) {
        console.error("Dados inválidos na resposta:", response.data);
        throw new Error("Dados inválidos na resposta");
      }

      const itens = response.data;
      const historicoCompleto = document.getElementById("historico-completo");
      if (!historicoCompleto) {
        console.warn("Elemento historico-completo não encontrado");
        return;
      }
      historicoCompleto.innerHTML = "";

      // Adiciona filtros ao histórico
      const filtrosDiv = document.createElement("div");
      filtrosDiv.className = "filtros-historico";
      filtrosDiv.innerHTML = `
        <div class="filtro-container">
          <label for="filtro-tipo">Tipo:</label>
          <select id="filtro-tipo">
            <option value="todos">Todos</option>
            <option value="receita">Receitas</option>
            <option value="despesa">Despesas</option>
          </select>
          
          <label for="filtro-categoria">Categoria:</label>
          <input type="text" id="filtro-categoria" placeholder="Todas as categorias">
          
          <button id="btn-aplicar-filtro">Aplicar Filtro</button>
          <button id="btn-limpar-filtro">Limpar</button>
        </div>
      `;
      historicoCompleto.appendChild(filtrosDiv);

      // Adiciona o container para os itens
      const itensContainer = document.createElement("div");
      itensContainer.id = "itens-historico";
      historicoCompleto.appendChild(itensContainer);

      // Adiciona os eventos para os filtros
      document
        .getElementById("btn-aplicar-filtro")
        .addEventListener("click", aplicarFiltrosHistorico);
      document
        .getElementById("btn-limpar-filtro")
        .addEventListener("click", limparFiltrosHistorico);

      // Guarda os dados em uma variável global para facilitar a filtragem
      window.dadosHistorico = itens;

      // Mostra todos os itens
      atualizarHistoricoExibido(itens);
    })
    .catch((err) => {
      showMessage("Erro ao carregar histórico: " + err.message, "error");
      console.error(err);

      // Mostrar mensagem de erro no elemento
      const historicoCompleto = document.getElementById("historico-completo");
      if (historicoCompleto) {
        historicoCompleto.innerHTML = `
          <div class="erro-carregamento">
            <p>Não foi possível carregar o histórico.</p>
            <button onclick="carregarHistoricoCompleto()">Tentar novamente</button>
          </div>
        `;
      }
    });
}

// Função para atualizar o histórico com base nos filtros
function aplicarFiltrosHistorico() {
  const filtroTipo = document.getElementById("filtro-tipo").value;
  const filtroCategoria = document
    .getElementById("filtro-categoria")
    .value.toLowerCase()
    .trim();

  if (!window.dadosHistorico) return;

  let itensFiltrados = [...window.dadosHistorico];

  // Filtrar por tipo
  if (filtroTipo !== "todos") {
    itensFiltrados = itensFiltrados.filter((item) => item.tipo === filtroTipo);
  }

  // Filtrar por categoria
  if (filtroCategoria) {
    itensFiltrados = itensFiltrados.filter((item) =>
      item.categoria.toLowerCase().includes(filtroCategoria)
    );
  }

  atualizarHistoricoExibido(itensFiltrados);
}

// Função para limpar filtros
function limparFiltrosHistorico() {
  document.getElementById("filtro-tipo").value = "todos";
  document.getElementById("filtro-categoria").value = "";

  if (window.dadosHistorico) {
    atualizarHistoricoExibido(window.dadosHistorico);
  }
}

// Função para exibir os itens do histórico
function atualizarHistoricoExibido(itens) {
  const itensContainer = document.getElementById("itens-historico");
  if (!itensContainer) return;

  itensContainer.innerHTML = "";

  if (itens.length === 0) {
    itensContainer.innerHTML =
      '<div class="sem-registros">Nenhum registro encontrado.</div>';
    return;
  }

  // Ordena por data (mais recente primeiro)
  itens.sort((a, b) => new Date(b.data) - new Date(a.data));

  itens.forEach((item) => {
    const div = document.createElement("div");
    div.className = `item-financeiro ${item.tipo}`;
    div.innerHTML = `
      <div class="item-info">
        <h4>${item.descricao}</h4>
        <p>Categoria: ${item.categoria}</p>
        <p>Data: ${new Date(item.data).toLocaleDateString()}</p>
        <span class="tipo-badge ${item.tipo}">${
      item.tipo === "receita" ? "Receita" : "Despesa"
    }</span>
      </div>
      <div class="item-valor ${item.tipo}-valor">
        ${item.tipo === "receita" ? "+" : "-"}R$ ${item.valor.toLocaleString(
      "pt-BR",
      {
        minimumFractionDigits: 2,
      }
    )}
      </div>
      <div class="item-acoes">
        <button onclick="excluirItem(${
          item.id
        })" class="btn-excluir-item">Excluir</button>
        <button onclick="prepararEdicaoItem(${
          item.id
        })" class="btn-editar-item">Editar</button>
      </div>
    `;
    itensContainer.appendChild(div);
  });
}

function excluirItem(id) {
  if (confirm("Tem certeza que deseja excluir este item?")) {
    console.log("Excluindo item com ID:", id, "usando token:", authToken);

    // Mostrar indicador de exclusão
    const itemElement = document
      .querySelector(`div.item-financeiro button[onclick*="${id}"]`)
      ?.closest(".item-financeiro");
    if (itemElement) {
      itemElement.classList.add("excluindo");
      itemElement.innerHTML +=
        '<div class="overlay-loading">Excluindo...</div>';
    }

    fetch(api + `/despesas/${id}`, {
      method: "DELETE",
      headers: { Authorization: authToken },
    })
      .then((res) => {
        console.log("Status da resposta de exclusão:", res.status);
        if (!res.ok) {
          console.error(
            "Erro na resposta de exclusão:",
            res.status,
            res.statusText
          );
          throw new Error(`Erro ${res.status}: ${res.statusText}`);
        }
        return res.json();
      })
      .then((response) => {
        console.log("Resposta de exclusão:", response);
        if (response.status === "success") {
          showMessage("Item excluído com sucesso!");

          // Remover o elemento com animação suave
          if (itemElement) {
            itemElement.style.height = itemElement.offsetHeight + "px";
            itemElement.classList.add("removendo");
            setTimeout(() => {
              itemElement.style.height = "0";
              itemElement.style.opacity = "0";
              itemElement.style.margin = "0";
              itemElement.style.padding = "0";
              setTimeout(() => {
                carregarDados();
              }, 300);
            }, 100);
          } else {
            carregarDados();
          }
        } else {
          showMessage(response.message || "Erro ao excluir item", "error");
          console.error("Erro na resposta:", response);
          // Remover overlay de carregamento se houver erro
          if (itemElement) {
            itemElement.classList.remove("excluindo");
            const overlay = itemElement.querySelector(".overlay-loading");
            if (overlay) overlay.remove();
          }
        }
      })
      .catch((err) => {
        showMessage("Erro ao excluir item: " + err.message, "error");
        console.error(err);
        // Remover overlay de carregamento se houver erro
        if (itemElement) {
          itemElement.classList.remove("excluindo");
          const overlay = itemElement.querySelector(".overlay-loading");
          if (overlay) overlay.remove();
        }
      });
  }
}

function exportarExcel() {
  showMessage("Exportando para Excel...");
  setTimeout(() => {
    window.open(api + "/exportar", "_blank");
  }, 600);
}

// Verificar se usuário já está logado
function verificarLogin() {
  const token = localStorage.getItem("authToken");
  const usuario = localStorage.getItem("usuario");

  if (token && usuario) {
    // Adicionar o prefixo "Bearer " ao token
    authToken = "Bearer " + token;
    usuarioAtual = JSON.parse(usuario);
    console.log("Usuário autenticado:", usuarioAtual);
    console.log("Token formatado para backend:", authToken);
    mostrarPaginaPrincipal();
  } else {
    mostrarPaginaLogin();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  // Event listeners para formulários (com verificação de existência)
  const formLogin = document.getElementById("form-login");
  if (formLogin) {
    formLogin.addEventListener("submit", realizarLogin);
  }

  const formCadastro = document.getElementById("form-cadastro");
  if (formCadastro) {
    formCadastro.addEventListener("submit", realizarCadastro);
  }

  const formDespesa = document.getElementById("form-despesa");
  if (formDespesa) {
    formDespesa.addEventListener("submit", adicionarDespesa);
  }

  const formReceita = document.getElementById("form-receita");
  if (formReceita) {
    formReceita.addEventListener("submit", adicionarReceita);
  }

  // Event listeners para navegação (com verificação de existência)
  const linkCadastro = document.getElementById("link-cadastro");
  if (linkCadastro) {
    linkCadastro.addEventListener("click", (e) => {
      e.preventDefault();
      mostrarPaginaCadastro();
    });
  }

  const linkLogin = document.getElementById("link-login");
  if (linkLogin) {
    linkLogin.addEventListener("click", (e) => {
      e.preventDefault();
      mostrarPaginaLogin();
    });
  }

  const btnLogout = document.getElementById("btn-logout");
  if (btnLogout) {
    btnLogout.addEventListener("click", logout);
  }

  const btnExportar = document.getElementById("btn-exportar");
  if (btnExportar) {
    btnExportar.addEventListener("click", exportarExcel);
  }

  // Configuração das abas
  const tabs = document.querySelectorAll(".tab");
  if (tabs.length > 0) {
    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        tabs.forEach((t) => t.classList.remove("active"));
        tab.classList.add("active");

        const contents = document.querySelectorAll(".tab-content");
        contents.forEach((content) => content.classList.remove("active"));

        const targetId = tab.getAttribute("data-tab");
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
          targetElement.classList.add("active");
        }
      });
    });
  }

  // Verificar login ao carregar a página
  verificarLogin();
});
