const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 8080;

// Caminhos
const BASE_DIR = __dirname;
const FRONTEND_DIR = path.join(BASE_DIR, "../Front-end/public");
const DB_DIR = path.join(BASE_DIR, "Banco-de-dados");
const IMG_DIR = path.join(DB_DIR, "img", "img-salgados");
const IMG_GERAL_DIR = path.join(DB_DIR, "img");

// Verifica se front-end existe
if (!fs.existsSync(FRONTEND_DIR)) {
  console.error("❌ Diretório Front-end/public não encontrado:", FRONTEND_DIR);
  process.exit(1);
}

const corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "OPTIONS"]
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; " +
    "connect-src 'self' https://site-de-salgados-node.onrender.com; " +
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
    "font-src 'self' https://fonts.gstatic.com; " +
    "img-src 'self' data:; " +
    "script-src 'self';"
  );
  next();
});

app.use((req, res, next) => {
  res.setHeader("Cache-Control", "no-store");
  next();
});


// Servir front-end e imagens
app.use(express.static(FRONTEND_DIR));
app.use("/imagens", express.static(IMG_DIR));
app.use("/img", express.static(IMG_GERAL_DIR));
// Página principal
app.get("/", (req, res) => {
  res.sendFile(path.join(FRONTEND_DIR, "index.html"));
});

// Função utilitária para carregar carrinho
function carregarCarrinho(email = "visitante", criarSeNaoExistir = false) {
  const emailSeguro = email.replace(/[^\w.-]/g, "_");
  const nomeArquivo = `carrinho-${emailSeguro}.json`;
  const filePath = path.join(DB_DIR, nomeArquivo);

  if (!fs.existsSync(filePath)) {
    if (criarSeNaoExistir) {
      fs.writeFileSync(filePath, "[]", "utf-8");
    }
    return [];
  }

  const conteudo = fs.readFileSync(filePath, "utf-8").trim();
  if (!conteudo) return [];

  try {
    return JSON.parse(conteudo);
  } catch (erro) {
    console.error("❌ Erro ao carregar carrinho:", erro);
    return [];
  }
}

// Rota para produtos
app.get("/produtos", (req, res) => {
  const filePath = path.join(DB_DIR, "produtos.json");
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ erro: "Arquivo produtos.json não encontrado" });
  }

  const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));

  const produtosComImagens = data.map(produto => ({
    ...produto,
    imagem: `/imagens/${path.basename(produto.imagem)}`
  }));

  res.json(produtosComImagens);
});

// Usuários
const USUARIOS_PATH = path.join(DB_DIR, "usuarios.json");

function lerUsuarios() {
  if (!fs.existsSync(USUARIOS_PATH)) return [];
  const dados = fs.readFileSync(USUARIOS_PATH, "utf-8");
  return JSON.parse(dados);
}

function salvarUsuario(usuario) {
  const usuarios = lerUsuarios();
  usuarios.push(usuario);
  fs.writeFileSync(USUARIOS_PATH, JSON.stringify(usuarios, null, 2));
}


app.use(express.json()); // Certifique-se de que isso está ativado

app.delete('/excluir-conta', (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ erro: 'Email não informado.' });
  }

  const usuarios = lerUsuarios();
  const novosUsuarios = usuarios.filter(usuario => usuario.email !== email);

  if (usuarios.length === novosUsuarios.length) {
    return res.status(404).json({ erro: 'Usuário não encontrado.' });
  }

  fs.writeFileSync(USUARIOS_PATH, JSON.stringify(novosUsuarios, null, 2));
  return res.status(200).json({ mensagem: 'Conta excluída com sucesso.' });
});

app.post("/cadastrar", (req, res) => {
  const { nome, email, senha } = req.body;

  if (!nome || !email || !senha) {
    return res.status(400).json({ erro: "Nome, e-mail e senha são obrigatórios" });
  }

  const usuarios = lerUsuarios();

  const emailJaExiste = usuarios.find(u => u.email === email);
  if (emailJaExiste) {
    return res.status(400).json({ erro: "Conta já existe com este e-mail. Tente outro." });
  }

  salvarUsuario({ nome, email, senha });

  return res.status(200).json({ mensagem: "Usuário cadastrado com sucesso!" });
});

