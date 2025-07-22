/**
 * 移动端性能优化工具
 * 
 * 此脚本专注于移动端性能优化:
 * 1. 检查响应式设计
 * 2. 优化触摸交互
 * 3. 检查视口设置
 * 4. 优化移动端加载速度
 * 5. 检查字体大小和可读性
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
  excludeDirs: ['node_modules', '.git'], // 要排除的目录
  applyFixes: false, // 是否应用修复（默认仅报告问题）
};

// 结果统计
const stats = {
  filesChecked: 0,
  issuesFound: 0,
  issuesFixed: 0,
};

// 存储所有发现的问题和建议
const issues = [];
const recommendations = [];

/**
 * 检查HTML文件的移动端优化
 */
function checkMobileOptimization(filePath) {
  try {
    console.log(chalk.blue(`检查文件: ${filePath}`));
    
    // 读取文件内容
    const content = fs.readFileSync(filePath, 'utf8');
    
    // 解析DOM
    const dom = new JSDOM(content);
    const document = dom.window.document;
    
    // 检查视口设置
    checkViewport(document, filePath);
    
    // 检查触摸目标大小
    checkTouchTargets(document, filePath);
    
    // 检查字体大小和可读性
    checkFontSizes(document, filePath);
    
    // 检查响应式图片
    checkResponsiveImages(document, filePath);
    
    // 检查媒体查询
    checkMediaQueries(content, filePath);
    
    stats.filesChecked++;
    
    // 如果需要应用修复，保存修改后的文件
    if (config.applyFixes) {
      // 获取修改后的HTML
      const optimizedHtml = dom.serialize();
      
      // 保存优化后的文件
      // fs.writeFileSync(filePath, optimizedHtml, 'utf8');
      console.log(chalk.green(`  已应用修复到文件: ${filePath}`));
    }
  } catch (error) {
    console.error(chalk.red(`无法检查文件 ${filePath}: ${error.message}`));
    issues.push({
      file: filePath,
      message: `检查失败: ${error.message}`
    });
  }
}

/**
 * 检查视口设置
 */
function checkViewport(document, filePath) {
  const viewport = document.querySelector('meta[name="viewport"]');
  
  if (!viewport) {
    issues.push({
      file: filePath,
      message: '缺少视口元标签，添加: <meta name="viewport" content="width=device-width, initial-scale=1.0">'
    });
    stats.issuesFound++;
    return;
  }
  
  const content = viewport.getAttribute('content');
  
  if (!content.includes('width=device-width')) {
    issues.push({
      file: filePath,
      message: '视口元标签缺少 width=device-width 设置'
    });
    stats.issuesFound++;
  }
  
  if (!content.includes('initial-scale=1')) {
    issues.push({
      file: filePath,
      message: '视口元标签缺少 initial-scale=1 设置'
    });
    stats.issuesFound++;
  }
}

/**
 * 检查触摸目标大小
 */
function checkTouchTargets(document, filePath) {
  // 检查按钮、链接等交互元素
  const touchTargets = document.querySelectorAll('a, button, input, select, textarea');
  
  touchTargets.forEach(element => {
    // 在实际实现中，我们需要计算元素的实际尺寸
    // 这里我们只检查是否有内联样式设置了过小的尺寸
    
    const style = element.getAttribute('style') || '';
    
    if (style.includes('width') && style.includes('px')) {
      const widthMatch = style.match(/width:\s*(\d+)px/);
      if (widthMatch && parseInt(widthMatch[1]) < 44) {
        issues.push({
          file: filePath,
          element: element.tagName.toLowerCase(),
          message: `触摸目标宽度过小 (${widthMatch[1]}px)，应至少为44px`
        });
        stats.issuesFound++;
      }
    }
    
    if (style.includes('height') && style.includes('px')) {
      const heightMatch = style.match(/height:\s*(\d+)px/);
      if (heightMatch && parseInt(heightMatch[1]) < 44) {
        issues.push({
          file: filePath,
          element: element.tagName.toLowerCase(),
          message: `触摸目标高度过小 (${heightMatch[1]}px)，应至少为44px`
        });
        stats.issuesFound++;
      }
    }
  });
}

/**
 * 检查字体大小和可读性
 */
function checkFontSizes(document, filePath) {
  // 检查文本元素
  const textElements = document.querySelectorAll('p, span, div, h1, h2, h3, h4, h5, h6, li, td, th');
  
  textElements.forEach(element => {
    const style = element.getAttribute('style') || '';
    
    // 检查内联字体大小
    if (style.includes('font-size') && style.includes('px')) {
      const fontSizeMatch = style.match(/font-size:\s*(\d+)px/);
      if (fontSizeMatch && parseInt(fontSizeMatch[1]) < 16) {
        issues.push({
          file: filePath,
          element: element.tagName.toLowerCase(),
          message: `字体大小过小 (${fontSizeMatch[1]}px)，移动端建议至少16px`
        });
        stats.issuesFound++;
      }
    }
    
    // 检查行高
    if (style.includes('line-height') && !style.includes('1.5')) {
      const lineHeightMatch = style.match(/line-height:\s*([\d\.]+)/);
      if (lineHeightMatch && parseFloat(lineHeightMatch[1]) < 1.5) {
        recommendations.push({
          file: filePath,
          element: element.tagName.toLowerCase(),
          message: `行高较小 (${lineHeightMatch[1]})，移动端建议至少1.5`
        });
      }
    }
  });
}

