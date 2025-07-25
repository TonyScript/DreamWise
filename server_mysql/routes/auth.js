const express = require('express');
const jwt = require('jsonwebtoken');
const { User, VerificationCode } = require('../models');
const { authenticateToken, sensitiveOperationLimit } = require('../middleware/auth');
const { validateUserRegistration, validateUserLogin } = require('../middleware/validation');
const emailService = require('../services/emailService');

const router = express.Router();

// 生成JWT令牌
const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

// 发送注册验证码
router.post('/send-registration-code', sensitiveOperationLimit(3), async (req, res) => {
  try {
    const { email, username } = req.body;

    if (!email || !username) {
      return res.status(400).json({
        error: '邮箱和用户名是必需的'
      });
    }

    // 检查用户是否已存在
    const existingUser = await User.findOne({
      where: {
        [User.sequelize.Op.or]: [
          { email: email },
          { username: username }
        ]
      }
    });

    if (existingUser) {
      return res.status(400).json({
        error: existingUser.email === email ? '电子邮件已注册' : '用户名已被使用'
      });
    }

    // 创建验证码
    const verificationCode = await VerificationCode.createCode(email, 'registration');
    
    // 发送邮件
    await emailService.sendRegistrationVerification(email, username, verificationCode.code);

    res.json({
      message: '验证码已发送到您的邮箱，请查收'
    });

  } catch (error) {
    console.error('发送注册验证码错误:', error);
    res.status(500).json({
      error: '发送验证码失败'
    });
  }
});

// 注册新用户（需要验证码）
router.post('/register', sensitiveOperationLimit(3), validateUserRegistration, async (req, res) => {
  try {
    const { username, email, password, verificationCode } = req.body;

    if (!verificationCode) {
      return res.status(400).json({
        error: '验证码是必需的'
      });
    }

    // 验证验证码
    const codeVerification = await VerificationCode.verifyCode(email, verificationCode, 'registration');
    
    if (!codeVerification.success) {
      return res.status(400).json({
        error: codeVerification.error
      });
    }

    // 再次检查用户是否已存在（防止竞态条件）
    const existingUser = await User.findOne({
      where: {
        [User.sequelize.Op.or]: [
          { email: email },
          { username: username }
        ]
      }
    });

    if (existingUser) {
      return res.status(400).json({
        error: existingUser.email === email ? '电子邮件已注册' : '用户名已被使用'
      });
    }

    // 创建新用户
    const user = await User.create({
      username,
      email,
      password,
      isEmailVerified: true // 通过邮件验证注册的用户标记为已验证
    });

    // 生成令牌
    const token = generateToken(user.id);

    // 返回不包含密码的用户数据
    const userData = user.getSafeProfile();

    res.status(201).json({
      message: '用户注册成功',
      token,
      user: userData
    });

  } catch (error) {
    console.error('注册错误:', error);
    res.status(500).json({
      error: '注册失败'
    });
  }
});

// 用户登录
router.post('/login', sensitiveOperationLimit(20), validateUserLogin, async (req, res) => {
  try {
    const { email, password } = req.body;
    
    console.log(`🔄 尝试登录: ${email}`);

    // 通过电子邮件查找用户
    const user = await User.findOne({ 
      where: { 
        email: email,
        isActive: true 
      } 
    });

    if (!user) {
      console.log(`❌ 用户不存在: ${email}`);
      return res.status(401).json({
        error: '无效的电子邮件或密码'
      });
    }
    
    console.log(`✅ 找到用户: ${user.username} (ID: ${user.id})`);

    // 检查密码
    console.log(`🔄 验证密码...`);
    const isPasswordValid = await user.comparePassword(password);
    console.log(`密码验证结果: ${isPasswordValid ? '成功' : '失败'}`);

    if (!isPasswordValid) {
      return res.status(401).json({
        error: '无效的电子邮件或密码'
      });
    }

    // 更新最后活动时间
    await user.updateLastActive();

    // 生成令牌
    const token = generateToken(user.id);

    // 返回不包含密码的用户数据
    const userData = user.getSafeProfile();

    res.json({
      message: '登录成功',
      token,
      user: userData
    });

  } catch (error) {
    console.error('登录错误:', error);
    res.status(500).json({
      error: '登录失败'
    });
  }
});

// 获取当前用户资料
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const userData = req.user.getSafeProfile();
    res.json({
      user: userData
    });
  } catch (error) {
    console.error('获取资料错误:', error);
    res.status(500).json({
      error: '获取用户资料失败'
    });
  }
});

