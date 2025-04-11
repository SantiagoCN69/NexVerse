const APP_VERSION = 'v1.1.0';
const CACHE_NAME = `sitios-randoms-${APP_VERSION}`;

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
      .then(() => self.skipWaiting()) 
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
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) return response;

        return fetch(event.request).catch(() => {
          return caches.match('/offline.html');
        });
      })
  );
});