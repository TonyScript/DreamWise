const express = require('express');
const CommunityPost = require('../models/CommunityPost');
const User = require('../models/User');
const DreamEntry = require('../models/DreamEntry');
const { authenticateToken, requireOwnershipOrModerator, requireModerator, optionalAuth } = require('../middleware/auth');
const { validateCommunityPost, validateComment, validateObjectId, validatePagination, validateSearch } = require('../middleware/validation');

const router = express.Router();

// Middleware to load community post
const loadCommunityPost = async (req, res, next) => {
  try {
    const post = await CommunityPost.findByPk(req.params.postId, {
      include: [
        { model: User, as: 'author', attributes: ['username', 'profile'] },
        { model: DreamEntry, as: 'relatedDream', attributes: ['title', 'dreamDate'] }
      ]
    });
    
    if (!post || !post.isActive) {
      return res.status(404).json({
        error: 'Post not found'
      });
    }

    req.resource = post;
    next();
  } catch (error) {
    console.error('Load community post error:', error);
    res.status(500).json({
      error: 'Failed to load post'
    });
  }
};

// Create new community post
router.post('/', authenticateToken, validateCommunityPost, async (req, res) => {
  try {
    const postData = {
      ...req.body,
      authorId: req.user.id
    };

    const post = new CommunityPost(postData);
    await post.save();

    // Populate author data for response
    await post.populate('author', 'username profile');

    res.status(201).json({
      message: 'Post created successfully',
      post
    });

  } catch (error) {
    console.error('Create community post error:', error);
    res.status(500).json({
      error: 'Failed to create post'
    });
  }
});

// Get community posts with filtering and pagination
router.get('/', optionalAuth, validatePagination, validateSearch, async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      category, 
      type, 
      spiritualPerspective, 
      tags, 
      q,
      sort = 'recent'
    } = req.query;

    const query = {
      isActive: true,
      moderationStatus: 'approved'
    };

    // Apply filters
    if (category) {
      query.category = category;
    }
    if (type) {
      query.type = type;
    }
    if (spiritualPerspective) {
      query.spiritualPerspective = spiritualPerspective;
    }
    if (tags) {
      const tagArray = tags.split(',').map(tag => tag.trim());
      query.tags = { $in: tagArray };
    }
    if (q) {
      query.$text = { $search: q };
    }

    // Determine sort order
    let sortQuery = {};
    switch (sort) {
      case 'popular':
        sortQuery = { views: -1, 'likes.length': -1 };
        break;
      case 'discussed':
        sortQuery = { 'comments.length': -1 };
        break;
      case 'recent':
      default:
        sortQuery = { isPinned: -1, isFeatured: -1, createdAt: -1 };
        break;
    }

    const posts = await CommunityPost.find(query)
      .populate('author', 'username profile')
      .populate('relatedDream', 'title dreamDate')
      .select('-comments') // Don't load all comments in list view
      .sort(sortQuery)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await CommunityPost.countDocuments(query);

    // Add computed fields
    const postsWithStats = posts.map(post => {
      const postObj = post.toObject();
      postObj.likeCount = post.likes.length;
      postObj.commentCount = post.comments.length;
      postObj.isLiked = req.user ? post.isLikedBy(req.user._id) : false;
      return postObj;
    });

    res.json({
      posts: postsWithStats,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get community posts error:', error);
    res.status(500).json({
      error: 'Failed to get community posts'
    });
  }
});

// Get single community post
router.get('/:postId', validateObjectId('postId'), loadCommunityPost, optionalAuth, async (req, res) => {
  try {
    const post = req.resource;

    // Increment view count (but not for the author)
    if (!req.user || req.user._id.toString() !== post.author._id.toString()) {
      await post.incrementViews();
    }

    // Add computed fields
    const postObj = post.toObject();
    postObj.likeCount = post.likes.length;
    postObj.commentCount = post.comments.length;
    postObj.isLiked = req.user ? post.isLikedBy(req.user._id) : false;

    res.json({
      post: postObj
    });

  } catch (error) {
    console.error('Get community post error:', error);
    res.status(500).json({
      error: 'Failed to get post'
    });
  }
});

// Update community post
router.put('/:postId', validateObjectId('postId'), loadCommunityPost, authenticateToken, requireOwnershipOrModerator('author'), validateCommunityPost, async (req, res) => {
  try {
    const post = req.resource;

    // Update fields (excluding system fields)
    const allowedFields = ['title', 'content', 'category', 'tags', 'spiritualPerspective'];
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        post[field] = req.body[field];
      }
    });

    await post.save();

    res.json({
      message: 'Post updated successfully',
      post
    });

  } catch (error) {
    console.error('Update community post error:', error);
    res.status(500).json({
      error: 'Failed to update post'
    });
  }
});

