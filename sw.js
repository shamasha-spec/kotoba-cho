/* Kotoba-chō service worker: makes the app installable and lets it open offline.
   Network first, so a new index.html you upload always wins; the saved copy is only used offline.
   Requests to your Apps Script and Google are never touched. */
const CACHE = 'kotoba-cho-v1';
self.addEventListener('install', e => { self.skipWaiting(); });
self.addEventListener('activate', e => { e.waitUntil(self.clients.claim()); });
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
  e.respondWith(
    fetch(req).then(res => {
      const copy = res.clone();
      caches.open(CACHE).then(c => c.put(req, copy)).catch(() => {});
      return res;
    }).catch(() => caches.match(req).then(r => r || caches.match('./')))
  );
});