// 刷新令牌
router.post('/refresh', authenticateToken, async (req, res) => {
  try {
    // 生成新令牌
    const token = generateToken(req.user.id);

    res.json({
      message: '令牌刷新成功',
      token
    });

  } catch (error) {
    console.error('令牌刷新错误:', error);
    res.status(500).json({
      error: '令牌刷新失败'
    });
  }
});

// 登出（客户端令牌移除，但我们可以在服务器端跟踪它，如果需要）
router.post('/logout', authenticateToken, async (req, res) => {
  try {
    // 在更复杂的设置中，您可能想要将令牌列入黑名单
    // 现在，我们只是确认登出
    res.json({
      message: '登出成功'
    });

  } catch (error) {
    console.error('登出错误:', error);
    res.status(500).json({
      error: '登出失败'
    });
  }
});

// 发送密码修改验证码
router.post('/send-change-password-code', authenticateToken, sensitiveOperationLimit(3), async (req, res) => {
  try {
    const user = req.user;
    
    // 创建验证码
    const verificationCode = await VerificationCode.createCode(user.email, 'password_change');
    
    // 发送邮件
    await emailService.sendPasswordChangeVerification(user.email, user.username, verificationCode.code);

    res.json({
      message: '验证码已发送到您的邮箱'
    });

  } catch (error) {
    console.error('发送密码修改验证码错误:', error);
    res.status(500).json({
      error: '发送验证码失败'
    });
  }
});

// 修改密码（需要验证码）
router.post('/change-password', authenticateToken, sensitiveOperationLimit(3), async (req, res) => {
  try {
    const { currentPassword, newPassword, verificationCode } = req.body;

    if (!currentPassword || !newPassword || !verificationCode) {
      return res.status(400).json({
        error: '当前密码、新密码和验证码都是必需的'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        error: '新密码必须至少6个字符'
      });
    }

    // 验证当前密码
    const isCurrentPasswordValid = await req.user.comparePassword(currentPassword);

    if (!isCurrentPasswordValid) {
      return res.status(401).json({
        error: '当前密码不正确'
      });
    }

    // 验证验证码
    const codeVerification = await VerificationCode.verifyCode(req.user.email, verificationCode, 'password_change');
    
    if (!codeVerification.success) {
      return res.status(400).json({
        error: codeVerification.error
      });
    }

    // 更新密码
    req.user.password = newPassword;
    await req.user.save();

    res.json({
      message: '密码修改成功'
    });

  } catch (error) {
    console.error('修改密码错误:', error);
    res.status(500).json({
      error: '修改密码失败'
    });
  }
});

// 发送密码重置验证码
router.post('/send-reset-code', sensitiveOperationLimit(3), async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        error: '电子邮件是必需的'
      });
    }

    const user = await User.findOne({ 
      where: { 
        email: email,
        isActive: true 
      } 
    });

    // 始终返回成功以防止电子邮件枚举
    res.json({
      message: '如果存在使用该电子邮件的账户，验证码已发送'
    });

    if (user) {
      try {
        // 创建验证码
        const verificationCode = await VerificationCode.createCode(email, 'password_reset');
        
        // 发送邮件
        await emailService.sendPasswordResetVerification(email, user.username, verificationCode.code);
        
        console.log(`密码重置验证码已发送给: ${user.email}`);
      } catch (emailError) {
        console.error('发送密码重置邮件失败:', emailError);
      }
    }

  } catch (error) {
    console.error('发送密码重置验证码错误:', error);
    res.status(500).json({
      error: '处理密码重置请求失败'
    });
  }
});

// 重置密码（使用验证码）
router.post('/reset-password', sensitiveOperationLimit(3), async (req, res) => {
  try {
    const { email, verificationCode, newPassword } = req.body;

    if (!email || !verificationCode || !newPassword) {
      return res.status(400).json({
        error: '邮箱、验证码和新密码都是必需的'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        error: '新密码必须至少6个字符'
      });
    }

    // 验证验证码
    const codeVerification = await VerificationCode.verifyCode(email, verificationCode, 'password_reset');
    
    if (!codeVerification.success) {
      return res.status(400).json({
        error: codeVerification.error
      });
    }

    // 查找用户
    const user = await User.findOne({ 
      where: { 
        email: email,
        isActive: true 
      } 
    });

    if (!user) {
      return res.status(404).json({
        error: '用户不存在'
      });
    }

    // 更新密码
    user.password = newPassword;
    await user.save();

    res.json({
      message: '密码重置成功'
    });

  } catch (error) {
    console.error('重置密码错误:', error);
    res.status(500).json({
      error: '重置密码失败'
    });
  }
});

// 验证令牌（对前端检查令牌是否仍然有效很有用）
router.get('/verify', authenticateToken, (req, res) => {
  res.json({
    valid: true,
    user: req.user.getSafeProfile()
  });
});

module.exports = router;