#!/usr/bin/env node

const fs = require('fs');

console.log('🔧 更新主要Resources页面，添加可点击链接...');

// 更新Dream Guides页面
console.log('📝 更新dream-guides.html...');
let guidesContent = fs.readFileSync('dream-guides.html', 'utf8');

// 将Getting Started部分改为可点击链接
guidesContent = guidesContent.replace(
    /<div class="glass-card p-8 hover-scale">\s*<div class="flex items-center mb-6">\s*<div class="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center mr-4">\s*<i class="fas fa-play-circle text-white text-2xl"><\/i>\s*<\/div>\s*<h2 class="text-2xl font-bold">Getting Started with Dream Interpretation<\/h2>/,
    `<a href="guides/getting-started.html" class="glass-card p-8 hover-scale block group transition-all duration-300 hover:bg-purple-900/20">
                    <div class="flex items-center mb-6">
                        <div class="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                            <i class="fas fa-play-circle text-white text-2xl"></i>
                        </div>
                        <h2 class="text-2xl font-bold group-hover:text-purple-300 transition-colors">Getting Started with Dream Interpretation</h2>`
);

// 将Understanding Dream Symbols部分改为可点击链接
guidesContent = guidesContent.replace(
    /<div class="glass-card p-8 hover-scale">\s*<div class="flex items-center mb-6">\s*<div class="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center mr-4">\s*<i class="fas fa-eye text-white text-2xl"><\/i>\s*<\/div>\s*<h2 class="text-2xl font-bold">Understanding Dream Symbols<\/h2>/,
    `<a href="guides/understanding-symbols.html" class="glass-card p-8 hover-scale block group transition-all duration-300 hover:bg-purple-900/20">
                    <div class="flex items-center mb-6">
                        <div class="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                            <i class="fas fa-eye text-white text-2xl"></i>
                        </div>
                        <h2 class="text-2xl font-bold group-hover:text-purple-300 transition-colors">Understanding Dream Symbols</h2>`
);

// 将其他两个部分也改为链接样式（虽然暂时没有详细页面）
guidesContent = guidesContent.replace(
    /<div class="glass-card p-8 hover-scale">/g,
    '<div class="glass-card p-8 hover-scale group cursor-pointer transition-all duration-300 hover:bg-purple-900/20">'
);

// 添加"即将推出"标识到其他部分
guidesContent = guidesContent.replace(
    /<h2 class="text-2xl font-bold">Multi-Faith Dream Perspectives<\/h2>/,
    '<h2 class="text-2xl font-bold group-hover:text-purple-300 transition-colors">Multi-Faith Dream Perspectives <span class="text-sm text-purple-400">(Coming Soon)</span></h2>'
);

guidesContent = guidesContent.replace(
    /<h2 class="text-2xl font-bold">Advanced Dream Analysis Techniques<\/h2>/,
    '<h2 class="text-2xl font-bold group-hover:text-purple-300 transition-colors">Advanced Dream Analysis Techniques <span class="text-sm text-purple-400">(Coming Soon)</span></h2>'
);

fs.writeFileSync('dream-guides.html', guidesContent);
console.log('✅ dream-guides.html 更新完成');

// 更新Dream Blog页面
console.log('📝 更新dream-blog.html...');
let blogContent = fs.readFileSync('dream-blog.html', 'utf8');

// 将Recent Dream Analysis Articles部分的文章改为可点击链接
blogContent = blogContent.replace(
    /<span class="text-gray-400">Understanding Recurring Dreams: What They Mean<\/span>/,
    '<a href="blog/recurring-dreams.html" class="text-gray-400 hover:text-purple-300 transition-colors cursor-pointer">Understanding Recurring Dreams: What They Mean</a>'
);

// 为其他文章添加"即将推出"和悬停效果
blogContent = blogContent.replace(
    /<span class="text-gray-400">The Spiritual Significance of Flying Dreams<\/span>/,
    '<span class="text-gray-400 hover:text-purple-300 transition-colors cursor-pointer">The Spiritual Significance of Flying Dreams <span class="text-xs text-purple-400">(Coming Soon)</span></span>'
);

blogContent = blogContent.replace(
    /<span class="text-gray-400">Water Dreams Across Different Cultures<\/span>/,
    '<span class="text-gray-400 hover:text-purple-300 transition-colors cursor-pointer">Water Dreams Across Different Cultures <span class="text-xs text-purple-400">(Coming Soon)</span></span>'
);

blogContent = blogContent.replace(
    /<span class="text-gray-400">Nightmares: Transforming Fear into Wisdom<\/span>/,
    '<span class="text-gray-400 hover:text-purple-300 transition-colors cursor-pointer">Nightmares: Transforming Fear into Wisdom <span class="text-xs text-purple-400">(Coming Soon)</span></span>'
);

blogContent = blogContent.replace(
    /<span class="text-gray-400">Prophetic Dreams: Separating Truth from Fantasy<\/span>/,
    '<span class="text-gray-400 hover:text-purple-300 transition-colors cursor-pointer">Prophetic Dreams: Separating Truth from Fantasy <span class="text-xs text-purple-400">(Coming Soon)</span></span>'
);

// 将所有卡片改为悬停效果
blogContent = blogContent.replace(
    /<div class="glass-card p-8 hover-scale">/g,
    '<div class="glass-card p-8 hover-scale group transition-all duration-300 hover:bg-purple-900/20">'
);

// 更新标题悬停效果
blogContent = blogContent.replace(
    /<h2 class="text-2xl font-bold">/g,
    '<h2 class="text-2xl font-bold group-hover:text-purple-300 transition-colors"'
);

fs.writeFileSync('dream-blog.html', blogContent);
console.log('✅ dream-blog.html 更新完成');

console.log('');
console.log('🎉 主要Resources页面更新完成！');
console.log('');
console.log('✅ 完成的改进:');
console.log('- Dream Guides页面: 2个部分现在可以点击查看详细内容');
console.log('- Dream Blog页面: 1篇文章可以点击阅读完整内容');
console.log('- 其他内容标记为"即将推出"，增加悬停效果');
console.log('- 所有卡片都有更好的交互反馈');
console.log('');
console.log('📝 建议下一步:');
console.log('1. 决定Community页面的重新定位');
console.log('2. 创建更多博客文章和指南页面');
console.log('3. 测试所有链接是否正常工作');