// Login
app.post("/login", (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ erro: "E-mail e senha são obrigatórios." });
  }

  const usuarios = lerUsuarios();

  const usuario = usuarios.find(u => u.email === email);
  if (!usuario) {
    return res.status(401).json({ erro: "Email não encontrado. Crie uma conta." });
  }

  if (usuario.senha !== senha) {
    return res.status(401).json({ erro: "Senha incorreta para este e-mail." });
  }

  return res.status(200).json({ mensagem: "Login bem-sucedido", usuario });
});


// Adicionar ao carrinho
app.post("/adicionar", (req, res) => {
  const dados = req.body;
  if (!dados || typeof dados !== "object") {
    return res.status(400).json({ erro: "Requisição inválida" });
  }

  const email = (dados.email || "visitante").replace(/[^\w.-]/g, "_");
  const carrinhoPath = path.join(DB_DIR, `carrinho-${email}.json`);
  let carrinho = carregarCarrinho(email, true);

  let qtd = Number(dados.quantidade) || 1;
  if (qtd > 1000) qtd = 1000;
  if (qtd < 1) qtd = 1;

  const idNum = Number(dados.id);
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

// Obter carrinho
app.get("/carrinho", (req, res) => {
  const email = (req.query.email || "visitante").replace(/[^\w.-]/g, "_");
  const carrinho = carregarCarrinho(email, false);
  res.json(carrinho);
});

// Atualizar quantidade
app.post("/atualizar-quantidade", (req, res) => {
  const { id, quantidade, email } = req.body;
  if (typeof id === "undefined" || typeof quantidade === "undefined" || !email) {
    return res.status(400).json({ erro: "ID, quantidade e email são obrigatórios" });
  }

  const emailLimpo = email.replace(/[^\w.-]/g, "_");
  const carrinhoPath = path.join(DB_DIR, `carrinho-${emailLimpo}.json`);
  let carrinho = carregarCarrinho(emailLimpo, true);

  const idNum = Number(id);
  let qtdNum = Number(quantidade);
  if (isNaN(idNum) || isNaN(qtdNum) || qtdNum < 1 || qtdNum > 1000) {
    return res.status(400).json({ erro: "ID ou quantidade inválidos" });
  }

  const produto = carrinho.find(p => Number(p.id) === idNum);
  if (!produto) {
    return res.status(404).json({ erro: "Produto não encontrado no carrinho" });
  }

  produto.quantidade = qtdNum;

  try {
    fs.writeFileSync(carrinhoPath, JSON.stringify(carrinho, null, 2), "utf-8");
    res.status(200).json({ mensagem: "Quantidade atualizada com sucesso" });
  } catch (err) {
    console.error("Erro ao salvar carrinho:", err);
    res.status(500).json({ erro: "Erro interno no servidor" });
  }
});

// Remover produto
app.post("/remover", (req, res) => {
  try {
    const { id, email } = req.body || {};
    if (id === undefined || !email) {
      return res.status(400).json({ erro: "ID do produto e email são obrigatórios" });
    }

    const emailLimpo = email.replace(/[^\w.-]/g, "_");
    const carrinhoPath = path.join(DB_DIR, `carrinho-${emailLimpo}.json`);
    let carrinho = carregarCarrinho(emailLimpo, true);

    const idNum = Number(id);
    if (isNaN(idNum)) {
      return res.status(400).json({ erro: "ID inválido" });
    }

    const novoCarrinho = carrinho.filter(p => Number(p.id) !== idNum);
    if (novoCarrinho.length === carrinho.length) {
      return res.status(404).json({ erro: "Produto não encontrado no carrinho" });
    }

    fs.writeFileSync(carrinhoPath, JSON.stringify(novoCarrinho, null, 2), "utf-8");
    res.status(200).json({ mensagem: "Produto removido do carrinho" });
  } catch (erro) {
    console.error("Erro ao remover produto:", erro);
    res.status(500).json({ erro: "Erro interno no servidor" });
  }
});




// Start
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Servidor rodando na porta ${PORT}`);
  console.log(`🧠 Servindo Front-end de: ${FRONTEND_DIR}`);
});
