const express = require('express');
const { Op } = require('sequelize');
const { CommunityPost, User, DreamEntry } = require('../models');
const { authenticateToken, optionalAuth, requireOwnershipOrModerator, requireModerator } = require('../middleware/auth');
const { validateCommunityPost, validateComment, validateId, validatePagination, validateSearch } = require('../middleware/validation');

const router = express.Router();

// 中间件：加载社区帖子
const loadCommunityPost = async (req, res, next) => {
  try {
    const postId = parseInt(req.params.id);
    
    if (isNaN(postId)) {
      return res.status(400).json({
        error: '无效的帖子ID'
      });
    }
    
    const post = await CommunityPost.findByPk(postId);
    
    if (!post) {
      return res.status(404).json({
        error: '帖子未找到'
      });
    }
    
    req.resource = post;
    next();
  } catch (error) {
    console.error('加载帖子错误:', error);
    res.status(500).json({
      error: '加载帖子失败'
    });
  }
};

// 获取社区帖子列表
router.get('/', optionalAuth, validatePagination, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    
    // 过滤条件
    const category = req.query.category;
    const type = req.query.type;
    const spiritualPerspective = req.query.perspective;
    
    const whereConditions = {
      status: 'active'
    };
    
    if (category) {
      whereConditions.category = category;
    }
    
    if (type) {
      whereConditions.type = type;
    }
    
    if (spiritualPerspective) {
      whereConditions.spiritualPerspective = spiritualPerspective;
    }
    
    const { count, rows: posts } = await CommunityPost.findAndCountAll({
      where: whereConditions,
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'username', 'profile']
        }
      ],
      order: [
        ['isPinned', 'DESC'],
        ['createdAt', 'DESC']
      ],
      limit,
      offset
    });
    
    // 处理作者信息
    const formattedPosts = posts.map(post => {
      const postData = post.toJSON();
      if (postData.author) {
        postData.author = post.author.getPublicProfile();
      }
      return postData;
    });
    
    res.json({
      posts: formattedPosts,
      pagination: {
        page,
        limit,
        total: count,
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('获取帖子列表错误:', error);
    res.status(500).json({
      error: '获取帖子列表失败'
    });
  }
});

// 创建新帖子
router.post('/', authenticateToken, validateCommunityPost, async (req, res) => {
  try {
    const postData = {
      ...req.body,
      authorId: req.user.id
    };
    
    // 如果有关联的梦境，验证它是否存在且属于当前用户
    if (postData.relatedDreamId) {
      const dreamEntry = await DreamEntry.findOne({
        where: {
          id: postData.relatedDreamId,
          userId: req.user.id
        }
      });
      
      if (!dreamEntry) {
        return res.status(400).json({
          error: '关联的梦境不存在或不属于您'
        });
      }
    }
    
    const post = await CommunityPost.create(postData);
    
    // 更新用户统计数据
    const stats = req.user.stats || {};
    stats.totalPosts = (stats.totalPosts || 0) + 1;
    req.user.stats = stats;
    await req.user.save();
    
    res.status(201).json({
      message: '帖子创建成功',
      post
    });
  } catch (error) {
    console.error('创建帖子错误:', error);
    res.status(500).json({
      error: '创建帖子失败'
    });
  }
});

// 获取单个帖子详情
router.get('/:id', optionalAuth, loadCommunityPost, async (req, res) => {
  try {
    const post = req.resource;
    
    // 检查帖子状态
    if (post.status !== 'active' && (!req.user || (req.user.id !== post.authorId && !['moderator', 'admin'].includes(req.user.role)))) {
      return res.status(403).json({
        error: '您无权访问此帖子'
      });
    }
    
    // 获取作者信息
    const author = await User.findByPk(post.authorId, {
      attributes: ['id', 'username', 'profile']
    });
    
    // 获取关联的梦境（如果有）
    let relatedDream = null;
    if (post.relatedDreamId) {
      relatedDream = await DreamEntry.findByPk(post.relatedDreamId, {
        attributes: ['id', 'title', 'dreamDate']
      });
    }
    
    // 更新浏览次数
    const stats = post.stats || {};
    stats.views = (stats.views || 0) + 1;
    post.stats = stats;
    await post.save();
    
    res.json({
      post,
      author: author ? author.getPublicProfile() : null,
      relatedDream
    });
  } catch (error) {
    console.error('获取帖子详情错误:', error);
    res.status(500).json({
      error: '获取帖子详情失败'
    });
  }
});

