const CACHE_NAME = 'shopify-mastery-v2';
const urlsToCache = [
  '/',
  '/index.html',
  '/success.html',
  '/cancel.html',
  '/privacidad.html',
  '/cookies.html',
  '/terminos.html',
  '/reembolso.html',
  '/css/styles.css',
  '/js/script.js',
  '/manifest.json',
  // Imágenes clave (cárgalas aquí para offline perfecto)
  '/img/hero.jpg',
  '/img/portada_ebook.png',
  '/img/foto-mohamed.jpg',
  '/img/icon-192.png',
  '/img/icon-512.png',
  '/img/stripe-paypal.png',
  '/img/icon-check.png'
  // Añade más cuando subas producto1.jpg etc.
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Cache abierto y assets precargados');
        return cache.addAll(urlsToCache);
      })
      .catch(err => console.error('Error al cachear:', err))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Devuelve del cache si existe
        if (response) {
          return response;
        }
        // Si no, fetch de red
        return fetch(event.request).then((networkResponse) => {
          // Cachea respuestas válidas
          if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
            return networkResponse;
          }
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseToCache);
            });
          return networkResponse;
        });
      })
      .catch(() => {
        // Fallback offline (puedes crear una página offline.html)
        return caches.match('/index.html');
      })
  );
});
