/**
 * MINDSET ELITE - PWA Service Worker v4.0
 * Estratégia: Stale-While-Revalidate (Velocidade + Atualização)
 * Local: Porto Velho - RO
 */

const CACHE_NAME = "benis-burguer-v4.0"; 

// Ajustamos os caminhos: removemos o prefixo "/frontend" pois o site já roda nela
const ASSETS_TO_CACHE = [
    "/",
    "/index.html",
    "/style.css",
    "/app.js",
    "/mapa.js",
    "/logo.png",
    "/manifest.json",
    "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css",
    "https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap"
];

// 1. INSTALAÇÃO: Salva os arquivos essenciais
self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log("Gerando cache de ativos Elite...");
            // Usamos map para capturar erros individuais se um arquivo faltar
            return Promise.all(
                ASSETS_TO_CACHE.map(url => {
                    return cache.add(url).catch(err => console.warn(`Falha ao cachear: ${url}`, err));
                })
            );
        })
    );
    self.skipWaiting();
});

// 2. ATIVAÇÃO: Limpa caches antigos
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
    // Ignora requisições de mapas e da própria API de pedidos (deve ser sempre rede)
    if (event.request.url.includes("tile.openstreetmap.org") || event.request.url.includes("/api")) {
        return;
    }

    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            const fetchPromise = fetch(event.request).then((networkResponse) => {
                if (networkResponse && networkResponse.status === 200) {
                    const responseClone = networkResponse.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseClone);
                    });
                }
                return networkResponse;
            }).catch(() => {
                // Opcional: retornar uma página offline.html aqui se desejar
            });

            return cachedResponse || fetchPromise;
        })
    );
});
