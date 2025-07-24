const express = require('express');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { authenticateToken, sensitiveOperationLimit } = require('../middleware/auth');
const { validateUserRegistration, validateUserLogin } = require('../middleware/validation');

const router = express.Router();

// 生成JWT令牌
const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

// 注册新用户
router.post('/register', sensitiveOperationLimit(3), validateUserRegistration, async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // 检查用户是否已存在
    const existingUser = await User.findOne({
      where: {
        [sequelize.Op.or]: [
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
      password
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

// 修改密码
router.post('/change-password', authenticateToken, sensitiveOperationLimit(3), async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        error: '当前密码和新密码是必需的'
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

// 请求密码重置（未来电子邮件实现的占位符）
router.post('/forgot-password', sensitiveOperationLimit(3), async (req, res) => {
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
      message: '如果存在使用该电子邮件的账户，密码重置链接已发送'
    });

    // TODO: 在这里实现电子邮件发送逻辑
    if (user) {
      console.log(`用户请求密码重置: ${user.email}`);
      // 生成重置令牌并发送电子邮件
    }

  } catch (error) {
    console.error('忘记密码错误:', error);
    res.status(500).json({
      error: '处理密码重置请求失败'
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