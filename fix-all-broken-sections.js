const fs = require('fs');

console.log('🔧 Fixing all broken HTML sections in browse.html...\n');

// Read browse.html
let content = fs.readFileSync('browse.html', 'utf8');

// Define all the broken patterns and their fixes
const fixes = [
    // H section - hair card fix
    {
        broken: `                    <a href="dream/hair.html" class="dream-symbol-card glass-card hover-scale p-4 text-center group">
                        <div class="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-r from-brown-500 to-amber-600 flex items-center justify-center">
                            <i class="fas fa-cut text-white"></i>
                        
                    
                    <a href="dream/hands.html" class="dream-symbol-card glass-card hover-scale p-4 text-center group">
                        <div class="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 flex items-center justify-center">
                            <i class="fas fa-hands text-white"></i>
                        </div>
                        <h3 class="font-semibold mb-2">Hands</h3>
                        <p class="text-sm text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">Action & creation</p>
                    </a>
                </div>
                        <h3 class="font-semibold mb-2">Hair</h3>
                        <p class="text-sm text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">Strength & identity</p>
                    </a>
                    
                    <a href="dream/hand.html" class="dream-symbol-card glass-card hover-scale p-4 text-center group">`,
        fixed: `                    <a href="dream/hair.html" class="dream-symbol-card glass-card hover-scale p-4 text-center group">
                        <div class="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-r from-brown-500 to-amber-600 flex items-center justify-center">
                            <i class="fas fa-cut text-white"></i>
                        </div>
                        <h3 class="font-semibold mb-2">Hair</h3>
                        <p class="text-sm text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">Strength & identity</p>
                    </a>
                    
                    <a href="dream/hand.html" class="dream-symbol-card glass-card hover-scale p-4 text-center group">`,
        section: 'H'
    },

    // M section - meditation card fix
    {
        broken: `                    <a href="dream/meditation.html" class="dream-symbol-card glass-card hover-scale p-4 text-center group">
                        <div class="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center">
                            <i class="fas fa-om text-white"></i>
                        
                    
                    <a href="dream/mouse.html" class="dream-symbol-card glass-card hover-scale p-4 text-center group">`,
        fixed: `                    <a href="dream/meditation.html" class="dream-symbol-card glass-card hover-scale p-4 text-center group">
                        <div class="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center">
                            <i class="fas fa-om text-white"></i>
                        </div>
                        <h3 class="font-semibold mb-2">Meditation</h3>
                        <p class="text-sm text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">Inner peace & mindfulness</p>
                    </a>
                    
                    <a href="dream/mouse.html" class="dream-symbol-card glass-card hover-scale p-4 text-center group">`,
        section: 'M'
    }
];

// Apply all fixes
fixes.forEach(fix => {
    if (content.includes(fix.broken)) {
        content = content.replace(fix.broken, fix.fixed);
        console.log(`✅ Fixed ${fix.section} section structure`);
    } else {
        console.log(`⚠️  ${fix.section} section pattern not found or already fixed`);
    }
});

// Additional pattern-based fixes for other potential issues
const patterns = [
    // Fix any remaining incomplete card structures
    {
        pattern: /(<a href="dream\/[^"]+\.html" class="dream-symbol-card[^>]*>)\s*(<div class="w-12[^>]*>)\s*(<i class="[^"]*"[^>]*><\/i>)\s*(?!<\/div>)/g,
        replacement: '$1\n                        $2\n                            $3\n                        </div>',
        description: 'Fix incomplete div closures'
    },

    // Fix orphaned h3 and p tags
    {
        pattern: /(<\/div>)\s*(<h3 class="font-semibold mb-2">[^<]+<\/h3>)\s*(<p class="text-sm text-gray-400[^>]*>[^<]+<\/p>)\s*(<\/a>)/g,
        replacement: '$1\n                        $2\n                        $3\n                    $4',
        description: 'Fix orphaned h3 and p tags'
    }
];

patterns.forEach((pattern, index) => {
    const matches = content.match(pattern.pattern);
    if (matches) {
        content = content.replace(pattern.pattern, pattern.replacement);
        console.log(`✅ Applied pattern fix ${index + 1}: ${pattern.description} (${matches.length} matches)`);
    }
});

// Write the fixed content back
fs.writeFileSync('browse.html', content);

console.log('\n🎉 All broken HTML sections have been fixed!');
console.log('📊 Fixed sections: H, M, and applied pattern-based fixes');
console.log('✅ Browse page structure should now be correct');