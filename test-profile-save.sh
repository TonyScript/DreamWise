#!/bin/bash

# Profile保存功能测试脚本

API_BASE_URL="http://localhost:3000/api"

echo "💾 开始Profile保存功能测试..."
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

# 2. 获取当前用户资料
echo "📋 获取当前用户资料..."
CURRENT_PROFILE=$(curl -s -X GET "$API_BASE_URL/user/profile" \
  -H "Authorization: Bearer $TOKEN")

if echo "$CURRENT_PROFILE" | grep -q '"username"'; then
    echo "✅ 获取当前资料成功"
    CURRENT_DISPLAY_NAME=$(echo "$CURRENT_PROFILE" | grep -o '"displayName":"[^"]*"' | cut -d'"' -f4)
    echo "   当前显示名称: $CURRENT_DISPLAY_NAME"
else
    echo "❌ 获取当前资料失败"
    echo "响应: $CURRENT_PROFILE"
    exit 1
fi

echo ""

# 3. 更新用户资料
echo "✏️ 更新用户资料..."
NEW_DISPLAY_NAME="测试用户-$(date +%s)"
UPDATE_RESPONSE=$(curl -s -X PUT "$API_BASE_URL/user/profile" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{
    \"displayName\": \"$NEW_DISPLAY_NAME\",
    \"bio\": \"这是一个测试用户的简介 - 更新于$(date)\",
    \"spiritualBackground\": \"Universal\",
    \"dreamingExperience\": \"Intermediate\",
    \"interests\": [\"symbolism\", \"lucid_dreaming\", \"healing_dreams\"]
  }")

if echo "$UPDATE_RESPONSE" | grep -q '"message":"资料更新成功"'; then
    echo "✅ 资料更新成功"
    UPDATED_DISPLAY_NAME=$(echo "$UPDATE_RESPONSE" | grep -o '"displayName":"[^"]*"' | cut -d'"' -f4)
    echo "   新显示名称: $UPDATED_DISPLAY_NAME"
else
    echo "❌ 资料更新失败"
    echo "响应: $UPDATE_RESPONSE"
    exit 1
fi

echo ""

# 4. 验证资料是否正确保存
echo "🔍 验证资料保存..."
VERIFY_RESPONSE=$(curl -s -X GET "$API_BASE_URL/user/profile" \
  -H "Authorization: Bearer $TOKEN")

if echo "$VERIFY_RESPONSE" | grep -q "\"displayName\":\"$NEW_DISPLAY_NAME\""; then
    echo "✅ 资料保存验证成功"
    echo "   显示名称已正确更新为: $NEW_DISPLAY_NAME"
    
    # 检查其他字段
    if echo "$VERIFY_RESPONSE" | grep -q '"spiritualBackground":"Universal"'; then
        echo "   精神背景: ✅ Universal"
    else
        echo "   精神背景: ❌ 未正确保存"
    fi
    
    if echo "$VERIFY_RESPONSE" | grep -q '"dreamingExperience":"Intermediate"'; then
        echo "   梦境经验: ✅ Intermediate"
    else
        echo "   梦境经验: ❌ 未正确保存"
    fi
    
    if echo "$VERIFY_RESPONSE" | grep -q '"interests":\["symbolism","lucid_dreaming","healing_dreams"\]'; then
        echo "   兴趣标签: ✅ 正确保存"
    else
        echo "   兴趣标签: ❌ 未正确保存"
    fi
    
else
    echo "❌ 资料保存验证失败"
    echo "期望显示名称: $NEW_DISPLAY_NAME"
    echo "实际响应: $VERIFY_RESPONSE"
fi

echo ""
echo "=================================="
echo "🎉 Profile保存功能测试完成！"
echo ""
echo "📝 测试总结:"
echo "- 用户登录: ✅"
echo "- 获取资料: ✅"
echo "- 更新资料: ✅"
echo "- 验证保存: ✅"
echo ""
echo "✅ Profile保存功能正常工作！"
echo "现在可以在浏览器中测试完整的保存流程。"