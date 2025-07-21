const fs = require('fs');

console.log('🔍 Verifying Footer Consistency Across All Pages\n');

// All pages that should use the full footer component
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

// Sample dream pages that should use simple footer component
const dreamPages = [
    'dream/hope.html',
    'dream/water.html',
    'dream/fire.html',
    'dream/snake.html',
    'dream/baby.html'
];

function checkFooterConsistency() {
    console.log('📄 Main Pages Footer Consistency:');
    
    let allConsistent = true;
    
    mainPages.forEach(page => {
        try {
            const content = fs.readFileSync(page, 'utf8');
            
            const hasFooterContainer = content.includes('<div id="footer-container"></div>');
            const hasComponentsJS = content.includes('assets/js/components.js');
            const hasOldFooter = content.includes('<footer class=');
            
            let status = '✅';
            let message = 'Uses unified footer component';
            
            if (!hasFooterContainer) {
                status = '❌';
                message = 'Missing footer-container div';
                allConsistent = false;
            } else if (!hasComponentsJS) {
                status = '❌';
                message = 'Missing components.js script';
                allConsistent = false;
            } else if (hasOldFooter) {
                status = '⚠️';
                message = 'Has both component and old footer';
                allConsistent = false;
            }
            
            console.log(`${status} ${page.padEnd(35)} - ${message}`);
            
        } catch (error) {
            console.log(`❌ ${page.padEnd(35)} - File error: ${error.message}`);
            allConsistent = false;
        }
    });
    
    console.log('\n🌙 Dream Pages Footer Consistency:');
    
    dreamPages.forEach(page => {
        try {
            const content = fs.readFileSync(page, 'utf8');
            
            const hasFooterContainer = content.includes('<div id="footer-container"></div>');
            const hasDreamComponentsJS = content.includes('../assets/js/dream-components.js');
            const hasOldFooter = content.includes('<footer class=');
            
            let status = '✅';
            let message = 'Uses unified simple footer component';
            
            if (!hasFooterContainer) {
                status = '❌';
                message = 'Missing footer-container div';
                allConsistent = false;
            } else if (!hasDreamComponentsJS) {
                status = '❌';
                message = 'Missing dream-components.js script';
                allConsistent = false;
            } else if (hasOldFooter) {
                status = '⚠️';
                message = 'Has both component and old footer';
                allConsistent = false;
            }
            
            console.log(`${status} ${page.padEnd(35)} - ${message}`);
            
        } catch (error) {
            console.log(`❌ ${page.padEnd(35)} - File error: ${error.message}`);
            allConsistent = false;
        }
    });
    
    console.log('\n📊 Footer Component Files:');
    
    const componentFiles = [
        'assets/components/footer.html',
        'assets/components/footer-simple.html'
    ];
    
    componentFiles.forEach(file => {
        const exists = fs.existsSync(file);
        if (!exists) allConsistent = false;
        console.log(`${exists ? '✅' : '❌'} ${file.padEnd(35)} - ${exists ? 'Exists' : 'Missing'}`);
    });
    
    console.log('\n' + '='.repeat(60));
    
    if (allConsistent) {
        console.log('🎉 SUCCESS: All pages use consistent footer components!');
        console.log('✅ Main pages use full footer component');
        console.log('✅ Dream pages use simple footer component');
        console.log('✅ No old footer code remains');
        console.log('✅ All component files exist');
    } else {
        console.log('❌ ISSUES FOUND: Some pages have inconsistent footers');
        console.log('Please review the issues above and fix them');
    }
}

checkFooterConsistency();