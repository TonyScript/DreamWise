const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const User = require('../models/User');
const { authenticateToken, requireOwnershipOrModerator } = require('../middleware/auth');
const { validateProfileUpdate, validateObjectId } = require('../middleware/validation');

const router = express.Router();

// 确保uploads目录存在
const uploadsDir = path.join(__dirname, '../uploads');
const avatarsDir = path.join(uploadsDir, 'avatars');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
if (!fs.existsSync(avatarsDir)) {
  fs.mkdirSync(avatarsDir, { recursive: true });
}

// 配置multer用于头像上传
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, avatarsDir);
  },
  filename: function (req, file, cb) {
    // 生成唯一文件名
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'avatar-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB限制
  },
  fileFilter: function (req, file, cb) {
    // 只允许图片文件
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('只允许上传图片文件'));
    }
  }
});

// 上传头像
router.post('/avatar', authenticateToken, upload.single('avatar'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: '请选择要上传的图片文件'
      });
    }

    // 删除旧头像文件（如果存在）
    if (req.user.profile.avatar) {
      const oldAvatarPath = path.join(avatarsDir, path.basename(req.user.profile.avatar));
      if (fs.existsSync(oldAvatarPath)) {
        fs.unlinkSync(oldAvatarPath);
      }
    }

    // 更新用户头像路径
    const avatarUrl = `/uploads/avatars/${req.file.filename}`;
    req.user.profile.avatar = avatarUrl;
    await req.user.save();

    res.json({
      message: '头像上传成功',
      avatar: avatarUrl
    });

  } catch (error) {
    console.error('Upload avatar error:', error);
    
    // 如果出错，删除已上传的文件
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    res.status(500).json({
      error: '头像上传失败'
    });
  }
});

// Get user profile by ID
router.get('/:userId', validateObjectId('userId'), async (req, res) => {
  try {
    const user = await User.findByPk(req.params.userId);

    if (!user || !user.isActive) {
      return res.status(404).json({
        error: 'User not found'
      });
    }

    // Return public profile
    const publicProfile = user.getPublicProfile();
    
    res.json({
      user: publicProfile
    });

  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({
      error: 'Failed to get user profile'
    });
  }
});

// Update user profile
router.put('/profile', authenticateToken, validateProfileUpdate, async (req, res) => {
  try {
    const {
      displayName,
      bio,
      spiritualBackground,
      dreamingExperience,
      interests
    } = req.body;

    // Update profile fields
    if (displayName !== undefined) req.user.profile.displayName = displayName;
    if (bio !== undefined) req.user.profile.bio = bio;
    if (spiritualBackground !== undefined) req.user.profile.spiritualBackground = spiritualBackground;
    if (dreamingExperience !== undefined) req.user.profile.dreamingExperience = dreamingExperience;
    if (interests !== undefined) req.user.profile.interests = interests;

    await req.user.save();

    res.json({
      message: 'Profile updated successfully',
      user: req.user.getSafeProfile()
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      error: 'Failed to update profile'
    });
  }
});

// Update user preferences
router.put('/preferences', authenticateToken, async (req, res) => {
  try {
    const {
      emailNotifications,
      communityUpdates,
      dreamReminders,
      privacy
    } = req.body;

    // Update preferences
    if (emailNotifications !== undefined) {
      req.user.preferences.emailNotifications = emailNotifications;
    }
    if (communityUpdates !== undefined) {
      req.user.preferences.communityUpdates = communityUpdates;
    }
    if (dreamReminders !== undefined) {
      req.user.preferences.dreamReminders = dreamReminders;
    }
    if (privacy !== undefined) {
      if (privacy.profileVisibility !== undefined) {
        req.user.preferences.privacy.profileVisibility = privacy.profileVisibility;
      }
      if (privacy.journalVisibility !== undefined) {
        req.user.preferences.privacy.journalVisibility = privacy.journalVisibility;
      }
    }

    await req.user.save();

    res.json({
      message: 'Preferences updated successfully',
      preferences: req.user.preferences
    });

  } catch (error) {
    console.error('Update preferences error:', error);
    res.status(500).json({
      error: 'Failed to update preferences'
    });
  }
});

// Get user statistics
router.get('/:userId/stats', validateObjectId('userId'), async (req, res) => {
  try {
    const user = await User.findByPk(req.params.userId);

    if (!user || !user.isActive) {
      return res.status(404).json({
        error: 'User not found'
      });
    }

    // Return public stats
    res.json({
      stats: {
        totalDreams: user.stats.totalDreams,
        totalPosts: user.stats.totalPosts,
        totalComments: user.stats.totalComments,
        joinedDate: user.stats.joinedDate,
        // Don't expose lastActive for privacy
      }
    });

  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({
      error: 'Failed to get user statistics'
    });
  }
});

// Search users
router.get('/', async (req, res) => {
  try {
    const { q, page = 1, limit = 20 } = req.query;

    const query = {
      isActive: true
    };

    if (q) {
      query.$or = [
        { username: { $regex: q, $options: 'i' } },
        { 'profile.displayName': { $regex: q, $options: 'i' } }
      ];
    }

    const users = await User.find(query)
      .select('username profile stats.joinedDate stats.totalDreams stats.totalPosts')
      .sort({ 'stats.lastActive': -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments(query);

    res.json({
      users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Search users error:', error);
    res.status(500).json({
      error: 'Failed to search users'
    });
  }
});

// Get user's recent activity (dreams and posts)
router.get('/:userId/activity', validateObjectId('userId'), async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const user = await User.findByPk(req.params.userId);

    if (!user || !user.isActive) {
      return res.status(404).json({
        error: 'User not found'
      });
    }

    // Check privacy settings
    const isOwner = req.user && req.user.id.toString() === req.params.userId;
    const canViewActivity = user.preferences.privacy.profileVisibility === 'public' || isOwner;

    if (!canViewActivity) {
      return res.status(403).json({
        error: 'Access denied'
      });
    }

    // Get recent dreams and posts
    const DreamEntry = require('../models/DreamEntry');
    const CommunityPost = require('../models/CommunityPost');

    const [dreams, posts] = await Promise.all([
      DreamEntry.find({
        user: req.params.userId,
        isActive: true,
        privacy: { $in: isOwner ? ['private', 'friends', 'public'] : ['public'] }
      })
        .select('title dreamDate mood.overall categories createdAt')
        .sort({ createdAt: -1 })
        .limit(5),

      CommunityPost.find({
        author: req.params.userId,
        isActive: true,
        moderationStatus: 'approved'
      })
        .select('title type category createdAt views')
        .sort({ createdAt: -1 })
        .limit(5)
    ]);

    res.json({
      activity: {
        dreams,
        posts
      }
    });

  } catch (error) {
    console.error('Get user activity error:', error);
    res.status(500).json({
      error: 'Failed to get user activity'
    });
  }
});

// Deactivate account
router.delete('/account', authenticateToken, async (req, res) => {
  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({
        error: 'Password confirmation required'
      });
    }

    // Verify password
    const isPasswordValid = await req.user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({
        error: 'Invalid password'
      });
    }

    // Deactivate account (soft delete)
    req.user.isActive = false;
    await req.user.save();

    res.json({
      message: 'Account deactivated successfully'
    });

  } catch (error) {
    console.error('Deactivate account error:', error);
    res.status(500).json({
      error: 'Failed to deactivate account'
    });
  }
});

module.exports = router;