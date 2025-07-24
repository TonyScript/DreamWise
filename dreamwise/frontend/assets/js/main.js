/**
 * Main JavaScript file for Dream Interpretation Platform
 * Handles core functionality, animations, and interactions
 */

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Dream Interpretation Platform initialized');
    
    // Initialize core functionality
    initializeAnimations();
    initializeScrollEffects();
    initializeResponsiveFeatures();
    initializeExpertCarousel();
    initializeRelatedDreams();
    
    // Initialize page-specific functionality
    initializePageSpecificFeatures();
    
    // Initialize dream card animations
    initializeDreamCardAnimations();
});

/**
 * Initialize CSS animations and floating effects
 */
function initializeAnimations() {
    // Add enhanced floating animation to elements with .floating class
    const floatingElements = document.querySelectorAll('.floating');
    floatingElements.forEach((element, index) => {
        element.style.animationDelay = `${index * 2}s`;
        
        // Add specific floating classes based on element type
        const icon = element.querySelector('i');
        if (icon) {
            if (icon.classList.contains('fa-star')) {
                element.classList.add(index % 2 === 0 ? 'hero-float-star-1' : 'hero-float-star-2');
            } else if (icon.classList.contains('fa-moon')) {
                element.classList.add('hero-float-moon');
            } else if (icon.classList.contains('fa-circle') || icon.classList.contains('fa-adjust')) {
                element.classList.add('hero-float-orb');
            }
        }
    });
    
    // Initialize page transition animations
    initializePageTransitions();
    
    // Initialize scroll-triggered animations
    initializeScrollAnimations();
    
    // Initialize enhanced hover effects
    initializeEnhancedHoverEffects();
}

/**
 * Initialize smooth scrolling effects
 */
function initializeScrollEffects() {
    // Smooth scrolling for anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

/**
 * Initialize responsive features and mobile optimizations
 */
function initializeResponsiveFeatures() {
    // Handle mobile menu toggle if present
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    if (mobileMenuToggle && mobileMenu) {
        // Enhanced mobile menu toggle with animations
        mobileMenuToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            toggleMobileMenu();
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!e.target.closest('nav') && !mobileMenu.classList.contains('hidden')) {
                closeMobileMenu();
            }
        });
        
        // Close menu on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && !mobileMenu.classList.contains('hidden')) {
                closeMobileMenu();
            }
        });
        
        // Close menu when clicking on menu links
        const mobileMenuLinks = mobileMenu.querySelectorAll('a');
        mobileMenuLinks.forEach(link => {
            link.addEventListener('click', function() {
                setTimeout(() => closeMobileMenu(), 300);
            });
        });
    }
    
    // Handle window resize events
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            handleResponsiveLayout();
            handleOrientationChange();
        }, 150);
    });
    
    // Handle orientation change
    window.addEventListener('orientationchange', function() {
        setTimeout(() => {
            handleOrientationChange();
            handleResponsiveLayout();
        }, 100);
    });
    
    // Initialize touch interactions
    initializeTouchInteractions();
    
    // Initialize viewport height fix for mobile browsers
    initializeViewportFix();
    
    // Initialize performance optimizations
    initializePerformanceOptimizations();
}

/**
 * Handle responsive layout adjustments
 */
function handleResponsiveLayout() {
    const screenWidth = window.innerWidth;
    
    // Mobile optimizations
    if (screenWidth < 768) {
        document.body.classList.add('mobile-view');
    } else {
        document.body.classList.remove('mobile-view');
    }
}

/**
 * Initialize Expert Carousel with touch/swipe support
 */
function initializeExpertCarousel() {
    const carousel = document.getElementById('expertCarousel');
    const prevButton = document.querySelector('.expert-carousel-prev');
    const nextButton = document.querySelector('.expert-carousel-next');
    const indicators = document.querySelectorAll('.carousel-indicator');
    
    if (!carousel) return;
    
    let currentSlide = 0;
    let isTransitioning = false;
    let touchStartX = 0;
    let touchEndX = 0;
    let autoSlideInterval;
    
    // Get responsive slide count
    function getSlidesPerView() {
        const screenWidth = window.innerWidth;
        if (screenWidth >= 1024) return 3; // lg: 3 slides
        if (screenWidth >= 768) return 2;  // md: 2 slides
        return 1; // mobile: 1 slide
    }
    
    // Get total number of slides
    function getTotalSlides() {
        const expertCards = carousel.querySelectorAll('.expert-card');
        const slidesPerView = getSlidesPerView();
        return Math.max(0, expertCards.length - slidesPerView + 1);
    }
    
    // Update carousel position
    function updateCarousel(slideIndex, smooth = true) {
        if (isTransitioning) return;
        
        const totalSlides = getTotalSlides();
        currentSlide = Math.max(0, Math.min(slideIndex, totalSlides - 1));
        
        const slideWidth = 100 / getSlidesPerView();
        const translateX = -(currentSlide * slideWidth);
        
        if (smooth) {
            isTransitioning = true;
            carousel.style.transition = 'transform 0.5s ease-in-out';
            setTimeout(() => {
                isTransitioning = false;
            }, 500);
        } else {
            carousel.style.transition = 'none';
        }
        
        carousel.style.transform = `translateX(${translateX}%)`;
        updateIndicators();
        updateNavigationButtons();
    }
    
    // Update indicator states
    function updateIndicators() {
        const totalSlides = getTotalSlides();
        const indicatorsToShow = Math.min(4, totalSlides);
        
        indicators.forEach((indicator, index) => {
            if (index < indicatorsToShow) {
                indicator.style.display = 'block';
                indicator.classList.toggle('active', index === currentSlide);
            } else {
                indicator.style.display = 'none';
            }
        });
    }
    
    // Update navigation button states
    function updateNavigationButtons() {
        const totalSlides = getTotalSlides();
        
        if (prevButton) {
            prevButton.style.opacity = currentSlide === 0 ? '0.3' : '0.8';
            prevButton.style.pointerEvents = currentSlide === 0 ? 'none' : 'auto';
        }
        
        if (nextButton) {
            nextButton.style.opacity = currentSlide >= totalSlides - 1 ? '0.3' : '0.8';
            nextButton.style.pointerEvents = currentSlide >= totalSlides - 1 ? 'none' : 'auto';
        }
    }
    
    // Navigate to previous slide
    function prevSlide() {
        if (currentSlide > 0) {
            updateCarousel(currentSlide - 1);
        }
    }
    
    // Navigate to next slide
    function nextSlide() {
        const totalSlides = getTotalSlides();
        if (currentSlide < totalSlides - 1) {
            updateCarousel(currentSlide + 1);
        }
    }
    
    // Auto-slide functionality
    function startAutoSlide() {
        stopAutoSlide();
        autoSlideInterval = setInterval(() => {
            const totalSlides = getTotalSlides();
            if (currentSlide >= totalSlides - 1) {
                updateCarousel(0);
            } else {
                nextSlide();
            }
        }, 5000); // 5 seconds
    }
    
    function stopAutoSlide() {
        if (autoSlideInterval) {
            clearInterval(autoSlideInterval);
            autoSlideInterval = null;
        }
    }
    
    // Touch/swipe handling
    function handleTouchStart(e) {
        touchStartX = e.touches[0].clientX;
        stopAutoSlide();
    }
    
    function handleTouchMove(e) {
        // Prevent default scrolling behavior during swipe
        if (Math.abs(e.touches[0].clientX - touchStartX) > 10) {
            e.preventDefault();
        }
    }
    
    function handleTouchEnd(e) {
        touchEndX = e.changedTouches[0].clientX;
        handleSwipe();
        startAutoSlide();
    }
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const swipeDistance = touchStartX - touchEndX;
        
        if (Math.abs(swipeDistance) > swipeThreshold) {
            if (swipeDistance > 0) {
                // Swipe left - next slide
                nextSlide();
            } else {
                // Swipe right - previous slide
                prevSlide();
            }
        }
    }
    
    // Event listeners
    if (prevButton) {
        prevButton.addEventListener('click', prevSlide);
    }
    
    if (nextButton) {
        nextButton.addEventListener('click', nextSlide);
    }
    
    // Indicator click handlers
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            updateCarousel(index);
            stopAutoSlide();
            startAutoSlide();
        });
    });
    
    // Touch event listeners
    carousel.addEventListener('touchstart', handleTouchStart, { passive: false });
    carousel.addEventListener('touchmove', handleTouchMove, { passive: false });
    carousel.addEventListener('touchend', handleTouchEnd, { passive: true });
    
    // Mouse event listeners for desktop drag (optional enhancement)
    let isDragging = false;
    let dragStartX = 0;
    
    carousel.addEventListener('mousedown', (e) => {
        isDragging = true;
        dragStartX = e.clientX;
        carousel.style.cursor = 'grabbing';
        stopAutoSlide();
        e.preventDefault();
    });
    
    carousel.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
    });
    
    carousel.addEventListener('mouseup', (e) => {
        if (!isDragging) return;
        isDragging = false;
        carousel.style.cursor = 'grab';
        
        const dragDistance = dragStartX - e.clientX;
        const dragThreshold = 50;
        
        if (Math.abs(dragDistance) > dragThreshold) {
            if (dragDistance > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }
        
        startAutoSlide();
    });
    
    carousel.addEventListener('mouseleave', () => {
        if (isDragging) {
            isDragging = false;
            carousel.style.cursor = 'grab';
            startAutoSlide();
        }
    });
    
    // Pause auto-slide on hover
    const carouselContainer = carousel.closest('.expert-carousel-container');
    if (carouselContainer) {
        carouselContainer.addEventListener('mouseenter', stopAutoSlide);
        carouselContainer.addEventListener('mouseleave', startAutoSlide);
    }
    
    // Handle window resize
    function handleCarouselResize() {
        updateCarousel(currentSlide, false);
    }
    
    window.addEventListener('resize', handleCarouselResize);
    
    // Initialize carousel
    updateCarousel(0, false);
    startAutoSlide();
    
    // Set cursor style
    carousel.style.cursor = 'grab';
}

