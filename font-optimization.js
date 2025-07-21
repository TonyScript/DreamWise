// 此脚本用于优化字体加载
// 在index.html的<head>部分添加以下代码

const fs = require('fs');

// 读取index.html文件
let indexContent = fs.readFileSync('index.html', 'utf8');

// 检查是否已经有预加载字体的代码
if (!indexContent.includes('<link rel="preload" as="font"')) {
  // 查找Inter字体的引用
  const interFontLink = indexContent.match(/<link href="https:\/\/fonts\.googleapis\.com\/css2\?family=Inter[^"]+" rel="stylesheet">/);
  
  if (interFontLink) {
    // 获取原始字体链接
    const originalFontLink = interFontLink[0];
    
    // 创建预加载链接
    const preloadLinks = `
    <!-- 预加载字体资源 -->
    <link rel="preload" as="font" href="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiJ-Ek-_EeA.woff2" crossorigin>
    <link rel="preload" as="font" href="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGKYAZ9hiJ-Ek-_EeA.woff2" crossorigin>
    
    <!-- 修改后的字体链接，添加display=swap参数 -->
    <link href="${originalFontLink.match(/href="([^"]+)"/)[1]}&display=swap" rel="stylesheet">`;
    
    // 替换原始字体链接
    indexContent = indexContent.replace(originalFontLink, preloadLinks);
    
    // 写回文件
    fs.writeFileSync('index-optimized.html', indexContent, 'utf8');
    console.log('已创建优化后的index-optimized.html文件，添加了字体预加载和display=swap');
  } else {
    console.log('未找到Inter字体链接，请手动添加预加载代码');
  }
} else {
  console.log('字体预加载已存在，无需修改');
}

// 创建一个CSS文件，用于添加字体显示策略
const fontDisplayCSS = `
/* 字体显示策略 */
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiJ-Ek-_EeA.woff2) format('woff2');
}
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 700;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGKYAZ9hiJ-Ek-_EeA.woff2) format('woff2');
}
`;

fs.writeFileSync('assets/css/font-display.css', fontDisplayCSS, 'utf8');
console.log('已创建font-display.css文件，添加了字体显示策略');