const cacheName = 'correios-shell-v1';
const shell = new URL('./', self.registration.scope);
self.addEventListener('install', event => {
  event.waitUntil(caches.open(cacheName).then(cache => cache.add(shell.href)));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(
    keys.filter(key => key.startsWith('correios-shell-') && key !== cacheName)
      .map(key => caches.delete(key))
  )));
});
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  if (event.request.mode !== 'navigate' || url.origin !== shell.origin ||
      ![shell.pathname, shell.pathname + 'index.html'].includes(url.pathname)) return;
  event.respondWith(fetch(event.request).catch(() => caches.match(shell.href)));
});
