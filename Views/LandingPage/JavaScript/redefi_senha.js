// Aguarda o carregamento completo do DOM antes de executar qualquer código
document.addEventListener('DOMContentLoaded', () => {
  
  // Seleciona o formulário de redefinição de senha pelo ID
  const form = document.getElementById('reset-form');

  // Adiciona um listener para o evento de envio do formulário
  form.addEventListener('submit', async (event) => {
    
    // Impede o comportamento padrão do formulário (recarregar a página)
    event.preventDefault();

    // Obtém o valor digitado no campo "nova senha"
    const novaSenha = document.getElementById('nova-senha').value;

    // Obtém o valor digitado no campo "confirmar senha"
    const confirmarSenha = document.getElementById('confirmar-senha').value;

    // Verifica se os valores das duas senhas são iguais
    if (novaSenha !== confirmarSenha) {
      // Se forem diferentes, exibe um alerta e interrompe a execução
      alert('As senhas não coincidem.');
      return;
    }

    // Cria um objeto para manipular os parâmetros da URL (ex: ?token=abc123)
    const params = new URLSearchParams(window.location.search);

    // Obtém o valor do parâmetro "token" da URL
    const token = params.get('token');

    // Se não houver token na URL, exibe alerta e para a execução
    if (!token) {
      alert('Token inválido ou ausente.');
      return;
    }

    try {
      // Envia uma requisição POST para o backend com o token e a nova senha
      const response = await fetch('https://mob-backend-3-combate-inteiro.onrender.com/api/usuarios', {
        method: 'POST', // Método HTTP
        headers: {
          'Content-Type': 'application/json', // Define o tipo de conteúdo como JSON
        },
        // Envia o token e a nova senha no corpo da requisição em formato JSON
        body: JSON.stringify({ token, novaSenha }),
      });

      // Se a resposta do servidor for bem-sucedida (status 200 OK)
      if (response.ok) {
        // Exibe alerta de sucesso e redireciona para a landing page
        alert('Senha redefinida com sucesso!');
        window.location.href = '/Views/LandingPage/HTML/landingpage.html';
      } else {
        // Se houver erro, obtém o texto da resposta e exibe em um alerta
        const erro = await response.text();
        alert('Erro ao redefinir senha: ' + erro);
      }
    } catch (err) {
      // Caso ocorra erro de rede ou servidor, exibe alerta e loga o erro no console
      alert('Erro ao conectar com o servidor.');
      console.error(err);
    }
  });
});
