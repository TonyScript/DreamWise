/**
 * 为所有HTML页面添加分析代码
 * 
 * 此脚本会检查所有HTML文件，确保它们包含必要的分析代码
 * 1. Google Analytics
 * 2. Google Tag Manager
 * 3. 自定义事件跟踪
 */

const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');
const chalk = require('chalk');

// 配置
const config = {
  rootDir: '.', // 网站根目录
  htmlExtensions: ['.html'], // HTML文件扩展名
  excludeDirs: ['node_modules', '.git'], // 要排除的目录
  applyChanges: true, // 是否应用更改
  
  // 分析代码配置
  analytics: {
    googleTagManager: {
      id: 'GTM-NVT75WW9', // Google Tag Manager ID
      headCode: `<!-- Google Tag Manager -->
    <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','GTM-NVT75WW9');</script>
    <!-- End Google Tag Manager -->`,
      bodyCode: `<!-- Google Tag Manager (noscript) -->
    <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-NVT75WW9"
    height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
    <!-- End Google Tag Manager (noscript) -->`
    },
    googleAnalytics: {
      id: 'G-4K73RJPLKS', // Google Analytics ID
      code: `<!-- Google tag (gtag.js) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-4K73RJPLKS"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
    
      gtag('config', 'G-4K73RJPLKS');
    </script>`
    },
    customTracking: {
      code: `<!-- Custom Event Tracking -->
    <script>
      document.addEventListener('DOMContentLoaded', function() {
        // Track outbound links
        document.querySelectorAll('a[href^="http"]').forEach(function(link) {
          link.addEventListener('click', function(e) {
            if (typeof gtag === 'function') {
              gtag('event', 'click', {
                'event_category': 'outbound',
                'event_label': this.href,
                'transport_type': 'beacon'
              });
            }
          });
        });
        
        // Track form submissions
        document.querySelectorAll('form').forEach(function(form) {
          form.addEventListener('submit', function(e) {
            if (typeof gtag === 'function') {
              gtag('event', 'submit', {
                'event_category': 'form',
                'event_label': this.id || this.action
              });
            }
          });
        });
      });
    </script>`
    }
  }
};

// 结果统计
const stats = {
  filesChecked: 0,
  filesUpdated: 0,
  gtmAdded: 0,
  gaAdded: 0,
  customTrackingAdded: 0
};

// 存储所有发现的问题
const issues = [];

/**
 * 检查并添加分析代码到HTML文件
 */
function addAnalyticsToHtml(filePath) {
  try {
    console.log(chalk.blue(`处理文件: ${filePath}`));
    
    // 读取文件内容
    const content = fs.readFileSync(filePath, 'utf8');
    
    // 解析DOM
    const dom = new JSDOM(content);
    const document = dom.window.document;
    
    let modified = false;
    
    // 检查并添加Google Tag Manager (head)
    if (!content.includes('googletagmanager.com/gtm.js')) {
      const head = document.querySelector('head');
      if (head) {
        const gtmScript = document.createRange().createContextualFragment(config.analytics.googleTagManager.headCode);
        head.insertBefore(gtmScript, head.firstChild);
        console.log(chalk.green(`  添加了Google Tag Manager (head) 到 ${filePath}`));
        stats.gtmAdded++;
        modified = true;
      } else {
        issues.push({
          file: filePath,
          message: '无法找到<head>标签'
        });
      }
    }
    
    // 检查并添加Google Tag Manager (body)
    if (!content.includes('googletagmanager.com/ns.html')) {
      const body = document.querySelector('body');
      if (body) {
        const gtmNoscript = document.createRange().createContextualFragment(config.analytics.googleTagManager.bodyCode);
        body.insertBefore(gtmNoscript, body.firstChild);
        console.log(chalk.green(`  添加了Google Tag Manager (body) 到 ${filePath}`));
        modified = true;
      } else {
        issues.push({
          file: filePath,
          message: '无法找到<body>标签'
        });
      }
    }
    
    // 检查并添加Google Analytics
    if (!content.includes('gtag(\'config\'')) {
      const head = document.querySelector('head');
      if (head) {
        const gaScript = document.createRange().createContextualFragment(config.analytics.googleAnalytics.code);
        
        // 插入到GTM脚本之后
        const gtmScript = head.querySelector('script');
        if (gtmScript) {
          gtmScript.parentNode.insertBefore(gaScript, gtmScript.nextSibling);
        } else {
          head.insertBefore(gaScript, head.firstChild);
        }
        
        console.log(chalk.green(`  添加了Google Analytics 到 ${filePath}`));
        stats.gaAdded++;
        modified = true;
      }
    }
    
    // 检查并添加自定义事件跟踪
    if (!content.includes('Custom Event Tracking')) {
      const head = document.querySelector('head');
      if (head) {
        const customScript = document.createRange().createContextualFragment(config.analytics.customTracking.code);
        head.appendChild(customScript);
        console.log(chalk.green(`  添加了自定义事件跟踪 到 ${filePath}`));
        stats.customTrackingAdded++;
        modified = true;
      }
    }
    
    // 如果有修改并且配置为应用更改，则保存文件
    if (modified && config.applyChanges) {
      const updatedContent = dom.serialize();
      fs.writeFileSync(filePath, updatedContent, 'utf8');
      stats.filesUpdated++;
    }
    
    stats.filesChecked++;
  } catch (error) {
    console.error(chalk.red(`处理文件 ${filePath} 时出错: ${error.message}`));
    issues.push({
      file: filePath,
      message: `处理失败: ${error.message}`
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
      addAnalyticsToHtml(fullPath);
    }
  }
}

/**
 * 主函数
 */
function main() {
  console.log(chalk.green('开始为所有HTML页面添加分析代码...'));
  console.log(chalk.yellow('注意: 此工具需要安装jsdom和chalk包'));
  console.log(chalk.yellow('如果尚未安装，请运行: npm install jsdom chalk'));
  
  if (!config.applyChanges) {
    console.log(chalk.yellow('⚠️ 运行在只读模式，不会应用更改'));
  }
  
  try {
    // 开始扫描
    scanDirectory(config.rootDir);
    
    // 输出结果
    console.log('\n' + chalk.green('===== 分析代码添加完成 ====='));
    console.log(chalk.blue(`检查了 ${stats.filesChecked} 个文件`));
    
    if (config.applyChanges) {
      console.log(chalk.green(`更新了 ${stats.filesUpdated} 个文件`));
    }
    
    console.log(chalk.blue(`添加了 ${stats.gtmAdded} 个Google Tag Manager代码`));
    console.log(chalk.blue(`添加了 ${stats.gaAdded} 个Google Analytics代码`));
    console.log(chalk.blue(`添加了 ${stats.customTrackingAdded} 个自定义事件跟踪代码`));
    
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
    
    // 输出总结
    if (issues.length === 0) {
      console.log(chalk.green('✓ 所有文件处理成功！'));
    } else {
      console.log(chalk.red(`✗ 处理过程中发现 ${issues.length} 个问题，请检查上述详情。`));
    }
    
  } catch (error) {
    console.error(chalk.red(`执行过程中出错: ${error.message}`));
  }
}

// 执行主函数
main();