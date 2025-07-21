const fs = require('fs');

console.log('🔍 Checking for missing dream symbols in browse.html\n');

// Get all dream files
const dreamFiles = fs.readdirSync('./dream').filter(file => file.endsWith('.html'));
console.log(`Total dream files found: ${dreamFiles.length}\n`);

// Read browse.html content
const browseContent = fs.readFileSync('browse.html', 'utf8');

// Group files by first letter
const dreamsByLetter = {};
dreamFiles.forEach(file => {
    const letter = file.charAt(0).toUpperCase();
    if (!dreamsByLetter[letter]) {
        dreamsByLetter[letter] = [];
    }
    dreamsByLetter[letter].push(file.replace('.html', ''));
});

// Check each letter
const missingDreams = {};
Object.keys(dreamsByLetter).sort().forEach(letter => {
    const filesForLetter = dreamsByLetter[letter];
    const regex = new RegExp(`dream/${letter.toLowerCase()}[^"]*\\.html`, 'gi');
    const matches = browseContent.match(regex) || [];
    
    const displayedDreams = matches.map(match => 
        match.replace('dream/', '').replace('.html', '')
    );
    
    const missing = filesForLetter.filter(dream => 
        !displayedDreams.includes(dream)
    );
    
    console.log(`${letter}: ${filesForLetter.length} files, ${displayedDreams.length} displayed`);
    
    if (missing.length > 0) {
        console.log(`   Missing: ${missing.join(', ')}`);
        missingDreams[letter] = missing;
    }
});

console.log('\n📊 Summary of missing dreams:');
Object.keys(missingDreams).forEach(letter => {
    console.log(`${letter}: ${missingDreams[letter].join(', ')}`);
});

// Write missing dreams to file for reference
fs.writeFileSync('missing_dreams.txt', 
    Object.keys(missingDreams).map(letter => 
        `${letter}: ${missingDreams[letter].join(', ')}`
    ).join('\n')
);

console.log('\n✅ Missing dreams list saved to missing_dreams.txt');