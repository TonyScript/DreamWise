#!/usr/bin/env node

/**
 * DreamWise项目文件整理脚本
 * 此脚本将整理项目文件结构，使其更有组织性
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 开始整理DreamWise项目文件结构...');

// 创建必要的目录结构
const directories = [
    'pages',           // 所有HTML页面
    'pages/faith',     // 信仰视角页面
    'pages/blog',      // 博客文章
    'pages/guides',    // 指南页面
    'docs',            // 文档文件
    'scripts',         // 脚本文件
    'scripts/utils',   // 工具脚本
    'scripts/optimization', // 优化脚本
    'scripts/deployment',   // 部署脚本
    'temp'             // 临时文件
];

// 创建目录
directories.forEach(dir => {
    if (!fs.existsSync(dir)) {
        try {
            fs.mkdirSync(dir, { recursive: true });
            console.log(`✅ 创建目录: ${dir}`);
        } catch (error) {
            console.error(`❌ 创建目录失败: ${dir}`, error);
        }
    } else {
        console.log(`ℹ️ 目录已存在: ${dir}`);
    }
});

// 文件移动映射
const fileMoves = [
    // 信仰视角页面
    { from: 'christian-dreams.html', to: 'pages/faith/christian-dreams.html' },
    { from: 'islamic-dreams.html', to: 'pages/faith/islamic-dreams.html' },
    { from: 'buddhist-dreams.html', to: 'pages/faith/buddhist-dreams.html' },
    { from: 'hindu-dreams.html', to: 'pages/faith/hindu-dreams.html' },
    { from: 'jewish-dreams.html', to: 'pages/faith/jewish-dreams.html' },
    { from: 'faith-perspectives.html', to: 'pages/faith/faith-perspectives.html' },
    { from: 'multi-faith-analysis.html', to: 'pages/faith/multi-faith-analysis.html' },
    
    // 博客文章
    { from: 'blog-*.html', to: 'pages/blog/', pattern: true },
    { from: 'dream-blog.html', to: 'pages/blog/dream-blog.html' },
    
    // 指南页面
    { from: 'guide-*.html', to: 'pages/guides/', pattern: true },
    { from: 'dream-guides.html', to: 'pages/guides/dream-guides.html' },
    
    // 主要页面
    { from: 'about.html', to: 'pages/about.html' },
    { from: 'browse.html', to: 'pages/browse.html' },
    { from: 'categories.html', to: 'pages/categories.html' },
    { from: 'contact.html', to: 'pages/contact.html' },
    { from: 'faq.html', to: 'pages/faq.html' },
    { from: 'insights.html', to: 'pages/insights.html' },
    { from: 'personalized.html', to: 'pages/personalized.html' },
    { from: 'popular-symbols.html', to: 'pages/popular-symbols.html' },
    { from: 'community.html', to: 'pages/community.html' },
    { from: 'expert-interpretations.html', to: 'pages/expert-interpretations.html' },
    { from: 'help-center.html', to: 'pages/help-center.html' },
    { from: 'spiritual-meanings.html', to: 'pages/spiritual-meanings.html' },
    { from: 'symbol-library.html', to: 'pages/symbol-library.html' },
    { from: 'privacy-policy.html', to: 'pages/privacy-policy.html' },
    { from: 'terms-of-service.html', to: 'pages/terms-of-service.html' },
    { from: 'dream-journal.html', to: 'pages/dream-journal.html' },
    
    // 文档文件
    { from: '*.md', to: 'docs/', pattern: true },
    { from: 'DEPLOYMENT_GUIDE.txt', to: 'docs/DEPLOYMENT_GUIDE.txt' },
    { from: 'server-config-examples.txt', to: 'docs/server-config-examples.txt' },
    { from: 'seo-report.md', to: 'docs/seo-report.md' },
    
    // 脚本文件
    { from: 'upload-to-server.js', to: 'scripts/deployment/upload-to-server.js' },
    { from: 'prepare-deployment.js', to: 'scripts/deployment/prepare-deployment.js' },
    { from: 'deploy-*.sh', to: 'scripts/deployment/', pattern: true },
    { from: 'deploy-*.js', to: 'scripts/deployment/', pattern: true },
    
    { from: '*-optimization.js', to: 'scripts/optimization/', pattern: true },
    { from: 'optimize-*.js', to: 'scripts/optimization/', pattern: true },
    { from: 'optimize-*.sh', to: 'scripts/optimization/', pattern: true },
    
    { from: 'update-*.js', to: 'scripts/utils/', pattern: true },
    { from: 'create-*.js', to: 'scripts/utils/', pattern: true },
    { from: 'verify-*.js', to: 'scripts/utils/', pattern: true },
    { from: 'fix-*.js', to: 'scripts/utils/', pattern: true },
    { from: 'test-*.js', to: 'scripts/utils/', pattern: true },
    { from: 'check-*.js', to: 'scripts/utils/', pattern: true },
    { from: 'add-*.js', to: 'scripts/utils/', pattern: true },
    { from: 'batch-*.sh', to: 'scripts/utils/', pattern: true },
    
    // 临时文件
    { from: '*-new.html', to: 'temp/', pattern: true },
    { from: '*-fixed.html', to: 'temp/', pattern: true },
    { from: 'new-*.html', to: 'temp/', pattern: true },
    { from: 'test-*.html', to: 'temp/', pattern: true }
];

// 移动文件函数
function moveFile(from, to) {
    try {
        // 确保目标目录存在
        const dir = path.dirname(to);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        
        // 复制文件
        fs.copyFileSync(from, to);
        console.log(`✅ 复制文件: ${from} -> ${to}`);
        
        // 不立即删除原文件，等待所有文件处理完成后再删除
    } catch (error) {
        console.error(`❌ 移动文件失败: ${from} -> ${to}`, error);
    }
}

// 处理模式匹配的文件
function processPatternFiles() {
    const filesToProcess = [];
    
    fileMoves.forEach(move => {
        if (move.pattern) {
            const pattern = move.from;
            const targetDir = move.to;
            
            // 获取当前目录下的所有文件
            const files = fs.readdirSync('.');
            
            // 使用简单的通配符匹配
            const regex = new RegExp('^' + pattern.replace('*', '.*') + '$');
            
            files.forEach(file => {
                if (regex.test(file)) {
                    const targetPath = path.join(targetDir, file);
                    filesToProcess.push({ from: file, to: targetPath });
                }
            });
        } else {
            // 直接添加到处理列表
            if (fs.existsSync(move.from)) {
                filesToProcess.push(move);
            } else {
                console.log(`ℹ️ 文件不存在，跳过: ${move.from}`);
            }
        }
    });
    
    return filesToProcess;
}

// 更新HTML文件中的链接
function updateHtmlLinks(filePath) {
    try {
        if (!fs.existsSync(filePath)) {
            console.log(`ℹ️ 文件不存在，跳过更新链接: ${filePath}`);
            return;
        }
        
        let content = fs.readFileSync(filePath, 'utf8');
        
        // 更新信仰视角页面链接
        content = content.replace(/href="christian-dreams\.html/g, 'href="pages/faith/christian-dreams.html');
        content = content.replace(/href="islamic-dreams\.html/g, 'href="pages/faith/islamic-dreams.html');
        content = content.replace(/href="buddhist-dreams\.html/g, 'href="pages/faith/buddhist-dreams.html');
        content = content.replace(/href="hindu-dreams\.html/g, 'href="pages/faith/hindu-dreams.html');
        content = content.replace(/href="jewish-dreams\.html/g, 'href="pages/faith/jewish-dreams.html');
        content = content.replace(/href="faith-perspectives\.html/g, 'href="pages/faith/faith-perspectives.html');
        content = content.replace(/href="multi-faith-analysis\.html/g, 'href="pages/faith/multi-faith-analysis.html');
        
        // 更新主要页面链接
        content = content.replace(/href="about\.html/g, 'href="pages/about.html');
        content = content.replace(/href="browse\.html/g, 'href="pages/browse.html');
        content = content.replace(/href="categories\.html/g, 'href="pages/categories.html');
        content = content.replace(/href="contact\.html/g, 'href="pages/contact.html');
        content = content.replace(/href="faq\.html/g, 'href="pages/faq.html');
        content = content.replace(/href="insights\.html/g, 'href="pages/insights.html');
        content = content.replace(/href="personalized\.html/g, 'href="pages/personalized.html');
        content = content.replace(/href="popular-symbols\.html/g, 'href="pages/popular-symbols.html');
        content = content.replace(/href="community\.html/g, 'href="pages/community.html');
        content = content.replace(/href="expert-interpretations\.html/g, 'href="pages/expert-interpretations.html');
        content = content.replace(/href="help-center\.html/g, 'href="pages/help-center.html');
        content = content.replace(/href="spiritual-meanings\.html/g, 'href="pages/spiritual-meanings.html');
        content = content.replace(/href="symbol-library\.html/g, 'href="pages/symbol-library.html');
        content = content.replace(/href="privacy-policy\.html/g, 'href="pages/privacy-policy.html');
        content = content.replace(/href="terms-of-service\.html/g, 'href="pages/terms-of-service.html');
        content = content.replace(/href="dream-journal\.html/g, 'href="pages/dream-journal.html');
        
        // 更新博客和指南链接
        content = content.replace(/href="dream-blog\.html/g, 'href="pages/blog/dream-blog.html');
        content = content.replace(/href="dream-guides\.html/g, 'href="pages/guides/dream-guides.html');
        content = content.replace(/href="blog-([\\w-]+)\.html/g, 'href="pages/blog/blog-$1.html');
        content = content.replace(/href="guide-([\\w-]+)\.html/g, 'href="pages/guides/guide-$1.html');
        
        fs.writeFileSync(filePath, content);
        console.log(`✅ 更新了文件中的链接: ${filePath}`);
    } catch (error) {
        console.error(`❌ 更新链接失败: ${filePath}`, error);
    }
}

// 主执行函数
async function main() {
    try {
        // 处理文件移动
        const filesToProcess = processPatternFiles();
        
        // 先复制所有文件
        filesToProcess.forEach(file => {
            if (fs.existsSync(file.from)) {
                moveFile(file.from, file.to);
            }
        });
        
        // 更新所有HTML文件中的链接
        console.log('\n开始更新HTML文件中的链接...');
        
        // 更新首页
        updateHtmlLinks('index.html');
        
        // 更新移动后的页面中的链接
        const directories = ['pages', 'pages/faith', 'pages/blog', 'pages/guides'];
        
        directories.forEach(dir => {
            if (fs.existsSync(dir)) {
                fs.readdirSync(dir).forEach(file => {
                    if (file.endsWith('.html')) {
                        updateHtmlLinks(path.join(dir, file));
                    }
                });
            }
        });
        
        console.log('\n🎉 项目文件结构整理完成！');
        console.log('\n⚠️ 注意：原始文件尚未删除，请在验证新结构正常工作后手动删除。');
        console.log('\n💡 提示：使用新创建的.gitignore文件来管理未来的Git提交。');
    } catch (error) {
        console.error('❌ 整理过程中出错:', error);
    }
}

// 执行主函数
main();