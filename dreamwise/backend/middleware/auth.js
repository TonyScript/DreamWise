const jwt = require('jsonwebtoken');
const { User } = require('../models');

// 验证JWT令牌
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        error: '需要访问令牌'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.userId);
    
    if (!user || !user.isActive) {
      return res.status(401).json({
        error: '无效或过期的令牌'
      });
    }

    // 更新最后活动时间
    user.updateLastActive();

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        error: '无效的令牌'
      });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: '令牌已过期'
      });
    }
    
    console.error('认证中间件错误:', error);
    res.status(500).json({
      error: '认证失败'
    });
  }
};

// 可选认证（对于可以从用户上下文受益的公共端点）
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findByPk(decoded.userId);
      
      if (user && user.isActive) {
        user.updateLastActive();
        req.user = user;
      }
    }
    
    next();
  } catch (error) {
    // 对于可选认证，静默失败
    next();
  }
};

// 检查用户是否为管理员
const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({
      error: '需要管理员权限'
    });
  }
  next();
};

// 检查用户是否为版主或管理员
const requireModerator = (req, res, next) => {
  if (!req.user || !['moderator', 'admin'].includes(req.user.role)) {
    return res.status(403).json({
      error: '需要版主权限'
    });
  }
  next();
};

// 检查用户是否拥有资源或是版主/管理员
const requireOwnershipOrModerator = (resourceUserField = 'userId') => {
  return (req, res, next) => {
    const resource = req.resource; // 应由之前的中间件设置
    
    if (!resource) {
      return res.status(404).json({
        error: '资源未找到'
      });
    }

    const resourceUserId = resource[resourceUserField];
    const currentUserId = req.user.id;
    
    if (resourceUserId === currentUserId || ['moderator', 'admin'].includes(req.user.role)) {
      return next();
    }

    res.status(403).json({
      error: '访问被拒绝'
    });
  };
};

// 敏感操作的速率限制
const sensitiveOperationLimit = (maxAttempts = 5, windowMs = 15 * 60 * 1000) => {
  const attempts = new Map();
  
  return (req, res, next) => {
    // 检查是否为开发环境，如果是则跳过速率限制
    if (process.env.NODE_ENV === 'development' && process.env.DISABLE_RATE_LIMIT === 'true') {
      return next();
    }
    
    const key = req.user ? req.user.id.toString() : req.ip;
    const now = Date.now();
    
    if (!attempts.has(key)) {
      attempts.set(key, []);
    }
    
    const userAttempts = attempts.get(key);
    
    // 移除窗口外的旧尝试
    const validAttempts = userAttempts.filter(timestamp => now - timestamp < windowMs);
    attempts.set(key, validAttempts);
    
    if (validAttempts.length >= maxAttempts) {
      // 在开发环境中清除尝试记录
      if (process.env.NODE_ENV === 'development') {
        attempts.set(key, []);
        console.log(`已重置 ${key} 的尝试次数`);
        return next();
      }
      
      return res.status(429).json({
        error: '尝试次数过多，请稍后再试'
      });
    }
    
    validAttempts.push(now);
    next();
  };
};

module.exports = {
  authenticateToken,
  optionalAuth,
  requireAdmin,
  requireModerator,
  requireOwnershipOrModerator,
  sensitiveOperationLimit
};