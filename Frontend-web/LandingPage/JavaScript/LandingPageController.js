// Abrir/fechar menu hambúrguer
const hamburger = document.getElementById('hamburger');
const menu = document.getElementById('dropdown-menu');

hamburger.addEventListener('click', () => {
  menu.classList.toggle('show');
});

document.addEventListener('click', function (e) {
  if (!hamburger.contains(e.target) && !menu.contains(e.target)) {
    menu.classList.remove('show');
  }
});

// Switch de som (música ambiente)
const soundToggle = document.getElementById('sound-toggle');
const bgMusic = document.getElementById('bg-music');

soundToggle.addEventListener('change', function () {
  if (soundToggle.checked) {
    bgMusic.volume = 0.03; // volume moderado
    bgMusic.play();
  } else {
    bgMusic.pause();
  }
});

// Referência ao botão de login no menu
const loginLink = document.getElementById('login-link');
const registerLink = document.getElementById('register-link');
const modalContainer = document.getElementById('modal-container');

// 👉 Função para abrir o modal de login
function openLoginModal() {
  fetch('../Components/login_modal.html')
    .then(response => response.text())
    .then(html => {
      modalContainer.innerHTML = html;

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
        togglePassword.textContent = type === 'password' ? '👁️' : '🙈';
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

      const registerModal = document.getElementById('register-modal');
      const closeRegister = document.getElementById('close-register');

      const form = registerModal.querySelector('form');
      const email = document.getElementById('register-email');
      const password = document.getElementById('register-password');
      const confirmPassword = document.getElementById('confirm-password');

      const toggle1 = document.getElementById('toggle-register-password');
      const toggle2 = document.getElementById('toggle-confirm-password');

      const backToLoginBtn = document.querySelector('.back-to-login-btn'); // <- mover para cá ✅

      registerModal.style.display = 'flex';

      closeRegister.addEventListener('click', () => {
        registerModal.style.display = 'none';
      });

      window.addEventListener('click', (e) => {
        if (e.target === registerModal) {
          registerModal.style.display = 'none';
        }
      });

      // Mostrar/ocultar senha 1
      toggle1.addEventListener('click', () => {
        const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
        password.setAttribute('type', type);
      });

      // Mostrar/ocultar senha 2
      toggle2.addEventListener('click', () => {
        const type = confirmPassword.getAttribute('type') === 'password' ? 'text' : 'password';
        confirmPassword.setAttribute('type', type);
      });

      // 👉 Botão "Voltar ao login"
      backToLoginBtn.addEventListener('click', () => {
        registerModal.style.display = 'none';
        openLoginModal();
      });

      // Validação de email e senhas
      form.addEventListener('submit', (e) => {
        e.preventDefault();

        const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value);
        if (!emailValid) {
          alert("Digite um email válido.");
          return;
        }

        if (password.value !== confirmPassword.value) {
          alert("As senhas não coincidem.");
          return;
        }

        alert("Conta cadastrada com sucesso!");
        registerModal.style.display = 'none';
        openLoginModal();
      });
    });
}

// Clique no botão "Fazer Login"(hamburguer)
loginLink.addEventListener('click', (e) => {
  e.preventDefault();
  openLoginModal();
});

// Clique no botão "Cadastrar-se"(hamburguer)
registerLink.addEventListener('click', (e) => {
  e.preventDefault();
  menu.classList.remove('show'); // fecha o dropdown
  openRegisterModal();
});

// Redirecionamento para página de gerenciamento de conta
document.getElementById('gerenciar-conta-btn')?.addEventListener('click', (e) => {
  e.preventDefault();
  window.location.href = '../../GerenciarConta/HTML/GerenciarConta.html';
});

document.getElementById('perfil-link')?.addEventListener('click', (e) => {
  e.preventDefault();
  window.location.href = '../../GerenciarConta/HTML/GerenciarConta.html';
});
