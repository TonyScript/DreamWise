const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Verify JWT token
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        error: 'Access token required'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.userId, {
      attributes: { exclude: ['password'] }
    });
    
    if (!user || !user.isActive) {
      return res.status(401).json({
        error: 'Invalid or expired token'
      });
    }

    // Update last active timestamp
    user.updateLastActive();

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        error: 'Invalid token'
      });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: 'Token expired'
      });
    }
    
    console.error('Auth middleware error:', error);
    res.status(500).json({
      error: 'Authentication failed'
    });
  }
};

// Optional authentication (for public endpoints that can benefit from user context)
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findByPk(decoded.userId, {
        attributes: { exclude: ['password'] }
      });
      
      if (user && user.isActive) {
        user.updateLastActive();
        req.user = user;
      }
    }
    
    next();
  } catch (error) {
    // Silently fail for optional auth
    next();
  }
};

// Check if user is admin
const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({
      error: 'Admin access required'
    });
  }
  next();
};

// Check if user is moderator or admin
const requireModerator = (req, res, next) => {
  if (!req.user || !['moderator', 'admin'].includes(req.user.role)) {
    return res.status(403).json({
      error: 'Moderator access required'
    });
  }
  next();
};

// Check if user owns the resource or is admin/moderator
const requireOwnershipOrModerator = (resourceUserField = 'user') => {
  return (req, res, next) => {
    const resource = req.resource; // Should be set by previous middleware
    
    if (!resource) {
      return res.status(404).json({
        error: 'Resource not found'
      });
    }

    const resourceUserId = resource[resourceUserField]?.toString() || resource[resourceUserField];
    const currentUserId = req.user._id.toString();
    
    if (resourceUserId === currentUserId || ['moderator', 'admin'].includes(req.user.role)) {
      return next();
    }

    res.status(403).json({
      error: 'Access denied'
    });
  };
};

// Rate limiting for sensitive operations
const sensitiveOperationLimit = (maxAttempts = 5, windowMs = 15 * 60 * 1000) => {
  const attempts = new Map();
  
  return (req, res, next) => {
    // 检查是否为开发环境，如果是则跳过速率限制
    if (process.env.NODE_ENV === 'development' && process.env.DISABLE_RATE_LIMIT === 'true') {
      return next();
    }
    
    const key = req.user ? req.user._id.toString() : req.ip;
    const now = Date.now();
    
    if (!attempts.has(key)) {
      attempts.set(key, []);
    }
    
    const userAttempts = attempts.get(key);
    
    // Remove old attempts outside the window
    const validAttempts = userAttempts.filter(timestamp => now - timestamp < windowMs);
    attempts.set(key, validAttempts);
    
    if (validAttempts.length >= maxAttempts) {
      // 清除该IP的尝试记录，以便下次可以重试
      if (process.env.NODE_ENV === 'development') {
        attempts.set(key, []);
        console.log(`已重置 ${key} 的尝试次数`);
        return next();
      }
      
      return res.status(429).json({
        error: 'Too many attempts, please try again later'
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