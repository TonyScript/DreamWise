#!/usr/bin/env node

/**
 * DreamWise 数据库调试脚本
 * 此脚本用于检查数据库中的用户信息
 */

require('dotenv').config();
const { User, sequelize } = require('./models');
const bcrypt = require('bcryptjs');

async function debugDatabase() {
  try {
    console.log('🔄 连接数据库...');
    await sequelize.authenticate();
    console.log('✅ 数据库连接成功');

    // 查找测试用户
    const email = 'test@example.com';
    console.log(`🔍 查找用户: ${email}`);
    
    const user = await User.findOne({ 
      where: { email }
    });

    if (!user) {
      console.log('❌ 用户不存在!');
      process.exit(1);
    }

    console.log('✅ 找到用户:');
    console.log('------------------------');
    console.log(`ID: ${user.id}`);
    console.log(`用户名: ${user.username}`);
    console.log(`邮箱: ${user.email}`);
    console.log(`密码哈希: ${user.password.substring(0, 20)}...`);
    console.log(`激活状态: ${user.isActive ? '激活' : '未激活'}`);
    console.log(`角色: ${user.role}`);
    console.log(`创建时间: ${user.createdAt}`);
    console.log(`更新时间: ${user.updatedAt}`);
    console.log('------------------------');

    // 测试密码
    const testPassword = 'Password123';
    console.log(`🔑 测试密码: ${testPassword}`);
    
    const isPasswordValid = await bcrypt.compare(testPassword, user.password);
    console.log(`🔐 密码验证: ${isPasswordValid ? '成功 ✅' : '失败 ❌'}`);

    if (!isPasswordValid) {
      console.log('⚠️ 密码不匹配，创建新的测试用户...');
      
      // 创建新的测试用户
      const salt = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash(testPassword, salt);
      
      // 更新用户密码
      user.password = hashedPassword;
      await user.save();
      
      console.log('✅ 用户密码已更新');
      
      // 再次验证密码
      const verifyAgain = await bcrypt.compare(testPassword, user.password);
      console.log(`🔐 密码再次验证: ${verifyAgain ? '成功 ✅' : '失败 ❌'}`);
    }

    // 检查数据库中的所有用户
    console.log('\n📊 数据库中的所有用户:');
    const allUsers = await User.findAll();
    allUsers.forEach((u, index) => {
      console.log(`${index + 1}. ${u.username} (${u.email}) - 创建于 ${u.createdAt}`);
    });

  } catch (error) {
    console.error('❌ 调试过程中出错:', error);
  } finally {
    // 关闭数据库连接
    await sequelize.close();
    process.exit(0);
  }
}

// 执行调试
debugDatabase();