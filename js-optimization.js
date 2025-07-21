// 此脚本用于优化JavaScript加载
// 添加defer属性到非关键JavaScript

const fs = require('fs');

// 读取index.html文件
let indexContent = fs.readFileSync('index.html', 'utf8');

// 添加defer属性到非关键脚本
indexContent = indexContent.replace(
  /<script src="((?!main\.min\.js|components\.js)[^"]+\.js)">/g, 
  '<script src="$1" defer>'
);

// 创建优化后的文件
fs.writeFileSync('index-js-optimized.html', indexContent, 'utf8');
console.log('已创建优化后的index-js-optimized.html文件，添加了defer属性到非关键脚本');

// 创建一个脚本加载优化器
const scriptLoaderCode = `
// 脚本加载优化器
document.addEventListener('DOMContentLoaded', function() {
  // 延迟加载非关键脚本
  function loadDeferredScripts() {
    const deferredScripts = [
      // 添加需要延迟加载的脚本路径
      'assets/js/faith-switcher.min.js',
      // 添加其他非关键脚本
    ];
    
    deferredScripts.forEach(function(src) {
      const script = document.createElement('script');
      script.src = src;
      document.body.appendChild(script);
    });
  }
  
  // 使用requestIdleCallback在浏览器空闲时加载脚本
  if ('requestIdleCallback' in window) {
    requestIdleCallback(loadDeferredScripts);
  } else {
    // 回退方案
    setTimeout(loadDeferredScripts, 2000);
  }
});
`;

// 创建脚本加载优化器文件
fs.writeFileSync('assets/js/script-loader.js', scriptLoaderCode, 'utf8');
console.log('已创建script-loader.js文件，用于优化脚本加载');