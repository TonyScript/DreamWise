/**
 * 恢复原始文件
 * 
 * 此脚本用于在需要时恢复原始文件，撤销自动化脚本所做的更改
 * 它会从备份目录中恢复文件，或者从Git历史中恢复
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const chalk = require('chalk');

// 配置
const config = {
  backupDir: './.backups', // 备份目录
  useGit: true, // 是否使用Git恢复
  filesToRestore: [
    'index.html',
    'index-new.html'
  ],
  gitCommitHash: '8f7cfab' // 最新提交的哈希值，用于恢复
};

// 结果统计
const stats = {
  filesRestored: 0,
  restoreFailed: 0
};

/**
 * 从备份目录恢复文件
 */
function restoreFromBackup(filePath) {
  const backupPath = path.join(config.backupDir, filePath);
  
  if (fs.existsSync(backupPath)) {
    try {
      fs.copyFileSync(backupPath, filePath);
      console.log(chalk.green(`✓ 从备份恢复文件: ${filePath}`));
      stats.filesRestored++;
      return true;
    } catch (error) {
      console.error(chalk.red(`从备份恢复文件 ${filePath} 失败: ${error.message}`));
      stats.restoreFailed++;
      return false;
    }
  } else {
    console.log(chalk.yellow(`⚠️ 备份文件不存在: ${backupPath}`));
    return false;
  }
}

/**
 * 从Git恢复文件
 */
function restoreFromGit(filePath) {
  try {
    execSync(`git checkout ${config.gitCommitHash} -- ${filePath}`, { stdio: 'inherit' });
    console.log(chalk.green(`✓ 从Git恢复文件: ${filePath}`));
    stats.filesRestored++;
    return true;
  } catch (error) {
    console.error(chalk.red(`从Git恢复文件 ${filePath} 失败: ${error.message}`));
    stats.restoreFailed++;
    return false;
  }
}

/**
 * 恢复文件
 */
function restoreFile(filePath) {
  console.log(chalk.blue(`尝试恢复文件: ${filePath}`));
  
  // 检查文件是否存在
  if (!fs.existsSync(filePath)) {
    console.log(chalk.yellow(`⚠️ 文件不存在，无需恢复: ${filePath}`));
    return;
  }
  
  // 首先尝试从备份恢复
  let restored = false;
  
  if (fs.existsSync(config.backupDir)) {
    restored = restoreFromBackup(filePath);
  }
  
  // 如果从备份恢复失败且配置了使用Git，则尝试从Git恢复
  if (!restored && config.useGit) {
    restored = restoreFromGit(filePath);
  }
  
  // 如果所有恢复方法都失败
  if (!restored) {
    console.log(chalk.red(`✗ 无法恢复文件: ${filePath}`));
    stats.restoreFailed++;
  }
}

/**
 * 创建备份
 */
function createBackup(filePath) {
  // 确保备份目录存在
  if (!fs.existsSync(config.backupDir)) {
    fs.mkdirSync(config.backupDir, { recursive: true });
  }
  
  const backupPath = path.join(config.backupDir, filePath);
  
  // 确保备份文件的目录存在
  const backupDir = path.dirname(backupPath);
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }
  
  try {
    fs.copyFileSync(filePath, backupPath);
    console.log(chalk.green(`✓ 已创建备份: ${backupPath}`));
    return true;
  } catch (error) {
    console.error(chalk.red(`创建备份失败 ${filePath}: ${error.message}`));
    return false;
  }
}

/**
 * 主函数
 */
function main() {
  console.log(chalk.green('开始恢复原始文件...'));
  
  // 检查是否有备份目录
  if (!fs.existsSync(config.backupDir) && !config.useGit) {
    console.log(chalk.yellow('⚠️ 备份目录不存在，且未配置使用Git恢复'));
    
    // 询问是否创建备份
    console.log(chalk.blue('是否要为当前文件创建备份？(y/n)'));
    const createBackups = true; // 在实际实现中，这里应该是用户输入
    
    if (createBackups) {
      console.log(chalk.green('创建当前文件的备份...'));
      
      for (const filePath of config.filesToRestore) {
        if (fs.existsSync(filePath)) {
          createBackup(filePath);
        }
      }
    }
  }
  
  // 恢复文件
  for (const filePath of config.filesToRestore) {
    restoreFile(filePath);
  }
  
  // 输出结果
  console.log('\n' + chalk.green('===== 文件恢复完成 ====='));
  console.log(chalk.blue(`成功恢复: ${stats.filesRestored} 个文件`));
  console.log(chalk.red(`恢复失败: ${stats.restoreFailed} 个文件`));
  
  // 输出总结
  if (stats.restoreFailed === 0) {
    console.log(chalk.green('✓ 所有文件恢复成功！'));
  } else {
    console.log(chalk.red(`✗ ${stats.restoreFailed} 个文件恢复失败，请手动检查。`));
  }
}

// 执行主函数
main();