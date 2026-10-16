const CACHE_PREFIX = "citronex-dragon-guide-";
const CACHE_NAME = CACHE_PREFIX + "20261016-primserv-guide5";
const CORE_ASSETS = [
  "./",
  "./index.html",
  "./assets/guide.css?v=20261016-primserv-guide1",
  "./assets/guide.js?v=20261016-primserv-guide5",
  "./manifest.webmanifest?v=20261016-primserv-guide1",
  "./assets/brand/primserv-logo.svg",
  "./assets/brand/primserv-icon-192.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await Promise.all(CORE_ASSETS.map((asset) => cache.add(new Request(asset, { cache: "reload" })).catch(() => {})));
    await self.skipWaiting();
  })());
});

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((key) => key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME).map((key) => caches.delete(key)));
    await self.clients.claim();
  })());
});

async function cacheResponse(request, response) {
  if (!response || !response.ok) return response;
  const cache = await caches.open(CACHE_NAME);
  await cache.put(request, response.clone());
  return response;
}

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET" || new URL(event.request.url).origin !== self.location.origin) return;
  event.respondWith((async () => {
    try {
      const response = await fetch(event.request);
      return await cacheResponse(event.request, response);
    } catch (error) {
      const cached = await caches.match(event.request, { ignoreSearch: true });
      return cached || Response.error();
    }
  })());
});
