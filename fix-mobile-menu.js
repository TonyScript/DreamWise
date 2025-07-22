/**
 * 修复移动端导航栏点击没反应的问题
 */

const fs = require('fs');
const path = require('path');

console.log('开始修复移动端导航栏问题...');

try {
  // 读取index-new.html文件
  let content = fs.readFileSync('index-new.html', 'utf8');
  
  // 1. 检查移动菜单按钮的事件处理
  console.log('检查移动菜单按钮的事件处理...');
  
  // 查找并修复移动菜单的JavaScript代码
  const mobileMenuScript = `
<script>
// 修复移动端导航菜单
document.addEventListener('DOMContentLoaded', function() {
  console.log('移动端导航菜单脚本已加载');
  
  // 获取移动菜单按钮和菜单元素
  const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  
  console.log('移动菜单元素:', {
    mobileMenuToggle: !!mobileMenuToggle,
    mobileMenu: !!mobileMenu
  });
  
  if (mobileMenuToggle && mobileMenu) {
    // 移除可能存在的旧事件监听器
    const newMobileMenuToggle = mobileMenuToggle.cloneNode(true);
    mobileMenuToggle.parentNode.replaceChild(newMobileMenuToggle, mobileMenuToggle);
    
    // 添加新的点击事件处理
    newMobileMenuToggle.addEventListener('click', function(e) {
      e.preventDefault();
      console.log('移动菜单按钮被点击');
      mobileMenu.classList.toggle('hidden');
      
      // 更新图标
      const icon = this.querySelector('i');
      if (icon) {
        if (mobileMenu.classList.contains('hidden')) {
          icon.className = 'fas fa-bars text-xl';
        } else {
          icon.className = 'fas fa-times text-xl';
        }
      }
    });
    
    // 移动端手风琴菜单
    const mobileAccordions = document.querySelectorAll('.mobile-accordion');
    mobileAccordions.forEach(accordion => {
      const header = accordion.querySelector('.mobile-accordion-header');
      if (header) {
        // 移除可能存在的旧事件监听器
        const newHeader = header.cloneNode(true);
        header.parentNode.replaceChild(newHeader, header);
        
        // 添加新的点击事件处理
        newHeader.addEventListener('click', function(e) {
          e.preventDefault();
          e.stopPropagation();
          console.log('手风琴菜单被点击');
          accordion.classList.toggle('active');
          
          // 更新图标
          const icon = this.querySelector('.fa-chevron-down');
          if (icon) {
            if (accordion.classList.contains('active')) {
              icon.style.transform = 'rotate(180deg)';
            } else {
              icon.style.transform = 'rotate(0deg)';
            }
          }
          
          // 显示/隐藏内容
          const content = accordion.querySelector('.mobile-accordion-content');
          if (content) {
            if (accordion.classList.contains('active')) {
              content.style.display = 'block';
            } else {
              content.style.display = 'none';
            }
          }
        });
      }
    });
  }
});
</script>
  `;
  
  // 移除旧的移动菜单脚本
  content = content.replace(/<script>[\s\S]*?mobile-menu-toggle[\s\S]*?<\/script>/g, '');
  
  // 在</body>前插入新的移动菜单脚本
  content = content.replace('</body>', mobileMenuScript + '</body>');
  
  // 2. 修复移动菜单的CSS
  console.log('修复移动菜单的CSS...');
  
  // 查找移动菜单的CSS样式
  const mobileMenuCssStart = content.indexOf('/* Mobile Navigation Styles */');
  if (mobileMenuCssStart !== -1) {
    // 添加额外的移动菜单CSS
    const additionalCss = `
    /* 修复移动菜单样式 */
    .mobile-menu {
        display: none;
    }
    
    .mobile-menu.hidden {
        display: none !important;
    }
    
    .mobile-menu:not(.hidden) {
        display: block !important;
    }
    
    .mobile-accordion-content {
        display: none;
    }
    
    .mobile-accordion.active .mobile-accordion-content {
        display: block !important;
    }
    `;
    
    // 在移动菜单CSS后添加额外的CSS
    const cssInsertPoint = content.indexOf('</style>', mobileMenuCssStart);
    if (cssInsertPoint !== -1) {
      content = content.slice(0, cssInsertPoint) + additionalCss + content.slice(cssInsertPoint);
    }
  }
  
  // 3. 确保移动菜单按钮有正确的类名
  console.log('确保移动菜单按钮有正确的类名...');
  
  // 查找移动菜单按钮
  const mobileMenuButtonRegex = /<button class="lg:hidden mobile-menu-toggle[^>]*>/;
  if (mobileMenuButtonRegex.test(content)) {
    // 确保按钮有正确的类名和属性
    content = content.replace(
      mobileMenuButtonRegex,
      '<button class="lg:hidden mobile-menu-toggle text-white hover:text-purple-300 transition-colors duration-300" type="button" aria-label="Toggle mobile menu">'
    );
  }
  
  // 保存修改后的文件
  fs.writeFileSync('index-new.html', content, 'utf8');
  console.log('✅ 成功修复移动端导航栏问题');
} catch (error) {
  console.error('修复移动端导航栏时出错:', error);
}

console.log('移动端导航栏修复完成！');