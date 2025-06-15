const container = document.getElementById("produtos-container");

function mostrarProdutos(tipo, data) {
  container.innerHTML = "";

  // Filtra os produtos pela categoria correta
  const produtosFiltrados = data.filter(prod => prod.categoria === tipo);

  produtosFiltrados.forEach(prod => {
    const card = document.createElement("div");
    card.className = "produto-card";
    card.innerHTML = `
      <img src="${prod.imagem}" alt="${prod.nome}">
      <h3>${prod.nome}</h3>
      <p>R$ ${prod.preco.toFixed(2)}</p>
    `;
    container.appendChild(card);
  });
}

fetch("../../Banco-de-dados/produtos.json")
  .then(res => res.json())
  .then(data => {
    // Mostra os salgados por padrão ao carregar
    mostrarProdutos("salgados", data);

    // Troca de categoria ao clicar
    const categorias = document.querySelectorAll(".categoria");
    categorias.forEach(cat => {
      cat.addEventListener("click", () => {
        const tipo = cat.dataset.type; // deve ser "salgados" ou "bebidas"
        mostrarProdutos(tipo, data);
      });
    });
  });