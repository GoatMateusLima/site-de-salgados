const API_HOST = "https://site-de-salgados-node.onrender.com";

// Função para atualizar o total do carrinho
function atualizarTotal() {
  let total = 0;
  document.querySelectorAll(".produto").forEach(prodEl => {
    const id = prodEl.dataset.id;
    const qtdInput = document.getElementById(`qtd-${id}`);
    if (!qtdInput) return;
    const qtd = parseInt(qtdInput.value);
    const precoUnitario = parseFloat(document.getElementById(`preco-${id}`).dataset.precoUnitario);
    total += precoUnitario * qtd;
  });

  const totalEl = document.getElementById("total");
  if (totalEl) {
    totalEl.textContent = "Total: R$ " + total.toFixed(2).replace(".", ",");
  }
}

// Controla mensagem de carrinho vazio
function controlarMensagemVazio() {
  const mensagemVazio = document.getElementById("mensagem-vazio");
  const produtosRestantes = document.querySelectorAll(".produto").length;

  if (mensagemVazio) {
    mensagemVazio.style.display = produtosRestantes === 0 ? "block" : "none";
  }
}

// Função para remover produto do carrinho
async function confirmarRemocao(idProduto) {
  if (!confirm("Você deseja mesmo excluir do seu carrinho? Você perderá toda quantidade de salgados que colocou.")) return;

  try {
    const usuario = JSON.parse(localStorage.getItem("usuarioLogado")) || { email: "visitante" };

    const resposta = await fetch(`${API_HOST}/excluir`, {  // Alterado para /excluir
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({ 
        id: Number(idProduto), 
        email: usuario.email 
      }),
    });

    if (!resposta.ok) {
      const erro = await resposta.json();
      throw new Error(erro.message || "Erro ao remover item");
    }

    const elemento = document.getElementById(`produto-${idProduto}`);
    if (elemento) elemento.remove();

    atualizarTotal();
    controlarMensagemVazio();

    // Atualização mais suave sem alerta
    Toastify({
      text: "Produto removido com sucesso!",
      duration: 3000,
      close: true,
      gravity: "top",
      position: "right",
      backgroundColor: "#4CAF50",
    }).showToast();
  } catch (err) {
    console.error("Erro ao remover produto:", err);
    Toastify({
      text: `Erro: ${err.message}`,
      duration: 3000,
      close: true,
      gravity: "top",
      position: "right",
      backgroundColor: "#f44336",
    }).showToast();
  }
}

// Função para alterar quantidade
async function alterarQuantidade(idProduto, delta) {
  const idNum = Number(idProduto);
  if (isNaN(idNum)) {
    console.error("ID do produto inválido");
    return;
  }

  const inputQtd = document.getElementById(`qtd-${idNum}`);
  if (!inputQtd) return;

  let quantidadeAtual = parseInt(inputQtd.value);
  let novaQuantidade = quantidadeAtual + delta;

  if (novaQuantidade < 1) novaQuantidade = 1;
  if (novaQuantidade > 1000) novaQuantidade = 1000;

  try {
    const usuario = JSON.parse(localStorage.getItem("usuarioLogado")) || { email: "visitante" };

    const resposta = await fetch(`${API_HOST}/atualizar-quantidade`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({ 
        id: idNum, 
        quantidade: novaQuantidade, 
        email: usuario.email 
      }),
    });

    if (!resposta.ok) {
      const erro = await resposta.json();
      throw new Error(erro.message || "Erro ao atualizar quantidade");
    }

    inputQtd.value = novaQuantidade;

    const precoUnitario = parseFloat(document.getElementById(`preco-${idNum}`).dataset.precoUnitario);
    const precoTotalEl = document.getElementById(`preco-${idNum}`);

    precoTotalEl.textContent = `R$ ${(precoUnitario * novaQuantidade).toFixed(2).replace(".", ",")}`;

    atualizarTotal();

    // Feedback visual
    inputQtd.classList.add("qtd-updated");
    setTimeout(() => inputQtd.classList.remove("qtd-updated"), 300);

  } catch (err) {
    console.error("Erro ao atualizar quantidade:", err);
    Toastify({
      text: `Erro: ${err.message}`,
      duration: 3000,
      close: true,
      gravity: "top",
      position: "right",
      backgroundColor: "#f44336",
    }).showToast();
  }
}

// Funções de navegação
function voltarParaIndex() {
  window.location.href = `${window.location.protocol}//${window.location.hostname}/index.html`;
}

function sobre() {
  window.location.href = `${window.location.protocol}//${window.location.hostname}/sobre.html`;
}

// Inicia todos os event listeners
function iniciarEventListeners() {
  // Remover produto
  document.querySelectorAll(".btn-remover").forEach(botao => {
    botao.addEventListener("click", (e) => {
      const idProduto = botao.dataset.id;
      if (idProduto) confirmarRemocao(idProduto);
    });
  });

  // Alterar quantidade
  document.querySelectorAll(".btn-qtd").forEach(botao => {
    botao.addEventListener("click", (e) => {
      const idProduto = botao.dataset.id;
      const delta = Number(botao.dataset.delta);
      if (idProduto && !isNaN(delta)) alterarQuantidade(idProduto, delta);
    });
  });

  // Input manual de quantidade
  document.querySelectorAll(".input-qtd").forEach(input => {
    input.addEventListener("change", (e) => {
      const idProduto = input.dataset.id;
      const novaQuantidade = parseInt(input.value);
      if (idProduto && !isNaN(novaQuantidade)) {
        const quantidadeAtual = parseInt(input.dataset.lastValue || "1");
        alterarQuantidade(idProduto, novaQuantidade - quantidadeAtual);
        input.dataset.lastValue = novaQuantidade.toString();
      }
    });
  });

  // Botão voltar
  const btnVoltar = document.querySelector(".botao-voltar");
  if (btnVoltar) {
    btnVoltar.addEventListener("click", voltarParaIndex);
  }
}

// Quando o DOM estiver carregado
document.addEventListener("DOMContentLoaded", () => {
  iniciarEventListeners();
  atualizarTotal();
  controlarMensagemVazio();
  
  // Adiciona tratamento de erro global
  window.addEventListener("error", (e) => {
    console.error("Erro global:", e.error);
    Toastify({
      text: "Ocorreu um erro inesperado",
      duration: 3000,
      close: true,
      gravity: "top",
      position: "right",
      backgroundColor: "#f44336",
    }).showToast();
  });
});