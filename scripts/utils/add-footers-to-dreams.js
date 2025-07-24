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

console.log(`Found ${dreamFiles.length} dream pages with content to update`);

// Footer content to add
const footerContent = `
    <!-- Footer Container - Loaded dynamically -->
    <div id="footer-container"></div>

    <script src="../assets/js/main.min.js"></script>
    <script src="../assets/js/faith-switcher.min.js"></script>
    <script src="../assets/js/dream-components.js"></script>
</body>
</html>`;

function addFooterToDreamPage(filename) {
    const filePath = path.join(dreamDir, filename);
    
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Check if page already has footer-container
        if (content.includes('footer-container')) {
            console.log(`⏭️  ${filename} already has footer component`);
            return;
        }
        
        // Find the closing script tags and body/html tags
        const scriptPattern = /<script src="\.\.\/assets\/js\/main\.min\.js"><\/script>\s*<script src="\.\.\/assets\/js\/faith-switcher\.min\.js"><\/script>\s*<\/body>\s*<\/html>/;
        
        if (scriptPattern.test(content)) {
            content = content.replace(scriptPattern, footerContent);
            fs.writeFileSync(filePath, content);
            console.log(`✅ Added footer to ${filename}`);
        } else {
            console.log(`⚠️  Could not find script pattern in ${filename}`);
        }
    } catch (error) {
        console.error(`❌ Error updating ${filename}:`, error.message);
    }
}

// Update all dream files
dreamFiles.forEach(addFooterToDreamPage);

console.log('\n🎉 Dream footer addition complete!');