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
  }

  document.getElementById('user-name').textContent = usuario.nome;
  document.getElementById('user-email').textContent = usuario.email;
  document.getElementById('user-avatar').textContent = usuario.avatar.hp;
 
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
  showToast('Logout realizado com sucesso!', 'success');
  setTimeout(() => {
    window.location.href = '../../../Views/LandingPage/HTML/LandingPage.html';
  }, 2000);
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
    const title = document.getElementById('edit-modal-title');
  
    const label = campo === 'nome' ? 'Nome' : 'Email';
    input.type = campo === 'email' ? 'email' : 'text';
    input.value = campo === 'nome' ? usuario.nome : usuario.email;
    title.textContent = `Editar ${label}`;
  
    modal.style.display = 'flex';
  
    closeBtn.onclick = () => modal.style.display = 'none';
    window.onclick = (e) => { if (e.target === modal) modal.style.display = 'none'; };
  
    form.onsubmit = async (e) => {
      e.preventDefault();
  
      const novoValor = input.value.trim();
  
      if (campo === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(novoValor)) {
        showToast('Digite um email válido.', 'warning');
        return;
      }
  
      if (novoValor.length < 3) {
        showToast(`${label} deve ter pelo menos 3 caracteres.`, 'warning');
        return;
      }
  
      // 👉 Agora aqui chama o modal de senha
      await pedirSenhaParaAtualizar(usuario, campo, novoValor);
  
      modal.style.display = 'none'; // Fechar o modal principal depois
    };
  }

async function pedirSenhaParaAtualizar(usuario, campo, novoValor) {
  const response = await fetch('../Components/confirmar_senha_modal.html');
  const html = await response.text();
  document.getElementById('modal-container').innerHTML = html;

  const modal = document.getElementById('confirm-password-modal');
  const closeBtn = document.getElementById('close-confirm-password');
  const form = document.getElementById('confirm-password-form');
  const inputSenha = document.getElementById('confirm-password-input');

  modal.style.display = 'flex';

  closeBtn.onclick = () => modal.style.display = 'none';
  window.onclick = (e) => { if (e.target === modal) modal.style.display = 'none'; };

  form.onsubmit = async (e) => {
    e.preventDefault();
    const senhaAtualDigitada = inputSenha.value.trim();

    if (!senhaAtualDigitada) {
      showToast('Digite sua senha atual.', 'warning');
      return;
    }

    // Validar a senha
    const senhaOk = await validarSenhaAtual(usuario.email, senhaAtualDigitada);

    if (!senhaOk) {
      showToast('Senha incorreta.', 'error');
      return;
    }

    const payload = {
      nome: campo === 'nome' ? novoValor : usuario.nome,
      email: campo === 'email' ? novoValor : usuario.email,
      senha: senhaAtualDigitada,
    };

    const success = await atualizarUsuario(usuario.id, payload);

    if (success) {
      // Atualiza localStorage
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
      showToast('Preencha todos os campos.', 'warning');
      return;
    }
  
    if (novaSenha.length < 8) {
      showToast('A nova senha deve ter pelo menos 8 caracteres.', 'warning');
      return;
    }
  
    if (novaSenha !== confirmarNovaSenha) {
      showToast('As novas senhas não coincidem.', 'warning');
      return;
    }
  
    const validacao = await validarSenhaAtual(usuario.email, senhaAtual);
  
    if (!validacao) {
      showToast('Senha incorreta.', 'error');
      return; // 🔥 ESSA LINHA É FUNDAMENTAL
    }
  
    const payload = {
      nome: usuario.nome,
      email: usuario.email,
      senha: novaSenha,
    };
  
    const success = await atualizarUsuario(usuario.id, payload);
  
    if (success) {
      showToast('Senha alterada com sucesso!', 'success');
      setTimeout(() => {
        modal.style.display = 'none';
        logout(); // ⚡ importante: fazer logout após alteração de senha
      }, 2000);
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
      showToast('Alteração feita com sucesso!', 'success');
      setTimeout(() => {
        return true;
      }, 2000);  // <- Retorna sucesso
    } else {
      const error = await response.json();
      showToast(error.message || 'Erro ao atualizar dados.', 'error');
      return false; // <- Retorna falha
    }
  } catch (err) {
    console.error(err);
    showToast('Erro ao conectar no servidor.', 'error');
    setTimeout(() => {
      return false;
    }, 2000); 
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
        showToast('Conta excluída com sucesso.', 'success');
        localStorage.removeItem('user');
        setTimeout(() => {
          window.location.href = '../../../Views/LandingPage/HTML/LandingPage.html';
        }, 2000);
      } else {
        const error = await response.json();
        showToast(error.message || 'Erro ao excluir conta.', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Erro ao conectar no servidor.', 'error');
    } finally {
      modal.style.display = 'none';
    }
  };
}

function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.textContent = message;
  toast.style.position = 'fixed';
  toast.style.bottom = '30px'; // <-- coloca 30px do fundo
  toast.style.left = '50%';
  toast.style.transform = 'translateX(-50%)'; // <-- só mexe no X, não no Y mais
  toast.style.color = '#fff';
  toast.style.padding = '12px 24px';
  toast.style.borderRadius = '8px';
  toast.style.boxShadow = '0 2px 10px rgba(0,0,0,0.3)';
  toast.style.zIndex = '10000';
  toast.style.opacity = '0';
  toast.style.transition = 'opacity 0.5s';
  toast.style.maxWidth = '80%';
  toast.style.textAlign = 'center';

  // Definindo cor baseado no tipo
  switch (type) {
    case 'success':
      toast.style.backgroundColor = '#4caf50'; // Verde
      break;
    case 'error':
      toast.style.backgroundColor = '#f44336'; // Vermelho
      break;
    case 'info':
      toast.style.backgroundColor = '#2196f3'; // Azul
      break;
    case 'warning':
      toast.style.backgroundColor = '#ff9800'; // Laranja
      break;
    default:
      toast.style.backgroundColor = '#333'; // Cinza
  }

  document.body.appendChild(toast);

  // animação de aparecer
  setTimeout(() => {
    toast.style.opacity = '1';
  }, 100);

  // sumir depois de 3 segundos
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => document.body.removeChild(toast), 500);
  }, 3000);
}