const CACHE_NAME = 'ecommerce-pwa-v1';
const urlsToCache = [
    '/',
    'index.html',
    'index-2.html',
    'index-3.html',
    'index-4.html',
    'index-5.html',
    'login.html',
    'cart.html',
    'blog.html',
    'about.html',
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                return cache.addAll(urlsToCache);
            })
    );
    console.log('Service Worker: Installed');
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    console.log('Service Worker: Activated');
});

self.addEventListener('fetch', event => {
    console.log('Service Worker: Fetching');
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                if (response) {
                    console.log('Service Worker: Found in Cache');
                    return response;
                }
                return fetch(event.request)
                    .then(response => {
                        if (!response || response.status !== 200 ||
                            response.type !== 'basic') {
                            return response;
                        }
                        const responseToCache = response.clone();
                        caches.open(CACHE_NAME)
                            .then(cache => {
                                cache.put(event.request, responseToCache);
                            });
                        return response;
                    });
            })
    );
});

self.addEventListener('sync', event => {
    if (event.tag === 'sync-data') {
        console.log('Service Worker: Sync event triggered');
        // Handle sync event
        // Perform actions such as syncing data with the server
    }
});

self.addEventListener('push', event => {
    console.log('Service Worker: Push event received', event);
    const title = 'E-commerce PWA';
    const options = {
        body: 'New content is available!',
        icon: 'icon.png',
        badge: 'badge.png'
    };
    event.waitUntil(
        self.registration.showNotification(title, options)
    );
});
