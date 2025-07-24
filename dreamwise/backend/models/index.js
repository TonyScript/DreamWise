const User = require('./User');
const DreamEntry = require('./DreamEntry');
const CommunityPost = require('./CommunityPost');
const { sequelize } = require('../config/database');

// 定义模型关联
User.hasMany(DreamEntry, { foreignKey: 'userId', as: 'dreams' });
DreamEntry.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasMany(CommunityPost, { foreignKey: 'authorId', as: 'posts' });
CommunityPost.belongsTo(User, { foreignKey: 'authorId', as: 'author' });

DreamEntry.hasMany(CommunityPost, { foreignKey: 'relatedDreamId', as: 'relatedPosts' });
CommunityPost.belongsTo(DreamEntry, { foreignKey: 'relatedDreamId', as: 'relatedDream' });

// 数据库同步函数
const syncDatabase = async (force = false) => {
  try {
    await sequelize.sync({ force });
    console.log('✅ 数据库同步成功');
    
    // 如果是强制同步（重建表），可以在这里添加初始数据
    if (force) {
      console.log('🌱 添加初始数据...');
      // 添加初始数据的代码
    }
  } catch (error) {
    console.error('❌ 数据库同步错误:', error);
    throw error;
  }
};

module.exports = {
  User,
  DreamEntry,
  CommunityPost,
  sequelize,
  syncDatabase
};