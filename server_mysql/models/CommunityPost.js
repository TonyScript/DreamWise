const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const CommunityPost = sequelize.define('CommunityPost', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  authorId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  title: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  // 帖子类型
  type: {
    type: DataTypes.ENUM('discussion', 'question', 'interpretation', 'experience', 'insight', 'resource'),
    defaultValue: 'discussion'
  },
  // 帖子分类
  category: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  // 标签
  tags: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  // 精神视角
  spiritualPerspective: {
    type: DataTypes.STRING(50),
    defaultValue: ''
  },
  // 相关梦境ID
  relatedDreamId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'DreamEntries',
      key: 'id'
    }
  },
  // 统计数据
  stats: {
    type: DataTypes.JSON,
    defaultValue: {
      views: 0,
      likes: 0,
      comments: 0
    }
  },
  // 是否置顶
  isPinned: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  // 是否精华
  isFeatured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  // 状态
  status: {
    type: DataTypes.ENUM('active', 'locked', 'hidden', 'deleted'),
    defaultValue: 'active'
  }
}, {
  timestamps: true,
  indexes: [
    { fields: ['authorId'] },
    { fields: ['category'] },
    { fields: ['type'] },
    { fields: ['status'] },
    { fields: ['relatedDreamId'] }
  ]
});

module.exports = CommunityPost;