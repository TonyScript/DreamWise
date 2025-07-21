const fs = require('fs');
const path = require('path');

// Get all HTML files in dream directory
const dreamDir = './dream';
const dreamFiles = fs.readdirSync(dreamDir).filter(file => file.endsWith('.html'));

console.log(`Found ${dreamFiles.length} dream pages to update`);

// Footer replacement content for dream pages
const footerReplacement = `    <!-- Footer Container - Loaded dynamically -->
    <div id="footer-container"></div>`;

// JavaScript addition for dream pages
const jsAddition = `    <script src="../assets/js/dream-components.js"></script>`;

function updateDreamFooter(filename) {
    const filePath = path.join(dreamDir, filename);
    
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Find and replace footer section
        const footerStart = content.indexOf('    <!-- Footer -->');
        const footerEnd = content.indexOf('    </footer>') + '    </footer>'.length;
        
        if (footerStart !== -1 && footerEnd !== -1) {
            const beforeFooter = content.substring(0, footerStart);
            const afterFooter = content.substring(footerEnd);
            
            content = beforeFooter + footerReplacement + afterFooter;
            
            // Add dream-components.js if not already present
            if (!content.includes('dream-components.js')) {
                // Replace the existing script tags
                content = content.replace(
                    /    <script src="\.\.\/assets\/js\/main\.min\.js"><\/script>\s*<script src="\.\.\/assets\/js\/faith-switcher\.min\.js"><\/script>/,
                    `    <script src="../assets/js/main.min.js"></script>\n    <script src="../assets/js/faith-switcher.min.js"></script>\n${jsAddition}`
                );
            }
            
            fs.writeFileSync(filePath, content);
            console.log(`✅ Updated ${filename}`);
        } else {
            console.log(`⚠️  Could not find footer in ${filename}`);
        }
    } catch (error) {
        console.error(`❌ Error updating ${filename}:`, error.message);
    }
}

// Update all dream files
dreamFiles.forEach(updateDreamFooter);

console.log('\n🎉 Dream footer update complete!');