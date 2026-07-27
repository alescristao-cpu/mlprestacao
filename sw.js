/* ----------------------------------------------------
   Modern Life Residence - Service Worker (PWA)
   Cache v6 - Filtro Individual Rígido por E-mail do Morador
   ---------------------------------------------------- */

const CACHE_NAME = 'modern-life-v6-cache';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './assets/lnovo.jpeg',
  './css/main.css',
  './js/store.js',
  './js/firebase-config.js',
  './js/components/auth.js',
  './js/components/dashboard.js',
  './js/components/prestacao.js',
  './js/components/balancetes.js',
  './js/components/contratos.js',
  './js/components/transparencia.js',
  './js/components/documentos.js',
  './js/components/recados.js',
  './js/components/canal.js',
  './js/components/ocorrencias.js',
  './js/components/utilidades.js',
  './js/components/portaria.js',
  './js/components/agenda.js',
  './js/components/galeria.js',
  './js/components/admin.js',
  './js/app.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return Promise.allSettled(
        ASSETS_TO_CACHE.map(url => cache.add(url).catch(err => console.log('Asset skippable:', url)))
      );
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (response && response.status === 200 && response.type === 'basic') {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return response;
      })
      .catch(() => {
        return caches.match(event.request);
      })
  );
});
