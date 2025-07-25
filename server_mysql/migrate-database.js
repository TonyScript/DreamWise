#!/usr/bin/env node

/**
 * 数据库迁移脚本
 * 用于更新数据库结构以支持V1.3.0的新功能
 */

const { sequelize, syncDatabase } = require('./models');

async function migrateDatabase() {
  try {
    console.log('🔄 开始数据库迁移...');
    
    // 连接数据库
    await sequelize.authenticate();
    console.log('✅ 数据库连接成功');
    
    // 强制同步数据库结构（这会重建表）
    console.log('⚠️  警告：这将重建所有表，现有数据将丢失！');
    console.log('🔄 同步数据库结构...');
    
    await syncDatabase(true); // force: true 会删除并重建表
    
    console.log('✅ 数据库迁移完成！');
    console.log('📋 新增功能：');
    console.log('   - Users表添加了isEmailVerified字段');
    console.log('   - 新增verification_codes表');
    console.log('   - 所有索引已创建');
    
    process.exit(0);
    
  } catch (error) {
    console.error('❌ 数据库迁移失败:', error);
    process.exit(1);
  }
}

// 运行迁移
if (require.main === module) {
  console.log('🚀 DreamWise V1.3.0 数据库迁移工具');
  console.log('='.repeat(50));
  
  // 确认提示
  console.log('⚠️  注意：此操作将重建数据库表，所有现有数据将丢失！');
  console.log('如果您确定要继续，请在5秒内按Ctrl+C取消...');
  
  setTimeout(() => {
    migrateDatabase();
  }, 5000);
}

module.exports = migrateDatabase;