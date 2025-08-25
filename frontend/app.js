// API URL - altera automaticamente entre produção e desenvolvimento
const api =
  window.location.hostname === "localhost"
    ? "http://localhost:3001"
    : "https://trabalho-escola-black.vercel.app"; // URL da API hospedada no Vercel (sem /api)

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

let dadosParciaisProduto = null;
function adicionarProduto(event) {
  event.preventDefault();
  const nome = document.getElementById("nome").value.trim();
  const quantidadeMinima = document
    .getElementById("quantidadeMinima")
    .value.trim();
  const condicaoPagamento = document
    .getElementById("condicaoPagamento")
    .value.trim();
  if (!nome || !quantidadeMinima || !condicaoPagamento) {
    showMessage("Preencha todos os campos!", "error");
    return;
  }
  fetch(api + "/produtos")
    .then((res) => res.json())
    .then((produtos) => {
      if (produtos.some((p) => p.nome.toLowerCase() === nome.toLowerCase())) {
        showMessage("Produto já cadastrado!", "error");
        return;
      }
      // Salva dados parciais e abre modal para dados extras
      dadosParciaisProduto = { nome, quantidadeMinima, condicaoPagamento };
      abrirModalCadastroExtra();
    });
}

function abrirModalCadastroExtra() {
  let modal = document.getElementById("modal-cadastro-extra");
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "modal-cadastro-extra";
    modal.innerHTML = `
      <div class="modal-bg"></div>
      <div class="modal-content">
        <span class="modal-close" id="modal-cadastro-close">&times;</span>
        <h2>INFORMAÇÕES DA COMPRA</h2>
        <form id="form-extra-info">
          <input id="empresa" placeholder="Empresa que comprou" required />
          <input id="valorPago" placeholder="Valor já pago (R$)" required type="number" min="0" step="0.01" />
          <input id="valorFalta" placeholder="Valor a pagar (R$)" required type="number" min="0" step="0.01" />
          <input id="dataCompra" placeholder="Data da compra" required type="date" />
          <button type="submit">Salvar Produto</button>
        </form>
      </div>
    `;
    document.body.appendChild(modal);
    document.getElementById("modal-cadastro-close").onclick =
      fecharModalCadastroExtra;
    modal.querySelector(".modal-bg").onclick = fecharModalCadastroExtra;
    document.getElementById("form-extra-info").onsubmit = salvarProdutoCompleto;
  } else {
    // Limpa os campos se o modal for reutilizado
    const form = document.getElementById("form-extra-info");
    if (form) form.reset();

    // Garante que o modal está visível
    modal.style.display = "flex";
  }

  // Garante que o modal está centralizado
  modal.style.display = "flex";

  // Foco automático no primeiro campo
  setTimeout(() => {
    document.getElementById("empresa").focus();
  }, 100);
}

function fecharModalCadastroExtra() {
  const modal = document.getElementById("modal-cadastro-extra");
  if (modal) {
    // Adiciona classe para animação de saída
    const modalContent = modal.querySelector(".modal-content");
    if (modalContent) {
      modalContent.style.opacity = "0";
      modalContent.style.transform = "translateY(-50px)";
      modalContent.style.transition = "opacity 0.2s, transform 0.2s";

      // Esconde modal após animação
      setTimeout(() => {
        modal.style.display = "none";
        // Reseta estilos para próxima exibição
        modalContent.style.opacity = "";
        modalContent.style.transform = "";
        modalContent.style.transition = "";
      }, 200);
    } else {
      modal.style.display = "none";
    }
  }
  dadosParciaisProduto = null;
}

