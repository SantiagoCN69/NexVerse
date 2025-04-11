// Elementos del DOM
const body = document.body;
const modoBtn = document.getElementById('modoBtn');
const menuToggle = document.getElementById('menuToggle');
const navList = document.getElementById('navList');
const toggleCategoria = document.getElementById('toggleCategoria');
const categoriasLista = document.getElementById('categoriasLista');
const header = document.querySelector("header");


// Modo Claro/Oscuro
let preferenciaModo = localStorage.getItem('modo') || 'oscuro';

// Inicializar modo
function inicializarModo() {
    if (preferenciaModo === 'claro') {
        body.classList.add('claro');
        randomBtn.classList.add('claro');
        modoBtn.innerHTML = '<i class="fas fa-sun"></i> Modo claro';
        document.documentElement.style.setProperty('--texto', '#222');
        document.documentElement.style.setProperty('--texto-opaco', '#22222280');
    } else {
        modoBtn.innerHTML = '<i class="fas fa-moon"></i> Modo oscuro';
        document.documentElement.style.setProperty('--texto', '#fff');
        document.documentElement.style.setProperty('--texto-opaco', '#ffffff80');
    }
}

// Cambiar modo
function cambiarModo() {
    const enClaro = !body.classList.contains('claro');

    body.classList.toggle('claro', enClaro);
    randomBtn.classList.toggle('claro', enClaro);

    document.documentElement.style.setProperty('--texto', enClaro ? '#222' : '#fff');
    document.documentElement.style.setProperty('--texto-opaco', enClaro ? '#22222280' : '#ffffff80');

    modoBtn.innerHTML = enClaro
    ? '<i class="fas fa-sun"></i> Modo claro'
    : '<i class="fas fa-moon"></i> Modo oscuro';

const icono = modoBtn.querySelector('i');
icono.classList.add('girar-rebote');
icono.addEventListener('animationend', () => {
    icono.classList.remove('girar-rebote');
}, { once: true });


    localStorage.setItem('modo', enClaro ? 'claro' : 'oscuro');
}

// Menú Toggle
function closeMenu() {
    navList.classList.remove('active');
    menuToggle.classList.remove('active');
    header.classList.remove("menu-activo");
    
    // Close categories and subcategories when menu is closed
    categoriasLista.classList.remove("active");
    document.querySelectorAll(".subcategorias").forEach(sub => sub.classList.remove("active"));
    document.querySelectorAll('.categoria-btn i').forEach(icon => icon.classList.remove('fa-folder-open'));
    header.classList.remove("active");
}

function toggleMenu() {
    navList.classList.toggle('active');
    menuToggle.classList.toggle('active');

    if (window.innerWidth < 768 && navList.classList.contains("active")) {
        header.classList.add("menu-activo");
    } else if (window.innerWidth < 768) {
        header.classList.remove("menu-activo");
    }
}

// Cerrar menú al hacer click fuera
document.addEventListener('click', (event) => {
    if (window.innerWidth < 768 && 
        !navList.contains(event.target) && 
        !menuToggle.contains(event.target) && 
        navList.classList.contains('active')) {
        closeMenu();
    }
});

// Cerrar menú al redimensionar
window.addEventListener('resize', () => {
    if (window.innerWidth >= 768) {
        closeMenu();
    }
});


