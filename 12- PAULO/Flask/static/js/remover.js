async function confirmarRemocao(event, idProduto) {
  event.preventDefault();

  const confirmacao = confirm(
    "Você deseja mesmo excluir do seu carrinho? Você perderá toda quantidade de salgados que colocou."
  );
  if (!confirmacao) return;

  try {
    const resposta = await fetch("http://localhost:8080/remover", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: idProduto })
    });

    const resultado = await resposta.json();
    if (!resposta.ok) throw new Error(resultado.erro || "Erro desconhecido");

    // Remove o elemento do DOM
    const elemento = document.getElementById(`produto-${idProduto}`);
    if (elemento) elemento.remove();

    // Recalcula o total sem recarregar a página
    let total = 0;
    document.querySelectorAll(".produto").forEach(prodEl => {
      const precoEl = prodEl.querySelectorAll("span")[1];
      const preco = parseFloat(precoEl.textContent.replace("R$ ", "").replace(",", "."));
      total += preco; // Já é o preço total do item (preço * quantidade)
    });
    document.getElementById("total").textContent =
      "Total: R$ " + total.toFixed(2).replace(".", ",");

    alert("Produto removido com sucesso!");
  } catch (err) {
    alert("Erro ao remover produto: " + err.message);
  }
}
