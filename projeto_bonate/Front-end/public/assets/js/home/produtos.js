document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("produtos-container");
  const inputPesquisa = document.getElementById("input-pesquisa");
  const formPesquisa = document.querySelector(".container-pesquisa");
  const modalProduto = document.getElementById("modal-produto");

  const banner = document.getElementById("efeito-carrossel");
  const categorias = document.querySelector(".categorias-container");

  let produtosData = [];
  const API_BASE = "https://site-de-salgados-node.onrender.com";


  // Função para pegar o email do usuário logado ou visitante
  function getEmailUsuario() {
    const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));
    return usuario?.email || "visitante";
  }

  // Controla a exibição do banner e categorias conforme pesquisa
  function aplicarEfeitoPesquisa(termo) {
    const ativo = termo.length > 0;
    if (banner) banner.style.display = ativo ? "none" : "block";
    if (categorias) categorias.style.display = ativo ? "none" : "flex";
  }

  // Renderiza a lista de produtos na tela
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
            <img src="/img/home/icones/comprar.png" alt="Carrinho">
          </button>
        </div>
      `;
      container.appendChild(card);
    });

    attachEventosProdutos(produtos);
  }

  // Anexa os eventos nos botões dos produtos
  function attachEventosProdutos(produtos) {
    document.querySelectorAll(".btn-saiba-mais").forEach(btn => {
      btn.onclick = () => {
        const id = btn.dataset.id;
        const produto = produtos.find(p => p.id == id);
        if (!produto) return alert("Produto não encontrado");

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

  // Função que envia a requisição para adicionar o produto ao carrinho do usuário logado
  function adicionarAoCarrinho(item) {
    const email = getEmailUsuario();
    if (email === "visitante") {
      window.location.href = "/form.html";
      return;
    }

    item.email = email;

    fetch(`${API_BASE}/adicionar`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item),
    })
      .then(res => {
        if (!res.ok) throw new Error("Erro ao adicionar ao carrinho");
        return res.json();
      })
      .then(() => alert("✅ Produto adicionado ao carrinho!"))
      .catch(err => alert("Erro: " + err.message));
  }

  // Fechar modal ao clicar no "X"
  document.getElementById("modal-fechar").addEventListener("click", () => {
    modalProduto.classList.add("hidden");
  });

  // Fechar modal clicando fora do conteúdo
  modalProduto.addEventListener("click", (event) => {
    const modalConteudo = document.querySelector(".modal-conteudo");
    if (!modalConteudo.contains(event.target)) {
      modalProduto.classList.add("hidden");
    }
  });

  

  // Botão "Adicionar ao carrinho" do modal, com quantidade customizada
  document.getElementById("modal-add-carrinho").addEventListener("click", async () => {
    const email = getEmailUsuario();
    if (email === "visitante") {
      window.location.href = "/form.html";
      return;
    }

    const id = document.getElementById("modal-add-carrinho").dataset.id;
    let qtd = parseInt(document.getElementById("modal-qtd").value) || 1;
    if (qtd > 1000) qtd = 1000;
    if (qtd < 1) qtd = 1;

    const produto = produtosData.find(p => p.id == id);
    if (!produto) return alert("Produto não encontrado");

    const item = {
      ...produto,
      quantidade: qtd,
      email: email,
    };

    try {
      const res = await fetch(`${API_BASE}/adicionar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
      });

      if (!res.ok) throw new Error("Erro ao adicionar ao carrinho");

      modalProduto.classList.add("hidden");
      
      const usuario = JSON.parse(localStorage.getItem("usuarioLogado")) || { email: "visitante" };
window.location.href = `http://${window.location.hostname}:5000/carrinho?email=${encodeURIComponent(usuario.email)}`;

    } catch (err) {
      alert("Erro: " + err.message);
    }
  });

  // Filtra produtos conforme pesquisa e categoria
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

  inputPesquisa.addEventListener("input", () => {
    filtrarProdutos(inputPesquisa.value.trim());
  });

  formPesquisa.addEventListener("submit", event => {
    event.preventDefault();
    filtrarProdutos(inputPesquisa.value.trim());
  });

  document.querySelectorAll(".categoria").forEach(cat => {
    cat.addEventListener("click", () => {
      renderizarProdutos(produtosData.filter(p => p.categoria === cat.dataset.type));
    });
  });

  // Busca e renderiza os produtos da API no carregamento da página
  async function carregarProdutos() {
    try {
      const res = await fetch(`${API_BASE}/produtos?v=${Date.now()}`);
      if (!res.ok) throw new Error("Erro ao buscar produtos");
      produtosData = await res.json();
      renderizarProdutos(produtosData.filter(p => p.categoria === "salgados"));
    } catch (err) {
      console.error("Erro ao carregar produtos:", err);
    }
  }

  carregarProdutos();
});

// Controle dos botões + e - da quantidade no modal
const btnIncrement = document.getElementById("modal-qtd-increment");
const btnDecrement = document.getElementById("modal-qtd-decrement");
const inputQtd = document.getElementById("modal-qtd");

btnIncrement.addEventListener("click", () => {
  let val = parseInt(inputQtd.value) || 1;
  if (val < 1000) {
    inputQtd.value = val + 1;
  }
});

btnDecrement.addEventListener("click", () => {
  let val = parseInt(inputQtd.value) || 1;
  if (val > 1) {
    inputQtd.value = val - 1;
  }
});
