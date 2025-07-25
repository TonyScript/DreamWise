#!/bin/bash

# 头像上传测试脚本

API_BASE_URL="http://localhost:3000/api"

echo "🖼️ 开始头像上传测试..."
echo "=================================="

# 1. 登录获取token
echo "🔐 正在登录..."
LOGIN_RESPONSE=$(curl -s -X POST "$API_BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Password123"}')

TOKEN=$(echo "$LOGIN_RESPONSE" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
    echo "❌ 登录失败"
    echo "响应: $LOGIN_RESPONSE"
    exit 1
else
    echo "✅ 登录成功"
fi

echo ""

# 2. 创建一个测试图片文件
echo "🎨 创建测试图片..."
# 创建一个简单的1x1像素的PNG图片
echo -n -e '\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x08\x02\x00\x00\x00\x90wS\xde\x00\x00\x00\tpHYs\x00\x00\x0b\x13\x00\x00\x0b\x13\x01\x00\x9a\x9c\x18\x00\x00\x00\nIDATx\x9cc\xf8\x00\x00\x00\x01\x00\x01\x00\x00\x00\x00IEND\xaeB`\x82' > test-avatar.png

if [ -f "test-avatar.png" ]; then
    echo "✅ 测试图片创建成功"
else
    echo "❌ 测试图片创建失败"
    exit 1
fi

echo ""

# 3. 测试头像上传
echo "📤 测试头像上传..."
UPLOAD_RESPONSE=$(curl -s -X POST "$API_BASE_URL/user/upload-avatar" \
  -H "Authorization: Bearer $TOKEN" \
  -F "avatar=@test-avatar.png")

if echo "$UPLOAD_RESPONSE" | grep -q '"message":"头像上传成功"'; then
    echo "✅ 头像上传成功"
    AVATAR_PATH=$(echo "$UPLOAD_RESPONSE" | grep -o '"avatar":"[^"]*"' | cut -d'"' -f4)
    echo "   头像路径: $AVATAR_PATH"
    
    # 4. 测试头像访问
    echo ""
    echo "🔍 测试头像访问..."
    AVATAR_URL="http://localhost:3000$AVATAR_PATH"
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$AVATAR_URL")
    
    if [ "$HTTP_CODE" = "200" ]; then
        echo "✅ 头像文件可以正常访问"
        echo "   访问URL: $AVATAR_URL"
    else
        echo "❌ 头像文件无法访问 (HTTP $HTTP_CODE)"
        echo "   访问URL: $AVATAR_URL"
    fi
else
    echo "❌ 头像上传失败"
    echo "响应: $UPLOAD_RESPONSE"
fi

echo ""

# 5. 清理测试文件
echo "🧹 清理测试文件..."
rm -f test-avatar.png
echo "✅ 清理完成"

echo ""
echo "=================================="
echo "🎉 头像上传测试完成！"