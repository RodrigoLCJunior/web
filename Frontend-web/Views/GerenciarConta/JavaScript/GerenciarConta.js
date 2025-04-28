import { UserService } from '../../../Services/user_service.js';

const baseUrl = "https://mob-backend-ah3e.onrender.com";

document.addEventListener('DOMContentLoaded', () => {
  carregarUsuario();
  configurarEventos();
});

async function carregarUsuario() {
  const usuario = UserService.getCurrentUser();

  if (!usuario) {
    alert('Você precisa estar logado para acessar esta página.');
    window.location.href = '../../LandingPage/HTML/LandingPage.html';
    return;
  }

  document.getElementById('user-name').textContent = usuario.nome;
  document.getElementById('user-email').textContent = usuario.email;
}

function configurarEventos() {
  document.getElementById('logout-btn')?.addEventListener('click', logout);
  document.getElementById('delete-account-btn')?.addEventListener('click', confirmarExclusaoConta);
  document.getElementById('edit-name-btn')?.addEventListener('click', () => editarCampo('nome'));
  document.getElementById('edit-email-btn')?.addEventListener('click', () => editarCampo('email'));
  document.getElementById('change-password-btn')?.addEventListener('click', openChangePasswordModal);
}

function logout() {
  UserService.logout();
  alert('Logout realizado com sucesso!');
  window.location.href = '../../LandingPage/HTML/LandingPage.html';
}

async function editarCampo(campo) {
  const usuario = UserService.getCurrentUser();
  if (!usuario) return logout();

  const response = await fetch('../Components/alterar_nomeEmail.html');
  const html = await response.text();
  document.getElementById('modal-container').innerHTML = html;

  const modal = document.getElementById('edit-field-modal');
  const closeBtn = document.getElementById('close-edit-field');
  const form = document.getElementById('edit-field-form');
  const input = document.getElementById('edit-field-input');
  const passwordInput = document.getElementById('confirm-current-password'); // campo já existente
  const togglePassword = document.getElementById('toggle-confirm-current-password'); // ícone do olhinho
  const title = document.getElementById('edit-modal-title');

  const label = campo === 'nome' ? 'Nome' : 'Email';
  input.type = campo === 'email' ? 'email' : 'text';
  input.value = campo === 'nome' ? usuario.nome : usuario.email;
  title.textContent = `Editar ${label}`;

  modal.style.display = 'flex';

  closeBtn.onclick = () => modal.style.display = 'none';
  window.onclick = (e) => { if (e.target === modal) modal.style.display = 'none'; };

  // 👉 Função do olhinho no campo de senha
  togglePassword.addEventListener('click', () => {
    passwordInput.type = passwordInput.type === 'password' ? 'text' : 'password';
  });

  form.onsubmit = async (e) => {
    e.preventDefault();

    const novoValor = input.value.trim();
    const senhaAtual = passwordInput.value.trim();

    if (!senhaAtual) {
      alert('Digite sua senha atual.');
      return;
    }

    if (campo === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(novoValor)) {
      alert('Digite um email válido.');
      return;
    }

    if (novoValor.length < 3) {
      alert(`${label} deve ter pelo menos 3 caracteres.`);
      return;
    }

    const payload = {
      nome: campo === 'nome' ? novoValor : usuario.nome,
      email: campo === 'email' ? novoValor : usuario.email,
      senha: senhaAtual,
    };

    const success = await atualizarUsuario(usuario.id, payload);

    if (success) {
      if (campo === 'nome') usuario.nome = novoValor;
      if (campo === 'email') usuario.email = novoValor;

      localStorage.setItem('user', JSON.stringify(usuario));

      modal.style.display = 'none';
      location.reload();
    }
  };
}


