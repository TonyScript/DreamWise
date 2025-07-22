/**
 * 全站链接测试工具
 * 
 * 此脚本检查网站中的所有HTML文件，并验证其中的链接是否有效
 * 它会检查:
 * 1. 内部链接 - 确保它们指向存在的文件
 * 2. 锚点链接 - 确保它们格式正确
 * 3. 外部链接 - 记录但不验证
 */

const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');
const chalk = require('chalk');

// 配置
const config = {
  rootDir: '.', // 网站根目录
  extensions: ['.html'], // 要检查的文件扩展名
  excludeDirs: ['node_modules', '.git'], // 要排除的目录
  checkExternalLinks: false, // 是否检查外部链接（需要网络请求）
};

// 结果统计
const stats = {
  filesChecked: 0,
  linksChecked: 0,
  brokenLinks: 0,
  validLinks: 0,
  externalLinks: 0,
};

// 存储所有发现的问题
const issues = [];

/**
 * 检查文件是否存在
 */
function fileExists(filePath) {
  try {
    return fs.existsSync(filePath);
  } catch (err) {
    return false;
  }
}

/**
 * 检查链接是否有效
 */
function checkLink(href, filePath) {
  // 忽略空链接、javascript:和mailto:链接
  if (!href || href === '#' || href.startsWith('javascript:') || href.startsWith('mailto:') || href.startsWith('tel:')) {
    return true;
  }

  // 检查是否为外部链接
  if (href.startsWith('http://') || href.startsWith('https://')) {
    stats.externalLinks++;
    return true; // 不验证外部链接
  }

  // 处理锚点链接
  if (href.startsWith('#')) {
    return true; // 简单记录，不验证锚点是否存在
  }

  // 处理相对路径
  let targetPath = href;
  
  // 移除URL参数和锚点
  targetPath = targetPath.split('#')[0].split('?')[0];
  
  // 如果链接以/结尾，添加index.html
  if (targetPath.endsWith('/')) {
    targetPath += 'index.html';
  }
  
  // 如果没有扩展名，添加.html
  if (!path.extname(targetPath)) {
    targetPath += '.html';
  }
  
  // 构建完整路径
  const fullPath = path.join(config.rootDir, targetPath);
  
  // 检查文件是否存在
  const exists = fileExists(fullPath);
  
  if (!exists) {
    issues.push({
      file: filePath,
      link: href,
      fullPath: fullPath,
      message: `链接指向不存在的文件: ${href}`
    });
    stats.brokenLinks++;
    return false;
  }
  
  stats.validLinks++;
  return true;
}

/**
 * 检查HTML文件中的所有链接
 */
function checkHtmlFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const dom = new JSDOM(content);
    const document = dom.window.document;
    
    // 获取所有链接
    const links = document.querySelectorAll('a[href]');
    
    console.log(chalk.blue(`检查文件: ${filePath} (${links.length} 个链接)`));
    
    // 检查每个链接
    links.forEach(link => {
      const href = link.getAttribute('href');
      stats.linksChecked++;
      checkLink(href, filePath);
    });
    
    stats.filesChecked++;
  } catch (error) {
    console.error(chalk.red(`无法解析文件 ${filePath}: ${error.message}`));
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
    
    // 检查文件扩展名
    if (entry.isFile() && config.extensions.includes(path.extname(entry.name).toLowerCase())) {
      checkHtmlFile(fullPath);
    }
  }
}

/**
 * 主函数
 */
function main() {
  console.log(chalk.green('开始检查网站链接...'));
  console.log(chalk.yellow('注意: 此工具需要安装jsdom和chalk包'));
  console.log(chalk.yellow('如果尚未安装，请运行: npm install jsdom chalk'));
  
  try {
    // 开始扫描
    scanDirectory(config.rootDir);
    
    // 输出结果
    console.log('\n' + chalk.green('===== 链接检查完成 ====='));
    console.log(chalk.blue(`检查了 ${stats.filesChecked} 个文件`));
    console.log(chalk.blue(`检查了 ${stats.linksChecked} 个链接`));
    console.log(chalk.green(`有效链接: ${stats.validLinks}`));
    console.log(chalk.yellow(`外部链接: ${stats.externalLinks} (未验证)`));
    console.log(chalk.red(`无效链接: ${stats.brokenLinks}`));
    
    // 输出问题详情
    if (issues.length > 0) {
      console.log('\n' + chalk.red('===== 发现的问题 ====='));
      issues.forEach((issue, index) => {
        console.log(chalk.yellow(`问题 #${index + 1}:`));
        console.log(chalk.blue(`  文件: ${issue.file}`));
        console.log(chalk.red(`  链接: ${issue.link}`));
        console.log(chalk.gray(`  路径: ${issue.fullPath}`));
        console.log(chalk.red(`  错误: ${issue.message}`));
        console.log('');
      });
    }
    
    // 输出总结
    if (stats.brokenLinks === 0) {
      console.log(chalk.green('✓ 恭喜！没有发现无效链接。'));
    } else {
      console.log(chalk.red(`✗ 发现 ${stats.brokenLinks} 个无效链接，请修复上述问题。`));
    }
  } catch (error) {
    console.error(chalk.red(`执行过程中出错: ${error.message}`));
  }
}

// 执行主函数
main();