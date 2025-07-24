const express = require('express');
const DreamEntry = require('../models/DreamEntry');
const User = require('../models/User');
const { authenticateToken, requireOwnershipOrModerator, optionalAuth } = require('../middleware/auth');
const { validateDreamEntry, validateObjectId, validatePagination, validateSearch } = require('../middleware/validation');

const router = express.Router();

// Middleware to load dream entry and check ownership
const loadDreamEntry = async (req, res, next) => {
  try {
    const dream = await DreamEntry.findByPk(req.params.dreamId, {
      include: [{ model: User, as: 'user', attributes: ['username', 'profile'] }]
    });
    
    if (!dream || !dream.isActive) {
      return res.status(404).json({
        error: 'Dream entry not found'
      });
    }

    req.resource = dream;
    next();
  } catch (error) {
    console.error('Load dream entry error:', error);
    res.status(500).json({
      error: 'Failed to load dream entry'
    });
  }
};

// Create new dream entry
router.post('/', authenticateToken, validateDreamEntry, async (req, res) => {
  try {
    const dreamData = {
      ...req.body,
      userId: req.user.id
    };

    const dream = new DreamEntry(dreamData);
    await dream.save();

    // Populate user data for response
    await dream.populate('user', 'username profile');

    res.status(201).json({
      message: 'Dream entry created successfully',
      dream
    });

  } catch (error) {
    console.error('Create dream entry error:', error);
    res.status(500).json({
      error: 'Failed to create dream entry'
    });
  }
});

