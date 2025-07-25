# 🚨 安全修复指南 - API密钥泄露处理

## 问题描述
Resend API密钥被意外提交到GitHub仓库，需要立即处理。

## 紧急处理步骤

### 1. 立即撤销泄露的API密钥
1. 登录 [Resend Dashboard](https://resend.com/api-keys)
2. 找到并删除泄露的API密钥：`re_GUybAXRV_DcNYEC5bM6weuumHumdPaAzR`
3. 生成新的API密钥

### 2. 更新本地环境配置
在 `server_mysql/.env` 文件中设置新的API密钥：
```env
RESEND_API_KEY=your_new_api_key_here
FROM_EMAIL=DreamWise <noreply@charitydoing.com>
```

### 3. 清理Git历史（可选但推荐）
如果需要完全清理Git历史中的敏感信息：

```bash
# 使用git filter-branch清理历史
git filter-branch --force --index-filter \
  'git rm --cached --ignore-unmatch server_mysql/services/emailService.js' \
  --prune-empty --tag-name-filter cat -- --all

# 或者使用BFG Repo-Cleaner（更快）
# 1. 下载BFG: https://rtyley.github.io/bfg-repo-cleaner/
# 2. 运行清理命令
java -jar bfg.jar --replace-text passwords.txt
git reflog expire --expire=now --all && git gc --prune=now --aggressive
```

### 4. 强制推送更新（谨慎操作）
```bash
git push origin --force --all
git push origin --force --tags
```

## 预防措施

### 1. 更新.gitignore
确保敏感文件被忽略：
```gitignore
# Environment variables
.env
.env.local
.env.production

# API keys and secrets
**/config/secrets.js
**/config/keys.js
```

### 2. 使用环境变量
所有敏感配置都应该通过环境变量传递：
```javascript
// ✅ 正确做法
const apiKey = process.env.RESEND_API_KEY;

// ❌ 错误做法
const apiKey = 'hardcoded_key_here';
```

### 3. 代码审查
- 提交前检查是否包含敏感信息
- 使用pre-commit hooks检查敏感数据
- 定期审查代码库中的敏感信息

### 4. 使用密钥管理工具
考虑使用：
- AWS Secrets Manager
- HashiCorp Vault
- Azure Key Vault
- Google Secret Manager

## 当前状态
- ✅ 代码已修复，使用环境变量
- ⚠️ 需要撤销旧API密钥
- ⚠️ 需要设置新API密钥
- ⚠️ 考虑清理Git历史

## 测试新配置
1. 设置新的API密钥到.env文件
2. 重启服务器
3. 测试邮件发送功能
4. 确认一切正常工作

---
**重要提醒**: 永远不要将API密钥、密码或其他敏感信息提交到版本控制系统！