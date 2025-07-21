/**
 * JavaScript 优化脚本
 * 
 * 使用方法:
 * 1. 安装依赖: npm install terser --save-dev
 * 2. 运行脚本: node optimize-js.js
 */

const fs = require('fs');
const path = require('path');
const { minify } = require('terser');

// 要优化的 JS 文件
const jsFiles = [
  'assets/js/main.js',
  'assets/js/components.js'
];

// 优化 JavaScript 文件
async function optimizeJs() {
  for (const file of jsFiles) {
    try {
      console.log(`处理文件: ${file}`);
      const filePath = path.join(process.cwd(), file);
      
      if (!fs.existsSync(filePath)) {
        console.log(`文件不存在: ${filePath}`);
        continue;
      }
      
      // 读取文件内容
      const code = fs.readFileSync(filePath, 'utf8');
      
      // 使用 Terser 压缩代码
      const result = await minify(code, {
        compress: {
          drop_console: false,  // 保留 console 语句
          dead_code: true,      // 删除无法访问的代码
          conditionals: true,   // 优化 if 语句
          comparisons: true,    // 优化比较操作
          evaluate: true,       // 尝试评估常量表达式
          booleans: true,       // 优化布尔表达式
          loops: true,          // 优化循环
          unused: true,         // 删除未使用的变量和函数
          toplevel: true,       // 顶级作用域优化
          hoist_funs: true,     // 提升函数声明
          hoist_vars: false,    // 不提升变量声明（可能增加代码大小）
        },
        mangle: true,           // 缩短变量名
        output: {
          beautify: false,      // 不美化输出
          comments: false       // 删除注释
        }
      });
      
      if (result.code) {
        // 创建 .min.js 文件
        const minFilePath = filePath.replace('.js', '.min.js');
        fs.writeFileSync(minFilePath, result.code, 'utf8');
        console.log(`已创建优化文件: ${minFilePath}`);
      }
    } catch (error) {
      console.error(`处理文件 ${file} 时出错:`, error);
    }
  }
}

// 执行优化
optimizeJs().then(() => {
  console.log('JavaScript 优化完成');
}).catch(err => {
  console.error('优化过程中出错:', err);
});
