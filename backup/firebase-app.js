// Código para integrar com o Firebase

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

// Função para adicionar produto no Firebase
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

  // Verifica se o produto já existe
  db.collection("produtos")
    .where("nome", "==", nome)
    .get()
    .then((snapshot) => {
      if (!snapshot.empty) {
        showMessage("Produto já cadastrado!", "error");
        return;
      }
      // Salva dados parciais e abre modal para dados extras
      dadosParciaisProduto = { nome, quantidadeMinima, condicaoPagamento };
      abrirModalCadastroExtra();
    })
    .catch((error) => {
      showMessage("Erro ao verificar produtos: " + error.message, "error");
    });
}

// Modal e outras funções - similar ao código original
function abrirModalCadastroExtra() {
  // Código similar ao original
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
    const form = document.getElementById("form-extra-info");
    if (form) form.reset();
    modal.style.display = "flex";
  }

  modal.style.display = "flex";
  setTimeout(() => {
    document.getElementById("empresa").focus();
  }, 100);
}

function fecharModalCadastroExtra() {
  const modal = document.getElementById("modal-cadastro-extra");
  if (modal) {
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

  // Adiciona ao Firebase
  db.collection("produtos")
    .add(produtoCompleto)
    .then(() => {
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
    })
    .catch((error) => {
      showMessage("Erro ao adicionar produto: " + error.message, "error");
    });
}

// Carrega produtos do Firebase
function carregarProdutos() {
  db.collection("produtos")
    .get()
    .then((snapshot) => {
      const produtos = [];
      snapshot.forEach((doc) => {
        produtos.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      const tbody = document.getElementById("produtos-tbody");
      tbody.innerHTML = "";
      produtos.forEach((p, idx) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `<td>${p.nome}</td><td>${p.quantidadeMinima}</td><td>${p.condicaoPagamento}</td>`;
        tr.style.cursor = "pointer";
        tr.addEventListener("click", () => abrirModalProduto(p, idx));
        tbody.appendChild(tr);
      });

      // Atualiza total de produtos
      let totalDiv = document.getElementById("total-produtos");
      const root = document.getElementById("root");
      const table = document.querySelector("table");

      if (root && root.style.display !== "none") {
        if (!totalDiv) {
          totalDiv = document.createElement("div");
          totalDiv.id = "total-produtos";
          totalDiv.className = "contador-produtos";

          if (table) {
            table.parentElement.insertBefore(totalDiv, table);
          }
        }

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
    })
    .catch((error) => {
      showMessage("Erro ao carregar produtos: " + error.message, "error");
    });
}

// Implementações semelhantes para outras funções (edição, exclusão, etc)
// Função de exportação para Excel usando biblioteca SheetJS
function exportarExcel() {
  db.collection("produtos")
    .get()
    .then((snapshot) => {
      const produtos = [];
      snapshot.forEach((doc) => {
        produtos.push(doc.data());
      });

      // Usando SheetJS (xlsx)
      const ws = XLSX.utils.json_to_sheet(produtos);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Produtos");
      XLSX.writeFile(wb, "produtos.xlsx");
      showMessage("Dados exportados com sucesso!");
    })
    .catch((error) => {
      showMessage("Erro ao exportar: " + error.message, "error");
    });
}

document.addEventListener("DOMContentLoaded", () => {
  // Inicialização
  const welcome = document.getElementById("welcome-page");
  const root = document.getElementById("root");
  const btnIrEstoque = document.getElementById("btn-ir-estoque");

  if (btnIrEstoque) {
    btnIrEstoque.addEventListener("click", () => {
      welcome.style.display = "none";
      root.style.display = "block";
      carregarProdutos();
    });
  }

  document
    .getElementById("form-produto")
    .addEventListener("submit", adicionarProduto);
  document
    .getElementById("btn-exportar")
    .addEventListener("click", exportarExcel);

  // Configuração das abas
  const tabs = document.querySelectorAll(".tab");
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");

      const contents = document.querySelectorAll(".tab-content");
      contents.forEach((content) => content.classList.remove("active"));

      const targetId = tab.getAttribute("data-tab");
      document.getElementById(targetId).classList.add("active");

      if (targetId === "tab-gerenciar") {
        carregarProdutosGerenciar();
      } else {
        carregarProdutos();
      }
    });
  });

  // Adiciona ícone ao botão exportar
  const btnExportar = document.getElementById("btn-exportar");
  btnExportar.innerHTML = `<svg style='vertical-align:middle;margin-right:7px' width='20' height='20' fill='none' stroke='#0f2027' stroke-width='2' viewBox='0 0 24 24'><path d='M12 3v12m0 0l-4-4m4 4l4-4'/><rect x='4' y='17' width='16' height='4' rx='2' fill='#00eaff' stroke='none'/></svg>Exportar para Excel`;
});
