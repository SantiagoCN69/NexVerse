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

  // 📌 Filtrar por subcategorías seleccionadas (si hay alguna activa)
  if (subcategoriasSeleccionadas.length === 0) {
    const mensaje = document.getElementById('mensajeFiltro');
    const btn = document.getElementById('randomBtn');
  
    mensaje.textContent = 'Por favor, selecciona al menos una subcategoría.';
    btn.classList.remove('activo');
    btn.classList.add('inactivo', 'boton-error');
  
    btn.addEventListener('animationend', () => {
      btn.classList.remove('boton-error');
    }, { once: true });
  
    return;
  }
  
  
  

paginasDisponibles = paginas.filter(p =>
  subcategoriasSeleccionadas.includes(p.subcategoria)
);


  // 📌 Luego aplicar "No Repetir", si está activado
  if (noRepetirActivo) {
    const paginasVisitadas = JSON.parse(localStorage.getItem('paginasVisitadas')) || [];
    paginasDisponibles = paginasDisponibles.filter(p => !paginasVisitadas.includes(p.id));
  }

  if (paginasDisponibles.length === 0) {
    alert('🎉 ¡Felicidades, visitaste todas las páginas disponibles! 🎉');
    return;
  }

  const paginaAleatoria = paginasDisponibles[Math.floor(Math.random() * paginasDisponibles.length)];
  window.open(paginaAleatoria.url, '_blank');

  // Guardar como visitada si "No Repetir" está activo
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
let subcategoriasSeleccionadas = JSON.parse(localStorage.getItem('subcategoriasSeleccionadas')) || [];

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

// Inicializar subcategorías (desde localStorage o activar todas)
function inicializarSubcategorias() {
  if (subcategoriasSeleccionadas.length === 0) {
    subcategoriaBotones.forEach(b => {
      toggleSubcategoria(b, true);
    });
    toggleTodasBtn.textContent = 'Deseleccionar Todas';
  } else {
    subcategoriaBotones.forEach(b => {
      const subcat = b.dataset.subcategoria;
      if (subcategoriasSeleccionadas.includes(subcat)) {
        toggleSubcategoria(b, true);
      }
    });

    const todasSeleccionadas = Array.from(subcategoriaBotones).every(b =>
      b.classList.contains('subcategoria-activa')
    );
    toggleTodasBtn.textContent = todasSeleccionadas ? 'Deseleccionar Todas' : 'Seleccionar Todas';
  }
}

// Click individual a subcategorías
subcategoriaBotones.forEach(boton => {
  boton.addEventListener('click', () => {
    const subcat = boton.dataset.subcategoria;

    if (subcategoriasSeleccionadas.includes(subcat)) {
      toggleSubcategoria(boton, false);
    } else {
      toggleSubcategoria(boton, true);
    }

    // Actualizar texto del botón "Todas"
    const todasSeleccionadas = Array.from(subcategoriaBotones).every(b =>
      b.classList.contains('subcategoria-activa')
    );
    toggleTodasBtn.textContent = todasSeleccionadas ? 'Deseleccionar Todas' : 'Seleccionar Todas';

    // ✅ Limpiar mensaje de advertencia al seleccionar algo
    document.getElementById('mensajeFiltro').textContent = '';
  });
});


// Botón "Seleccionar/Deseleccionar Todas"
toggleTodasBtn.addEventListener('click', () => {
  const todasSeleccionadas = Array.from(subcategoriaBotones).every(b =>
    b.classList.contains('subcategoria-activa')
  );

  subcategoriaBotones.forEach(boton => {
    toggleSubcategoria(boton, !todasSeleccionadas);
  });

  toggleTodasBtn.textContent = !todasSeleccionadas ? 'Deseleccionar Todas' : 'Seleccionar Todas';

  // ✅ Limpiar mensaje de advertencia si existía
  document.getElementById('mensajeFiltro').textContent = '';
});

inicializarSubcategorias();
