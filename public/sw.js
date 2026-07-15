const CACHE_PREFIX = "hanpan-offline";
const CACHE_NAME = `${CACHE_PREFIX}-v1`;
const OFFLINE_FALLBACK_URL = "/offline";
const APP_SHELL_URLS = [
  "/",
  "/games/ladder",
  "/games/random-draw",
  "/games/reaction-speed",
  "/games/seven-seven-timer",
  OFFLINE_FALLBACK_URL,
];

const cacheResponse = async (request, response) => {
  if (!response.ok || response.type !== "basic") {
    return response;
  }

  try {
    const cache = await caches.open(CACHE_NAME);
    await cache.put(request, response.clone());
  } catch {
    // 캐시 기록 실패는 네트워크 응답을 사용하는 데 영향을 주지 않는다.
  }

  return response;
};

const networkFirst = async (request) => {
  try {
    const response = await fetch(request);
    return cacheResponse(request, response);
  } catch {
    const cachedResponse = await caches.match(request);

    if (cachedResponse) {
      return cachedResponse;
    }

    return (await caches.match(OFFLINE_FALLBACK_URL)) ?? Response.error();
  }
};

const cacheFirst = async (request) => {
  const cachedResponse = await caches.match(request);

  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    const response = await fetch(request);
    return cacheResponse(request, response);
  } catch {
    return Response.error();
  }
};

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL_URLS)));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) =>
        Promise.all(
          cacheNames
            .filter(
              (cacheName) =>
                cacheName.startsWith(CACHE_PREFIX) && cacheName !== CACHE_NAME,
            )
            .map((cacheName) => caches.delete(cacheName)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;

  if (request.method !== "GET") {
    return;
  }

  const url = new URL(request.url);

  if (url.origin !== self.location.origin || url.pathname.startsWith("/api/")) {
    return;
  }

  if (request.mode === "navigate") {
    event.respondWith(networkFirst(request));
    return;
  }

  if (
    url.pathname.startsWith("/_next/static/") ||
    ["font", "image", "script", "style"].includes(request.destination)
  ) {
    event.respondWith(cacheFirst(request));
  }
});
