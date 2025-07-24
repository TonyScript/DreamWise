#!/usr/bin/env node

/**
 * 调试导航跳转问题
 * 检查所有可能导致跳转到 index.html 的原因
 */

const fs = require('fs');

console.log('🔍 调试导航跳转问题...\n');

// 读取 index-new.html 文件
const content = fs.readFileSync('index-new.html', 'utf8');

console.log('📋 检查 Dream Journal 相关链接:');

// 查找所有 Dream Journal 相关的链接
const dreamJournalMatches = content.match(/href="[^"]*"[^>]*>.*?Dream Journal.*?</gi) || [];
dreamJournalMatches.forEach((match, index) => {
    const hrefMatch = match.match(/href="([^"]*)"/);
    if (hrefMatch) {
        console.log(`${index + 1}. ${hrefMatch[1]} - ${match.replace(/\s+/g, ' ').substring(0, 100)}...`);
    }
});

console.log('\n📋 检查 Community 相关链接:');

// 查找所有 Community 相关的链接
const communityMatches = content.match(/href="[^"]*"[^>]*>.*?Community.*?</gi) || [];
communityMatches.forEach((match, index) => {
    const hrefMatch = match.match(/href="([^"]*)"/) ;
    if (hrefMatch) {
        console.log(`${index + 1}. ${hrefMatch[1]} - ${match.replace(/\s+/g, ' ').substring(0, 100)}...`);
    }
});

console.log('\n📋 检查所有可能的问题链接:');

// 查找可能有问题的链接
const problematicPatterns = [
    /href="#"/g,
    /href=""/g,
    /href="index\.html"/g,
    /href="\.\/"/g,
    /href="\/"/g
];

problematicPatterns.forEach((pattern, index) => {
    const matches = content.match(pattern) || [];
    if (matches.length > 0) {
        console.log(`⚠️  发现 ${matches.length} 个可能有问题的链接: ${pattern.source}`);
    }
});

console.log('\n📋 检查 JavaScript 事件处理:');

// 检查是否有 JavaScript 阻止默认行为
const jsFiles = ['assets/js/auth.js', 'assets/js/main.min.js'];
jsFiles.forEach(file => {
    if (fs.existsSync(file)) {
        const jsContent = fs.readFileSync(file, 'utf8');
        const preventDefaultCount = (jsContent.match(/preventDefault/g) || []).length;
        const clickHandlerCount = (jsContent.match(/addEventListener.*click/g) || []).length;
        console.log(`${file}: ${preventDefaultCount} preventDefault, ${clickHandlerCount} click handlers`);
    }
});

console.log('\n✅ 调试完成');