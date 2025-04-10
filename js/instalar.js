let deferredPrompt;
const instalarBtn = document.getElementById('instalarBtn');
const instalarBtnLi = document.getElementById('instalarBtnLi');

if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone) {
  instalarBtnLi.style.display = 'none';
}

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
});

instalarBtn.addEventListener('click', async () => {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      console.log('PWA instalada');
    } else {
      console.log('Instalación cancelada');
    }
    deferredPrompt = null;
  } else {
    alert('Tu navegador no permite instalar esta app o ya la tienes instalada.');
  }
});
