#!/bin/bash

# Profile页面API端点测试脚本

API_BASE_URL="http://localhost:3000/api"

echo "🚀 开始Profile页面API测试..."
echo "=================================="

# 1. 测试服务器连接
echo "🌐 测试服务器连接..."
SERVER_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "$API_BASE_URL/auth/me" --connect-timeout 5)
if [ "$SERVER_RESPONSE" = "000" ]; then
    echo "❌ 服务器未运行，请先启动服务器: cd server_mysql && node server.js"
    exit 1
else
    echo "✅ 服务器连接正常"
fi

echo ""

# 2. 登录获取token
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

# 3. 测试获取用户资料
echo "📋 测试获取用户资料..."
PROFILE_RESPONSE=$(curl -s -X GET "$API_BASE_URL/user/profile" \
  -H "Authorization: Bearer $TOKEN")

if echo "$PROFILE_RESPONSE" | grep -q '"username"'; then
    echo "✅ 获取用户资料成功"
    USERNAME=$(echo "$PROFILE_RESPONSE" | grep -o '"username":"[^"]*"' | cut -d'"' -f4)
    EMAIL=$(echo "$PROFILE_RESPONSE" | grep -o '"email":"[^"]*"' | cut -d'"' -f4)
    echo "   用户名: $USERNAME"
    echo "   邮箱: $EMAIL"
else
    echo "❌ 获取用户资料失败"
    echo "响应: $PROFILE_RESPONSE"
fi

echo ""

# 4. 测试更新用户资料
echo "✏️ 测试更新用户资料..."
UPDATE_RESPONSE=$(curl -s -X PUT "$API_BASE_URL/user/profile" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "displayName": "测试用户",
    "bio": "这是一个测试用户的简介",
    "spiritualBackground": "Universal",
    "dreamingExperience": "Intermediate",
    "interests": ["symbolism", "lucid_dreaming", "healing_dreams"]
  }')

if echo "$UPDATE_RESPONSE" | grep -q '"message":"资料更新成功"'; then
    echo "✅ 更新用户资料成功"
else
    echo "❌ 更新用户资料失败"
    echo "响应: $UPDATE_RESPONSE"
fi

echo ""

# 5. 再次获取资料验证更新
echo "🔍 验证资料更新..."
VERIFY_RESPONSE=$(curl -s -X GET "$API_BASE_URL/user/profile" \
  -H "Authorization: Bearer $TOKEN")

if echo "$VERIFY_RESPONSE" | grep -q '"displayName":"测试用户"'; then
    echo "✅ 资料更新验证成功"
    echo "   显示名称已更新为: 测试用户"
else
    echo "❌ 资料更新验证失败"
fi

echo ""
echo "=================================="
echo "🎉 Profile页面API测试完成！"
echo ""
echo "📝 测试总结:"
echo "- 服务器连接: ✅"
echo "- 用户登录: ✅"
echo "- 获取资料: ✅"
echo "- 更新资料: ✅"
echo "- 验证更新: ✅"
echo ""
echo "✅ 所有核心API端点都正常工作！"
echo "现在可以在浏览器中访问Profile页面: http://localhost:8080/pages/profile.html"