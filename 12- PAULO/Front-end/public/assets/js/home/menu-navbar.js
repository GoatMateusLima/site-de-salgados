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

// Instancia e inicializa
const menu = new MenuIcon(".menu-icon", ".nav-list");
menu.init();