function salvarProdutoCompleto(e) {
  e.preventDefault();
  const empresa = document.getElementById("empresa").value.trim();
  const valorPago = document.getElementById("valorPago").value.trim();
  const valorFalta = document.getElementById("valorFalta").value.trim();
  const dataCompra = document.getElementById("dataCompra").value;
  if (!empresa || !valorPago || !valorFalta || !dataCompra) {
    showMessage("Preencha todos os campos do modal!", "error");
    return;
  }
  const produtoCompleto = {
    ...dadosParciaisProduto,
    empresa,
    valorPago: Number(valorPago),
    valorFalta: Number(valorFalta),
    dataCompra,
  };
  fetch(api + "/produtos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(produtoCompleto),
  }).then(() => {
    showMessage("Produto adicionado com sucesso!");
    document.getElementById("form-produto").reset();
    fecharModalCadastroExtra();
    carregarProdutos();

    // Destaca o contador após adicionar produto
    setTimeout(() => {
      const contador = document.getElementById("total-produtos");
      if (contador) {
        contador.style.animation = "none";
        setTimeout(() => {
          contador.style.animation = "contadorPulse 2s infinite";
          contador.style.boxShadow = "0 0 25px rgba(0, 234, 255, 0.7)";
          setTimeout(() => {
            contador.style.boxShadow = "";
          }, 2000);
        }, 10);
      }
    }, 500);
  });
}

function carregarProdutos() {
  fetch(api + "/produtos")
    .then((res) => res.json())
    .then((produtos) => {
      const tbody = document.getElementById("produtos-tbody");
      tbody.innerHTML = "";
      produtos.forEach((p, idx) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `<td>${p.nome}</td><td>${p.quantidadeMinima}</td><td>${p.condicaoPagamento}</td>`;
        tr.style.cursor = "pointer";
        tr.addEventListener("click", () => abrirModalProduto(p, idx));
        tbody.appendChild(tr);
      });

      // Atualiza total de produtos com nova visualização
      let totalDiv = document.getElementById("total-produtos");
      const root = document.getElementById("root");
      const table = document.querySelector("table");

      if (root && root.style.display !== "none") {
        if (!totalDiv) {
          totalDiv = document.createElement("div");
          totalDiv.id = "total-produtos";
          totalDiv.className = "contador-produtos";

          // Insere antes da tabela
          if (table) {
            table.parentElement.insertBefore(totalDiv, table);
          }
        }

        // Atualiza conteúdo com ícone e melhor visualização
        totalDiv.innerHTML = `
          <div class="total">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0f2027" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle; margin-right: 8px;">
              <path d="M20 7h-8a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2Z"></path>
              <path d="M4 5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h1"></path>
              <path d="M4 5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2"></path>
            </svg>
            Total de produtos no estoque:
          </div>
          <div class="valor">${produtos.length}</div>
        `;
      } else if (totalDiv) {
        totalDiv.remove();
      }
    });
}

// MODAL DE DETALHES DO PRODUTO
function abrirModalProduto(produto, idx) {
  let modal = document.getElementById("modal-produto");
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "modal-produto";
    modal.innerHTML = `
      <div class="modal-bg"></div>
      <div class="modal-content">
        <span class="modal-close" id="modal-close-btn">&times;</span>
        <h2>Detalhes do Produto</h2>
        <div id="modal-info"></div>
      </div>
    `;
    document.body.appendChild(modal);
    document.getElementById("modal-close-btn").onclick = fecharModalProduto;
    modal.querySelector(".modal-bg").onclick = fecharModalProduto;
  }

  // Adiciona animação e melhora a apresentação das informações
  const modalContent = modal.querySelector(".modal-content");
  if (modalContent) {
    modalContent.style.animation = "modalFadeIn 0.3s ease-out";
  }

  // Exibe dados reais cadastrados com melhor formatação
  const valorTotal = (produto.valorPago || 0) + (produto.valorFalta || 0);
  document.getElementById("modal-info").innerHTML = `
    <div style="margin-bottom: 24px; line-height: 1.6;">
      <p><b>Produto:</b> ${produto.nome}</p>
      <p><b>Quantidade Mínima:</b> ${produto.quantidadeMinima}</p>
      <p><b>Condição de Pagamento:</b> ${produto.condicaoPagamento}</p>
      <p><b>Empresa que comprou:</b> ${produto.empresa || "-"}</p>
      <p><b>Valor já pago:</b> R$ ${(produto.valorPago || 0).toLocaleString(
        "pt-BR",
        { minimumFractionDigits: 2 }
      )}</p>
      <p><b>Valor a pagar:</b> R$ ${(produto.valorFalta || 0).toLocaleString(
        "pt-BR",
        { minimumFractionDigits: 2 }
      )}</p>
      <p><b>Valor Total:</b> R$ ${valorTotal.toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
      })}</p>
      <p><b>Data da compra:</b> ${
        produto.dataCompra
          ? new Date(produto.dataCompra).toLocaleDateString()
          : "-"
      }</p>
    </div>
  `;

  // Garante que o modal está visível e centralizado
  modal.style.display = "flex";
}

