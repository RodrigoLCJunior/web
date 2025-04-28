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
        alert(`Bem-vindo(a), ${result.user.nome}!`);
        const loginModal = document.getElementById('login-modal');
        loginModal.style.display = 'none';

        // Opcional: redirecionar para área logada
        // window.location.href = '/pagina-logada.html';
      } else {
        alert(`Erro no login: ${result.message}`);
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
        alert('Cadastro realizado com sucesso! Agora você pode fazer login.');
        const registerModal = document.getElementById('register-modal');
        registerModal.style.display = 'none';
        openLoginModal();
      } else {
        alert(`Erro no cadastro: ${result.message}`);
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
document.getElementById('gerenciar-conta-btn')?.addEventListener('click', (e) => {
  e.preventDefault();
  window.location.href = '../../GerenciarConta/HTML/GerenciarConta.html';
});

document.getElementById('perfil-link')?.addEventListener('click', (e) => {
  e.preventDefault();
  window.location.href = '../../GerenciarConta/HTML/GerenciarConta.html';
});
