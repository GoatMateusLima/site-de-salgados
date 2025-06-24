const API_HOST = `${window.location.protocol}//${window.location.hostname}:8080`;

// Função pra atualizar total do carrinho
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

// Mostrar ou esconder mensagem de carrinho vazio
function controlarMensagemVazio() {
  const mensagemVazio = document.getElementById("mensagem-vazio");
  const produtosRestantes = document.querySelectorAll(".produto").length;

  if (mensagemVazio) {
    mensagemVazio.style.display = produtosRestantes === 0 ? "block" : "none";
  }
}

// Função para remover produto (chamada pelo event listener)
async function confirmarRemocao(idProduto) {
  if (!confirm("Você deseja mesmo excluir do seu carrinho? Você perderá toda quantidade de salgados que colocou.")) return;

  try {
    const usuario = JSON.parse(localStorage.getItem("usuarioLogado")) || { email: "visitante" };

    const resposta = await fetch(`${API_HOST}/remover`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: Number(idProduto), email: usuario.email }),
    });

    const resultado = await resposta.json();

    if (!resposta.ok) throw new Error(resultado.erro || "Erro desconhecido");

    const elemento = document.getElementById(`produto-${idProduto}`);
    if (elemento) elemento.remove();

    atualizarTotal();
    controlarMensagemVazio();

    alert("Produto removido com sucesso!");
  } catch (err) {
    alert("Erro ao remover produto: " + err.message);
  }
}

// Função para alterar quantidade (chamada pelo event listener)
async function alterarQuantidade(idProduto, delta) {
  const idNum = Number(idProduto);
  if (isNaN(idNum)) {
    alert("ID do produto inválido");
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
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: idNum, quantidade: novaQuantidade, email: usuario.email }),
    });

    const resultado = await resposta.json();

    if (!resposta.ok) throw new Error(resultado.erro || "Erro desconhecido");

    inputQtd.value = novaQuantidade;

    const precoUnitario = parseFloat(document.getElementById(`preco-${idNum}`).dataset.precoUnitario);
    const precoTotalEl = document.getElementById(`preco-${idNum}`);

    precoTotalEl.textContent = `R$ ${(precoUnitario * novaQuantidade).toFixed(2).replace(".", ",")}`;

    atualizarTotal();
  } catch (err) {
    alert("Erro ao atualizar quantidade: " + err.message);
  }
}

// Botão voltar para index
function voltarParaIndex() {
  window.location.href = `${window.location.protocol}//${window.location.hostname}:8080/index.html`; // Ajuste se necessário
}

// Função para iniciar os event listeners — chama depois que a página carregou
function iniciarEventListeners() {
  // Remover produto
  document.querySelectorAll(".btn-remover").forEach(botao => {
    botao.addEventListener("click", (e) => {
      const idProduto = botao.dataset.id;
      if (!idProduto) return;
      confirmarRemocao(idProduto);
    });
  });

  // Alterar quantidade (+ e -)
  document.querySelectorAll(".btn-qtd").forEach(botao => {
    botao.addEventListener("click", (e) => {
      const idProduto = botao.dataset.id;
      const delta = Number(botao.dataset.delta);
      if (!idProduto || isNaN(delta)) return;
      alterarQuantidade(idProduto, delta);
    });
  });

  // Botão voltar (se quiser continuar com o onclick no HTML, ok, mas pode mudar aqui também)
  const btnVoltar = document.querySelector(".botao-voltar");
  if (btnVoltar) {
    btnVoltar.addEventListener("click", (e) => {
      voltarParaIndex();
    });
  }
}

function sobre() {
  window.location.href = `${window.location.protocol}//${window.location.hostname}:8080/sobre.html`; // Ajuste se necessário
}

// Chamando função pra ativar os listeners após o carregamento do DOM
document.addEventListener("DOMContentLoaded", () => {
  iniciarEventListeners();
  atualizarTotal();
  controlarMensagemVazio();
});