// FUNÇÕES PARA EDITAR E EXCLUIR PRODUTOS

// Modal para editar produto
function abrirModalEditarProduto(produto, idx) {
  let modal = document.getElementById("modal-editar-produto");
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "modal-editar-produto";
    modal.innerHTML = `
      <div class="modal-bg"></div>
      <div class="modal-content">
        <span class="modal-close" id="modal-editar-close">&times;</span>
        <h2>Editar Produto</h2>
        <form id="form-editar-produto">
          <input id="editar-nome" placeholder="Nome do produto" required />
          <input id="editar-quantidadeMinima" placeholder="Quantidade mínima" required type="number" />
          <input id="editar-condicaoPagamento" placeholder="Condição de pagamento" required />
          <input id="editar-empresa" placeholder="Empresa que comprou" required />
          <input id="editar-valorPago" placeholder="Valor já pago (R$)" required type="number" min="0" step="0.01" />
          <input id="editar-valorFalta" placeholder="Valor a pagar (R$)" required type="number" min="0" step="0.01" />
          <input id="editar-dataCompra" placeholder="Data da compra" required type="date" />
          <input id="editar-index" type="hidden" />
          <button type="submit">Salvar Alterações</button>
        </form>
      </div>
    `;
    document.body.appendChild(modal);
    document.getElementById("modal-editar-close").onclick =
      fecharModalEditarProduto;
    modal.querySelector(".modal-bg").onclick = fecharModalEditarProduto;
    document.getElementById("form-editar-produto").onsubmit =
      salvarEdicaoProduto;
  }

  // Preenche os campos com os dados do produto
  document.getElementById("editar-nome").value = produto.nome;
  document.getElementById("editar-quantidadeMinima").value =
    produto.quantidadeMinima;
  document.getElementById("editar-condicaoPagamento").value =
    produto.condicaoPagamento;
  document.getElementById("editar-empresa").value = produto.empresa || "";
  document.getElementById("editar-valorPago").value = produto.valorPago || 0;
  document.getElementById("editar-valorFalta").value = produto.valorFalta || 0;
  document.getElementById("editar-dataCompra").value = produto.dataCompra || "";
  document.getElementById("editar-index").value = idx;

  // Adiciona animação e garante que o modal está visível
  const modalContent = modal.querySelector(".modal-content");
  if (modalContent) {
    modalContent.style.animation = "modalFadeIn 0.3s ease-out";
  }
  modal.style.display = "flex";

  // Foco no primeiro campo
  setTimeout(() => {
    document.getElementById("editar-nome").focus();
  }, 100);
}

function fecharModalEditarProduto() {
  const modal = document.getElementById("modal-editar-produto");
  if (modal) {
    // Adiciona animação de saída
    const modalContent = modal.querySelector(".modal-content");
    if (modalContent) {
      modalContent.style.opacity = "0";
      modalContent.style.transform = "translateY(-50px)";
      modalContent.style.transition = "opacity 0.2s, transform 0.2s";

      setTimeout(() => {
        modal.style.display = "none";
        modalContent.style.opacity = "";
        modalContent.style.transform = "";
        modalContent.style.transition = "";
      }, 200);
    } else {
      modal.style.display = "none";
    }
  }
}

