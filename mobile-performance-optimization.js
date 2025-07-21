const fs = require('fs');
const path = require('path');

console.log('开始移动端性能优化...');

// 1. 创建图片懒加载脚本（不影响现有功能）
const lazyLoadScript = `
<!-- 图片懒加载脚本 - 性能优化 -->
<script>
// 图片懒加载实现
document.addEventListener('DOMContentLoaded', function() {
    // 检查浏览器是否支持Intersection Observer
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                }
            });
        }, {
            rootMargin: '50px 0px',
            threshold: 0.01
        });

        // 观察所有带有lazy类的图片
        document.querySelectorAll('img.lazy').forEach(img => {
            imageObserver.observe(img);
        });
    } else {
        // 降级处理：直接加载所有图片
        document.querySelectorAll('img.lazy').forEach(img => {
            if (img.dataset.src) {
                img.src = img.dataset.src;
                img.classList.remove('lazy');
            }
        });
    }
});
</script>

<!-- 懒加载CSS样式 -->
<style>
img.lazy {
    opacity: 0;
    transition: opacity 0.3s;
}
img.lazy.loaded {
    opacity: 1;
}
</style>
`;

// 2. 创建关键CSS内联脚本
const criticalCSSOptimization = `
<!-- 关键CSS优化 -->
<style>
/* 关键路径CSS - 首屏内容样式 */
body {
    font-family: 'Inter', sans-serif;
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
    color: #ffffff;
    line-height: 1.6;
    margin: 0;
    padding: 0;
}

/* 导航栏关键样式 */
nav {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 50;
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    background: rgba(17, 24, 39, 0.8);
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

/* 英雄区域关键样式 */
#home {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;
    padding-top: 6rem;
}

.glass-card {
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(15px);
    -webkit-backdrop-filter: blur(15px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 20px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

/* 隐藏非关键内容直到加载完成 */
.non-critical {
    visibility: hidden;
}

.non-critical.loaded {
    visibility: visible;
}
</style>
`;

// 3. 创建字体优化
const fontOptimization = `
<!-- 字体优化 -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" media="print" onload="this.media='all'">
<noscript><link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet"></noscript>
`;

// 4. 创建资源预加载
const resourcePreloading = `
<!-- 资源预加载优化 -->
<link rel="preload" href="assets/css/main.min.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
<noscript><link rel="stylesheet" href="assets/css/main.min.css"></noscript>
<link rel="preload" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
<noscript><link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"></noscript>
`;

// 5. 创建JavaScript延迟加载
const jsOptimization = `
<!-- JavaScript优化加载 -->
<script>
// 延迟加载非关键JavaScript
function loadNonCriticalJS() {
    // 延迟加载Tailwind CSS
    if (!document.querySelector('script[src*="tailwindcss"]')) {
        const tailwindScript = document.createElement('script');
        tailwindScript.src = 'https://cdn.tailwindcss.com';
        tailwindScript.async = true;
        document.head.appendChild(tailwindScript);
    }
    
    // 延迟加载其他非关键脚本
    const scripts = [
        'assets/js/main.min.js',
        'assets/js/components.js'
    ];
    
    scripts.forEach(src => {
        if (!document.querySelector(\`script[src="\${src}"]\`)) {
            const script = document.createElement('script');
            script.src = src;
            script.async = true;
            document.body.appendChild(script);
        }
    });
    
    // 显示非关键内容
    document.querySelectorAll('.non-critical').forEach(el => {
        el.classList.add('loaded');
    });
}

// 页面加载完成后延迟加载非关键资源
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(loadNonCriticalJS, 100);
    });
} else {
    setTimeout(loadNonCriticalJS, 100);
}
</script>
`;

// 读取当前的index.html文件
let indexContent = '';
try {
    if (fs.existsSync('index-new.html')) {
        indexContent = fs.readFileSync('index-new.html', 'utf8');
        console.log('读取 index-new.html 文件');
    } else {
        indexContent = fs.readFileSync('index.html', 'utf8');
        console.log('读取 index.html 文件');
    }
} catch (error) {
    console.error('无法读取HTML文件:', error);
    process.exit(1);
}

// 应用优化
let optimizedContent = indexContent;

// 1. 在head标签中添加关键CSS和资源预加载
optimizedContent = optimizedContent.replace(
    /<link rel="stylesheet" href="assets\/css\/main\.min\.css">/,
    criticalCSSOptimization + '\n    ' + resourcePreloading
);

// 2. 优化字体加载
optimizedContent = optimizedContent.replace(
    /<link href="https:\/\/fonts\.googleapis\.com\/css2\?family=Inter[^>]*>/,
    fontOptimization
);

// 3. 在body结束标签前添加优化脚本
optimizedContent = optimizedContent.replace(
    /<\/body>/,
    lazyLoadScript + '\n' + jsOptimization + '\n</body>'
);

// 4. 为图片添加懒加载属性（仅对非关键图片）
// 保留英雄区域的图片正常加载，只对其他区域的图片应用懒加载
const heroSectionEnd = optimizedContent.indexOf('</section>', optimizedContent.indexOf('id="home"'));
if (heroSectionEnd !== -1) {
    const beforeHero = optimizedContent.substring(0, heroSectionEnd);
    const afterHero = optimizedContent.substring(heroSectionEnd);
    
    // 只对英雄区域之后的图片应用懒加载
    const optimizedAfterHero = afterHero.replace(
        /<img([^>]*?)src="([^"]*)"([^>]*?)>/g,
        '<img$1data-src="$2" src="data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 1 1\'%3E%3C/svg%3E" class="lazy"$3>'
    );
    
    optimizedContent = beforeHero + optimizedAfterHero;
}

// 5. 移除Tailwind CSS的同步加载（改为异步）
optimizedContent = optimizedContent.replace(
    /<script src="https:\/\/cdn\.tailwindcss\.com"><\/script>/,
    '<!-- Tailwind CSS will be loaded asynchronously -->'
);

// 6. 添加性能监控脚本
const performanceMonitoring = `
<script>
// 性能监控（仅在开发环境中启用）
if (window.location.hostname === 'localhost' || window.location.hostname.includes('dev')) {
    window.addEventListener('load', function() {
        setTimeout(function() {
            if ('performance' in window) {
                const perfData = performance.getEntriesByType('navigation')[0];
                console.log('页面加载性能数据:');
                console.log('DOM内容加载时间:', perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart, 'ms');
                console.log('页面完全加载时间:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
                console.log('首次内容绘制时间:', performance.getEntriesByName('first-contentful-paint')[0]?.startTime || 'N/A');
            }
        }, 1000);
    });
}
</script>
`;

optimizedContent = optimizedContent.replace(
    /<\/body>/,
    performanceMonitoring + '\n</body>'
);

// 保存优化后的文件
const outputFileName = fs.existsSync('index-new.html') ? 'index-optimized.html' : 'index-mobile-optimized.html';
fs.writeFileSync(outputFileName, optimizedContent, 'utf8');

console.log(\`优化完成！已保存为: \${outputFileName}\`);
console.log('');
console.log('优化内容包括:');
console.log('✓ 图片懒加载（仅非关键图片）');
console.log('✓ 关键CSS内联');
console.log('✓ 字体异步加载');
console.log('✓ JavaScript延迟加载');
console.log('✓ 资源预加载');
console.log('✓ 性能监控（开发环境）');
console.log('');
console.log('注意事项:');
console.log('- 英雄区域的图片保持正常加载以确保LCP性能');
console.log('- 所有现有功能保持不变');
console.log('- 优化是渐进式的，不支持的浏览器会降级处理');
console.log('- 建议在部署前进行测试');