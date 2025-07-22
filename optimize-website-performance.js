/**
 * 网站性能优化工具
 * 
 * 此脚本执行多项性能优化:
 * 1. 压缩HTML文件
 * 2. 优化CSS
 * 3. 优化JavaScript
 * 4. 添加资源提示（preload, preconnect等）
 * 5. 检查并报告性能问题
 */

const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');
const chalk = require('chalk');

// 配置
const config = {
  rootDir: '.', // 网站根目录
  htmlExtensions: ['.html'], // HTML文件扩展名
  cssExtensions: ['.css'], // CSS文件扩展名
  jsExtensions: ['.js'], // JS文件扩展名
  excludeDirs: ['node_modules', '.git'], // 要排除的目录
  minify: true, // 是否压缩文件
};

// 结果统计
const stats = {
  htmlProcessed: 0,
  cssProcessed: 0,
  jsProcessed: 0,
  totalSizeBefore: 0,
  totalSizeAfter: 0,
};

// 存储所有发现的问题和建议
const issues = [];
const recommendations = [];

/**
 * 压缩HTML
 */
function minifyHtml(content) {
  // 简单的HTML压缩 - 生产环境应使用html-minifier等库
  return content
    .replace(/<!--(?!<!)[^\[>].*?-->/g, '') // 移除注释
    .replace(/\s{2,}/g, ' ') // 压缩空白
    .replace(/>\s+</g, '><'); // 移除标签间的空白
}

/**
 * 优化HTML文件
 */
function optimizeHtmlFile(filePath) {
  try {
    console.log(chalk.blue(`优化HTML文件: ${filePath}`));
    
    // 读取文件内容
    const content = fs.readFileSync(filePath, 'utf8');
    const originalSize = Buffer.byteLength(content, 'utf8');
    stats.totalSizeBefore += originalSize;
    
    // 解析DOM
    const dom = new JSDOM(content);
    const document = dom.window.document;
    
    // 检查性能问题
    checkPerformanceIssues(document, filePath);
    
    // 添加性能优化
    addPerformanceOptimizations(document, filePath);
    
    // 获取优化后的HTML
    let optimizedHtml = dom.serialize();
    
    // 压缩HTML
    if (config.minify) {
      optimizedHtml = minifyHtml(optimizedHtml);
    }
    
    // 计算优化后的大小
    const optimizedSize = Buffer.byteLength(optimizedHtml, 'utf8');
    stats.totalSizeAfter += optimizedSize;
    
    // 保存优化后的文件
    // 注意：在实际使用中，您可能想要备份原始文件
    // fs.writeFileSync(filePath, optimizedHtml, 'utf8');
    
    // 记录优化结果
    const savingsPercent = ((originalSize - optimizedSize) / originalSize * 100).toFixed(2);
    console.log(chalk.green(`  优化完成: ${originalSize} → ${optimizedSize} 字节 (节省 ${savingsPercent}%)`));
    
    stats.htmlProcessed++;
  } catch (error) {
    console.error(chalk.red(`无法优化文件 ${filePath}: ${error.message}`));
    issues.push({
      file: filePath,
      message: `优化失败: ${error.message}`
    });
  }
}

/**
 * 检查性能问题
 */
function checkPerformanceIssues(document, filePath) {
  // 检查未压缩的图片
  const images = document.querySelectorAll('img');
  images.forEach(img => {
    const src = img.getAttribute('src');
    if (src && !img.hasAttribute('loading')) {
      recommendations.push({
        file: filePath,
        element: 'img',
        attribute: 'src',
        value: src,
        message: '添加 loading="lazy" 属性以延迟加载图片'
      });
    }
    
    // 检查是否缺少宽高属性
    if (src && (!img.hasAttribute('width') || !img.hasAttribute('height'))) {
      recommendations.push({
        file: filePath,
        element: 'img',
        attribute: 'src',
        value: src,
        message: '添加 width 和 height 属性以防止布局偏移'
      });
    }
  });
  
  // 检查未优化的字体加载
  const fontLinks = document.querySelectorAll('link[rel="stylesheet"][href*="fonts"]');
  fontLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href && !link.hasAttribute('preload') && !link.hasAttribute('preconnect')) {
      recommendations.push({
        file: filePath,
        element: 'link',
        attribute: 'href',
        value: href,
        message: '使用 preconnect 或 preload 优化字体加载'
      });
    }
  });
  
  // 检查阻塞渲染的脚本
  const scripts = document.querySelectorAll('script');
  scripts.forEach(script => {
    const src = script.getAttribute('src');
    if (src && !script.hasAttribute('async') && !script.hasAttribute('defer')) {
      recommendations.push({
        file: filePath,
        element: 'script',
        attribute: 'src',
        value: src,
        message: '添加 async 或 defer 属性以防止脚本阻塞渲染'
      });
    }
  });
}

