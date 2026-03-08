# 🚀 Como fazer o Deploy

Este projeto tem 3 partes. Cada uma vai em um serviço diferente:

---

## 1. Back-end Node (Express) → Render

1. Acesse https://render.com e crie uma conta gratuita
2. Clique em "New Web Service"
3. Conecte seu repositório GitHub
4. Configure:
   - **Root Directory:** `Back-end`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
5. Após o deploy, copie a URL gerada (ex: `https://site-de-salgados-node.onrender.com`)

---

## 2. Flask (Carrinho) → Render

1. No Render, crie outro "New Web Service"
2. Conecte o mesmo repositório
3. Configure:
   - **Root Directory:** `Flask`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `gunicorn app:app`
4. Após o deploy, copie a URL (ex: `https://site-de-salgados-flask.onrender.com`)

---

## 3. Front-end (HTML/CSS/JS) → Vercel

1. Acesse https://vercel.com e crie uma conta
2. Clique em "New Project" e importe seu repositório
3. Configure:
   - **Root Directory:** `Front-end`
   - **Framework:** Other (nenhum)
4. Clique em Deploy!

---

## ⚠️ Após os deploys, atualize as URLs

Em `Front-end/assets/js/home/produtos.js`, confirme que as URLs batem com as que o Render gerou:
- `API_BASE` → URL do Node
- URL do redirect do carrinho → URL do Flask

---

## 🐛 Bug corrigido

O bug da apresentação estava nesta linha de `produtos.js`:
```js
// ❌ ANTES (só funcionava no seu computador)
window.location.href = `http://${window.location.hostname}:5000/carrinho?...`

// ✅ DEPOIS (funciona em produção)  
window.location.href = `https://site-de-salgados-flask.onrender.com/carrinho?...`
```
