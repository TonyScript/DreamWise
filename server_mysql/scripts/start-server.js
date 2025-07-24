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
const envPath = path.join(__dirname, '../.env');
if (!fs.existsSync(envPath)) {
    console.log('⚠️  未找到 .env 文件。从 .env.example 创建...');
    
    const exampleEnvPath = path.join(__dirname, '../.env.example');
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
const nodeModulesPath = path.join(__dirname, '../node_modules');
if (!fs.existsSync(nodeModulesPath)) {
    console.log('📦 安装依赖...');
    try {
        execSync('npm install', { stdio: 'inherit', cwd: path.join(__dirname, '..') });
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
    require('dotenv').config({ path: envPath });
    
    // 检查 MySQL 连接信息
    const { DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD } = process.env;
    
    console.log('✅ MySQL 连接信息已配置:');
    console.log(`  - 主机: ${DB_HOST}`);
    console.log(`  - 端口: ${DB_PORT || '3306 [默认]'}`);
    console.log(`  - 数据库: ${DB_NAME}`);
    console.log(`  - 用户: ${DB_USER}`);
    console.log(`  - 密码: ${DB_PASSWORD ? '已设置' : '未设置'}`);
    
    console.log('\n🚀 启动 DreamWise 服务器...');
    console.log('按 Ctrl+C 停止服务器\n');

    // 启动服务器
    require('../server.js');
} catch (error) {
    console.error('❌ 启动服务器失败:', error.message);
    process.exit(1);
}