/**
 * Initialize page-specific features based on current page
 */
function initializePageSpecificFeatures() {
    const currentPath = window.location.pathname;
    const currentPage = currentPath.split('/').pop() || 'index.html';
    
    console.log(`Initializing features for page: ${currentPage}`);
    
    // Initialize features based on current page
    switch(currentPage) {
        case 'index.html':
        case '':
        case '/':
            initializeHomePage();
            break;
        case 'browse.html':
            initializeBrowsePage();
            break;
        case 'categories.html':
            initializeCategoriesPage();
            break;
        case 'insights.html':
            initializeInsightsPage();
            break;
        default:
            // Check if it's a dream interpretation page
            if (currentPath.includes('/dream/') || currentPage.includes('dream')) {
                initializeDreamPage();
            }
            break;
    }
    
    // Initialize common features for all pages
    initializeCommonFeatures();
}

/**
 * Initialize homepage-specific features
 */
function initializeHomePage() {
    console.log('Initializing homepage features');
    
    // Add hover effects to navigation cards
    addHoverEffects('.nav-card');
    addHoverEffects('.popular-dream-card');
    
    // Initialize hero section animations
    initializeHeroAnimations();
}

/**
 * Initialize categories page features
 */
function initializeCategoriesPage() {
    console.log('Initializing categories page features');
    
    // Categories page functionality is already handled in the HTML
    // Add any additional enhancements here
    addHoverEffects('.category-card');
}

/**
 * Initialize dream interpretation page features
 */
function initializeDreamPage() {
    console.log('Initializing dream interpretation page features');
    
    // Faith switcher is already initialized separately
    // Add any additional dream page features here
    addHoverEffects('.related-dream-card');
}

/**
 * Initialize hero section animations
 */
function initializeHeroAnimations() {
    const heroElements = document.querySelectorAll('.hero-animate');
    
    heroElements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'all 0.8s ease';
        
        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, index * 200);
    });
}

/**
 * Initialize common features for all pages
 */
function initializeCommonFeatures() {
    // Add hover effects to common elements
    addHoverEffects('.glass-card');
    addHoverEffects('.hover-scale');
    
    // Initialize loading states
    initializeLoadingStates();
    
    // Initialize accessibility features
    initializeAccessibilityFeatures();
}

/**
 * Initialize loading states for dynamic content
 */
function initializeLoadingStates() {
    // Add loading class to elements that might need it
    const dynamicElements = document.querySelectorAll('[data-loading]');
    
    dynamicElements.forEach(element => {
        element.classList.add('loading');
        
        // Remove loading state after content loads
        setTimeout(() => {
            element.classList.remove('loading');
        }, 1000);
    });
}

/**
 * Initialize accessibility features
 */
function initializeAccessibilityFeatures() {
    // Add focus indicators for keyboard navigation
    const focusableElements = document.querySelectorAll('button, a, input, select, textarea, [tabindex]:not([tabindex="-1"])');
    
    focusableElements.forEach(element => {
        element.addEventListener('focus', function() {
            this.classList.add('keyboard-focus');
        });
        
        element.addEventListener('blur', function() {
            this.classList.remove('keyboard-focus');
        });
        
        // Remove focus class on mouse interaction
        element.addEventListener('mousedown', function() {
            this.classList.remove('keyboard-focus');
        });
    });
    
    // Add skip to content link functionality
    const skipLink = document.querySelector('.skip-to-content');
    if (skipLink) {
        skipLink.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.focus();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
}

/**
 * Utility function for adding hover effects
 */
function addHoverEffects(selector) {
    const elements = document.querySelectorAll(selector);
    elements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            this.classList.add('hover-active');
        });
        
        element.addEventListener('mouseleave', function() {
            this.classList.remove('hover-active');
        });
    });
}

/**
 * Initialize Browse Page functionality
 */
function initializeBrowsePage() {
    console.log('Initializing browse page functionality');
    
    // Initialize alphabet navigation
    initializeAlphabetNavigation();
    
    // Initialize intersection observer for active letter detection
    initializeLetterObserver();
    
    // Initialize smooth scrolling for letter buttons
    initializeLetterScrolling();
    
    // Initialize search functionality for browse page
    initializeBrowsePageSearch();
}

/**
 * Initialize alphabet navigation functionality
 */
function initializeAlphabetNavigation() {
    const letterButtons = document.querySelectorAll('.letter-btn');
    const letterSections = document.querySelectorAll('.letter-section');
    
    if (!letterButtons.length || !letterSections.length) return;
    
    // Add click handlers to letter buttons
    letterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const letter = this.getAttribute('data-letter');
            const targetSection = document.getElementById(`letter-${letter}`);
            
            if (targetSection) {
                // Update active state
                updateActiveLetterButton(letter);
                
                // Smooth scroll to section
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

/**
 * Update active state of letter buttons
 */
function updateActiveLetterButton(activeLetter) {
    const letterButtons = document.querySelectorAll('.letter-btn');
    
    letterButtons.forEach(button => {
        const letter = button.getAttribute('data-letter');
        if (letter === activeLetter) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });
}

/**
 * Initialize intersection observer to detect which letter section is in view
 */
function initializeLetterObserver() {
    const letterSections = document.querySelectorAll('.letter-section');
    
    if (!letterSections.length) return;
    
    const observerOptions = {
        root: null,
        rootMargin: '-120px 0px -50% 0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.id;
                const letter = sectionId.replace('letter-', '');
                updateActiveLetterButton(letter);
            }
        });
    }, observerOptions);
    
    letterSections.forEach(section => {
        observer.observe(section);
    });
}

/**
 * Initialize smooth scrolling for letter navigation
 */
function initializeLetterScrolling() {
    // Handle keyboard navigation
    document.addEventListener('keydown', function(e) {
        const letterButtons = document.querySelectorAll('.letter-btn');
        const activeButton = document.querySelector('.letter-btn.active');
        
        if (!activeButton || !letterButtons.length) return;
        
        let targetButton = null;
        const currentIndex = Array.from(letterButtons).indexOf(activeButton);
        
        switch(e.key) {
            case 'ArrowLeft':
                e.preventDefault();
                targetButton = letterButtons[Math.max(0, currentIndex - 1)];
                break;
            case 'ArrowRight':
                e.preventDefault();
                targetButton = letterButtons[Math.min(letterButtons.length - 1, currentIndex + 1)];
                break;
            case 'Home':
                e.preventDefault();
                targetButton = letterButtons[0];
                break;
            case 'End':
                e.preventDefault();
                targetButton = letterButtons[letterButtons.length - 1];
                break;
        }
        
        if (targetButton) {
            targetButton.click();
            targetButton.focus();
        }
    });
    
    // Handle mobile swipe navigation on alphabet bar
    const alphabetNav = document.querySelector('.alphabet-nav');
    if (alphabetNav) {
        let startX = 0;
        let scrollLeft = 0;
        
        alphabetNav.addEventListener('touchstart', function(e) {
            startX = e.touches[0].pageX - alphabetNav.offsetLeft;
            scrollLeft = alphabetNav.scrollLeft;
        });
        
        alphabetNav.addEventListener('touchmove', function(e) {
            e.preventDefault();
            const x = e.touches[0].pageX - alphabetNav.offsetLeft;
            const walk = (x - startX) * 2;
            alphabetNav.scrollLeft = scrollLeft - walk;
        });
    }
}
    
    // Handle mobile swipe navigation on alphabet bar
    const alphabetNav = document.querySelector('.alphabet-nav');
    if (alphabetNav) {
        let startX = 0;
        let scrollLeft = 0;
        
        alphabetNav.addEventListener('touchstart', function(e) {
            startX = e.touches[0].pageX - alphabetNav.offsetLeft;
            scrollLeft = alphabetNav.scrollLeft;
        });
        
        alphabetNav.addEventListener('touchmove', function(e) {
            e.preventDefault();
            const x = e.touches[0].pageX - alphabetNav.offsetLeft;
            const walk = (x - startX) * 2;
            alphabetNav.scrollLeft = scrollLeft - walk;
        });
    }

/**
 * Initialize search functionality for browse page
 */
function initializeBrowsePageSearch() {
    // Create search interface if it doesn't exist
    createBrowseSearchInterface();
    
    // Initialize search functionality
    const searchInput = document.getElementById('browse-search');
    const dreamCards = document.querySelectorAll('.dream-symbol-card');
    const clearButton = document.getElementById('browse-search-clear');
    
    if (!searchInput || !dreamCards.length) return;
    
    // Search input event listener
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase().trim();
        
        // Show/hide clear button
        if (clearButton) {
            clearButton.style.display = searchTerm ? 'block' : 'none';
        }
        
        // Filter dream cards
        dreamCards.forEach(card => {
            const symbolName = card.querySelector('h3, .symbol-name')?.textContent.toLowerCase() || '';
            const symbolDescription = card.querySelector('p, .symbol-description')?.textContent.toLowerCase() || '';
            
            const matches = symbolName.includes(searchTerm) || 
                           symbolDescription.includes(searchTerm);
            
            if (matches || searchTerm === '') {
                card.style.display = 'block';
                card.style.opacity = '1';
                card.style.transform = 'scale(1)';
            } else {
                card.style.display = 'none';
                card.style.opacity = '0';
                card.style.transform = 'scale(0.8)';
            }
        });
        
        // Update letter sections visibility
        updateLetterSectionVisibility();
        
        // Update search results count
        updateSearchResultsCount(searchTerm);
    });
    
    // Clear button functionality
    if (clearButton) {
        clearButton.addEventListener('click', function() {
            searchInput.value = '';
            searchInput.dispatchEvent(new Event('input'));
            searchInput.focus();
        });
    }
    
    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + F to focus search
        if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
            e.preventDefault();
            searchInput.focus();
        }
        
        // Escape to clear search
        if (e.key === 'Escape' && document.activeElement === searchInput) {
            searchInput.value = '';
            searchInput.dispatchEvent(new Event('input'));
        }
    });
}

