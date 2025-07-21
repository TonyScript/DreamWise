/**
 * DreamWise 网站性能优化脚本
 * 
 * 此脚本将实施以下优化：
 * 1. 消除渲染阻塞资源
 * 2. 优化字体加载
 * 3. 减少布局偏移
 * 4. 优化第三方资源加载
 */

const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);

// 主要 HTML 文件列表
const htmlFiles = [
  'index.html',
  'insights.html',
  'browse.html',
  'categories.html'
];

// 优化 HTML 文件
async function optimizeHtmlFiles() {
  console.log('开始优化 HTML 文件...');
  
  for (const file of htmlFiles) {
    try {
      console.log(`处理文件: ${file}`);
      const filePath = path.join(process.cwd(), file);
      
      if (!fs.existsSync(filePath)) {
        console.log(`文件不存在: ${filePath}`);
        continue;
      }
      
      let content = await readFileAsync(filePath, 'utf8');
      
      // 1. 优化 CSS 加载 - 添加 preload 和 async 加载
      content = optimizeCssLoading(content);
      
      // 2. 优化字体加载 - 添加 font-display: swap
      content = optimizeFontLoading(content);
      
      // 3. 延迟加载非关键 JavaScript
      content = optimizeJsLoading(content);
      
      // 4. 添加资源提示
      content = addResourceHints(content);
      
      // 保存优化后的文件
      await writeFileAsync(filePath, content, 'utf8');
      console.log(`文件已优化: ${file}`);
    } catch (error) {
      console.error(`处理文件 ${file} 时出错:`, error);
    }
  }
  
  console.log('HTML 文件优化完成');
}

// 优化 CSS 加载
function optimizeCssLoading(html) {
  // 1. 提取关键 CSS 并内联
  // 这里我们只添加 preload，实际提取关键 CSS 需要更复杂的工具
  
  // 2. 为主要样式表添加 preload
  html = html.replace(
    /<link rel="stylesheet" href="(assets\/css\/main\.min\.css)">/g,
    '<link rel="preload" href="$1" as="style" onload="this.onload=null;this.rel=\'stylesheet\'">\n' +
    '    <noscript><link rel="stylesheet" href="$1"></noscript>'
  );
  
  // 3. 为 Font Awesome 添加 preload 但使用 media="print" 和 onload 技术延迟加载
  html = html.replace(
    /<link rel="stylesheet" href="(https:\/\/cdnjs\.cloudflare\.com\/ajax\/libs\/font-awesome\/.*?\/css\/all\.min\.css)">/g,
    '<link rel="stylesheet" href="$1" media="print" onload="this.media=\'all\'">\n' +
    '    <noscript><link rel="stylesheet" href="$1"></noscript>'
  );
  
  return html;
}

// 优化字体加载
function optimizeFontLoading(html) {
  // 1. 添加 font-display: swap 到 Google Fonts URL
  html = html.replace(
    /<link href="(https:\/\/fonts\.googleapis\.com\/css2\?.*?)" rel="stylesheet">/g,
    '<link href="$1&display=swap" rel="stylesheet">'
  );
  
  // 2. 预加载字体文件
  if (!html.includes('preconnect" href="https://fonts.gstatic.com"')) {
    const fontPreconnect = '    <link rel="preconnect" href="https://fonts.googleapis.com">\n' +
                          '    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>';
    
    // 如果已经有 preconnect，不要重复添加
    if (!html.includes('preconnect" href="https://fonts.googleapis.com"')) {
      html = html.replace(
        /<link rel="preconnect" href="https:\/\/fonts\.googleapis\.com">/,
        fontPreconnect
      );
    }
  }
  
  // 3. 添加字体加载 CSS
  const fontDisplayStyle = `
    <style>
      /* 优化字体加载 */
      @font-face {
        font-family: 'Inter';
        font-style: normal;
        font-weight: 400;
        font-display: swap;
        src: local('Inter Regular'), local('Inter-Regular'), url(https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiJ-Ek-_EeA.woff2) format('woff2');
        unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
      }
    </style>`;
  
  // 在 </head> 前添加字体加载样式
  if (!html.includes('font-display: swap')) {
    html = html.replace('</head>', `${fontDisplayStyle}\n</head>`);
  }
  
  return html;
}

