/**
 * Navigation JavaScript for Dream Interpretation Platform
 * Handles smooth scrolling, menu behavior, and navigation interactions
 */

class NavigationManager {
    constructor() {
        this.mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
        this.mobileMenu = document.querySelector('.mobile-menu');
        this.navLinks = document.querySelectorAll('nav a[href^="#"]');
        this.isMenuOpen = false;
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.initializeSmoothScrolling();
        this.initializeActiveNavigation();
        console.log('Navigation manager initialized');
    }
    
    bindEvents() {
        // Mobile menu toggle
        if (this.mobileMenuToggle && this.mobileMenu) {
            this.mobileMenuToggle.addEventListener('click', () => {
                this.toggleMobileMenu();
            });
            
            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (this.isMenuOpen && !e.target.closest('nav')) {
                    this.closeMobileMenu();
                }
            });
            
            // Close menu on escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.isMenuOpen) {
                    this.closeMobileMenu();
                }
            });
        }
        
        // Handle window resize
        window.addEventListener('resize', () => {
            this.handleResize();
        });
        
        // Handle scroll events for navigation highlighting
        window.addEventListener('scroll', () => {
            this.handleScroll();
        });
    }
    
    toggleMobileMenu() {
        if (this.isMenuOpen) {
            this.closeMobileMenu();
        } else {
            this.openMobileMenu();
        }
    }
    
    openMobileMenu() {
        this.mobileMenu.classList.remove('hidden');
        this.mobileMenu.style.opacity = '0';
        this.mobileMenu.style.transform = 'translateY(-10px)';
        
        // Animate in
        setTimeout(() => {
            this.mobileMenu.style.opacity = '1';
            this.mobileMenu.style.transform = 'translateY(0)';
        }, 10);
        
        this.mobileMenuToggle.innerHTML = '<i class="fas fa-times text-xl"></i>';
        this.isMenuOpen = true;
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
    }
    
    closeMobileMenu() {
        this.mobileMenu.style.opacity = '0';
        this.mobileMenu.style.transform = 'translateY(-10px)';
        
        setTimeout(() => {
            this.mobileMenu.classList.add('hidden');
        }, 300);
        
        this.mobileMenuToggle.innerHTML = '<i class="fas fa-bars text-xl"></i>';
        this.isMenuOpen = false;
        
        // Restore body scroll
        document.body.style.overflow = '';
    }
    
    handleResize() {
        // Close mobile menu on desktop
        if (window.innerWidth >= 768 && this.isMenuOpen) {
            this.closeMobileMenu();
        }
        
        // Update navigation layout for different screen sizes
        this.updateNavigationLayout();
        
        // Handle carousel resize if present
        const carousel = document.getElementById('expertCarousel');
        if (carousel) {
            // Trigger carousel update
            window.dispatchEvent(new CustomEvent('carouselResize'));
        }
    }
    
    updateNavigationLayout() {
        const nav = document.querySelector('nav');
        const screenWidth = window.innerWidth;
        
        if (!nav) return;
        
        // Adjust navigation padding and margins based on screen size
        if (screenWidth < 768) {
            nav.style.margin = '8px';
            nav.style.padding = '12px';
        } else if (screenWidth < 1024) {
            nav.style.margin = '12px';
            nav.style.padding = '16px';
        } else {
            nav.style.margin = '16px';
            nav.style.padding = '16px';
        }
    }
    
    initializeSmoothScrolling() {
        // Smooth scrolling for anchor links
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    this.smoothScrollTo(targetElement);
                    
                    // Close mobile menu if open
                    if (this.isMenuOpen) {
                        this.closeMobileMenu();
                    }
                }
            });
        });
        
        // Handle all smooth scroll links on the page
        const allSmoothLinks = document.querySelectorAll('a[href^="#"]:not([href="#"])');
        allSmoothLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const targetId = link.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    e.preventDefault();
                    this.smoothScrollTo(targetElement);
                }
            });
        });
    }
    
    smoothScrollTo(element, offset = 100) {
        const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = elementPosition - offset;
        
        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }
    
    initializeActiveNavigation() {
        // Highlight active navigation based on current page
        const currentPath = window.location.pathname;
        const navLinks = document.querySelectorAll('nav a');
        
        navLinks.forEach(link => {
            const linkPath = new URL(link.href).pathname;
            
            if (linkPath === currentPath || 
                (currentPath === '/' && linkPath.includes('index.html')) ||
                (currentPath.includes('index.html') && linkPath === '/')) {
                link.classList.add('active-nav');
            }
        });
    }
    
    handleScroll() {
        // Add/remove navigation background on scroll
        const nav = document.querySelector('nav');
        if (nav) {
            if (window.scrollY > 50) {
                nav.classList.add('scrolled');
            } else {
                nav.classList.remove('scrolled');
            }
        }
        
        // Update active section highlighting for single-page navigation
        this.updateActiveSectionHighlight();
    }
    
    updateActiveSectionHighlight() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('nav a[href^="#"]');
        
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top;
            const sectionHeight = section.offsetHeight;
            
            if (sectionTop <= 150 && sectionTop + sectionHeight > 150) {
                currentSection = section.getAttribute('id');
            }
        });
        
        // Update navigation highlighting
        navLinks.forEach(link => {
            const href = link.getAttribute('href').substring(1);
            if (href === currentSection) {
                link.classList.add('active-section');
            } else {
                link.classList.remove('active-section');
            }
        });
    }
    
    // Public method to scroll to specific section
    scrollToSection(sectionId) {
        const element = document.getElementById(sectionId);
        if (element) {
            this.smoothScrollTo(element);
        }
    }
    
    // Public method to get current active section
    getCurrentSection() {
        const sections = document.querySelectorAll('section[id]');
        
        for (let section of sections) {
            const rect = section.getBoundingClientRect();
            if (rect.top <= 150 && rect.bottom > 150) {
                return section.getAttribute('id');
            }
        }
        
        return null;
    }
}

