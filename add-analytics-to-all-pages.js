const fs = require('fs');
const path = require('path');

// Google Tag Manager 代码
const gtmHeadCode = `<!-- Google Tag Manager -->
    <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','GTM-NVT75WW9');</script>
    <!-- End Google Tag Manager -->`;

// Google Analytics 代码
const gaCode = `<!-- Google tag (gtag.js) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-4K73RJPLKS"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
    
      gtag('config', 'G-4K73RJPLKS');
    </script>`;

// Google Tag Manager noscript 代码 (用于 body 标签)
const gtmBodyCode = `<!-- Google Tag Manager (noscript) -->
    <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-NVT75WW9"
    height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
    <!-- End Google Tag Manager (noscript) -->`;

// 递归查找所有 HTML 文件
function findHtmlFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      findHtmlFiles(filePath, fileList);
    } else if (path.extname(file).toLowerCase() === '.html') {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

// 添加跟踪代码到 HTML 文件
function addTrackingCode(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // 检查文件是否已包含跟踪代码
    if (content.includes('GTM-NVT75WW9') && content.includes('G-4K73RJPLKS')) {
      console.log(`跳过 ${filePath} - 已包含跟踪代码`);
      return false;
    }
    
    // 添加 Google Tag Manager 和 Google Analytics 到 head 标签
    if (content.includes('<head>')) {
      content = content.replace('<head>', `<head>\n${gtmHeadCode}\n${gaCode}`);
      modified = true;
    }
    
    // 添加 Google Tag Manager noscript 到 body 标签
    if (content.includes('<body>')) {
      content = content.replace('<body>', `<body>\n${gtmBodyCode}`);
      modified = true;
    }
    
    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`已更新 ${filePath}`);
      return true;
    } else {
      console.log(`无法更新 ${filePath} - 未找到 head 或 body 标签`);
      return false;
    }
  } catch (error) {
    console.error(`处理 ${filePath} 时出错:`, error);
    return false;
  }
}

// 主函数
function main() {
  // 获取当前目录下的所有 HTML 文件
  const htmlFiles = findHtmlFiles('.');
  console.log(`找到 ${htmlFiles.length} 个 HTML 文件`);
  
  let updatedCount = 0;
  let skippedCount = 0;
  let errorCount = 0;
  
  // 处理每个 HTML 文件
  htmlFiles.forEach(file => {
    try {
      const result = addTrackingCode(file);
      if (result) {
        updatedCount++;
      } else {
        skippedCount++;
      }
    } catch (error) {
      console.error(`处理 ${file} 时出错:`, error);
      errorCount++;
    }
  });
  
  console.log('\n===== 处理完成 =====');
  console.log(`总共处理: ${htmlFiles.length} 个文件`);
  console.log(`成功更新: ${updatedCount} 个文件`);
  console.log(`已跳过: ${skippedCount} 个文件`);
  console.log(`错误: ${errorCount} 个文件`);
}

// 执行主函数
main();