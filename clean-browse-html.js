const fs = require('fs');

console.log('🔧 Cleaning browse.html structure...\n');

// Read browse.html
let content = fs.readFileSync('browse.html', 'utf8');

// Remove all instances of the extra </div> tags that are breaking the structure
// Pattern: </div> </div> should become just </div>
content = content.replace(/(<\/div>)\s*<\/div>/g, '$1');

// Also fix any remaining pattern where we have icon div followed by extra closing div
content = content.replace(/(<i class="[^"]*"[^>]*><\/i>\s*<\/div>)\s*<\/div>/g, '$1');

// Count how many fixes were made
const originalLength = fs.readFileSync('browse.html', 'utf8').length;
const newLength = content.length;
const changesMade = originalLength - newLength;

// Write the cleaned content back
fs.writeFileSync('browse.html', content);

console.log(`✅ Cleaned browse.html structure`);
console.log(`📊 Removed ${changesMade} characters (extra div tags)`);
console.log('🎉 Browse page should now display correctly!');