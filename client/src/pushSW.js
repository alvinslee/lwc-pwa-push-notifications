self.addEventListener('push', (event) => {
  const body = event.data ? event.data.text() : 'no payload';
  event.waitUntil(
    self.registration.showNotification('LWC Push Notifications PWA', { body })
  )
});
