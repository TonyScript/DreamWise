const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { authenticateToken, sensitiveOperationLimit } = require('../middleware/auth');
const { validateUserRegistration, validateUserLogin } = require('../middleware/validation');

const router = express.Router();

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

// Register new user
router.post('/register', sensitiveOperationLimit(3), validateUserRegistration, async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      return res.status(400).json({
        error: existingUser.email === email ? 'Email already registered' : 'Username already taken'
      });
    }

    // Create new user
    const user = new User({
      username,
      email,
      password
    });

    await user.save();

    // Generate token
    const token = generateToken(user.id);

    // Return user data without password
    const userData = user.getSafeProfile();

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: userData
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      error: 'Registration failed'
    });
  }
});

// Login user
router.post('/login', sensitiveOperationLimit(20), validateUserLogin, async (req, res) => { // 增加登录尝试次数限制
  try {
    const { email, password } = req.body;
    
    console.log(`🔄 尝试登录: ${email}`);

    // Find user by email
    const user = await User.findOne({ 
      where: { 
        email: email,
        isActive: true 
      } 
    });

    if (!user) {
      console.log(`❌ 用户不存在: ${email}`);
      return res.status(401).json({
        error: 'Invalid email or password'
      });
    }
    
    console.log(`✅ 找到用户: ${user.username} (ID: ${user.id})`);

    // Check password
    console.log(`🔄 验证密码...`);
    // 直接使用bcrypt比较密码，避免可能的方法问题
    const bcrypt = require('bcryptjs');
    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log(`密码验证结果: ${isPasswordValid ? '成功' : '失败'}`);
    
    // 如果使用实例方法失败，尝试直接比较
    if (!isPasswordValid) {
      console.log('⚠️ 实例方法验证失败，尝试直接比较...');
      const directCompare = await bcrypt.compare(password, user.password);
      console.log(`直接比较结果: ${directCompare ? '成功' : '失败'}`);
      
      if (directCompare) {
        console.log('✅ 直接比较成功，继续登录流程');
      }
    }

    if (!isPasswordValid) {
      return res.status(401).json({
        error: 'Invalid email or password'
      });
    }

    // Update last active
    await user.updateLastActive();

    // Generate token
    const token = generateToken(user.id);

    // Return user data without password
    const userData = user.getSafeProfile();

    res.json({
      message: 'Login successful',
      token,
      user: userData
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      error: 'Login failed'
    });
  }
});

// Get current user profile
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const userData = req.user.getSafeProfile();
    res.json({
      user: userData
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      error: 'Failed to get user profile'
    });
  }
});

// Refresh token
router.post('/refresh', authenticateToken, async (req, res) => {
  try {
    // Generate new token
    const token = generateToken(req.user.id);

    res.json({
      message: 'Token refreshed successfully',
      token
    });

  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(500).json({
      error: 'Token refresh failed'
    });
  }
});

// Logout (client-side token removal, but we can track it server-side if needed)
router.post('/logout', authenticateToken, async (req, res) => {
  try {
    // In a more complex setup, you might want to blacklist the token
    // For now, we'll just confirm the logout
    res.json({
      message: 'Logout successful'
    });

  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      error: 'Logout failed'
    });
  }
});

// Change password
router.post('/change-password', authenticateToken, sensitiveOperationLimit(3), async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        error: 'Current password and new password are required'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        error: 'New password must be at least 6 characters long'
      });
    }

    // Verify current password
    const isCurrentPasswordValid = await req.user.comparePassword(currentPassword);

    if (!isCurrentPasswordValid) {
      return res.status(401).json({
        error: 'Current password is incorrect'
      });
    }

    // Update password
    req.user.password = newPassword;
    await req.user.save();

    res.json({
      message: 'Password changed successfully'
    });

  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      error: 'Failed to change password'
    });
  }
});

// Request password reset (placeholder for future email implementation)
router.post('/forgot-password', sensitiveOperationLimit(3), async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        error: 'Email is required'
      });
    }

    const user = await User.findOne({ email, isActive: true });

    // Always return success to prevent email enumeration
    res.json({
      message: 'If an account with that email exists, a password reset link has been sent'
    });

    // TODO: Implement email sending logic here
    if (user) {
      console.log(`Password reset requested for user: ${user.email}`);
      // Generate reset token and send email
    }

  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      error: 'Failed to process password reset request'
    });
  }
});

// Verify token (useful for frontend to check if token is still valid)
router.get('/verify', authenticateToken, (req, res) => {
  res.json({
    valid: true,
    user: req.user.getSafeProfile()
  });
});

module.exports = router;