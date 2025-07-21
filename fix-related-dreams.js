const fs = require('fs');

// 需要修复的梦象页面
const dreamPages = [
  'dream/water.html',
  'dream/snake.html',
  'dream/flying.html',
  'dream/death.html',
  'dream/fire.html',
  'dream/house.html',
  'dream/baby.html'
];

// 修复Related Dream Symbols区域的布局
dreamPages.forEach(page => {
  try {
    console.log(`正在修复页面: ${page}`);
    
    // 读取文件内容
    const content = fs.readFileSync(page, 'utf8');
    
    // 查找Related Dream Symbols区域
    const relatedDreamsSection = content.match(/<section class="related-dreams-section py-16">([\s\S]*?)<\/section>/);
    
    if (!relatedDreamsSection) {
      console.log(`未找到Related Dream Symbols区域: ${page}`);
      return;
    }
    
    // 提取Related Dream Symbols区域的内容
    const sectionContent = relatedDreamsSection[0];
    
    // 检查是否存在布局问题
    if (sectionContent.includes('class="related-dreams-scroll"')) {
      // 修复布局问题
      const fixedContent = sectionContent.replace(
        /<div class="related-dreams-scroll">/g,
        '<div class="related-dreams-scroll grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">'
      );
      
      // 更新文件内容
      const updatedContent = content.replace(sectionContent, fixedContent);
      
      // 写入文件
      fs.writeFileSync(page, updatedContent, 'utf8');
      
      console.log(`已修复页面: ${page}`);
    } else {
      console.log(`页面不需要修复: ${page}`);
    }
  } catch (error) {
    console.error(`修复页面时出错: ${page}`, error);
  }
});