#!/usr/bin/env node

/**
 * DreamWise 数据库初始化脚本
 * 此脚本初始化数据库并创建测试用户
 */

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const mysql = require('mysql2/promise');
const { sequelize, syncDatabase } = require('../models');
const { User } = require('../models');
const bcrypt = require('bcryptjs');

// 打印环境变量，用于调试
console.log('数据库配置:');
console.log(`  DB_HOST: ${process.env.DB_HOST}`);
console.log(`  DB_PORT: ${process.env.DB_PORT}`);
console.log(`  DB_NAME: ${process.env.DB_NAME}`);
console.log(`  DB_USER: ${process.env.DB_USER}`);
console.log(`  DB_PASSWORD: ${process.env.DB_PASSWORD ? '已设置' : '未设置'}`);

// 测试用户信息
const testUser = {
  username: 'testuser',
  email: 'test@example.com',
  password: 'Password123', // 包含大写字母、小写字母和数字
  role: 'user',
  profile: {
    displayName: '测试用户',
    bio: '这是一个测试账号',
    spiritualBackground: '无',
    dreamingExperience: '初学者',
    interests: ['梦境解析', '冥想']
  }
};

async function initDatabase() {
  try {
    console.log('🔄 连接MySQL服务器...');
    
    // 创建数据库连接
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD
    });
    
    console.log('✅ 连接MySQL服务器成功');
    
    // 检查数据库是否存在
    console.log(`🔍 检查数据库 ${process.env.DB_NAME} 是否存在...`);
    const [rows] = await connection.execute(
      `SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = ?`,
      [process.env.DB_NAME]
    );
    
    if (rows.length === 0) {
      console.log(`⚠️ 数据库 ${process.env.DB_NAME} 不存在，正在创建...`);
      await connection.execute(`CREATE DATABASE ${process.env.DB_NAME}`);
      console.log(`✅ 数据库 ${process.env.DB_NAME} 创建成功`);
    } else {
      console.log(`✅ 数据库 ${process.env.DB_NAME} 已存在`);
    }
    
    // 关闭初始连接
    await connection.end();
    
    // 连接到Sequelize
    console.log('🔄 连接到Sequelize...');
    await sequelize.authenticate();
    console.log('✅ Sequelize连接成功');
    
    // 同步数据库模型（创建表）
    console.log('🔄 同步数据库模型...');
    await syncDatabase(true); // 强制重建表
    console.log('✅ 数据库模型同步成功');
    
    // 创建测试用户
    console.log('🔄 创建测试用户...');
    const user = await User.create(testUser);
    console.log('✅ 测试用户创建成功!');
    console.log('📝 测试账号信息:');
    console.log(`   ID: ${user.id}`);
    console.log(`   用户名: ${user.username}`);
    console.log(`   邮箱: ${user.email}`);
    console.log(`   密码: ${testUser.password}`);
    
    // 验证密码
    const isValid = await user.comparePassword(testUser.password);
    console.log(`   密码验证: ${isValid ? '成功 ✅' : '失败 ❌'}`);
    
    console.log('\n🎉 数据库初始化完成!');
    
  } catch (error) {
    console.error('❌ 数据库初始化失败:', error);
  } finally {
    // 关闭数据库连接
    await sequelize.close();
    process.exit(0);
  }
}

// 执行初始化
initDatabase();