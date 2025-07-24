#!/usr/bin/env node

/**
 * DreamWise 数据库表检查脚本
 * 此脚本用于检查数据库中的表结构
 */

require('dotenv').config();
const { sequelize } = require('./models');

async function checkTables() {
  try {
    console.log('🔄 连接数据库...');
    await sequelize.authenticate();
    console.log('✅ 数据库连接成功');

    // 获取所有表
    console.log('📋 数据库中的表:');
    const [tables] = await sequelize.query(`
      SELECT name FROM sqlite_master 
      WHERE type='table' 
      ORDER BY name;
    `);
    
    tables.forEach((table, index) => {
      console.log(`${index + 1}. ${table.name}`);
    });

    // 检查Users表结构
    console.log('\n📊 Users表结构:');
    const [columns] = await sequelize.query(`PRAGMA table_info(Users);`);
    
    columns.forEach(column => {
      console.log(`- ${column.name} (${column.type})`);
    });

    // 检查Users表中的数据
    console.log('\n👤 Users表中的数据:');
    const [users] = await sequelize.query(`SELECT * FROM Users;`);
    
    if (users.length === 0) {
      console.log('表中没有数据');
    } else {
      users.forEach((user, index) => {
        console.log(`\n用户 ${index + 1}:`);
        Object.keys(user).forEach(key => {
          if (key === 'password') {
            console.log(`- ${key}: ${user[key].substring(0, 20)}...`);
          } else if (key === 'profile' || key === 'preferences' || key === 'stats') {
            try {
              const parsed = JSON.parse(user[key]);
              console.log(`- ${key}: ${JSON.stringify(parsed).substring(0, 30)}...`);
            } catch (e) {
              console.log(`- ${key}: ${user[key]}`);
            }
          } else {
            console.log(`- ${key}: ${user[key]}`);
          }
        });
      });
    }

  } catch (error) {
    console.error('❌ 检查过程中出错:', error);
  } finally {
    // 关闭数据库连接
    await sequelize.close();
    process.exit(0);
  }
}

// 执行检查
checkTables();