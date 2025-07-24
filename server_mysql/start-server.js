#!/usr/bin/env node

/**
 * DreamWise 服务器启动脚本
 * 此脚本帮助设置和启动 DreamWise 后端服务器
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🌙 DreamWise 服务器设置');
console.log('========================\n');

// 检查 .env 文件是否存在
const envPath = path.join(__dirname, '.env');
if (!fs.existsSync(envPath)) {
    console.log('⚠️  未找到 .env 文件。从 .env.example 创建...');
    
    const exampleEnvPath = path.join(__dirname, '.env.example');
    if (fs.existsSync(exampleEnvPath)) {
        fs.copyFileSync(exampleEnvPath, envPath);
        console.log('✅ 从 .env.example 创建了 .env 文件');
        console.log('📝 请在启动服务器之前编辑 .env 文件，配置您的数据库连接信息\n');
    } else {
        console.log('❌ .env.example 文件未找到');
        process.exit(1);
    }
}

// 检查 node_modules 是否存在
const nodeModulesPath = path.join(__dirname, 'node_modules');
if (!fs.existsSync(nodeModulesPath)) {
    console.log('📦 安装依赖...');
    try {
        execSync('npm install', { stdio: 'inherit', cwd: __dirname });
        console.log('✅ 依赖安装成功\n');
    } catch (error) {
        console.log('❌ 安装依赖失败');
        console.log('请在服务器目录中手动运行 "npm install"');
        process.exit(1);
    }
}

// 检查 MySQL 连接
console.log('🔍 检查系统要求...');

try {
    // 加载环境变量
    require('dotenv').config();
    
    // 检查 MySQL 连接信息
    const { DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD } = process.env;
    
    if (!DB_HOST || !DB_NAME || !DB_USER) {
        console.log('⚠️ MySQL 连接信息不完整。请检查 .env 文件中的以下变量:');
        console.log('  - DB_HOST (当前值: ' + (DB_HOST || '未设置') + ')');
        console.log('  - DB_PORT (当前值: ' + (DB_PORT || '3306 [默认]') + ')');
        console.log('  - DB_NAME (当前值: ' + (DB_NAME || '未设置') + ')');
        console.log('  - DB_USER (当前值: ' + (DB_USER || '未设置') + ')');
        console.log('  - DB_PASSWORD (当前值: ' + (DB_PASSWORD ? '已设置' : '未设置') + ')');
        
        console.log('\n请确保您已经:');
        console.log('1. 安装了 MySQL 服务器');
        console.log('2. 创建了数据库: ' + (DB_NAME || 'dreamwise'));
        console.log('3. 创建了具有适当权限的用户');
        
        const readline = require('readline').createInterface({
            input: process.stdin,
            output: process.stdout
        });
        
        readline.question('\n是否仍要尝试启动服务器? (y/n): ', (answer) => {
            readline.close();
            if (answer.toLowerCase() !== 'y') {
                console.log('服务器启动已取消');
                process.exit(0);
            } else {
                startServer();
            }
        });
    } else {
        console.log('✅ MySQL 连接信息已配置');
        startServer();
    }
} catch (error) {
    console.log('⚠️ 无法验证 MySQL 连接:', error.message);
    startServer();
}

function startServer() {
    console.log('\n🚀 启动 DreamWise 服务器...');
    console.log('按 Ctrl+C 停止服务器\n');

    // 启动服务器
    try {
        require('./server.js');
    } catch (error) {
        console.error('❌ 启动服务器失败:', error.message);
        process.exit(1);
    }
}