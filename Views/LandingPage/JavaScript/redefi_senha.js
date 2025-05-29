document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('reset-form');

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const novaSenha = document.getElementById('nova-senha').value;
    const confirmarSenha = document.getElementById('confirmar-senha').value;

    if (novaSenha !== confirmarSenha) {
      alert('As senhas não coincidem.');
      return;
    }

    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    if (!token) {
      alert('Token inválido ou ausente.');
      return;
    }

    try {
      const response = await fetch('https://mob-backend-3-combate-inteiro.onrender.com/api/usuarios/redefinir-senha', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, novaSenha }),
      });

      if (response.ok) {
        alert('Senha redefinida com sucesso!');
        window.location.href = '../../LandingPage/HTML/landingpage.html';
      } else {
        const erro = await response.text();
        alert('Erro ao redefinir senha: ' + erro);
      }
    } catch (err) {
      alert('Erro ao conectar com o servidor.');
      console.error(err);
    }
  });
});
