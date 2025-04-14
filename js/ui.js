// ui.js - todo lo visual (modo, menú, sonidos, animaciones)

const body = document.body;
const modoBtn = document.getElementById('modoBtn');
const menuToggle = document.getElementById('menuToggle');
const navList = document.getElementById('navList');
const toggleCategoria = document.getElementById('toggleCategoria');
const categoriasLista = document.getElementById('categoriasLista');
const header = document.querySelector("header");
const sonidoBtn = document.getElementById('sonidoBtn');
const randomBtn = document.getElementById('randomBtn');
const sugerirBtn = document.getElementById('sugerirBtn');

// ------------------- MODO CLARO/OSCURO -------------------
let preferenciaModo = localStorage.getItem('modo') || 'oscuro';

function inicializarModo() {
    if (preferenciaModo === 'claro') {
        body.classList.add('claro');
        randomBtn.classList.add('claro');
        modoBtn.innerHTML = '<i class="fas fa-sun"></i> Modo claro';
        document.documentElement.style.setProperty('--texto', '#222');
        document.documentElement.style.setProperty('--texto-opaco', '#22222280');
        document.documentElement.style.setProperty('--invert', 'invert(0)');
    } else {
        modoBtn.innerHTML = '<i class="fas fa-moon"></i> Modo oscuro';
        document.documentElement.style.setProperty('--texto', '#fff');
        document.documentElement.style.setProperty('--texto-opaco', '#ffffff80');
        document.documentElement.style.setProperty('--invert', 'invert(1)');
    }
}

function cambiarModo() {
    const enClaro = !body.classList.contains('claro');

    body.classList.toggle('claro', enClaro);
    randomBtn.classList.toggle('claro', enClaro);
    document.documentElement.style.setProperty('--texto', enClaro ? '#222' : '#fff');
    document.documentElement.style.setProperty('--texto-opaco', enClaro ? '#22222280' : '#ffffff80');
    document.documentElement.style.setProperty('--invert', enClaro ? 'invert(0)' : 'invert(1)');

    modoBtn.innerHTML = enClaro
        ? '<i class="fas fa-sun"></i> Modo claro'
        : '<i class="fas fa-moon"></i> Modo oscuro';

    const icono = modoBtn.querySelector('i');
    icono.classList.add('girar-rebote');
    icono.addEventListener('animationend', () => icono.classList.remove('girar-rebote'), { once: true });

    localStorage.setItem('modo', enClaro ? 'claro' : 'oscuro');
}

// ------------------- MENÚ -------------------
function closeMenu() {
    navList.classList.remove('active');
    menuToggle.classList.remove('active');
    categoriasLista.classList.remove("active");
    document.querySelectorAll(".subcategorias").forEach(sub => sub.classList.remove("active"));
    document.querySelectorAll('.categoria-btn i').forEach(icon => icon.classList.remove('fa-folder-open'));
    document.querySelectorAll(".subcategorias-lista").forEach(sub => sub.classList.remove("active"));
    header.classList.remove("active");
    sonidoLista.classList.remove("active");
    actualizarContadorSonidos(); // Ocultar contador
}

function toggleMenu() {
    navList.classList.toggle('active');
    menuToggle.classList.toggle('active');

    if (!navList.classList.contains('active')) {
        closeMenu();
        if (window.actualizarContadorCategorias) window.actualizarContadorCategorias();
    }
}

function toggleCategoriasLista() {
    const seAbrio = !categoriasLista.classList.contains('active');
    
    categoriasLista.classList.toggle('active');
    actualizarHeaderActivo();

    const icono = toggleCategoria.querySelector('i');
    icono.classList.add('bounce-giro');
    icono.addEventListener('animationend', () => icono.classList.remove('bounce-giro'), { once: true });

    if (!seAbrio) {
        document.querySelectorAll(".subcategorias").forEach(sub => sub.classList.remove("active"));
        document.querySelectorAll('.categoria-btn i').forEach(icon => icon.classList.remove('fa-folder-open'));
        document.querySelectorAll(".subcategorias-lista").forEach(sub => sub.classList.remove("active"));
    }

    if (window.actualizarContadorCategorias) window.actualizarContadorCategorias();
}


function actualizarHeaderActivo() {
    const hayActivos = categoriasLista.classList.contains("active") ||
        [...document.querySelectorAll('.subcategorias')].some(el => el.classList.contains("active"));
    header.classList.toggle("active", hayActivos);
}

// ------------------- EVENTOS -------------------
if (modoBtn) modoBtn.addEventListener('click', cambiarModo);
if (menuToggle) menuToggle.addEventListener('click', (e) => { e.stopPropagation(); toggleMenu(); });
if (toggleCategoria) toggleCategoria.addEventListener('click', (e) => { e.stopPropagation(); toggleCategoriasLista(); });

window.addEventListener("resize", () => closeMenu());
document.addEventListener("click", (e) => {
    if (!header.contains(e.target)) closeMenu();
});

// ------------------- SONIDO -------------------
// Elementos
const sonidoLista = document.querySelector(".sonido-lista");
const btnToggleAudio = document.getElementById("SonidoBoton");
const fondoToggleAudio = document.getElementById("SonidoFondo");
const efectosToggleAudio = document.getElementById("SonidoEfectos");

