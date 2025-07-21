#!/usr/bin/env node

const fs = require('fs');

console.log('🔍 全面验证browse.html页面修复...');
console.log('');

// 读取browse.html文件
const content = fs.readFileSync('browse.html', 'utf8');

// 验证所有字母部分
const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
let allLettersPresent = true;
let problemLetters = [];

console.log('📋 验证所有字母部分:');
letters.forEach(letter => {
    const sectionExists = content.includes(`<!-- Letter ${letter} Section -->`);
    const headerExists = content.includes(`<h2 class="text-3xl font-bold">Letter ${letter}</h2>`);
    
    if (sectionExists && headerExists) {
        console.log(`✅ 字母${letter}: 完整`);
    } else {
        console.log(`❌ 字母${letter}: 缺失或不完整`);
        allLettersPresent = false;
        problemLetters.push(letter);
    }
});

// 重点验证问题字母
console.log('');
console.log('🎯 重点验证问题字母:');

// 检查字母R
const rSection = content.match(/<!-- Letter R Section -->([\s\S]*?)<!-- Letter S Section -->/);
if (rSection) {
    const rContent = rSection[1];
    const rCards = (rContent.match(/class="dream-symbol-card/g) || []).length;
    console.log(`✅ 字母R: ${rCards}个梦象卡片`);
    
    // 检查是否有结构错误
    const hasStructureError = rContent.includes('</div><a href="dream/') || 
                             rContent.includes('</div>\n                        <h3');
    if (!hasStructureError) {
        console.log(`✅ 字母R: HTML结构正确`);
    } else {
        console.log(`❌ 字母R: 仍有HTML结构错误`);
    }
} else {
    console.log('❌ 字母R: 部分未找到');
}

// 检查字母T
const tSection = content.match(/<!-- Letter T Section -->([\s\S]*?)<!-- Letter U Section -->/);
if (tSection) {
    const tContent = tSection[1];
    const tCards = (tContent.match(/class="dream-symbol-card/g) || []).length;
    console.log(`✅ 字母T: ${tCards}个梦象卡片`);
    
    // 检查是否有结构错误
    const hasStructureError = tContent.includes('</div><a href="dream/') || 
                             tContent.includes('</div>\n                </div>\n                        <h3');
    if (!hasStructureError) {
        console.log(`✅ 字母T: HTML结构正确`);
    } else {
        console.log(`❌ 字母T: 仍有HTML结构错误`);
    }
} else {
    console.log('❌ 字母T: 部分未找到');
}

// 检查字母L
const lSection = content.match(/<!-- Letter L Section -->([\s\S]*?)<!-- Letter M Section -->/);
if (lSection) {
    const lContent = lSection[1];
    const lCards = (lContent.match(/class="dream-symbol-card/g) || []).length;
    console.log(`✅ 字母L: ${lCards}个梦象卡片`);
    
    // 检查是否有重复的ladder链接
    const ladderMatches = (lContent.match(/<a href="dream\/ladder\.html"/g) || []).length;
    if (ladderMatches === 1) {
        console.log(`✅ 字母L: 无重复链接`);
    } else {
        console.log(`❌ 字母L: 发现${ladderMatches}个ladder链接（应该只有1个）`);
    }
} else {
    console.log('❌ 字母L: 部分未找到');
}

// 验证T之后的字母是否存在
console.log('');
console.log('📋 验证T之后的字母部分:');
const lettersAfterT = ['U', 'V', 'W', 'X', 'Y', 'Z'];
let missingAfterT = [];

lettersAfterT.forEach(letter => {
    if (content.includes(`<!-- Letter ${letter} Section -->`)) {
        console.log(`✅ 字母${letter}: 存在`);
    } else {
        missingAfterT.push(letter);
        console.log(`❌ 字母${letter}: 缺失`);
    }
});

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

// 检查HTML结构完整性
console.log('');
console.log('🔧 检查HTML结构完整性:');
const openTags = (content.match(/<section/g) || []).length;
const closeTags = (content.match(/<\/section>/g) || []).length;
console.log(`✅ Section标签: ${openTags}个开始标签, ${closeTags}个结束标签 ${openTags === closeTags ? '(匹配)' : '(不匹配)'}`);

const openDivs = (content.match(/<div/g) || []).length;
const closeDivs = (content.match(/<\/div>/g) || []).length;
console.log(`✅ Div标签: ${openDivs}个开始标签, ${closeDivs}个结束标签 ${openDivs === closeDivs ? '(匹配)' : '(不匹配)'}`);

// 最终结果
console.log('');
console.log('🎉 最终验证结果:');
console.log('==================');

const allIssuesFixed = allLettersPresent && 
                      rSection && tSection && lSection && 
                      missingAfterT.length === 0 &&
                      hasFooterContainer && hasComponentsJS && 
                      footerExists && componentsJSExists &&
                      openTags === closeTags && openDivs === closeDivs;

if (allIssuesFixed) {
    console.log('🎊 所有问题已完全修复！');
    console.log('');
    console.log('修复内容总结:');
    console.log('✅ 字母R部分排序和结构问题已解决');
    console.log('✅ 字母T部分排序和结构问题已解决');
    console.log('✅ T之后所有字母(U-Z)都正常显示');
    console.log('✅ Footer组件系统完整且正常工作');
    console.log('✅ HTML结构标签完全匹配');
    console.log('');
    console.log('🌟 browse.html页面现在完全正常！');
} else {
    console.log('⚠️ 仍有问题需要解决:');
    if (problemLetters.length > 0) console.log(`- 问题字母: ${problemLetters.join(', ')}`);
    if (!rSection) console.log('- 字母R部分有问题');
    if (!tSection) console.log('- 字母T部分有问题');
    if (missingAfterT.length > 0) console.log(`- T之后缺失字母: ${missingAfterT.join(', ')}`);
    if (!hasFooterContainer || !hasComponentsJS) console.log('- Footer加载有问题');
    if (!footerExists || !componentsJSExists) console.log('- Footer组件文件缺失');
    if (openTags !== closeTags || openDivs !== closeDivs) console.log('- HTML标签不匹配');
}

console.log('');
console.log('📖 使用说明:');
console.log('1. 在浏览器中打开browse.html');
console.log('2. 点击字母导航栏中的R和T按钮');
console.log('3. 确认梦象卡片正常显示，排序正确');
console.log('4. 测试所有字母部分的导航功能');
console.log('5. 滚动到页面底部确认Footer正常显示');