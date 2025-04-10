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

// ------------------- Botón No Repetir -------------------

noRepetirBtn.innerHTML = noRepetirActivo
  ? '<i class="fas fa-sync-alt"></i> No Repetir'
  : '<i class="fas fa-sync-alt"></i> Si Repetir';

noRepetirBtn.addEventListener('click', () => {
  noRepetirActivo = !noRepetirActivo;
  localStorage.setItem('noRepetirActivo', noRepetirActivo);

  noRepetirBtn.innerHTML = noRepetirActivo
    ? '<i class="fas fa-sync-alt"></i> No Repetir'
    : '<i class="fas fa-sync-alt"></i> Si Repetir';

  const icono = noRepetirBtn.querySelector('i');
  icono.classList.add('girar');
  icono.addEventListener('animationend', () => {
    icono.classList.remove('girar');
  }, { once: true });
});

// ------------------- Botón aleatorio -------------------

boton.addEventListener('click', () => {
  if (!paginas || paginas.length === 0) {
    console.error('La lista de páginas no está cargada.');
    return;
  }

  let paginasDisponibles = paginas;

  if (subcategoriasSeleccionadas.length > 0) {
    paginasDisponibles = paginasDisponibles.filter(p =>
      subcategoriasSeleccionadas.includes(p.subcategoria)
    );
  }


  if (noRepetirActivo) {
    const paginasVisitadas = JSON.parse(localStorage.getItem('paginasVisitadas')) || [];
    paginasDisponibles = paginas.filter(p => !paginasVisitadas.includes(p.id));

    if (paginasDisponibles.length === 0) {
      alert('🎉 ¡Felicidades, visitaste todas las páginas disponibles! 🎉');
      return;
    }
  }

  const paginaAleatoria = paginasDisponibles[Math.floor(Math.random() * paginasDisponibles.length)];
  window.open(paginaAleatoria.url, '_blank');

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

// ------------------- subcategoias select -------------------

const subcategoriaBotones = document.querySelectorAll('.subcategorias-lista button');
const toggleTodasBtn = document.getElementById('toggleTodas');
let subcategoriasSeleccionadas = [];

// Función para actualizar el estado de un botón
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
}

// Click individual
subcategoriaBotones.forEach(boton => {
  boton.addEventListener('click', () => {
    const subcat = boton.dataset.subcategoria;

    if (subcategoriasSeleccionadas.includes(subcat)) {
      toggleSubcategoria(boton, false);
    } else {
      toggleSubcategoria(boton, true);
    }

    // Actualizar botón de "Todas/Ninguna"
    const todasSeleccionadas = Array.from(subcategoriaBotones).every(b =>
      b.classList.contains('subcategoria-activa')
    );
    toggleTodasBtn.textContent = todasSeleccionadas ? 'Deseleccionar Todas' : 'Seleccionar Todas';
  });
});

// Botón "Todas/Ninguna"
toggleTodasBtn.addEventListener('click', () => {
  const todasSeleccionadas = Array.from(subcategoriaBotones).every(b =>
    b.classList.contains('subcategoria-activa')
  );

  subcategoriaBotones.forEach(boton => {
    toggleSubcategoria(boton, !todasSeleccionadas);
  });

  toggleTodasBtn.textContent = !todasSeleccionadas ? 'Deseleccionar Todas' : 'Seleccionar Todas';
});

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

