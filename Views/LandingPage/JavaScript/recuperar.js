document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('forgot-password-form');
  const closeBtn = document.getElementById('close-forgot-modal');

  // Redireciona ao fechar o modal
  closeBtn.addEventListener('click', () => {
    window.location.href = '../../LandingPage/HTML/landingpage.html';
  });

  // Verifica se o e-mail existe no backend
  async function verificarEmailExiste(email) {
    try {
      const response = await fetch(`https://mob-backend-3-combate-inteiro.onrender.com/api/usuarios/email?email=${encodeURIComponent(email)}`);
      const data = await response.json();
      return data.success === true;
    } catch (err) {
      console.error("Erro ao verificar e-mail:", err);
      return false;
    }
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const email = document.getElementById('recovery-email').value;

    // Verifica se o e-mail existe
    const emailExiste = await verificarEmailExiste(email);

    if (!emailExiste) {
      alert("Este e-mail não está cadastrado.");
      return;
    }

    // Envia requisição de recuperação
    try {
      const response = await fetch(`https://mob-backend-3-combate-inteiro.onrender.com/api/usuarios/esqueci-senha?email=${encodeURIComponent(email)}`, {
        method: 'POST',
      });

      if (response.ok) {
        alert('E-mail de recuperação enviado. Verifique sua caixa de entrada.');
        form.reset();
      } else {
        const error = await response.text();
        alert('Erro ao enviar e-mail: ' + error);
      }
    } catch (err) {
      alert('Erro de conexão com o servidor.');
      console.error(err);
    }
  });
});
