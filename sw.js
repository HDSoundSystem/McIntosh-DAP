const CACHE_VERSION = '3.5.2';
const CACHE_NAME = `McIntosh-DAP-${CACHE_VERSION}`;

// Static assets — cached at install time, served from cache (cache-first)
const STATIC_ASSETS = [
    '/style.css',
    '/script.js',
    '/js/component-loader.js',
    '/js/mcintosh-audio-engine.js',
    '/js/vu-meter.js',
    '/manifest.json',
    '/components/controls.html',
    '/components/display-area.html',
    '/components/drop.html',
    '/components/info.html',
    '/components/meter-section.html',
    '/components/modals.html',
    '/components/options-menu.html',
    '/css/root.css',
    '/css/chassis.css',
    '/css/meters.css',
    '/css/display.css',
    '/css/controls.css',
    '/css/states.css',
    '/css/modals.css',
    '/css/eq.css',
    '/css/mobile.css',
    '/css/overlay.css',
    '/css/info.css',
    '/css/door.css',
    '/assets/img/mc-logo.png',
    '/assets/img/mc-logo-black.jpg',
    '/assets/img/logo.png',
    '/assets/img/logo_b.png',
    '/assets/img/logo_cover.png',
    '/assets/img/favicon.png',
    '/assets/img/favicon.ico',
    '/assets/img/McIntosh_Logo_Black_G.png',
    '/assets/img/McIntosh_Logo_Black.png',
    '/assets/img/McIntosh_Logo_White.png',
    '/assets/img/McIntosh_brush.png',
    '/assets/img/DD_overlay_logo_mc.png',
    '/assets/img/vumeter.png',
    '/assets/windows/play.png',
    '/assets/windows/pause.png',
    '/assets/windows/prev.png',
    '/assets/windows/next.png',
    '/assets/windows/stop.png'
];

// ─── INSTALL ──────────────────────────────────────────────────────────────────
// Cache all static assets on install.
// If any single file fails, the entire installation fails — every path must be exact.
self.addEventListener('install', (event) => {
    console.log(`[SW] Install — cache ${CACHE_NAME}`);
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(STATIC_ASSETS))
            .then(() => {
                console.log('[SW] All assets cached');
                return self.skipWaiting(); // Activate immediately without waiting for tabs to close
            })
            .catch((err) => console.error('[SW] Install error:', err))
    );
});

// ─── ACTIVATE ─────────────────────────────────────────────────────────────────
// Delete old caches from previous versions.
self.addEventListener('activate', (event) => {
    console.log(`[SW] Activate — cache ${CACHE_NAME}`);
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => Promise.all(
                cacheNames
                    .filter((name) => name !== CACHE_NAME)
                    .map((name) => {
                        console.log('[SW] Deleting old cache:', name);
                        return caches.delete(name);
                    })
            ))
            .then(() => self.clients.claim()) // Take control of open tabs immediately
    );
});

// ─── FETCH ────────────────────────────────────────────────────────────────────
self.addEventListener('fetch', (event) => {
    const url = event.request.url;

    // Ignore non-GET requests and special URLs
    if (event.request.method !== 'GET') return;
    if (url.startsWith('blob:')) return;
    if (url.startsWith('chrome-extension:')) return;
    if (url.includes('goatcounter') || url.includes('googletagmanager')) return;

    const requestURL = new URL(url);

    // ── NETWORK-FIRST strategy for index.html ─────────────────────────────────
    // Always try the network first to get the latest version.
    // Falls back to cache when offline.
    if (requestURL.pathname === '/' || requestURL.pathname === '/index.html') {
        event.respondWith(
            fetch(event.request)
                .then((response) => {
                    const clone = response.clone();
                    caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
                    return response;
                })
                .catch(() => caches.match('/index.html'))
        );
        return;
    }

    // ── CACHE-FIRST strategy for all static assets ────────────────────────────
    // Serve from cache if available, otherwise fetch from network and cache dynamically.
    event.respondWith(
        caches.match(event.request)
            .then((cachedResponse) => {
                if (cachedResponse) return cachedResponse;

                return fetch(event.request)
                    .then((response) => {
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }
                        const clone = response.clone();
                        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
                        return response;
                    })
                    .catch((err) => console.error('[SW] Fetch error:', err));
            })
    );
});
