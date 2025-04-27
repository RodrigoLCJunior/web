function editarCampo(campo) {
    fetch('../Components/alterar_nomeEmail.html')
      .then(response => response.text())
      .then(html => {
        const modalContainer = document.getElementById('modal-container');
        modalContainer.innerHTML = html;
  
        const modal = document.getElementById('edit-field-modal');
        const closeBtn = document.getElementById('close-edit-field');
        const form = document.getElementById('edit-field-form');
        const input = document.getElementById('edit-field-input');
        const title = document.getElementById('edit-modal-title');
  
        const label = campo === 'nome' ? 'Nome' : 'Email';
        const spanId = campo === 'nome' ? 'user-name' : 'user-email';
        const originalValue = document.getElementById(spanId).textContent;
  
        title.textContent = `Editar ${label}`;
        input.value = originalValue;
        input.type = campo === 'email' ? 'email' : 'text';
  
        modal.style.display = 'flex';
  
        closeBtn.addEventListener('click', () => {
          modal.style.display = 'none';
        });
  
        window.addEventListener('click', (e) => {
          if (e.target === modal) {
            modal.style.display = 'none';
          }
        });
  
        form.addEventListener('submit', (e) => {
          e.preventDefault();
          const newValue = input.value.trim();
  
          if (campo === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newValue)) {
            alert("Digite um email válido.");
            return;
          }
  
          if (newValue.length < 3) {
            alert(`O ${label.toLowerCase()} deve ter ao menos 3 caracteres.`);
            return;
          }
  
          document.getElementById(spanId).textContent = newValue;
          modal.style.display = 'none';
        });
      });
  }
  
  
  // Função para abrir o modal de Alterar Senha
  function openChangePasswordModal() {
    fetch('../Components/alterar_senha.html')
      .then(response => response.text())
      .then(html => {
        const modalContainer = document.getElementById('modal-container');
        modalContainer.innerHTML = html;
  
        const changePasswordModal = document.getElementById('change-password-modal');
        const closeChangePassword = document.getElementById('close-change-password');
  
        const toggleCurrent = document.getElementById('toggle-current-password');
        const toggleNew = document.getElementById('toggle-new-password');
        const toggleConfirm = document.getElementById('toggle-confirm-password');
  
        const currentPassword = document.getElementById('current-password');
        const newPassword = document.getElementById('new-password');
        const confirmPassword = document.getElementById('confirm-new-password');
  
        const form = document.getElementById('change-password-form');
  
        changePasswordModal.style.display = 'flex';
  
        closeChangePassword.addEventListener('click', () => {
          changePasswordModal.style.display = 'none';
        });
  
        window.addEventListener('click', (e) => {
          if (e.target === changePasswordModal) {
            changePasswordModal.style.display = 'none';
          }
        });
  
        toggleCurrent.addEventListener('click', () => {
          const type = currentPassword.getAttribute('type') === 'password' ? 'text' : 'password';
          currentPassword.setAttribute('type', type);
        });
  
        toggleNew.addEventListener('click', () => {
          const type = newPassword.getAttribute('type') === 'password' ? 'text' : 'password';
          newPassword.setAttribute('type', type);
        });
  
        toggleConfirm.addEventListener('click', () => {
          const type = confirmPassword.getAttribute('type') === 'password' ? 'text' : 'password';
          confirmPassword.setAttribute('type', type);
        });
  
        form.addEventListener('submit', (e) => {
          e.preventDefault();
  
          if (newPassword.value !== confirmPassword.value) {
            alert("As novas senhas não coincidem.");
            return;
          }
  
          if (newPassword.value.length < 8) {
            alert("A nova senha precisa ter pelo menos 8 caracteres.");
            return;
          }
  
          alert("Senha alterada com sucesso!");
          changePasswordModal.style.display = 'none';
        });
      });
  }
  