const CACHE_NAME = 'heitzify-v1.1';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  'https://cdn.tailwindcss.com'
];

// Google Fonts URL wurde entfernt, da wir nun Systemschriften nutzen.
// Tailwind CDN bleibt für die Funktion notwendig, ist aber in der Datenschutzerklärung abgedeckt.

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => response || fetch(e.request))
  );
});
