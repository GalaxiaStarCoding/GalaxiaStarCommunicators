// service-worker.js
const CACHE_NAME = 'galaxiastar-shell-v1';
const ASSETS = [
  '/app/index.html',
  '/manifest.webmanifest',
  '/styles/visually-hidden.css',
  '/styles/focus.css',
  '/js/announce.js',
  '/js/focus-trap.js',
  '/a11y/index.html'
];

// Install: cache app shell
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// Activate: cleanup old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.map(k => (k !== CACHE_NAME ? caches.delete(k) : Promise.resolve()))
    ))
  );
  self.clients.claim();
});

// Fetch: cache-first for app shell, network-first for API/ws
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Network-first for any API or signaling endpoints
  if (url.pathname.startsWith('/api/') || url.pathname.startsWith('/ws/')) {
    event.respondWith(
      fetch(event.request).catch(() => caches.match(event.request))
    );
    return;
  }

  // Cache-first for static assets
  event.respondWith(
    caches.match(event.request).then(resp => resp || fetch(event.request))
  );
});
