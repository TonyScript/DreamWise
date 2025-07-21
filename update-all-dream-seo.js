const fs = require('fs');
const path = require('path');

// 官方网站链接
const officialWebsite = 'https://dreamwise.charitydoing.com';

// 获取dream目录下的所有HTML文件
const dreamDir = 'dream';
const dreamFiles = fs.readdirSync(dreamDir)
  .filter(file => file.endsWith('.html'))
  .map(file => path.join(dreamDir, file));

console.log(`找到 ${dreamFiles.length} 个梦象页面需要更新SEO信息`);

// 更新SEO信息
dreamFiles.forEach(page => {
  try {
    // 读取文件内容
    const content = fs.readFileSync(page, 'utf8');
    
    // 提取页面名称（不含扩展名）
    const pageName = path.basename(page, '.html');
    
    // 检查是否需要更新
    if (content.includes('dreaminterpretation.com')) {
      console.log(`正在更新页面SEO信息: ${page}`);
      
      // 更新Open Graph URL
      let updatedContent = content.replace(
        /<meta property="og:url" content="[^"]*">/g,
        `<meta property="og:url" content="${officialWebsite}/dream/${pageName}.html">`
      );
      
      // 更新Canonical URL
      updatedContent = updatedContent.replace(
        /<link rel="canonical" href="[^"]*">/g,
        `<link rel="canonical" href="${officialWebsite}/dream/${pageName}.html">`
      );
      
      // 更新结构化数据中的URL
      updatedContent = updatedContent.replace(
        /"@id": "https?:\/\/[^/]*\/dream\/[^"]*"/g,
        `"@id": "${officialWebsite}/dream/${pageName}.html"`
      );
      
      // 更新其他可能的URL引用
      updatedContent = updatedContent.replace(
        /https?:\/\/dreaminterpretation\.com/g,
        officialWebsite
      );
      
      // 写入文件
      fs.writeFileSync(page, updatedContent, 'utf8');
      
      console.log(`已更新页面SEO信息: ${page}`);
    } else {
      console.log(`页面SEO信息已是最新: ${page}`);
    }
  } catch (error) {
    console.error(`更新页面SEO信息时出错: ${page}`, error);
  }
});