const staticCache = 'static-cache';
const dynamicCache = 'dynamic-cache';
const assets = [
    '/',
    '/index.html',
    '/js/app.js',
    '/js/ui.js',
    '/js/materialize.min.js',
    '/css/materialize.min.css',
    'https://fonts.googleapis.com/icon?family=Material+Icons',
    'https://fonts.gstatic.com/s/materialicons/v47/flUhRq6tzZclQEJ-Vdg-IuiaDsNcIhQ8tQ.woff2',
    '/pages/fallback.html'
]

const limitNumCache = (cacheName, num) => {
    caches.open(cacheName).then(cache => {
        cache.keys().then(keys => {
            if (keys.length > num) {
                cache.delete(keys[0]).then(limitNumCache(cacheName, num))
            }
        })
    })
}

// install process
self.addEventListener('install', e => {
    console.log('sw is installed', e)
    caches.open(staticCache).then(cache => {
        cache.addAll(assets)
    })
})

// activate
self.addEventListener('activate', e => {
    console.log('sw is activated', e)
})

// fetch
self.addEventListener('fetch', e => {
    console.log('sw fetch event', e)
    if (e.request.url.indexOf('firestore.googleapis.com') === -1) {
        e.respondWith(
            caches.match(e.request).then(staticRes => {
                return staticRes || fetch(e.request).then(dynamicRes => {
                    return caches.open(dynamicCache).then(cache => {
                        cache.put(e.request.url, dynamicRes.clone())
                        limitNumCache(dynamicCache, 10)
                        return dynamicRes
                    })
                })
            }).catch(() => caches.match('/pages/fallback.html'))
        )
    }
})