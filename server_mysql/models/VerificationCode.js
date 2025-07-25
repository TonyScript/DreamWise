const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const VerificationCode = sequelize.define('VerificationCode', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmail: true
    }
  },
  code: {
    type: DataTypes.STRING(6),
    allowNull: false,
    validate: {
      len: [6, 6],
      isNumeric: true
    }
  },
  type: {
    type: DataTypes.ENUM('registration', 'password_reset', 'password_change'),
    allowNull: false
  },
  isUsed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: false
  },
  attempts: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  maxAttempts: {
    type: DataTypes.INTEGER,
    defaultValue: 3
  }
}, {
  tableName: 'verification_codes',
  timestamps: true,
  indexes: [
    {
      fields: ['email', 'type']
    },
    {
      fields: ['expiresAt']
    },
    {
      fields: ['isUsed']
    }
  ]
});

// 实例方法
VerificationCode.prototype.isExpired = function() {
  return new Date() > this.expiresAt;
};

VerificationCode.prototype.canAttempt = function() {
  return this.attempts < this.maxAttempts;
};

VerificationCode.prototype.incrementAttempts = async function() {
  this.attempts += 1;
  await this.save();
};

VerificationCode.prototype.markAsUsed = async function() {
  this.isUsed = true;
  await this.save();
};

// 静态方法
VerificationCode.createCode = async function(email, type, expirationMinutes = 10) {
  // 先删除该邮箱和类型的旧验证码
  await VerificationCode.destroy({
    where: {
      email,
      type,
      isUsed: false
    }
  });

  // 生成新的验证码
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + expirationMinutes * 60 * 1000);

  return await VerificationCode.create({
    email,
    code,
    type,
    expiresAt
  });
};

VerificationCode.verifyCode = async function(email, code, type) {
  const verificationCode = await VerificationCode.findOne({
    where: {
      email,
      code,
      type,
      isUsed: false
    }
  });

  if (!verificationCode) {
    return { success: false, error: '验证码无效' };
  }

  if (verificationCode.isExpired()) {
    return { success: false, error: '验证码已过期' };
  }

  if (!verificationCode.canAttempt()) {
    return { success: false, error: '验证码尝试次数过多' };
  }

  // 验证成功，标记为已使用
  await verificationCode.markAsUsed();
  
  return { success: true, verificationCode };
};

// 清理过期验证码的定时任务
VerificationCode.cleanupExpired = async function() {
  const result = await VerificationCode.destroy({
    where: {
      expiresAt: {
        [sequelize.Sequelize.Op.lt]: new Date()
      }
    }
  });
  
  console.log(`清理了 ${result} 个过期验证码`);
  return result;
};

module.exports = VerificationCode;