function salvarEdicaoProduto(e) {
  e.preventDefault();
  const index = document.getElementById("editar-index").value;
  const produtoEditado = {
    nome: document.getElementById("editar-nome").value.trim(),
    quantidadeMinima: document
      .getElementById("editar-quantidadeMinima")
      .value.trim(),
    condicaoPagamento: document
      .getElementById("editar-condicaoPagamento")
      .value.trim(),
    empresa: document.getElementById("editar-empresa").value.trim(),
    valorPago: Number(document.getElementById("editar-valorPago").value),
    valorFalta: Number(document.getElementById("editar-valorFalta").value),
    dataCompra: document.getElementById("editar-dataCompra").value,
  };

  fetch(`${api}/produtos/${index}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(produtoEditado),
  })
    .then((res) => res.json())
    .then((data) => {
      showMessage("Produto atualizado com sucesso!");
      fecharModalEditarProduto();
      carregarProdutos();
      carregarProdutosGerenciar();
    })
    .catch((err) => {
      showMessage("Erro ao atualizar produto.", "error");
      console.error(err);
    });
}

// Modal para confirmar exclusão
function abrirModalConfirmarExclusao(produto, idx) {
  let modal = document.getElementById("modal-confirmar-exclusao");
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "modal-confirmar-exclusao";
    modal.innerHTML = `
      <div class="modal-bg"></div>
      <div class="modal-content">
        <span class="modal-close" id="modal-exclusao-close">&times;</span>
        <h2>Confirmar Exclusão</h2>
        <p style="margin-bottom: 20px;">Tem certeza que deseja excluir o produto <b id="nome-produto-excluir"></b>?</p>
        <p style="margin-bottom: 20px; color: #ff3b3b;">Esta ação não pode ser desfeita!</p>
        <div style="display: flex; justify-content: center; gap: 10px;">
          <button id="btn-confirmar-exclusao" class="btn-confirmar-excluir">Sim, Excluir</button>
          <button id="btn-cancelar-exclusao" class="btn-cancelar">Cancelar</button>
        </div>
        <input id="excluir-index" type="hidden" />
      </div>
    `;
    document.body.appendChild(modal);
    document.getElementById("modal-exclusao-close").onclick =
      fecharModalExclusao;
    modal.querySelector(".modal-bg").onclick = fecharModalExclusao;
    document.getElementById("btn-cancelar-exclusao").onclick =
      fecharModalExclusao;
    document.getElementById("btn-confirmar-exclusao").onclick = excluirProduto;
  }

  // Preenche os dados do produto
  document.getElementById("nome-produto-excluir").textContent = produto.nome;
  document.getElementById("excluir-index").value = idx;

  // Adiciona animação e exibe o modal
  const modalContent = modal.querySelector(".modal-content");
  if (modalContent) {
    modalContent.style.animation = "modalFadeIn 0.3s ease-out";
  }
  modal.style.display = "flex";
}

function fecharModalExclusao() {
  const modal = document.getElementById("modal-confirmar-exclusao");
  if (modal) {
    // Adiciona animação de saída
    const modalContent = modal.querySelector(".modal-content");
    if (modalContent) {
      modalContent.style.opacity = "0";
      modalContent.style.transform = "translateY(-50px)";
      modalContent.style.transition = "opacity 0.2s, transform 0.2s";

      setTimeout(() => {
        modal.style.display = "none";
        modalContent.style.opacity = "";
        modalContent.style.transform = "";
        modalContent.style.transition = "";
      }, 200);
    } else {
      modal.style.display = "none";
    }
  }
}

function excluirProduto() {
  const index = document.getElementById("excluir-index").value;

  fetch(`${api}/produtos/${index}`, {
    method: "DELETE",
  })
    .then((res) => res.json())
    .then((data) => {
      showMessage("Produto excluído com sucesso!");
      fecharModalExclusao();
      carregarProdutos();
      carregarProdutosGerenciar();
    })
    .catch((err) => {
      showMessage("Erro ao excluir produto.", "error");
      console.error(err);
    });
}

// Carrega produtos na aba de gerenciamento
function carregarProdutosGerenciar() {
  fetch(api + "/produtos")
    .then((res) => res.json())
    .then((produtos) => {
      const tbody = document.getElementById("gerenciar-tbody");
      tbody.innerHTML = "";

      produtos.forEach((p, idx) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${p.nome}</td>
          <td>${p.quantidadeMinima}</td>
          <td>${p.empresa || "-"}</td>
          <td class="acoes-cell">
            <button class="btn-acao btn-editar" title="Editar produto">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
            </button>
            <button class="btn-acao btn-excluir" title="Excluir produto">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                <line x1="10" y1="11" x2="10" y2="17"></line>
                <line x1="14" y1="11" x2="14" y2="17"></line>
              </svg>
            </button>
          </td>
        `;

        // Adiciona eventos aos botões
        tr.querySelector(".btn-editar").addEventListener("click", () =>
          abrirModalEditarProduto(p, idx)
        );
        tr.querySelector(".btn-excluir").addEventListener("click", () =>
          abrirModalConfirmarExclusao(p, idx)
        );

        tbody.appendChild(tr);
      });
    });
}