/**
 * Create search interface for browse page
 */
function createBrowseSearchInterface() {
    // Check if search interface already exists
    if (document.getElementById('browse-search')) return;
    
    // Find the container to insert search (after hero section, before alphabet nav)
    const heroSection = document.querySelector('.hero-section');
    const alphabetNav = document.querySelector('.alphabet-nav')?.parentElement;
    
    if (!heroSection || !alphabetNav) return;
    
    // Create search section
    const searchSection = document.createElement('div');
    searchSection.className = 'search-section py-8 bg-gradient-to-b from-purple-900/50 to-transparent';
    searchSection.innerHTML = `
        <div class="container mx-auto px-6">
            <div class="max-w-2xl mx-auto">
                <div class="glass-card p-6">
                    <div class="relative">
                        <input 
                            type="text" 
                            id="browse-search" 
                            placeholder="Search dream symbols..." 
                            class="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 pl-12 pr-12 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                        >
                        <i class="fas fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                        <button 
                            id="browse-search-clear" 
                            class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-300 hidden"
                            aria-label="Clear search"
                        >
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="mt-4 text-center">
                        <p class="text-sm text-gray-400" id="search-results-count">
                            Search through our comprehensive dream symbol dictionary
                        </p>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Insert search section
    heroSection.parentNode.insertBefore(searchSection, alphabetNav);
}

/**
 * Update search results count display
 */
function updateSearchResultsCount(searchTerm) {
    const resultsElement = document.getElementById('search-results-count');
    if (!resultsElement) return;
    
    if (!searchTerm) {
        resultsElement.textContent = 'Search through our comprehensive dream symbol dictionary';
        return;
    }
    
    const visibleCards = document.querySelectorAll('.dream-symbol-card[style*="display: block"], .dream-symbol-card:not([style*="display: none"])');
    const count = visibleCards.length;
    
    if (count === 0) {
        resultsElement.innerHTML = `<span class="text-red-400">No symbols found for "${searchTerm}"</span>`;
    } else if (count === 1) {
        resultsElement.innerHTML = `<span class="text-green-400">Found 1 symbol for "${searchTerm}"</span>`;
    } else {
        resultsElement.innerHTML = `<span class="text-green-400">Found ${count} symbols for "${searchTerm}"</span>`;
    }
}

/**
 * Add search functionality for dream symbols (UI only) - Legacy function
 */
function initializeDreamSymbolSearch() {
    // This function is now handled by initializeBrowsePageSearch
    // Keeping for backward compatibility
    initializeBrowsePageSearch();
}

/**
 * Update visibility of letter sections based on visible cards
 */
function updateLetterSectionVisibility() {
    const letterSections = document.querySelectorAll('.letter-section');
    
    letterSections.forEach(section => {
        const visibleCards = section.querySelectorAll('.dream-symbol-card[style*="display: block"], .dream-symbol-card:not([style*="display: none"])');
        
        if (visibleCards.length === 0) {
            section.style.display = 'none';
        } else {
            section.style.display = 'block';
        }
    });
}

/**
 * Add loading animation for dream symbol cards
 */
function initializeDreamCardAnimations() {
    const dreamCards = document.querySelectorAll('.dream-symbol-card');
    
    dreamCards.forEach((card, index) => {
        // Add staggered animation delay
        card.style.animationDelay = `${index * 0.05}s`;
        
        // Add intersection observer for scroll animations
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '50px'
        });
        
        observer.observe(card);
    });
}

/**
 * Initialize Word Cloud functionality for insights page
 */
function initializeWordCloud() {
    console.log('Initializing word cloud functionality');
    
    const wordCloudItems = document.querySelectorAll('.word-cloud-item');
    const tooltip = document.getElementById('popularity-tooltip');
    
    if (!wordCloudItems.length || !tooltip) return;
    
    // Add hover effects and tooltip functionality
    wordCloudItems.forEach(item => {
        // Mouse enter event
        item.addEventListener('mouseenter', function(e) {
            showPopularityTooltip(e, this);
        });
        
        // Mouse move event for tooltip positioning
        item.addEventListener('mousemove', function(e) {
            updateTooltipPosition(e);
        });
        
        // Mouse leave event
        item.addEventListener('mouseleave', function() {
            hidePopularityTooltip();
        });
        
        // Add click analytics (optional)
        item.addEventListener('click', function() {
            const symbolName = this.textContent.trim();
            const popularity = this.getAttribute('data-popularity');
            console.log(`Clicked on ${symbolName} (popularity: ${popularity})`);
        });
    });
    
    // Initialize word cloud animations
    initializeWordCloudAnimations();
}

/**
 * Show popularity tooltip with symbol metrics
 */
function showPopularityTooltip(event, element) {
    const tooltip = document.getElementById('popularity-tooltip');
    if (!tooltip) return;
    
    const symbolName = element.textContent.trim();
    const popularity = element.getAttribute('data-popularity') || '0';
    const category = element.getAttribute('data-category') || 'general';
    
    // Get category color and icon
    const categoryInfo = getCategoryInfo(category);
    
    // Create enhanced tooltip content
    const tooltipContent = tooltip.querySelector('.tooltip-content');
    tooltipContent.innerHTML = `
        <div class="font-semibold text-white mb-2 text-center">${symbolName}</div>
        <div class="flex items-center justify-center mb-1">
            <div class="w-3 h-3 rounded-full mr-2" style="background-color: ${categoryInfo.color}"></div>
            <span class="text-xs text-gray-300 capitalize">${category}</span>
        </div>
        <div class="text-xs text-gray-300 mb-1 text-center">
            <i class="fas fa-chart-line mr-1"></i>
            Popularity: ${popularity}%
        </div>
        <div class="text-xs text-gray-400 text-center">
            ${getPopularityDescription(popularity)}
        </div>
    `;
    
    // Position and show tooltip
    updateTooltipPosition(event);
    tooltip.style.opacity = '1';
    tooltip.style.pointerEvents = 'auto';
}

/**
 * Update tooltip position based on mouse coordinates
 */
function updateTooltipPosition(event) {
    const tooltip = document.getElementById('popularity-tooltip');
    if (!tooltip) return;
    
    const tooltipRect = tooltip.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    let left = event.clientX - tooltipRect.width / 2;
    let top = event.clientY - tooltipRect.height - 10;
    
    // Adjust if tooltip goes off screen
    if (left < 10) left = 10;
    if (left + tooltipRect.width > viewportWidth - 10) {
        left = viewportWidth - tooltipRect.width - 10;
    }
    
    if (top < 10) {
        top = event.clientY + 10; // Show below cursor instead
    }
    
    tooltip.style.left = `${left}px`;
    tooltip.style.top = `${top}px`;
}

/**
 * Hide popularity tooltip
 */
function hidePopularityTooltip() {
    const tooltip = document.getElementById('popularity-tooltip');
    if (!tooltip) return;
    
    tooltip.style.opacity = '0';
    tooltip.style.pointerEvents = 'none';
}

/**
 * Initialize word cloud animations and effects
 */
function initializeWordCloudAnimations() {
    const wordCloudItems = document.querySelectorAll('.word-cloud-item');
    
    // Add staggered entrance animations
    wordCloudItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px) scale(0.8)';
        item.style.transition = 'all 0.6s ease';
        
        // Staggered animation delay
        setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateY(0) scale(1)';
        }, index * 100);
    });
    
    // Add intersection observer for scroll-triggered animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const wordCloudContainer = entry.target;
                wordCloudContainer.classList.add('animate-in');
                
                // Trigger individual word animations
                const items = wordCloudContainer.querySelectorAll('.word-cloud-item');
                items.forEach((item, index) => {
                    setTimeout(() => {
                        item.classList.add('animate-word');
                    }, index * 50);
                });
            }
        });
    }, {
        threshold: 0.3,
        rootMargin: '50px'
    });
    
    const wordCloudContainer = document.querySelector('.word-cloud-container');
    if (wordCloudContainer) {
        observer.observe(wordCloudContainer);
    }
}

/**
 * Get category color based on category name
 */
function getCategoryColor(category) {
    const categoryColors = {
        'emotional': '#f9a8d4',
        'animals': '#86efac',
        'nature': '#7dd3fc',
        'body': '#fdba74',
        'objects': '#c4b5fd',
        'religious': '#fde047',
        'general': '#d1d5db'
    };
    
    return categoryColors[category] || categoryColors['general'];
}

/**
 * Get category information including color and icon
 */
function getCategoryInfo(category) {
    const categoryData = {
        'emotional': {
            color: '#ec4899',
            icon: 'fas fa-heart',
            name: 'Emotional'
        },
        'animals': {
            color: '#10b981',
            icon: 'fas fa-paw',
            name: 'Animals'
        },
        'nature': {
            color: '#0ea5e9',
            icon: 'fas fa-leaf',
            name: 'Nature'
        },
        'body': {
            color: '#f97316',
            icon: 'fas fa-user',
            name: 'Body'
        },
        'objects': {
            color: '#8b5cf6',
            icon: 'fas fa-cube',
            name: 'Objects'
        },
        'religious': {
            color: '#eab308',
            icon: 'fas fa-pray',
            name: 'Religious'
        },
        'general': {
            color: '#6b7280',
            icon: 'fas fa-circle',
            name: 'General'
        }
    };
    
    return categoryData[category] || categoryData['general'];
}

/**
 * Get popularity description based on percentage
 */
function getPopularityDescription(popularity) {
    const pop = parseInt(popularity);
    
    if (pop >= 90) {
        return 'Most Popular Symbol';
    } else if (pop >= 75) {
        return 'Very Popular';
    } else if (pop >= 60) {
        return 'Popular Symbol';
    } else if (pop >= 45) {
        return 'Moderately Popular';
    } else if (pop >= 30) {
        return 'Less Popular';
    } else {
        return 'Trending Symbol';
    }
}

/**
 * Initialize insights page functionality
 */
function initializeInsightsPage() {
    console.log('Initializing insights page functionality');
    
    // Initialize word cloud
    initializeWordCloud();
    
    // Initialize social sharing
    initializeSocialSharing();
    
    // Initialize date display
    initializeDateDisplay();
}

/**
 * Initialize social sharing functionality
 */
function initializeSocialSharing() {
    // Social sharing functions are already defined in the HTML
    // This function can be extended for additional sharing features
    console.log('Social sharing initialized');
}

/**
 * Initialize dynamic date display
 */
function initializeDateDisplay() {
    const currentDateElement = document.getElementById('current-date');
    if (currentDateElement) {
        const today = new Date();
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        currentDateElement.textContent = today.toLocaleDateString('en-US', options);
    }
}

/**
 * Filter word cloud by category
 */
function filterWordCloud(category) {
    const wordCloudItems = document.querySelectorAll('.word-cloud-item');
    const filterButtons = document.querySelectorAll('.category-filter-btn');
    
    // Update active filter button
    filterButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-category') === category) {
            btn.classList.add('active');
        }
    });
    
    // Filter word cloud items
    wordCloudItems.forEach((item, index) => {
        const itemCategory = item.getAttribute('data-category');
        
        if (category === 'all' || itemCategory === category) {
            // Show item with staggered animation
            item.style.display = 'inline-block';
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px) scale(0.8)';
            
            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'translateY(0) scale(1)';
            }, index * 50);
        } else {
            // Hide item
            item.style.opacity = '0';
            item.style.transform = 'translateY(-20px) scale(0.8)';
            
            setTimeout(() => {
                item.style.display = 'none';
            }, 300);
        }
    });
    
    // Update word cloud container layout
    const wordCloudContainer = document.querySelector('.word-cloud-container');
    if (wordCloudContainer) {
        wordCloudContainer.style.minHeight = '200px';
        
        // Re-trigger layout after animation
        setTimeout(() => {
            wordCloudContainer.style.minHeight = 'auto';
        }, 1000);
    }
}

/**
 * Initialize Related Dreams Section functionality
 */
function initializeRelatedDreams() {
    console.log('Initializing related dreams functionality');
    
    const relatedDreamsSection = document.querySelector('.related-dreams-section');
    const relatedDreamCards = document.querySelectorAll('.related-dream-card');
    const relatedDreamsScroll = document.querySelector('.related-dreams-scroll');
    
    if (!relatedDreamsSection || !relatedDreamCards.length) return;
    
    // Initialize scroll behavior and touch interactions
    initializeRelatedDreamsScroll();
    
    // Initialize card hover effects and interactions
    initializeRelatedDreamCards();
    
    // Initialize intersection observer for entrance animations
    initializeRelatedDreamsAnimations();
    
    // Initialize keyboard navigation
    initializeRelatedDreamsKeyboard();
}

/**
 * Initialize horizontal scrolling behavior for related dreams
 */
function initializeRelatedDreamsScroll() {
    const scrollContainer = document.querySelector('.related-dreams-scroll');
    if (!scrollContainer) return;
    
    let isScrolling = false;
    let startX = 0;
    let scrollLeft = 0;
    
    // Mouse drag scrolling for desktop
    scrollContainer.addEventListener('mousedown', (e) => {
        isScrolling = true;
        scrollContainer.style.cursor = 'grabbing';
        startX = e.pageX - scrollContainer.offsetLeft;
        scrollLeft = scrollContainer.scrollLeft;
        e.preventDefault();
    });
    
    scrollContainer.addEventListener('mouseleave', () => {
        isScrolling = false;
        scrollContainer.style.cursor = 'grab';
    });
    
    scrollContainer.addEventListener('mouseup', () => {
        isScrolling = false;
        scrollContainer.style.cursor = 'grab';
    });
    
    scrollContainer.addEventListener('mousemove', (e) => {
        if (!isScrolling) return;
        e.preventDefault();
        const x = e.pageX - scrollContainer.offsetLeft;
        const walk = (x - startX) * 2;
        scrollContainer.scrollLeft = scrollLeft - walk;
    });
    
    // Touch scrolling for mobile (enhanced)
    let touchStartX = 0;
    let touchStartTime = 0;
    
    scrollContainer.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        touchStartTime = Date.now();
    }, { passive: true });
    
    scrollContainer.addEventListener('touchmove', (e) => {
        // Allow natural touch scrolling
    }, { passive: true });
    
    scrollContainer.addEventListener('touchend', (e) => {
        const touchEndX = e.changedTouches[0].clientX;
        const touchEndTime = Date.now();
        const touchDuration = touchEndTime - touchStartTime;
        const touchDistance = Math.abs(touchEndX - touchStartX);
        
        // Detect swipe gestures for quick navigation
        if (touchDuration < 300 && touchDistance > 50) {
            const swipeDirection = touchEndX > touchStartX ? 'right' : 'left';
            handleRelatedDreamsSwipe(swipeDirection);
        }
    }, { passive: true });
    
    // Set initial cursor style
    scrollContainer.style.cursor = 'grab';
    
    // Add scroll indicators (optional enhancement)
    addScrollIndicators();
}

/**
 * Handle swipe navigation for related dreams
 */
function handleRelatedDreamsSwipe(direction) {
    const scrollContainer = document.querySelector('.related-dreams-scroll');
    if (!scrollContainer) return;
    
    const cardWidth = 280 + 24; // card width + gap
    const currentScroll = scrollContainer.scrollLeft;
    const targetScroll = direction === 'left' ? 
        currentScroll + cardWidth * 2 : 
        currentScroll - cardWidth * 2;
    
    scrollContainer.scrollTo({
        left: Math.max(0, targetScroll),
        behavior: 'smooth'
    });
}

/**
 * Add scroll indicators for related dreams section
 */
function addScrollIndicators() {
    const scrollContainer = document.querySelector('.related-dreams-scroll');
    const container = document.querySelector('.related-dreams-container');
    
    if (!scrollContainer || !container) return;
    
    // Check if scroll indicators are needed
    const needsScrolling = scrollContainer.scrollWidth > scrollContainer.clientWidth;
    if (!needsScrolling) return;
    
    // Create scroll indicators
    const leftIndicator = document.createElement('div');
    leftIndicator.className = 'scroll-indicator scroll-indicator-left';
    leftIndicator.innerHTML = '<i class="fas fa-chevron-left"></i>';
    
    const rightIndicator = document.createElement('div');
    rightIndicator.className = 'scroll-indicator scroll-indicator-right';
    rightIndicator.innerHTML = '<i class="fas fa-chevron-right"></i>';
    
    // Add CSS for indicators
    const indicatorStyles = `
        .scroll-indicator {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            width: 40px;
            height: 40px;
            background: rgba(0, 0, 0, 0.7);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            cursor: pointer;
            z-index: 10;
            transition: all 0.3s ease;
            opacity: 0.7;
        }
        .scroll-indicator:hover {
            opacity: 1;
            background: rgba(0, 0, 0, 0.9);
            transform: translateY(-50%) scale(1.1);
        }
        .scroll-indicator-left {
            left: 10px;
        }
        .scroll-indicator-right {
            right: 10px;
        }
        @media (max-width: 768px) {
            .scroll-indicator {
                display: none;
            }
        }
    `;
    
    // Add styles to head if not already present
    if (!document.getElementById('scroll-indicator-styles')) {
        const styleSheet = document.createElement('style');
        styleSheet.id = 'scroll-indicator-styles';
        styleSheet.textContent = indicatorStyles;
        document.head.appendChild(styleSheet);
    }
    
    // Add indicators to container
    container.style.position = 'relative';
    container.appendChild(leftIndicator);
    container.appendChild(rightIndicator);
    
    // Add click handlers
    leftIndicator.addEventListener('click', () => {
        scrollContainer.scrollBy({
            left: -300,
            behavior: 'smooth'
        });
    });
    
    rightIndicator.addEventListener('click', () => {
        scrollContainer.scrollBy({
            left: 300,
            behavior: 'smooth'
        });
    });
    
    // Update indicator visibility based on scroll position
    function updateIndicators() {
        const isAtStart = scrollContainer.scrollLeft <= 10;
        const isAtEnd = scrollContainer.scrollLeft >= 
            scrollContainer.scrollWidth - scrollContainer.clientWidth - 10;
        
        leftIndicator.style.opacity = isAtStart ? '0.3' : '0.7';
        leftIndicator.style.pointerEvents = isAtStart ? 'none' : 'auto';
        
        rightIndicator.style.opacity = isAtEnd ? '0.3' : '0.7';
        rightIndicator.style.pointerEvents = isAtEnd ? 'none' : 'auto';
    }
    
    scrollContainer.addEventListener('scroll', updateIndicators);
    updateIndicators(); // Initial call
}

/**
 * Initialize related dream card interactions
 */
function initializeRelatedDreamCards() {
    const relatedDreamCards = document.querySelectorAll('.related-dream-card');
    
    relatedDreamCards.forEach((card, index) => {
        // Enhanced hover effects
        card.addEventListener('mouseenter', function() {
            // Add subtle scale to nearby cards
            const siblingCards = Array.from(relatedDreamCards);
            siblingCards.forEach((siblingCard, siblingIndex) => {
                if (Math.abs(siblingIndex - index) === 1) {
                    siblingCard.style.transform = 'translateY(-2px) scale(1.01)';
                    siblingCard.style.transition = 'all 0.3s ease';
                }
            });
        });
        
        card.addEventListener('mouseleave', function() {
            // Reset sibling cards
            const siblingCards = Array.from(relatedDreamCards);
            siblingCards.forEach((siblingCard, siblingIndex) => {
                if (Math.abs(siblingIndex - index) === 1) {
                    siblingCard.style.transform = '';
                }
            });
        });
        
        // Add click analytics and feedback
        card.addEventListener('click', function(e) {
            const symbolName = this.querySelector('.related-dream-title').textContent;
            const category = this.getAttribute('data-category');
            
            console.log(`Clicked on related dream: ${symbolName} (${category})`);
            
            // Add click feedback animation
            this.style.transform = 'translateY(-12px) scale(0.98)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
        
        // Add focus handling for accessibility
        card.addEventListener('focus', function() {
            this.style.outline = '2px solid #8b5cf6';
            this.style.outlineOffset = '2px';
        });
        
        card.addEventListener('blur', function() {
            this.style.outline = '';
            this.style.outlineOffset = '';
        });
    });
}

/**
 * Initialize entrance animations for related dreams section
 */
function initializeRelatedDreamsAnimations() {
    const relatedDreamsSection = document.querySelector('.related-dreams-section');
    const relatedDreamCards = document.querySelectorAll('.related-dream-card');
    
    if (!relatedDreamsSection) return;
    
    // Create intersection observer for section entrance
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                // Trigger staggered card animations
                relatedDreamCards.forEach((card, index) => {
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0) scale(1)';
                    }, index * 100);
                });
            }
        });
    }, {
        threshold: 0.2,
        rootMargin: '50px'
    });
    
    sectionObserver.observe(relatedDreamsSection);
    
    // Set initial state for cards
    relatedDreamCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px) scale(0.9)';
        card.style.transition = 'all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    });
}

/**
 * Initialize keyboard navigation for related dreams
 */
function initializeRelatedDreamsKeyboard() {
    const relatedDreamCards = document.querySelectorAll('.related-dream-card');
    const scrollContainer = document.querySelector('.related-dreams-scroll');
    
    if (!relatedDreamCards.length || !scrollContainer) return;
    
    // Make cards focusable
    relatedDreamCards.forEach((card, index) => {
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'button');
        card.setAttribute('aria-label', `Related dream: ${card.querySelector('.related-dream-title').textContent}`);
        
        card.addEventListener('keydown', function(e) {
            let targetCard = null;
            
            switch(e.key) {
                case 'ArrowLeft':
                    e.preventDefault();
                    targetCard = relatedDreamCards[Math.max(0, index - 1)];
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    targetCard = relatedDreamCards[Math.min(relatedDreamCards.length - 1, index + 1)];
                    break;
                case 'Home':
                    e.preventDefault();
                    targetCard = relatedDreamCards[0];
                    break;
                case 'End':
                    e.preventDefault();
                    targetCard = relatedDreamCards[relatedDreamCards.length - 1];
                    break;
                case 'Enter':
                case ' ':
                    e.preventDefault();
                    this.click();
                    break;
            }
            
            if (targetCard) {
                targetCard.focus();
                
                // Scroll target card into view
                const cardRect = targetCard.getBoundingClientRect();
                const containerRect = scrollContainer.getBoundingClientRect();
                
                if (cardRect.left < containerRect.left || cardRect.right > containerRect.right) {
                    targetCard.scrollIntoView({
                        behavior: 'smooth',
                        block: 'nearest',
                        inline: 'center'
                    });
                }
            }
        });
    });
}

// Export functions for use in other modules
window.DreamPlatform = {
    initializeAnimations,
    initializeScrollEffects,
    initializeResponsiveFeatures,
    initializeExpertCarousel,
    addHoverEffects,
    initializeBrowsePage,
    initializeAlphabetNavigation,
    initializeLetterObserver,
    initializeLetterScrolling,
    initializeDreamSymbolSearch,
    initializeDreamCardAnimations,
    initializeWordCloud,
    initializeInsightsPage,
    showPopularityTooltip,
    hidePopularityTooltip,
    filterWordCloud,
    initializeRelatedDreams
};

// Make functions globally available
window.initializeBrowsePage = initializeBrowsePage;
window.initializeInsightsPage = initializeInsightsPage;
window.filterWordCloud = filterWordCloud;
window.initializeRelatedDreams = initializeRelatedDreams;

/**
 * Update tooltip position based on mouse coordinates
 */
function updateTooltipPosition(event) {
    const tooltip = document.getElementById('popularity-tooltip');
    if (!tooltip) return;
    
    const tooltipRect = tooltip.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    let left = event.clientX - tooltipRect.width / 2;
    let top = event.clientY - tooltipRect.height - 10;
    
    // Adjust if tooltip goes off screen
    if (left < 10) left = 10;
    if (left + tooltipRect.width > viewportWidth - 10) {
        left = viewportWidth - tooltipRect.width - 10;
    }
    
    if (top < 10) {
        top = event.clientY + 10; // Show below cursor instead
    }
    
    tooltip.style.left = `${left}px`;
    tooltip.style.top = `${top}px`;
}

/**
 * Hide popularity tooltip
 */
function hidePopularityTooltip() {
    const tooltip = document.getElementById('popularity-tooltip');
    if (!tooltip) return;
    
    tooltip.style.opacity = '0';
    tooltip.style.pointerEvents = 'none';
}

/**
 * Initialize word cloud animations and effects
 */
function initializeWordCloudAnimations() {
    const wordCloudItems = document.querySelectorAll('.word-cloud-item');
    
    // Add staggered entrance animations
    wordCloudItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px) scale(0.8)';
        item.style.transition = 'all 0.6s ease';
        
        // Staggered animation delay
        setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateY(0) scale(1)';
        }, index * 100);
    });
    
    // Add intersection observer for scroll-triggered animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const wordCloudContainer = entry.target;
                wordCloudContainer.classList.add('animate-in');
                
                // Trigger individual word animations
                const items = wordCloudContainer.querySelectorAll('.word-cloud-item');
                items.forEach((item, index) => {
                    setTimeout(() => {
                        item.classList.add('animate-word');
                    }, index * 50);
                });
            }
        });
    }, {
        threshold: 0.3,
        rootMargin: '50px'
    });
    
    const wordCloudContainer = document.querySelector('.word-cloud-container');
    if (wordCloudContainer) {
        observer.observe(wordCloudContainer);
    }
}

/**
 * Get category color based on category name
 */
function getCategoryColor(category) {
    const categoryColors = {
        'emotional': '#f9a8d4',
        'animals': '#86efac',
        'nature': '#7dd3fc',
        'body': '#fdba74',
        'objects': '#c4b5fd',
        'religious': '#fde047',
        'general': '#d1d5db'
    };
    
    return categoryColors[category] || categoryColors['general'];
}

/**
 * Get category information including color and icon
 */
function getCategoryInfo(category) {
    const categoryData = {
        'emotional': {
            color: '#ec4899',
            icon: 'fas fa-heart',
            name: 'Emotional'
        },
        'animals': {
            color: '#10b981',
            icon: 'fas fa-paw',
            name: 'Animals'
        },
        'nature': {
            color: '#0ea5e9',
            icon: 'fas fa-leaf',
            name: 'Nature'
        },
        'body': {
            color: '#f97316',
            icon: 'fas fa-user',
            name: 'Body'
        },
        'objects': {
            color: '#8b5cf6',
            icon: 'fas fa-cube',
            name: 'Objects'
        },
        'religious': {
            color: '#eab308',
            icon: 'fas fa-pray',
            name: 'Religious'
        },
        'general': {
            color: '#6b7280',
            icon: 'fas fa-circle',
            name: 'General'
        }
    };
    
    return categoryData[category] || categoryData['general'];
}

/**
 * Get popularity description based on percentage
 */
function getPopularityDescription(popularity) {
    const pop = parseInt(popularity);
    
    if (pop >= 90) {
        return 'Most Popular Symbol';
    } else if (pop >= 75) {
        return 'Very Popular';
    } else if (pop >= 60) {
        return 'Popular Symbol';
    } else if (pop >= 45) {
        return 'Moderately Popular';
    } else if (pop >= 30) {
        return 'Less Popular';
    } else {
        return 'Trending Symbol';
    }
}

/**
 * Initialize insights page functionality
 */
function initializeInsightsPage() {
    console.log('Initializing insights page functionality');
    
    // Initialize word cloud
    initializeWordCloud();
    
    // Initialize social sharing
    initializeSocialSharing();
    
    // Initialize date display
    initializeDateDisplay();
}

/**
 * Initialize social sharing functionality
 */
function initializeSocialSharing() {
    // Social sharing functions are already defined in the HTML
    // This function can be extended for additional sharing features
    console.log('Social sharing initialized');
}

/**
 * Initialize dynamic date display
 */
function initializeDateDisplay() {
    const currentDateElement = document.getElementById('current-date');
    if (currentDateElement) {
        const today = new Date();
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        currentDateElement.textContent = today.toLocaleDateString('en-US', options);
    }
}

/**
 * Filter word cloud by category
 */
function filterWordCloud(category) {
    const wordCloudItems = document.querySelectorAll('.word-cloud-item');
    const filterButtons = document.querySelectorAll('.category-filter-btn');
    
    // Update active filter button
    filterButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-category') === category) {
            btn.classList.add('active');
        }
    });
    
    // Filter word cloud items
    wordCloudItems.forEach((item, index) => {
        const itemCategory = item.getAttribute('data-category');
        
        if (category === 'all' || itemCategory === category) {
            // Show item with staggered animation
            item.style.display = 'inline-block';
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px) scale(0.8)';
            
            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'translateY(0) scale(1)';
            }, index * 50);
        } else {
            // Hide item
            item.style.opacity = '0';
            item.style.transform = 'translateY(-20px) scale(0.8)';
            
            setTimeout(() => {
                item.style.display = 'none';
            }, 300);
        }
    });
    
    // Update word cloud container layout
    const wordCloudContainer = document.querySelector('.word-cloud-container');
    if (wordCloudContainer) {
        wordCloudContainer.style.minHeight = '200px';
        
        // Re-trigger layout after animation
        setTimeout(() => {
            wordCloudContainer.style.minHeight = 'auto';
        }, 1000);
    }
}

/**
 * Initialize Related Dreams Section functionality
 */
function initializeRelatedDreams() {
    console.log('Initializing related dreams functionality');
    
    const relatedDreamsSection = document.querySelector('.related-dreams-section');
    const relatedDreamCards = document.querySelectorAll('.related-dream-card');
    const relatedDreamsScroll = document.querySelector('.related-dreams-scroll');
    
    if (!relatedDreamsSection || !relatedDreamCards.length) return;
    
    // Initialize scroll behavior and touch interactions
    initializeRelatedDreamsScroll();
    
    // Initialize card hover effects and interactions
    initializeRelatedDreamCards();
    
    // Initialize intersection observer for entrance animations
    initializeRelatedDreamsAnimations();
    
    // Initialize keyboard navigation
    initializeRelatedDreamsKeyboard();
}

/**
 * Initialize horizontal scrolling behavior for related dreams
 */
function initializeRelatedDreamsScroll() {
    const scrollContainer = document.querySelector('.related-dreams-scroll');
    if (!scrollContainer) return;
    
    let isScrolling = false;
    let startX = 0;
    let scrollLeft = 0;
    
    // Mouse drag scrolling for desktop
    scrollContainer.addEventListener('mousedown', (e) => {
        isScrolling = true;
        scrollContainer.style.cursor = 'grabbing';
        startX = e.pageX - scrollContainer.offsetLeft;
        scrollLeft = scrollContainer.scrollLeft;
        e.preventDefault();
    });
    
    scrollContainer.addEventListener('mouseleave', () => {
        isScrolling = false;
        scrollContainer.style.cursor = 'grab';
    });
    
    scrollContainer.addEventListener('mouseup', () => {
        isScrolling = false;
        scrollContainer.style.cursor = 'grab';
    });
    
    scrollContainer.addEventListener('mousemove', (e) => {
        if (!isScrolling) return;
        e.preventDefault();
        const x = e.pageX - scrollContainer.offsetLeft;
        const walk = (x - startX) * 2;
        scrollContainer.scrollLeft = scrollLeft - walk;
    });
    
    // Touch scrolling for mobile (enhanced)
    let touchStartX = 0;
    let touchStartTime = 0;
    
    scrollContainer.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        touchStartTime = Date.now();
    });
    
    scrollContainer.addEventListener('touchend', (e) => {
        const touchEndX = e.changedTouches[0].clientX;
        const touchEndTime = Date.now();
        const touchDuration = touchEndTime - touchStartTime;
        const touchDistance = touchStartX - touchEndX;
        
        // Implement momentum scrolling for quick swipes
        if (touchDuration < 300 && Math.abs(touchDistance) > 50) {
            const momentum = touchDistance * 2;
            scrollContainer.scrollBy({
                left: momentum,
                behavior: 'smooth'
            });
        }
    });
    
    // Set cursor style
    scrollContainer.style.cursor = 'grab';
}

/**
 * Initialize related dream cards interactions
 */
function initializeRelatedDreamCards() {
    const relatedDreamCards = document.querySelectorAll('.related-dream-card');
    
    relatedDreamCards.forEach(card => {
        // Enhanced hover effects
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
            this.style.boxShadow = '0 20px 40px rgba(139, 92, 246, 0.3)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = '';
        });
        
        // Add focus styles for keyboard navigation
        card.addEventListener('focus', function() {
            this.style.outline = '2px solid #8b5cf6';
            this.style.outlineOffset = '4px';
        });
        
        card.addEventListener('blur', function() {
            this.style.outline = 'none';
        });
    });
}

/**
 * Initialize related dreams animations
 */
function initializeRelatedDreamsAnimations() {
    const relatedDreamCards = document.querySelectorAll('.related-dream-card');
    
    // Intersection observer for entrance animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const cards = entry.target.querySelectorAll('.related-dream-card');
                cards.forEach((card, index) => {
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, index * 100);
                });
            }
        });
    }, {
        threshold: 0.2,
        rootMargin: '50px'
    });
    
    const relatedDreamsSection = document.querySelector('.related-dreams-section');
    if (relatedDreamsSection) {
        // Set initial state
        relatedDreamCards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = 'all 0.6s ease';
        });
        
        observer.observe(relatedDreamsSection);
    }
}

/**
 * Initialize keyboard navigation for related dreams
 */
function initializeRelatedDreamsKeyboard() {
    const relatedDreamCards = document.querySelectorAll('.related-dream-card');
    
    relatedDreamCards.forEach((card, index) => {
        card.addEventListener('keydown', (e) => {
            let targetIndex;
            
            switch(e.key) {
                case 'ArrowLeft':
                    e.preventDefault();
                    targetIndex = index > 0 ? index - 1 : relatedDreamCards.length - 1;
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    targetIndex = index < relatedDreamCards.length - 1 ? index + 1 : 0;
                    break;
                case 'Home':
                    e.preventDefault();
                    targetIndex = 0;
                    break;
                case 'End':
                    e.preventDefault();
                    targetIndex = relatedDreamCards.length - 1;
                    break;
                default:
                    return;
            }
            
            if (targetIndex !== undefined) {
                relatedDreamCards[targetIndex].focus();
                
                // Scroll the target card into view
                relatedDreamCards[targetIndex].scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest',
                    inline: 'center'
                });
            }
        });
    });
}

// Make functions available globally for HTML onclick handlers
window.filterWordCloud = filterWordCloud;
window.toggleSection = window.toggleSection || function() {};

// Export functions for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializePageSpecificFeatures,
        initializeBrowsePage,
        initializeInsightsPage,
        initializeRelatedDreams,
        filterWordCloud
    };
}
/**

 * Enhanced mobile menu functions
 */
function toggleMobileMenu() {
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    
    if (!mobileMenu || !mobileMenuToggle) return;
    
    if (mobileMenu.classList.contains('hidden')) {
        openMobileMenu();
    } else {
        closeMobileMenu();
    }
}

function openMobileMenu() {
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    
    if (!mobileMenu || !mobileMenuToggle) return;
    
    // Show menu
    mobileMenu.classList.remove('hidden');
    mobileMenu.style.opacity = '0';
    mobileMenu.style.transform = 'translateY(-10px)';
    
    // Animate in
    requestAnimationFrame(() => {
        mobileMenu.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        mobileMenu.style.opacity = '1';
        mobileMenu.style.transform = 'translateY(0)';
    });
    
    // Update toggle button
    mobileMenuToggle.innerHTML = '<i class="fas fa-times text-xl"></i>';
    mobileMenuToggle.setAttribute('aria-expanded', 'true');
    mobileMenuToggle.setAttribute('aria-label', 'Close menu');
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
    document.body.classList.add('mobile-menu-open');
}

function closeMobileMenu() {
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    
    if (!mobileMenu || !mobileMenuToggle) return;
    
    // Animate out
    mobileMenu.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
    mobileMenu.style.opacity = '0';
    mobileMenu.style.transform = 'translateY(-10px)';
    
    // Hide menu after animation
    setTimeout(() => {
        mobileMenu.classList.add('hidden');
    }, 300);
    
    // Update toggle button
    mobileMenuToggle.innerHTML = '<i class="fas fa-bars text-xl"></i>';
    mobileMenuToggle.setAttribute('aria-expanded', 'false');
    mobileMenuToggle.setAttribute('aria-label', 'Open menu');
    
    // Restore body scroll
    document.body.style.overflow = '';
    document.body.classList.remove('mobile-menu-open');
}

/**
 * Initialize touch interactions for better mobile experience
 */
function initializeTouchInteractions() {
    // Add touch-friendly hover effects
    const touchElements = document.querySelectorAll('.hover-scale, .glass-card, .category-card, .dream-symbol-card');
    
    touchElements.forEach(element => {
        // Touch start
        element.addEventListener('touchstart', function(e) {
            this.classList.add('touch-active');
        }, { passive: true });
        
        // Touch end
        element.addEventListener('touchend', function(e) {
            this.classList.remove('touch-active');
        }, { passive: true });
        
        // Touch cancel
        element.addEventListener('touchcancel', function(e) {
            this.classList.remove('touch-active');
        }, { passive: true });
    });
    
    // Improve scroll performance on mobile
    let ticking = false;
    
    function updateScrollPosition() {
        // Update any scroll-dependent features here
        ticking = false;
    }
    
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateScrollPosition);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestTick, { passive: true });
    
    // Add momentum scrolling for iOS
    document.body.style.webkitOverflowScrolling = 'touch';
}

/**
 * Initialize viewport height fix for mobile browsers
 */
function initializeViewportFix() {
    // Fix for mobile browsers that change viewport height when address bar shows/hides
    function setViewportHeight() {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }
    
    // Set initial value
    setViewportHeight();
    
    // Update on resize and orientation change
    window.addEventListener('resize', setViewportHeight);
    window.addEventListener('orientationchange', () => {
        setTimeout(setViewportHeight, 100);
    });
}

/**
 * Handle orientation change events
 */
function handleOrientationChange() {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    
    // Close mobile menu on orientation change
    if (window.innerWidth > 767) {
        closeMobileMenu();
    }
    
    // Adjust carousel on orientation change
    const carousel = document.getElementById('expertCarousel');
    if (carousel) {
        setTimeout(() => {
            // Trigger carousel resize
            window.dispatchEvent(new Event('resize'));
        }, 100);
    }
    
    // Update body classes for orientation
    if (screenWidth > screenHeight) {
        document.body.classList.add('landscape');
        document.body.classList.remove('portrait');
    } else {
        document.body.classList.add('portrait');
        document.body.classList.remove('landscape');
    }
}

/**
 * Initialize performance optimizations for mobile
 */
function initializePerformanceOptimizations() {
    // Reduce animations on low-end devices
    if (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2) {
        document.body.classList.add('low-performance');
    }
    
    // Optimize images for mobile
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        // Add loading="lazy" for better performance
        if (!img.hasAttribute('loading')) {
            img.setAttribute('loading', 'lazy');
        }
        
        // Add error handling
        img.addEventListener('error', function() {
            this.style.display = 'none';
        });
    });
    
    // Optimize backdrop-filter for mobile
    if (window.innerWidth < 768) {
        const glassElements = document.querySelectorAll('.glass, .glass-card');
        glassElements.forEach(element => {
            element.style.backdropFilter = 'blur(4px)';
            element.style.webkitBackdropFilter = 'blur(4px)';
        });
    }
    
    // Debounce resize events
    let resizeTimer;
    const originalResize = window.onresize;
    
    window.onresize = function(e) {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            if (originalResize) originalResize(e);
        }, 250);
    };
}

/**
 * Initialize insights page functionality
 */
function initializeInsightsPage() {
    console.log('Initializing insights page features');
    
    // Initialize word cloud if present
    if (document.querySelector('.word-cloud-container')) {
        initializeWordCloud();
    }
    
    // Initialize social sharing
    initializeSocialSharing();
    
    // Initialize timeline animations
    initializeTimelineAnimations();
}

/**
 * Initialize social sharing functionality
 */
function initializeSocialSharing() {
    const shareButtons = document.querySelectorAll('.social-share-btn');
    
    shareButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const platform = this.getAttribute('data-platform');
            const url = encodeURIComponent(window.location.href);
            const title = encodeURIComponent(document.title);
            const text = encodeURIComponent('Check out this dream insight!');
            
            let shareUrl = '';
            
            switch(platform) {
                case 'twitter':
                    shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${text}`;
                    break;
                case 'facebook':
                    shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
                    break;
                case 'linkedin':
                    shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
                    break;
                case 'whatsapp':
                    shareUrl = `https://wa.me/?text=${text}%20${url}`;
                    break;
                case 'telegram':
                    shareUrl = `https://t.me/share/url?url=${url}&text=${text}`;
                    break;
            }
            
            if (shareUrl) {
                window.open(shareUrl, '_blank', 'width=600,height=400');
            }
        });
    });
    
    // Native share API for mobile
    if (navigator.share) {
        const nativeShareButton = document.querySelector('.native-share-btn');
        if (nativeShareButton) {
            nativeShareButton.addEventListener('click', async function() {
                try {
                    await navigator.share({
                        title: document.title,
                        text: 'Check out this dream insight!',
                        url: window.location.href
                    });
                } catch (err) {
                    console.log('Error sharing:', err);
                }
            });
        }
    }
}

