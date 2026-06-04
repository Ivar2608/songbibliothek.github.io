const CACHE_NAME = 'heitzify-premium-v15';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon.png',
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap'
];

self.addEventListener('install', (e) => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    })
  );
});

self.addEventListener('fetch', (e) => {
  // songs.json soll direkt vom Netz geladen werden, falls online, ansonsten Offline-Cache
  if (e.request.url.includes('songs.json')) {
    e.respondWith(
      fetch(e.request).then(response => {
        if (response.status === 200) {
          return caches.open(CACHE_NAME).then(cache => {
            cache.put(e.request, response.clone());
            return response;
          });
        }
        return response;
      }).catch(() => caches.match(e.request))
    );
  } else {
    e.respondWith(
      caches.match(e.request).then(response => {
        return response || fetch(e.request);
      })
    );
  }
});
