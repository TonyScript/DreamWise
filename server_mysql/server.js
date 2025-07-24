const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const path = require('path');
const { Sequelize } = require('sequelize');
require('dotenv').config();

const app = express();

// 导入数据库和模型
const { sequelize, testConnection } = require('./config/database');
const { syncDatabase } = require('./models');

// 导入路由
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const journalRoutes = require('./routes/journal');
const communityRoutes = require('./routes/community');

// 安全中间件 - 配置helmet以允许静态文件
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  crossOriginEmbedderPolicy: false
}));
app.use(compression());

// 速率限制
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15分钟
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // 限制每个IP在windowMs内的请求数为100
  message: {
    error: '来自此IP的请求过多，请稍后再试。'
  }
});
app.use('/api/', limiter);

// CORS配置
const corsOptions = {
  origin: function(origin, callback) {
    // 允许的前端源列表
    const allowedOrigins = [
      'http://localhost:8000',  // 您当前使用的端口
      'http://localhost:8080',  // 原始配置的端口
      'http://127.0.0.1:8000',
      'http://127.0.0.1:8080',
      process.env.FRONTEND_URL
    ].filter(Boolean); // 过滤掉undefined值
    
    // 允许没有origin的请求（如移动应用或Postman）
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('CORS阻止来源:', origin);
      callback(new Error('不允许CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// 请求体解析中间件
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 静态文件 - 添加CORS头
app.use('/uploads', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
}, express.static(path.join(__dirname, 'uploads')));

// 路由
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/journal', journalRoutes);
app.use('/api/community', communityRoutes);

// 健康检查端点
app.get('/api/health', (req, res) => {
  console.log('健康检查请求来自:', req.headers.origin || '未知来源');
  
  // 设置CORS头（备用，以防cors中间件不起作用）
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    database: 'MySQL',
    version: '1.0.0',
    message: '服务器正常运行'
  });
});

// 简单的测试端点，不需要认证
app.get('/api/test', (req, res) => {
  console.log('测试端点请求来自:', req.headers.origin || '未知来源');
  res.json({
    message: '服务器连接测试成功',
    time: new Date().toISOString()
  });
});

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error('错误:', err);
  
  // Sequelize验证错误
  if (err instanceof Sequelize.ValidationError) {
    return res.status(400).json({
      error: '验证错误',
      details: err.errors.map(e => ({
        field: e.path,
        message: e.message
      }))
    });
  }
  
  // Sequelize唯一约束错误
  if (err instanceof Sequelize.UniqueConstraintError) {
    return res.status(400).json({
      error: '重复条目',
      field: err.errors[0].path
    });
  }
  
  // Sequelize外键约束错误
  if (err instanceof Sequelize.ForeignKeyConstraintError) {
    return res.status(400).json({
      error: '无效引用',
      field: err.fields
    });
  }
  
  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === 'production' 
      ? '内部服务器错误' 
      : err.message
  });
});

// 404处理程序
app.use('*', (req, res) => {
  res.status(404).json({
    error: '端点未找到'
  });
});

// 初始化数据库并启动服务器
const PORT = process.env.PORT || 3000;

// 确保上传目录存在
const fs = require('fs');
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// 同步数据库并启动服务器
const startServer = async () => {
  try {
    // 测试数据库连接
    await testConnection();
    
    // 同步数据库模型（不强制重建表）
    await syncDatabase(false);
    
    // 启动服务器
    app.listen(PORT, () => {
      console.log(`🚀 DreamWise服务器运行在端口 ${PORT}`);
      console.log(`📱 环境: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🌐 前端URL: ${process.env.FRONTEND_URL || 'http://localhost:8000'}`);
      console.log(`💾 数据库: MySQL (${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME})`);
    });
  } catch (error) {
    console.error('❌ 启动服务器失败:', error);
    process.exit(1);
  }
};

// 启动服务器
startServer();

module.exports = app;