/**
 * Initialize timeline animations
 */
function initializeTimelineAnimations() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    if (!timelineItems.length) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, {
        threshold: 0.2,
        rootMargin: '50px'
    });
    
    timelineItems.forEach(item => {
        observer.observe(item);
    });
}

/**
 * Initialize related dreams functionality
 */
function initializeRelatedDreams() {
    const relatedContainer = document.querySelector('.related-dreams-scroll');
    
    if (!relatedContainer) return;
    
    // Add touch scrolling support
    let isScrolling = false;
    let startX = 0;
    let scrollLeft = 0;
    
    relatedContainer.addEventListener('touchstart', function(e) {
        isScrolling = true;
        startX = e.touches[0].pageX - relatedContainer.offsetLeft;
        scrollLeft = relatedContainer.scrollLeft;
    }, { passive: true });
    
    relatedContainer.addEventListener('touchmove', function(e) {
        if (!isScrolling) return;
        
        const x = e.touches[0].pageX - relatedContainer.offsetLeft;
        const walk = (x - startX) * 2;
        relatedContainer.scrollLeft = scrollLeft - walk;
    }, { passive: true });
    
    relatedContainer.addEventListener('touchend', function() {
        isScrolling = false;
    }, { passive: true });
    
    // Add scroll indicators
    updateScrollIndicators();
    relatedContainer.addEventListener('scroll', updateScrollIndicators, { passive: true });
}

