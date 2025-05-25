// Efeito de opacidade ao scroll
window.addEventListener('scroll', function () {
  const hero = document.querySelector('.hero');
  const scrollY = window.scrollY;

  const opacity = Math.min(scrollY / 300, 1);
  hero.style.setProperty('--overlay-opacity', opacity);
  hero.style.setProperty('--scroll-opacity', opacity);
  hero.style.setProperty('--scroll-blur', Math.min(scrollY / 100, 10) + 'px');

  // Classe para header com rolagem
  const header = document.querySelector('#header');
  header.classList.toggle('rolagem', scrollY > 0);
});

// Anima o raio + toca trovão
function tocarRelampago() {
  const relampago = document.getElementById('raio');
  const som = document.getElementById('somTrovao');

  // Ativa o flash
  relampago.style.animation = 'raioFlash 1s ease-in-out';
  relampago.style.opacity = 1;

  // Reproduz o som
  som.currentTime = 0;
  som.play();

  // Remove a animação e oculta depois
  setTimeout(() => {
    relampago.style.animation = 'none';
    relampago.style.opacity = 0;
  }, 1000);
}

// Dispara relâmpago automático após 1s
window.addEventListener('load', () => {
  setTimeout(tocarRelampago, 1000);
});

// Toca som mesmo se bloqueado pelo navegador
window.addEventListener("load", function () {
  const som = document.getElementById("somTrovao");

  som.volume = 0.8;
  som.play().catch(function () {
    console.log("Autoplay bloqueado. Tocando após clique.");
    document.body.addEventListener("click", () => {
      som.play();
    }, { once: true });
  });
});

function tocarRelampago() {
  const raioEsquerdo = document.getElementById('raio-esquerdo');
  const raioDireito = document.getElementById('raio-direito');
  const som = document.getElementById('somTrovao');

  // Ativa os dois flashes
  [raioEsquerdo, raioDireito].forEach((raio) => {
    raio.style.animation = 'raioFlash 1s ease-in-out';
    raio.style.opacity = 1;
  });

  // Toca o som
  som.currentTime = 0;
  som.play();

  // Remove o flash depois de 1s
  setTimeout(() => {
    [raioEsquerdo, raioDireito].forEach((raio) => {
      raio.style.animation = 'none';
      raio.style.opacity = 0;
    });
  }, 1000);
}