// 更新帖子
router.put('/:id', authenticateToken, loadCommunityPost, requireOwnershipOrModerator('authorId'), validateCommunityPost, async (req, res) => {
  try {
    const post = req.resource;
    
    // 更新帖子数据
    await post.update(req.body);
    
    res.json({
      message: '帖子更新成功',
      post
    });
  } catch (error) {
    console.error('更新帖子错误:', error);
    res.status(500).json({
      error: '更新帖子失败'
    });
  }
});

// 删除帖子（软删除）
router.delete('/:id', authenticateToken, loadCommunityPost, requireOwnershipOrModerator('authorId'), async (req, res) => {
  try {
    const post = req.resource;
    
    // 软删除（更改状态）
    await post.update({ status: 'deleted' });
    
    // 如果是版主或管理员删除，不更新用户统计数据
    if (post.authorId === req.user.id) {
      // 更新用户统计数据
      const stats = req.user.stats || {};
      stats.totalPosts = Math.max((stats.totalPosts || 0) - 1, 0);
      req.user.stats = stats;
      await req.user.save();
    }
    
    res.json({
      message: '帖子删除成功'
    });
  } catch (error) {
    console.error('删除帖子错误:', error);
    res.status(500).json({
      error: '删除帖子失败'
    });
  }
});

// 置顶/取消置顶帖子
router.put('/:id/pin', authenticateToken, loadCommunityPost, requireModerator, async (req, res) => {
  try {
    const post = req.resource;
    const isPinned = req.body.isPinned === true;
    
    await post.update({ isPinned });
    
    res.json({
      message: isPinned ? '帖子已置顶' : '帖子已取消置顶',
      post
    });
  } catch (error) {
    console.error('置顶帖子错误:', error);
    res.status(500).json({
      error: '置顶帖子失败'
    });
  }
});

// 设置/取消精华帖子
router.put('/:id/feature', authenticateToken, loadCommunityPost, requireModerator, async (req, res) => {
  try {
    const post = req.resource;
    const isFeatured = req.body.isFeatured === true;
    
    await post.update({ isFeatured });
    
    res.json({
      message: isFeatured ? '帖子已设为精华' : '帖子已取消精华',
      post
    });
  } catch (error) {
    console.error('设置精华帖子错误:', error);
    res.status(500).json({
      error: '设置精华帖子失败'
    });
  }
});

// 获取社区元数据（分类、类型等）
router.get('/meta/categories', async (req, res) => {
  try {
    // 这些是预定义的分类和类型
    const categories = [
      'General Discussion', 'Dream Interpretation', 'Spiritual Perspectives',
      'Lucid Dreaming', 'Nightmares', 'Recurring Dreams', 'Prophetic Dreams',
      'Dream Symbols', 'Sleep & Dreams', 'Community Support', 'Resources & Tools',
      'Success Stories'
    ];
    
    const types = [
      'discussion', 'question', 'interpretation', 'experience', 'insight', 'resource'
    ];
    
    const spiritualPerspectives = [
      'Christian', 'Islamic', 'Buddhist', 'Hindu', 'Jewish', 'Universal', 'Multi-Faith'
    ];
    
    res.json({
      categories,
      types,
      spiritualPerspectives
    });
  } catch (error) {
    console.error('获取社区元数据错误:', error);
    res.status(500).json({
      error: '获取社区元数据失败'
    });
  }
});

// 搜索社区帖子
router.get('/search', validateSearch, validatePagination, async (req, res) => {
  try {
    const { q, category, tags } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    
    // 构建搜索条件
    const whereConditions = {
      status: 'active'
    };
    
    // 文本搜索
    if (q) {
      whereConditions[Op.or] = [
        { title: { [Op.like]: `%${q}%` } },
        { content: { [Op.like]: `%${q}%` } }
      ];
    }
    
    // 分类过滤
    if (category) {
      whereConditions.category = category;
    }
    
    // 标签过滤
    if (tags) {
      const tagList = tags.split(',').map(tag => tag.trim());
      // 注意：这是一个简化的JSON搜索，实际实现可能需要根据数据库类型调整
      whereConditions.tags = { [Op.like]: `%${tagList[0]}%` };
    }
    
    const { count, rows: posts } = await CommunityPost.findAndCountAll({
      where: whereConditions,
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'username', 'profile']
        }
      ],
      order: [
        ['isPinned', 'DESC'],
        ['createdAt', 'DESC']
      ],
      limit,
      offset
    });
    
    // 处理作者信息
    const formattedPosts = posts.map(post => {
      const postData = post.toJSON();
      if (postData.author) {
        postData.author = post.author.getPublicProfile();
      }
      return postData;
    });
    
    res.json({
      posts: formattedPosts,
      pagination: {
        page,
        limit,
        total: count,
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('搜索帖子错误:', error);
    res.status(500).json({
      error: '搜索帖子失败'
    });
  }
});

module.exports = router;