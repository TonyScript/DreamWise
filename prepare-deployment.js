const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

// 如果archiver模块不存在，提示安装
try {
  require.resolve('archiver');
} catch (e) {
  console.error('请先安装archiver模块: npm install archiver');
  process.exit(1);
}

// 创建输出目录
const outputDir = 'deployment';
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

// 创建一个文件输出流
const output = fs.createWriteStream(path.join(outputDir, 'dreamwise-deployment.zip'));
const archive = archiver('zip', {
  zlib: { level: 9 } // 设置压缩级别
});

// 监听所有存档数据都已被写入
output.on('close', function() {
  console.log(`打包完成! 总大小: ${(archive.pointer() / 1024 / 1024).toFixed(2)} MB`);
  console.log(`文件位置: ${path.join(outputDir, 'dreamwise-deployment.zip')}`);
  console.log('现在您可以将此ZIP文件上传到服务器。');
});

// 监听警告
archive.on('warning', function(err) {
  if (err.code === 'ENOENT') {
    console.warn('警告:', err);
  } else {
    throw err;
  }
});

// 监听错误
archive.on('error', function(err) {
  throw err;
});

// 将存档数据管道输出到文件
archive.pipe(output);

// 要排除的文件和目录模式
const excludePatterns = [
  /\.md$/i,                // 排除所有MD文件
  /\.git(\/|$)/,           // 排除.git目录
  /node_modules(\/|$)/,    // 排除node_modules目录
  /\.DS_Store$/,           // 排除macOS的.DS_Store文件
  /\.env$/,                // 排除.env文件
  /update-.*\.js$/,        // 排除所有update-*.js文件
  /fix-.*\.js$/,           // 排除所有fix-*.js文件
  /new-.*\.html$/,         // 排除所有new-*.html文件
  /prepare-deployment\.js$/,  // 排除此脚本本身
  /deployment(\/|$)/,      // 排除deployment目录
  /\.gitignore$/,          // 排除.gitignore文件
  /package(-lock)?\.json$/,// 排除package.json和package-lock.json
  /README\.md$/i,          // 排除README.md
  /RESOURCES_PAGES_FINAL_REPORT\.md$/,  // 排除特定的MD文件
  /FOOTER_RESOURCES_COMPLETE\.md$/,     // 排除特定的MD文件
  /DreamWise_PRD_CN\.md$/              // 排除特定的MD文件
];

// 检查文件是否应该被排除
function shouldExclude(filePath) {
  return excludePatterns.some(pattern => pattern.test(filePath));
}

// 递归添加目录中的文件到存档
function addDirectoryToArchive(dirPath, archivePath = '') {
  const files = fs.readdirSync(dirPath);
  
  for (const file of files) {
    const filePath = path.join(dirPath, file);
    const archiveFilePath = path.join(archivePath, file);
    
    if (shouldExclude(filePath)) {
      console.log(`排除: ${filePath}`);
      continue;
    }
    
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      // 递归处理子目录
      addDirectoryToArchive(filePath, archiveFilePath);
    } else {
      // 添加文件到存档
      archive.file(filePath, { name: archiveFilePath });
      console.log(`添加: ${filePath}`);
    }
  }
}

// 特别处理index-new.html文件
if (fs.existsSync('index-new.html')) {
  // 如果存在index-new.html，将其作为index.html添加到存档
  archive.file('index-new.html', { name: 'index.html' });
  console.log('添加: index-new.html (作为 index.html)');
} else {
  // 否则添加原始的index.html
  archive.file('index.html', { name: 'index.html' });
  console.log('添加: index.html');
}

// 添加sitemap.xml
if (fs.existsSync('sitemap.xml')) {
  archive.file('sitemap.xml', { name: 'sitemap.xml' });
  console.log('添加: sitemap.xml');
}

// 添加当前目录中的其他文件和目录
const currentDir = '.';
const files = fs.readdirSync(currentDir);

for (const file of files) {
  const filePath = path.join(currentDir, file);
  
  // 跳过已经特别处理的文件
  if (file === 'index.html' || file === 'index-new.html' || file === 'sitemap.xml') {
    continue;
  }
  
  if (shouldExclude(filePath)) {
    console.log(`排除: ${filePath}`);
    continue;
  }
  
  const stat = fs.statSync(filePath);
  
  if (stat.isDirectory()) {
    // 递归处理子目录
    addDirectoryToArchive(filePath, file);
  } else {
    // 添加文件到存档
    archive.file(filePath, { name: file });
    console.log(`添加: ${filePath}`);
  }
}

// 完成存档
archive.finalize();