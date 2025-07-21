# DreamWise 后端架构规划

## 🎯 目标
为DreamWise创建一个轻量级、高效的后端系统，支持核心商业功能。

## 🏗️ 技术栈建议

### 轻量级方案 (推荐)
```
前端: 静态HTML/CSS/JS
后端: Node.js + Express (或 Python + Flask)
数据库: SQLite (小规模) 或 MySQL (扩展性)
部署: 您的服务器 + PM2/Docker
```

### 为什么选择这个方案？
- **简单**: 最少的依赖和配置
- **快速**: 开发和部署都很快
- **经济**: 使用您现有的服务器
- **可扩展**: 未来可以轻松升级

## 📊 数据库设计

### 核心表结构
```sql
-- 用户表 (简化版)
CREATE TABLE users (
    id INTEGER PRIMARY KEY,
    email VARCHAR(255) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    subscription_type VARCHAR(50) DEFAULT 'free'
);

-- 梦境记录表
CREATE TABLE dreams (
    id INTEGER PRIMARY KEY,
    user_id INTEGER,
    title VARCHAR(255),
    content TEXT,
    symbols TEXT, -- JSON格式存储识别的符号
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Newsletter订阅表
CREATE TABLE newsletter_subscribers (
    id INTEGER PRIMARY KEY,
    email VARCHAR(255) UNIQUE,
    subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    active BOOLEAN DEFAULT TRUE
);

-- 符号统计表 (用于热门符号)
CREATE TABLE symbol_stats (
    symbol VARCHAR(100) PRIMARY KEY,
    view_count INTEGER DEFAULT 0,
    search_count INTEGER DEFAULT 0,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🔧 API设计

### 基础API端点
```javascript
// 用户相关
POST /api/auth/register     // 用户注册
POST /api/auth/login        // 用户登录
GET  /api/auth/profile      // 获取用户信息

// 梦境日记
GET    /api/dreams          // 获取用户梦境列表
POST   /api/dreams          // 添加新梦境
PUT    /api/dreams/:id      // 更新梦境
DELETE /api/dreams/:id      // 删除梦境

// AI分析 (未来功能)
POST /api/analyze           // 梦境AI分析

// Newsletter
POST /api/newsletter/subscribe   // 订阅Newsletter

// 统计 (匿名)
POST /api/stats/symbol-view     // 符号查看统计
GET  /api/stats/popular         // 获取热门符号
```

## 🚀 分阶段实现

### V1.2.0 - 基础后端
- [ ] 用户注册/登录系统
- [ ] 梦境日记CRUD功能
- [ ] Newsletter订阅功能
- [ ] 基础统计功能

### V1.3.0 - AI集成
- [ ] 集成AI分析API (OpenAI/Claude)
- [ ] 个性化梦境解释
- [ ] 梦境模式识别

### V2.0.0 - 高级功能
- [ ] 付费订阅系统
- [ ] 高级AI分析功能
- [ ] 用户社区功能

## 💰 成本分析

### 开发成本
- **时间**: 2-3周 (兼职开发)
- **复杂度**: 低-中等
- **维护**: 每月1-2小时

### 运营成本
- **服务器**: 您已有 (成本为0)
- **数据库**: SQLite免费，MySQL免费
- **AI API**: 按使用量付费 (初期很低)
- **邮件服务**: Mailchimp等 (免费额度够用)

## 🔒 安全考虑

### 数据保护
- 用户密码加密存储
- JWT token认证
- HTTPS强制使用
- 定期数据备份

### 隐私合规
- 最小化数据收集
- 用户数据删除功能
- 透明的隐私政策
- GDPR基础合规

## 🎯 商业价值

### 直接收益
- **付费订阅**: AI分析功能
- **广告优化**: 用户行为数据改善广告定位
- **邮件营销**: Newsletter推广高级功能

### 间接收益
- **用户粘性**: 个人数据让用户更难离开
- **数据洞察**: 了解用户需求，优化产品
- **品牌价值**: 专业的用户体验提升品牌形象

## 🤔 实施建议

### 现在就开始准备
1. **确定技术栈**: Node.js + SQLite 开始
2. **设计数据库**: 先实现核心表结构
3. **开发MVP**: 用户注册 + 梦境日记基础功能

### 渐进式开发
- 不要一次性开发所有功能
- 先实现核心价值功能
- 根据用户反馈迭代改进

---

**您觉得这个后端规划如何？我们可以从最简单的Newsletter订阅功能开始，逐步添加其他功能。**