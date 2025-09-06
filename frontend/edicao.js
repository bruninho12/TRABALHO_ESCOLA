// Função para preparar edição de item
function prepararEdicaoItem(id) {
  // Buscar o item pelo ID
  if (!window.dadosHistorico) {
    showMessage("Dados não carregados", "error");
    return;
  }

  const item = window.dadosHistorico.find((i) => i.id === id);
  if (!item) {
    showMessage("Item não encontrado", "error");
    return;
  }

  // Criar modal de edição
  const modalContainer = document.createElement("div");
  modalContainer.className = "modal-container";
  modalContainer.id = "modal-edicao";

  const modal = document.createElement("div");
  modal.className = "modal";

  modal.innerHTML = `
    <div class="modal-header">
      <h3>Editar ${item.tipo === "receita" ? "Receita" : "Despesa"}</h3>
      <span class="modal-close" onclick="fecharModalEdicao()">&times;</span>
    </div>
    <div class="modal-body">
      <form id="form-edicao">
        <input type="hidden" id="edicao-id" value="${item.id}">
        <input type="hidden" id="edicao-tipo" value="${item.tipo}">
        
        <div class="form-group">
          <label for="edicao-descricao">Descrição:</label>
          <input type="text" id="edicao-descricao" value="${
            item.descricao
          }" required>
        </div>
        
        <div class="form-group">
          <label for="edicao-valor">Valor:</label>
          <input type="number" id="edicao-valor" value="${
            item.valor
          }" step="0.01" min="0.01" required>
        </div>
        
        <div class="form-group">
          <label for="edicao-categoria">Categoria:</label>
          <input type="text" id="edicao-categoria" value="${
            item.categoria
          }" required>
        </div>
        
        <div class="form-group">
          <label for="edicao-data">Data:</label>
          <input type="date" id="edicao-data" value="${item.data}" required>
        </div>
        
        <div class="form-buttons">
          <button type="button" onclick="fecharModalEdicao()">Cancelar</button>
          <button type="submit" class="btn-salvar">Salvar Alterações</button>
        </div>
      </form>
    </div>
  `;

  modalContainer.appendChild(modal);
  document.body.appendChild(modalContainer);

  // Adicionar evento de submit ao formulário
  document
    .getElementById("form-edicao")
    .addEventListener("submit", salvarEdicaoItem);

  // Adicionar evento de clique fora do modal para fechar
  modalContainer.addEventListener("click", function (event) {
    if (event.target === modalContainer) {
      fecharModalEdicao();
    }
  });

  // Mostrar o modal com animação
  setTimeout(() => {
    modalContainer.classList.add("ativo");
  }, 10);
}

function fecharModalEdicao() {
  const modal = document.getElementById("modal-edicao");
  if (modal) {
    modal.classList.remove("ativo");
    setTimeout(() => {
      modal.remove();
    }, 300);
  }
}

function salvarEdicaoItem(event) {
  event.preventDefault();

  const id = parseInt(document.getElementById("edicao-id").value);
  const tipo = document.getElementById("edicao-tipo").value;
  const descricao = document.getElementById("edicao-descricao").value.trim();
  const valor = document.getElementById("edicao-valor").value.trim();
  const categoria = document.getElementById("edicao-categoria").value.trim();
  const data = document.getElementById("edicao-data").value;

  // Validações
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

  // Desabilitar o botão de salvar
  const submitBtn = document.querySelector(".btn-salvar");
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = "Salvando...";
  }

  // Fazer a requisição para atualizar o item
  fetch(api + `/despesas/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: authToken,
    },
    body: JSON.stringify({
      descricao,
      valor: valorNumerico,
      categoria,
      data,
      tipo,
    }),
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error(`Erro ${res.status}: ${res.statusText}`);
      }
      return res.json();
    })
    .then((response) => {
      if (
        response.status === "success" ||
        response.message === "Item atualizado!"
      ) {
        showMessage("Item atualizado com sucesso!");
        fecharModalEdicao();
        carregarDados();
      } else {
        showMessage(response.message || "Erro ao atualizar item", "error");
        // Reabilitar o botão
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = "Salvar Alterações";
        }
      }
    })
    .catch((err) => {
      showMessage("Erro ao atualizar item: " + err.message, "error");
      console.error(err);
      // Reabilitar o botão
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = "Salvar Alterações";
      }
    });
}
