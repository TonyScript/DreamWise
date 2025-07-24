const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

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
    allowNull: false,
    validate: {
      len: [1, 200]
    }
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      len: [1, 5000]
    }
  },
  dreamDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  mood: {
    type: DataTypes.JSON,
    defaultValue: {
      before: '',
      after: '',
      overall: ''
    }
  },
  symbols: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  categories: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  spiritualPerspective: {
    type: DataTypes.ENUM('', 'Christian', 'Islamic', 'Buddhist', 'Hindu', 'Jewish', 'Universal'),
    defaultValue: ''
  },
  interpretation: {
    type: DataTypes.JSON,
    defaultValue: {
      personal: '',
      aiGenerated: '',
      confidence: 0
    }
  },
  privacy: {
    type: DataTypes.ENUM('private', 'friends', 'public'),
    defaultValue: 'private'
  },
  tags: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  lucidityLevel: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0,
      max: 10
    }
  },
  vividness: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0,
      max: 10
    }
  },
  sleepQuality: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0,
      max: 10
    }
  },
  isRecurring: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  recurringPattern: {
    type: DataTypes.JSON,
    defaultValue: {
      frequency: '',
      variations: ''
    }
  },
  connections: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  likes: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  comments: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  timestamps: true,
  indexes: [
    { fields: ['userId', 'dreamDate'] },
    { fields: ['userId', 'privacy'] },
    { fields: ['privacy'] },
    { fields: ['spiritualPerspective'] },
    { fields: ['isActive'] }
  ]
});

// Instance methods
DreamEntry.prototype.getLikeCount = function() {
  return this.likes ? this.likes.length : 0;
};

DreamEntry.prototype.getCommentCount = function() {
  return this.comments ? this.comments.length : 0;
};

DreamEntry.prototype.isLikedBy = function(userId) {
  if (!this.likes) return false;
  return this.likes.some(like => like.user === userId);
};

DreamEntry.prototype.addLike = async function(userId) {
  if (!this.isLikedBy(userId)) {
    const likes = this.likes || [];
    likes.push({ user: userId, createdAt: new Date() });
    this.likes = likes;
    return await this.save();
  }
  return this;
};

DreamEntry.prototype.removeLike = async function(userId) {
  if (this.likes) {
    this.likes = this.likes.filter(like => like.user !== userId);
    return await this.save();
  }
  return this;
};

DreamEntry.prototype.addComment = async function(userId, content) {
  const comments = this.comments || [];
  comments.push({
    user: userId,
    content: content,
    createdAt: new Date()
  });
  this.comments = comments;
  return await this.save();
};

DreamEntry.prototype.getPublicVersion = function() {
  if (this.privacy === 'private') {
    return null;
  }
  return this.toJSON();
};

// Hook to update user stats
DreamEntry.afterCreate(async (dreamEntry) => {
  try {
    const User = require('./User');
    const user = await User.findByPk(dreamEntry.userId);
    if (user) {
      const stats = user.stats || {};
      stats.totalDreams = (stats.totalDreams || 0) + 1;
      user.stats = stats;
      await user.save();
    }
  } catch (error) {
    console.error('Error updating user stats:', error);
  }
});

module.exports = DreamEntry;