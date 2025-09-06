// API URL - detecção automática e robusta de ambiente
let api;

// Configuração de ambientes
const environments = {
  local: "http://localhost:3001",
  production: "https://trabalho-escola-black.vercel.app", // URL corrigida para o atual deploy
};

// Detectar ambiente
function detectEnvironment() {
  const hostname = window.location.hostname;
  const isLocal =
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname.startsWith("192.168.");

  if (isLocal) {
    return environments.local;
  } else {
    return environments.production;
  }
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
  const defaultOptions = {
    mode: "cors",
    credentials: "omit",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  };

  const finalOptions = { ...defaultOptions, ...options };

  try {
    console.log(`🔄 Fazendo requisição para: ${api}${endpoint}`);
    const response = await fetch(`${api}${endpoint}`, finalOptions);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("❌ Erro na requisição:", error);
    throw error;
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

  fetch(api + "/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    mode: "cors",
    credentials: "omit",
    body: JSON.stringify({ email, senha }),
  })
    .then((res) => {
      console.log("Status da resposta:", res.status);
      if (!res.ok) {
        console.error("Erro na resposta:", res.status, res.statusText);
      }
      return res.json();
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

  fetch(api + "/cadastro", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    mode: "cors",
    credentials: "omit",
    body: JSON.stringify({ nome, email, senha }),
  })
    .then((res) => {
      console.log("Status da resposta do cadastro:", res.status);
      if (!res.ok) {
        console.error(
          "Erro na resposta do cadastro:",
          res.status,
          res.statusText
        );
      }
      return res.json();
    })
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
  fetch(api + "/resumo", {
    headers: { Authorization: authToken },
  })
    .then((res) => {
      console.log("Status da resposta de resumo:", res.status);
      if (!res.ok) {
        console.error(
          "Erro na resposta de resumo:",
          res.status,
          res.statusText
        );
      }
      return res.json();
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

  if (!descricao || !valor || !categoria || !data) {
    showMessage("Preencha todos os campos!", "error");
    return;
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
      valor: parseFloat(valor),
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
      showMessage("Erro ao adicionar despesa", "error");
      console.error(err);
    });
}

function adicionarReceita(event) {
  event.preventDefault();
  const descricao = document.getElementById("descricao-receita").value.trim();
  const valor = document.getElementById("valor-receita").value.trim();
  const categoria = document.getElementById("categoria-receita").value.trim();
  const data = document.getElementById("data-receita").value;

  if (!descricao || !valor || !categoria || !data) {
    showMessage("Preencha todos os campos!", "error");
    return;
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
      valor: parseFloat(valor),
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
      showMessage("Erro ao adicionar receita", "error");
      console.error(err);
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
      }
      return res.json();
    })
    .then((response) => {
      console.log("Resposta de histórico:", response);

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

      const itens = response.data;
      const historicoCompleto = document.getElementById("historico-completo");
      if (!historicoCompleto) {
        console.warn("Elemento historico-completo não encontrado");
        return;
      }
      historicoCompleto.innerHTML = "";

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
            ${
              item.tipo === "receita" ? "+" : "-"
            }R$ ${item.valor.toLocaleString("pt-BR", {
          minimumFractionDigits: 2,
        })}
          </div>
        `;
        historicoCompleto.appendChild(div);
      });
    })
    .catch((err) => {
      showMessage("Erro ao carregar histórico", "error");
      console.error(err);
    });
}

function excluirItem(id) {
  if (confirm("Tem certeza que deseja excluir este item?")) {
    console.log("Excluindo item com ID:", id, "usando token:", authToken);
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
        }
        return res.json();
      })
      .then((response) => {
        console.log("Resposta de exclusão:", response);
        if (response.status === "success") {
          showMessage("Item excluído com sucesso!");
          carregarDados();
        } else {
          showMessage(response.message || "Erro ao excluir item", "error");
          console.error("Erro na resposta:", response);
        }
      })
      .catch((err) => {
        showMessage("Erro ao excluir item", "error");
        console.error(err);
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
