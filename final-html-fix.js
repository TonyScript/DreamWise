#!/usr/bin/env node

const fs = require('fs');

console.log('🔧 最终HTML标签修复...');

// 读取browse.html文件
let content = fs.readFileSync('browse.html', 'utf8');

// 检查并修复可能的标签不匹配问题
console.log('📝 检查HTML标签匹配...');

// 计算标签数量
const openDivs = (content.match(/<div/g) || []).length;
const closeDivs = (content.match(/<\/div>/g) || []).length;
const openSections = (content.match(/<section/g) || []).length;
const closeSections = (content.match(/<\/section>/g) || []).length;

console.log(`开始div标签: ${openDivs}`);
console.log(`结束div标签: ${closeDivs}`);
console.log(`开始section标签: ${openSections}`);
console.log(`结束section标签: ${closeSections}`);

// 如果div标签不匹配，尝试找到问题
if (openDivs !== closeDivs) {
    console.log('⚠️ Div标签不匹配，检查常见问题...');
    
    // 检查Page Header部分是否缺少闭合标签
    const pageHeaderMatch = content.match(/<!-- Page Header -->([\s\S]*?)<!-- Alphabetical Navigation -->/);
    if (pageHeaderMatch) {
        const headerContent = pageHeaderMatch[1];
        const headerOpenDivs = (headerContent.match(/<div/g) || []).length;
        const headerCloseDivs = (headerContent.match(/<\/div>/g) || []).length;
        
        if (headerOpenDivs !== headerCloseDivs) {
            console.log('🔍 Page Header部分div标签不匹配');
            // 修复Page Header部分
            const fixedHeader = `    <!-- Page Header -->
    <section class="pt-32 pb-16 relative">
        <div class="container mx-auto px-6 text-center">
            <div class="glass-card max-w-4xl mx-auto p-8">
                <h1 class="text-4xl md:text-5xl font-bold mb-6">
                    A-Z <span class="gradient-text">Dream Dictionary</span>
                </h1>
                <p class="text-xl text-gray-300 mb-4">
                    Explore dream symbols organized alphabetically
                </p>
                <p class="text-lg text-gray-400 max-w-2xl mx-auto">
                    Find the spiritual meaning of your dreams by browsing our comprehensive collection of dream symbols from A to Z
                </p>
            </div>
        </div>
    </section>

    `;
            
            const headerStart = content.indexOf('    <!-- Page Header -->');
            const headerEnd = content.indexOf('    <!-- Alphabetical Navigation -->');
            
            if (headerStart !== -1 && headerEnd !== -1) {
                content = content.substring(0, headerStart) + fixedHeader + content.substring(headerEnd);
                console.log('✅ Page Header部分已修复');
            }
        }
    }
    
    // 检查Alphabetical Navigation部分
    const navMatch = content.match(/<!-- Alphabetical Navigation -->([\s\S]*?)<!-- Dream Symbols Content -->/);
    if (navMatch) {
        const navContent = navMatch[1];
        const navOpenDivs = (navContent.match(/<div/g) || []).length;
        const navCloseDivs = (navContent.match(/<\/div>/g) || []).length;
        
        if (navOpenDivs !== navCloseDivs) {
            console.log('🔍 Alphabetical Navigation部分div标签不匹配');
            // 修复Alphabetical Navigation部分
            const fixedNav = `    <!-- Alphabetical Navigation -->
    <div class="sticky top-28 z-30 bg-gradient-to-r from-purple-900/80 to-blue-900/80 backdrop-blur-md border-b border-white/10">
        <div class="container mx-auto px-6 py-4">
            <div class="alphabet-nav flex flex-wrap justify-center gap-2 md:gap-4">
                <button class="letter-btn active" data-letter="A">A</button>
                <button class="letter-btn" data-letter="B">B</button>
                <button class="letter-btn" data-letter="C">C</button>
                <button class="letter-btn" data-letter="D">D</button>
                <button class="letter-btn" data-letter="E">E</button>
                <button class="letter-btn" data-letter="F">F</button>
                <button class="letter-btn" data-letter="G">G</button>
                <button class="letter-btn" data-letter="H">H</button>
                <button class="letter-btn" data-letter="I">I</button>
                <button class="letter-btn" data-letter="J">J</button>
                <button class="letter-btn" data-letter="K">K</button>
                <button class="letter-btn" data-letter="L">L</button>
                <button class="letter-btn" data-letter="M">M</button>
                <button class="letter-btn" data-letter="N">N</button>
                <button class="letter-btn" data-letter="O">O</button>
                <button class="letter-btn" data-letter="P">P</button>
                <button class="letter-btn" data-letter="Q">Q</button>
                <button class="letter-btn" data-letter="R">R</button>
                <button class="letter-btn" data-letter="S">S</button>
                <button class="letter-btn" data-letter="T">T</button>
                <button class="letter-btn" data-letter="U">U</button>
                <button class="letter-btn" data-letter="V">V</button>
                <button class="letter-btn" data-letter="W">W</button>
                <button class="letter-btn" data-letter="X">X</button>
                <button class="letter-btn" data-letter="Y">Y</button>
                <button class="letter-btn" data-letter="Z">Z</button>
            </div>
        </div>
    </div>

    `;
            
            const navStart = content.indexOf('    <!-- Alphabetical Navigation -->');
            const navEnd = content.indexOf('    <!-- Dream Symbols Content -->');
            
            if (navStart !== -1 && navEnd !== -1) {
                content = content.substring(0, navStart) + fixedNav + content.substring(navEnd);
                console.log('✅ Alphabetical Navigation部分已修复');
            }
        }
    }
}

// 保存修复后的文件
fs.writeFileSync('browse.html', content);

// 重新计算标签数量
const finalContent = fs.readFileSync('browse.html', 'utf8');
const finalOpenDivs = (finalContent.match(/<div/g) || []).length;
const finalCloseDivs = (finalContent.match(/<\/div>/g) || []).length;
const finalOpenSections = (finalContent.match(/<section/g) || []).length;
const finalCloseSections = (finalContent.match(/<\/section>/g) || []).length;

console.log('');
console.log('🎉 最终HTML标签统计:');
console.log(`✅ Div标签: ${finalOpenDivs}个开始标签, ${finalCloseDivs}个结束标签 ${finalOpenDivs === finalCloseDivs ? '(匹配)' : '(不匹配)'}`);
console.log(`✅ Section标签: ${finalOpenSections}个开始标签, ${finalCloseSections}个结束标签 ${finalOpenSections === finalCloseSections ? '(匹配)' : '(不匹配)'}`);

if (finalOpenDivs === finalCloseDivs && finalOpenSections === finalCloseSections) {
    console.log('🎊 所有HTML标签现在都完全匹配！');
} else {
    console.log('⚠️ 仍有标签不匹配的问题');
}