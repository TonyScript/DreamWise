const fs = require('fs');
const path = require('path');

// 定义新的网站链接
const newWebsiteLink = 'https://dreamwise.charitydoing.com';
// 定义要替换的旧网站链接模式
const oldWebsiteLinkPatterns = [
  'https://dreaminterpretation.com',
  'http://dreaminterpretation.com',
  'https://dreamwise.com',
  'http://dreamwise.com'
];

// 获取所有HTML文件
const htmlFiles = fs.readdirSync('.').filter(file => 
  file.endsWith('.html')
);

console.log(`找到 ${htmlFiles.length} 个HTML文件需要检查`);

// 更新每个文件
htmlFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let updated = false;
  
  // 替换所有旧网站链接
  oldWebsiteLinkPatterns.forEach(oldPattern => {
    if (content.includes(oldPattern)) {
      content = content.replace(new RegExp(oldPattern, 'g'), newWebsiteLink);
      updated = true;
    }
  });
  
  // 更新Open Graph URL标签
  const ogUrlPattern = /<meta property="og:url" content="([^"]*)">/;
  const ogUrlMatch = content.match(ogUrlPattern);
  
  if (ogUrlMatch && !ogUrlMatch[1].startsWith(newWebsiteLink)) {
    const newOgUrl = `<meta property="og:url" content="${newWebsiteLink}/${file}">`;
    content = content.replace(ogUrlMatch[0], newOgUrl);
    updated = true;
  }
  
  // 更新规范链接
  const canonicalPattern = /<link rel="canonical" href="([^"]*)">/;
  const canonicalMatch = content.match(canonicalPattern);
  
  if (canonicalMatch && !canonicalMatch[1].startsWith(newWebsiteLink)) {
    const newCanonical = `<link rel="canonical" href="${newWebsiteLink}/${file === 'index.html' ? '' : file}">`;
    content = content.replace(canonicalMatch[0], newCanonical);
    updated = true;
  }
  
  // 更新结构化数据中的URL
  const schemaUrlPattern = /"url":\s*"([^"]*)"/g;
  let schemaMatch;
  let tempContent = content;
  
  while ((schemaMatch = schemaUrlPattern.exec(content)) !== null) {
    if (!schemaMatch[1].startsWith(newWebsiteLink) && oldWebsiteLinkPatterns.some(pattern => schemaMatch[1].startsWith(pattern))) {
      const newUrl = schemaMatch[1].replace(/^https?:\/\/[^\/]+/, newWebsiteLink);
      tempContent = tempContent.replace(`"url": "${schemaMatch[1]}"`, `"url": "${newUrl}"`);
      updated = true;
    }
  }
  
  content = tempContent;
  
  // 保存更新后的文件
  if (updated) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`已更新文件: ${file}`);
  } else {
    console.log(`文件无需更新: ${file}`);
  }
});

console.log('所有HTML文件检查完成！');