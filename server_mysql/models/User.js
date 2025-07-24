const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const { sequelize } = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: DataTypes.STRING(30),
    allowNull: false,
    unique: true,
    validate: {
      len: [3, 30],
      is: /^[a-zA-Z0-9_]+$/
    }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [6, 255]
    }
  },
  // 个人资料信息
  profile: {
    type: DataTypes.JSON,
    defaultValue: {
      displayName: '',
      bio: '',
      avatar: null,
      spiritualBackground: '',
      dreamingExperience: '',
      interests: []
    }
  },
  // 用户偏好设置
  preferences: {
    type: DataTypes.JSON,
    defaultValue: {
      emailNotifications: true,
      communityUpdates: true,
      dreamReminders: false,
      privacy: {
        profileVisibility: 'public',
        journalVisibility: 'private'
      }
    }
  },
  // 用户统计数据
  stats: {
    type: DataTypes.JSON,
    defaultValue: {
      totalDreams: 0,
      totalPosts: 0,
      totalComments: 0,
      joinedDate: new Date(),
      lastActive: new Date()
    }
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  role: {
    type: DataTypes.ENUM('user', 'moderator', 'admin'),
    defaultValue: 'user'
  }
}, {
  timestamps: true,
  indexes: [
    { fields: ['email'] },
    { fields: ['username'] },
    { fields: ['isActive'] }
  ]
});

// 保存前加密密码
User.beforeSave(async (user) => {
  if (user.changed('password')) {
    const salt = await bcrypt.genSalt(12);
    user.password = await bcrypt.hash(user.password, salt);
  }
});

// 实例方法
User.prototype.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

User.prototype.updateLastActive = async function() {
  const stats = this.stats || {};
  stats.lastActive = new Date();
  this.stats = stats;
  return await this.save();
};

User.prototype.getPublicProfile = function() {
  const user = this.toJSON();
  delete user.password;
  delete user.email;
  delete user.preferences;
  return user;
};

User.prototype.getSafeProfile = function() {
  const user = this.toJSON();
  delete user.password;
  return user;
};

module.exports = User;