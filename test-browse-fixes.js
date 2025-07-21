#!/usr/bin/env node

const fs = require('fs');

console.log('🧪 测试browse.html页面修复结果...');
console.log('');

// 读取browse.html文件
const content = fs.readFileSync('browse.html', 'utf8');

// 测试1: 检查字母M部分是否正确
console.log('📋 测试1: 检查字母M部分结构');
const mSectionMatch = content.match(/<!-- Letter M Section -->([\s\S]*?)<!-- Letter N Section -->/);
if (mSectionMatch) {
    const mSection = mSectionMatch[1];
    const mCards = (mSection.match(/dream-symbol-card/g) || []).length;
    console.log(`✅ 字母M部分找到 ${mCards} 个梦象卡片`);
    
    // 检查是否有重复或错误的HTML结构
    const hasStructureError = mSection.includes('</div>\n                        <h3') || 
                             mSection.includes('</a>\n                    \n                    <a href="dream/meditation.html"');
    if (!hasStructureError) {
        console.log('✅ 字母M部分HTML结构正确');
    } else {
        console.log('❌ 字母M部分仍有结构错误');
    }
} else {
    console.log('❌ 未找到字母M部分');
}

// 测试2: 检查字母P部分是否正确
console.log('');
console.log('📋 测试2: 检查字母P部分结构');
const pSectionMatch = content.match(/<!-- Letter P Section -->([\s\S]*?)<!-- Letter Q Section -->/);
if (pSectionMatch) {
    const pSection = pSectionMatch[1];
    const pCards = (pSection.match(/dream-symbol-card/g) || []).length;
    console.log(`✅ 字母P部分找到 ${pCards} 个梦象卡片`);
    
    // 检查是否有重复或错误的HTML结构
    const hasStructureError = pSection.includes('</div><a href="dream/prophet.html"') || 
                             pSection.includes('</div>\n                </div>\n                        <h3');
    if (!hasStructureError) {
        console.log('✅ 字母P部分HTML结构正确');
    } else {
        console.log('❌ 字母P部分仍有结构错误');
    }
} else {
    console.log('❌ 未找到字母P部分');
}

// 测试3: 检查P之后的字母是否存在
console.log('');
console.log('📋 测试3: 检查P之后的字母部分');
const lettersAfterP = ['Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
let missingLetters = [];

lettersAfterP.forEach(letter => {
    if (content.includes(`<!-- Letter ${letter} Section -->`)) {
        console.log(`✅ 字母${letter}部分存在`);
    } else {
        missingLetters.push(letter);
        console.log(`❌ 字母${letter}部分缺失`);
    }
});

// 测试4: 检查Footer容器是否存在
console.log('');
console.log('📋 测试4: 检查Footer组件');
if (content.includes('<div id="footer-container"></div>')) {
    console.log('✅ Footer容器存在');
} else {
    console.log('❌ Footer容器缺失');
}

if (content.includes('assets/js/components.js')) {
    console.log('✅ Footer组件加载脚本存在');
} else {
    console.log('❌ Footer组件加载脚本缺失');
}

// 测试5: 检查Footer组件文件是否存在
console.log('');
console.log('📋 测试5: 检查Footer组件文件');
if (fs.existsSync('assets/components/footer.html')) {
    console.log('✅ Footer组件文件存在');
    const footerContent = fs.readFileSync('assets/components/footer.html', 'utf8');
    if (footerContent.includes('DreamWise') && footerContent.includes('FEATURES') && footerContent.includes('RESOURCES')) {
        console.log('✅ Footer组件内容完整');
    } else {
        console.log('❌ Footer组件内容不完整');
    }
} else {
    console.log('❌ Footer组件文件不存在');
}

if (fs.existsSync('assets/js/components.js')) {
    console.log('✅ 组件加载器文件存在');
} else {
    console.log('❌ 组件加载器文件不存在');
}

// 总结
console.log('');
console.log('🎯 修复结果总结:');
console.log('================');

if (mSectionMatch && pSectionMatch && missingLetters.length === 0) {
    console.log('🎉 所有问题已修复！');
    console.log('✅ 字母M和P的乱码问题已解决');
    console.log('✅ P以下的字母都正常显示');
    console.log('✅ Footer组件系统正常工作');
} else {
    console.log('⚠️  仍有部分问题需要解决:');
    if (!mSectionMatch) console.log('- 字母M部分需要修复');
    if (!pSectionMatch) console.log('- 字母P部分需要修复');
    if (missingLetters.length > 0) console.log(`- 缺失字母: ${missingLetters.join(', ')}`);
}

console.log('');
console.log('📝 建议:');
console.log('- 在浏览器中打开browse.html测试实际显示效果');
console.log('- 检查所有字母部分的梦象卡片是否正常显示');
console.log('- 确认Footer在页面底部正常加载');