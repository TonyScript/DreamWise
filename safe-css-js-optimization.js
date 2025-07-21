const fs = require('fs');
const path = require('path');

console.log('开始安全的CSS和JavaScript优化...');

// 优化CSS加载
function optimizeCSSLoading() {
    console.log('正在优化CSS加载...');
    
    const htmlFiles = fs.readdirSync('.').filter(file => file.endsWith('.html'));
    
    htmlFiles.forEach(file => {
        let content = fs.readFileSync(file, 'utf8');
        let modified = false;
        
        // 1. 为非关键CSS添加media="print" onload技巧
        const cssLinkRegex = /<link rel="stylesheet" href="([^"]*?)"([^>]*?)>/g;
        content = content.replace(cssLinkRegex, (match, href, attrs) => {
            // 跳过已经优化的CSS链接
            if (match.includes('onload=') || match.includes('media="print"')) {
                return match;
            }
            
            // 跳过关键CSS（主要样式文件保持同步加载）
            if (href.includes('main.min.css') || href.includes('main.css')) {
                return match;
            }
            
            // 为其他CSS文件添加异步加载
            modified = true;
            return `<link rel="preload" href="${href}" as="style" onload="this.onload=null;this.rel='stylesheet'"${attrs}>
<noscript><link rel="stylesheet" href="${href}"${attrs}></noscript>`;
        });
        
        if (modified) {
            fs.writeFileSync(file, content, 'utf8');
            console.log(`已优化CSS加载: ${file}`);
        }
    });
}

// 优化JavaScript加载
function optimizeJavaScriptLoading() {
    console.log('正在优化JavaScript加载...');
    
    const htmlFiles = fs.readdirSync('.').filter(file => file.endsWith('.html'));
    
    htmlFiles.forEach(file => {
        let content = fs.readFileSync(file, 'utf8');
        let modified = false;
        
        // 为JavaScript添加defer属性（保持执行顺序）
        const scriptRegex = /<script([^>]*?)src="([^"]*?)"([^>]*?)><\/script>/g;
        content = content.replace(scriptRegex, (match, before, src, after) => {
            // 跳过已经有defer、async或type="module"的脚本
            if (match.includes('defer') || match.includes('async') || match.includes('type="module"')) {
                return match;
            }
            
            // 跳过关键脚本（CDN脚本如Tailwind CSS）
            if (src.includes('cdn.') || src.includes('tailwindcss')) {
                return match;
            }
            
            // 跳过内联配置脚本
            if (before.includes('tailwind.config')) {
                return match;
            }
            
            // 为其他脚本添加defer
            modified = true;
            return `<script${before}src="${src}"${after} defer></script>`;
        });
        
        if (modified) {
            fs.writeFileSync(file, content, 'utf8');
            console.log(`已优化JavaScript加载: ${file}`);
        }
    });
}

// 添加关键资源预加载
function addCriticalResourcePreload() {
    console.log('正在添加关键资源预加载...');
    
    const htmlFiles = fs.readdirSync('.').filter(file => file.endsWith('.html'));
    
    htmlFiles.forEach(file => {
        let content = fs.readFileSync(file, 'utf8');
        let modified = false;
        
        // 添加字体预加载
        if (content.includes('fonts.googleapis.com') && !content.includes('rel="preload"')) {
            const fontPreload = `
    <!-- 字体预加载 -->
    <link rel="preload" href="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2" as="font" type="font/woff2" crossorigin>`;
            
            content = content.replace('<head>', `<head>${fontPreload}`);
            modified = true;
        }
        
        if (modified) {
            fs.writeFileSync(file, content, 'utf8');
            console.log(`已添加关键资源预加载: ${file}`);
        }
    });
}

// 优化第三方脚本加载
function optimizeThirdPartyScripts() {
    console.log('正在优化第三方脚本加载...');
    
    const htmlFiles = fs.readdirSync('.').filter(file => file.endsWith('.html'));
    
    htmlFiles.forEach(file => {
        let content = fs.readFileSync(file, 'utf8');
        let modified = false;
        
        // 为第三方脚本添加预连接
        if (!content.includes('rel="preconnect" href="https://cdnjs.cloudflare.com"')) {
            const preconnects = `
    <!-- 第三方资源预连接 -->
    <link rel="preconnect" href="https://cdnjs.cloudflare.com">
    <link rel="preconnect" href="https://cdn.tailwindcss.com">`;
            
            content = content.replace('<head>', `<head>${preconnects}`);
            modified = true;
        }
        
        if (modified) {
            fs.writeFileSync(file, content, 'utf8');
            console.log(`已优化第三方脚本: ${file}`);
        }
    });
}

