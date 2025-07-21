const fs = require('fs');

// 读取新组件文件
const newNavbar = fs.readFileSync('new-navbar.html', 'utf8');
const newHeroSection = fs.readFileSync('new-hero-section.html', 'utf8');
const newFeaturesSection = fs.readFileSync('new-features-section.html', 'utf8');
const newContentPreview = fs.readFileSync('new-content-preview.html', 'utf8');

// 读取当前的index.html文件
let indexContent = fs.readFileSync('index.html', 'utf8');

// 替换导航栏
indexContent = indexContent.replace(
  /<nav class="fixed top-0 left-0 right-0 z-50 glass-card mx-4 mt-4 rounded-2xl">[\s\S]*?<\/nav>/,
  newNavbar
);

// 替换英雄区域
indexContent = indexContent.replace(
  /<section id="home" class="min-h-screen flex items-center justify-center relative overflow-hidden pt-20">[\s\S]*?<\/section>/,
  newHeroSection
);

// 替换专家展示区域为功能展示区域
indexContent = indexContent.replace(
  /<section class="py-20 relative">[\s\S]*?<\/section>/,
  newFeaturesSection
);

// 替换导航中心区域为内容预览区域
indexContent = indexContent.replace(
  /<section class="py-20 relative">[\s\S]*?<\/section>/,
  newContentPreview
);

// 写入更新后的index.html文件
fs.writeFileSync('index-new.html', indexContent, 'utf8');

console.log('成功创建更新后的index-new.html文件！');