// Audios
const clickAudio = new Audio("assets/click.mp3");
const fondoAudio = new Audio("assets/fondo.mp3");
fondoAudio.loop = true;
const toggleAudio = new Audio("assets/toggle.mp3");

// Estados iniciales (por defecto o localStorage)
let sonidoBotonActivo = getEstado("sonidoBotonActivo", true);
let sonidoFondoActivo = getEstado("sonidoFondoActivo", false);
let sonidoEfectosActivo = getEstado("sonidoEfectosActivo", true);

// Aplicar estados visuales iniciales
actualizarEstado(btnToggleAudio, sonidoBotonActivo);
actualizarEstado(fondoToggleAudio, sonidoFondoActivo);
actualizarEstado(efectosToggleAudio, sonidoEfectosActivo);
if (sonidoFondoActivo) fondoAudio.play();

// Mostrar/ocultar lista
sonidoBtn.addEventListener("click", () => {
  const visible = sonidoLista.classList.toggle("active");
  if (visible) {
    reproducirToggle();
  }
  actualizarContadorSonidos(); // Actualizar visibilidad
});

// Botón 1 - sonido botón randomBtn
btnToggleAudio.addEventListener("click", () => {
  sonidoBotonActivo = !sonidoBotonActivo;
  setEstado("sonidoBotonActivo", sonidoBotonActivo);
  actualizarEstado(btnToggleAudio, sonidoBotonActivo);
  reproducirToggle();
});

// Botón 2 - fondo.mp3
fondoToggleAudio.addEventListener("click", () => {
  sonidoFondoActivo = !sonidoFondoActivo;
  setEstado("sonidoFondoActivo", sonidoFondoActivo);
  actualizarEstado(fondoToggleAudio, sonidoFondoActivo);
  sonidoFondoActivo ? fondoAudio.play() : fondoAudio.pause();
  reproducirToggle();
});

// Botón 3 - efectos toggle.mp3
efectosToggleAudio.addEventListener("click", () => {
  sonidoEfectosActivo = !sonidoEfectosActivo;
  setEstado("sonidoEfectosActivo", sonidoEfectosActivo);
  actualizarEstado(efectosToggleAudio, sonidoEfectosActivo);
  reproducirToggle();
});

// randomBtn click con click.mp3 si está activo
randomBtn.addEventListener("click", () => {
  if (sonidoBotonActivo) clickAudio.play();
});

// Reproduce toggle.mp3 al hacer clic en cualquier botón, excepto randomBtn
document.querySelectorAll("button").forEach(boton => {
    if (boton.id !== "randomBtn") {
      boton.addEventListener("click", () => {
        if (sonidoEfectosActivo) toggleAudio.play();
      });
    }
  });
  

// Cambiar texto ON/OFF y clase
function actualizarEstado(boton, activo) {
  boton.classList.toggle("Audio-Activo", activo);
  const partes = boton.innerHTML.split(":");
  boton.innerHTML = `${partes[0]}: ${activo ? "ON" : "OFF"}`;
  actualizarContadorSonidos();
}

// Reproducir sonido toggle.mp3
function reproducirToggle() {
  if (typeof toggleAudio !== 'undefined') {
    toggleAudio.currentTime = 0;
    toggleAudio.play();
  }
}

// Guardar en localStorage
function setEstado(clave, valor) {
  localStorage.setItem(clave, JSON.stringify(valor));
}

// Leer de localStorage o usar valor por defecto
function getEstado(clave, porDefecto) {
  const guardado = localStorage.getItem(clave);
  return guardado !== null ? JSON.parse(guardado) : porDefecto;
}

// --- CONTADOR DE SONIDOS ACTIVOS ---
function actualizarContadorSonidos() {
  let activos = 0;
  if (sonidoBotonActivo) activos++;
  if (sonidoFondoActivo) activos++;
  if (sonidoEfectosActivo) activos++;
  let contador = document.getElementById('contadorSonidos');
  if (!contador) {
    contador = document.createElement('span');
    contador.id = 'contadorSonidos';
    contador.style.marginLeft = '2px'; // Menos separación
    contador.style.fontSize = '0.95em';
    contador.style.opacity = '0.7';
    sonidoBtn.appendChild(contador);
  }
  contador.textContent = `(${activos})`;
  // Mostrar solo si la lista está activa
  if (sonidoLista.classList.contains('active')) {
    contador.style.display = 'inline';
  } else {
    contador.style.display = 'none';
  }
}

// Inicializar contador al cargar
actualizarContadorSonidos();

// ------------------- NAVEGACIÓN -------------------
sugerirBtn.addEventListener('click', () => {
    const icono = sugerirBtn.querySelector('i');
    icono.classList.add('rebote-globo');
    icono.addEventListener('animationend', () => {
        icono.classList.remove('rebote-globo');
        if (document.startViewTransition) {
            document.startViewTransition(() => window.location.href = '/sugerir.html');
        } else {
            window.location.href = '/sugerir.html';
        }
    }, { once: true });
});

// ------------------- INICIALIZAR -------------------
inicializarModo();