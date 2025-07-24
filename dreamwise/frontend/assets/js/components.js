// Universal Component loader utility
class ComponentLoader {
    static async loadFooter() {
        try {
            // Determine the correct path based on current location
            const isDreamPage = window.location.pathname.includes('/dream/');
            const footerPath = isDreamPage ? '../assets/components/footer.html' : 'assets/components/footer.html';
            
            const response = await fetch(footerPath);
            const footerHTML = await response.text();
            
            // Find footer placeholder or create one
            let footerContainer = document.getElementById('footer-container');
            if (!footerContainer) {
                footerContainer = document.createElement('div');
                footerContainer.id = 'footer-container';
                document.body.appendChild(footerContainer);
            }
            
            // Adjust relative paths in footer content if we're in a dream page
            let adjustedHTML = footerHTML;
            if (isDreamPage) {
                // Convert relative paths to work from dream subdirectory
                adjustedHTML = footerHTML.replace(/href="([^"]*\.html)"/g, (match, url) => {
                    if (!url.startsWith('http') && !url.startsWith('#') && !url.startsWith('../')) {
                        return `href="../${url}"`;
                    }
                    return match;
                });
            }
            
            footerContainer.innerHTML = adjustedHTML;
        } catch (error) {
            console.error('Failed to load footer component:', error);
        }
    }

    static async loadHeader() {
        // Future: load header component
    }

    static async loadAllComponents() {
        await Promise.all([
            this.loadFooter()
        ]);
    }
}

// Auto-load components when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    ComponentLoader.loadAllComponents();
});

// Export for manual usage
window.ComponentLoader = ComponentLoader;