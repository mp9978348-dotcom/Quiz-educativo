const CACHE_NAME = "quiz-educativo-v4";

const FICHEIROS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icon192.png",
  "./icon512.png"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(FICHEIROS))
  );

  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(chaves =>
      Promise.all(
        chaves
          .filter(chave => chave !== CACHE_NAME)
          .map(chave => caches.delete(chave))
      )
    )
  );

  self.clients.claim();
});

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request).then(respostaGuardada => {
      if (respostaGuardada) {
        return respostaGuardada;
      }

      return fetch(event.request).catch(() => {
        if (event.request.mode === "navigate") {
          return caches.match("./index.html");
        }

        return Response.error();
      });
    })
  );
});
