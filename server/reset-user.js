#!/usr/bin/env node

/**
 * DreamWise 用户重置脚本
 * 此脚本重置测试用户的密码
 */

require('dotenv').config();
const { User, sequelize } = require('./models');
const bcrypt = require('bcryptjs');

async function resetUser() {
  try {
    console.log('🔄 连接数据库...');
    await sequelize.authenticate();
    console.log('✅ 数据库连接成功');

    const email = 'test@example.com';
    const password = 'Password123';
    
    console.log(`🔍 查找用户: ${email}`);
    
    // 使用Sequelize模型查找用户
    const user = await User.findOne({ 
      where: { email }
    });

    if (!user) {
      console.log(`❌ 用户不存在，创建新用户...`);
      
      // 创建新用户
      const newUser = await User.create({
        username: 'testuser',
        email: email,
        password: password, // 模型钩子会自动加密
        role: 'user',
        isActive: true,
        profile: {
          displayName: '测试用户',
          bio: '这是一个测试账号',
          spiritualBackground: '无',
          dreamingExperience: '初学者',
          interests: ['梦境解析', '冥想']
        }
      });
      
      console.log(`✅ 新用户创建成功! ID: ${newUser.id}`);
    } else {
      console.log(`✅ 找到用户: ${user.username} (ID: ${user.id})`);
      
      // 直接设置密码并保存
      user.password = password; // 模型钩子会自动加密
      await user.save();
      
      console.log(`✅ 用户密码已重置`);
    }
    
    // 验证密码
    const updatedUser = await User.findOne({ where: { email } });
    const testResult = await bcrypt.compare(password, updatedUser.password);
    
    console.log(`\n📝 测试账号信息:`);
    console.log(`   用户名: ${updatedUser.username}`);
    console.log(`   邮箱: ${updatedUser.email}`);
    console.log(`   密码: ${password}`);
    console.log(`   密码验证: ${testResult ? '成功 ✅' : '失败 ❌'}`);

  } catch (error) {
    console.error('❌ 重置过程中出错:', error);
  } finally {
    // 关闭数据库连接
    await sequelize.close();
    process.exit(0);
  }
}

// 执行重置
resetUser();