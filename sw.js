/* MAINSTREET service worker (M0 stub, completed in M5). Cache-first, versioned name.
   Registration is skipped when window.SWS_EMBED is true (docs/FLEET.md); a vendored copy has this file removed.
   On activate, delete ONLY caches whose name starts with "mainstreet-". Never touch another game's cache. */
var CACHE = 'mainstreet-DECK1-MS1-ART0';
var PRECACHE = ['./', './index.html', './manifest.webmanifest', './icons/icon-192.png', './icons/icon-512.png'];
/* M5: append every file listed in art/manifest.json to PRECACHE at build-stamp time. */
self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) {
    return Promise.all(PRECACHE.map(function (u) { return c.add(u).catch(function () {}); }));
  }));
});
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) { return k.indexOf('mainstreet-') === 0 && k !== CACHE; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});
self.addEventListener('fetch', function (e) {
  if (e.request.method !== 'GET') return;
  e.respondWith(caches.match(e.request).then(function (r) { return r || fetch(e.request); }));
});