export async function openChangePasswordModal() {
  const usuario = UserService.getCurrentUser();
  if (!usuario) return logout();

  const response = await fetch('../Components/alterar_senha.html');
  const html = await response.text();
  document.getElementById('modal-container').innerHTML = html;

  const modal = document.getElementById('change-password-modal');
  const closeBtn = document.getElementById('close-change-password');
  const form = document.getElementById('change-password-form');

  const toggleCurrent = document.getElementById('toggle-current-password');
  const toggleNew = document.getElementById('toggle-new-password');
  const toggleConfirm = document.getElementById('toggle-confirm-password');

  const inputCurrent = document.getElementById('current-password');
  const inputNew = document.getElementById('new-password');
  const inputConfirm = document.getElementById('confirm-new-password');

  modal.style.display = 'flex';

  closeBtn.onclick = () => modal.style.display = 'none';
  window.onclick = (e) => { if (e.target === modal) modal.style.display = 'none'; };

  // Mostrar/ocultar senha - 👁️
  toggleCurrent.addEventListener('click', () => {
    inputCurrent.type = inputCurrent.type === 'password' ? 'text' : 'password';
  });

  toggleNew.addEventListener('click', () => {
    inputNew.type = inputNew.type === 'password' ? 'text' : 'password';
  });

  toggleConfirm.addEventListener('click', () => {
    inputConfirm.type = inputConfirm.type === 'password' ? 'text' : 'password';
  });

  form.onsubmit = async (e) => {
    e.preventDefault();

    const senhaAtual = inputCurrent.value.trim();
    const novaSenha = inputNew.value.trim();
    const confirmarNovaSenha = inputConfirm.value.trim();

    if (!senhaAtual || !novaSenha || !confirmarNovaSenha) {
      alert('Preencha todos os campos.');
      return;
    }

    if (novaSenha.length < 8) {
      alert('A nova senha deve ter pelo menos 8 caracteres.');
      return;
    }

    if (novaSenha !== confirmarNovaSenha) {
      alert('As novas senhas não coincidem.');
      return;
    }

    const validacao = await validarSenhaAtual(usuario.email, senhaAtual);

    if (!validacao) {
      alert('Senha atual incorreta.');
      return;
    }

    const payload = {
      nome: usuario.nome,
      email: usuario.email,
      senha: novaSenha,
    };

    const success = await atualizarUsuario(usuario.id, payload);

    if (success) {
      alert('Senha alterada com sucesso!');
      modal.style.display = 'none';
      logout(); // Faz logout para forçar login de novo, por segurança
    }
  };
}

async function atualizarUsuario(userId, payload) {
  try {
    const response = await fetch(`${baseUrl}/api/usuarios/${userId}/alterar`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      const updatedUser = await response.json();
      localStorage.setItem('user', JSON.stringify(updatedUser));
      alert('Alteração feita com sucesso!');
      return true;  // <- Retorna sucesso
    } else {
      const error = await response.json();
      alert(error.message || 'Erro ao atualizar dados.');
      return false; // <- Retorna falha
    }
  } catch (err) {
    console.error(err);
    alert('Erro ao conectar no servidor.');
    return false;
  }
}

async function validarSenhaAtual(email, senha) {
  try {
    const response = await fetch(`${baseUrl}/api/usuarios/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, senha }),
    });

    if (response.ok) {
      return true; // senha correta
    } else {
      return false; // senha incorreta
    }
  } catch (error) {
    console.error('Erro ao validar senha atual:', error);
    return false;
  }
}

async function confirmarExclusaoConta() {
  const response = await fetch('../Components/confirm_delete_modal.html');
  const html = await response.text();
  document.getElementById('modal-container').innerHTML = html;

  const modal = document.getElementById('confirm-delete-modal');
  const closeBtn = document.getElementById('close-confirm-delete');
  const confirmBtn = document.getElementById('confirm-delete-btn');
  const cancelBtn = document.getElementById('cancel-delete-btn');

  modal.style.display = 'flex';

  closeBtn.onclick = cancelBtn.onclick = () => modal.style.display = 'none';
  window.onclick = (e) => { if (e.target === modal) modal.style.display = 'none'; };

  confirmBtn.onclick = async () => {
    const usuario = UserService.getCurrentUser();
    if (!usuario) return logout();

    try {
      const response = await fetch(`${baseUrl}/api/usuarios/${usuario.id}/deletar`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('Conta excluída com sucesso.');
        localStorage.removeItem('user');
        window.location.href = '../../LandingPage/HTML/LandingPage.html';
      } else {
        const error = await response.json();
        alert(error.message || 'Erro ao excluir conta.');
      }
    } catch (err) {
      console.error(err);
      alert('Erro ao conectar no servidor.');
    } finally {
      modal.style.display = 'none';
    }
  };
}
