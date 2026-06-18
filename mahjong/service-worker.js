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
  // Silently clear caches and unregister. Deliberately NO clients.claim() and
  // NO client.navigate(): those fire `controllerchange`, and the old cached
  // app.js reloaded on controllerchange -> infinite reload loop. Staying quiet
  // lets the page settle; the user's next refresh loads clean with no worker.
  event.waitUntil((async () => {
    try {
      const keys = await caches.keys();
      await Promise.all(keys.map(k => caches.delete(k)));
      await self.registration.unregister();
    } catch (e) { /* noop */ }
  })());
});
