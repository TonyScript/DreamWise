// Test script to verify insights.html functionality
console.log('Testing insights.html page...');

// Test 1: Check if word cloud container exists and has proper styling
const wordCloudContainer = document.querySelector('.word-cloud-container');
if (wordCloudContainer) {
    console.log('✅ Word cloud container found');
    
    // Check if container has proper display properties
    const computedStyle = window.getComputedStyle(wordCloudContainer);
    console.log('Word cloud container styles:');
    console.log('- Display:', computedStyle.display);
    console.log('- Flex-wrap:', computedStyle.flexWrap);
    console.log('- Justify-content:', computedStyle.justifyContent);
    console.log('- Min-height:', computedStyle.minHeight);
} else {
    console.log('❌ Word cloud container not found');
}

// Test 2: Check if word cloud items exist and are visible
const wordCloudItems = document.querySelectorAll('.word-cloud-item');
if (wordCloudItems.length > 0) {
    console.log(`✅ Found ${wordCloudItems.length} word cloud items`);
    
    // Check visibility of first few items
    let visibleCount = 0;
    let hiddenCount = 0;
    
    wordCloudItems.forEach((item, index) => {
        const computedStyle = window.getComputedStyle(item);
        const isVisible = computedStyle.display !== 'none' && computedStyle.opacity !== '0';
        
        if (isVisible) {
            visibleCount++;
        } else {
            hiddenCount++;
        }
        
        if (index < 5) {
            console.log(`Item ${index + 1} (${item.textContent.trim()}):`, {
                display: computedStyle.display,
                opacity: computedStyle.opacity,
                visibility: computedStyle.visibility
            });
        }
    });
    
    console.log(`✅ Visible items: ${visibleCount}, Hidden items: ${hiddenCount}`);
} else {
    console.log('❌ No word cloud items found');
}

// Test 3: Check if category filter buttons exist
const filterButtons = document.querySelectorAll('.category-filter-btn');
if (filterButtons.length > 0) {
    console.log(`✅ Found ${filterButtons.length} category filter buttons`);
    
    // Check if active button exists
    const activeButton = document.querySelector('.category-filter-btn.active');
    if (activeButton) {
        console.log('✅ Active filter button found:', activeButton.textContent.trim());
    } else {
        console.log('⚠️ No active filter button found');
    }
} else {
    console.log('❌ No category filter buttons found');
}

// Test 4: Check if popularity legend has correct colors
const popularityLegend = document.querySelector('.mt-6.pt-4.border-t.border-white\\/10');
if (popularityLegend) {
    console.log('✅ Popularity legend found');
    
    const legendItems = popularityLegend.querySelectorAll('.flex.items-center');
    legendItems.forEach((item, index) => {
        const colorSpan = item.querySelector('span[class*="text-"]');
        if (colorSpan) {
            const classes = colorSpan.className;
            console.log(`Legend item ${index + 1} color classes:`, classes);
        }
    });
} else {
    console.log('❌ Popularity legend not found');
}

// Test 5: Check if JavaScript functions are available
const functionsToCheck = ['filterWordCloud', 'showTooltip', 'hideTooltip'];
functionsToCheck.forEach(funcName => {
    if (typeof window[funcName] === 'function') {
        console.log(`✅ Function ${funcName} is available`);
    } else {
        console.log(`❌ Function ${funcName} is not available`);
    }
});

// Test 6: Test filter functionality
if (typeof filterWordCloud === 'function') {
    console.log('🧪 Testing filter functionality...');
    
    // Test filtering by category
    filterWordCloud('animals');
    
    setTimeout(() => {
        const visibleItems = document.querySelectorAll('.word-cloud-item:not(.hidden)');
        const hiddenItems = document.querySelectorAll('.word-cloud-item.hidden');
        
        console.log(`After filtering by 'animals': ${visibleItems.length} visible, ${hiddenItems.length} hidden`);
        
        // Reset to show all
        filterWordCloud('all');
        
        setTimeout(() => {
            const allVisibleItems = document.querySelectorAll('.word-cloud-item:not(.hidden)');
            console.log(`After resetting to 'all': ${allVisibleItems.length} visible`);
        }, 100);
    }, 100);
}

console.log('Insights page test completed!');