const fs = require('fs');
const path = require('path');

console.log('🔍 Testing Footer Component System\n');

// Test main pages (all should use component system now)
const mainPages = [
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

// No special pages anymore - all use unified footer
const specialPages = [];

// Test dream pages (sample)
const dreamPages = [
    'dream/hope.html',
    'dream/water.html',
    'dream/fire.html'
];

function testPage(filename, shouldHaveComponent = true, isDreamPage = false) {
    try {
        const content = fs.readFileSync(filename, 'utf8');
        
        const hasFooterContainer = content.includes('footer-container');
        const hasComponentsJS = content.includes('components.js');
        const hasDreamComponentsJS = content.includes('dream-components.js');
        const hasOldFooter = content.includes('<footer class=');
        
        let status = '✅';
        let message = '';
        
        if (shouldHaveComponent) {
            if (!hasFooterContainer) {
                status = '❌';
                message = 'Missing footer-container';
            } else if (isDreamPage && !hasDreamComponentsJS) {
                status = '❌';
                message = 'Missing dream-components.js';
            } else if (!isDreamPage && !hasComponentsJS) {
                status = '❌';
                message = 'Missing components.js';
            } else if (hasOldFooter) {
                status = '⚠️';
                message = 'Has both component and old footer';
            } else {
                message = 'Component system working';
            }
        } else {
            if (hasFooterContainer || hasComponentsJS) {
                status = '⚠️';
                message = 'Should not use component system';
            } else if (hasOldFooter) {
                message = 'Using custom footer (correct)';
            } else {
                status = '❌';
                message = 'No footer found';
            }
        }
        
        console.log(`${status} ${filename.padEnd(35)} - ${message}`);
        
    } catch (error) {
        console.log(`❌ ${filename.padEnd(35)} - File not found or error`);
    }
}

console.log('📄 Main Pages (should use full footer component):');
mainPages.forEach(page => testPage(page, true, false));

console.log('\n🎨 Special Pages (should use custom footer):');
specialPages.forEach(page => testPage(page, false, false));

console.log('\n🌙 Dream Pages (should use simple footer component):');
dreamPages.forEach(page => testPage(page, true, true));

console.log('\n📊 Component Files:');
const componentFiles = [
    'assets/components/footer.html',
    'assets/components/footer-simple.html',
    'assets/js/components.js',
    'assets/js/dream-components.js'
];

componentFiles.forEach(file => {
    const exists = fs.existsSync(file);
    console.log(`${exists ? '✅' : '❌'} ${file.padEnd(35)} - ${exists ? 'Exists' : 'Missing'}`);
});

console.log('\n🎉 Footer system test complete!');