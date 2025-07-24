const { body, param, query, validationResult } = require('express-validator');

// Handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors.array().map(err => ({
        field: err.path,
        message: err.msg,
        value: err.value
      }))
    });
  }
  next();
};

// User validation rules
const validateUserRegistration = [
  body('username')
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores'),
  
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number'),
  
  handleValidationErrors
];

const validateUserLogin = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  
  handleValidationErrors
];

const validateProfileUpdate = [
  body('displayName')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Display name cannot exceed 50 characters'),
  
  body('bio')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Bio cannot exceed 500 characters'),
  
  body('spiritualBackground')
    .optional()
    .isIn(['Christian', 'Islamic', 'Buddhist', 'Hindu', 'Jewish', 'Universal', 'Other', ''])
    .withMessage('Invalid spiritual background'),
  
  body('dreamingExperience')
    .optional()
    .isIn(['Beginner', 'Intermediate', 'Advanced', 'Expert', ''])
    .withMessage('Invalid dreaming experience level'),
  
  body('interests')
    .optional()
    .isArray()
    .withMessage('Interests must be an array'),
  
  body('interests.*')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Each interest cannot exceed 50 characters'),
  
  handleValidationErrors
];

// Dream entry validation rules
const validateDreamEntry = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Dream title is required')
    .isLength({ max: 200 })
    .withMessage('Title cannot exceed 200 characters'),
  
  body('content')
    .trim()
    .notEmpty()
    .withMessage('Dream content is required')
    .isLength({ max: 5000 })
    .withMessage('Content cannot exceed 5000 characters'),
  
  body('dreamDate')
    .optional()
    .isISO8601()
    .withMessage('Invalid dream date format'),
  
  body('mood.before')
    .optional()
    .isIn(['', 'peaceful', 'anxious', 'excited', 'sad', 'angry', 'confused', 'hopeful', 'fearful', 'content'])
    .withMessage('Invalid mood before sleep'),
  
  body('mood.after')
    .optional()
    .isIn(['', 'peaceful', 'anxious', 'excited', 'sad', 'angry', 'confused', 'hopeful', 'fearful', 'content'])
    .withMessage('Invalid mood after dream'),
  
  body('mood.overall')
    .optional()
    .isIn(['', 'positive', 'negative', 'neutral', 'mixed'])
    .withMessage('Invalid overall mood'),
  
  body('categories')
    .optional()
    .isArray()
    .withMessage('Categories must be an array'),
  
  body('spiritualPerspective')
    .optional()
    .isIn(['', 'Christian', 'Islamic', 'Buddhist', 'Hindu', 'Jewish', 'Universal'])
    .withMessage('Invalid spiritual perspective'),
  
  body('privacy')
    .optional()
    .isIn(['private', 'friends', 'public'])
    .withMessage('Invalid privacy setting'),
  
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),
  
  body('tags.*')
    .optional()
    .trim()
    .isLength({ max: 30 })
    .withMessage('Each tag cannot exceed 30 characters'),
  
  body('lucidityLevel')
    .optional()
    .isInt({ min: 0, max: 10 })
    .withMessage('Lucidity level must be between 0 and 10'),
  
  body('vividness')
    .optional()
    .isInt({ min: 0, max: 10 })
    .withMessage('Vividness must be between 0 and 10'),
  
  body('sleepQuality')
    .optional()
    .isInt({ min: 0, max: 10 })
    .withMessage('Sleep quality must be between 0 and 10'),
  
  handleValidationErrors
];

// Community post validation rules
const validateCommunityPost = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Post title is required')
    .isLength({ max: 200 })
    .withMessage('Title cannot exceed 200 characters'),
  
  body('content')
    .trim()
    .notEmpty()
    .withMessage('Post content is required')
    .isLength({ max: 5000 })
    .withMessage('Content cannot exceed 5000 characters'),
  
  body('type')
    .isIn(['discussion', 'question', 'interpretation', 'experience', 'insight', 'resource'])
    .withMessage('Invalid post type'),
  
  body('category')
    .isIn([
      'General Discussion', 'Dream Interpretation', 'Spiritual Perspectives',
      'Lucid Dreaming', 'Nightmares', 'Recurring Dreams', 'Prophetic Dreams',
      'Dream Symbols', 'Sleep & Dreams', 'Community Support', 'Resources & Tools',
      'Success Stories'
    ])
    .withMessage('Invalid category'),
  
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),
  
  body('tags.*')
    .optional()
    .trim()
    .isLength({ max: 30 })
    .withMessage('Each tag cannot exceed 30 characters'),
  
  body('spiritualPerspective')
    .optional()
    .isIn(['', 'Christian', 'Islamic', 'Buddhist', 'Hindu', 'Jewish', 'Universal', 'Multi-Faith'])
    .withMessage('Invalid spiritual perspective'),
  
  handleValidationErrors
];

const validateComment = [
  body('content')
    .trim()
    .notEmpty()
    .withMessage('Comment content is required')
    .isLength({ max: 2000 })
    .withMessage('Comment cannot exceed 2000 characters'),
  
  handleValidationErrors
];

// Parameter validation
const validateObjectId = (paramName) => [
  param(paramName)
    .isMongoId()
    .withMessage(`Invalid ${paramName} ID`),
  
  handleValidationErrors
];

// Query validation
const validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  
  handleValidationErrors
];

const validateSearch = [
  query('q')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Search query must be between 1 and 100 characters'),
  
  query('category')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Category filter cannot exceed 50 characters'),
  
  query('tags')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Tags filter cannot exceed 200 characters'),
  
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
  validateObjectId,
  validatePagination,
  validateSearch
};