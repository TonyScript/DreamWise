const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const DreamEntry = sequelize.define('DreamEntry', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
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
  dreamDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  // 梦境情绪
  mood: {
    type: DataTypes.JSON,
    defaultValue: {
      before: '',
      after: '',
      overall: 'neutral'
    }
  },
  // 梦境分类
  categories: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  // 精神视角
  spiritualPerspective: {
    type: DataTypes.STRING(50),
    defaultValue: ''
  },
  // 隐私设置
  privacy: {
    type: DataTypes.ENUM('private', 'friends', 'public'),
    defaultValue: 'private'
  },
  // 标签
  tags: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  // 清醒度级别 (0-10)
  lucidityLevel: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0,
      max: 10
    }
  },
  // 生动度 (0-10)
  vividness: {
    type: DataTypes.INTEGER,
    defaultValue: 5,
    validate: {
      min: 0,
      max: 10
    }
  },
  // 睡眠质量 (0-10)
  sleepQuality: {
    type: DataTypes.INTEGER,
    defaultValue: 5,
    validate: {
      min: 0,
      max: 10
    }
  },
  // AI分析结果
  analysis: {
    type: DataTypes.JSON,
    defaultValue: null
  }
}, {
  timestamps: true,
  indexes: [
    { fields: ['userId'] },
    { fields: ['dreamDate'] },
    { fields: ['privacy'] }
  ]
});

module.exports = DreamEntry;