const express = require('express');
const { User, DreamEntry, CommunityPost } = require('../models');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const { validateProfileUpdate, validateId } = require('../middleware/validation');

const router = express.Router();

// 获取用户公开资料
router.get('/:id', async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    
    if (isNaN(userId)) {
      return res.status(400).json({
        error: '无效的用户ID'
      });
    }
    
    const user = await User.findOne({
      where: {
        id: userId,
        isActive: true
      }
    });
    
    if (!user) {
      return res.status(404).json({
        error: '用户未找到'
      });
    }
    
    // 获取用户的公开梦境数量
    const publicDreamsCount = await DreamEntry.count({
      where: {
        userId,
        privacy: 'public'
      }
    });
    
    // 获取用户的公开帖子数量
    const postsCount = await CommunityPost.count({
      where: {
        authorId: userId,
        status: 'active'
      }
    });
    
    // 返回公开资料
    const publicProfile = user.getPublicProfile();
    
    res.json({
      user: {
        ...publicProfile,
        publicDreamsCount,
        postsCount
      }
    });
  } catch (error) {
    console.error('获取用户资料错误:', error);
    res.status(500).json({
      error: '获取用户资料失败'
    });
  }
});

// 更新当前用户资料
router.put('/profile', authenticateToken, validateProfileUpdate, async (req, res) => {
  try {
    const user = req.user;
    const { displayName, bio, spiritualBackground, dreamingExperience, interests } = req.body;
    
    // 更新资料
    const profile = user.profile || {};
    
    if (displayName !== undefined) profile.displayName = displayName;
    if (bio !== undefined) profile.bio = bio;
    if (spiritualBackground !== undefined) profile.spiritualBackground = spiritualBackground;
    if (dreamingExperience !== undefined) profile.dreamingExperience = dreamingExperience;
    if (interests !== undefined) profile.interests = interests;
    
    user.profile = profile;
    await user.save();
    
    res.json({
      message: '资料更新成功',
      user: user.getSafeProfile()
    });
  } catch (error) {
    console.error('更新资料错误:', error);
    res.status(500).json({
      error: '更新资料失败'
    });
  }
});

// 更新用户偏好设置
router.put('/preferences', authenticateToken, async (req, res) => {
  try {
    const user = req.user;
    const { emailNotifications, communityUpdates, dreamReminders, privacy } = req.body;
    
    // 更新偏好设置
    const preferences = user.preferences || {};
    
    if (emailNotifications !== undefined) preferences.emailNotifications = !!emailNotifications;
    if (communityUpdates !== undefined) preferences.communityUpdates = !!communityUpdates;
    if (dreamReminders !== undefined) preferences.dreamReminders = !!dreamReminders;
    
    if (privacy) {
      preferences.privacy = preferences.privacy || {};
      
      if (privacy.profileVisibility !== undefined) {
        preferences.privacy.profileVisibility = ['public', 'private'].includes(privacy.profileVisibility)
          ? privacy.profileVisibility
          : 'public';
      }
      
      if (privacy.journalVisibility !== undefined) {
        preferences.privacy.journalVisibility = ['public', 'private'].includes(privacy.journalVisibility)
          ? privacy.journalVisibility
          : 'private';
      }
    }
    
    user.preferences = preferences;
    await user.save();
    
    res.json({
      message: '偏好设置更新成功',
      preferences: user.preferences
    });
  } catch (error) {
    console.error('更新偏好设置错误:', error);
    res.status(500).json({
      error: '更新偏好设置失败'
    });
  }
});

// 获取用户公开梦境
router.get('/:id/dreams', async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    
    if (isNaN(userId)) {
      return res.status(400).json({
        error: '无效的用户ID'
      });
    }
    
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    
    // 检查用户是否存在
    const user = await User.findOne({
      where: {
        id: userId,
        isActive: true
      }
    });
    
    if (!user) {
      return res.status(404).json({
        error: '用户未找到'
      });
    }
    
    // 获取用户的公开梦境
    const { count, rows: dreams } = await DreamEntry.findAndCountAll({
      where: {
        userId,
        privacy: 'public'
      },
      order: [['dreamDate', 'DESC']],
      limit,
      offset
    });
    
    res.json({
      dreams,
      pagination: {
        page,
        limit,
        total: count,
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('获取用户梦境错误:', error);
    res.status(500).json({
      error: '获取用户梦境失败'
    });
  }
});

// 获取用户公开帖子
router.get('/:id/posts', async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    
    if (isNaN(userId)) {
      return res.status(400).json({
        error: '无效的用户ID'
      });
    }
    
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    
    // 检查用户是否存在
    const user = await User.findOne({
      where: {
        id: userId,
        isActive: true
      }
    });
    
    if (!user) {
      return res.status(404).json({
        error: '用户未找到'
      });
    }
    
    // 获取用户的公开帖子
    const { count, rows: posts } = await CommunityPost.findAndCountAll({
      where: {
        authorId: userId,
        status: 'active'
      },
      order: [['createdAt', 'DESC']],
      limit,
      offset
    });
    
    res.json({
      posts,
      pagination: {
        page,
        limit,
        total: count,
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('获取用户帖子错误:', error);
    res.status(500).json({
      error: '获取用户帖子失败'
    });
  }
});

// 管理员：获取所有用户
router.get('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;
    
    const { count, rows: users } = await User.findAndCountAll({
      attributes: { exclude: ['password'] },
      order: [['createdAt', 'DESC']],
      limit,
      offset
    });
    
    res.json({
      users,
      pagination: {
        page,
        limit,
        total: count,
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('获取用户列表错误:', error);
    res.status(500).json({
      error: '获取用户列表失败'
    });
  }
});

// 管理员：更新用户状态
router.put('/:id/status', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const { isActive } = req.body;
    
    if (isNaN(userId)) {
      return res.status(400).json({
        error: '无效的用户ID'
      });
    }
    
    // 不允许停用自己
    if (userId === req.user.id) {
      return res.status(400).json({
        error: '不能更改自己的状态'
      });
    }
    
    const user = await User.findByPk(userId);
    
    if (!user) {
      return res.status(404).json({
        error: '用户未找到'
      });
    }
    
    await user.update({ isActive: !!isActive });
    
    res.json({
      message: isActive ? '用户已激活' : '用户已停用',
      user: {
        id: user.id,
        username: user.username,
        isActive: user.isActive
      }
    });
  } catch (error) {
    console.error('更新用户状态错误:', error);
    res.status(500).json({
      error: '更新用户状态失败'
    });
  }
});

// 管理员：更新用户角色
router.put('/:id/role', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const { role } = req.body;
    
    if (isNaN(userId)) {
      return res.status(400).json({
        error: '无效的用户ID'
      });
    }
    
    // 不允许更改自己的角色
    if (userId === req.user.id) {
      return res.status(400).json({
        error: '不能更改自己的角色'
      });
    }
    
    // 验证角色
    if (!['user', 'moderator', 'admin'].includes(role)) {
      return res.status(400).json({
        error: '无效的角色'
      });
    }
    
    const user = await User.findByPk(userId);
    
    if (!user) {
      return res.status(404).json({
        error: '用户未找到'
      });
    }
    
    await user.update({ role });
    
    res.json({
      message: `用户角色已更新为 ${role}`,
      user: {
        id: user.id,
        username: user.username,
        role: user.role
      }
    });
  } catch (error) {
    console.error('更新用户角色错误:', error);
    res.status(500).json({
      error: '更新用户角色失败'
    });
  }
});

module.exports = router;