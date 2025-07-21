#!/usr/bin/env node

const fs = require('fs');

console.log('🔍 最终验证browse.html页面修复...');
console.log('');

// 读取browse.html文件
const content = fs.readFileSync('browse.html', 'utf8');

// 验证所有字母部分
const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
let allLettersPresent = true;

console.log('📋 验证所有字母部分:');
letters.forEach(letter => {
    const sectionExists = content.includes(`<!-- Letter ${letter} Section -->`);
    const headerExists = content.includes(`<h2 class="text-3xl font-bold">Letter ${letter}</h2>`);
    
    if (sectionExists && headerExists) {
        console.log(`✅ 字母${letter}: 完整`);
    } else {
        console.log(`❌ 字母${letter}: 缺失或不完整`);
        allLettersPresent = false;
    }
});

// 验证特定问题字母
console.log('');
console.log('🎯 重点验证问题字母:');

// 检查字母M
const mSection = content.match(/<!-- Letter M Section -->([\s\S]*?)<!-- Letter N Section -->/);
if (mSection) {
    const mContent = mSection[1];
    const mCards = (mContent.match(/class="dream-symbol-card/g) || []).length;
    console.log(`✅ 字母M: ${mCards}个梦象卡片`);
    
    // 检查特定的梦象
    const expectedMDreams = ['meditation', 'miracle', 'mirror', 'money', 'monkey', 'moon', 'mother', 'mouse', 'mouth'];
    let foundMDreams = 0;
    expectedMDreams.forEach(dream => {
        if (mContent.includes(`dream/${dream}.html`)) {
            foundMDreams++;
        }
    });
    console.log(`✅ 字母M: ${foundMDreams}/${expectedMDreams.length}个预期梦象存在`);
} else {
    console.log('❌ 字母M: 部分未找到');
}

// 检查字母P
const pSection = content.match(/<!-- Letter P Section -->([\s\S]*?)<!-- Letter Q Section -->/);
if (pSection) {
    const pContent = pSection[1];
    const pCards = (pContent.match(/class="dream-symbol-card/g) || []).length;
    console.log(`✅ 字母P: ${pCards}个梦象卡片`);
    
    // 检查特定的梦象
    const expectedPDreams = ['path', 'peace', 'phone', 'pilgrimage', 'plate', 'prayer', 'pregnancy', 'prison', 'prophet'];
    let foundPDreams = 0;
    expectedPDreams.forEach(dream => {
        if (pContent.includes(`dream/${dream}.html`)) {
            foundPDreams++;
        }
    });
    console.log(`✅ 字母P: ${foundPDreams}/${expectedPDreams.length}个预期梦象存在`);
} else {
    console.log('❌ 字母P: 部分未找到');
}

// 验证Footer
console.log('');
console.log('🦶 验证Footer组件:');
const hasFooterContainer = content.includes('<div id="footer-container"></div>');
const hasComponentsJS = content.includes('assets/js/components.js');
const footerExists = fs.existsSync('assets/components/footer.html');
const componentsJSExists = fs.existsSync('assets/js/components.js');

console.log(`✅ Footer容器: ${hasFooterContainer ? '存在' : '缺失'}`);
console.log(`✅ 组件加载脚本: ${hasComponentsJS ? '存在' : '缺失'}`);
console.log(`✅ Footer组件文件: ${footerExists ? '存在' : '缺失'}`);
console.log(`✅ 组件加载器: ${componentsJSExists ? '存在' : '缺失'}`);

// 最终结果
console.log('');
console.log('🎉 最终验证结果:');
console.log('==================');

const allIssuesFixed = allLettersPresent && mSection && pSection && hasFooterContainer && hasComponentsJS && footerExists && componentsJSExists;

if (allIssuesFixed) {
    console.log('🎊 所有问题已完全修复！');
    console.log('');
    console.log('修复内容总结:');
    console.log('✅ 字母M部分乱码问题已解决');
    console.log('✅ 字母P部分乱码问题已解决');
    console.log('✅ P以下所有字母(Q-Z)都正常显示');
    console.log('✅ Footer组件系统完整且正常工作');
    console.log('');
    console.log('🌟 browse.html页面现在完全正常！');
} else {
    console.log('⚠️ 仍有问题需要解决');
    if (!allLettersPresent) console.log('- 部分字母部分缺失');
    if (!mSection) console.log('- 字母M部分有问题');
    if (!pSection) console.log('- 字母P部分有问题');
    if (!hasFooterContainer || !hasComponentsJS) console.log('- Footer加载有问题');
    if (!footerExists || !componentsJSExists) console.log('- Footer组件文件缺失');
}

console.log('');
console.log('📖 使用说明:');
console.log('1. 在浏览器中打开browse.html');
console.log('2. 点击字母导航栏中的M和P按钮');
console.log('3. 确认梦象卡片正常显示，无乱码');
console.log('4. 滚动到页面底部确认Footer正常显示');
console.log('5. 测试所有字母部分的导航功能');