const CACHE_NAME = 'power-task-v1.3.0';
const urlsToCache = ['./', './index.html', './manifest.json'];

// تثبيت الـ Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
  self.skipWaiting();
});

// تشغيل التطبيق وسحب الملفات
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => response || fetch(event.request))
  );
});
