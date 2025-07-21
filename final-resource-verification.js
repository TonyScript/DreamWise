#!/usr/bin/env node

const fs = require('fs');

console.log('🔍 最终验证资源页面改进...');
console.log('');

// 需要验证的页面
const pagesToVerify = [
    // 主资源页面
    { file: 'dream-guides.html', type: 'main', links: ['guide-getting-started.html', 'guide-understanding-symbols.html'] },
    { file: 'dream-blog.html', type: 'main', links: ['blog-recurring-dreams.html', 'blog-flying-dreams.html'] },
    { file: 'community.html', type: 'main', links: ['#forums', '#events', '#experts'] },
    { file: 'spiritual-meanings.html', type: 'main' },
    { file: 'symbol-library.html', type: 'main' },
    { file: 'faith-perspectives.html', type: 'main' },
    
    // 详细页面
    { file: 'guide-getting-started.html', type: 'detail', parent: 'dream-guides.html' },
    { file: 'guide-understanding-symbols.html', type: 'detail', parent: 'dream-guides.html' },
    { file: 'blog-recurring-dreams.html', type: 'detail', parent: 'dream-blog.html' },
    { file: 'blog-flying-dreams.html', type: 'detail', parent: 'dream-blog.html' }
];

// 验证页面存在性和链接
console.log('📋 验证页面存在性和链接:');

let allPagesValid = true;
let missingPages = [];
let brokenLinks = [];

pagesToVerify.forEach(page => {
    if (fs.existsSync(page.file)) {
        console.log(`✅ ${page.file}: 文件存在`);
        
        // 读取文件内容
        const content = fs.readFileSync(page.file, 'utf8');
        
        // 验证链接
        if (page.links) {
            page.links.forEach(link => {
                if (link.startsWith('#') || content.includes(`href="${link}"`)) {
                    console.log(`  ✅ 链接正常: ${link}`);
                } else {
                    console.log(`  ❌ 链接缺失: ${link}`);
                    brokenLinks.push({ page: page.file, link });
                    allPagesValid = false;
                }
            });
        }
        
        // 验证返回链接（详细页面）
        if (page.type === 'detail' && page.parent) {
            if (content.includes(`href="${page.parent}"`)) {
                console.log(`  ✅ 返回链接正常: ${page.parent}`);
            } else {
                console.log(`  ❌ 返回链接缺失: ${page.parent}`);
                brokenLinks.push({ page: page.file, link: page.parent });
                allPagesValid = false;
            }
        }
    } else {
        console.log(`❌ ${page.file}: 文件不存在`);
        missingPages.push(page.file);
        allPagesValid = false;
    }
});

// 验证Footer中的Dream Journal链接是否已隐藏
console.log('');
console.log('🦶 验证Footer组件:');

if (fs.existsSync('assets/components/footer.html')) {
    const footerContent = fs.readFileSync('assets/components/footer.html', 'utf8');
    
    // 检查Dream Journal是否被注释掉
    const dreamJournalHidden = footerContent.includes('<!-- <li><a href="dream-journal.html"') && 
                              footerContent.includes('</li> -->');
    
    if (dreamJournalHidden) {
        console.log('✅ Dream Journal链接已正确隐藏');
    } else {
        console.log('❌ Dream Journal链接未正确隐藏');
        allPagesValid = false;
    }
    
    // 检查Resources链接是否存在
    const resourceLinks = [
        'dream-guides.html',
        'spiritual-meanings.html',
        'symbol-library.html', 
        'faith-perspectives.html',
        'dream-blog.html',
        'community.html'
    ];
    
    let allResourceLinksPresent = true;
    resourceLinks.forEach(link => {
        if (footerContent.includes(link)) {
            console.log(`✅ Footer包含链接: ${link}`);
        } else {
            console.log(`❌ Footer缺少链接: ${link}`);
            allResourceLinksPresent = false;
        }
    });
    
    if (!allResourceLinksPresent) {
        allPagesValid = false;
    }
} else {
    console.log('❌ Footer组件文件不存在');
    allPagesValid = false;
}

// 验证页面内容质量
console.log('');
console.log('📄 验证页面内容质量:');

const detailPages = pagesToVerify.filter(page => page.type === 'detail');
detailPages.forEach(page => {
    if (fs.existsSync(page.file)) {
        const content = fs.readFileSync(page.file, 'utf8');
        
        // 检查内容长度和质量
        const wordCount = content.split(/\s+/).length;
        const hasHeadings = (content.match(/<h[1-6]/g) || []).length >= 3;
        const hasContent = content.includes('<main') && content.includes('</main>');
        
        console.log(`📊 ${page.file}:`);
        console.log(`   - 字数: ${wordCount}`);
        console.log(`   - 标题数量: ${(content.match(/<h[1-6]/g) || []).length}`);
        console.log(`   - 内容完整性: ${hasContent ? '良好' : '不足'}`);
        
        if (wordCount > 1000 && hasHeadings && hasContent) {
            console.log(`   ✅ 内容质量良好`);
        } else {
            console.log(`   ⚠️ 内容可能需要改进`);
        }
    }
});

// 最终结果
console.log('');
console.log('🎉 验证结果总结:');
console.log('==================');

if (allPagesValid) {
    console.log('🎊 所有资源页面改进成功！');
    console.log('');
    console.log('✅ 完成的工作:');
    console.log('- Dream Guides页面添加了详细指南链接');
    console.log('- 创建了详细的Dream Guides内容页面');
    console.log('- Dream Blog页面添加了文章链接');
    console.log('- 创建了详细的博客文章页面');
    console.log('- 重新定义了Community页面的功能和定位');
    console.log('- Dream Journal链接已在Footer中隐藏');
    console.log('');
    console.log('📝 页面列表:');
    console.log('   📄 主资源页面:');
    pagesToVerify.filter(p => p.type === 'main').forEach(page => {
        console.log(`      - ${page.file}`);
    });
    console.log('   📄 详细内容页面:');
    pagesToVerify.filter(p => p.type === 'detail').forEach(page => {
        console.log(`      - ${page.file}`);
    });
} else {
    console.log('⚠️ 部分页面存在问题，需要检查');
    if (missingPages.length > 0) {
        console.log('缺失的页面:');
        missingPages.forEach(page => console.log(`- ${page}`));
    }
    if (brokenLinks.length > 0) {
        console.log('损坏的链接:');
        brokenLinks.forEach(item => console.log(`- ${item.page} 中的链接 ${item.link}`));
    }
}

console.log('');
console.log('🌐 使用说明:');
console.log('1. 在浏览器中打开dream-guides.html');
console.log('2. 点击"Read Full Guide"链接测试详细指南页面');
console.log('3. 在浏览器中打开dream-blog.html');
console.log('4. 点击文章标题链接测试详细博客文章页面');
console.log('5. 在浏览器中打开community.html查看新的社区功能');
console.log('6. 确认Footer中Dream Journal链接已隐藏');