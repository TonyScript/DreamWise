const fs = require('fs');

// 读取index.html文件
const indexContent = fs.readFileSync('index.html', 'utf8');

// 查找页脚部分的开始和结束位置
const footerStartPattern = /<!-- Footer -->/;
const footerEndPattern = /<\/footer>\s*\n\s*<!-- JavaScript -->/;

// 替换页脚部分为动态加载的页脚组件
const updatedContent = indexContent.replace(
  new RegExp(footerStartPattern.source + '[\\s\\S]*?' + footerEndPattern.source),
  '<!-- Footer Container - Loaded dynamically -->\n    <div id="footer-container"></div>\n\n    <!-- JavaScript -->'
);

// 添加components.js脚本引用
const finalContent = updatedContent.replace(
  /<script src="assets\/js\/main\.min\.js"><\/script>\s*<\/body>/,
  '<script src="assets/js/main.min.js"></script>\n    <script src="assets/js/components.js"></script>\n</body>'
);

// 写入更新后的内容到index.html文件
fs.writeFileSync('index.html', finalContent, 'utf8');

console.log('成功更新index.html文件，现在使用动态加载的页脚组件！');