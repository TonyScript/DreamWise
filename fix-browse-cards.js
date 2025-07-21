const fs = require('fs');

console.log('🔧 Fixing browse.html card styles...\n');

// Read browse.html
let browseContent = fs.readFileSync('browse.html', 'utf8');

// List of cards that were added with wrong format
const cardsToFix = [
    'book', 'bottle', 'box', 'bread', 'bridge', 'butterfly',
    'flowers', 'food', 'forest', 'forgiveness', 'fox', 'frog',
    'hands', 'loneliness', 'love', 'mouse', 'mouth', 'prophet',
    'rope', 'rosary', 'turtle'
];

// Fix each card by replacing the wrong format with correct format
cardsToFix.forEach(cardName => {
    // Pattern to match the incorrectly formatted cards
    const wrongPattern = new RegExp(
        `<a href="dream/${cardName}\\.html" class="dream-symbol-card glass-card hover-scale p-4 text-center group">\\s*` +
        `<div class="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-r [^"]*" flex items-center justify-center">\\s*` +
        `<i class="[^"]*" text-white"></i>\\s*` +
        `</div>\\s*` +
        `<h3 class="font-semibold text-white group-hover:text-purple-300 transition-colors duration-300">[^<]*</h3>\\s*` +
        `<p class="text-xs text-gray-400 mt-1">Spiritual meaning</p>\\s*` +
        `</a>`,
        'g'
    );
    
    // Remove the incorrectly formatted cards
    browseContent = browseContent.replace(wrongPattern, '');
});

// Clean up any extra whitespace or newlines that might be left
browseContent = browseContent.replace(/\n\s*\n\s*\n/g, '\n\n');

// Write the cleaned content back
fs.writeFileSync('browse.html', browseContent);

console.log('✅ Removed incorrectly formatted cards');
console.log('🔄 Now running the corrected script to add properly formatted cards...\n');

// Now run the corrected script
require('./create-all-missing-dreams.js');