const fs = require('fs');
const path = require('path');

// 定义要更新的社交媒体链接
const facebookLink = 'https://www.facebook.com/renshengkuduanjishixingle';
const twitterLink = 'https://x.com/Jonathan230117';
const instagramLink = 'https://www.instagram.com/doushixuwang/';
const websiteLink = 'https://dreamwise.charitydoing.com';

// 获取所有博客文章文件
const blogFiles = fs.readdirSync('.').filter(file => 
  file.startsWith('blog-') && file.endsWith('.html')
);

console.log(`找到 ${blogFiles.length} 个博客文章文件需要更新`);

// 更新每个文件
blogFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let updated = false;
  
  // 1. 添加 Open Graph Meta Tags (如果不存在)
  if (!content.includes('og:url')) {
    const metaAuthorPattern = /<meta name="author" content="[^"]*">/;
    const metaAuthorMatch = content.match(metaAuthorPattern);
    
    if (metaAuthorMatch) {
      const ogTags = `\n    
    <!-- Open Graph Meta Tags -->
    <meta property="og:title" content="${file.replace('.html', '').replace('blog-', '').split('-').join(' ')} - Dream Interpretation">
    <meta property="og:description" content="Explore dream meanings and interpretations from multiple faith perspectives at DreamWise.">
    <meta property="og:type" content="article">
    <meta property="og:url" content="${websiteLink}/${file}">`;
      
      content = content.replace(metaAuthorMatch[0], `${metaAuthorMatch[0]}${ogTags}`);
      updated = true;
    }
  }
  
  // 2. 更新社交媒体分享链接
  const socialLinksPattern = /<div class="flex space-x-4 mt-2">[^<]*(<a href="[^"]*"[^>]*>[^<]*<i class="fab fa-[^"]*"[^>]*><\/i>[^<]*<\/a>[^<]*){2,}<\/div>/s;
  const socialLinksMatch = content.match(socialLinksPattern);
  
  if (socialLinksMatch) {
    const newSocialLinks = `<div class="flex space-x-4 mt-2">
                                <a href="${facebookLink}" class="text-gray-400 hover:text-purple-300 transition-colors duration-300">
                                    <i class="fab fa-facebook-f text-xl"></i>
                                </a>
                                <a href="${twitterLink}" class="text-gray-400 hover:text-purple-300 transition-colors duration-300">
                                    <i class="fab fa-twitter text-xl"></i>
                                </a>
                                <a href="${instagramLink}" class="text-gray-400 hover:text-purple-300 transition-colors duration-300">
                                    <i class="fab fa-instagram text-xl"></i>
                                </a>
                            </div>`;
    
    content = content.replace(socialLinksMatch[0], newSocialLinks);
    updated = true;
  }
  
  // 保存更新后的文件
  if (updated) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`已更新文件: ${file}`);
  } else {
    console.log(`文件无需更新: ${file}`);
  }
});

console.log('所有博客文章文件更新完成！');