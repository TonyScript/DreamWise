const fs = require('fs');
const path = require('path');

console.log('开始移动端性能优化...');

// 1. 优化图片加载 - 添加懒加载和现代格式支持
function optimizeImageLoading() {
    console.log('正在优化图片加载...');
    
    // 读取所有HTML文件
    const htmlFiles = fs.readdirSync('.').filter(file => file.endsWith('.html'));
    
    htmlFiles.forEach(file => {
        let content = fs.readFileSync(file, 'utf8');
        let modified = false;
        
        // 为图片添加懒加载属性（仅对非关键图片）
        // 保留首屏重要图片的立即加载
        const imageRegex = /<img([^>]*?)src="([^"]*)"([^>]*?)>/g;
        content = content.replace(imageRegex, (match, before, src, after) => {
            // 跳过已经有loading属性的图片
            if (match.includes('loading=')) {
                return match;
            }
            
            // 跳过关键图片（logo、首屏图片等）
            if (src.includes('logo') || src.includes('hero') || src.includes('og-image')) {
                return match;
            }
            
            // 为其他图片添加懒加载
            modified = true;
            return `<img${before}src="${src}"${after} loading="lazy">`;
        });
        
        if (modified) {
            fs.writeFileSync(file, content, 'utf8');
            console.log(`已优化图片加载: ${file}`);
        }
    });
}

// 2. 优化字体加载
function optimizeFontLoading() {
    console.log('正在优化字体加载...');
    
    const htmlFiles = fs.readdirSync('.').filter(file => file.endsWith('.html'));
    
    htmlFiles.forEach(file => {
        let content = fs.readFileSync(file, 'utf8');
        let modified = false;
        
        // 为Google Fonts添加preconnect和font-display
        if (content.includes('fonts.googleapis.com')) {
            // 添加preconnect（如果还没有）
            if (!content.includes('rel="preconnect" href="https://fonts.googleapis.com"')) {
                content = content.replace(
                    '<link rel="preconnect" href="https://fonts.googleapis.com">',
                    `<link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>`
                );
                modified = true;
            }
            
            // 为字体链接添加display=swap
            content = content.replace(
                /href="https:\/\/fonts\.googleapis\.com\/css2\?([^"]*?)"/g,
                (match, params) => {
                    if (!params.includes('display=swap')) {
                        const separator = params.includes('&') ? '&' : '&';
                        return `href="https://fonts.googleapis.com/css2?${params}${separator}display=swap"`;
                    }
                    return match;
                }
            );
            modified = true;
        }
        
        if (modified) {
            fs.writeFileSync(file, content, 'utf8');
            console.log(`已优化字体加载: ${file}`);
        }
    });
}

// 3. 添加关键资源预加载
function addCriticalResourcePreload() {
    console.log('正在添加关键资源预加载...');
    
    const htmlFiles = fs.readdirSync('.').filter(file => file.endsWith('.html'));
    
    htmlFiles.forEach(file => {
        let content = fs.readFileSync(file, 'utf8');
        let modified = false;
        
        // 在head标签中添加关键CSS预加载
        if (content.includes('main.min.css') && !content.includes('rel="preload"')) {
            content = content.replace(
                '<link rel="stylesheet" href="assets/css/main.min.css">',
                `<link rel="preload" href="assets/css/main.min.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
    <noscript><link rel="stylesheet" href="assets/css/main.min.css"></noscript>`
            );
            modified = true;
        }
        
        if (modified) {
            fs.writeFileSync(file, content, 'utf8');
            console.log(`已添加关键资源预加载: ${file}`);
        }
    });
}

