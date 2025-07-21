const fs = require('fs');

// 需要更新SEO信息的梦象页面
const dreamPages = [
  'dream/water.html',
  'dream/snake.html',
  'dream/flying.html',
  'dream/death.html',
  'dream/fire.html',
  'dream/house.html',
  'dream/baby.html',
  'dream/car.html'
];

// 官方网站链接
const officialWebsite = 'https://dreamwise.charitydoing.com';

// 更新SEO信息
dreamPages.forEach(page => {
  try {
    console.log(`正在更新页面SEO信息: ${page}`);
    
    // 读取文件内容
    const content = fs.readFileSync(page, 'utf8');
    
    // 提取页面名称（不含扩展名）
    const pageName = page.split('/').pop().replace('.html', '');
    
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
  } catch (error) {
    console.error(`更新页面SEO信息时出错: ${page}`, error);
  }
});