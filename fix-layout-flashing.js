/**
 * 修复页面初始加载时的布局闪烁问题
 * 
 * 问题：页面在CSS完全加载前显示未样式化的内容
 * 解决方案：添加关键CSS内联并优化资源加载顺序
 */

const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

// 配置
const config = {
  htmlFiles: ['index.html', 'browse.html', 'categories.html', 'insights.html', 'about.html', 'popular-symbols.html', 'christian-dreams.html', 'islamic-dreams.html', 'buddhist-dreams.html', 'hindu-dreams.html', 'jewish-dreams.html', 'personalized.html'], // 需要修复的HTML文件
  criticalCss: `
/* 关键渲染路径CSS - 防止布局闪烁 */
body {
  opacity: 0;
  transition: opacity 0.3s ease;
  font-family: 'Inter', sans-serif; 
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%); 
  color: #ffffff; 
  line-height: 1.6; 
  margin: 0; 
  padding: 0; 
  min-height: 100vh;
}

body.loaded {
  opacity: 1;
}

.glass-card { 
  background: rgba(255, 255, 255, 0.05); 
  backdrop-filter: blur(15px); 
  -webkit-backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.1); 
  border-radius: 20px; 
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
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
`,
  loadScript: `
// 页面加载完成后移除初始隐藏
document.addEventListener('DOMContentLoaded', function() {
  // 确保所有关键资源已加载
  setTimeout(function() {
    document.body.classList.add('loaded');
  }, 100);
});
`
};

/**
 * 修复HTML文件中的布局闪烁问题
 */
function fixLayoutFlashing(filePath) {
  console.log(`正在处理文件: ${filePath}`);
  
  try {
    // 读取文件内容
    const content = fs.readFileSync(filePath, 'utf8');
    
    // 解析DOM
    const dom = new JSDOM(content);
    const document = dom.window.document;
    
    // 1. 添加关键CSS到<head>
    const head = document.querySelector('head');
    if (head) {
      // 检查是否已有内联样式
      let styleElement = document.querySelector('head > style');
      
      if (!styleElement) {
        styleElement = document.createElement('style');
        head.insertBefore(styleElement, head.firstChild);
      }
      
      // 添加关键CSS
      styleElement.textContent = config.criticalCss + styleElement.textContent;
      
      console.log('已添加关键CSS到<head>');
    }
    
    // 2. 优化CSS加载
    const cssLinks = document.querySelectorAll('link[rel="stylesheet"]');
    cssLinks.forEach(link => {
      // 添加onload事件以确保CSS加载完成
      if (!link.hasAttribute('onload')) {
        link.setAttribute('onload', "this.onload=null;this.rel='stylesheet'");
        link.setAttribute('rel', 'preload');
        link.setAttribute('as', 'style');
        console.log(`优化了CSS加载: ${link.getAttribute('href')}`);
      }
    });
    
    // 3. 添加页面加载完成脚本
    const loadScriptElement = document.createElement('script');
    loadScriptElement.textContent = config.loadScript;
    document.body.appendChild(loadScriptElement);
    console.log('已添加页面加载完成脚本');
    
    // 4. 确保body有正确的初始类
    document.body.classList.remove('loaded');
    
    // 保存修改后的文件
    const updatedContent = dom.serialize();
    fs.writeFileSync(filePath, updatedContent, 'utf8');
    
    console.log(`已成功修复文件: ${filePath}`);
    return true;
  } catch (error) {
    console.error(`处理文件 ${filePath} 时出错:`, error);
    return false;
  }
}

/**
 * 主函数
 */
function main() {
  console.log('开始修复布局闪烁问题...');
  
  let successCount = 0;
  let failCount = 0;
  
  for (const file of config.htmlFiles) {
    const filePath = path.resolve(file);
    
    if (fs.existsSync(filePath)) {
      const success = fixLayoutFlashing(filePath);
      if (success) {
        successCount++;
      } else {
        failCount++;
      }
    } else {
      console.error(`文件不存在: ${filePath}`);
      failCount++;
    }
  }
  
  console.log('\n===== 修复完成 =====');
  console.log(`成功: ${successCount} 个文件`);
  console.log(`失败: ${failCount} 个文件`);
  
  if (failCount === 0) {
    console.log('✅ 所有文件修复成功！');
  } else {
    console.log('⚠️ 部分文件修复失败，请检查上述错误信息。');
  }
}

// 执行主函数
main();