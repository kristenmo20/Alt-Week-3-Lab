const version = 1;
const cacheName = `precache-v${version}`;
const wolfdog = "northerninuit.jpg";
const urlsToCache = [
    "index.html",
    "anotherpage.html",
    "index.js",
    "styles.css",
    wolfdog
];

self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(cacheName).then(cache => cache.addAll(urlsToCache))
    );
});

self.addEventListener("activate", event => {
    event.waitUntil(
        caches
            .keys()
            .then(items => items.filter(item => item !== cacheName))
            .then(items => Promise.all(items.map(item => caches.delete(item))))
            .then(() => clients.claim())
    );
});

self.addEventListener("fetch", event => {
    const { request } = event;
    if (request.url.startsWith(self.location.origin)) {
        event.respondWith(
            caches
                .match(request)
                .then(cacheResponse => cacheResponse || caches.match(wolfdog))
        );
    }
});