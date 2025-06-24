

document.getElementById("btn-carrinho").addEventListener("click", () => {
  const ip = window.location.hostname; // Pega o IP da máquina
  window.location.href = `http://${ip}:5000/carrinho`; // Vai pra rota do Flask
});

document.getElementById('btn-carrinho').addEventListener('click', (e) => {
  e.preventDefault();
  const usuario = JSON.parse(localStorage.getItem('usuarioLogado'));

  if (!usuario) {
    window.location.href = '/form.html'; // tela de login
  } else {
    window.location.href = '/carrinho'; // rota do Flask
  }
});

const btnPerfil = document.getElementById('btn-perfil');
const containerPerfil = document.getElementById('conatiner-perfil');
const btnFecharPerfil = document.getElementById('btn-fechar-perfil');
const btnLoginCadastro = document.getElementById('btn-login-cadastro');
const btnDadosPessoais = document.getElementById('btn-dados-pessoais');
const btnCarrinho = document.getElementById('btn-carrinhoo');
const btnExcluirConta = document.getElementById('btn-excluir-conta');
const btnSair = document.getElementById('btn-sair');

function togglePerfil() {
  if (!containerPerfil) return;

  const isVisible = containerPerfil.style.display === 'block';
  const usuarioLogado = localStorage.getItem('usuarioLogado');

  if (isVisible) {
    containerPerfil.style.display = 'none';
  } else {
    containerPerfil.style.display = 'block';

    if (!usuarioLogado) {
      // Mostrar só Login/Cadastro
      btnLoginCadastro.style.display = 'flex';

      // Esconder os outros
      btnDadosPessoais.style.display = 'none';
      btnCarrinho.style.display = 'none';
      btnExcluirConta.style.display = 'none';
      btnSair.style.display = 'none';
    } else {
      // Mostrar todos menos Login/Cadastro
      btnLoginCadastro.style.display = 'none';

      btnDadosPessoais.style.display = 'flex';
      btnCarrinho.style.display = 'flex';
      btnExcluirConta.style.display = 'flex';
      btnSair.style.display = 'flex';
    }
  }
}

// Eventos de clique
btnPerfil.addEventListener('click', togglePerfil);
btnFecharPerfil.addEventListener('click', togglePerfil);

// Ações dos botões
btnLoginCadastro.addEventListener('click', () => {
  window.location.href = '/form.html'; // Login/Cadastro
});

btnDadosPessoais.addEventListener('click', () => {
  irParaDadosPessoais();
});

btnCarrinho.addEventListener('click', () => {
  irParaCarrinho();
});

btnExcluirConta.addEventListener('click', () => {
  excluirConta();
});

btnSair.addEventListener('click', () => {
  sair();
});

function sair() {
  // Remove as infos de usuário do localStorage
  localStorage.removeItem('usuarioLogado');
  localStorage.removeItem('isLoggedIn'); // Se você usa essa chave também

  // Fecha o card de perfil
  containerPerfil.style.display = 'none';

  // Força atualização da página pra atualizar estado e UI
  window.location.reload();
}

btnExcluirConta.addEventListener('click', async () => {
  const confirmacao = confirm('Tem certeza que deseja excluir sua conta? Essa ação é irreversível.');
  if (!confirmacao) return;

  const usuario = JSON.parse(localStorage.getItem('usuarioLogado'));

  if (!usuario || !usuario.email) {
    alert('⚠ Nenhum usuário logado para excluir.');
    return;
  }

  try {
    const resposta = await fetch('http://localhost:8080/excluir-conta', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email: usuario.email })
    });

    const resultado = await resposta.json();

    if (resposta.ok) {
      alert('✅ Conta excluída com sucesso.');
      localStorage.removeItem('usuarioLogado');
      localStorage.removeItem('isLoggedIn');
      window.location.href = '/'; // Redireciona para a página inicial
    } else {
      alert('❌ Erro ao excluir conta: ' + resultado.erro);
    }
  } catch (erro) {
    console.error('Erro ao excluir conta:', erro);
    alert('❌ Erro ao excluir conta. Tente novamente mais tarde.');
  }
});
