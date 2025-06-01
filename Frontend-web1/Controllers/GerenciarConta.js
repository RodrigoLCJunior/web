import { UserService } from '../Services/user_service.js';

const baseUrl = "https://mob-backend-3-combate-inteiro.onrender.com/api/usuarios";

document.addEventListener('DOMContentLoaded', () => {
  carregarUsuario();
  configurarEventos();
});

async function carregarUsuario() {
  const usuario = UserService.getCurrentUser();

  if (!usuario) {
    showToast('Você precisa estar logado para acessar esta página.', 'warning');
    setTimeout(() => {
      window.location.href = '../Views/LandingPage/HTML/LandingPage.html';
    }, 2000);
    return;
  }

  document.getElementById('user-name').textContent = usuario.nome;
  document.getElementById('user-email').textContent = usuario.email;
  
}

function configurarEventos() {
  document.getElementById('logout-btn')?.addEventListener('click', logout);
  document.getElementById('delete-account-btn')?.addEventListener('click', confirmarExclusaoConta);
  document.getElementById('edit-account-btn')?.addEventListener('click', abrirModalEditarConta);
  document.getElementById('main-logout-btn')?.addEventListener('click', logout);
}

function logout() {
  UserService.logout();
  showToast('Logout realizado com sucesso!', 'success');
  setTimeout(() => {
    window.location.href = '../../../Views/LandingPage/HTML/LandingPage.html';
  }, 2000);
}

async function abrirModalEditarConta() {
  const usuario = UserService.getCurrentUser();
  if (!usuario) return logout();

  const response = await fetch('../Components/alterar_tudo.html');
  const html = await response.text();
  document.getElementById('modal-container').innerHTML = html;

  const modal = document.getElementById('edit-account-modal');
  const closeBtn = document.getElementById('close-edit-account');
  const form = document.getElementById('edit-account-form');

  const inputNome = document.getElementById('edit-nome');
  const inputEmail = document.getElementById('edit-email');
  const inputSenha = document.getElementById('edit-senha');

  inputNome.value = usuario.nome;
  inputEmail.value = usuario.email;

  modal.style.display = 'flex';

  closeBtn.onclick = () => modal.style.display = 'none';
  window.onclick = (e) => { if (e.target === modal) modal.style.display = 'none'; };

  form.onsubmit = async (e) => {
    e.preventDefault();

    const novoNome = inputNome.value.trim();
    const novoEmail = inputEmail.value.trim();
    const novaSenha = inputSenha.value.trim();

    if (novoNome.length < 3) {
      showToast('Nome deve ter pelo menos 3 caracteres.', 'warning');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(novoEmail)) {
      showToast('Digite um email válido.', 'warning');
      return;
    }

    if (novaSenha.length < 6) {
      showToast('Senha deve ter pelo menos 6 caracteres.', 'warning');
      return;
    }

    const payload = {
      nome: novoNome,
      email: novoEmail,
      senha: novaSenha
    };

    const success = await atualizarUsuario(usuario.id, payload);

    if (success) {
      usuario.nome = novoNome;
      usuario.email = novoEmail;
      localStorage.setItem('user', JSON.stringify(usuario));
      modal.style.display = 'none';
      location.reload();
    }
  };
}

async function atualizarUsuario(userId, payload) {
  try {
    const response = await fetch(`${baseUrl}/${userId}/alterar`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      const updatedUser = await response.json();
      localStorage.setItem('user', JSON.stringify(updatedUser));
      showToast('Alteração feita com sucesso!', 'success');
      return true;
    } else {
      const error = await response.json();
      showToast(error.message || 'Erro ao atualizar dados.', 'error');
      return false;
    }
  } catch (err) {
    console.error(err);
    showToast('Erro ao conectar no servidor.', 'error');
    return false;
  }
}

function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.textContent = message;
  toast.style.position = 'fixed';
  toast.style.bottom = '30px';
  toast.style.left = '50%';
  toast.style.transform = 'translateX(-50%)';
  toast.style.color = '#fff';
  toast.style.padding = '12px 24px';
  toast.style.borderRadius = '8px';
  toast.style.boxShadow = '0 2px 10px rgba(0,0,0,0.3)';
  toast.style.zIndex = '10000';
  toast.style.opacity = '0';
  toast.style.transition = 'opacity 0.5s';
  toast.style.maxWidth = '80%';
  toast.style.textAlign = 'center';

  switch (type) {
    case 'success':
      toast.style.backgroundColor = '#4caf50';
      break;
    case 'error':
      toast.style.backgroundColor = '#f44336';
      break;
    case 'info':
      toast.style.backgroundColor = '#2196f3';
      break;
    case 'warning':
      toast.style.backgroundColor = '#ff9800';
      break;
    default:
      toast.style.backgroundColor = '#333';
  }

  document.body.appendChild(toast);

  setTimeout(() => { toast.style.opacity = '1'; }, 100);

  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => document.body.removeChild(toast), 500);
  }, 3000);
}

function confirmarExclusaoConta() {
  // Aqui continua a lógica que você já tiver para excluir a conta.
}
