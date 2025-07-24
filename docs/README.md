# DreamWise - 梦境解析平台

## 项目概述

DreamWise是一个多信仰视角的梦境解析平台，提供基于不同宗教和文化背景的梦境解释。该平台包括梦境符号词典、个性化分析、博客文章和各种宗教视角的解释。

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

- HTML5
- CSS3 (使用Tailwind CSS框架)
- JavaScript
- 响应式设计，适配移动端和桌面端

## 主要功能

1. **多信仰梦境解析**：从基督教、伊斯兰教、佛教、印度教和犹太教视角解释梦境
2. **梦境符号词典**：按字母顺序和类别浏览梦境符号
3. **个性化分析**：基于用户输入提供个性化的梦境解析
4. **博客文章**：关于梦境的各种主题的深度文章
5. **热门符号**：最常见梦境符号的详细解释

## 开发指南

### 本地开发

1. 克隆仓库：`git clone https://github.com/yourusername/DreamWise.git`
2. 在浏览器中打开`index.html`或使用本地服务器

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

- **V1.1.0** - 多信仰视角升级，添加了5个宗教视角页面和个性化分析功能
- **V1.0.0** - 初始版本，基本梦境词典功能

## 贡献指南

1. Fork仓库
2. 创建功能分支：`git checkout -b feature/amazing-feature`
3. 提交更改：`git commit -m 'Add some amazing feature'`
4. 推送到分支：`git push origin feature/amazing-feature`
5. 提交Pull Request