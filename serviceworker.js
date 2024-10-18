var CACHE_NAME = 'my-site-cache-v1';
var urlsToCache = [
    '/',
    '/style.css',
    '/script.js',
    '/index.html',
    '/manifest.json',
];

// インストール時のキャッシュ
self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(CACHE_NAME).then(function(cache) {
            console.log('キャッシュを作成中');
            return cache.addAll(urlsToCache).catch(function(err) {
                console.error('キャッシュに失敗しました: ', err);
            });
        })
    );
});

// キャッシュの有効化
self.addEventListener('activate', function(event) {
    var cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.map(function(cacheName) {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        // 古いキャッシュを削除
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// リソースのフェッチ処理
self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request)
            .then(function(response) {
                // キャッシュヒット時はキャッシュから返す
                if (response) {
                    return response;
                }
                // キャッシュがなければ、ネットワークリクエストを実行
                return fetch(event.request).catch(() => {
                    return caches.match('/offline.html');  // オフライン時にオフラインページを表示
                });
            })
    );
});
