const container = document.getElementById("produtos-container");
const inputPesquisa = document.getElementById("input-pesquisa");
const formPesquisa = document.querySelector(".container-pesquisa");
const modalProduto = document.getElementById("modal-produto");

const banner = document.getElementById("efeito-carrossel");
const categorias = document.querySelector(".categorias-container");

let produtosData = []; // Guarda os produtos carregados

function aplicarEfeitoPesquisa(termo) {
  const ativo = termo.length > 0;
  if (banner) banner.style.display = ativo ? "none" : "block";
  if (categorias) categorias.style.display = ativo ? "none" : "flex";
}

// Função para renderizar produtos
function renderizarProdutos(produtos) {
  container.innerHTML = "";

  produtos.forEach(prod => {
    const card = document.createElement("div");
    card.className = "produto-card";
    card.innerHTML = `
      <img src="${prod.imagem}" alt="${prod.nome}">
      <h3>${prod.nome}</h3>
      <p>R$ ${prod.preco.toFixed(2)}</p>
      <div class="botoes-card">
        <button class="btn-saiba-mais" data-id="${prod.id}">Saiba Mais</button>
        <button class="btn-carrinho" data-id="${prod.id}">
          <img src="assets/img/home/icones/comprar.png" alt="Carrinho">
        </button>
      </div>
    `;
    container.appendChild(card);
  });

  attachEventosProdutos(produtos);
}

// Anexa eventos dos botões após renderizar os cards
function attachEventosProdutos(produtos) {
  document.querySelectorAll(".btn-saiba-mais").forEach(btn => {
    btn.onclick = () => {
      const id = btn.dataset.id;
      const produto = produtos.find(p => p.id == id);
      if (!produto) return;

      document.getElementById("modal-img").src = produto.imagem;
      document.getElementById("modal-nome").textContent = produto.nome;
      document.getElementById("modal-desc").textContent = produto.descricao || "Descrição não disponível.";
      document.getElementById("modal-preco").textContent = `R$ ${produto.preco.toFixed(2)}`;
      document.getElementById("modal-qtd").value = 1;
      document.getElementById("modal-add-carrinho").dataset.id = produto.id;

      modalProduto.classList.remove("hidden");
    };
  });

  document.querySelectorAll(".btn-carrinho").forEach(btn => {
    btn.onclick = () => {
      const id = btn.dataset.id;
      const produto = produtos.find(p => p.id == id);
      if (!produto) return alert("Produto não encontrado");

      adicionarAoCarrinho({ ...produto, quantidade: 1 });
    };
  });
}

// Adicionar ao carrinho
function adicionarAoCarrinho(item) {
  fetch("/adicionar", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(item)
  })
    .then(res => {
      if (!res.ok) throw new Error("Erro ao adicionar ao carrinho");
      return res.json();
    })
    .then(() => alert("Produto adicionado ao carrinho!"))
    .catch(err => alert("Erro: " + err.message));
}

// Fecha modal
document.getElementById("modal-fechar").addEventListener("click", () => {
  modalProduto.classList.add("hidden");
});

modalProduto.addEventListener("click", (event) => {
  const modalConteudo = document.querySelector(".modal-conteudo");
  if (!modalConteudo.contains(event.target)) {
    modalProduto.classList.add("hidden");
  }
});

// Modal: adicionar ao carrinho
document.getElementById("modal-add-carrinho").addEventListener("click", () => {
  const id = document.getElementById("modal-add-carrinho").dataset.id;
  const qtd = parseInt(document.getElementById("modal-qtd").value) || 1;
  const produto = produtosData.find(p => p.id == id);
  if (!produto) return alert("Produto não encontrado");

  adicionarAoCarrinho({ ...produto, quantidade: qtd });
  modalProduto.classList.add("hidden");
});

// Filtro e render
function filtrarProdutos(termo) {
  aplicarEfeitoPesquisa(termo);

  if (!termo) {
    renderizarProdutos(produtosData.filter(p => p.categoria === "salgados"));
    return;
  }

  termo = termo.toLowerCase();
  const resultados = produtosData.filter(p =>
    p.nome.toLowerCase().includes(termo) ||
    (p.descricao && p.descricao.toLowerCase().includes(termo))
  );
  renderizarProdutos(resultados);
}

// Input: digitação
inputPesquisa.addEventListener("input", () => {
  filtrarProdutos(inputPesquisa.value.trim());
});

// Submit: enter
formPesquisa.addEventListener("submit", event => {
  event.preventDefault();
  filtrarProdutos(inputPesquisa.value.trim());
});

// Troca categoria
document.querySelectorAll(".categoria").forEach(cat => {
  cat.addEventListener("click", () => {
    renderizarProdutos(produtosData.filter(p => p.categoria === cat.dataset.type));
  });
});

// Carrega produtos
fetch("/produtos?v=" + Date.now())
  .then(res => res.json())
  .then(data => {
    produtosData = data;
    renderizarProdutos(produtosData.filter(p => p.categoria === "salgados"));
  })
  .catch(err => console.error("Erro ao carregar produtos:", err));
