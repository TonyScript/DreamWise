const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

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
  type: {
    type: DataTypes.ENUM('discussion', 'question', 'interpretation', 'experience', 'insight', 'resource'),
    allowNull: false
  },
  category: {
    type: DataTypes.ENUM(
      'General Discussion',
      'Dream Interpretation',
      'Spiritual Perspectives',
      'Lucid Dreaming',
      'Nightmares',
      'Recurring Dreams',
      'Prophetic Dreams',
      'Dream Symbols',
      'Sleep & Dreams',
      'Community Support',
      'Resources & Tools',
      'Success Stories'
    ),
    allowNull: false
  },
  tags: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  spiritualPerspective: {
    type: DataTypes.ENUM('', 'Christian', 'Islamic', 'Buddhist', 'Hindu', 'Jewish', 'Universal', 'Multi-Faith'),
    defaultValue: ''
  },
  relatedDreamId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'DreamEntries',
      key: 'id'
    }
  },
  images: {
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
  views: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  isPinned: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  isFeatured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  isLocked: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  moderationStatus: {
    type: DataTypes.ENUM('pending', 'approved', 'rejected', 'flagged'),
    defaultValue: 'approved'
  },
  moderationNotes: {
    type: DataTypes.STRING(500),
    defaultValue: ''
  },
  reports: {
    type: DataTypes.JSON,
    defaultValue: []
  }
}, {
  timestamps: true,
  indexes: [
    { fields: ['authorId'] },
    { fields: ['category'] },
    { fields: ['type'] },
    { fields: ['spiritualPerspective'] },
    { fields: ['isPinned', 'isFeatured'] },
    { fields: ['moderationStatus'] },
    { fields: ['views'] },
    { fields: ['isActive'] }
  ]
});

// Virtual getters
CommunityPost.prototype.getLikeCount = function() {
  return this.likes ? this.likes.length : 0;
};

CommunityPost.prototype.getCommentCount = function() {
  return this.comments ? this.comments.length : 0;
};

CommunityPost.prototype.getEngagementScore = function() {
  const likeCount = this.likes ? this.likes.length : 0;
  const commentCount = this.comments ? this.comments.length : 0;
  return likeCount + commentCount + (this.views * 0.1);
};

// Instance methods
CommunityPost.prototype.isLikedBy = function(userId) {
  if (!this.likes) return false;
  return this.likes.some(like => like.user === userId);
};

CommunityPost.prototype.addLike = async function(userId) {
  if (!this.isLikedBy(userId)) {
    const likes = this.likes || [];
    likes.push({ user: userId, createdAt: new Date() });
    this.likes = likes;
    return await this.save();
  }
  return this;
};

CommunityPost.prototype.removeLike = async function(userId) {
  if (this.likes) {
    this.likes = this.likes.filter(like => like.user !== userId);
    return await this.save();
  }
  return this;
};

CommunityPost.prototype.addComment = async function(userId, content) {
  const comments = this.comments || [];
  comments.push({
    author: userId,
    content: content,
    likes: [],
    replies: [],
    createdAt: new Date()
  });
  this.comments = comments;
  return await this.save();
};

CommunityPost.prototype.incrementViews = async function() {
  this.views += 1;
  return await this.save();
};

CommunityPost.prototype.addReport = async function(reporterId, reason, description) {
  const reports = this.reports || [];
  reports.push({
    reporter: reporterId,
    reason: reason,
    description: description,
    status: 'pending',
    createdAt: new Date()
  });
  this.reports = reports;
  return await this.save();
};

// Hook to update user stats
CommunityPost.afterCreate(async (post) => {
  try {
    const User = require('./User');
    const user = await User.findByPk(post.authorId);
    if (user) {
      const stats = user.stats || {};
      stats.totalPosts = (stats.totalPosts || 0) + 1;
      user.stats = stats;
      await user.save();
    }
  } catch (error) {
    console.error('Error updating user stats:', error);
  }
});

module.exports = CommunityPost;