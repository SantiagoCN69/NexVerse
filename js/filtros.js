// filtros.js - lógica de subcategorías y categorías

const subcategoriaBotones = document.querySelectorAll('.subcategorias-lista button');
const toggleTodasBtn = document.getElementById('toggleTodas');
const mensajeFiltro = document.getElementById('mensajeFiltro');
let subcategoriasSeleccionadas = [];

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

toggleTodasBtn.addEventListener('click', () => {
    const todasSeleccionadas = Array.from(subcategoriaBotones).every(b => b.classList.contains('subcategoria-activa'));
    subcategoriaBotones.forEach(b => {
      toggleSubcategoria(b, !todasSeleccionadas);
    });
  
    toggleTodasBtn.classList.toggle('activasTodas', !todasSeleccionadas);
    if (mensajeFiltro) mensajeFiltro.textContent = '';
    actualizarBotonAleatorio();
    actualizarContadorCategorias();
  });
  
  
  function inicializarSubcategorias() {
    let guardadas = JSON.parse(localStorage.getItem('subcategoriasSeleccionadas')) || [];

    const subcategoriasHTML = Array.from(subcategoriaBotones).map(b => b.dataset.subcategoria);
    guardadas = guardadas.filter(sub => subcategoriasHTML.includes(sub));
  
    subcategoriasSeleccionadas = guardadas;

    localStorage.setItem('subcategoriasSeleccionadas', JSON.stringify(subcategoriasSeleccionadas));
  
    if (guardadas.length === 0) {
      const primeraCategoria = document.querySelector('.categoria-con-sub');
      if (primeraCategoria) {
        const primerasSub = primeraCategoria.querySelectorAll('.subcategorias-lista button');
        primerasSub.forEach(b => toggleSubcategoria(b, true));
      }
    } else {
      subcategoriaBotones.forEach(b => {
        const subcat = b.dataset.subcategoria;
        if (guardadas.includes(subcat)) toggleSubcategoria(b, true);
      });
    }
  
    const todasSeleccionadas = Array.from(subcategoriaBotones).every(b => b.classList.contains('subcategoria-activa'));
    toggleTodasBtn.classList.toggle('activasTodas', todasSeleccionadas);
  
    actualizarBotonAleatorio();
    actualizarContadorCategorias();
  }
  

// Exportar globalmente para que otros scripts lo llamen
function actualizarContadorCategorias() {
    const cantidad = subcategoriasSeleccionadas.length;
    const toggleCategoria = document.getElementById('toggleCategoria');
    const categoriasLista = document.getElementById('categoriasLista');
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
  }
  
  window.actualizarContadorCategorias = actualizarContadorCategorias;
  

// Inicializar al cargar
inicializarSubcategorias();

// Manejar apertura de subcategorías (permite múltiples abiertas)
document.querySelectorAll('.categoria-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    const subcategoriaLista = e.currentTarget.nextElementSibling;
    const iconElement = e.currentTarget.querySelector('i');

    // Toggle la subcategoría clickeada
    if (subcategoriaLista) {
      subcategoriaLista.classList.toggle('active');
      iconElement.classList.toggle('fa-folder-open');
    }

    if (window.actualizarContadorCategorias) {
      window.actualizarContadorCategorias();
    }

    const header = document.querySelector("header");
    const hayActivos = [...document.querySelectorAll('.subcategorias-lista')]
      .some(el => el.classList.contains("active"));
    header.classList.toggle("active", hayActivos);
  });
});

  
// Ocultar contador si haces clic fuera del header o redimensionas
document.addEventListener('click', (e) => {
    const header = document.querySelector("header");
    if (!header.contains(e.target)) {
      const contador = document.querySelector('.contador-categorias');
      if (contador) contador.remove();
    }
  });
  
  window.addEventListener('resize', () => {
    const contador = document.querySelector('.contador-categorias');
    if (contador) contador.remove();
  });
  // Activar/desactivar individual al hacer clic
subcategoriaBotones.forEach(boton => {
    boton.addEventListener('click', () => {
      const subcat = boton.dataset.subcategoria;
      toggleSubcategoria(boton, !subcategoriasSeleccionadas.includes(subcat));
    });
  });
  