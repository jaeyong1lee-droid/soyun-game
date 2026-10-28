const CACHE_NAME = 'soyun-obby-racer-pwa-v73';
const PRECACHE_URLS = [
  './',
  './index.html',
  './manifest.json',
  './css/style.css?v=70_69',
  './js/config.js?v=70_69',
  './js/storage.js?v=70_69',
  './js/questionEngine.js?v=70_69',
  './js/sound.js?v=70_69',
  './js/engine3d.js?v=70_69',
  './js/ui.js?v=70_69',
  './js/game.js?v=70_69',
  'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js',
  './assets/icon-192.png',
  './assets/icon-512.png',
  './assets/boss_mecha.png',
  './assets/soyun_roblox_hero.png',
  './assets/bg_skybox.png',
  './assets/player_car.png'
];

self.addEventListener('install', function (event) {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll(PRECACHE_URLS).catch(function () {});
    })
  );
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(
        keys.map(function (key) {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(function () {
      return self.clients.claim();
    })
  );
});

// High-Performance Mobile Caching Strategy:
// 1. Navigation (index.html): Network first with 1.2s timeout -> Instant local cache fallback
// 2. Static Assets (scripts, styles, images, Three.js): Cache-First + Stale-While-Revalidate
self.addEventListener('fetch', function (event) {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.pathname.startsWith('/api/')) return;

  const isNavigation = event.request.mode === 'navigate' || url.pathname === '/' || url.pathname.endsWith('/index.html');

  if (isNavigation) {
    event.respondWith(
      new Promise(function (resolve) {
        var didResolve = false;
        var timerId = setTimeout(function () {
          if (!didResolve) {
            didResolve = true;
            caches.match('./index.html').then(function (cached) {
              if (cached) resolve(cached);
              else fetch(event.request).then(resolve).catch(resolve);
            });
          }
        }, 1200);

        fetch(event.request)
          .then(function (networkRes) {
            if (!didResolve) {
              didResolve = true;
              clearTimeout(timerId);
              if (networkRes && networkRes.status === 200) {
                var clone = networkRes.clone();
                caches.open(CACHE_NAME).then(function (cache) {
                  cache.put(event.request, clone).catch(function () {});
                });
              }
              resolve(networkRes);
            }
          })
          .catch(function () {
            if (!didResolve) {
              didResolve = true;
              clearTimeout(timerId);
              caches.match('./index.html').then(function (cached) {
                resolve(cached || caches.match('/'));
              });
            }
          });
      })
    );
    return;
  }

  // Static Assets: Instant Cache-First response with background revalidation
  event.respondWith(
    caches.match(event.request).then(function (cachedRes) {
      var fetchPromise = fetch(event.request).then(function (networkRes) {
        if (networkRes && networkRes.status === 200 && (url.origin === self.location.origin || url.hostname.includes('cdnjs'))) {
          var clone = networkRes.clone();
          caches.open(CACHE_NAME).then(function (cache) {
            cache.put(event.request, clone).catch(function () {});
          });
        }
        return networkRes;
      }).catch(function () {
        return cachedRes;
      });

      return cachedRes || fetchPromise;
    })
  );
});
