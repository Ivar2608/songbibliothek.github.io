const CACHE_NAME = 'heitzify-final-v3';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Exo+2:wght@400;500;600;700;800&display=swap'
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
  // Für die Song-Datenbank IMMER zuerst das Netzwerk fragen, damit neue Songs sofort erscheinen
  if (e.request.url.includes('songs.json')) {
    e.respondWith(
      fetch(e.request).then(response => {
        // Behoben: Nur fehlerfreie Server-Antworten in den Offline-Cache schreiben (verhindert verunreinigte Leercaches)
        if (response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(e.request, responseClone));
        }
        return response;
      }).catch(() => caches.match(e.request))
    );
  } else {
    // Für alle anderen Dateien den Cache nutzen
    e.respondWith(
      caches.match(e.request).then(response => {
        return response || fetch(e.request);
      })
    );
  }
});
