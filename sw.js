const CACHE_NAME = 'biblia-pro-v1';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './data/cornilescu.js'
  // Adaugă aici și alte fișiere locale (css, imagini) dacă ai
];

// Instalare Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
});

// Activare și curățare cache vechi
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
    ))
  );
});

// Interceptare cereri rețea (Offline Mode)
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(res => res || fetch(event.request))
  );
});

// --- LOGICA PENTRU CLICK PE NOTIFICARE ---
self.addEventListener('notificationclick', event => {
  event.notification.close(); // Închide fereastra notificării din bara de sus

  // URL-ul de bază al aplicației tale pe GitHub
  const urlToOpen = new URL('./', self.location.origin).href;

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(windowClients => {
      // 1. Verificăm dacă aplicația este deja deschisă într-un tab sau fereastră standalone
      for (let client of windowClients) {
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus();
        }
      }
      // 2. Dacă nu este deschisă, o deschidem
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});
