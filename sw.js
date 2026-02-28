const CACHE_NAME = 'McIntosh-DAP';
const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/style.css',
    '/css/root.css',
    '/css/chassis.css',
    '/css/meters.css',
    '/css/display.css',
    '/css/controls.css',
    '/css/states.css',
    '/css/modals.css',
    '/css/eq.css',
    '/css/mobile.css',
    '/script.js',
    '/manifest.json',
    '/assets/img/mc-logo.png',
    '/assets/img/logo.png',
    '/assets/img/logo_b.png',
    '/assets/img/favicon.png',
    '/assets/img/vumeter-new.png',
    '/assets/fontawesome7/css/all.min.css',
    '/assets/fontawesome7/webfonts/fa-solid-900.woff2',
    '/assets/fontawesome7/webfonts/fa-solid-900.ttf'
];

self.addEventListener('install', (event) => {
    console.log('[Service Worker] Installation…');

    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[Service Worker] Mise en cache des fichiers');
                return cache.addAll(ASSETS_TO_CACHE);
            })
            .then(() => {
                console.log('[Service Worker] Tous les fichiers sont en cache');
                return self.skipWaiting();
            })
            .catch((error) => {
                console.error('[Service Worker] Erreur lors de la mise en cache:', error);
            })
    );
});

self.addEventListener('activate', (event) => {
    console.log('[Service Worker] Activation…');

    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('[Service Worker] Suppression ancien cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => {
            console.log('[Service Worker] Service Worker activé');
            return self.clients.claim();
        })
    );
});

self.addEventListener('fetch', (event) => {
    if (event.request.url.startsWith('blob:') ||
        event.request.url.includes('audio-upload')) {
        return;
    }

    event.respondWith(
        caches.match(event.request)
            .then((cachedResponse) => {
                if (cachedResponse) {
                    console.log('[Service Worker] Réponse du cache:', event.request.url);
                    return cachedResponse;
                }

                console.log('[Service Worker] Requête réseau:', event.request.url);
                return fetch(event.request)
                    .then((response) => {
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }
                        const responseToCache = response.clone();

                        caches.open(CACHE_NAME)
                            .then((cache) => {
                                cache.put(event.request, responseToCache);
                            });

                        return response;
                    })
                    .catch((error) => {
                        console.error('[Service Worker] Erreur de fetch:', error);
                    });
            })
    );
});