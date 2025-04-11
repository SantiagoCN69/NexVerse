const noRepetirBtn = document.getElementById('noRepetirBtn');
const contadorSpan = document.getElementById('contador');
const boton = document.getElementById('randomBtn');
const contadorSubcats = document.getElementById('contadorSubcats');
const mensajeFiltro = document.getElementById('mensajeFiltro');

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

// ------------------- Botón No Repetir -------------------
noRepetirBtn.innerHTML = noRepetirActivo
  ? '<i class="fas fa-rotate"></i>Repetir: No'
  : '<i class="fas fa-rotate"></i>Repetir: Si';

noRepetirBtn.addEventListener('click', () => {
  noRepetirActivo = !noRepetirActivo;
  localStorage.setItem('noRepetirActivo', noRepetirActivo);
  noRepetirBtn.innerHTML = noRepetirActivo
    ? '<i class="fas fa-rotate"></i>Repetir: No'
    : '<i class="fas fa-rotate"></i>Repetir: Si';

  const icono = noRepetirBtn.querySelector('i');
  icono.classList.add('girar');
  icono.addEventListener('animationend', () => {
    icono.classList.remove('girar');
  }, { once: true });
});

// ------------------- subcategorías -------------------
const subcategoriaBotones = document.querySelectorAll('.subcategorias-lista button');
const toggleTodasBtn = document.getElementById('toggleTodas');
let subcategoriasSeleccionadas = [];

// Activar o desactivar subcategoría
function toggleSubcategoria(boton, activar) {
  const subcat = boton.dataset.subcategoria;

  if (activar) {
    if (!subcategoriasSeleccionadas.includes(subcat)) {
      subcategoriasSeleccionadas.push(subcat);
    }
    boton.classList.add('subcategoria-activa');
  } else {
    subcategoriasSeleccionadas = subcategoriasSeleccionadas.filter(s => s !== subcat);
    boton.classList.remove('subcategoria-activa');
  }

  localStorage.setItem('subcategoriasSeleccionadas', JSON.stringify(subcategoriasSeleccionadas));
  actualizarEstadoCategorias();
  actualizarBotonAleatorio();
  actualizarContadorCategorias();
}

// Verificar si todas las subcategorías dentro de una categoría están activas
function actualizarEstadoCategorias() {
  const categorias = document.querySelectorAll('.categoria-con-sub');
  categorias.forEach(categoria => {
    const subBtns = categoria.querySelectorAll('.subcategorias-lista button');
    const todasActivas = Array.from(subBtns).every(b => b.classList.contains('subcategoria-activa'));
    const categoriaBtn = categoria.querySelector('.categoria-btn');

    if (todasActivas) {
      categoriaBtn.classList.add('categoria-activa');
    } else {
      categoriaBtn.classList.remove('categoria-activa');
    }
  });
}

// Botón seleccionar/deseleccionar todas
toggleTodasBtn.addEventListener('click', () => {
  const todasSeleccionadas = Array.from(subcategoriaBotones).every(b => b.classList.contains('subcategoria-activa'));
  subcategoriaBotones.forEach(b => {
    toggleSubcategoria(b, !todasSeleccionadas);
  });

  toggleTodasBtn.textContent = !todasSeleccionadas ? 'Ninguna' : 'Todas';
  toggleTodasBtn.classList.toggle('activo', !todasSeleccionadas);
  mensajeFiltro.textContent = '';
  actualizarBotonAleatorio();
  actualizarContadorCategorias();
});

// Inicializar subcategorías
function inicializarSubcategorias() {
  if (subcategoriasSeleccionadas.length === 0) {
    subcategoriaBotones.forEach(b => toggleSubcategoria(b, true));
    toggleTodasBtn.textContent = 'Ninguna';
  } else {
    subcategoriaBotones.forEach(b => {
      const subcat = b.dataset.subcategoria;
      if (subcategoriasSeleccionadas.includes(subcat)) {
        toggleSubcategoria(b, true);
      }
    });

    const todasSeleccionadas = Array.from(subcategoriaBotones).every(b => b.classList.contains('subcategoria-activa'));
    toggleTodasBtn.textContent = todasSeleccionadas ? 'Ninguna' : 'Todas';
  }

  actualizarBotonAleatorio();
  actualizarContadorCategorias();
}

// Click individual
subcategoriaBotones.forEach(boton => {
  boton.addEventListener('click', () => {
    const subcat = boton.dataset.subcategoria;
    toggleSubcategoria(boton, !subcategoriasSeleccionadas.includes(subcat));
  });
});

// ------------------- Actualizar contador de categorías -------------------
window.actualizarContadorCategorias = function() {
  const cantidad = subcategoriasSeleccionadas.length;
  const toggleCategoria = document.getElementById('toggleCategoria');
  const categoriasLista = document.getElementById('categoriasLista');

  // Salir si no se encuentran los elementos necesarios
  if (!toggleCategoria || !categoriasLista) return;

  const existeSpan = toggleCategoria.querySelector('.contador-categorias');

  if (categoriasLista.classList.contains('active')) {
    if (!existeSpan) {
      const span = document.createElement('span');
      span.className = 'contador-categorias';
      span.textContent = ` (${cantidad})`;
      toggleCategoria.appendChild(span);
    } else {
      existeSpan.textContent = ` (${cantidad})`;
    }
  } else if (existeSpan) {
    existeSpan.remove();
  }
};

// Llamar a la función cuando se seleccionan subcategorías
document.querySelectorAll('.categoria-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    actualizarContadorCategorias();
  });
});

// ------------------- Botón Aleatorio -------------------
boton.addEventListener('click', () => {
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
  
  // Abrir página sin validación
  const nuevaVentana = window.open(paginaAleatoria.url, '_blank', 'noopener,noreferrer');
  nuevaVentana.opener = null;

  if (noRepetirActivo) {
    let paginasVisitadas = JSON.parse(localStorage.getItem('paginasVisitadas')) || [];
    if (!paginasVisitadas.includes(paginaAleatoria.id)) {
      paginasVisitadas.push(paginaAleatoria.id);
      localStorage.setItem('paginasVisitadas', JSON.stringify(paginasVisitadas));
      actualizarContador();
    }
  }
});

// ------------------- Actualizar contador -------------------
function actualizarContador() {
  const visitadas = JSON.parse(localStorage.getItem('paginasVisitadas')) || [];
  contadorSpan.innerHTML = `<i class="fas fa-chart-bar"></i> ${visitadas.length} vistas`;
}

// ------------------- Actualizar botón aleatorio -------------------
function actualizarBotonAleatorio() {
  if (!subcategoriasSeleccionadas) {
    subcategoriasSeleccionadas = [];
  }

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

boton.addEventListener('click', () => {
  if (boton.classList.contains('desactivado')) {
    boton.classList.add('sacudir');
    setTimeout(() => boton.classList.remove('sacudir'), 500);
  }
});

// ------------------- Inicializar -------------------
inicializarSubcategorias();