function fecharModalProduto() {
  const modal = document.getElementById("modal-produto");
  if (modal) {
    // Adiciona classe para animação de saída
    const modalContent = modal.querySelector(".modal-content");
    if (modalContent) {
      modalContent.style.opacity = "0";
      modalContent.style.transform = "translateY(-50px)";
      modalContent.style.transition = "opacity 0.2s, transform 0.2s";

      // Esconde modal após animação
      setTimeout(() => {
        modal.style.display = "none";
        // Reseta estilos para próxima exibição
        modalContent.style.opacity = "";
        modalContent.style.transform = "";
        modalContent.style.transition = "";
      }, 200);
    } else {
      modal.style.display = "none";
    }
  }
}

function exportarExcel() {
  showMessage("Exportando para Excel...");
  setTimeout(() => {
    window.location = api + "/exportar";
  }, 600);
}

document.addEventListener("DOMContentLoaded", () => {
  // Página de boas-vindas
  const welcome = document.getElementById("welcome-page");
  const root = document.getElementById("root");
  const btnIrEstoque = document.getElementById("btn-ir-estoque");

  if (btnIrEstoque) {
    btnIrEstoque.addEventListener("click", () => {
      welcome.style.display = "none";
      root.style.display = "block";
      carregarProdutos(); // Atualiza total ao entrar no estoque
    });
  }

  document
    .getElementById("form-produto")
    .addEventListener("submit", adicionarProduto);
  document
    .getElementById("btn-exportar")
    .addEventListener("click", exportarExcel);
  carregarProdutos();
  // Adiciona ícone ao botão exportar
  const btnExportar = document.getElementById("btn-exportar");
  btnExportar.innerHTML = `<svg style='vertical-align:middle;margin-right:7px' width='20' height='20' fill='none' stroke='#0f2027' stroke-width='2' viewBox='0 0 24 24'><path d='M12 3v12m0 0l-4-4m4 4l4-4'/><rect x='4' y='17' width='16' height='4' rx='2' fill='#00eaff' stroke='none'/></svg>Exportar para Excel`;

  // Configuração das abas
  const tabs = document.querySelectorAll(".tab");
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      // Remove active de todas as abas
      tabs.forEach((t) => t.classList.remove("active"));
      // Adiciona active na aba clicada
      tab.classList.add("active");

      // Remove active de todos os conteúdos
      const contents = document.querySelectorAll(".tab-content");
      contents.forEach((content) => content.classList.remove("active"));

      // Adiciona active no conteúdo correspondente
      const targetId = tab.getAttribute("data-tab");
      document.getElementById(targetId).classList.add("active");

      // Se a aba for a de gerenciar, carrega os produtos
      if (targetId === "tab-gerenciar") {
        carregarProdutosGerenciar();
      } else {
        carregarProdutos(); // Atualiza a listagem principal
      }
    });
  });

  // Inicialização da primeira vez
  carregarProdutosGerenciar();

  // Rodapé profissional
  let footer = document.createElement("footer");
  footer.style.textAlign = "center";
  footer.style.margin = "38px 0 10px 0";
  footer.style.color = "#00eaff";
  footer.style.fontWeight = "bold";
  footer.style.letterSpacing = "1px";
  footer.innerHTML = `Projeto desenvolvido por <span style='color:#fff;'>Grupo InovaTech</span> &copy; 2025`;
  document.body.appendChild(footer);
});
