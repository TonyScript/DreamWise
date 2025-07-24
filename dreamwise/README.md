# DreamWise - 梦境解析平台

DreamWise是一个专注于梦境解析、记录和社区分享的综合平台。用户可以记录自己的梦境，获取多信仰视角的解析，并与社区分享交流。

## 项目结构

```
dreamwise/
├── frontend/           # 前端代码
│   ├── assets/         # 静态资源（JS、CSS、图片等）
│   ├── components/     # 可复用组件
│   └── pages/          # 页面文件
├── backend/            # 后端代码（MySQL版本）
│   ├── config/         # 配置文件
│   ├── models/         # 数据库模型
│   ├── routes/         # API路由
│   ├── middleware/     # 中间件
│   ├── scripts/        # 实用脚本
│   └── utils/          # 工具函数
└── docs/               # 文档
    ├── guides/         # 用户和开发指南
    ├── api/            # API文档
    └── deployment/     # 部署文档
```

## 技术栈

### 前端
- HTML5, CSS3, JavaScript
- 响应式设计
- 原生JS API调用

### 后端
- Node.js + Express
- MySQL数据库
- Sequelize ORM
- JWT认证
- RESTful API

## 快速开始

### 前端

1. 打开前端目录：
```bash
cd dreamwise/frontend
```

2. 使用本地服务器运行前端（例如使用VS Code的Live Server插件）

### 后端

1. 安装MySQL（如果尚未安装）：
```bash
brew install mysql
brew services start mysql
mysql_secure_installation
```

2. 创建数据库和用户：
```sql
CREATE DATABASE dreamwise;
CREATE USER 'dreamuser'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON dreamwise.* TO 'dreamuser'@'localhost';
FLUSH PRIVILEGES;
```

3. 设置后端：
```bash
cd dreamwise/backend
cp .env.example .env
# 编辑.env文件，设置数据库连接信息
npm install
```

4. 启动服务器：
```bash
node scripts/start-server.js
```

5. 创建测试用户：
```bash
node scripts/create-test-user.js
```

## 主要功能

- 用户认证（注册、登录、JWT）
- 梦境日记（记录、查看、编辑、删除）
- 社区平台（发帖、回复、互动）
- 多信仰梦境解析（基督教、伊斯兰教、佛教、印度教、犹太教）
- 个人资料和偏好设置

## 许可证

MIT