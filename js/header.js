const menuToggle = document.getElementById('menuToggle');
const navList = document.getElementById('navList');
const toggleCategoria = document.getElementById('toggleCategoria');
const categoriasLista = document.getElementById('categoriasLista');
const toggleAlign = document.getElementById('toggleAlign');
const header = document.querySelector('header');

function closeMenu() {
  navList.classList.remove('active');
  categoriasLista.classList.remove('active');
  header.classList.remove('menu-activo');
}

menuToggle.onclick = () => {
  navList.classList.toggle('active');
  categoriasLista.classList.remove('active');

  if (navList.classList.contains('active')) {
    header.classList.add('menu-activo');
  } else {
    header.classList.remove('menu-activo');
  }
}

toggleCategoria.onclick = (e) => {
  e.stopPropagation();
  categoriasLista.classList.toggle('active');
}

// Cerrar al hacer clic fuera del header
document.addEventListener('click', (e) => {
  if (!header.contains(e.target)) {
    closeMenu();
  }
});

// Cerrar al redimensionar ventana
window.addEventListener('resize', () => {
  closeMenu();
});
