/**
 * Faith Perspective Switcher for Dream Interpretation Pages
 * Handles smooth transitions between different religious perspectives
 */

class FaithSwitcher {
    constructor() {
        this.currentFaith = 'general';
        this.faithTabs = document.querySelectorAll('.faith-tab');
        this.faithContents = document.querySelectorAll('.faith-content');
        this.transitionDuration = 300;
        
        this.init();
    }
    
    init() {
        if (!this.faithTabs.length || !this.faithContents.length) {
            console.log('Faith switcher elements not found');
            return;
        }
        
        this.bindEvents();
        this.setInitialState();
        console.log('Faith switcher initialized');
    }
    
    bindEvents() {
        this.faithTabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                e.preventDefault();
                const targetFaith = tab.getAttribute('data-faith');
                this.switchFaith(targetFaith);
            });
            
            // Add keyboard navigation support
            tab.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    const targetFaith = tab.getAttribute('data-faith');
                    this.switchFaith(targetFaith);
                }
            });
        });
        
        // Add keyboard navigation between tabs
        document.addEventListener('keydown', (e) => {
            if (e.target.classList.contains('faith-tab')) {
                this.handleKeyboardNavigation(e);
            }
        });
    }
    
    setInitialState() {
        // Set the first tab as active by default
        const firstTab = this.faithTabs[0];
        const firstContent = this.faithContents[0];
        
        if (firstTab && firstContent) {
            firstTab.classList.add('active');
            firstContent.classList.add('active');
            this.currentFaith = firstTab.getAttribute('data-faith');
        }
    }
    
    switchFaith(targetFaith) {
        if (targetFaith === this.currentFaith) {
            return; // Already active
        }
        
        const targetTab = document.querySelector(`[data-faith="${targetFaith}"]`);
        const targetContent = document.getElementById(`${targetFaith}-content`);
        
        if (!targetTab || !targetContent) {
            console.error(`Faith content not found: ${targetFaith}`);
            return;
        }
        
        // Start transition
        this.startTransition(targetFaith, targetTab, targetContent);
    }
    
    startTransition(targetFaith, targetTab, targetContent) {
        // Phase 1: Fade out current content
        const currentContent = document.querySelector('.faith-content.active');
        
        if (currentContent) {
            currentContent.style.opacity = '0';
            currentContent.style.transform = 'translateY(-20px)';
            
            setTimeout(() => {
                // Phase 2: Switch content and fade in
                this.updateActiveStates(targetTab, targetContent);
                this.fadeInNewContent(targetContent);
                this.currentFaith = targetFaith;
                
                // Analytics tracking (optional)
                this.trackFaithSwitch(targetFaith);
            }, this.transitionDuration);
        } else {
            // No current content, just switch directly
            this.updateActiveStates(targetTab, targetContent);
            this.fadeInNewContent(targetContent);
            this.currentFaith = targetFaith;
        }
    }
    
    updateActiveStates(targetTab, targetContent) {
        // Remove active class from all tabs and contents
        this.faithTabs.forEach(tab => {
            tab.classList.remove('active');
            tab.setAttribute('aria-selected', 'false');
        });
        
        this.faithContents.forEach(content => {
            content.classList.remove('active');
            content.setAttribute('aria-hidden', 'true');
        });
        
        // Add active class to target elements
        targetTab.classList.add('active');
        targetTab.setAttribute('aria-selected', 'true');
        targetContent.classList.add('active');
        targetContent.setAttribute('aria-hidden', 'false');
    }
    
    fadeInNewContent(targetContent) {
        // Reset transform and opacity for smooth fade-in
        targetContent.style.opacity = '0';
        targetContent.style.transform = 'translateY(20px)';
        
        // Force reflow
        targetContent.offsetHeight;
        
        // Animate in
        setTimeout(() => {
            targetContent.style.opacity = '1';
            targetContent.style.transform = 'translateY(0)';
        }, 50);
    }
    
    handleKeyboardNavigation(e) {
        const currentIndex = Array.from(this.faithTabs).indexOf(e.target);
        let targetIndex;
        
        switch(e.key) {
            case 'ArrowLeft':
                e.preventDefault();
                targetIndex = currentIndex > 0 ? currentIndex - 1 : this.faithTabs.length - 1;
                break;
            case 'ArrowRight':
                e.preventDefault();
                targetIndex = currentIndex < this.faithTabs.length - 1 ? currentIndex + 1 : 0;
                break;
            case 'Home':
                e.preventDefault();
                targetIndex = 0;
                break;
            case 'End':
                e.preventDefault();
                targetIndex = this.faithTabs.length - 1;
                break;
            default:
                return;
        }
        
        if (targetIndex !== undefined) {
            this.faithTabs[targetIndex].focus();
            const targetFaith = this.faithTabs[targetIndex].getAttribute('data-faith');
            this.switchFaith(targetFaith);
        }
    }
    
    trackFaithSwitch(faith) {
        // Optional analytics tracking
        if (typeof gtag !== 'undefined') {
            gtag('event', 'faith_perspective_switch', {
                'faith_perspective': faith,
                'page_location': window.location.href
            });
        }
        
        console.log(`Switched to ${faith} perspective`);
    }
    
    // Public method to programmatically switch faith
    switchToFaith(faith) {
        this.switchFaith(faith);
    }
    
    // Public method to get current faith
    getCurrentFaith() {
        return this.currentFaith;
    }
    
    // Public method to get available faiths
    getAvailableFaiths() {
        return Array.from(this.faithTabs).map(tab => tab.getAttribute('data-faith'));
    }
}

