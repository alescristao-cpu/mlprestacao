/* ====================================================
   Modern Life Residence - PWA Service Worker & Cache
   ==================================================== */
const CACHE_NAME = 'modern-life-pwa-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './favicon.ico',
  './assets/lnovo.jpeg',
  './css/main.css?v=13',
  './js/loader.js?v=20260730_v999',
  './js/supabase-config.js',
  './js/store.js',
  './js/app.js'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE).catch(() => {});
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
  // Ignorar APIs externas, Supabase, Google Fonts e CDNs para evitar bloqueios de CORS/CSP no Service Worker
  if (
    event.request.method !== 'GET' || 
    event.request.url.includes('supabase.co') || 
    event.request.url.includes('googleapis.com') || 
    event.request.url.includes('gstatic.com') ||
    event.request.url.includes('jsdelivr.net')
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
