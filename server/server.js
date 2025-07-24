const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

const app = express();

// Import database and models
const { sequelize, syncDatabase } = require('./models');

// Import routes
const authRoutes = require('./routes/auth');
const journalRoutes = require('./routes/journal');
const communityRoutes = require('./routes/community');
const userRoutes = require('./routes/user');

// Security middleware
app.use(helmet());
app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.'
  }
});
app.use('/api/', limiter);

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
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
      console.log('CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/journal', journalRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/user', userRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  console.log('Health check requested from:', req.headers.origin || 'Unknown origin');

  // 设置CORS头（备用，以防cors中间件不起作用）
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');

  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    database: 'SQLite',
    version: '1.2.0',
    message: '服务器正常运行'
  });
});

// 简单的测试端点，不需要认证
app.get('/api/test', (req, res) => {
  console.log('Test endpoint requested from:', req.headers.origin || 'Unknown origin');
  res.json({
    message: '服务器连接测试成功',
    time: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);

  // Sequelize validation error
  if (err.name === 'SequelizeValidationError') {
    return res.status(400).json({
      error: 'Validation Error',
      details: err.errors.map(e => ({
        field: e.path,
        message: e.message
      }))
    });
  }

  // Sequelize unique constraint error
  if (err.name === 'SequelizeUniqueConstraintError') {
    return res.status(400).json({
      error: 'Duplicate entry',
      field: err.errors[0].path
    });
  }

  // Sequelize foreign key constraint error
  if (err.name === 'SequelizeForeignKeyConstraintError') {
    return res.status(400).json({
      error: 'Invalid reference',
      field: err.fields
    });
  }

  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === 'production'
      ? 'Internal server error'
      : err.message
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint not found'
  });
});

// Initialize database and start server
const PORT = process.env.PORT || 3000;

// 确保数据库目录存在
const fs = require('fs');
const dbDir = path.join(__dirname, 'database');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// 同步数据库并启动服务器
const startServer = async () => {
  try {
    // 同步数据库模型（不强制重建表）
    await syncDatabase(false);

    // 启动服务器
    app.listen(PORT, () => {
      console.log(`🚀 DreamWise server running on port ${PORT}`);
      console.log(`📱 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🌐 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:8080'}`);
      console.log(`💾 Database: SQLite (${process.env.DATABASE_URL || path.join(__dirname, 'database/dreamwise.sqlite')})`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// 启动服务器
startServer();

module.exports = app;