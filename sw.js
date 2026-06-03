const CACHE_NAME = 'heitzify-v1.3'; // Version erhöht für Cache-Refresh
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon.png',
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Exo+2:wght@400;600;700&display=swap'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

// WICHTIG: Network First für die JSON, damit Updates ankommen!
self.addEventListener('fetch', (e) => {
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
    // Cache First für alles andere (schnelles Laden)
    e.respondWith(
      caches.match(e.request).then((response) => response || fetch(e.request))
    );
  }
});
