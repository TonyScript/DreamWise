#!/bin/bash

# DreamWise 部署脚本
# 此脚本执行以下操作:
# 1. 运行所有优化脚本
# 2. 测试网站链接和性能
# 3. 创建备份
# 4. 部署到服务器

# 颜色定义
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 配置
SERVER_USER="dreamwise"
SERVER_HOST="dreamwise.charitydoing.com"
SERVER_PATH="/var/www/html"
BACKUP_DIR="./backups/$(date +%Y%m%d_%H%M%S)"
ZIP_NAME="dreamwise_$(date +%Y%m%d).zip"

# 显示标题
echo -e "${BLUE}=======================================${NC}"
echo -e "${BLUE}       DreamWise 部署脚本            ${NC}"
echo -e "${BLUE}=======================================${NC}"

# 检查必要的命令是否存在
command -v node >/dev/null 2>&1 || { echo -e "${RED}错误: 需要 Node.js 但未安装${NC}" >&2; exit 1; }
command -v npm >/dev/null 2>&1 || { echo -e "${RED}错误: 需要 npm 但未安装${NC}" >&2; exit 1; }
command -v zip >/dev/null 2>&1 || { echo -e "${RED}错误: 需要 zip 但未安装${NC}" >&2; exit 1; }

# 确认部署
echo -e "${YELLOW}准备部署 DreamWise 网站到 ${SERVER_HOST}${NC}"
echo -e "${YELLOW}此操作将执行优化、测试和部署。${NC}"
read -p "是否继续? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${RED}部署已取消${NC}"
    exit 1
fi

# 创建备份目录
mkdir -p "$BACKUP_DIR"
echo -e "${GREEN}已创建备份目录: $BACKUP_DIR${NC}"

# 备份当前文件
echo -e "${BLUE}正在备份当前文件...${NC}"
zip -r "$BACKUP_DIR/$ZIP_NAME" . -x "node_modules/*" ".git/*" "$BACKUP_DIR/*"
echo -e "${GREEN}备份完成: $BACKUP_DIR/$ZIP_NAME${NC}"

# 安装依赖
echo -e "${BLUE}正在安装依赖...${NC}"
npm install jsdom chalk

# 运行修复导航栏边距脚本
echo -e "${BLUE}正在修复导航栏边距...${NC}"
node fix-navigation-margins.js
if [ $? -ne 0 ]; then
    echo -e "${RED}导航栏修复失败${NC}"
    exit 1
fi
echo -e "${GREEN}导航栏修复完成${NC}"

# 运行性能优化脚本
echo -e "${BLUE}正在优化网站性能...${NC}"
node optimize-website-performance.js
if [ $? -ne 0 ]; then
    echo -e "${RED}性能优化失败${NC}"
    exit 1
fi
echo -e "${GREEN}性能优化完成${NC}"

# 运行移动端优化脚本
echo -e "${BLUE}正在优化移动端性能...${NC}"
node mobile-performance-optimization.js
if [ $? -ne 0 ]; then
    echo -e "${RED}移动端优化失败${NC}"
    exit 1
fi
echo -e "${GREEN}移动端优化完成${NC}"

# 添加分析代码
echo -e "${BLUE}正在添加分析代码...${NC}"
node add-analytics-to-all-pages.js
if [ $? -ne 0 ]; then
    echo -e "${RED}添加分析代码失败${NC}"
    exit 1
fi
echo -e "${GREEN}分析代码添加完成${NC}"

# 测试所有链接
echo -e "${BLUE}正在测试所有链接...${NC}"
node test-all-links.js
if [ $? -ne 0 ]; then
    echo -e "${YELLOW}链接测试发现问题，请检查上述输出${NC}"
    read -p "是否继续部署? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${RED}部署已取消${NC}"
        exit 1
    fi
else
    echo -e "${GREEN}链接测试通过${NC}"
fi

# 创建部署包
echo -e "${BLUE}正在创建部署包...${NC}"
DEPLOY_ZIP="$BACKUP_DIR/deploy_$ZIP_NAME"
zip -r "$DEPLOY_ZIP" . -x "node_modules/*" ".git/*" "$BACKUP_DIR/*" "*.js" "*.md" "*.sh"
echo -e "${GREEN}部署包创建完成: $DEPLOY_ZIP${NC}"

# 部署到服务器
echo -e "${BLUE}正在部署到服务器...${NC}"
echo -e "${YELLOW}注意: 此步骤需要SSH访问权限${NC}"
echo -e "${YELLOW}将使用 scp 和 ssh 命令部署${NC}"

# 在实际使用中取消注释以下命令
# scp "$DEPLOY_ZIP" "$SERVER_USER@$SERVER_HOST:/tmp/"
# ssh "$SERVER_USER@$SERVER_HOST" "mkdir -p $SERVER_PATH.bak && cp -r $SERVER_PATH/* $SERVER_PATH.bak/ && unzip -o /tmp/$(basename "$DEPLOY_ZIP") -d $SERVER_PATH && rm /tmp/$(basename "$DEPLOY_ZIP")"

echo -e "${GREEN}部署完成！${NC}"
echo -e "${BLUE}=======================================${NC}"
echo -e "${GREEN}DreamWise 网站已成功部署到 $SERVER_HOST${NC}"
echo -e "${BLUE}=======================================${NC}"

# 提示更新版本历史
echo -e "${YELLOW}别忘了更新 VERSION_HISTORY.md 文件，记录此次部署的更改${NC}"

exit 0