// Breadcrumb Navigation Helper
class BreadcrumbManager {
    constructor() {
        this.breadcrumbContainer = document.querySelector('.breadcrumb-nav');
        this.init();
    }
    
    init() {
        if (this.breadcrumbContainer) {
            this.generateBreadcrumbs();
        }
    }
    
    generateBreadcrumbs() {
        const path = window.location.pathname;
        const breadcrumbs = this.getBreadcrumbsFromPath(path);
        
        if (breadcrumbs.length > 1) {
            this.renderBreadcrumbs(breadcrumbs);
        }
    }
    
    getBreadcrumbsFromPath(path) {
        const breadcrumbs = [
            { name: 'Home', url: 'index.html' }
        ];
        
        if (path.includes('browse.html')) {
            breadcrumbs.push({ name: 'A-Z Browse', url: 'browse.html' });
        } else if (path.includes('categories.html')) {
            breadcrumbs.push({ name: 'Categories', url: 'categories.html' });
        } else if (path.includes('insights.html')) {
            breadcrumbs.push({ name: 'Daily Insights', url: 'insights.html' });
        } else if (path.includes('dream/')) {
            breadcrumbs.push({ name: 'Dreams', url: 'browse.html' });
            
            // Extract dream name from path
            const dreamName = path.split('/').pop().replace('.html', '');
            const formattedName = dreamName.charAt(0).toUpperCase() + dreamName.slice(1);
            breadcrumbs.push({ name: `${formattedName} Dreams`, url: path });
        }
        
        return breadcrumbs;
    }
    
    renderBreadcrumbs(breadcrumbs) {
        const breadcrumbHTML = breadcrumbs.map((crumb, index) => {
            const isLast = index === breadcrumbs.length - 1;
            
            if (isLast) {
                return `<span class="text-purple-300">${crumb.name}</span>`;
            } else {
                return `<a href="${crumb.url}" class="text-gray-400 hover:text-white transition-colors duration-300">${crumb.name}</a>`;
            }
        }).join(' <i class="fas fa-chevron-right text-gray-500 mx-2"></i> ');
        
        this.breadcrumbContainer.innerHTML = breadcrumbHTML;
    }
}

// Back to Top Button
class BackToTopButton {
    constructor() {
        this.button = null;
        this.init();
    }
    
    init() {
        this.createButton();
        this.bindEvents();
    }
    
    createButton() {
        this.button = document.createElement('button');
        this.button.className = 'back-to-top fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-all duration-300 opacity-0 pointer-events-none z-50 md:bottom-8 md:right-8 md:w-12 md:h-12';
        this.button.innerHTML = '<i class="fas fa-chevron-up text-lg md:text-base"></i>';
        this.button.setAttribute('aria-label', 'Back to top');
        
        // Add touch-friendly styles for mobile
        this.button.style.minHeight = '56px';
        this.button.style.minWidth = '56px';
        this.button.style.touchAction = 'manipulation';
        this.button.style.webkitTapHighlightColor = 'transparent';
        
        // Responsive adjustments
        if (window.innerWidth < 768) {
            this.button.style.bottom = '24px';
            this.button.style.right = '24px';
            this.button.style.width = '56px';
            this.button.style.height = '56px';
        }
        
        document.body.appendChild(this.button);
    }
    
    bindEvents() {
        // Show/hide button based on scroll position
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                this.showButton();
            } else {
                this.hideButton();
            }
        });
        
        // Scroll to top on click
        this.button.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    showButton() {
        this.button.style.opacity = '1';
        this.button.style.pointerEvents = 'auto';
        this.button.style.transform = 'scale(1)';
    }
    
    hideButton() {
        this.button.style.opacity = '0';
        this.button.style.pointerEvents = 'none';
        this.button.style.transform = 'scale(0.8)';
    }
}

// Auto-initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize navigation manager
    window.navigationManager = new NavigationManager();
    
    // Initialize breadcrumb manager
    window.breadcrumbManager = new BreadcrumbManager();
    
    // Initialize back to top button
    window.backToTopButton = new BackToTopButton();
    
    console.log('Navigation system initialized');
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { NavigationManager, BreadcrumbManager, BackToTopButton };
}

// Make available globally
window.NavigationManager = NavigationManager;
window.BreadcrumbManager = BreadcrumbManager;
window.BackToTopButton = BackToTopButton;