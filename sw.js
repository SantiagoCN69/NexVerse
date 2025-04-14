const APP_VERSION = 'v1.5.7';
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
          
          return caches.delete(cacheName);
        })
      );
    }).then(() => {

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