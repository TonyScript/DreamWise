const express = require('express');
const { Op } = require('sequelize');
const { DreamEntry, User } = require('../models');
const { authenticateToken, requireOwnershipOrModerator } = require('../middleware/auth');
const { validateDreamEntry, validateId, validatePagination, validateSearch } = require('../middleware/validation');

const router = express.Router();

// 中间件：加载梦境条目
const loadDreamEntry = async (req, res, next) => {
  try {
    const dreamId = parseInt(req.params.id);
    
    if (isNaN(dreamId)) {
      return res.status(400).json({
        error: '无效的梦境ID'
      });
    }
    
    const dreamEntry = await DreamEntry.findByPk(dreamId);
    
    if (!dreamEntry) {
      return res.status(404).json({
        error: '梦境未找到'
      });
    }
    
    req.resource = dreamEntry;
    next();
  } catch (error) {
    console.error('加载梦境错误:', error);
    res.status(500).json({
      error: '加载梦境失败'
    });
  }
};

// 获取当前用户的所有梦境
router.get('/my-dreams', authenticateToken, validatePagination, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    
    const { count, rows: dreams } = await DreamEntry.findAndCountAll({
      where: {
        userId: req.user.id
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
    console.error('获取梦境列表错误:', error);
    res.status(500).json({
      error: '获取梦境列表失败'
    });
  }
});

// 创建新梦境
router.post('/', authenticateToken, validateDreamEntry, async (req, res) => {
  try {
    const dreamData = {
      ...req.body,
      userId: req.user.id
    };
    
    const dream = await DreamEntry.create(dreamData);
    
    // 更新用户统计数据
    const stats = req.user.stats || {};
    stats.totalDreams = (stats.totalDreams || 0) + 1;
    req.user.stats = stats;
    await req.user.save();
    
    res.status(201).json({
      message: '梦境创建成功',
      dream
    });
  } catch (error) {
    console.error('创建梦境错误:', error);
    res.status(500).json({
      error: '创建梦境失败'
    });
  }
});

// 获取单个梦境详情
router.get('/:id', authenticateToken, loadDreamEntry, async (req, res) => {
  try {
    const dream = req.resource;
    
    // 检查访问权限
    if (dream.userId !== req.user.id && dream.privacy === 'private') {
      return res.status(403).json({
        error: '您无权访问此梦境'
      });
    }
    
    // 如果是公开梦境，包含作者信息
    if (dream.privacy !== 'private' && dream.userId !== req.user.id) {
      const author = await User.findByPk(dream.userId, {
        attributes: ['id', 'username', 'profile']
      });
      
      return res.json({
        dream,
        author: author ? author.getPublicProfile() : null
      });
    }
    
    res.json({ dream });
  } catch (error) {
    console.error('获取梦境详情错误:', error);
    res.status(500).json({
      error: '获取梦境详情失败'
    });
  }
});

// 更新梦境
router.put('/:id', authenticateToken, loadDreamEntry, requireOwnershipOrModerator('userId'), validateDreamEntry, async (req, res) => {
  try {
    const dream = req.resource;
    
    // 更新梦境数据
    await dream.update(req.body);
    
    res.json({
      message: '梦境更新成功',
      dream
    });
  } catch (error) {
    console.error('更新梦境错误:', error);
    res.status(500).json({
      error: '更新梦境失败'
    });
  }
});

// 删除梦境
router.delete('/:id', authenticateToken, loadDreamEntry, requireOwnershipOrModerator('userId'), async (req, res) => {
  try {
    const dream = req.resource;
    
    await dream.destroy();
    
    // 更新用户统计数据
    const stats = req.user.stats || {};
    stats.totalDreams = Math.max((stats.totalDreams || 0) - 1, 0);
    req.user.stats = stats;
    await req.user.save();
    
    res.json({
      message: '梦境删除成功'
    });
  } catch (error) {
    console.error('删除梦境错误:', error);
    res.status(500).json({
      error: '删除梦境失败'
    });
  }
});

// 获取梦境统计数据
router.get('/stats/overview', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // 获取总梦境数
    const totalDreams = await DreamEntry.count({
      where: { userId }
    });
    
    // 获取平均清醒度
    const avgLucidityResult = await DreamEntry.findOne({
      attributes: [
        [sequelize.fn('AVG', sequelize.col('lucidityLevel')), 'avgLucidity']
      ],
      where: { userId }
    });
    
    // 获取平均生动度
    const avgVividnessResult = await DreamEntry.findOne({
      attributes: [
        [sequelize.fn('AVG', sequelize.col('vividness')), 'avgVividness']
      ],
      where: { userId }
    });
    
    // 获取所有梦境的分类
    const dreams = await DreamEntry.findAll({
      attributes: ['categories'],
      where: { userId }
    });
    
    // 计算最常见的分类
    const categoryCounts = {};
    dreams.forEach(dream => {
      const categories = dream.categories || [];
      categories.forEach(category => {
        categoryCounts[category] = (categoryCounts[category] || 0) + 1;
      });
    });
    
    // 排序分类
    const topCategories = Object.entries(categoryCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }));
    
    res.json({
      stats: {
        totalDreams,
        avgLucidity: parseFloat(avgLucidityResult.getDataValue('avgLucidity') || 0).toFixed(1),
        avgVividness: parseFloat(avgVividnessResult.getDataValue('avgVividness') || 0).toFixed(1),
        topCategories
      }
    });
  } catch (error) {
    console.error('获取梦境统计错误:', error);
    res.status(500).json({
      error: '获取梦境统计失败'
    });
  }
});

// 搜索梦境
router.get('/search', authenticateToken, validateSearch, validatePagination, async (req, res) => {
  try {
    const { q, category, tags } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    
    // 构建搜索条件
    const whereConditions = {
      userId: req.user.id
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
      // 注意：这是一个简化的JSON搜索，实际实现可能需要根据数据库类型调整
      whereConditions.categories = { [Op.like]: `%${category}%` };
    }
    
    // 标签过滤
    if (tags) {
      const tagList = tags.split(',').map(tag => tag.trim());
      // 注意：这是一个简化的JSON搜索，实际实现可能需要根据数据库类型调整
      whereConditions.tags = { [Op.like]: `%${tagList[0]}%` };
    }
    
    const { count, rows: dreams } = await DreamEntry.findAndCountAll({
      where: whereConditions,
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
    console.error('搜索梦境错误:', error);
    res.status(500).json({
      error: '搜索梦境失败'
    });
  }
});

module.exports = router;