// 此脚本用于优化CSS加载
// 将关键CSS内联到页面，并延迟加载非关键CSS

const fs = require('fs');

// 读取index.html文件
let indexContent = fs.readFileSync('index.html', 'utf8');

// 创建关键CSS内容
const criticalCSS = `
<style id="critical-css">
/* 关键CSS - 只包含首屏渲染所需的样式 */
body {
  font-family: 'Inter', sans-serif;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  color: #ffffff;
  line-height: 1.6;
  margin: 0;
  padding: 0;
}

.glass-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.gradient-text {
  background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* 导航样式 */
nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 50;
}

/* 首屏内容样式 */
#home {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  padding-top: 5rem;
}

/* 字体显示策略 */
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: local('Inter Regular'), local('Inter-Regular');
}

@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 700;
  font-display: swap;
  src: local('Inter Bold'), local('Inter-Bold');
}
</style>
`;

// 添加关键CSS到<head>
if (!indexContent.includes('id="critical-css"')) {
  indexContent = indexContent.replace('</head>', `${criticalCSS}\n</head>`);
}

// 添加CSS预加载
indexContent = indexContent.replace(
  /<link rel="stylesheet" href="([^"]+\.css)">/g,
  '<link rel="preload" href="$1" as="style" onload="this.onload=null;this.rel=\'stylesheet\'">\n' +
  '    <noscript><link rel="stylesheet" href="$1"></noscript>'
);

// 创建优化后的文件
fs.writeFileSync('index-css-optimized.html', indexContent, 'utf8');
console.log('已创建优化后的index-css-optimized.html文件，添加了关键CSS和CSS预加载');

// 创建CSS加载优化器
const cssLoaderCode = `
/* 用于非阻塞CSS加载的小型脚本 */
(function() {
  var loadCSS = function(href) {
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
  };
  
  // 在页面加载完成后加载非关键CSS
  window.addEventListener('load', function() {
    // 添加需要延迟加载的CSS
    // loadCSS('assets/css/non-critical.css');
  });
})();
`;

// 创建CSS加载优化器文件
fs.writeFileSync('assets/js/css-loader.js', cssLoaderCode, 'utf8');
console.log('已创建css-loader.js文件，用于优化CSS加载');