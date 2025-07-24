const { body, param, query, validationResult } = require('express-validator');

// 处理验证错误
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: '验证失败',
      details: errors.array().map(err => ({
        field: err.path,
        message: err.msg,
        value: err.value
      }))
    });
  }
  next();
};

// 用户验证规则
const validateUserRegistration = [
  body('username')
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage('用户名必须在3到30个字符之间')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('用户名只能包含字母、数字和下划线'),
  
  body('email')
    .trim()
    .isEmail()
    .withMessage('请提供有效的电子邮件地址')
    .normalizeEmail(),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('密码必须至少6个字符')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('密码必须包含至少一个小写字母、一个大写字母和一个数字'),
  
  handleValidationErrors
];

const validateUserLogin = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('请提供有效的电子邮件地址')
    .normalizeEmail(),
  
  body('password')
    .notEmpty()
    .withMessage('密码是必需的'),
  
  handleValidationErrors
];

const validateProfileUpdate = [
  body('displayName')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('显示名称不能超过50个字符'),
  
  body('bio')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('个人简介不能超过500个字符'),
  
  body('spiritualBackground')
    .optional()
    .isIn(['Christian', 'Islamic', 'Buddhist', 'Hindu', 'Jewish', 'Universal', 'Other', ''])
    .withMessage('无效的精神背景'),
  
  body('dreamingExperience')
    .optional()
    .isIn(['Beginner', 'Intermediate', 'Advanced', 'Expert', ''])
    .withMessage('无效的梦境经验级别'),
  
  body('interests')
    .optional()
    .isArray()
    .withMessage('兴趣必须是一个数组'),
  
  body('interests.*')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('每个兴趣不能超过50个字符'),
  
  handleValidationErrors
];

// 梦境条目验证规则
const validateDreamEntry = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('梦境标题是必需的')
    .isLength({ max: 200 })
    .withMessage('标题不能超过200个字符'),
  
  body('content')
    .trim()
    .notEmpty()
    .withMessage('梦境内容是必需的')
    .isLength({ max: 5000 })
    .withMessage('内容不能超过5000个字符'),
  
  body('dreamDate')
    .optional()
    .isISO8601()
    .withMessage('无效的梦境日期格式'),
  
  body('mood.before')
    .optional()
    .isIn(['', 'peaceful', 'anxious', 'excited', 'sad', 'angry', 'confused', 'hopeful', 'fearful', 'content'])
    .withMessage('无效的睡前情绪'),
  
  body('mood.after')
    .optional()
    .isIn(['', 'peaceful', 'anxious', 'excited', 'sad', 'angry', 'confused', 'hopeful', 'fearful', 'content'])
    .withMessage('无效的梦后情绪'),
  
  body('mood.overall')
    .optional()
    .isIn(['', 'positive', 'negative', 'neutral', 'mixed'])
    .withMessage('无效的整体情绪'),
  
  body('categories')
    .optional()
    .isArray()
    .withMessage('分类必须是一个数组'),
  
  body('spiritualPerspective')
    .optional()
    .isIn(['', 'Christian', 'Islamic', 'Buddhist', 'Hindu', 'Jewish', 'Universal'])
    .withMessage('无效的精神视角'),
  
  body('privacy')
    .optional()
    .isIn(['private', 'friends', 'public'])
    .withMessage('无效的隐私设置'),
  
  body('tags')
    .optional()
    .isArray()
    .withMessage('标签必须是一个数组'),
  
  body('tags.*')
    .optional()
    .trim()
    .isLength({ max: 30 })
    .withMessage('每个标签不能超过30个字符'),
  
  body('lucidityLevel')
    .optional()
    .isInt({ min: 0, max: 10 })
    .withMessage('清醒度级别必须在0到10之间'),
  
  body('vividness')
    .optional()
    .isInt({ min: 0, max: 10 })
    .withMessage('生动度必须在0到10之间'),
  
  body('sleepQuality')
    .optional()
    .isInt({ min: 0, max: 10 })
    .withMessage('睡眠质量必须在0到10之间'),
  
  handleValidationErrors
];

// 社区帖子验证规则
const validateCommunityPost = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('帖子标题是必需的')
    .isLength({ max: 200 })
    .withMessage('标题不能超过200个字符'),
  
  body('content')
    .trim()
    .notEmpty()
    .withMessage('帖子内容是必需的')
    .isLength({ max: 5000 })
    .withMessage('内容不能超过5000个字符'),
  
  body('type')
    .isIn(['discussion', 'question', 'interpretation', 'experience', 'insight', 'resource'])
    .withMessage('无效的帖子类型'),
  
  body('category')
    .isIn([
      'General Discussion', 'Dream Interpretation', 'Spiritual Perspectives',
      'Lucid Dreaming', 'Nightmares', 'Recurring Dreams', 'Prophetic Dreams',
      'Dream Symbols', 'Sleep & Dreams', 'Community Support', 'Resources & Tools',
      'Success Stories'
    ])
    .withMessage('无效的分类'),
  
  body('tags')
    .optional()
    .isArray()
    .withMessage('标签必须是一个数组'),
  
  body('tags.*')
    .optional()
    .trim()
    .isLength({ max: 30 })
    .withMessage('每个标签不能超过30个字符'),
  
  body('spiritualPerspective')
    .optional()
    .isIn(['', 'Christian', 'Islamic', 'Buddhist', 'Hindu', 'Jewish', 'Universal', 'Multi-Faith'])
    .withMessage('无效的精神视角'),
  
  handleValidationErrors
];

const validateComment = [
  body('content')
    .trim()
    .notEmpty()
    .withMessage('评论内容是必需的')
    .isLength({ max: 2000 })
    .withMessage('评论不能超过2000个字符'),
  
  handleValidationErrors
];

// 参数验证
const validateId = (paramName) => [
  param(paramName)
    .isInt({ min: 1 })
    .withMessage(`无效的${paramName}ID`),
  
  handleValidationErrors
];

// 查询验证
const validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('页码必须是正整数'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('限制必须在1到100之间'),
  
  handleValidationErrors
];

const validateSearch = [
  query('q')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('搜索查询必须在1到100个字符之间'),
  
  query('category')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('分类过滤器不能超过50个字符'),
  
  query('tags')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('标签过滤器不能超过200个字符'),
  
  handleValidationErrors
];

module.exports = {
  handleValidationErrors,
  validateUserRegistration,
  validateUserLogin,
  validateProfileUpdate,
  validateDreamEntry,
  validateCommunityPost,
  validateComment,
  validateId,
  validatePagination,
  validateSearch
};