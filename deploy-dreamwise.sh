#!/bin/bash

# DreamWise 一键部署脚本
# 作者: Kiro
# 日期: 2025-07-21

# 颜色定义
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 服务器信息
SERVER_IP="172.245.62.112"
SERVER_USER="root"
REMOTE_DIR="/opt/dreamwise"
SSH_PORT="22"

# 本地信息
LOCAL_ZIP="dreamwise-update.zip"
REMOTE_ZIP="/root/${LOCAL_ZIP}"

# 显示带颜色的消息
echo_message() {
  local color=$1
  local message=$2
  echo -e "${color}${message}${NC}"
}

# 显示进度条
show_progress() {
  local pid=$1
  local delay=0.1
  local spinstr='|/-\'
  
  echo -n "处理中 "
  while [ "$(ps a | awk '{print $1}' | grep $pid)" ]; do
    local temp=${spinstr#?}
    printf " [%c]  " "$spinstr"
    local spinstr=$temp${spinstr%"$temp"}
    sleep $delay
    printf "\b\b\b\b\b\b"
  done
  printf "    \b\b\b\b"
}

# 检查命令是否存在
check_command() {
  if ! command -v $1 &> /dev/null; then
    echo_message $RED "错误: 找不到命令 '$1'。请安装后再试。"
    exit 1
  fi
}

# 检查必要的命令
check_command zip
check_command ssh
check_command scp

# 开始部署
echo_message $BLUE "===== DreamWise 网站部署脚本 ====="
echo_message $BLUE "服务器: ${SERVER_IP}"
echo_message $BLUE "远程目录: ${REMOTE_DIR}"
echo ""

# 步骤 1: 打包项目文件
echo_message $YELLOW "步骤 1: 打包项目文件..."
if [ -f "$LOCAL_ZIP" ]; then
  rm "$LOCAL_ZIP"
fi

# 排除更多不必要的文件
zip -r "$LOCAL_ZIP" . \
  -x "*.git*" \
  -x "node_modules/*" \
  -x "*.DS_Store" \
  -x "deploy-dreamwise.sh" \
  -x "*.zip" \
  -x "*.md" \
  -x "*test*.js" \
  -x "*fix-*.js" \
  -x "*update-*.js" \
  -x "prepare-deployment.js" \
  -x "upload-to-server.js" \
  -x "*.bak" \
  -x "*.log" \
  -x "*.tmp" \
  -x "BROWSE_PAGE_*.md" \
  -x "FOOTER_*.md" \
  -x "PROBLEM_*.md" \
  -x "RESOURCES_*.md" \
  -x "TITLE_*.md" \
  -x "EXPERT_*.md" \
  -x "FACEBOOK_*.md" \
  -x "INSIGHTS_*.md" &
pid=$!
show_progress $pid
wait $pid

if [ $? -ne 0 ]; then
  echo_message $RED "打包失败，请检查错误信息。"
  exit 1
fi
echo_message $GREEN "打包完成: $LOCAL_ZIP"

# 步骤 2: 上传到服务器
echo_message $YELLOW "步骤 2: 上传文件到服务器..."
scp -P $SSH_PORT "$LOCAL_ZIP" ${SERVER_USER}@${SERVER_IP}:${REMOTE_ZIP} &
pid=$!
show_progress $pid
wait $pid

if [ $? -ne 0 ]; then
  echo_message $RED "上传失败，请检查网络连接和服务器状态。"
  exit 1
fi
echo_message $GREEN "上传完成"

# 步骤 3: 在服务器上部署
echo_message $YELLOW "步骤 3: 在服务器上部署..."
ssh -p $SSH_PORT ${SERVER_USER}@${SERVER_IP} << 'ENDSSH'
# 设置变量
REMOTE_DIR="/opt/dreamwise"
REMOTE_ZIP="/root/dreamwise-update.zip"
BACKUP_DIR="/opt/backups/dreamwise"
DATE=$(date +%Y%m%d-%H%M%S)

# 创建备份目录
mkdir -p $BACKUP_DIR

# 停止当前容器
cd $REMOTE_DIR
docker-compose down

# 备份当前版本
echo "备份当前版本..."
tar -czf $BACKUP_DIR/pre-update-$DATE.tar.gz -C $REMOTE_DIR .

# 清空当前目录（保留docker-compose.yml, Dockerfile和nginx.conf）
echo "保存关键配置文件..."
cp $REMOTE_DIR/docker-compose.yml /tmp/docker-compose.yml.bak
cp $REMOTE_DIR/Dockerfile /tmp/Dockerfile.bak
cp $REMOTE_DIR/nginx.conf /tmp/nginx.conf.bak
cp $REMOTE_DIR/.dockerignore /tmp/.dockerignore.bak 2>/dev/null || true

# 清空目录并解压新版本
echo "解压新版本..."
rm -rf $REMOTE_DIR/*
unzip -o $REMOTE_ZIP -d $REMOTE_DIR

# 恢复关键配置文件
echo "恢复关键配置文件..."
cp /tmp/docker-compose.yml.bak $REMOTE_DIR/docker-compose.yml
cp /tmp/Dockerfile.bak $REMOTE_DIR/Dockerfile
cp /tmp/nginx.conf.bak $REMOTE_DIR/nginx.conf
[ -f /tmp/.dockerignore.bak ] && cp /tmp/.dockerignore.bak $REMOTE_DIR/.dockerignore

# 确保Dockerfile包含权限修复
if ! grep -q "chmod -R 755" $REMOTE_DIR/Dockerfile; then
  echo "更新Dockerfile以修复权限问题..."
  sed -i '/COPY nginx.conf/a # 修复权限问题\nRUN chmod -R 755 /usr/share/nginx/html && \\\n    find /usr/share/nginx/html -type f -exec chmod 644 {} \\; && \\\n    chown -R nginx:nginx /usr/share/nginx/html' $REMOTE_DIR/Dockerfile
fi

# 重新构建并启动容器
echo "重新构建并启动容器..."
cd $REMOTE_DIR
docker-compose up -d --build

# 等待容器启动
echo "等待容器启动..."
sleep 5

# 检查容器状态
if docker ps | grep -q dreamwise-web; then
  echo "容器已成功启动"
else
  echo "警告: 容器可能未正确启动，请检查日志"
fi

# 清理临时文件
echo "清理临时文件..."
rm $REMOTE_ZIP
ENDSSH

if [ $? -ne 0 ]; then
  echo_message $RED "部署失败，请检查SSH连接和服务器日志。"
  exit 1
fi

# 步骤 4: 验证部署
echo_message $YELLOW "步骤 4: 验证部署..."
ssh -p $SSH_PORT ${SERVER_USER}@${SERVER_IP} << 'ENDSSH'
# 检查网站是否可访问
echo "检查网站是否可访问..."
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8300)
if [ "$HTTP_CODE" = "200" ]; then
  echo "网站可以正常访问 (HTTP 200 OK)"
else
  echo "警告: 网站返回HTTP状态码 $HTTP_CODE"
  
  # 检查错误日志
  echo "检查Nginx错误日志..."
  docker exec dreamwise-web cat /var/log/nginx/error.log | tail -10
  
  # 尝试修复权限
  echo "尝试修复权限问题..."
  docker exec dreamwise-web chmod -R 755 /usr/share/nginx/html
  docker exec dreamwise-web find /usr/share/nginx/html -type f -exec chmod 644 {} \;
  docker exec dreamwise-web chown -R nginx:nginx /usr/share/nginx/html
  
  # 重新加载Nginx
  docker exec dreamwise-web nginx -s reload
  
  # 再次检查
  sleep 2
  HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8300)
  if [ "$HTTP_CODE" = "200" ]; then
    echo "修复成功，网站现在可以正常访问"
  else
    echo "警告: 修复后网站仍返回HTTP状态码 $HTTP_CODE"
  fi
fi

# 显示容器状态
echo "容器状态:"
docker ps | grep dreamwise-web
ENDSSH

# 清理本地临时文件
echo_message $YELLOW "清理本地临时文件..."
rm "$LOCAL_ZIP"

echo ""
echo_message $GREEN "===== 部署完成 ====="
echo_message $GREEN "DreamWise 网站已成功更新到服务器"
echo_message $BLUE "你可以通过以下地址访问网站:"
echo_message $BLUE "http://${SERVER_IP}:8300"
echo ""
echo_message $YELLOW "提示: 如果网站无法访问，请检查服务器防火墙设置和容器日志"
echo_message $YELLOW "      docker logs dreamwise-web"
echo ""