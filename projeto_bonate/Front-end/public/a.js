  // Verifica se o usuário está logado
  function verificarLogin() {
    const isLoggedIn = localStorage.getItem('isLoggedIn'); // ou sessionStorage se preferir

    const cardPerfil = document.querySelector('.card');
    const btnLogin = document.querySelector('.botao-login'); // botão de login
    const imgPerfil = document.querySelector('.img-perfil img');
    const listElements = document.querySelectorAll('.list .element');

    // Se não estiver logado
    if (!isLoggedIn) {
      cardPerfil.style.display = 'block'; // esconde o card do perfil
      btnLogin.style.display = 'block';  // exibe o botão de login
      imgPerfil.src = 'assets/img/home/icones/perfil-cinza.png'; // imagem do perfil cinza
    } else {
      cardPerfil.style.display = 'block'; // exibe o card do perfil
      btnLogin.style.display = 'none';   // esconde o botão de login
      imgPerfil.src = 'assets/img/home/icones/perfil.png'; // imagem do perfil normal

      // Habilitar opções de menu
      listElements.forEach(item => {
        item.style.display = 'block';
      });
    }
  }

  // Chama a função de verificação assim que a página carregar
  window.onload = verificarLogin;

  function irParaDadosPessoais() {
    window.location.href = 'dados-pessoais.html'; // Altere para o caminho correto
  }

  // Função para o carrinho
  function irParaCarrinho() {
    window.location.href = 'carrinho.html'; // Altere para o caminho correto
  }

  // Função para "Excluir" (Exemplo)
  function excluirConta() {
    const isConfirmado = confirm('Tem certeza que deseja excluir sua conta?');
    if (isConfirmado) {
      // Adicione a lógica para excluir a conta aqui
      alert('Conta excluída com sucesso!');
    }
  }

  // Função para logout
  function sair() {
    localStorage.removeItem('isLoggedIn');  // Remove a informação do login
    alert('Você saiu com sucesso!');
    window.location.href = 'index.html'; // Redireciona para a página inicial
  }
  
  // Event listeners para os botões
  document.querySelector('.element .label:contains("Dados")').addEventListener('click', irParaDadosPessoais);
  document.querySelector('.element .label:contains("Carrinho")').addEventListener('click', irParaCarrinho);
  document.querySelector('.element .label:contains("Delete")').addEventListener('click', excluirConta);
  document.querySelector('.element .label:contains("Sair")').addEventListener('click', sair);