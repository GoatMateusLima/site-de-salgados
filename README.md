# BONATE

![screenshot da home](telasIMG/homeBonate.png)
![screenshot do carrinho](telasIMG/CarrinhoBonate.png)

## Sobre o projeto
O Bonate foi criado como atividade do ensino médio técnico, onde o professor propôs que cada aluno desenvolvesse uma loja virtual baseada em algo real. O projeto é uma loja de salgados com carrinho de compras funcional.

Por ser meu primeiro projeto envolvendo tecnologias além do HTML e CSS básico, enfrentei diversos desafios especialmente com o Flask, o que me levou a uma arquitetura híbrida: o Flask cuida apenas da página do carrinho, enquanto o restante do site é gerenciado pelo Node.js com Express.

Durante o desenvolvimento aprendi lições importantes, como a diferença entre localhost e um link público, problemas de caminhos e redirecionamento entre serviços, e como integrar tecnologias diferentes num mesmo projeto.

O design foi criado pela minha colega Ágatha, enquanto eu fiquei responsável por toda a programação. Tenho muito orgulho desse projeto especialmente por funcionar tanto no computador quanto no celular, como você pode ver nas fotos abaixo.


## Tecnologias
- HTML, CSS, JS (Front-end)
- Node.js + Express (Back-end)
- Python + Flask (Carrinho)

---
## Telas no PC
![screenshot da home](telasIMG/homeBonate.png)
![screenshot do carrinho](telasIMG/CarrinhoBonate.png)

![screenshot da home](telasIMG/cadastro.png)
![screenshot do carrinho](telasIMG/login.png)

![screenshot da home](telasIMG/menu.png)
![screenshot do carrinho](telasIMG/modal.png)

![screenshot da home](telasIMG/produtos.png)
![screenshot do carrinho](telasIMG/sobreNos.png)


## Telas no Celular

![screenshot da home](telasIMG/HomeMobile.jpg)
![screenshot do carrinho](telasIMG/CarrinhoMobile.jpg)

![screenshot da home](telasIMG/cadastroMobile.jpg)
![screenshot do carrinho](telasIMG/loginMobile.jpg)

![screenshot da home](telasIMG/ProdutosMobile.jpg)
![screenshot do carrinho](telasIMG/SaibaMaisProdutoMobile.jpg)

![screenshot do carrinho](telasIMG/menuMobile.jpg)

---
```markdown
## 🚀 Como fazer o Deploy

Este projeto usa dois serviços no Render. O Front-end é servido automaticamente pelo Node — não é necessário um serviço separado para ele.

---

### 1. Back-end Node (Express) → Render
> Serve o Front-end, as imagens e a API de produtos/usuários/carrinho.

1. Acesse https://render.com e crie uma conta gratuita
2. Clique em **New Web Service**
3. Conecte seu repositório GitHub
4. Configure:
   - **Root Directory:** `Back-end`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
5. Após o deploy, copie a URL gerada (ex: `https://site-de-salgados-node.onrender.com`)

---

### 2. Flask (Carrinho) → Render
> Serve apenas a página do carrinho de compras.

1. No Render, crie outro **New Web Service**
2. Conecte o mesmo repositório
3. Configure:
   - **Root Directory:** `Flask`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `gunicorn app:app`
4. Após o deploy, copie a URL gerada (ex: `https://site-de-salgados-flask.onrender.com`)

---

### ⚠️ Após os deploys, atualize as URLs

Nos arquivos abaixo, substitua pelas URLs reais geradas pelo Render:

**`Front-end/assets/js/home/btn.js`**
- `NODE_URL` → URL do Node
- `FLASK_URL` → URL do Flask

**`Front-end/assets/js/home/produtos.js`**
- `API_BASE` → URL do Node
- URL do redirect do carrinho → URL do Flask

**`Flask/static/js/carrinho.js`**
- `API_HOST` → URL do Node
- Função `voltarParaIndex()` → URL do Node
```

