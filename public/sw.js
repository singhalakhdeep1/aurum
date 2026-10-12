// Aurum service worker.
// It only handles web push; it deliberately does not cache pages or API
// responses, because they contain signed-in, per-user financial data.

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()));

self.addEventListener('push', (event) => {
  let payload = {};
  try {
    payload = event.data ? event.data.json() : {};
  } catch {
    payload = { body: event.data ? event.data.text() : '' };
  }

  event.waitUntil(
    self.registration.showNotification(payload.title || 'Aurum', {
      body: payload.body || 'You have a new notification',
      icon: '/logo-sm.png',
      badge: '/logo-sm.png',
      data: { url: payload.url || '/dashboard' },
    })
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = (event.notification.data && event.notification.data.url) || '/dashboard';

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windows) => {
      const open = windows.find((w) => new URL(w.url).pathname === url && 'focus' in w);
      return open ? open.focus() : self.clients.openWindow(url);
    })
  );
});
