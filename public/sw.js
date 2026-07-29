const CACHE_NAME = 'aurum-v1';
const urlsToCache = [
  '/',
  '/dashboard',
  '/manifest.json',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response;
      }
      return fetch(event.request);
    })
  );
});

// Push notification handler
self.addEventListener('push', (event) => {
  const options = {
    body: event.data?.text() || 'New notification',
    icon: '/logo-sm.png',
    badge: '/logo-sm.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1,
    },
    actions: [
      {
        action: 'explore',
        title: 'Explore',
        icon: '/logo-sm.png',
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/logo-sm.png',
      },
    ],
  };

  event.waitUntil(self.registration.showNotification('Aurum', options));
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(clients.openWindow('/dashboard'));
  }
});
