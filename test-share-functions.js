const fs = require('fs');
const path = require('path');

// 定义要检查的社交媒体链接和网站链接
const facebookLink = 'https://www.facebook.com/renshengkuduanjishixingle';
const twitterLink = 'https://x.com/Jonathan230117';
const instagramLink = 'https://www.instagram.com/doushixuwang/';
const websiteLink = 'https://dreamwise.charitydoing.com';

// 获取所有HTML文件
const htmlFiles = fs.readdirSync('.').filter(file => 
  file.endsWith('.html')
);

console.log(`开始检查 ${htmlFiles.length} 个HTML文件...`);

let errors = 0;
let warnings = 0;

// 检查每个文件
htmlFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  
  // 检查是否包含旧的网站链接
  const oldWebsiteLinks = [
    'https://dreaminterpretation.com',
    'http://dreaminterpretation.com',
    'https://dreamwise.com',
    'http://dreamwise.com'
  ];
  
  oldWebsiteLinks.forEach(oldLink => {
    if (content.includes(oldLink)) {
      console.error(`错误: ${file} 仍然包含旧的网站链接: ${oldLink}`);
      errors++;
    }
  });
  
  // 检查结构化数据中的URL
  if (content.includes('"@context": "https://schema.org"') || content.includes('"@context":"https://schema.org"')) {
    // 文件包含结构化数据
    if (!content.includes(`"url": "${websiteLink}`) && !content.includes(`"url":"${websiteLink}`)) {
      console.warn(`警告: ${file} 中的结构化数据可能没有更新网站链接`);
      warnings++;
    }
  }
  
  // 检查社交媒体链接（仅对博客文章和包含分享功能的页面）
  if (file.startsWith('blog-') || content.includes('Share this')) {
    if (!content.includes(facebookLink)) {
      console.warn(`警告: ${file} 可能没有更新Facebook链接`);
      warnings++;
    }
    
    if (!content.includes(twitterLink)) {
      console.warn(`警告: ${file} 可能没有更新Twitter链接`);
      warnings++;
    }
    
    if (!content.includes(instagramLink)) {
      console.warn(`警告: ${file} 可能没有更新Instagram链接`);
      warnings++;
    }
  }
});

console.log(`检查完成！发现 ${errors} 个错误和 ${warnings} 个警告。`);

if (errors === 0 && warnings === 0) {
  console.log('所有链接更新成功！');
} else {
  console.log('请检查上述错误和警告，并手动修复相关问题。');
}