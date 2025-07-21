const fs = require('fs');

console.log('🔍 Testing browse.html structure integrity...\n');

// Read browse.html
const content = fs.readFileSync('browse.html', 'utf8');

// Test for common HTML structure issues
const tests = [
    {
        name: 'Incomplete div tags',
        pattern: /<div[^>]*>\s*<i[^>]*><\/i>\s*(?!<\/div>)/g,
        description: 'Divs with icons but no closing tag'
    },
    {
        name: 'Orphaned h3 tags',
        pattern: /<\/div>\s*<h3[^>]*>[^<]+<\/h3>/g,
        description: 'H3 tags outside of proper card structure'
    },
    {
        name: 'Incomplete anchor tags',
        pattern: /<a href="dream\/[^"]+\.html"[^>]*>\s*<div[^>]*>\s*<i[^>]*><\/i>\s*(?!<\/div>)/g,
        description: 'Anchor tags with incomplete card structure'
    },
    {
        name: 'Missing card titles',
        pattern: /<\/div>\s*<p class="text-sm text-gray-400/g,
        description: 'Cards with descriptions but no titles'
    }
];

let totalIssues = 0;

tests.forEach(test => {
    const matches = content.match(test.pattern) || [];
    const count = matches.length;
    totalIssues += count;
    
    const status = count === 0 ? '✅' : '❌';
    console.log(`${status} ${test.name}: ${count} issues found`);
    if (count > 0) {
        console.log(`   Description: ${test.description}`);
    }
});

// Test specific sections that were problematic
const problematicSections = ['H', 'L', 'M', 'P', 'R', 'T'];
console.log('\n📊 Testing previously problematic sections:');

problematicSections.forEach(letter => {
    const sectionPattern = new RegExp(`<!-- Letter ${letter} Section -->([\\s\\S]*?)<!-- Letter [A-Z] Section -->|<!-- Letter ${letter} Section -->([\\s\\S]*?)$`, 'g');
    const sectionMatch = content.match(sectionPattern);
    
    if (sectionMatch) {
        const sectionContent = sectionMatch[0];
        const cardCount = (sectionContent.match(/<a href="dream\/[^"]+\.html"/g) || []).length;
        const completeCards = (sectionContent.match(/<a href="dream\/[^"]+\.html"[^>]*>[\s\S]*?<h3[^>]*>[^<]+<\/h3>[\s\S]*?<p[^>]*>[^<]+<\/p>[\s\S]*?<\/a>/g) || []).length;
        
        const status = cardCount === completeCards ? '✅' : '⚠️';
        console.log(`${status} Section ${letter}: ${completeCards}/${cardCount} cards have complete structure`);
    } else {
        console.log(`❌ Section ${letter}: Not found`);
    }
});

console.log('\n' + '='.repeat(60));

if (totalIssues === 0) {
    console.log('🎉 SUCCESS: Browse.html structure is clean!');
    console.log('✅ No HTML structure issues detected');
    console.log('✅ All card structures appear to be complete');
    console.log('✅ Ready for user testing');
} else {
    console.log(`⚠️  ISSUES FOUND: ${totalIssues} structural problems detected`);
    console.log('❌ Additional fixes may be needed');
}

console.log('='.repeat(60));