// Importação
import { UserService } from '../../../Services/user_service.js';

// Referências fixas da página
const hamburger = document.getElementById('hamburger');
const menu = document.getElementById('dropdown-menu');
const soundToggle = document.getElementById('sound-toggle');
const bgMusic = document.getElementById('bg-music');
const loginLink = document.getElementById('login-link');
const registerLink = document.getElementById('register-link');
const modalContainer = document.getElementById('modal-container');

document.addEventListener('DOMContentLoaded', () => {
  ajustarMenuBaseadoNoLogin();
});

function ajustarMenuBaseadoNoLogin() {
  const usuario = UserService.getCurrentUser();

  if (usuario) {
    // Se está logado, esconde os botões de login e cadastro
    loginLink.style.display = 'none';
    registerLink.style.display = 'none';
  } else {
    // Se não está logado, mostra login e cadastro
    loginLink.style.display = 'block';
    registerLink.style.display = 'block';
  }
}


// 👉 Função para configurar o submit do formulário de login
function attachLoginFormSubmit() {
  const loginForm = document.getElementById('login-form');

  if (loginForm) {
    loginForm.addEventListener('submit', async (event) => {
      event.preventDefault();

      const email = document.getElementById('email').value.trim();
      const senha = document.getElementById('password').value.trim();

      if (!email || !senha) {
        alert('Preencha todos os campos.');
        return;
      }

      const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      if (!emailValid) {
        alert('Digite um email válido.');
        return;
      }

      const result = await UserService.login(email, senha);

      if (result.success) {
        showToast('Login realizado com sucesso!', 'success');
        setTimeout(() => {
          window.location.href = '../HTML/LandingPage.html'; // ou a página que quiser
        }, 2000);
        // Opcional: redirecionar para área logada
        // window.location.href = '/pagina-logada.html';
      } else {
        alert(`Erro no login: ${result.message}`, 'error');
      }
    });
  }
}

// 👉 Função para anexar evento de submit no formulário de cadastro
function attachRegisterFormSubmit() {
  const registerForm = document.getElementById('register-form');

  if (registerForm) {
    registerForm.addEventListener('submit', async (event) => {
      event.preventDefault();

      const nome = document.getElementById('register-name').value.trim();
      const email = document.getElementById('register-email').value.trim();
      const senha = document.getElementById('register-password').value.trim();
      const confirmarSenha = document.getElementById('confirm-password').value.trim();

      if (senha !== confirmarSenha) {
        alert('As senhas não coincidem!');
        return;
      }

      const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      if (!emailValid) {
        alert('Digite um email válido.');
        return;
      }

      const result = await UserService.register(nome, email, senha);

      if (result.success) {
        showToast('Cadastro realizado com sucesso! Agora você pode fazer login', 'success');
      
        // Fecha o modal de cadastro depois de um pequeno delay
        setTimeout(() => {
          const registerModal = document.getElementById('register-modal');
          registerModal.style.display = 'none';
          openLoginModal(); // Abre o modal de login
        }, 2000);
      
      } else {
        showToast(`Erro no cadastro: ${result.message}`, 'error');
      }
      
    });
  }
}

// 👉 Função para abrir o modal de login
function openLoginModal() {
  fetch('../Components/login_modal.html')
    .then(response => response.text())
    .then(html => {
      modalContainer.innerHTML = html;

      attachLoginFormSubmit(); // <-- conecta o submit de login aqui também!

      const loginModal = document.getElementById('login-modal');
      const closeModal = document.getElementById('close-modal');
      const togglePassword = document.getElementById('toggle-password');
      const passwordInput = document.getElementById('password');
      const registerBtn = document.querySelector('.register-btn');

      loginModal.style.display = 'flex';

      closeModal.addEventListener('click', () => {
        loginModal.style.display = 'none';
      });

      window.addEventListener('click', (e) => {
        if (e.target === loginModal) {
          loginModal.style.display = 'none';
        }
      });

      togglePassword.addEventListener('click', () => {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
      });

      registerBtn.addEventListener('click', () => {
        loginModal.style.display = 'none';
        openRegisterModal();
      });
    });
}


// 👉 Função para abrir o modal de cadastro
function openRegisterModal() {
  fetch('../Components/register_modal.html')
    .then(response => response.text())
    .then(html => {
      modalContainer.innerHTML = html;

      attachRegisterFormSubmit(); // 👉 agora conecta o form após carregar o HTML

      const registerModal = document.getElementById('register-modal');
      const closeRegister = document.getElementById('close-register');

      const password = document.getElementById('register-password');
      const confirmPassword = document.getElementById('confirm-password');
      const toggle1 = document.getElementById('toggle-register-password');
      const toggle2 = document.getElementById('toggle-confirm-password');
      const backToLoginBtn = document.querySelector('.back-to-login-btn');

      registerModal.style.display = 'flex';

      closeRegister.addEventListener('click', () => {
        registerModal.style.display = 'none';
      });

      window.addEventListener('click', (e) => {
        if (e.target === registerModal) {
          registerModal.style.display = 'none';
        }
      });

      // Mostrar/ocultar senha
      toggle1.addEventListener('click', () => {
        const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
        password.setAttribute('type', type);
      });

      toggle2.addEventListener('click', () => {
        const type = confirmPassword.getAttribute('type') === 'password' ? 'text' : 'password';
        confirmPassword.setAttribute('type', type);
      });

      backToLoginBtn.addEventListener('click', () => {
        registerModal.style.display = 'none';
        openLoginModal();
      });
    });
}

// 👉 Ações do menu
hamburger.addEventListener('click', () => {
  menu.classList.toggle('show');
});

document.addEventListener('click', function (e) {
  if (!hamburger.contains(e.target) && !menu.contains(e.target)) {
    menu.classList.remove('show');
  }
});

// 👉 Switch de som
soundToggle.addEventListener('change', function () {
  if (soundToggle.checked) {
    bgMusic.volume = 0.03;
    bgMusic.play();
  } else {
    bgMusic.pause();
  }
});

// 👉 Clique no botão "Fazer Login"
loginLink.addEventListener('click', (e) => {
  e.preventDefault();
  openLoginModal();
});

// 👉 Clique no botão "Cadastrar-se"
registerLink.addEventListener('click', (e) => {
  e.preventDefault();
  menu.classList.remove('show');
  openRegisterModal();
});

// 👉 Redirecionamento para página de Gerenciar Conta
function acessarGerenciarConta(e) {
  e.preventDefault();

  const usuario = UserService.getCurrentUser();
  
  if (usuario) {
    window.location.href = '../../GerenciarConta/HTML/GerenciarConta.html';
  } else {
    showToast('Você precisa estar logado para acessar esta página.', 'warning');
  }
}

function acessarPerfil(e) {
  e.preventDefault();

  const usuario = UserService.getCurrentUser();
  
  if (usuario) {
    window.location.href = '../../GerenciarConta/HTML/Perfil.html';
  } else {
    showToast('Você precisa estar logado para acessar esta página.', 'warning');
  }
}	

document.getElementById('gerenciar-conta-btn')?.addEventListener('click', acessarGerenciarConta);
document.getElementById('perfil-link')?.addEventListener('click', acessarPerfil);


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



