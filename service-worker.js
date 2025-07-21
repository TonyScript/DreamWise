// DreamWise Service Worker
const CACHE_NAME = 'dreamwise-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/browse.html',
  '/categories.html',
  '/insights.html',
  '/assets/css/main.min.css',
  '/assets/js/main.min.js',
  '/assets/js/components.js',
  // 添加其他关键资源
];

// 安装 Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// 网络请求拦截
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // 缓存命中，返回缓存的资源
        if (response) {
          return response;
        }
        
        // 克隆请求，因为请求只能使用一次
        const fetchRequest = event.request.clone();
        
        return fetch(fetchRequest).then(response => {
          // 检查响应是否有效
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
          
          // 克隆响应，因为响应体只能使用一次
          const responseToCache = response.clone();
          
          // 将新响应添加到缓存
          caches.open(CACHE_NAME).then(cache => {
            // 只缓存同源资源
            if (event.request.url.startsWith(self.location.origin)) {
              cache.put(event.request, responseToCache);
            }
          });
          
          return response;
        });
      })
  );
});

// 激活时清理旧缓存
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
