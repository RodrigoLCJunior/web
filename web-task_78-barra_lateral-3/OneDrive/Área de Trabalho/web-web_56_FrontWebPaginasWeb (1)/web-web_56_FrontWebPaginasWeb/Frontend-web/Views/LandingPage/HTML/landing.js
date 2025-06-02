window.addEventListener("scroll", function(){
  const header = document.querySelector('#header');
  header.classList.toggle('rolagem', window.scrollY > 0);
});

const relampagoEsquerdo = document.getElementById('raio_esquerdo');
const relampagoDireito = document.getElementById('raio_direito');
const trovao = document.getElementById('somTrovao');
const toggleSom = document.getElementById('sound-toggle');

// Controle de som
toggleSom.addEventListener('change', () => {
  trovao.muted = !toggleSom.checked;
});

function tocarRaio(element) {
  element.style.animation = 'none';
  element.offsetHeight; // força reflow
  element.style.animation = 'raioFlash 1s ease-in-out';

  if (trovao && toggleSom.checked) {
    trovao.currentTime = 0;
    trovao.play();
  }
}

function piscarRaiosAlternados() {
  tocarRaio(relampagoEsquerdo);
  setTimeout(() => {
    tocarRaio(relampagoDireito);
  }, 2000);
}

// Disparo inicial e intervalo
piscarRaiosAlternados();
setInterval(piscarRaiosAlternados, 4000);

// Opcional: atraso no primeiro raio após carregamento
window.addEventListener('load', () => {
  setTimeout(piscarRaiosAlternados, 1000);
});
