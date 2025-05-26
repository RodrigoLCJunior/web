import { UserService } from '../../../Services/user_service.js';

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');

  if (loginForm) {
    loginForm.addEventListener('submit', async (event) => {
      event.preventDefault();

      const email = document.getElementById('login-email').value.trim();
      const senha = document.getElementById('login-password').value.trim();

      const result = await UserService.login(email, senha);

      if (result.success) {
        alert('Login realizado com sucesso!');
        // Aqui você pode redirecionar para a página inicial, ou atualizar a UI:
        window.location.href = '/home.html'; // exemplo de redirecionamento
      } else {
        alert(`Erro no login: ${result.message}`);
      }
    });
  }
});
