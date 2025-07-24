#!/usr/bin/env node

/**
 * 将index-new.html中的导航栏应用到index.html
 */

const fs = require('fs');

console.log('🚀 开始应用新的导航栏...');

try {
    // 读取文件
    const indexNewContent = fs.readFileSync('index-new.html', 'utf8');
    let indexContent = fs.readFileSync('index.html', 'utf8');
    
    // 提取新的导航栏代码
    const navStartMarker = '<!-- Navigation Header -->';
    const navEndMarker = '<!-- Hero Section -->';
    
    const navStartIndex = indexNewContent.indexOf(navStartMarker);
    const navEndIndex = indexNewContent.indexOf(navEndMarker);
    
    if (navStartIndex === -1 || navEndIndex === -1) {
        throw new Error('无法在index-new.html中找到导航栏标记');
    }
    
    const newNavCode = indexNewContent.substring(navStartIndex, navEndIndex);
    
    // 提取CSS样式
    const cssStartMarker = '<!-- CSS for the enhanced navigation -->';
    const cssEndMarker = '</style>';
    
    const cssStartIndex = indexNewContent.indexOf(cssStartMarker);
    let cssEndIndex = -1;
    
    if (cssStartIndex !== -1) {
        cssEndIndex = indexNewContent.indexOf(cssEndMarker, cssStartIndex);
        if (cssEndIndex !== -1) {
            cssEndIndex += cssEndMarker.length;
        }
    }
    
    const cssCode = cssStartIndex !== -1 && cssEndIndex !== -1 
        ? indexNewContent.substring(cssStartIndex, cssEndIndex)
        : '';
    
    // 提取JavaScript代码
    const jsStartMarker = '<!-- JavaScript for the enhanced navigation -->';
    const jsEndMarker = '</script>';
    
    const jsStartIndex = indexNewContent.indexOf(jsStartMarker);
    let jsEndIndex = -1;
    
    if (jsStartIndex !== -1) {
        jsEndIndex = indexNewContent.indexOf(jsEndMarker, jsStartIndex);
        if (jsEndIndex !== -1) {
            jsEndIndex += jsEndMarker.length;
        }
    }
    
    const jsCode = jsStartIndex !== -1 && jsEndIndex !== -1 
        ? indexNewContent.substring(jsStartIndex, jsEndIndex)
        : '';
    
    // 在index.html中查找位置
    const oldNavStartIndex = indexContent.indexOf(navStartMarker);
    const oldNavEndIndex = indexContent.indexOf(navEndMarker);
    
    if (oldNavStartIndex === -1 || oldNavEndIndex === -1) {
        throw new Error('无法在index.html中找到导航栏标记');
    }
    
    // 替换导航栏
    indexContent = 
        indexContent.substring(0, oldNavStartIndex) + 
        newNavCode + 
        indexContent.substring(oldNavEndIndex);
    
    // 添加CSS样式
    if (cssCode) {
        const headEndIndex = indexContent.indexOf('</head>');
        if (headEndIndex !== -1) {
            indexContent = 
                indexContent.substring(0, headEndIndex) + 
                cssCode + 
                indexContent.substring(headEndIndex);
        }
    }
    
    // 添加JavaScript代码
    if (jsCode) {
        const bodyEndIndex = indexContent.indexOf('</body>');
        if (bodyEndIndex !== -1) {
            indexContent = 
                indexContent.substring(0, bodyEndIndex) + 
                jsCode + 
                indexContent.substring(bodyEndIndex);
        }
    }
    
    // 写入更新后的文件
    fs.writeFileSync('index.html', indexContent);
    console.log('✅ 成功应用新的导航栏到index.html');
    
} catch (error) {
    console.error('❌ 错误:', error.message);
    process.exit(1);
}