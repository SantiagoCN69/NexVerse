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
    categoriasLista.classList.toggle('active');
    actualizarHeaderActivo();
    const icono = toggleCategoria.querySelector('i');
    icono.classList.add('bounce-giro');
    icono.addEventListener('animationend', () => icono.classList.remove('bounce-giro'), { once: true });
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
const toggleSound = new Audio('assets/toggle.mp3');
const clickSound = new Audio('assets/click.mp3');
let sonidoRandomActivo = localStorage.getItem('sonidoRandomActivo') === null ? true : localStorage.getItem('sonidoRandomActivo') === 'true';

function inicializarSonido() {
    sonidoBtn.innerHTML = sonidoRandomActivo
        ? '<i class="fas fa-headphones"></i> Sonido: ON'
        : '<i class="fas fa-headphones"></i> Sonido: OFF';
}

sonidoBtn.addEventListener('click', () => {
    sonidoRandomActivo = !sonidoRandomActivo;
    localStorage.setItem('sonidoRandomActivo', sonidoRandomActivo);
    inicializarSonido();
    const icono = sonidoBtn.querySelector('i');
    icono.classList.add('pulso');
    icono.addEventListener('animationend', () => icono.classList.remove('pulso'), { once: true });
});

randomBtn.addEventListener('click', () => {
    if (sonidoRandomActivo) clickSound.play().catch(e => console.log("Error al reproducir sonido de click: ", e));
});

document.querySelectorAll('header button').forEach(boton => {
    boton.addEventListener('click', () => {
        toggleSound.play().catch(e => console.log("Error al reproducir sonido de toggle: ", e));
    });
});

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
inicializarSonido();