// paginas.js - carga de páginas y botón aleatorio

const noRepetirBtn = document.getElementById('noRepetirBtn');
const contadorSpan = document.getElementById('contador');
const boton = document.getElementById('randomBtn');
let paginas = [];
let noRepetirActivo = localStorage.getItem('noRepetirActivo') === 'true';

// ------------------- Cargar páginas -------------------
fetch('paginas.json')
  .then(res => res.json())
  .then(data => {
    paginas = data.paginas;
    actualizarContador();
  })
  .catch(err => console.error('Error cargando paginas:', err));

// ------------------- No repetir -------------------
function actualizarNoRepetirUI() {
  noRepetirBtn.innerHTML = noRepetirActivo
    ? '<i class="fas fa-rotate"></i>Repetir: No'
    : '<i class="fas fa-rotate"></i>Repetir: Si';
}

actualizarNoRepetirUI();

noRepetirBtn.addEventListener('click', () => {
  noRepetirActivo = !noRepetirActivo;
  localStorage.setItem('noRepetirActivo', noRepetirActivo);
  actualizarNoRepetirUI();

  const icono = noRepetirBtn.querySelector('i');
  icono.classList.add('girar');
  icono.addEventListener('animationend', () => icono.classList.remove('girar'), { once: true });
});

// ------------------- Botón aleatorio -------------------
boton.addEventListener('click', () => {
  if (boton.classList.contains('desactivado')) return;

  if (subcategoriasSeleccionadas.length === 0 || paginas.length === 0) return;

  let paginasDisponibles = paginas.filter(p => subcategoriasSeleccionadas.includes(p.subcategoria));

  if (noRepetirActivo) {
    const paginasVisitadas = JSON.parse(localStorage.getItem('paginasVisitadas')) || [];
    paginasDisponibles = paginasDisponibles.filter(p => !paginasVisitadas.includes(p.id));
  }

  if (paginasDisponibles.length === 0) {
    alert('¡Felicidades, visitaste todas las páginas disponibles!');
    return;
  }

  const paginaAleatoria = paginasDisponibles[Math.floor(Math.random() * paginasDisponibles.length)];
  const nuevaVentana = window.open(paginaAleatoria.url, '_blank', 'noopener,noreferrer');
  if (nuevaVentana) nuevaVentana.opener = null;

  // Siempre registrar como visitada, sin importar si "Repetir" está activo
  let paginasVisitadas = JSON.parse(localStorage.getItem('paginasVisitadas')) || [];
  if (!paginasVisitadas.includes(paginaAleatoria.id)) {
    paginasVisitadas.push(paginaAleatoria.id);
    localStorage.setItem('paginasVisitadas', JSON.stringify(paginasVisitadas));
  }
  actualizarContador();
});

// ------------------- Actualizar contador -------------------
function actualizarContador() {
  const visitadas = JSON.parse(localStorage.getItem('paginasVisitadas')) || [];
  contadorSpan.innerHTML = `<i class="fas fa-chart-bar"></i> ${visitadas.length} vistas`;
}

// ------------------- Estado del botón aleatorio -------------------
function actualizarBotonAleatorio() {
  const cantidad = subcategoriasSeleccionadas.length;

  if (cantidad === 0) {
    boton.classList.remove('activo');
    boton.classList.add('desactivado');
    boton.innerHTML = `Selecciona al menos 1 subcategoria`;
  } else {
    boton.classList.remove('desactivado');
    boton.classList.add('activo');
    boton.innerHTML = `Descubrir`;
  }
}
