/* ==========================================================================
   Ocean's Mahjong — service worker
   Static assets: cache-first, filled from network. Navigations: network-first
   with the cached shell as an offline fallback — this never has to reason
   about host redirects (e.g. Cloudflare's /path -> /path/) because a live
   fetch() always gets first shot, and the cache is only consulted once that
   fetch has already failed.
   ========================================================================== */
'use strict';

const CACHE_VERSION = 'v5';   // bump alongside APP_VERSION in app.js
const CACHE_NAME = 'om-' + CACHE_VERSION;

const PRECACHE_URLS = [
  './',
  'index.html',
  'app.js',
  'styles.css',
  'manifest.json',
  'favicon.svg',
  'icons/icon-192.png',
  'icons/icon-512.png',
  'icons/maskable-512.png',
  'icons/apple-touch-icon.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET' || !req.url.startsWith(self.location.origin)) return;

  if (req.mode === 'navigate') {
    event.respondWith(fetch(req).catch(() => caches.match('index.html')));
    return;
  }

  event.respondWith(
    caches.match(req).then(cached => cached || fetch(req).then(res => {
      if (res.ok) caches.open(CACHE_NAME).then(cache => cache.put(req, res.clone()));
      return res;
    }))
  );
});