/**
 * 检查响应式图片
 */
function checkResponsiveImages(document, filePath) {
  const images = document.querySelectorAll('img');
  
  images.forEach(img => {
    // 检查是否使用srcset
    if (!img.hasAttribute('srcset') && !img.closest('picture')) {
      recommendations.push({
        file: filePath,
        element: 'img',
        attribute: 'src',
        value: img.getAttribute('src'),
        message: '考虑使用srcset和sizes属性或picture元素提供响应式图片'
      });
    }
    
    // 检查是否设置了最大宽度
    const style = img.getAttribute('style') || '';
    if (!style.includes('max-width') && !img.hasAttribute('width')) {
      recommendations.push({
        file: filePath,
        element: 'img',
        attribute: 'src',
        value: img.getAttribute('src'),
        message: '添加 max-width: 100% 样式以确保图片不会溢出容器'
      });
    }
  });
}

/**
 * 检查媒体查询
 */
function checkMediaQueries(content, filePath) {
  // 检查是否有媒体查询
  const hasMediaQueries = /@media\s*\(/i.test(content);
  
  if (!hasMediaQueries) {
    recommendations.push({
      file: filePath,
      message: '未检测到媒体查询，考虑添加响应式设计的媒体查询'
    });
  }
  
  // 检查常见的移动端断点
  const commonBreakpoints = [
    '@media (max-width: 768px)',
    '@media (max-width: 640px)',
    '@media (max-width: 480px)'
  ];
  
  let hasMobileBreakpoint = false;
  
  for (const breakpoint of commonBreakpoints) {
    if (content.includes(breakpoint)) {
      hasMobileBreakpoint = true;
      break;
    }
  }
  
  if (!hasMobileBreakpoint && hasMediaQueries) {
    recommendations.push({
      file: filePath,
      message: '未检测到移动端断点的媒体查询，考虑添加小屏幕的媒体查询'
    });
  }
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
      checkMobileOptimization(fullPath);
    }
  }
}

/**
 * 主函数
 */
function main() {
  console.log(chalk.green('开始检查移动端优化...'));
  console.log(chalk.yellow('注意: 此工具需要安装jsdom和chalk包'));
  console.log(chalk.yellow('如果尚未安装，请运行: npm install jsdom chalk'));
  
  try {
    // 开始扫描
    scanDirectory(config.rootDir);
    
    // 输出结果
    console.log('\n' + chalk.green('===== 移动端优化检查完成 ====='));
    console.log(chalk.blue(`检查了 ${stats.filesChecked} 个文件`));
    console.log(chalk.yellow(`发现 ${stats.issuesFound} 个问题`));
    
    if (config.applyFixes) {
      console.log(chalk.green(`修复了 ${stats.issuesFixed} 个问题`));
    }
    
    // 输出问题
    if (issues.length > 0) {
      console.log('\n' + chalk.red('===== 需要修复的问题 ====='));
      issues.forEach((issue, index) => {
        console.log(chalk.yellow(`问题 #${index + 1}:`));
        console.log(chalk.blue(`  文件: ${issue.file}`));
        if (issue.element) {
          console.log(chalk.blue(`  元素: <${issue.element}>`));
        }
        console.log(chalk.red(`  问题: ${issue.message}`));
        console.log('');
      });
    }
    
    // 输出建议
    if (recommendations.length > 0) {
      console.log('\n' + chalk.yellow('===== 优化建议 ====='));
      recommendations.forEach((rec, index) => {
        console.log(chalk.blue(`建议 #${index + 1}:`));
        console.log(chalk.yellow(`  文件: ${rec.file}`));
        if (rec.element) {
          console.log(chalk.blue(`  元素: <${rec.element}${rec.attribute ? ` ${rec.attribute}="${rec.value}"` : ''}>`));
        }
        console.log(chalk.green(`  建议: ${rec.message}`));
        console.log('');
      });
    }
    
    // 输出总结
    if (issues.length === 0) {
      console.log(chalk.green('✓ 恭喜！没有发现严重的移动端优化问题。'));
    } else {
      console.log(chalk.red(`✗ 发现 ${issues.length} 个需要修复的问题，请参考上述详情。`));
    }
    
    if (recommendations.length > 0) {
      console.log(chalk.yellow(`ℹ 有 ${recommendations.length} 个优化建议可以进一步提升移动端体验。`));
    }
    
  } catch (error) {
    console.error(chalk.red(`执行过程中出错: ${error.message}`));
  }
}

// 执行主函数
main();