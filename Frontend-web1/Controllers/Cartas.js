import { UserService } from '../Services/user_service.js';

const cardsContainer = document.getElementById('cards');
const usuario = UserService.getCurrentUser();

if (usuario && usuario.avatar && Array.isArray(usuario.avatar.deck) && usuario.avatar.deck.length > 0) {
  let cardsHTML = '';

  usuario.avatar.deck.forEach(card => {
    cardsHTML += `
    <div class="card">
      <img src="/Assets/images/${card.imageCard}" alt="${card.nome}">
      <div class="card-details">
        <h3>${card.nome}</h3>
        <p><strong>Descrição:</strong> ${card.descricao}</p>
        <p><strong>Dano:</strong> ${card.damage}</p>
      </div>
    </div>
  `;
});

  cardsContainer.innerHTML = cardsHTML;

  const cards = document.querySelectorAll('.card');

  cards.forEach(card => {
    card.addEventListener('click', () => {
      // Se a carta já está expandida, fecha ela
      if (card.classList.contains('expanded')) {
        card.classList.remove('expanded');
      } else {
        // Fecha todas as outras cartas
        cards.forEach(c => c.classList.remove('expanded'));
        // Expande a clicada
        card.classList.add('expanded');
      }
    });
  });

} else {
  cardsContainer.innerHTML = '<p>Você ainda não possui cartas no seu deck.</p>';
}
