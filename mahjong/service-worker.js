/* ==========================================================================
   Ocean's Mahjong — kill-switch service worker.
   The previous cache-first SW intercepted /mahjong/ navigations and errored
   (it choked on Cloudflare's /mahjong/index.html -> /mahjong/ redirect), so
   returning visitors got a browser error page. This version has NO fetch
   handler (so it can never intercept a navigation), clears all caches, and
   unregisters itself. Existing clients self-heal on their next visit.
   ========================================================================== */
'use strict';

self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    try {
      const keys = await caches.keys();
      await Promise.all(keys.map(k => caches.delete(k)));
      await self.clients.claim();
      await self.registration.unregister();
      const clients = await self.clients.matchAll({ type: 'window' });
      clients.forEach(c => { try { c.navigate(c.url); } catch (e) { /* noop */ } });
    } catch (e) { /* noop */ }
  })());
});
