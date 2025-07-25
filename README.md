# DreamWise - 梦境解析平台

## 项目概述

DreamWise是一个现代化的多信仰视角梦境解析平台，提供基于不同宗教和文化背景的梦境解释。该平台包括梦境符号词典、个性化分析、博客文章、用户系统和各种宗教视角的解释。

### 🌟 最新功能 (V1.2.0)
- **用户认证系统** - 完整的注册、登录、个人资料管理
- **头像上传功能** - 支持用户自定义头像，完整的文件管理
- **梦境日记系统** - 用户可以记录和管理个人梦境
- **社区功能** - 用户互动、梦境分享和讨论
- **通知系统** - 优雅的玻璃风格通知，不阻塞UI
- **MySQL数据库支持** - 完整的后端数据存储
- **CORS优化** - 解决跨域资源访问问题

## 项目结构

```
.
├── index.html              # 网站首页
├── assets/                 # 静态资源文件夹
│   ├── css/                # CSS样式文件
│   ├── js/                 # JavaScript文件
│   ├── images/             # 图片资源
│   └── components/         # 可复用组件
├── pages/                  # 网站页面
│   ├── faith/              # 信仰视角页面
│   │   ├── christian-dreams.html
│   │   ├── islamic-dreams.html
│   │   ├── buddhist-dreams.html
│   │   ├── hindu-dreams.html
│   │   ├── jewish-dreams.html
│   │   ├── faith-perspectives.html
│   │   └── multi-faith-analysis.html
│   ├── blog/               # 博客文章
│   │   ├── dream-blog.html # 博客主页
│   │   └── blog-*.html     # 各种博客文章
│   ├── guides/             # 指南页面
│   │   ├── dream-guides.html # 指南主页
│   │   └── guide-*.html    # 各种指南文章
│   ├── about.html          # 关于我们
│   ├── browse.html         # 浏览梦境符号
│   ├── categories.html     # 梦境分类
│   ├── contact.html        # 联系我们
│   ├── faq.html            # 常见问题
│   ├── insights.html       # 梦境洞察
│   ├── personalized.html   # 个性化分析
│   ├── popular-symbols.html # 热门符号
│   ├── community.html      # 社区页面
│   ├── expert-interpretations.html # 专家解析
│   ├── help-center.html    # 帮助中心
│   ├── spiritual-meanings.html # 精神意义
│   ├── symbol-library.html # 符号库
│   ├── privacy-policy.html # 隐私政策
│   ├── terms-of-service.html # 服务条款
│   └── dream-journal.html  # 梦境日记
├── scripts/                # 脚本文件
│   ├── deployment/         # 部署脚本
│   ├── optimization/       # 优化脚本
│   └── utils/              # 工具脚本
├── docs/                   # 项目文档
└── temp/                   # 临时文件
```

## 技术栈

### 前端
- HTML5
- CSS3 (使用Tailwind CSS框架)
- JavaScript (ES6+)
- 响应式设计，适配移动端和桌面端
- 玻璃拟态设计风格

### 后端 (V1.2.0新增)
- Node.js + Express.js
- MySQL数据库
- Sequelize ORM
- JWT身份验证
- Multer文件上传
- CORS跨域支持
- Helmet安全中间件

## 主要功能

### 核心功能
1. **多信仰梦境解析**：从基督教、伊斯兰教、佛教、印度教和犹太教视角解释梦境
2. **梦境符号词典**：按字母顺序和类别浏览梦境符号
3. **个性化分析**：基于用户输入提供个性化的梦境解析
4. **博客文章**：关于梦境的各种主题的深度文章
5. **热门符号**：最常见梦境符号的详细解释

### 用户系统 (V1.2.0)
6. **用户注册/登录**：安全的JWT身份验证系统
7. **个人资料管理**：头像上传、个人信息编辑
8. **梦境日记**：记录、编辑和管理个人梦境
9. **社区互动**：用户间的梦境分享和讨论
10. **通知系统**：实时反馈和状态更新

## 开发指南

### 本地开发

#### 前端开发
1. 克隆仓库：`git clone https://github.com/TonyScript/DreamWise.git`
2. 在浏览器中打开`index.html`或使用本地服务器

#### 后端开发 (V1.2.0)
1. 进入后端目录：`cd server_mysql`
2. 安装依赖：`npm install`
3. 配置环境变量：复制`.env.example`到`.env`并填写数据库配置
4. 初始化数据库：`npm run init-db`
5. 启动服务器：`npm start`

#### 完整开发环境
1. 启动后端服务器（端口3000）
2. 启动前端服务器（端口8000或8080）
3. 访问 http://localhost:8000 开始开发

### 文件组织

- 所有HTML页面位于`pages`目录中，按功能分类
- 静态资源（CSS、JavaScript、图片）位于`assets`目录中
- 开发和部署脚本位于`scripts`目录中

### 部署

使用`scripts/deployment`目录中的脚本进行部署：

```bash
node scripts/deployment/prepare-deployment.js
node scripts/deployment/upload-to-server.js
```

## 项目整理工具

本项目包含两个整理工具脚本：

1. **organize-project.js** - 重组项目文件结构，创建更有组织的目录结构
   ```bash
   node organize-project.js
   ```

2. **clean-github-repo.js** - 从Git仓库中移除不必要的文件，但保留在本地
   ```bash
   node clean-github-repo.js
   ```

## 版本历史

- **V1.2.0** (当前) - 用户系统和后端集成
  - 完整的用户认证系统
  - 头像上传和个人资料管理
  - 梦境日记功能
  - 社区互动系统
  - MySQL数据库支持
  - 通知系统优化
  - CORS和安全性改进

- **V1.1.0** - 多信仰视角升级
  - 添加了5个宗教视角页面
  - 个性化分析功能
  - 导航系统优化
  - 移动端性能优化

- **V1.0.0** - 初始版本
  - 基本梦境词典功能
  - 响应式设计
  - SEO优化基础

## 贡献指南

1. Fork仓库
2. 创建功能分支：`git checkout -b feature/amazing-feature`
3. 提交更改：`git commit -m 'Add some amazing feature'`
4. 推送到分支：`git push origin feature/amazing-feature`
5. 提交Pull Request