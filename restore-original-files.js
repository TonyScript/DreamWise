/**
 * 恢复网站文件到优化前的状态
 */

const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);

// 需要恢复的文件列表
const filesToRestore = [
  'index.html',
  'insights.html',
  'browse.html',
  'categories.html'
];

// 删除创建的优化文件
const filesToDelete = [
  'service-worker.js',
  'assets/js/sw-register.js',
  'optimize-images.sh',
  'optimize-js.js'
];

// 恢复 HTML 文件
async function restoreHtmlFiles() {
  console.log('开始恢复 HTML 文件...');
  
  for (const file of filesToRestore) {
    try {
      console.log(`处理文件: ${file}`);
      const filePath = path.join(process.cwd(), file);
      
      if (!fs.existsSync(filePath)) {
        console.log(`文件不存在: ${filePath}`);
        continue;
      }
      
      let content = await readFileAsync(filePath, 'utf8');
      
      // 1. 恢复 CSS 加载
      content = content.replace(
        /<link rel="preload" href="(assets\/css\/main\.min\.css)" as="style" onload="this\.onload=null;this\.rel='stylesheet'">\s*<noscript><link rel="stylesheet" href="[^"]*"><\/noscript>/g,
        '<link rel="stylesheet" href="$1">'
      );
      
      // 2. 恢复 Font Awesome 加载
      content = content.replace(
        /<link rel="stylesheet" href="(https:\/\/cdnjs\.cloudflare\.com\/ajax\/libs\/font-awesome\/.*?\/css\/all\.min\.css)" media="print" onload="this\.media='all'">\s*<noscript><link rel="stylesheet" href="[^"]*"><\/noscript>/g,
        '<link rel="stylesheet" href="$1">'
      );
      
      // 3. 恢复 Google Fonts 加载
      content = content.replace(
        /<link href="(https:\/\/fonts\.googleapis\.com\/css2\?.*?)&display=swap" rel="stylesheet">/g,
        '<link href="$1" rel="stylesheet">'
      );
      
      // 4. 移除添加的字体样式
      content = content.replace(
        /<style>\s*\/\* 优化字体加载 \*\/[\s\S]*?<\/style>\s*<\/head>/,
        '</head>'
      );
      
      // 5. 移除资源提示
      content = content.replace(
        /<!-- 资源提示 -->\s*<link rel="preconnect" href="https:\/\/cdn\.tailwindcss\.com">\s*<link rel="dns-prefetch" href="https:\/\/cdn\.tailwindcss\.com">\s*<link rel="preconnect" href="https:\/\/cdnjs\.cloudflare\.com">\s*<link rel="dns-prefetch" href="https:\/\/cdnjs\.cloudflare\.com">/g,
        ''
      );
      
      // 6. 恢复 JavaScript 加载
      content = content.replace(
        /<script src="(assets\/js\/main\.min\.js)" defer><\/script>/g,
        '<script src="$1"></script>'
      );
      
      content = content.replace(
        /<script src="(assets\/js\/components\.js)" defer><\/script>/g,
        '<script src="$1"></script>'
      );
      
      // 7. 移除 Service Worker 注册
      content = content.replace(
        /\s*<!-- Service Worker Registration -->\s*<script src="assets\/js\/sw-register\.js"><\/script>/g,
        ''
      );
      
      // 8. 恢复 Tailwind 加载
      content = content.replace(
        /<script src="https:\/\/cdn\.tailwindcss\.com" defer><\/script>/g,
        '<script src="https://cdn.tailwindcss.com"></script>'
      );
      
      // 保存恢复后的文件
      await writeFileAsync(filePath, content, 'utf8');
      console.log(`文件已恢复: ${file}`);
    } catch (error) {
      console.error(`处理文件 ${file} 时出错:`, error);
    }
  }
  
  console.log('HTML 文件恢复完成');
}

// 恢复 CSS 文件
async function restoreCssFile() {
  console.log('开始恢复 CSS 文件...');
  
  try {
    const cssDir = path.join(process.cwd(), 'assets', 'css');
    const mainCssPath = path.join(cssDir, 'main.min.css');
    
    if (fs.existsSync(mainCssPath)) {
      let content = await readFileAsync(mainCssPath, 'utf8');
      
      // 移除添加的性能优化 CSS
      content = content.replace(
        /\/\* 性能优化 CSS \*\/\s*\/\* 减少布局偏移 \*\/[\s\S]*?\/\* 优化滚动性能 \*\/\s*html \{\s*scroll-behavior: smooth;\s*\}\s*/,
        ''
      );
      
      await writeFileAsync(mainCssPath, content, 'utf8');
      console.log('CSS 文件已恢复');
    } else {
      console.log('CSS 文件不存在，无需恢复');
    }
  } catch (error) {
    console.error('恢复 CSS 文件时出错:', error);
  }
}

// 删除创建的优化文件
async function deleteOptimizationFiles() {
  console.log('开始删除优化文件...');
  
  for (const file of filesToDelete) {
    try {
      const filePath = path.join(process.cwd(), file);
      
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log(`已删除文件: ${file}`);
      } else {
        console.log(`文件不存在，无需删除: ${file}`);
      }
    } catch (error) {
      console.error(`删除文件 ${file} 时出错:`, error);
    }
  }
  
  console.log('优化文件删除完成');
}

// 主函数
async function main() {
  console.log('开始恢复 DreamWise 网站到优化前的状态...');
  
  try {
    // 1. 恢复 HTML 文件
    await restoreHtmlFiles();
    
    // 2. 恢复 CSS 文件
    await restoreCssFile();
    
    // 3. 删除创建的优化文件
    await deleteOptimizationFiles();
    
    console.log('网站已成功恢复到优化前的状态！');
  } catch (error) {
    console.error('恢复过程中出错:', error);
  }
}

// 执行主函数
main();