// Categorías Toggle
function toggleCategoriasLista() {
    categoriasLista.classList.toggle('active');
    actualizarHeaderActivo();
    actualizarContadorCategorias();
  
    const icono = toggleCategoria.querySelector('i');
    icono.classList.add('bounce-giro');
    icono.addEventListener('animationend', () => {
      icono.classList.remove('bounce-giro');
    }, { once: true });
  }
  
  // Actualiza el estado del header si hay algo abierto
  function actualizarHeaderActivo() {
    const hayActivos = categoriasLista.classList.contains("active") ||
      [...document.querySelectorAll('.subcategorias')].some(el => el.classList.contains("active"));
  
    header.classList.toggle("active", hayActivos);
  }
  
  // 🔢 Actualizar contador en el botón de categorías
  function actualizarContadorCategorias() {
    const cantidad = subcategoriasSeleccionadas.length;
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
  
  // Subcategorías Toggle
  document.querySelectorAll('.categoria-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const subcategoriaLista = e.currentTarget.nextElementSibling;
      const iconElement = e.currentTarget.querySelector('i');
  
      // Cerrar todas las subcategorías abiertas
      const todasSubcategorias = document.querySelectorAll('.subcategorias-lista');
      const todosIconos = document.querySelectorAll('.categoria-btn i');
  
      todasSubcategorias.forEach((sub, index) => {
        if (sub !== subcategoriaLista) {
          sub.classList.remove('active');
          todosIconos[index].classList.remove('fa-folder-open');
        }
      });
  
      if (subcategoriaLista) {
        subcategoriaLista.classList.toggle('active');
        iconElement.classList.toggle('fa-folder-open');
      }
  
      actualizarHeaderActivo();
    });
  });
  
  // Botón random
  function manejarBotonRandom() {
    randomBtn.addEventListener('click', () => {});
  }
  
  // Eventos
  if (modoBtn) {
    modoBtn.addEventListener('click', cambiarModo);
  }
  
  if (menuToggle) {
    menuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMenu();
    });
  }
  
  if (toggleCategoria) {
    toggleCategoria.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleCategoriasLista();
    });
  }
  
  // Cerrar categorías/subcategorías al redimensionar
  window.addEventListener("resize", () => {
    categoriasLista.classList.remove("active");
    document.querySelectorAll(".subcategorias-lista").forEach(sub => sub.classList.remove("active"));
    document.querySelectorAll('.categoria-btn i').forEach(icon => icon.classList.remove('fa-folder-open'));
    header.classList.remove("active");
    actualizarContadorCategorias();
  });
  
  // Cerrar todo al hacer clic fuera
  document.addEventListener("click", (e) => {
    if (!header.contains(e.target)) {
      navList.classList.remove('active');
      menuToggle.classList.remove('active');
      header.classList.remove("menu-activo");
      categoriasLista.classList.remove("active");
  
      document.querySelectorAll(".subcategorias-lista").forEach(sub => sub.classList.remove("active"));
      document.querySelectorAll('.categoria-btn i').forEach(icon => icon.classList.remove('fa-folder-open'));
      header.classList.remove("active");
      actualizarContadorCategorias();
    }
  });
  

//sonido
const toggleSound = new Audio('assets/toggle.mp3');
const clickSound = new Audio('assets/click.mp3');

let sonidoRandomActivo = localStorage.getItem('sonidoRandomActivo') === null 
    ? true 
    : localStorage.getItem('sonidoRandomActivo') === 'true';

const sonidoBtn = document.getElementById('sonidoBtn');
const randomBtn = document.getElementById('randomBtn');

// Inicializar estado del botón de sonido
function inicializarSonido() {
    sonidoBtn.innerHTML = sonidoRandomActivo
        ? '<i class="fas fa-headphones"></i> Sonido: ON'
        : '<i class="fas fa-headphones"></i> Sonido: OFF';
}

// Configurar sonido de toggle para todos los botones del header
document.querySelectorAll('header button').forEach(boton => {
    boton.addEventListener('click', () => {
        toggleSound.play().catch(e => console.log("Error al reproducir sonido de toggle: ", e));
    });
});

// Configurar sonido de click para botón random
randomBtn.addEventListener('click', () => {
    if (sonidoRandomActivo) {
        clickSound.play().catch(e => console.log("Error al reproducir sonido de click: ", e));
    }
});

// Configurar botón de sonido
sonidoBtn.addEventListener('click', () => {
    sonidoRandomActivo = !sonidoRandomActivo;
    localStorage.setItem('sonidoRandomActivo', sonidoRandomActivo);

    sonidoBtn.innerHTML = sonidoRandomActivo
        ? '<i class="fas fa-headphones"></i> Sonido: ON'
        : '<i class="fas fa-headphones"></i> Sonido: OFF';

    const icono = sonidoBtn.querySelector('i');
    icono.classList.add('pulso');
    icono.addEventListener('animationend', () => {
        icono.classList.remove('pulso');
    }, { once: true });
});

// Inicializar sonido al cargar la página
inicializarSonido();

// Inicialización
inicializarModo();
manejarBotonRandom();

//ANIMACION SUGERIR SITIO HTML
const sugerirBtn = document.getElementById('sugerirBtn');

sugerirBtn.addEventListener('click', () => {
  const icono = sugerirBtn.querySelector('i');
  icono.classList.add('rebote-globo');

  icono.addEventListener('animationend', () => {
    icono.classList.remove('rebote-globo');
    window.location.href = '/sugerir.html';
  }, { once: true });
});
