// 注册 Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(registration => {
        console.log('ServiceWorker 注册成功:', registration.scope);
      })
      .catch(error => {
        console.log('ServiceWorker 注册失败:', error);
      });
  });
}