// Get user's dream entries
router.get('/my-dreams', authenticateToken, validatePagination, async (req, res) => {
  try {
    const { page = 1, limit = 10, category, tag, mood, startDate, endDate } = req.query;

    const query = {
      userId: req.user.id,
      isActive: true
    };

    // Apply filters
    if (category) {
      query.categories = category;
    }
    if (tag) {
      query.tags = { $in: [tag] };
    }
    if (mood) {
      query['mood.overall'] = mood;
    }
    if (startDate || endDate) {
      query.dreamDate = {};
      if (startDate) query.dreamDate.$gte = new Date(startDate);
      if (endDate) query.dreamDate.$lte = new Date(endDate);
    }

    const dreams = await DreamEntry.find(query)
      .populate('user', 'username profile')
      .sort({ dreamDate: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await DreamEntry.countDocuments(query);

    res.json({
      dreams,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get my dreams error:', error);
    res.status(500).json({
      error: 'Failed to get dream entries'
    });
  }
});

// Get public dream entries
router.get('/public', optionalAuth, validatePagination, validateSearch, async (req, res) => {
  try {
    const { page = 1, limit = 10, category, tag, spiritualPerspective, q } = req.query;

    const query = {
      privacy: 'public',
      isActive: true
    };

    // Apply filters
    if (category) {
      query.categories = category;
    }
    if (tag) {
      query.tags = { $in: [tag] };
    }
    if (spiritualPerspective) {
      query.spiritualPerspective = spiritualPerspective;
    }
    if (q) {
      query.$or = [
        { title: { $regex: q, $options: 'i' } },
        { content: { $regex: q, $options: 'i' } },
        { tags: { $in: [new RegExp(q, 'i')] } }
      ];
    }

    const dreams = await DreamEntry.find(query)
      .populate('user', 'username profile')
      .select('-interpretation.personal') // Don't expose personal interpretations
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await DreamEntry.countDocuments(query);

    res.json({
      dreams,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get public dreams error:', error);
    res.status(500).json({
      error: 'Failed to get public dream entries'
    });
  }
});

// Get single dream entry
router.get('/:dreamId', validateObjectId('dreamId'), loadDreamEntry, optionalAuth, async (req, res) => {
  try {
    const dream = req.resource;
    const isOwner = req.user && req.user._id.toString() === dream.user._id.toString();

    // Check privacy permissions
    if (dream.privacy === 'private' && !isOwner) {
      return res.status(403).json({
        error: 'Access denied'
      });
    }

    // Remove personal interpretation if not owner
    let dreamData = dream.toObject();
    if (!isOwner) {
      delete dreamData.interpretation.personal;
    }

    res.json({
      dream: dreamData
    });

  } catch (error) {
    console.error('Get dream entry error:', error);
    res.status(500).json({
      error: 'Failed to get dream entry'
    });
  }
});

// Update dream entry
router.put('/:dreamId', validateObjectId('dreamId'), loadDreamEntry, authenticateToken, requireOwnershipOrModerator(), validateDreamEntry, async (req, res) => {
  try {
    const dream = req.resource;

    // Update fields
    Object.keys(req.body).forEach(key => {
      if (key !== 'user' && key !== '_id') {
        dream[key] = req.body[key];
      }
    });

    await dream.save();
    await dream.populate('user', 'username profile');

    res.json({
      message: 'Dream entry updated successfully',
      dream
    });

  } catch (error) {
    console.error('Update dream entry error:', error);
    res.status(500).json({
      error: 'Failed to update dream entry'
    });
  }
});

// Delete dream entry
router.delete('/:dreamId', validateObjectId('dreamId'), loadDreamEntry, authenticateToken, requireOwnershipOrModerator(), async (req, res) => {
  try {
    const dream = req.resource;

    // Soft delete
    dream.isActive = false;
    await dream.save();

    // Update user stats
    await req.user.updateOne({
      $inc: { 'stats.totalDreams': -1 }
    });

    res.json({
      message: 'Dream entry deleted successfully'
    });

  } catch (error) {
    console.error('Delete dream entry error:', error);
    res.status(500).json({
      error: 'Failed to delete dream entry'
    });
  }
});

// Like/unlike dream entry
router.post('/:dreamId/like', validateObjectId('dreamId'), loadDreamEntry, authenticateToken, async (req, res) => {
  try {
    const dream = req.resource;

    // Check if dream is public or user has access
    const isOwner = req.user._id.toString() === dream.user._id.toString();
    if (dream.privacy === 'private' && !isOwner) {
      return res.status(403).json({
        error: 'Access denied'
      });
    }

    const isLiked = dream.isLikedBy(req.user._id);

    if (isLiked) {
      await dream.removeLike(req.user._id);
    } else {
      await dream.addLike(req.user._id);
    }

    res.json({
      message: isLiked ? 'Like removed' : 'Dream liked',
      liked: !isLiked,
      likeCount: dream.likes.length
    });

  } catch (error) {
    console.error('Like dream error:', error);
    res.status(500).json({
      error: 'Failed to like dream'
    });
  }
});

// Add comment to dream entry
router.post('/:dreamId/comments', validateObjectId('dreamId'), loadDreamEntry, authenticateToken, async (req, res) => {
  try {
    const dream = req.resource;
    const { content } = req.body;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({
        error: 'Comment content is required'
      });
    }

    if (content.length > 1000) {
      return res.status(400).json({
        error: 'Comment cannot exceed 1000 characters'
      });
    }

    // Check if dream is public or user has access
    const isOwner = req.user._id.toString() === dream.user._id.toString();
    if (dream.privacy === 'private' && !isOwner) {
      return res.status(403).json({
        error: 'Access denied'
      });
    }

    await dream.addComment(req.user._id, content.trim());
    await dream.populate('comments.user', 'username profile');

    // Update user stats
    await req.user.updateOne({
      $inc: { 'stats.totalComments': 1 }
    });

    res.status(201).json({
      message: 'Comment added successfully',
      comment: dream.comments[dream.comments.length - 1]
    });

  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({
      error: 'Failed to add comment'
    });
  }
});

// Get dream statistics for user
router.get('/stats/overview', authenticateToken, async (req, res) => {
  try {
    const userId = req.user._id;

    const stats = await DreamEntry.aggregate([
      { $match: { user: userId, isActive: true } },
      {
        $group: {
          _id: null,
          totalDreams: { $sum: 1 },
          avgLucidity: { $avg: '$lucidityLevel' },
          avgVividness: { $avg: '$vividness' },
          avgSleepQuality: { $avg: '$sleepQuality' },
          mostCommonMood: { $push: '$mood.overall' },
          categoryCounts: { $push: '$categories' },
          recentDreams: { $push: { date: '$dreamDate', title: '$title' } }
        }
      }
    ]);

    if (stats.length === 0) {
      return res.json({
        stats: {
          totalDreams: 0,
          avgLucidity: 0,
          avgVividness: 0,
          avgSleepQuality: 0,
          mostCommonMood: null,
          topCategories: [],
          recentDreams: []
        }
      });
    }

    const result = stats[0];

    // Process mood data
    const moodCounts = result.mostCommonMood.reduce((acc, mood) => {
      if (mood) {
        acc[mood] = (acc[mood] || 0) + 1;
      }
      return acc;
    }, {});

    const mostCommonMood = Object.keys(moodCounts).reduce((a, b) => 
      moodCounts[a] > moodCounts[b] ? a : b, null
    );

    // Process category data
    const categoryFlat = result.categoryCounts.flat();
    const categoryCounts = categoryFlat.reduce((acc, cat) => {
      acc[cat] = (acc[cat] || 0) + 1;
      return acc;
    }, {});

    const topCategories = Object.entries(categoryCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([category, count]) => ({ category, count }));

    res.json({
      stats: {
        totalDreams: result.totalDreams,
        avgLucidity: Math.round(result.avgLucidity * 10) / 10,
        avgVividness: Math.round(result.avgVividness * 10) / 10,
        avgSleepQuality: Math.round(result.avgSleepQuality * 10) / 10,
        mostCommonMood,
        topCategories,
        recentDreams: result.recentDreams
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .slice(0, 5)
      }
    });

  } catch (error) {
    console.error('Get dream stats error:', error);
    res.status(500).json({
      error: 'Failed to get dream statistics'
    });
  }
});

module.exports = router;