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

// Desactivar caché completamente
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          return caches.delete(cacheName);
        })
      );
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
  );
});