/**
 * Update scroll indicators for horizontal scrolling containers
 */
function updateScrollIndicators() {
    const containers = document.querySelectorAll('.related-dreams-scroll, .expert-carousel');
    
    containers.forEach(container => {
        const scrollLeft = container.scrollLeft;
        const scrollWidth = container.scrollWidth;
        const clientWidth = container.clientWidth;
        
        // Add classes based on scroll position
        if (scrollLeft <= 0) {
            container.classList.add('scroll-start');
            container.classList.remove('scroll-middle', 'scroll-end');
        } else if (scrollLeft >= scrollWidth - clientWidth - 1) {
            container.classList.add('scroll-end');
            container.classList.remove('scroll-start', 'scroll-middle');
        } else {
            container.classList.add('scroll-middle');
            container.classList.remove('scroll-start', 'scroll-end');
        }
    });
}

/**
 * Add CSS classes for touch states
 */
const touchStyles = `
.touch-active {
    transform: scale(0.98) !important;
    transition: transform 0.1s ease !important;
}

.mobile-menu-open {
    overflow: hidden !important;
}

.low-performance * {
    animation-duration: 0.1s !important;
    transition-duration: 0.1s !important;
}

.landscape .hero-section {
    min-height: 100vh !important;
}

.portrait .hero-section {
    min-height: 100vh !important;
}

/* Scroll indicators */
.scroll-start::before {
    content: '';
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    width: 20px;
    background: linear-gradient(to left, rgba(0,0,0,0.1), transparent);
    pointer-events: none;
    z-index: 1;
}

.scroll-end::after {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 20px;
    background: linear-gradient(to right, rgba(0,0,0,0.1), transparent);
    pointer-events: none;
    z-index: 1;
}

.scroll-middle::before,
.scroll-middle::after {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    width: 20px;
    pointer-events: none;
    z-index: 1;
}

.scroll-middle::before {
    right: 0;
    background: linear-gradient(to left, rgba(0,0,0,0.1), transparent);
}

.scroll-middle::after {
    left: 0;
    background: linear-gradient(to right, rgba(0,0,0,0.1), transparent);
}

/* Mobile-specific improvements */
@media (max-width: 767px) {
    .scroll-start::before,
    .scroll-end::after,
    .scroll-middle::before,
    .scroll-middle::after {
        width: 10px;
    }
}
`;

