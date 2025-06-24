// Define o host da API baseado na máquina atual
const API_HOST = "https://site-de-salgados-node.onrender.com";

// ========== NOTIFICAÇÃO VISUAL ==========
function mostrarNotificacao(mensagem, duracao = 3000) {
  const notificacao = document.getElementById("notificacao");
  if (!notificacao) return;

  notificacao.textContent = mensagem;
  notificacao.classList.remove("oculto");
  notificacao.classList.add("mostrar");

  setTimeout(() => {
    notificacao.classList.remove("mostrar");
    notificacao.classList.add("oculto");
  }, duracao);
}

// ========== CADASTRO ==========
async function cadastrar(event) {
  event.preventDefault();

  const nome = document.getElementById("nome-cadastro").value;
  const email = document.getElementById("email-cadastro").value;
  const senha = document.getElementById("senha-cadastro").value;

  const resposta = await fetch(`${API_HOST}/cadastrar`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nome, email, senha }),
  });

  const dados = await resposta.json();

  if (!resposta.ok) {
    mostrarNotificacao(dados.erro || "Erro ao cadastrar.");
    return;
  }

  mostrarNotificacao(dados.mensagem || "Cadastro realizado com sucesso.");

  // Troca para tela de login
  const switchEl = document.getElementById("switch");
  switchEl.checked = false;

  const signUp = document.querySelector(".sign-up-container");
  const logIn = document.querySelector(".log-in-container");

  signUp.style.animation = "none";
  logIn.style.animation = "none";

  signUp.offsetHeight;
  logIn.offsetHeight;

  signUp.style.animation = "unhello 0.5s ease forwards";
  logIn.style.animation = "hello 0.5s ease forwards";
}

// ========== LOGIN ==========
async function login(event) {
  event.preventDefault();

  const email = document.getElementById("email-login").value;
  const senha = document.getElementById("senha-login").value;

  const resposta = await fetch(`${API_HOST}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, senha }),
  });

  const dados = await resposta.json();

  if (!resposta.ok) {
    mostrarNotificacao(dados.erro || "Erro ao fazer login.");
    return;
  }

  if (dados.usuario) {
    localStorage.setItem("usuarioLogado", JSON.stringify(dados.usuario));
    window.location.href = "index.html";
  }
}

// ========== MENU MOBILE ==========
class MenuIcon {
  constructor(mobileMenuSelector, navListSelector) {
    this.mobileMenu = document.querySelector(mobileMenuSelector);
    this.navList = document.querySelector(navListSelector);
    this.activeClass = "active";

    this.handleClick = this.handleClick.bind(this);
    this.handleOutsideClick = this.handleOutsideClick.bind(this);
  }

  handleClick(event) {
    event.stopPropagation();
    this.mobileMenu.classList.toggle(this.activeClass);
    this.navList.classList.toggle(this.activeClass);
  }

  handleOutsideClick(event) {
    const clickInsideMenu = this.navList.contains(event.target);
    const clickOnIcon = this.mobileMenu.contains(event.target);

    if (!clickInsideMenu && !clickOnIcon) {
      this.mobileMenu.classList.remove(this.activeClass);
      this.navList.classList.remove(this.activeClass);
    }
  }

  addClickEvent() {
    this.mobileMenu.addEventListener("click", this.handleClick);
    document.addEventListener("click", this.handleOutsideClick);
  }

  init() {
    if (this.mobileMenu && this.navList) {
      this.addClickEvent();
    }
  }
}

// ========== EVENTOS ==========
document.addEventListener("DOMContentLoaded", () => {
  const btnCadastrar = document.getElementById("btn-cadastrar");
  const btnLogin = document.getElementById("btn-login");

  const formCadastro = document.getElementById("form-cadastro");
  const formLogin = document.getElementById("form-login");

  // Clique nos botões
  if (btnCadastrar) btnCadastrar.addEventListener("click", cadastrar);
  if (btnLogin) btnLogin.addEventListener("click", login);

  // Enter nos formulários
  if (formCadastro) formCadastro.addEventListener("submit", cadastrar);
  if (formLogin) formLogin.addEventListener("submit", login);
});

// Instancia o menu mobile
const menu = new MenuIcon(".menu-icon", ".nav-list");
menu.init();
