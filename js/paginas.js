let paginas = [];

fetch('paginas.json')
  .then(res => res.json())
  .then(data => {
    paginas = data.paginas;
  })
  .catch(err => console.error('Error cargando paginas:', err));

const boton = document.getElementById('randomBtn');
const clickSound = new Audio('assets/click.mp3');
const fondoMusica = new Audio('assets/fondo.mp3');
fondoMusica.loop = true;
fondoMusica.volume = 0.3;

let musicaIniciada = false;

boton.addEventListener('click', () => {
  if (!musicaIniciada) {
    fondoMusica.play().catch(e => console.log("AutoPlay bloqueado"));
    musicaIniciada = true;
  }
  
  clickSound.play();
  
  if (paginas.length > 0) {
    const paginaAleatoria = paginas[Math.floor(Math.random() * paginas.length)];
    window.open(paginaAleatoria, '_blank');
  } else {
    console.error('No hay páginas disponibles');
  }
});
