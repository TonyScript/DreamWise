const fs = require('fs');

console.log('🔧 Fixing browse.html card titles and descriptions...');

// Read browse.html
let content = fs.readFileSync('browse.html', 'utf8');

// Dream descriptions mapping
const descriptions = {
    'Book': 'Knowledge & wisdom',
    'Bottle': 'Containment & preservation',
    'Box': 'Hidden secrets',
    'Bread': 'Nourishment & sustenance',
    'Bridge': 'Connection & transition',
    'Butterfly': 'Transformation & rebirth',
    'Flowers': 'Beauty & growth',
    'Food': 'Nourishment & satisfaction',
    'Forest': 'Nature & mystery',
    'Forgiveness': 'Healing & release',
    'Fox': 'Cunning & intelligence',
    'Frog': 'Transformation & cleansing',
    'Hands': 'Action & creation',
    'Loneliness': 'Isolation & reflection',
    'Love': 'Connection & affection',
    'Mouse': 'Small details & timidity',
    'Mouth': 'Communication & expression',
    'Prophet': 'Divine guidance',
    'Rope': 'Binding & connection',
    'Rosary': 'Prayer & devotion',
    'Turtle': 'Patience & longevity'
};

// Fix each dream card
Object.keys(descriptions).forEach(title => {
    const desc = descriptions[title];
    
    // Pattern to match the incorrectly formatted card
    const wrongPattern = new RegExp(
        `(<h3 class="font-semibold text-white group-hover:text-purple-300 transition-colors duration-300">${title}</h3>\\s*` +
        `<p class="text-xs text-gray-400 mt-1">Spiritual meaning</p>)`,
        'g'
    );
    
    // Replacement with correct format
    const correctFormat = 
        `<h3 class="font-semibold mb-2">${title}</h3>\n` +
        `                        <p class="text-sm text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">${desc}</p>`;
    
    content = content.replace(wrongPattern, correctFormat);
});

// Write the fixed content back
fs.writeFileSync('browse.html', content);

console.log('✅ Fixed all card titles and descriptions');
console.log('🎉 Browse.html card styles are now correct!');