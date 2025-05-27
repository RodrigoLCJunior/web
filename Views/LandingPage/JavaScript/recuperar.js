// Espera o carregamento completo do DOM antes de executar o código
document.addEventListener('DOMContentLoaded', () => {

  // Pega o formulário de recuperação de senha pelo ID
  const form = document.getElementById('forgot-password-form');

  // Pega o botão de fechar o modal pelo ID
  const closeBtn = document.getElementById('close-forgot-modal');

  // Adiciona um evento de clique ao botão de fechar
  // Quando clicado, redireciona o usuário de volta para a página inicial (landing page)
  closeBtn.addEventListener('click', () => {
    window.location.href = '/Views/LandingPage/HTML/landingpage.html';
  });

  // Define uma função assíncrona para verificar se o e-mail existe no backend
  async function verificarEmailExiste(email) {
    try {
      // Faz uma requisição GET para a API corretamente formatada com parâmetro ?email=
      const response = await fetch(`https://mob-backend-3-combate-inteiro.onrender.com/api/usuarios/email?email=${encodeURIComponent(email)}`);

      // Converte a resposta da API para objeto JSON
      const data = await response.json();

      // Retorna true se a resposta indicar sucesso (usuário encontrado)
      return data.success === true;
    } catch (err) {
      // Em caso de erro de rede ou falha, exibe erro no console e retorna false
      console.error("Erro ao verificar e-mail:", err);
      return false;
    }
  }

  // Adiciona um ouvinte de evento para envio do formulário
  form.addEventListener('submit', async (event) => {
    // Previne o envio tradicional do formulário (evita recarregar a página)
    event.preventDefault();

    // Obtém o valor do campo de e-mail preenchido pelo usuário
    const email = document.getElementById('recovery-email').value;

    // Verifica se o e-mail existe no backend usando a função criada
    const emailExiste = await verificarEmailExiste(email);

    // Se o e-mail não for encontrado, mostra alerta e cancela o processo
    if (!emailExiste) {
      alert("Este e-mail não está cadastrado.");
      return;
    }

    // Se o e-mail for válido, envia uma requisição POST para a API de recuperação de senha
    try {
      const response = await fetch(`https://mob-backend-3-combate-inteiro.onrender.com/api/usuarios/esqueci-senha?email=${encodeURIComponent(email)}`, {
        method: 'POST', // Define o método HTTP como POST
      });

      // Se a requisição for bem-sucedida (status HTTP 200), avisa o usuário e limpa o formulário
      if (response.ok) {
        alert('E-mail de recuperação enviado. Verifique sua caixa de entrada.');
        form.reset(); // Limpa os campos do formulário
      } else {
        // Se o servidor responder com erro, exibe a mensagem retornada
        const error = await response.text();
        alert('Erro ao enviar e-mail: ' + error);
      }
    } catch (err) {
      // Em caso de falha de conexão ou erro inesperado, exibe alerta e loga erro no console
      alert('Erro de conexão com o servidor.');
      console.error(err);
    }
  });
});
