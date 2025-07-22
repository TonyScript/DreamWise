/**
 * 修复index-new.html导航栏问题
 * 
 * 1. 增加导航栏边距，避免贴近边缘
 * 2. 确保月亮图标和DreamWise文字链接到首页
 * 3. 修复搜索功能
 */

const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

// 配置
const config = {
  filePath: 'index-new.html', // 需要修复的HTML文件
  searchScript: `
    // 搜索功能
    document.addEventListener('DOMContentLoaded', function() {
      const searchToggle = document.getElementById('search-toggle');
      const searchBar = document.getElementById('search-bar');
      const searchInput = document.querySelector('#search-bar input');
      const searchButton = document.querySelector('#search-bar button');
      
      if (searchToggle && searchBar) {
        // 点击搜索图标显示/隐藏搜索栏
        searchToggle.addEventListener('click', function() {
          searchBar.classList.toggle('hidden');
          if (!searchBar.classList.contains('hidden')) {
            searchInput.focus();
          }
        });
        
        // 点击搜索按钮执行搜索
        searchButton.addEventListener('click', function() {
          if (searchInput.value.trim() !== '') {
            window.location.href = 'browse.html?search=' + encodeURIComponent(searchInput.value.trim());
          }
        });
        
        // 按Enter键执行搜索
        searchInput.addEventListener('keypress', function(e) {
          if (e.key === 'Enter' && this.value.trim() !== '') {
            window.location.href = 'browse.html?search=' + encodeURIComponent(this.value.trim());
          }
        });
      }
    });
  `
};

/**
 * 修复导航栏问题
 */
function fixNavigation(filePath) {
  console.log(`正在处理文件: ${filePath}`);
  
  try {
    // 读取文件内容
    const content = fs.readFileSync(filePath, 'utf8');
    
    // 解析DOM
    const dom = new JSDOM(content);
    const document = dom.window.document;
    
    // 1. 修改导航栏边距
    const nav = document.querySelector('nav');
    if (nav) {
      // 增加边距
      nav.className = 'fixed top-0 left-0 right-0 z-50 backdrop-blur-lg bg-gray-900/80 border-b border-white/10 shadow-lg mx-6 md:mx-8 lg:mx-12 mt-4 rounded-2xl';
      console.log('已增加导航栏边距');
    }
    
    // 2. 确保Logo链接到首页
    const logo = document.querySelector('.flex.items-center.space-x-3');
    if (logo) {
      // 创建一个链接包装器
      const logoLink = document.createElement('a');
      logoLink.href = 'index.html';
      logoLink.className = 'flex items-center space-x-3 hover:opacity-90 transition-all duration-300';
      
      // 克隆现有的logo元素
      const moonIcon = logo.querySelector('.w-12.h-12');
      const brandText = logo.querySelector('.text-2xl.font-bold');
      
      // 将克隆的元素添加到链接中
      if (moonIcon && brandText) {
        const moonIconClone = moonIcon.cloneNode(true);
        const brandTextClone = brandText.cloneNode(true);
        
        logoLink.appendChild(moonIconClone);
        logoLink.appendChild(brandTextClone);
        
        // 替换原始logo
        logo.parentNode.replaceChild(logoLink, logo);
        console.log('已添加Logo首页链接');
      }
    }
    
    // 3. 添加搜索功能脚本
    const head = document.querySelector('head');
    if (head) {
      const scriptElement = document.createElement('script');
      scriptElement.textContent = config.searchScript;
      head.appendChild(scriptElement);
      console.log('已添加搜索功能脚本');
    }
    
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
  console.log('开始修复导航栏问题...');
  
  const filePath = path.resolve(config.filePath);
  
  if (fs.existsSync(filePath)) {
    const success = fixNavigation(filePath);
    
    if (success) {
      console.log('\n✅ 文件修复成功！');
    } else {
      console.log('\n⚠️ 文件修复失败，请检查上述错误信息。');
    }
  } else {
    console.error(`文件不存在: ${filePath}`);
    console.log('\n⚠️ 文件不存在，请检查文件路径。');
  }
}

// 执行主函数
main();