// Add touch styles to document
if (!document.getElementById('touch-styles')) {
    const styleSheet = document.createElement('style');
    styleSheet.id = 'touch-styles';
    styleSheet.textContent = touchStyles;
    document.head.appendChild(styleSheet);
}rver
 = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '50px'
        });
        
        observer.observe(card);
    });
}

/**
 * Initialize page transition animations
 */
function initializePageTransitions() {
    // Add page transition class to body
    document.body.classList.add('page-transition');
    
    // Remove transition class after page loads
    window.addEventListener('load', function() {
        setTimeout(() => {
            document.body.classList.add('loaded');
        }, 100);
    });
    
    // Add scroll progress indicator
    createScrollProgressIndicator();
}

/**
 * Create scroll progress indicator
 */
function createScrollProgressIndicator() {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-indicator';
    document.body.appendChild(progressBar);
    
    // Update progress on scroll
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset;
        const docHeight = document.body.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        
        progressBar.style.width = scrollPercent + '%';
    });
}

/**
 * Initialize scroll-triggered animations
 */
function initializeScrollAnimations() {
    // Create intersection observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                // Add staggered animation for child elements
                const children = entry.target.querySelectorAll('.glass-card, .dream-symbol-card, .category-card');
                children.forEach((child, index) => {
                    setTimeout(() => {
                        child.classList.add('animate-in');
                    }, index * 100);
                });
            }
        });
    }, observerOptions);
    
    // Observe sections for scroll animations
    const sections = document.querySelectorAll('section, .letter-section, .category-section');
    sections.forEach(section => {
        observer.observe(section);
    });
}

