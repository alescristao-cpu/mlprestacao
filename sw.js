/* ====================================================
   Modern Life Residence - PWA Service Worker & Complete Cache
   ==================================================== */
const CACHE_NAME = 'modern-life-pwa-v5';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './favicon.ico',
  './manifest.json',
  './assets/lnovo.jpeg',
  './css/main.css?v=13',
  './js/loader.js',
  './js/supabase-config.js',
  './js/store.js',
  './js/services/email-service.js',
  './js/components/modal-service.js',
  './js/components/auth.js',
  './js/components/dashboard.js',
  './js/components/prestacao.js',
  './js/components/balancetes.js',
  './js/components/contratos.js',
  './js/components/transparencia.js',
  './js/components/dashboard-financeiro.js',
  './js/components/documentos.js',
  './js/components/recados.js',
  './js/components/ocorrencias.js',
  './js/components/canal.js',
  './js/components/utilidades.js',
  './js/components/portaria.js',
  './js/components/agenda.js',
  './js/components/galeria.js',
  './js/components/admin.js',
  './js/app.js'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return Promise.all(
        ASSETS_TO_CACHE.map(url => {
          return fetch(url).then(response => {
            if (response.ok) return cache.put(url, response);
          }).catch(() => {});
        })
      );
    })
  );
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
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const url = (event.request && event.request.url) ? event.request.url : '';

  if (
    event.request.method !== 'GET' || 
    !url.startsWith('http') ||
    url.includes('kaspersky') ||
    url.includes('kaspersky-labs.com') ||
    url.includes('kis.v2.scr') ||
    url.includes('chrome-extension') ||
    url.includes('moz-extension') ||
    url.includes('supabase.co') || 
    url.includes('googleapis.com') || 
    url.includes('gstatic.com') ||
    url.includes('jsdelivr.net') ||
    url.includes('formsubmit.co') ||
    url.includes('formspree.io') ||
    !url.startsWith(self.location.origin)
  ) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (response && response.status === 200 && response.type === 'basic') {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone));
        }
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