// 优化 JavaScript 加载
function optimizeJsLoading(html) {
  // 1. 为非关键脚本添加 defer 或 async
  html = html.replace(
    /<script src="(assets\/js\/main\.min\.js)"><\/script>/g,
    '<script src="$1" defer></script>'
  );
  
  html = html.replace(
    /<script src="(assets\/js\/components\.js)"><\/script>/g,
    '<script src="$1" defer></script>'
  );
  
  // 2. 内联关键 JavaScript
  // 这里我们不做实际的内联，因为需要分析哪些是关键 JS
  
  // 3. 优化 Tailwind 加载
  html = html.replace(
    /<script src="https:\/\/cdn\.tailwindcss\.com"><\/script>/g,
    '<script src="https://cdn.tailwindcss.com" defer></script>'
  );
  
  return html;
}

// 添加资源提示
function addResourceHints(html) {
  // 添加 preconnect 和 dns-prefetch
  const resourceHints = `
    <!-- 资源提示 -->
    <link rel="preconnect" href="https://cdn.tailwindcss.com">
    <link rel="dns-prefetch" href="https://cdn.tailwindcss.com">
    <link rel="preconnect" href="https://cdnjs.cloudflare.com">
    <link rel="dns-prefetch" href="https://cdnjs.cloudflare.com">`;
  
  // 检查是否已经有这些提示
  if (!html.includes('preconnect" href="https://cdn.tailwindcss.com"')) {
    html = html.replace('<head>', '<head>' + resourceHints);
  }
  
  return html;
}

// 创建优化后的 CSS 文件
async function createOptimizedCss() {
  console.log('创建优化后的 CSS 文件...');
  
  try {
    // 创建 assets/css 目录（如果不存在）
    const cssDir = path.join(process.cwd(), 'assets', 'css');
    if (!fs.existsSync(cssDir)) {
      fs.mkdirSync(cssDir, { recursive: true });
    }
    
    // 读取现有的 CSS 文件（如果存在）
    let mainCss = '';
    const mainCssPath = path.join(cssDir, 'main.min.css');
    
    if (fs.existsSync(mainCssPath)) {
      mainCss = await readFileAsync(mainCssPath, 'utf8');
    }
    
    // 添加性能优化相关的 CSS
    const optimizedCss = `
/* 性能优化 CSS */

/* 减少布局偏移 */
img, video, iframe {
  max-width: 100%;
  height: auto;
  aspect-ratio: attr(width) / attr(height);
}

/* 预定义元素尺寸，减少布局偏移 */
.glass-card {
  contain: layout style paint;
}

/* 优化动画性能 */
.floating, .floating-slow, .floating-medium {
  will-change: transform;
  transform: translateZ(0);
}

/* 优化滚动性能 */
html {
  scroll-behavior: smooth;
}

/* 现有 CSS 内容 */
${mainCss}
`;
    
    // 写入优化后的 CSS
    await writeFileAsync(mainCssPath, optimizedCss, 'utf8');
    console.log('CSS 文件优化完成');
    
  } catch (error) {
    console.error('创建优化后的 CSS 文件时出错:', error);
  }
}

// 创建图像优化脚本
async function createImageOptimizationScript() {
  console.log('创建图像优化脚本...');
  
  const scriptContent = `#!/bin/bash

# 图像优化脚本
# 需要安装: npm install -g sharp-cli

echo "开始优化图像..."

# 创建优化后的图像目录
mkdir -p assets/images/optimized

# 优化 JPG/JPEG 图像
find assets/images -type f \\( -name "*.jpg" -o -name "*.jpeg" \\) -print0 | while IFS= read -r -d '' file; do
  filename=$(basename "$file")
  echo "优化 JPEG: $filename"
  sharp "$file" -o "assets/images/optimized/$filename" --quality 80
done

# 优化 PNG 图像
find assets/images -type f -name "*.png" -print0 | while IFS= read -r -d '' file; do
  filename=$(basename "$file")
  echo "优化 PNG: $filename"
  sharp "$file" -o "assets/images/optimized/$filename" --quality 80
done

# 将 PNG 转换为 WebP
find assets/images -type f -name "*.png" -print0 | while IFS= read -r -d '' file; do
  filename=$(basename "$file" .png)
  echo "转换为 WebP: $filename.webp"
  sharp "$file" -o "assets/images/optimized/$filename.webp" --webp
done

# 将 JPG 转换为 WebP
find assets/images -type f \\( -name "*.jpg" -o -name "*.jpeg" \\) -print0 | while IFS= read -r -d '' file; do
  filename=$(basename "$file" | sed 's/\\.[^.]*$//')
  echo "转换为 WebP: $filename.webp"
  sharp "$file" -o "assets/images/optimized/$filename.webp" --webp
done

echo "图像优化完成"
`;
  
  const scriptPath = path.join(process.cwd(), 'optimize-images.sh');
  await writeFileAsync(scriptPath, scriptContent, 'utf8');
  fs.chmodSync(scriptPath, '755'); // 添加执行权限
  
  console.log('图像优化脚本已创建: optimize-images.sh');
}