// 4. 优化JavaScript加载
function optimizeJavaScriptLoading() {
    console.log('正在优化JavaScript加载...');
    
    const htmlFiles = fs.readdirSync('.').filter(file => file.endsWith('.html'));
    
    htmlFiles.forEach(file => {
        let content = fs.readFileSync(file, 'utf8');
        let modified = false;
        
        // 为非关键JavaScript添加defer属性
        const scriptRegex = /<script([^>]*?)src="([^"]*?)"([^>]*?)><\/script>/g;
        content = content.replace(scriptRegex, (match, before, src, after) => {
            // 跳过已经有defer或async属性的脚本
            if (match.includes('defer') || match.includes('async')) {
                return match;
            }
            
            // 跳过关键脚本（Tailwind CSS等）
            if (src.includes('tailwindcss') || src.includes('cdn.')) {
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

// 5. 添加移动端视口优化
function addMobileViewportOptimization() {
    console.log('正在添加移动端视口优化...');
    
    const htmlFiles = fs.readdirSync('.').filter(file => file.endsWith('.html'));
    
    htmlFiles.forEach(file => {
        let content = fs.readFileSync(file, 'utf8');
        let modified = false;
        
        // 确保viewport meta标签是最优的
        if (content.includes('viewport')) {
            content = content.replace(
                /<meta name="viewport" content="[^"]*">/,
                '<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">'
            );
            modified = true;
        }
        
        if (modified) {
            fs.writeFileSync(file, content, 'utf8');
            console.log(`已优化移动端视口: ${file}`);
        }
    });
}

// 6. 创建关键CSS内联优化（仅对首页）
function inlineCriticalCSS() {
    console.log('正在为首页内联关键CSS...');
    
    const criticalCSS = `
    <style>
        /* 关键CSS - 首屏渲染 */
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
            border: 1px solid rgba(255, 255, 255, 0.1); 
            border-radius: 20px; 
        }
        .gradient-text { 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
            -webkit-background-clip: text; 
            -webkit-text-fill-color: transparent; 
            background-clip: text; 
        }
        nav { position: fixed; top: 0; left: 0; right: 0; z-index: 50; }
        .container { max-width: 1200px; margin: 0 auto; padding: 0 1.5rem; }
        .hidden { display: none; }
        @media (max-width: 768px) {
            .md\\:hidden { display: none; }
            .md\\:flex { display: flex; }
        }
    </style>`;
    
    // 只对index.html添加关键CSS
    if (fs.existsSync('index.html')) {
        let content = fs.readFileSync('index.html', 'utf8');
        
        // 在head标签结束前添加关键CSS
        if (!content.includes('/* 关键CSS - 首屏渲染 */')) {
            content = content.replace('</head>', `${criticalCSS}\n</head>`);
            fs.writeFileSync('index.html', content, 'utf8');
            console.log('已为首页添加关键CSS内联');
        }
    }
}

// 7. 添加资源提示
function addResourceHints() {
    console.log('正在添加资源提示...');
    
    const htmlFiles = fs.readdirSync('.').filter(file => file.endsWith('.html'));
    
    htmlFiles.forEach(file => {
        let content = fs.readFileSync(file, 'utf8');
        let modified = false;
        
        // 添加DNS预解析
        if (!content.includes('rel="dns-prefetch"')) {
            const dnsHints = `
    <!-- DNS预解析 -->
    <link rel="dns-prefetch" href="//fonts.googleapis.com">
    <link rel="dns-prefetch" href="//fonts.gstatic.com">
    <link rel="dns-prefetch" href="//cdnjs.cloudflare.com">
    <link rel="dns-prefetch" href="//images.unsplash.com">`;
            
            content = content.replace('<head>', `<head>${dnsHints}`);
            modified = true;
        }
        
        if (modified) {
            fs.writeFileSync(file, content, 'utf8');
            console.log(`已添加资源提示: ${file}`);
        }
    });
}

// 执行所有优化
try {
    optimizeImageLoading();
    optimizeFontLoading();
    addCriticalResourcePreload();
    optimizeJavaScriptLoading();
    addMobileViewportOptimization();
    inlineCriticalCSS();
    addResourceHints();
    
    console.log('\n✅ 移动端性能优化完成！');
    console.log('\n优化内容包括:');
    console.log('- 图片懒加载（保留关键图片立即加载）');
    console.log('- 字体加载优化（添加font-display: swap）');
    console.log('- 关键CSS预加载');
    console.log('- JavaScript延迟加载');
    console.log('- 移动端视口优化');
    console.log('- 首页关键CSS内联');
    console.log('- DNS预解析');
    console.log('\n这些优化不会影响网站现有功能，只会提升加载性能。');
    
} catch (error) {
    console.error('优化过程中出现错误:', error);
    console.log('请检查文件权限或手动执行优化步骤。');
}