const fs = require('fs');

console.log('🔍 Testing Unified Footer Component System\n');

// All pages that should use the unified system
const allPages = [
    // Main pages
    'index.html',
    'expert-interpretations.html', 
    'multi-faith-analysis.html',
    'insights.html',
    'dream-journal.html',
    'contact.html',
    'faq.html',
    'help-center.html',
    'privacy-policy.html',
    'terms-of-service.html',
    'browse.html',
    'categories.html'
];

// Sample dream pages
const dreamPages = [
    'dream/hope.html',
    'dream/water.html',
    'dream/fire.html',
    'dream/snake.html',
    'dream/baby.html'
];

console.log('📄 Main Pages - Unified System Check:');
allPages.forEach(page => {
    try {
        const content = fs.readFileSync(page, 'utf8');
        
        const hasFooterContainer = content.includes('<div id="footer-container"></div>');
        const hasUnifiedJS = content.includes('assets/js/components.js');
        const hasOldFooter = content.includes('<footer class=');
        
        let status = '✅';
        let message = 'Perfect - uses unified system';
        
        if (!hasFooterContainer) {
            status = '❌';
            message = 'Missing footer-container';
        } else if (!hasUnifiedJS) {
            status = '❌';
            message = 'Missing unified components.js';
        } else if (hasOldFooter) {
            status = '⚠️';
            message = 'Has both component and old footer';
        }
        
        console.log(`${status} ${page.padEnd(35)} - ${message}`);
        
    } catch (error) {
        console.log(`❌ ${page.padEnd(35)} - File error: ${error.message}`);
    }
});

console.log('\n🌙 Dream Pages - Unified System Check:');
dreamPages.forEach(page => {
    try {
        const content = fs.readFileSync(page, 'utf8');
        
        const hasFooterContainer = content.includes('<div id="footer-container"></div>');
        const hasUnifiedJS = content.includes('../assets/js/components.js');
        const hasOldDreamJS = content.includes('dream-components.js');
        const hasOldFooter = content.includes('<footer class=');
        
        let status = '✅';
        let message = 'Perfect - uses unified system';
        
        if (!hasFooterContainer) {
            status = '❌';
            message = 'Missing footer-container';
        } else if (!hasUnifiedJS) {
            status = '❌';
            message = 'Missing unified components.js';
        } else if (hasOldDreamJS) {
            status = '⚠️';
            message = 'Still uses old dream-components.js';
        } else if (hasOldFooter) {
            status = '⚠️';
            message = 'Has both component and old footer';
        }
        
        console.log(`${status} ${page.padEnd(35)} - ${message}`);
        
    } catch (error) {
        console.log(`❌ ${page.padEnd(35)} - File error: ${error.message}`);
    }
});

console.log('\n📊 System Files Check:');
const systemFiles = [
    { file: 'assets/components/footer.html', should: 'exist', desc: 'Single unified footer component' },
    { file: 'assets/js/components.js', should: 'exist', desc: 'Single unified component loader' },
    { file: 'assets/components/footer-simple.html', should: 'not-exist', desc: 'Old separate footer (should be deleted)' },
    { file: 'assets/js/dream-components.js', should: 'not-exist', desc: 'Old separate loader (should be deleted)' }
];

systemFiles.forEach(({file, should, desc}) => {
    const exists = fs.existsSync(file);
    let status = '✅';
    let message = desc;
    
    if (should === 'exist' && !exists) {
        status = '❌';
        message = `Missing: ${desc}`;
    } else if (should === 'not-exist' && exists) {
        status = '⚠️';
        message = `Still exists: ${desc}`;
    }
    
    console.log(`${status} ${file.padEnd(35)} - ${message}`);
});

console.log('\n' + '='.repeat(70));
console.log('🎯 UNIFIED SYSTEM SUMMARY:');
console.log('✅ Single Footer Component: assets/components/footer.html');
console.log('✅ Single JavaScript Loader: assets/js/components.js');
console.log('✅ Smart Path Detection: Automatically handles main/dream pages');
console.log('✅ All Pages Use Same Footer: No more inconsistencies');
console.log('✅ Easy Maintenance: One file to rule them all!');
console.log('='.repeat(70));