// 创建内联关键CSS（仅对首页）
function inlineCriticalCSS() {
    console.log('正在为首页内联关键CSS...');
    
    if (fs.existsSync('index.html')) {
        let content = fs.readFileSync('index.html', 'utf8');
        
        // 检查是否已经有内联CSS
        if (!content.includes('/* 关键CSS内联 */')) {
            const criticalCSS = `
    <style>
        /* 关键CSS内联 */
        body { 
            font-family: 'Inter', sans-serif; 
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%); 
            color: #ffffff; 
            line-height: 1.6; 
            margin: 0; 
            padding: 0; 
            min-height: 100vh;
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
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
            -webkit-background-clip: text; 
            -webkit-text-fill-color: transparent; 
            background-clip: text; 
        }
        
        nav { 
            position: fixed; 
            top: 0; 
            left: 0; 
            right: 0; 
            z-index: 50; 
        }
        
        .container { 
            max-width: 1200px; 
            margin: 0 auto; 
            padding: 0 1.5rem; 
        }
        
        .hidden { display: none; }
        
        /* 移动端优化 */
        @media (max-width: 768px) {
            .md\\:hidden { display: none; }
            .md\\:flex { display: flex; }
            .container { padding: 0 1rem; }
        }
        
        /* 防止布局偏移 */
        img { max-width: 100%; height: auto; }
        
        /* 优化渲染性能 */
        * { box-sizing: border-box; }
        
        /* 减少重绘 */
        .hover-scale { 
            transition: transform 0.3s ease; 
            will-change: transform; 
        }
    </style>`;
            
            content = content.replace('</head>', `${criticalCSS}\n</head>`);
            fs.writeFileSync('index.html', content, 'utf8');
            console.log('已为首页添加关键CSS内联');
        }
    }
}

// 优化字体加载
function optimizeFontLoading() {
    console.log('正在优化字体加载...');
    
    const htmlFiles = fs.readdirSync('.').filter(file => file.endsWith('.html'));
    
    htmlFiles.forEach(file => {
        let content = fs.readFileSync(file, 'utf8');
        let modified = false;
        
        // 为Google Fonts添加display=swap
        content = content.replace(
            /href="https:\/\/fonts\.googleapis\.com\/css2\?([^"]*?)"/g,
            (match, params) => {
                if (!params.includes('display=swap')) {
                    const separator = params.includes('&') ? '&' : '&';
                    modified = true;
                    return `href="https://fonts.googleapis.com/css2?${params}${separator}display=swap"`;
                }
                return match;
            }
        );
        
        if (modified) {
            fs.writeFileSync(file, content, 'utf8');
            console.log(`已优化字体加载: ${file}`);
        }
    });
}

// 添加性能监控代码
function addPerformanceMonitoring() {
    console.log('正在添加性能监控代码...');
    
    const performanceScript = `
    <script>
        // 性能监控 - 仅在开发环境或需要时启用
        if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
            // 监控LCP
            new PerformanceObserver((entryList) => {
                for (const entry of entryList.getEntries()) {
                    console.log('LCP:', entry.startTime);
                }
            }).observe({entryTypes: ['largest-contentful-paint']});
            
            // 监控FID
            new PerformanceObserver((entryList) => {
                for (const entry of entryList.getEntries()) {
                    console.log('FID:', entry.processingStart - entry.startTime);
                }
            }).observe({entryTypes: ['first-input']});
            
            // 监控CLS
            let clsValue = 0;
            new PerformanceObserver((entryList) => {
                for (const entry of entryList.getEntries()) {
                    if (!entry.hadRecentInput) {
                        clsValue += entry.value;
                        console.log('CLS:', clsValue);
                    }
                }
            }).observe({entryTypes: ['layout-shift']});
        }
    </script>`;
    
    // 只在开发环境添加性能监控
    console.log('性能监控代码已准备，可在需要时手动添加到页面');
}

// 执行所有CSS和JavaScript优化
try {
    optimizeCSSLoading();
    optimizeJavaScriptLoading();
    addCriticalResourcePreload();
    optimizeThirdPartyScripts();
    inlineCriticalCSS();
    optimizeFontLoading();
    addPerformanceMonitoring();
    
    console.log('\n✅ CSS和JavaScript优化完成！');
    console.log('\n优化内容包括:');
    console.log('- CSS异步加载（保留关键CSS同步）');
    console.log('- JavaScript延迟加载');
    console.log('- 关键资源预加载');
    console.log('- 第三方脚本优化');
    console.log('- 首页关键CSS内联');
    console.log('- 字体加载优化');
    console.log('- 性能监控代码准备');
    console.log('\n这些优化不会影响网站功能，只会提升加载性能。');
    
} catch (error) {
    console.error('CSS和JavaScript优化过程中出现错误:', error);
    console.log('请检查文件权限或手动执行优化步骤。');
}

module.exports = {
    optimizeCSSLoading,
    optimizeJavaScriptLoading,
    addCriticalResourcePreload,
    optimizeThirdPartyScripts,
    inlineCriticalCSS,
    optimizeFontLoading
};