#!/usr/bin/env node

/**
 * DreamWise GitHub仓库清理脚本
 * 此脚本将从Git仓库中移除不必要的文件，但保留在本地
 */

const { execSync } = require('child_process');
const fs = require('fs');

console.log('🚀 开始清理GitHub仓库...');

// 要从Git仓库中移除但保留在本地的文件
const filesToRemove = [
    // 规划和文档文件
    '*.md',
    '!README.md',

    // 临时文件
    '*-new.html',
    '*-fixed.html',
    'new-*.html',
    'test-*.html',

    // 开发工具和脚本
    'test-*.js',
    'final-site-test.js',
    'fix-*.js',
    'update-*.js',
    'create-*.js',
    'verify-*.js',
    'check-*.js',
    'add-*.js',
    '*-optimization.js',
    'optimize-*.js',
    'batch-*.sh',
    'optimize-*.sh',

    // 部署相关
    'DEPLOYMENT_GUIDE.txt',
    'server-config-examples.txt',
    'deploy-*.sh',
    'deploy-*.js',
    '*.zip',

    // Docker相关
    '.dockerignore',
    'Dockerfile',
    'docker-compose.yml',
    'nginx.conf',

    // 其他辅助文件
    '*.log',
    '.DS_Store',
    'Thumbs.db',
    '*_REPORT.md',
    '*_FIXED.md',
    '*_COMPLETE.md',
    '*_READY.md',
    '*_SUMMARY.md',
    '*_PLAN.md',
    '*_REDESIGNED.md',
    'test-report.json'
];

// 执行Git命令移除文件
function removeFilesFromGit() {
    try {
        // 确保我们在Git仓库中
        execSync('git rev-parse --is-inside-work-tree', { stdio: 'ignore' });

        console.log('✅ 确认在Git仓库中');

        // 对每个模式执行git rm --cached
        filesToRemove.forEach(pattern => {
            try {
                // 使用git ls-files查找匹配的文件
                const files = execSync(`git ls-files ${pattern}`, { encoding: 'utf8' }).trim().split('\\n');

                if (files.length > 0 && files[0] !== '') {
                    console.log(`🔍 找到匹配 ${pattern} 的文件:`, files);

                    // 对每个文件执行git rm --cached
                    files.forEach(file => {
                        try {
                            execSync(`git rm --cached "${file}"`, { stdio: 'pipe' });
                            console.log(`✅ 从Git仓库中移除: ${file}`);
                        } catch (error) {
                            console.error(`❌ 无法从Git仓库中移除: ${file}`, error.message);
                        }
                    });
                } else {
                    console.log(`ℹ️ 没有找到匹配 ${pattern} 的文件`);
                }
            } catch (error) {
                console.error(`❌ 处理模式 ${pattern} 时出错:`, error.message);
            }
        });

        console.log('\n🎉 Git仓库清理完成！');
        console.log('\n💡 提示: 现在您可以提交更改，这些文件将不再被跟踪。');
        console.log('      使用命令: git commit -m "Remove unnecessary files from Git tracking"');
    } catch (error) {
        console.error('❌ 这不是一个Git仓库，或者Git命令执行失败。', error.message);
    }
}

// 执行清理
removeFilesFromGit();