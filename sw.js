// McIntosh DAP - Service Worker
// Version 1.0.0

const CACHE_NAME = 'McIntosh-DAP';
const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/style.css',
    // Nouveaux fichiers CSS modulaires
    '/css/root.css',
    '/css/chassis.css',
    '/css/meters.css',
    '/css/display.css',
    '/css/controls.css',
    '/css/states.css',
    '/css/modals.css',
    '/css/eq.css',
    '/css/mobile.css',
    // Scripts
    '/script.js',
    '/manifest.json',
    // Images
    '/assets/img/mc-logo.png',
    '/assets/img/logo.png',
    '/assets/img/logo_b.png',
    '/assets/img/favicon.png',
    '/assets/img/vumeter-new.png',
    '/assets/img/vumeter-new-off.png',
    '/assets/info/info3.png',
    // FontAwesome
    '/assets/fontawesome7/css/all.min.css',
    '/assets/fontawesome7/webfonts/fa-solid-900.woff2',
    '/assets/fontawesome7/webfonts/fa-solid-900.ttf'
];

// Installation du Service Worker
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

// Activation du Service Worker
self.addEventListener('activate', (event) => {
    console.log('[Service Worker] Activation…');
    
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    // Supprime les anciens caches
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

// Interception des requêtes réseau
self.addEventListener('fetch', (event) => {
    // Ne pas mettre en cache les fichiers audio uploadés par l'utilisateur
    if (event.request.url.startsWith('blob:') ||
        event.request.url.includes('audio-upload')) {
        return;
    }
    
    event.respondWith(
        caches.match(event.request)
            .then((cachedResponse) => {
                // Retourne la version en cache si disponible
                if (cachedResponse) {
                    console.log('[Service Worker] Réponse du cache:', event.request.url);
                    return cachedResponse;
                }

                // Sinon, fait une requête réseau
                console.log('[Service Worker] Requête réseau:', event.request.url);
                return fetch(event.request)
                    .then((response) => {
                        // Vérifie que la réponse est valide
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }

                        // Clone la réponse car elle ne peut être consommée qu'une fois
                        const responseToCache = response.clone();

                        caches.open(CACHE_NAME)
                            .then((cache) => {
                                cache.put(event.request, responseToCache);
                            });

                        return response;
                    })
                    .catch((error) => {
                        console.error('[Service Worker] Erreur de fetch:', error);
                        // Tu peux retourner une page d'erreur personnalisée ici
                    });
            })
    );
});