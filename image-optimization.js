// 此脚本用于优化图片加载
// 添加懒加载属性到图片元素

const fs = require('fs');
const path = require('path');

// 处理HTML文件中的图片
function processHTMLFile(filePath) {
  try {
    // 读取文件内容
    let content = fs.readFileSync(filePath, 'utf8');
    
    // 检查文件是否已经包含懒加载属性
    if (content.includes('loading="lazy"')) {
      console.log(`${filePath} 已包含懒加载属性，跳过处理`);
      return;
    }
    
    // 替换<img>标签，添加loading="lazy"属性
    // 但不处理hero section中的图片，因为它们可能是首屏内容
    const originalContent = content;
    
    // 不修改hero section中的图片
    const heroSectionMatch = content.match(/<section[^>]*id="home"[^>]*>[\s\S]*?<\/section>/);
    let heroSectionContent = '';
    
    if (heroSectionMatch) {
      heroSectionContent = heroSectionMatch[0];
      // 临时替换hero section内容，避免处理其中的图片
      content = content.replace(heroSectionContent, '<!-- HERO_SECTION_PLACEHOLDER -->');
    }
    
    // 添加懒加载属性到其他图片
    content = content.replace(/<img([^>]*)>/g, (match, attributes) => {
      // 如果已经有loading属性，不做修改
      if (attributes.includes('loading=')) {
        return match;
      }
      // 添加loading="lazy"属性
      return `<img${attributes} loading="lazy">`;
    });
    
    // 恢复hero section内容
    if (heroSectionMatch) {
      content = content.replace('<!-- HERO_SECTION_PLACEHOLDER -->', heroSectionContent);
    }
    
    // 如果内容有变化，写回文件
    if (content !== originalContent) {
      // 创建备份
      fs.writeFileSync(`${filePath}.bak`, originalContent, 'utf8');
      
      // 写入修改后的内容到新文件
      const dir = path.dirname(filePath);
      const filename = path.basename(filePath);
      const optimizedPath = path.join(dir, `optimized-${filename}`);
      
      fs.writeFileSync(optimizedPath, content, 'utf8');
      console.log(`已创建优化后的文件: ${optimizedPath}`);
    } else {
      console.log(`${filePath} 无需修改`);
    }
  } catch (error) {
    console.error(`处理 ${filePath} 时出错:`, error);
  }
}

// 处理所有HTML文件
function processAllHTMLFiles() {
  // 获取当前目录下的所有HTML文件
  const files = fs.readdirSync('.');
  const htmlFiles = files.filter(file => file.endsWith('.html'));
  
  // 处理每个HTML文件
  htmlFiles.forEach(file => {
    console.log(`处理文件: ${file}`);
    processHTMLFile(file);
  });
  
  // 处理dream目录下的HTML文件
  if (fs.existsSync('dream')) {
    const dreamFiles = fs.readdirSync('dream');
    const dreamHtmlFiles = dreamFiles.filter(file => file.endsWith('.html'));
    
    dreamHtmlFiles.forEach(file => {
      const filePath = path.join('dream', file);
      console.log(`处理文件: ${filePath}`);
      processHTMLFile(filePath);
    });
  }
  
  // 处理blog文件
  const blogFiles = files.filter(file => file.startsWith('blog-') && file.endsWith('.html'));
  blogFiles.forEach(file => {
    console.log(`处理文件: ${file}`);
    processHTMLFile(file);
  });
}

// 执行处理
processAllHTMLFiles();