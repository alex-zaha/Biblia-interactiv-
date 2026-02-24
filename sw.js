const CACHE_NAME = 'biblia-pro-v2'; // Am schimbat versiunea pentru a forța reîmprospătarea
const ASSETS = [
  './',
  './index.html',
  './manifest.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      // Folosim addAll dar cu grijă pentru a nu bloca instalarea dacă un fișier lipsește
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
    ))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(res => res || fetch(event.request))
  );
});

// DESCHIDERE APLICAȚIE LA CLICK PE NOTIFICARE
self.addEventListener('notificationclick', event => {
  event.notification.close();
  
  // În loc de cale relativă, folosim rădăcina site-ului
  const rootUrl = new URL('./', self.location.origin).href;

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(windowClients => {
      for (let client of windowClients) {
        if (client.url === rootUrl && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(rootUrl);
      }
    })
  );
});
