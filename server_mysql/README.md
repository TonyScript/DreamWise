# DreamWise 后端 (MySQL 版本)

这是 DreamWise 梦境解析平台的后端服务器，使用 MySQL 数据库。

## 技术栈

- Node.js + Express
- MySQL 数据库
- Sequelize ORM
- JWT 认证
- RESTful API

## 安装和设置

### 前提条件

- Node.js (v14+)
- MySQL 服务器 (v8+)

### 安装 MySQL

在 macOS 上使用 Homebrew 安装 MySQL:

```bash
brew install mysql
```

启动 MySQL 服务:

```bash
brew services start mysql
```

设置 MySQL 的 root 密码:

```bash
mysql_secure_installation
```

### 创建数据库和用户

登录到 MySQL:

```bash
mysql -u root -p
```

创建数据库和用户:

```sql
CREATE DATABASE dreamwise;
CREATE USER 'dreamuser'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON dreamwise.* TO 'dreamuser'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### 安装项目依赖

```bash
cd server_mysql
npm install
```

### 配置环境变量

复制 `.env.example` 文件为 `.env`:

```bash
cp .env.example .env
```

编辑 `.env` 文件，设置您的数据库连接信息:

```
DB_HOST=localhost
DB_PORT=3306
DB_NAME=dreamwise
DB_USER=dreamuser
DB_PASSWORD=your_password
```

## 运行服务器

### 开发模式

```bash
npm run dev
```

### 生产模式

```bash
npm start
```

## 创建测试用户

运行以下命令创建测试用户:

```bash
node create-test-user.js
```

测试用户信息:
- 用户名: testuser
- 邮箱: test@example.com
- 密码: Password123

## API 端点

### 认证

- `POST /api/auth/register` - 注册新用户
- `POST /api/auth/login` - 用户登录
- `GET /api/auth/me` - 获取当前用户资料
- `POST /api/auth/refresh` - 刷新令牌
- `POST /api/auth/logout` - 用户登出
- `POST /api/auth/change-password` - 修改密码
- `POST /api/auth/forgot-password` - 请求密码重置
- `GET /api/auth/verify` - 验证令牌

### 梦境日记

- `GET /api/journal/my-dreams` - 获取当前用户的所有梦境
- `POST /api/journal` - 创建新梦境
- `GET /api/journal/:id` - 获取单个梦境详情
- `PUT /api/journal/:id` - 更新梦境
- `DELETE /api/journal/:id` - 删除梦境
- `GET /api/journal/stats/overview` - 获取梦境统计数据
- `GET /api/journal/search` - 搜索梦境

### 社区

- `GET /api/community` - 获取社区帖子列表
- `POST /api/community` - 创建新帖子
- `GET /api/community/:id` - 获取单个帖子详情
- `PUT /api/community/:id` - 更新帖子
- `DELETE /api/community/:id` - 删除帖子
- `PUT /api/community/:id/pin` - 置顶/取消置顶帖子
- `PUT /api/community/:id/feature` - 设置/取消精华帖子
- `GET /api/community/meta/categories` - 获取社区元数据
- `GET /api/community/search` - 搜索社区帖子

### 用户

- `GET /api/user/:id` - 获取用户公开资料
- `PUT /api/user/profile` - 更新当前用户资料
- `PUT /api/user/preferences` - 更新用户偏好设置
- `GET /api/user/:id/dreams` - 获取用户公开梦境
- `GET /api/user/:id/posts` - 获取用户公开帖子
- `GET /api/user` - 获取所有用户 (管理员)
- `PUT /api/user/:id/status` - 更新用户状态 (管理员)
- `PUT /api/user/:id/role` - 更新用户角色 (管理员)

## 许可证

MIT