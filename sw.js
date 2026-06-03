const CACHE_NAME = 'heitzify-v2.0'; // Versions-Upgrade zwingt Handys zum Update!
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Exo+2:wght@400;600;700&display=swap'
];

self.addEventListener('install', (e) => {
  self.skipWaiting();
  e.waitUntil(https://github.com/Ivar2608/songbibliothek.github.io/blob/main/sw.js
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
  // WICHTIG: Immer zuerst im Internet nach der neuesten songs.json suchen!
  if (e.request.url.includes('songs.json')) {
    e.respondWith(
      fetch(e.request).then(response => {
        return caches.open(CACHE_NAME).then(cache => {
          cache.put(e.request, response.clone());
          return response;
        });
      }).catch(() => caches.match(e.request))
    );
  } else {
    // Für Bilder, HTML und CSS: Immer aus dem schnellen Cache laden.
    e.respondWith(
      caches.match(e.request).then(response => {
        return response || fetch(e.request);
      })
    );
  }
});
