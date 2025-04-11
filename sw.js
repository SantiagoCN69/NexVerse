const CACHE_NAME = 'sitios-randoms-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/offline.html',
  '/styles.css',
  '/js/fondo.js',
  '/js/paginas.js',
  '/js/instalar.js',
  '/js/header.js',
  '/icons/icon-512.png'
];

self.addEventListener('install', (event) => {
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
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', (event) => {
  // Ignorar peticiones que no sean GET
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Si está en caché, devolver respuesta
        if (response) return response;

        // Si no, hacer fetch
        return fetch(event.request).catch(() => {
          // Si falla el fetch, devolver página offline
          return caches.match('/offline.html');
        });
      })
  );
});
