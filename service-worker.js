/**
 * MINDSET ELITE - PWA Service Worker v4.0
 * Estratégia: Stale-While-Revalidate (Velocidade + Atualização)
 */

const CACHE_NAME = "benis-burguer-v4.0"; // Mude a versão aqui ao atualizar o código
const ASSETS_TO_CACHE = [
    "/",
    "/frontend/index.html",
    "/frontend/style.css",
    "/frontend/app.js",
    "/frontend/mapa.js",
    "/frontend/logo.png",
    "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css",
    "https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap"
];

// 1. INSTALAÇÃO: Salva os arquivos essenciais
self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log("Gerando cache de ativos...");
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
    self.skipWaiting(); // Força o novo SW a assumir o controle imediatamente
});

// 2. ATIVAÇÃO: Limpa caches de versões antigas automaticamente
self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        console.log("Removendo cache antigo:", cache);
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
    return self.clients.claim();
});

// 3. FETCH: Estratégia Stale-While-Revalidate
self.addEventListener("fetch", (event) => {
    // Ignora requisições de mapas (Leaflet) para não quebrar o mapa online
    if (event.request.url.includes("tile.openstreetmap.org")) return;

    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            const fetchPromise = fetch(event.request).then((networkResponse) => {
                // Atualiza o cache com a resposta da rede
                if (networkResponse && networkResponse.status === 200) {
                    const responseClone = networkResponse.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseClone);
                    });
                }
                return networkResponse;
            }).catch(() => {
                // Se a rede falhar e não houver cache, você pode retornar uma página offline aqui
            });

            // Retorna o cache IMEDIATAMENTE (se existir) ou espera a rede
            return cachedResponse || fetchPromise;
        })
    );
});
