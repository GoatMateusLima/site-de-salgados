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
        const clickInsideMenu = this.navList?.contains(event.target);
        const clickOnIcon = this.mobileMenu?.contains(event.target);

        if (!clickInsideMenu && !clickOnIcon) {
            this.mobileMenu?.classList.remove(this.activeClass);
            this.navList?.classList.remove(this.activeClass);
        }
    }

    addClickEvent() {
        if (this.mobileMenu) {
            this.mobileMenu.addEventListener("click", this.handleClick);
        }
        document.addEventListener("click", this.handleOutsideClick);
    }

    init() {
        if (this.mobileMenu && this.navList) {
            this.addClickEvent();
        }
    }
}

// === Card de perfil ===
function togglePerfil() {
    const card = document.getElementById('card-perfil');
    if (!card) return;

    const isVisible = card.style.display !== 'none';
    card.style.display = isVisible ? 'none' : 'block';
}

// === Verificar login ===
function verificarLogin() {
    const cardPerfil = document.getElementById('card-perfil');
    const btnLogin = document.getElementById('btn-perfil');
    const imgPerfil = document.querySelector('.img-perfil img');
    const listElements = document.querySelectorAll('.list .element');

    if (!cardPerfil || !btnLogin || !imgPerfil || listElements.length === 0) return;

    const isLoggedIn = localStorage.getItem('isLoggedIn');

    if (!isLoggedIn) {
        cardPerfil.style.display = 'none';
        imgPerfil.src = '/img/home/icones/perfil-cinza.png';
        btnLogin.style.display = 'block';
    } else {
        cardPerfil.style.display = 'block';
        imgPerfil.src = '/img/home/icones/perfil.png';
        listElements.forEach(item => {
            item.style.display = 'block';
        });
        btnLogin.style.display = 'none';
    }
}

// === Ir para o carrinho ===
function irParaCarrinho() {
    window.location.href = `http://${window.location.hostname}:5000/carrinho?email=${encodeURIComponent(usuario.email)}`
}

// === Execução Condicional ===
window.onload = () => {
    verificarLogin();

    const btnCarrinho = document.getElementById("btn-carrinho");
    if (btnCarrinho) {
        btnCarrinho.addEventListener("click", irParaCarrinho);
    }
};

// === Inicializa Menu Mobile ===
const menu = new MenuIcon(".menu-icon", ".nav-list");
menu.init();
