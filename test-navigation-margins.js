#!/usr/bin/env node

/**
 * 测试导航栏边距
 */

const fs = require('fs');

console.log('🔍 检查导航栏边距...');

try {
    // 读取index-new.html文件
    const content = fs.readFileSync('index-new.html', 'utf8');
    
    // 检查导航栏类
    const navClassRegex = /<nav class="([^"]+)"/;
    const match = content.match(navClassRegex);
    
    if (!match) {
        console.error('❌ 无法找到导航栏类');
        process.exit(1);
    }
    
    const navClasses = match[1];
    console.log('📋 导航栏类:', navClasses);
    
    // 检查边距类
    const hasMarginX = navClasses.includes('mx-4');
    const hasMarginTop = navClasses.includes('mt-4');
    const hasRounded = navClasses.includes('rounded-2xl');
    
    console.log('✅ 水平边距 (mx-4):', hasMarginX ? '已设置' : '未设置');
    console.log('✅ 顶部边距 (mt-4):', hasMarginTop ? '已设置' : '未设置');
    console.log('✅ 圆角 (rounded-2xl):', hasRounded ? '已设置' : '未设置');
    
    // 总结
    if (hasMarginX && hasMarginTop && hasRounded) {
        console.log('🎉 导航栏边距设置正确！');
    } else {
        console.log('⚠️ 导航栏边距设置不完整，可能需要调整。');
    }
    
} catch (error) {
    console.error('❌ 错误:', error.message);
    process.exit(1);
}