// Auto-initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize faith switcher
    window.faithSwitcher = new FaithSwitcher();
    
    // Initialize expandable sections
    initializeExpandableSections();
    
    // Handle hash navigation for direct links to sections
    handleHashNavigation();
    
    // Add smooth scrolling to faith content when switching
    const faithContentContainer = document.querySelector('.faith-content-container');
    if (faithContentContainer) {
        // Scroll to content when faith is switched on mobile
        window.addEventListener('resize', function() {
            if (window.innerWidth < 768) {
                const activeContent = document.querySelector('.faith-content.active');
                if (activeContent) {
                    setTimeout(() => {
                        activeContent.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }, 350);
                }
            }
        });
    }
    
    // Listen for hash changes
    window.addEventListener('hashchange', handleHashNavigation);
});

// Toggle expandable interpretation sections
function toggleSection(sectionElement) {
    const isExpanded = sectionElement.classList.contains('expanded');
    
    if (isExpanded) {
        // Collapse section
        sectionElement.classList.remove('expanded');
        sectionElement.setAttribute('aria-expanded', 'false');
    } else {
        // Expand section
        sectionElement.classList.add('expanded');
        sectionElement.setAttribute('aria-expanded', 'true');
        
        // Optional: Scroll section into view if needed
        setTimeout(() => {
            const rect = sectionElement.getBoundingClientRect();
            const isVisible = rect.top >= 0 && rect.bottom <= window.innerHeight;
            
            if (!isVisible) {
                sectionElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest'
                });
            }
        }, 300);
    }
}

// Initialize expandable sections
function initializeExpandableSections() {
    const expandableSections = document.querySelectorAll('.interpretation-section.expandable');
    
    expandableSections.forEach(section => {
        // Add ARIA attributes for accessibility
        section.setAttribute('role', 'button');
        section.setAttribute('aria-expanded', 'false');
        section.setAttribute('tabindex', '0');
        
        // Add keyboard support
        section.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleSection(section);
            }
        });
        
        // Add focus styles
        section.addEventListener('focus', () => {
            section.style.outline = '2px solid #8b5cf6';
            section.style.outlineOffset = '2px';
        });
        
        section.addEventListener('blur', () => {
            section.style.outline = 'none';
        });
    });
}

// Auto-expand sections based on URL hash
function handleHashNavigation() {
    const hash = window.location.hash;
    if (hash) {
        const targetSection = document.querySelector(hash);
        if (targetSection && targetSection.classList.contains('expandable')) {
            setTimeout(() => {
                toggleSection(targetSection);
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }, 500);
        }
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FaithSwitcher;
}

// Make available globally
window.FaithSwitcher = FaithSwitcher;
window.toggleSection = toggleSection;