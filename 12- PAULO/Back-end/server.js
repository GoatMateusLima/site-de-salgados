const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 8080;

// Caminhos base
const BASE_DIR = __dirname;
const FRONTEND_DIR = path.join(BASE_DIR, "../Front-end/public");
const DB_DIR = path.join(BASE_DIR, "../Banco-de-dados");

// Verifica se o diretório do front existe
if (!fs.existsSync(FRONTEND_DIR)) {
  console.error("❌ Diretório Front-end/public não encontrado:", FRONTEND_DIR);
  process.exit(1);
}

// Configuração de CORS
const corsOptions = {
  origin: ["http://localhost:8080", "http://localhost:5000"],
  methods: ["GET", "POST"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

// Segurança
app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; " +
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
      "font-src 'self' https://fonts.gstatic.com; " +
      "img-src 'self' data:; " +
      "script-src 'self';"
  );
  next();
});

// Evita cache
app.use((req, res, next) => {
  res.setHeader("Cache-Control", "no-store");
  next();
});

// Servir front-end
app.use(express.static(FRONTEND_DIR));

// Página principal
app.get("/", (req, res) => {
  res.sendFile(path.join(FRONTEND_DIR, "index.html"));
});

// Rota para obter produtos
app.get("/produtos", (req, res) => {
  const filePath = path.join(DB_DIR, "produtos.json");
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ erro: "Arquivo produtos.json não encontrado" });
  }
  const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  res.json(data);
});

// Carrega carrinho
function carregarCarrinho() {
  const filePath = path.join(DB_DIR, "carrinho.json");
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, "[]", "utf-8");
    return [];
  }
  const conteudo = fs.readFileSync(filePath, "utf-8").trim();
  if (!conteudo) return [];
  try {
    return JSON.parse(conteudo);
  } catch {
    return [];
  }
}

// Adiciona produto ao carrinho
app.post("/adicionar", (req, res) => {
  const dados = req.body;
  if (!dados || typeof dados !== "object") {
    return res.status(400).json({ erro: "Requisição inválida" });
  }

  let qtd = Number(dados.quantidade) || 1;
  if (qtd > 1000) qtd = 1000;
  if (qtd < 1) qtd = 1;

  const carrinhoPath = path.join(DB_DIR, "carrinho.json");
  let carrinho = carregarCarrinho();

  const idNum = Number(dados.id); // garante tipo número

  const existente = carrinho.find(p => Number(p.id) === idNum);
  if (existente) {
    existente.quantidade += qtd;
    if (existente.quantidade > 1000) existente.quantidade = 1000;
  } else {
    dados.id = idNum;
    dados.quantidade = qtd;
    carrinho.push(dados);
  }

  fs.writeFileSync(carrinhoPath, JSON.stringify(carrinho, null, 2), "utf-8");
  res.status(200).json({ mensagem: "Produto adicionado ao carrinho" });
});

// Retorna carrinho
app.get("/carrinho", (req, res) => {
  const carrinho = carregarCarrinho();
  res.json(carrinho);
});

// Remove produto do carrinho
app.post("/remover", (req, res) => {
  const { id } = req.body;
  if (id === undefined) {
    return res.status(400).json({ erro: "ID do produto é obrigatório" });
  }

  const carrinhoPath = path.join(DB_DIR, "carrinho.json");
  let carrinho = carregarCarrinho();

  const idNum = Number(id);
  const novoCarrinho = carrinho.filter(p => Number(p.id) !== idNum);

  if (novoCarrinho.length === carrinho.length) {
    return res.status(404).json({ erro: "Produto não encontrado no carrinho" });
  }

  fs.writeFileSync(carrinhoPath, JSON.stringify(novoCarrinho, null, 2), "utf-8");
  res.status(200).json({ mensagem: "Produto removido do carrinho" });
});

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`✅ Servidor rodando: http://localhost:${PORT}`);
  console.log(`🧠 Servindo Front-end de: ${FRONTEND_DIR}`);
});
