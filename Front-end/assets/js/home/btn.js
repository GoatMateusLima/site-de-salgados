const FLASK_URL = "https://site-de-salgados-flask-qaql.onrender.com";
const NODE_URL = "https://site-de-salgados-node.onrender.com";

// Botão carrinho do header
const btnCarrinhoo = document.getElementById("btn-carrinho");
btnCarrinhoo.addEventListener("click", () => {
  const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));
  if (!usuario) {
    window.location.href = "/form.html";
  } else {
    window.location.href = `${FLASK_URL}/carrinho?email=${encodeURIComponent(usuario.email)}`;
  }
});

const btnPerfil = document.getElementById("btn-perfil");
const containerPerfil = document.getElementById("conatiner-perfil");
const btnFecharPerfil = document.getElementById("btn-fechar-perfil");
const btnLoginCadastro = document.getElementById("btn-login-cadastro");
const btnDadosPessoais = document.getElementById("btn-dados-pessoais");
const btnCarrinho = document.getElementById("btn-carrinhoo");
const btnExcluirConta = document.getElementById("btn-excluir-conta");
const btnSair = document.getElementById("btn-sair");

function togglePerfil() {
  if (!containerPerfil) return;

  const isVisible = containerPerfil.style.display === "block";
  const usuarioLogado = localStorage.getItem("usuarioLogado");

  if (isVisible) {
    containerPerfil.style.display = "none";
  } else {
    containerPerfil.style.display = "block";

    if (!usuarioLogado) {
      btnLoginCadastro.style.display = "flex";
      btnDadosPessoais.style.display = "none";
      btnCarrinho.style.display = "none";
      btnExcluirConta.style.display = "none";
      btnSair.style.display = "none";
    } else {
      btnLoginCadastro.style.display = "none";
      btnDadosPessoais.style.display = "flex";
      btnCarrinho.style.display = "flex";
      btnExcluirConta.style.display = "flex";
      btnSair.style.display = "flex";
    }
  }
}

btnPerfil.addEventListener("click", togglePerfil);
btnFecharPerfil.addEventListener("click", togglePerfil);

btnLoginCadastro.addEventListener("click", () => {
  window.location.href = "/form.html";
});

btnDadosPessoais.addEventListener("click", () => {
  irParaDadosPessoais();
});

// Botão carrinho do menu de perfil
btnCarrinho.addEventListener("click", () => {
  const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));
  if (!usuario) {
    window.location.href = "/form.html";
  } else {
    window.location.href = `${FLASK_URL}/carrinho?email=${encodeURIComponent(usuario.email)}`;
  }
});

btnSair.addEventListener("click", () => {
  localStorage.removeItem("usuarioLogado");
  localStorage.removeItem("isLoggedIn");
  containerPerfil.style.display = "none";
  window.location.reload();
});

btnExcluirConta.addEventListener("click", async () => {
  const confirmacao = confirm("Tem certeza que deseja excluir sua conta? Essa ação é irreversível.");
  if (!confirmacao) return;

  const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));

  if (!usuario || !usuario.email) {
    alert("⚠ Nenhum usuário logado para excluir.");
    return;
  }

  try {
    const resposta = await fetch(`${NODE_URL}/excluir-conta`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: usuario.email }),
    });

    const resultado = await resposta.json();

    if (resposta.ok) {
      alert("✅ Conta excluída com sucesso.");
      localStorage.removeItem("usuarioLogado");
      localStorage.removeItem("isLoggedIn");
      window.location.href = "/";
    } else {
      alert("❌ Erro ao excluir conta: " + resultado.erro);
    }
  } catch (erro) {
    console.error("Erro ao excluir conta:", erro);
    alert("❌ Erro ao excluir conta. Tente novamente mais tarde.");
  }
});


