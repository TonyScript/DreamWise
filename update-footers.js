const fs = require('fs');
const path = require('path');

// List of HTML files to update (excluding browse.html and categories.html which have different footer styles)
const filesToUpdate = [
    'index.html',
    'insights.html',
    'dream-journal.html',
    'contact.html',
    'faq.html',
    'help-center.html',
    'privacy-policy.html',
    'terms-of-service.html'
];

// Footer replacement content
const footerReplacement = `    <!-- Footer Container - Loaded dynamically -->
    <div id="footer-container"></div>`;

// JavaScript addition
const jsAddition = `    <script src="assets/js/components.js"></script>`;

function updateFooter(filename) {
    try {
        let content = fs.readFileSync(filename, 'utf8');
        
        // Find and replace footer section
        const footerStart = content.indexOf('    <!-- Footer -->');
        const footerEnd = content.indexOf('    </footer>') + '    </footer>'.length;
        
        if (footerStart !== -1 && footerEnd !== -1) {
            const beforeFooter = content.substring(0, footerStart);
            const afterFooter = content.substring(footerEnd);
            
            content = beforeFooter + footerReplacement + afterFooter;
            
            // Add components.js if not already present
            if (!content.includes('assets/js/components.js')) {
                content = content.replace(
                    '    <script src="assets/js/main.min.js"></script>',
                    `    <script src="assets/js/main.min.js"></script>\n${jsAddition}`
                );
            }
            
            fs.writeFileSync(filename, content);
            console.log(`✅ Updated ${filename}`);
        } else {
            console.log(`⚠️  Could not find footer in ${filename}`);
        }
    } catch (error) {
        console.error(`❌ Error updating ${filename}:`, error.message);
    }
}

// Update all files
filesToUpdate.forEach(updateFooter);

console.log('\n🎉 Footer update complete!');