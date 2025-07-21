const fs = require('fs');
const path = require('path');

// Get all HTML files in dream directory that have content
const dreamDir = './dream';
const dreamFiles = fs.readdirSync(dreamDir).filter(file => {
    if (!file.endsWith('.html')) return false;
    
    const filePath = path.join(dreamDir, file);
    const stats = fs.statSync(filePath);
    return stats.size > 1000; // Only process files with actual content
});

console.log(`Found ${dreamFiles.length} dream pages to update for unified system`);

function updateDreamPageToUnified(filename) {
    const filePath = path.join(dreamDir, filename);
    
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Replace dream-components.js with components.js
        if (content.includes('../assets/js/dream-components.js')) {
            content = content.replace(
                '../assets/js/dream-components.js',
                '../assets/js/components.js'
            );
            
            fs.writeFileSync(filePath, content);
            console.log(`✅ Updated ${filename} to use unified components.js`);
        } else if (content.includes('components.js')) {
            console.log(`⏭️  ${filename} already uses unified system`);
        } else {
            console.log(`⚠️  ${filename} doesn't have component system`);
        }
    } catch (error) {
        console.error(`❌ Error updating ${filename}:`, error.message);
    }
}

// Update all dream files
dreamFiles.forEach(updateDreamPageToUnified);

console.log('\n🎉 Dream pages unified system update complete!');