const APP_VERSION = 'v1.3.4';
const CACHE_NAME = `sitios-randoms-${APP_VERSION}`;

const urlsToCache = [
  '/',
  '/index.html',
  '/styles.css',
  '/js/fondo.js',
  '/js/paginas.js',
  '/js/instalar.js',
  '/icons/icon-512.png'
];

self.addEventListener('install', (event) => {
  // Forzar la actualización inmediata del Service Worker
  self.skipWaiting();
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // Eliminar TODOS los cachés antiguos, sin importar el nombre
          return caches.delete(cacheName);
        })
      );
    }).then(() => {
      // Tomar control inmediato de todas las páginas
      return self.clients.claim();
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        return response || fetch(event.request);
      })
  );
});