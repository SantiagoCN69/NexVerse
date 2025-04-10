let deferredPrompt;

const modal = document.getElementById('modalInstalar');
const btnInstalar = document.getElementById('btnInstalar');
const cerrarModal = document.getElementById('cerrarModal');
const textoModal = modal.querySelector('p');

const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                     window.navigator.standalone === true;

const isMobileScreen = window.innerWidth <= 700;

modal.style.display = (isStandalone || !isMobileScreen) ? 'none' : 'flex';

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  
  if (!isStandalone && isMobileScreen) {
    modal.style.display = 'flex';
  }
});

btnInstalar.onclick = () => {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then(({outcome}) => {
      if (outcome === 'accepted') {
        localStorage.setItem('appInstalada', 'true');
        modal.style.display = 'none';
      }
      deferredPrompt = null;
    });
  } else {
    textoModal.innerHTML = '✅ La app ya está instalada. Ábrela desde tu pantalla de inicio o escritorio';
    btnInstalar.textContent = 'Entendido';
    btnInstalar.onclick = () => modal.style.display = 'none';
  }
};

cerrarModal.addEventListener('click', () => {
  modal.style.display = 'none';
});