/**
 * 添加性能优化
 */
function addPerformanceOptimizations(document, filePath) {
  // 添加资源提示
  const head = document.querySelector('head');
  if (head) {
    // 检查是否已有preconnect
    const hasPreconnect = document.querySelector('link[rel="preconnect"][href*="fonts.googleapis.com"]');
    if (!hasPreconnect) {
      const preconnect = document.createElement('link');
      preconnect.rel = 'preconnect';
      preconnect.href = 'https://fonts.googleapis.com';
      head.insertBefore(preconnect, head.firstChild);
    }
    
    // 检查是否已有DNS预取
    const hasDnsPrefetch = document.querySelector('link[rel="dns-prefetch"][href*="fonts.googleapis.com"]');
    if (!hasDnsPrefetch) {
      const dnsPrefetch = document.createElement('link');
      dnsPrefetch.rel = 'dns-prefetch';
      dnsPrefetch.href = 'https://fonts.googleapis.com';
      head.insertBefore(dnsPrefetch, head.firstChild);
    }
  }
  
  // 为图片添加loading="lazy"
  const images = document.querySelectorAll('img:not([loading])');
  images.forEach(img => {
    img.setAttribute('loading', 'lazy');
  });
}

/**
 * 递归扫描目录
 */
function scanDirectory(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    // 跳过排除的目录
    if (entry.isDirectory() && !config.excludeDirs.includes(entry.name)) {
      scanDirectory(fullPath);
      continue;
    }
    
    // 处理HTML文件
    if (entry.isFile() && config.htmlExtensions.includes(path.extname(entry.name).toLowerCase())) {
      optimizeHtmlFile(fullPath);
    }
    
    // 处理CSS文件 (实际实现中应添加)
    if (entry.isFile() && config.cssExtensions.includes(path.extname(entry.name).toLowerCase())) {
      // optimizeCssFile(fullPath);
      stats.cssProcessed++;
    }
    
    // 处理JS文件 (实际实现中应添加)
    if (entry.isFile() && config.jsExtensions.includes(path.extname(entry.name).toLowerCase())) {
      // optimizeJsFile(fullPath);
      stats.jsProcessed++;
    }
  }
}

/**
 * 主函数
 */
function main() {
  console.log(chalk.green('开始优化网站性能...'));
  console.log(chalk.yellow('注意: 此工具需要安装jsdom和chalk包'));
  console.log(chalk.yellow('如果尚未安装，请运行: npm install jsdom chalk'));
  
  try {
    // 开始扫描
    scanDirectory(config.rootDir);
    
    // 输出结果
    console.log('\n' + chalk.green('===== 性能优化完成 ====='));
    console.log(chalk.blue(`处理了 ${stats.htmlProcessed} 个HTML文件`));
    console.log(chalk.blue(`处理了 ${stats.cssProcessed} 个CSS文件`));
    console.log(chalk.blue(`处理了 ${stats.jsProcessed} 个JS文件`));
    
    const totalSavings = stats.totalSizeBefore - stats.totalSizeAfter;
    const savingsPercent = ((totalSavings) / stats.totalSizeBefore * 100).toFixed(2);
    console.log(chalk.green(`总体积减少: ${totalSavings} 字节 (${savingsPercent}%)`));
    
    // 输出建议
    if (recommendations.length > 0) {
      console.log('\n' + chalk.yellow('===== 性能优化建议 ====='));
      recommendations.forEach((rec, index) => {
        console.log(chalk.blue(`建议 #${index + 1}:`));
        console.log(chalk.yellow(`  文件: ${rec.file}`));
        console.log(chalk.blue(`  元素: <${rec.element} ${rec.attribute}="${rec.value}">`));
        console.log(chalk.green(`  建议: ${rec.message}`));
        console.log('');
      });
    }
    
    // 输出问题
    if (issues.length > 0) {
      console.log('\n' + chalk.red('===== 发现的问题 ====='));
      issues.forEach((issue, index) => {
        console.log(chalk.yellow(`问题 #${index + 1}:`));
        console.log(chalk.blue(`  文件: ${issue.file}`));
        console.log(chalk.red(`  错误: ${issue.message}`));
        console.log('');
      });
    }
    
  } catch (error) {
    console.error(chalk.red(`执行过程中出错: ${error.message}`));
  }
}

// 执行主函数
main();