/**
 * Initialize enhanced hover effects
 */
function initializeEnhancedHoverEffects() {
    // Add magnetic hover effect to buttons
    const buttons = document.querySelectorAll('button, .btn');
    buttons.forEach(button => {
        button.classList.add('magnetic-hover');
        
        button.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            this.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px) scale(1.05)`;
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translate(0px, 0px) scale(1)';
        });
    });
    
    // Add enhanced card hover effects
    const cards = document.querySelectorAll('.glass-card, .category-card, .dream-symbol-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            // Add glow effect to nearby cards
            const nearbyCards = Array.from(cards).filter(c => c !== this);
            nearbyCards.forEach(nearbyCard => {
                const distance = getDistance(this, nearbyCard);
                if (distance < 300) {
                    nearbyCard.style.opacity = '0.7';
                    nearbyCard.style.transform = 'scale(0.98)';
                }
            });
        });
        
        card.addEventListener('mouseleave', function() {
            // Reset nearby cards
            cards.forEach(c => {
                c.style.opacity = '';
                c.style.transform = '';
            });
        });
    });
}

/**
 * Get distance between two elements
 */
function getDistance(elem1, elem2) {
    const rect1 = elem1.getBoundingClientRect();
    const rect2 = elem2.getBoundingClientRect();
    
    const x1 = rect1.left + rect1.width / 2;
    const y1 = rect1.top + rect1.height / 2;
    const x2 = rect2.left + rect2.width / 2;
    const y2 = rect2.top + rect2.height / 2;
    
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

/**
 * Initialize touch interactions for mobile
 */
function initializeTouchInteractions() {
    // Add touch feedback to interactive elements
    const interactiveElements = document.querySelectorAll('button, .btn, .glass-card, .hover-scale, a');
    
    interactiveElements.forEach(element => {
        element.addEventListener('touchstart', function() {
            this.classList.add('touch-active');
        });
        
        element.addEventListener('touchend', function() {
            setTimeout(() => {
                this.classList.remove('touch-active');
            }, 150);
        });
        
        element.addEventListener('touchcancel', function() {
            this.classList.remove('touch-active');
        });
    });
}

/**
 * Initialize viewport height fix for mobile browsers
 */
function initializeViewportFix() {
    // Fix viewport height for mobile browsers
    function setViewportHeight() {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }
    
    setViewportHeight();
    window.addEventListener('resize', setViewportHeight);
    window.addEventListener('orientationchange', () => {
        setTimeout(setViewportHeight, 100);
    });
}

/**
 * Initialize performance optimizations
 */
function initializePerformanceOptimizations() {
    // Lazy load images
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
    
    // Optimize animations for performance
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (prefersReducedMotion.matches) {
        document.body.classList.add('reduced-motion');
    }
    
    // Throttle scroll events
    let scrollTimeout;
    const originalScrollHandler = window.onscroll;
    window.onscroll = function() {
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        scrollTimeout = setTimeout(() => {
            if (originalScrollHandler) {
                originalScrollHandler();
            }
        }, 16); // ~60fps
    };
}

/**
 * Handle orientation change
 */
function handleOrientationChange() {
    // Update layout for orientation change
    const isLandscape = window.innerWidth > window.innerHeight;
    
    if (isLandscape) {
        document.body.classList.add('landscape');
        document.body.classList.remove('portrait');
    } else {
        document.body.classList.add('portrait');
        document.body.classList.remove('landscape');
    }
    
    // Recalculate floating element positions
    const floatingElements = document.querySelectorAll('.floating');
    floatingElements.forEach(element => {
        // Reset animation to recalculate positions
        element.style.animation = 'none';
        element.offsetHeight; // Trigger reflow
        element.style.animation = null;
    });
}

/**
 * Toggle mobile menu with enhanced animations
 */
function toggleMobileMenu() {
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    
    if (!mobileMenu || !mobileMenuToggle) return;
    
    const isHidden = mobileMenu.classList.contains('hidden');
    
    if (isHidden) {
        openMobileMenu();
    } else {
        closeMobileMenu();
    }
}

/**
 * Open mobile menu with animation
 */
function openMobileMenu() {
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    
    if (!mobileMenu || !mobileMenuToggle) return;
    
    mobileMenu.classList.remove('hidden');
    mobileMenu.style.opacity = '0';
    mobileMenu.style.transform = 'translateY(-20px)';
    
    // Animate menu items
    const menuItems = mobileMenu.querySelectorAll('a');
    menuItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-20px)';
        
        setTimeout(() => {
            item.style.transition = 'all 0.3s ease';
            item.style.opacity = '1';
            item.style.transform = 'translateX(0)';
        }, index * 50);
    });
    
    // Animate menu container
    setTimeout(() => {
        mobileMenu.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        mobileMenu.style.opacity = '1';
        mobileMenu.style.transform = 'translateY(0)';
    }, 10);
    
    // Update toggle button
    mobileMenuToggle.innerHTML = '<i class="fas fa-times text-xl"></i>';
    mobileMenuToggle.classList.add('active');
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
}

/**
 * Close mobile menu with animation
 */
function closeMobileMenu() {
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    
    if (!mobileMenu || !mobileMenuToggle) return;
    
    // Animate menu items out
    const menuItems = mobileMenu.querySelectorAll('a');
    menuItems.forEach((item, index) => {
        setTimeout(() => {
            item.style.opacity = '0';
            item.style.transform = 'translateX(-20px)';
        }, index * 30);
    });
    
    // Animate menu container out
    setTimeout(() => {
        mobileMenu.style.opacity = '0';
        mobileMenu.style.transform = 'translateY(-20px)';
    }, menuItems.length * 30);
    
    // Hide menu after animation
    setTimeout(() => {
        mobileMenu.classList.add('hidden');
        
        // Reset styles
        menuItems.forEach(item => {
            item.style.opacity = '';
            item.style.transform = '';
            item.style.transition = '';
        });
        
        mobileMenu.style.opacity = '';
        mobileMenu.style.transform = '';
        mobileMenu.style.transition = '';
    }, 300);
    
    // Update toggle button
    mobileMenuToggle.innerHTML = '<i class="fas fa-bars text-xl"></i>';
    mobileMenuToggle.classList.remove('active');
    
    // Restore body scroll
    document.body.style.overflow = '';
}

/**
 * Initialize insights page functionality
 */
function initializeInsightsPage() {
    console.log('Initializing insights page functionality');
    
    // Initialize word cloud if present
    initializeWordCloud();
    
    // Initialize daily wisdom animations
    initializeDailyWisdomAnimations();
    
    // Initialize timeline animations
    initializeTimelineAnimations();
}

/**
 * Initialize word cloud functionality
 */
function initializeWordCloud() {
    const wordCloudItems = document.querySelectorAll('.word-cloud-item');
    const tooltip = document.getElementById('popularity-tooltip');
    
    if (!wordCloudItems.length) return;
    
    // Create tooltip if it doesn't exist
    if (!tooltip) {
        createPopularityTooltip();
    }
    
    wordCloudItems.forEach(item => {
        // Add entrance animation
        item.classList.add('animate-word');
        
        // Add hover effects
        item.addEventListener('mouseenter', function(e) {
            showPopularityTooltip(e, this);
            
            // Add pulse effect to related items
            const category = this.dataset.category;
            if (category) {
                const relatedItems = document.querySelectorAll(`[data-category="${category}"]`);
                relatedItems.forEach(relatedItem => {
                    if (relatedItem !== this) {
                        relatedItem.classList.add('pulse-animation');
                    }
                });
            }
        });
        
        item.addEventListener('mouseleave', function() {
            hidePopularityTooltip();
            
            // Remove pulse effect from all items
            wordCloudItems.forEach(wordItem => {
                wordItem.classList.remove('pulse-animation');
            });
        });
        
        item.addEventListener('mousemove', function(e) {
            updateTooltipPosition(e);
        });
    });
}

/**
 * Create popularity tooltip
 */
function createPopularityTooltip() {
    const tooltip = document.createElement('div');
    tooltip.id = 'popularity-tooltip';
    tooltip.className = 'fixed bg-gray-900 text-white px-3 py-2 rounded-lg text-sm pointer-events-none opacity-0 transition-opacity duration-200 z-50';
    tooltip.style.transform = 'translateX(-50%) translateY(-100%)';
    document.body.appendChild(tooltip);
}

/**
 * Show popularity tooltip
 */
function showPopularityTooltip(event, element) {
    const tooltip = document.getElementById('popularity-tooltip');
    if (!tooltip) return;
    
    const popularity = element.dataset.popularity || '50';
    const category = element.dataset.category || 'general';
    const symbolName = element.textContent.trim();
    
    tooltip.innerHTML = `
        <div class="tooltip-content">
            <div class="font-semibold">${symbolName}</div>
            <div class="text-xs opacity-75">Popularity: ${popularity}%</div>
            <div class="text-xs opacity-75 capitalize">${category}</div>
        </div>
    `;
    
    updateTooltipPosition(event);
    tooltip.style.opacity = '1';
}

/**
 * Hide popularity tooltip
 */
function hidePopularityTooltip() {
    const tooltip = document.getElementById('popularity-tooltip');
    if (tooltip) {
        tooltip.style.opacity = '0';
    }
}

/**
 * Update tooltip position
 */
function updateTooltipPosition(event) {
    const tooltip = document.getElementById('popularity-tooltip');
    if (!tooltip) return;
    
    tooltip.style.left = event.clientX + 'px';
    tooltip.style.top = (event.clientY - 10) + 'px';
}

/**
 * Initialize daily wisdom animations
 */
function initializeDailyWisdomAnimations() {
    const wisdomCard = document.querySelector('.daily-wisdom-card');
    if (wisdomCard) {
        // Add rotating background effect
        wisdomCard.classList.add('glow-animation');
        
        // Add text reveal animation to content
        const textElements = wisdomCard.querySelectorAll('h2, p, blockquote');
        textElements.forEach((element, index) => {
            element.classList.add('text-reveal');
            element.style.animationDelay = `${index * 0.2}s`;
        });
    }
}

/**
 * Initialize timeline animations
 */
function initializeTimelineAnimations() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    if (!timelineItems.length) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                // Animate timeline marker
                const marker = entry.target.querySelector('.timeline-marker');
                if (marker) {
                    setTimeout(() => {
                        marker.classList.add('pulse-animation');
                    }, 300);
                }
            }
        });
    }, {
        threshold: 0.3
    });
    
    timelineItems.forEach(item => {
        observer.observe(item);
    });
}

/**
 * Initialize related dreams functionality
 */
function initializeRelatedDreams() {
    const relatedDreamsScroll = document.querySelector('.related-dreams-scroll');
    
    if (!relatedDreamsScroll) return;
    
    // Add smooth scrolling behavior
    relatedDreamsScroll.style.scrollBehavior = 'smooth';
    
    // Add scroll snap for better UX
    const dreamCards = relatedDreamsScroll.querySelectorAll('.related-dream-card');
    dreamCards.forEach(card => {
        card.style.scrollSnapAlign = 'start';
    });
    
    // Add intersection observer for scroll animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, {
        root: relatedDreamsScroll,
        threshold: 0.5
    });
    
    dreamCards.forEach(card => {
        observer.observe(card);
    });
}

// Export functions for global use
window.initializeAnimations = initializeAnimations;
window.initializePageTransitions = initializePageTransitions;
window.initializeScrollAnimations = initializeScrollAnimations;
window.initializeEnhancedHoverEffects = initializeEnhancedHoverEffects;
window.toggleMobileMenu = toggleMobileMenu;
window.openMobileMenu = openMobileMenu;
window.closeMobileMenu = closeMobileMenu;