// Delete community post
router.delete('/:postId', validateObjectId('postId'), loadCommunityPost, authenticateToken, requireOwnershipOrModerator('author'), async (req, res) => {
  try {
    const post = req.resource;

    // Soft delete
    post.isActive = false;
    await post.save();

    // Update user stats
    await req.user.updateOne({
      $inc: { 'stats.totalPosts': -1 }
    });

    res.json({
      message: 'Post deleted successfully'
    });

  } catch (error) {
    console.error('Delete community post error:', error);
    res.status(500).json({
      error: 'Failed to delete post'
    });
  }
});

// Like/unlike community post
router.post('/:postId/like', validateObjectId('postId'), loadCommunityPost, authenticateToken, async (req, res) => {
  try {
    const post = req.resource;
    const isLiked = post.isLikedBy(req.user._id);

    if (isLiked) {
      await post.removeLike(req.user._id);
    } else {
      await post.addLike(req.user._id);
    }

    res.json({
      message: isLiked ? 'Like removed' : 'Post liked',
      liked: !isLiked,
      likeCount: post.likes.length
    });

  } catch (error) {
    console.error('Like post error:', error);
    res.status(500).json({
      error: 'Failed to like post'
    });
  }
});

// Add comment to community post
router.post('/:postId/comments', validateObjectId('postId'), loadCommunityPost, authenticateToken, validateComment, async (req, res) => {
  try {
    const post = req.resource;
    const { content } = req.body;

    await post.addComment(req.user._id, content);
    await post.populate('comments.author', 'username profile');

    // Update user stats
    await req.user.updateOne({
      $inc: { 'stats.totalComments': 1 }
    });

    const newComment = post.comments[post.comments.length - 1];

    res.status(201).json({
      message: 'Comment added successfully',
      comment: newComment
    });

  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({
      error: 'Failed to add comment'
    });
  }
});

// Like/unlike comment
router.post('/:postId/comments/:commentId/like', validateObjectId('postId'), validateObjectId('commentId'), loadCommunityPost, authenticateToken, async (req, res) => {
  try {
    const post = req.resource;
    const comment = post.comments.id(req.params.commentId);

    if (!comment) {
      return res.status(404).json({
        error: 'Comment not found'
      });
    }

    const isLiked = comment.likes.some(like => like.user.toString() === req.user._id.toString());

    if (isLiked) {
      comment.likes = comment.likes.filter(like => like.user.toString() !== req.user._id.toString());
    } else {
      comment.likes.push({ user: req.user._id });
    }

    await post.save();

    res.json({
      message: isLiked ? 'Like removed' : 'Comment liked',
      liked: !isLiked,
      likeCount: comment.likes.length
    });

  } catch (error) {
    console.error('Like comment error:', error);
    res.status(500).json({
      error: 'Failed to like comment'
    });
  }
});

// Report community post
router.post('/:postId/report', validateObjectId('postId'), loadCommunityPost, authenticateToken, async (req, res) => {
  try {
    const post = req.resource;
    const { reason, description } = req.body;

    const validReasons = ['spam', 'inappropriate', 'harassment', 'misinformation', 'other'];
    if (!reason || !validReasons.includes(reason)) {
      return res.status(400).json({
        error: 'Valid reason is required'
      });
    }

    // Check if user already reported this post
    const existingReport = post.reports.find(report => 
      report.reporter.toString() === req.user._id.toString()
    );

    if (existingReport) {
      return res.status(400).json({
        error: 'You have already reported this post'
      });
    }

    await post.addReport(req.user._id, reason, description);

    res.json({
      message: 'Report submitted successfully'
    });

  } catch (error) {
    console.error('Report post error:', error);
    res.status(500).json({
      error: 'Failed to report post'
    });
  }
});

// Get community categories
router.get('/meta/categories', (req, res) => {
  const categories = [
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
  ];

  res.json({ categories });
});

// Get trending topics
router.get('/meta/trending', async (req, res) => {
  try {
    const trending = await CommunityPost.aggregate([
      {
        $match: {
          isActive: true,
          moderationStatus: 'approved',
          createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } // Last 7 days
        }
      },
      { $unwind: '$tags' },
      {
        $group: {
          _id: '$tags',
          count: { $sum: 1 },
          posts: { $push: { title: '$title', _id: '$_id' } }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    res.json({
      trending: trending.map(item => ({
        tag: item._id,
        count: item.count,
        recentPosts: item.posts.slice(0, 3)
      }))
    });

  } catch (error) {
    console.error('Get trending topics error:', error);
    res.status(500).json({
      error: 'Failed to get trending topics'
    });
  }
});

// Moderator routes
router.get('/moderation/reports', authenticateToken, requireModerator, async (req, res) => {
  try {
    const { page = 1, limit = 20, status = 'pending' } = req.query;

    const posts = await CommunityPost.find({
      'reports.status': status,
      isActive: true
    })
      .populate('author', 'username profile')
      .populate('reports.reporter', 'username')
      .sort({ 'reports.createdAt': -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await CommunityPost.countDocuments({
      'reports.status': status,
      isActive: true
    });

    res.json({
      posts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get moderation reports error:', error);
    res.status(500).json({
      error: 'Failed to get moderation reports'
    });
  }
});

module.exports = router;