// 创建 JavaScript 优化脚本
async function createJsOptimizationScript() {
  console.log('创建 JavaScript 优化脚本...');
  
  const scriptContent = `/**
 * JavaScript 优化脚本
 * 
 * 使用方法:
 * 1. 安装依赖: npm install terser --save-dev
 * 2. 运行脚本: node optimize-js.js
 */

const fs = require('fs');
const path = require('path');
const { minify } = require('terser');

// 要优化的 JS 文件
const jsFiles = [
  'assets/js/main.js',
  'assets/js/components.js'
];

// 优化 JavaScript 文件
async function optimizeJs() {
  for (const file of jsFiles) {
    try {
      console.log(\`处理文件: \${file}\`);
      const filePath = path.join(process.cwd(), file);
      
      if (!fs.existsSync(filePath)) {
        console.log(\`文件不存在: \${filePath}\`);
        continue;
      }
      
      // 读取文件内容
      const code = fs.readFileSync(filePath, 'utf8');
      
      // 使用 Terser 压缩代码
      const result = await minify(code, {
        compress: {
          drop_console: false,  // 保留 console 语句
          dead_code: true,      // 删除无法访问的代码
          conditionals: true,   // 优化 if 语句
          comparisons: true,    // 优化比较操作
          evaluate: true,       // 尝试评估常量表达式
          booleans: true,       // 优化布尔表达式
          loops: true,          // 优化循环
          unused: true,         // 删除未使用的变量和函数
          toplevel: true,       // 顶级作用域优化
          hoist_funs: true,     // 提升函数声明
          hoist_vars: false,    // 不提升变量声明（可能增加代码大小）
        },
        mangle: true,           // 缩短变量名
        output: {
          beautify: false,      // 不美化输出
          comments: false       // 删除注释
        }
      });
      
      if (result.code) {
        // 创建 .min.js 文件
        const minFilePath = filePath.replace('.js', '.min.js');
        fs.writeFileSync(minFilePath, result.code, 'utf8');
        console.log(\`已创建优化文件: \${minFilePath}\`);
      }
    } catch (error) {
      console.error(\`处理文件 \${file} 时出错:\`, error);
    }
  }
}

// 执行优化
optimizeJs().then(() => {
  console.log('JavaScript 优化完成');
}).catch(err => {
  console.error('优化过程中出错:', err);
});
`;
  
  const scriptPath = path.join(process.cwd(), 'optimize-js.js');
  await writeFileAsync(scriptPath, scriptContent, 'utf8');
  
  console.log('JavaScript 优化脚本已创建: optimize-js.js');
}

// 创建 Service Worker 脚本
async function createServiceWorker() {
  console.log('创建 Service Worker 脚本...');
  
  const swContent = `// DreamWise Service Worker
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
`;
  
  const swPath = path.join(process.cwd(), 'service-worker.js');
  await writeFileAsync(swPath, swContent, 'utf8');
  
  // 创建 Service Worker 注册脚本
  const swRegisterContent = `// 注册 Service Worker
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
}`;
  
  const swRegisterPath = path.join(process.cwd(), 'assets', 'js', 'sw-register.js');
  
  // 确保目录存在
  const swRegisterDir = path.dirname(swRegisterPath);
  if (!fs.existsSync(swRegisterDir)) {
    fs.mkdirSync(swRegisterDir, { recursive: true });
  }
  
  await writeFileAsync(swRegisterPath, swRegisterContent, 'utf8');
  
  console.log('Service Worker 脚本已创建: service-worker.js');
  console.log('Service Worker 注册脚本已创建: assets/js/sw-register.js');
}

// 主函数
async function main() {
  console.log('开始优化 DreamWise 网站性能...');
  
  try {
    // 1. 优化 HTML 文件
    await optimizeHtmlFiles();
    
    // 2. 创建优化后的 CSS
    await createOptimizedCss();
    
    // 3. 创建图像优化脚本
    await createImageOptimizationScript();
    
    // 4. 创建 JavaScript 优化脚本
    await createJsOptimizationScript();
    
    // 5. 创建 Service Worker
    await createServiceWorker();
    
    console.log('网站性能优化完成！');
    console.log('\n后续步骤:');
    console.log('1. 运行 optimize-images.sh 脚本优化图像');
    console.log('2. 安装 terser 并运行 optimize-js.js 脚本优化 JavaScript');
    console.log('3. 在 HTML 文件中添加 Service Worker 注册脚本');
    console.log('4. 测试网站性能');
  } catch (error) {
    console.error('优化过程中出错:', error);
  }
}

// 执行主函数
main();