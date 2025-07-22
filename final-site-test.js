#!/usr/bin/env node

/**
 * DreamWise V1.1.0 全站测试脚本
 * 验证所有页面、链接和功能的完整性
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 DreamWise V1.1.0 全站测试开始...\n');

// 测试配置
const testConfig = {
    // 必需的页面文件
    requiredPages: [
        'index.html',
        'browse.html',
        'categories.html',
        'popular-symbols.html',
        'personalized.html',
        'about.html',
        'christian-dreams.html',
        'islamic-dreams.html',
        'buddhist-dreams.html',
        'hindu-dreams.html',
        'jewish-dreams.html',
        'insights.html',
        'dream-guides.html',
        'dream-blog.html',
        'contact.html',
        'faq.html'
    ],
    
    // 必需的资源文件
    requiredAssets: [
        'assets/css/main.min.css',
        'assets/js/main.min.js',
        'assets/js/components.js'
    ],
    
    // 导航链接检查
    navigationLinks: [
        'browse.html',
        'categories.html',
        'popular-symbols.html',
        'insights.html',
        'about.html'
    ]
};

let testResults = {
    passed: 0,
    failed: 0,
    warnings: 0,
    details: []
};

// 辅助函数
function addResult(type, message, details = '') {
    testResults[type]++;
    testResults.details.push({
        type,
        message,
        details,
        timestamp: new Date().toISOString()
    });
    
    const icon = type === 'passed' ? '✅' : type === 'failed' ? '❌' : '⚠️';
    console.log(`${icon} ${message}`);
    if (details) console.log(`   ${details}`);
}

function fileExists(filePath) {
    try {
        return fs.existsSync(filePath);
    } catch (error) {
        return false;
    }
}

function readFileContent(filePath) {
    try {
        return fs.readFileSync(filePath, 'utf8');
    } catch (error) {
        return null;
    }
}

// 测试1: 检查必需页面是否存在
console.log('📋 测试1: 检查必需页面文件...');
testConfig.requiredPages.forEach(page => {
    if (fileExists(page)) {
        addResult('passed', `页面文件存在: ${page}`);
    } else {
        addResult('failed', `页面文件缺失: ${page}`);
    }
});

// 测试2: 检查资源文件
console.log('\n🎨 测试2: 检查资源文件...');
testConfig.requiredAssets.forEach(asset => {
    if (fileExists(asset)) {
        addResult('passed', `资源文件存在: ${asset}`);
    } else {
        addResult('warnings', `资源文件缺失: ${asset}`, '可能影响页面样式或功能');
    }
});

// 测试3: 检查首页内容和链接
console.log('\n🏠 测试3: 检查首页内容...');
const indexContent = readFileContent('index.html');
if (indexContent) {
    addResult('passed', '首页文件可读取');
    
    // 检查关键元素
    const checks = [
        { pattern: /<title>.*Dream.*<\/title>/i, name: '页面标题' },
        { pattern: /DreamWise/i, name: '品牌名称' },
        { pattern: /href="browse\.html"/i, name: 'Browse链接' },
        { pattern: /href="popular-symbols\.html"/i, name: 'Popular链接' },
        { pattern: /href="about\.html"/i, name: 'About链接' },
        { pattern: /href="personalized\.html"/i, name: 'Personalized链接' },
        { pattern: /mobile-menu/i, name: '移动端菜单' },
        { pattern: /Google Tag Manager/i, name: '分析代码' }
    ];
    
    checks.forEach(check => {
        if (check.pattern.test(indexContent)) {
            addResult('passed', `首页包含: ${check.name}`);
        } else {
            addResult('failed', `首页缺失: ${check.name}`);
        }
    });
} else {
    addResult('failed', '无法读取首页文件');
}

// 测试4: 检查信仰视角页面内容
console.log('\n🕊️ 测试4: 检查信仰视角页面...');
const faithPages = [
    'christian-dreams.html',
    'islamic-dreams.html',
    'buddhist-dreams.html',
    'hindu-dreams.html',
    'jewish-dreams.html'
];

faithPages.forEach(page => {
    const content = readFileContent(page);
    if (content) {
        addResult('passed', `${page} 文件可读取`);
        
        // 检查内容完整性
        const contentChecks = [
            { pattern: /<h1>/i, name: '主标题' },
            { pattern: /glass-card/i, name: '样式类' },
            { pattern: /导航|navigation/i, name: '导航元素' },
            { pattern: /梦境|dream/i, name: '梦境内容' }
        ];
        
        contentChecks.forEach(check => {
            if (check.pattern.test(content)) {
                addResult('passed', `${page} 包含: ${check.name}`);
            } else {
                addResult('warnings', `${page} 可能缺失: ${check.name}`);
            }
        });
    } else {
        addResult('failed', `无法读取: ${page}`);
    }
});

// 测试5: 检查个性化分析页面
console.log('\n🔮 测试5: 检查个性化分析页面...');
const personalizedContent = readFileContent('personalized.html');
if (personalizedContent) {
    addResult('passed', 'personalized.html 文件可读取');
    
    const personalizedChecks = [
        { pattern: /form/i, name: '表单元素' },
        { pattern: /step|步骤/i, name: '步骤指示' },
        { pattern: /textarea/i, name: '文本输入区域' },
        { pattern: /button/i, name: '按钮元素' }
    ];
    
    personalizedChecks.forEach(check => {
        if (check.pattern.test(personalizedContent)) {
            addResult('passed', `个性化页面包含: ${check.name}`);
        } else {
            addResult('warnings', `个性化页面可能缺失: ${check.name}`);
        }
    });
} else {
    addResult('failed', '无法读取个性化分析页面');
}

// 测试6: 检查热门符号页面
console.log('\n⭐ 测试6: 检查热门符号页面...');
const popularContent = readFileContent('popular-symbols.html');
if (popularContent) {
    addResult('passed', 'popular-symbols.html 文件可读取');
    
    const popularChecks = [
        { pattern: /search|搜索/i, name: '搜索功能' },
        { pattern: /grid/i, name: '网格布局' },
        { pattern: /symbol|符号/i, name: '符号内容' },
        { pattern: /filter|筛选/i, name: '筛选功能' }
    ];
    
    popularChecks.forEach(check => {
        if (check.pattern.test(popularContent)) {
            addResult('passed', `热门符号页面包含: ${check.name}`);
        } else {
            addResult('warnings', `热门符号页面可能缺失: ${check.name}`);
        }
    });
} else {
    addResult('failed', '无法读取热门符号页面');
}

// 测试7: 检查关于页面
console.log('\n📖 测试7: 检查关于页面...');
const aboutContent = readFileContent('about.html');
if (aboutContent) {
    addResult('passed', 'about.html 文件可读取');
    
    const aboutChecks = [
        { pattern: /使命|mission/i, name: '使命介绍' },
        { pattern: /信仰|faith/i, name: '信仰视角' },
        { pattern: /联系|contact/i, name: '联系信息' },
        { pattern: /团队|team/i, name: '团队介绍' }
    ];
    
    aboutChecks.forEach(check => {
        if (check.pattern.test(aboutContent)) {
            addResult('passed', `关于页面包含: ${check.name}`);
        } else {
            addResult('warnings', `关于页面可能缺失: ${check.name}`);
        }
    });
} else {
    addResult('failed', '无法读取关于页面');
}

// 测试8: 检查SEO优化
console.log('\n🔍 测试8: 检查SEO优化...');
if (indexContent) {
    const seoChecks = [
        { pattern: /<meta name="description"/i, name: 'Meta描述' },
        { pattern: /<meta name="keywords"/i, name: 'Meta关键词' },
        { pattern: /<meta property="og:/i, name: 'Open Graph标签' },
        { pattern: /<meta name="twitter:/i, name: 'Twitter卡片' },
        { pattern: /<link rel="canonical"/i, name: '规范链接' },
        { pattern: /structured data|schema/i, name: '结构化数据' }
    ];
    
    seoChecks.forEach(check => {
        if (check.pattern.test(indexContent)) {
            addResult('passed', `SEO优化包含: ${check.name}`);
        } else {
            addResult('warnings', `SEO优化可能缺失: ${check.name}`);
        }
    });
}

// 测试9: 检查移动端优化
console.log('\n📱 测试9: 检查移动端优化...');
if (indexContent) {
    const mobileChecks = [
        { pattern: /viewport/i, name: 'Viewport设置' },
        { pattern: /responsive|md:|lg:/i, name: '响应式类' },
        { pattern: /mobile-menu/i, name: '移动端菜单' },
        { pattern: /@media.*max-width/i, name: '媒体查询' }
    ];
    
    mobileChecks.forEach(check => {
        if (check.pattern.test(indexContent)) {
            addResult('passed', `移动端优化包含: ${check.name}`);
        } else {
            addResult('warnings', `移动端优化可能缺失: ${check.name}`);
        }
    });
}

// 测试10: 检查性能优化
console.log('\n⚡ 测试10: 检查性能优化...');
if (indexContent) {
    const performanceChecks = [
        { pattern: /preconnect/i, name: '预连接' },
        { pattern: /preload/i, name: '预加载' },
        { pattern: /defer|async/i, name: '脚本优化' },
        { pattern: /lazy/i, name: '懒加载' },
        { pattern: /min\.css|min\.js/i, name: '压缩文件' }
    ];
    
    performanceChecks.forEach(check => {
        if (check.pattern.test(indexContent)) {
            addResult('passed', `性能优化包含: ${check.name}`);
        } else {
            addResult('warnings', `性能优化可能缺失: ${check.name}`);
        }
    });
}

// 生成测试报告
console.log('\n' + '='.repeat(60));
console.log('📊 测试结果汇总');
console.log('='.repeat(60));
console.log(`✅ 通过: ${testResults.passed}`);
console.log(`❌ 失败: ${testResults.failed}`);
console.log(`⚠️  警告: ${testResults.warnings}`);
console.log(`📝 总计: ${testResults.passed + testResults.failed + testResults.warnings}`);

// 计算成功率
const totalTests = testResults.passed + testResults.failed + testResults.warnings;
const successRate = totalTests > 0 ? ((testResults.passed / totalTests) * 100).toFixed(1) : 0;
console.log(`📈 成功率: ${successRate}%`);

// 生成详细报告文件
const reportData = {
    timestamp: new Date().toISOString(),
    summary: {
        passed: testResults.passed,
        failed: testResults.failed,
        warnings: testResults.warnings,
        total: totalTests,
        successRate: successRate + '%'
    },
    details: testResults.details
};

try {
    fs.writeFileSync('test-report.json', JSON.stringify(reportData, null, 2));
    console.log('\n📄 详细报告已保存到: test-report.json');
} catch (error) {
    console.log('\n⚠️  无法保存详细报告:', error.message);
}

// 最终建议
console.log('\n💡 建议:');
if (testResults.failed > 0) {
    console.log('❌ 存在关键问题，需要修复失败项目后再发布');
} else if (testResults.warnings > 5) {
    console.log('⚠️  存在一些警告，建议优化后发布');
} else {
    console.log('✅ 网站状态良好，可以考虑发布');
}

console.log('\n🎉 测试完成！');

// 返回退出码
process.exit(testResults.failed > 0 ? 1 : 0);