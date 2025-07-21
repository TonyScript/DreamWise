#!/usr/bin/env node

const fs = require('fs');

console.log('🔧 创建Dream Guides详细页面...');

// Dream Guides详细页面配置
const guideDetails = [
    {
        id: 'getting-started',
        title: 'Getting Started with Dream Interpretation',
        description: 'Learn the fundamentals of dream analysis and how to begin your journey into understanding your subconscious mind.',
        icon: 'fas fa-play-circle',
        sections: [
            {
                title: 'Starting Your Dream Journal',
                content: `<p class="mb-4">A dream journal is the foundation of effective dream interpretation. Keep a notebook and pen by your bedside to record dreams immediately upon waking, when they're still fresh in your mind.</p>
                <p class="mb-4">Your journal entries should include:</p>
                <ul class="list-disc pl-6 mb-4 space-y-2">
                    <li>Date and time of the dream</li>
                    <li>Full narrative of what happened</li>
                    <li>Emotions felt during the dream</li>
                    <li>Colors, numbers, and symbols that stood out</li>
                    <li>Your initial thoughts about possible meanings</li>
                </ul>
                <p>Over time, patterns will emerge that provide valuable insights into your subconscious mind and spiritual journey.</p>`
            },
            {
                title: 'Recognizing Dream Types',
                content: `<p class="mb-4">Dreams come in various types, each with different significance:</p>
                <ul class="list-disc pl-6 mb-4 space-y-2">
                    <li><strong>Ordinary dreams</strong> - Processing daily experiences and emotions</li>
                    <li><strong>Lucid dreams</strong> - Dreams where you're aware you're dreaming</li>
                    <li><strong>Recurring dreams</strong> - Repeated dream themes indicating unresolved issues</li>
                    <li><strong>Prophetic dreams</strong> - Dreams that appear to predict future events</li>
                    <li><strong>Healing dreams</strong> - Dreams that offer solutions to problems</li>
                </ul>
                <p>Learning to identify these different types will help you understand the purpose and message of each dream experience.</p>`
            },
            {
                title: 'Creating the Right Environment',
                content: `<p class="mb-4">Your sleep environment significantly impacts dream recall and quality. Create conditions that support meaningful dreams:</p>
                <ul class="list-disc pl-6 mb-4 space-y-2">
                    <li>Reduce screen time 1-2 hours before bed</li>
                    <li>Create a peaceful bedroom atmosphere</li>
                    <li>Use calming scents like lavender</li>
                    <li>Practice meditation before sleep</li>
                    <li>Set an intention to remember your dreams</li>
                </ul>
                <p>These practices enhance dream recall and can lead to more spiritually significant dream experiences.</p>`
            },
            {
                title: 'Basic Interpretation Techniques',
                content: `<p class="mb-4">Begin interpreting your dreams with these fundamental approaches:</p>
                <ul class="list-disc pl-6 mb-4 space-y-2">
                    <li><strong>Personal associations</strong> - What the symbol means specifically to you</li>
                    <li><strong>Emotional response</strong> - How the dream made you feel</li>
                    <li><strong>Recent events</strong> - Connections to your waking life</li>
                    <li><strong>Universal symbolism</strong> - Common meanings across cultures</li>
                    <li><strong>Spiritual significance</strong> - Potential divine messages</li>
                </ul>
                <p>Remember that you are the ultimate authority on your dreams. Trust your intuition when interpreting their meaning.</p>`
            }
        ]
    },
    {
        id: 'understanding-symbols',
        title: 'Understanding Dream Symbols',
        description: 'Decode the symbolic language of your dreams and understand what your subconscious is trying to communicate.',
        icon: 'fas fa-eye',
        sections: [
            {
                title: 'Personal vs. Universal Symbols',
                content: `<p class="mb-4">Dream symbols operate on two levels:</p>
                <ul class="list-disc pl-6 mb-4 space-y-2">
                    <li><strong>Personal symbols</strong> - Meanings unique to your experiences (e.g., your childhood home)</li>
                    <li><strong>Universal symbols</strong> - Meanings shared across cultures (e.g., water representing emotions)</li>
                </ul>
                <p class="mb-4">Always prioritize your personal associations with symbols, as these often carry the most relevant meaning for your life.</p>
                <p>For example, while snakes universally symbolize transformation, your personal fear or fascination with snakes will significantly influence their meaning in your dreams.</p>`
            },
            {
                title: 'Cultural and Religious Influences',
                content: `<p class="mb-4">Your cultural and religious background shapes how symbols appear in your dreams:</p>
                <ul class="list-disc pl-6 mb-4 space-y-2">
                    <li>Christian traditions may feature crosses, angels, or biblical imagery</li>
                    <li>Islamic dreams might include mosques, prayers, or religious texts</li>
                    <li>Hindu and Buddhist dreams often contain mandalas, deities, or meditation symbols</li>
                    <li>Indigenous traditions may feature nature spirits, ancestors, or animal guides</li>
                </ul>
                <p>Understanding these influences helps contextualize your dream symbols within your spiritual framework.</p>`
            },
            {
                title: 'Common Symbol Categories',
                content: `<p class="mb-4">Dream symbols typically fall into these major categories:</p>
                <ul class="list-disc pl-6 mb-4 space-y-2">
                    <li><strong>Natural elements</strong> - Water, fire, earth, air, and their meanings</li>
                    <li><strong>Animals</strong> - Different creatures and their spiritual qualities</li>
                    <li><strong>People</strong> - Known individuals, strangers, archetypes</li>
                    <li><strong>Objects</strong> - Tools, vehicles, buildings, and their significance</li>
                    <li><strong>Actions</strong> - Flying, falling, running, searching, and what they represent</li>
                </ul>
                <p>Learning to recognize these categories helps organize your interpretation approach.</p>`
            },
            {
                title: 'Symbol Context and Relationships',
                content: `<p class="mb-4">A symbol's meaning changes based on its context and relationship to other dream elements:</p>
                <ul class="list-disc pl-6 mb-4 space-y-2">
                    <li>The setting where the symbol appears</li>
                    <li>How you interact with the symbol</li>
                    <li>Other symbols that appear alongside it</li>
                    <li>The emotions associated with the symbol</li>
                    <li>The symbol's behavior or condition</li>
                </ul>
                <p>For example, water in a peaceful lake has a different meaning than water in a threatening tsunami, though both represent emotions.</p>`
            }
        ]
    }
];

// 创建详细页面模板
function createGuideDetailTemplate(guide) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    <!-- SEO Meta Tags -->
    <title>${guide.title} - Dream Interpretation Guide</title>
    <meta name="description" content="${guide.description}">
    <meta name="keywords" content="dream interpretation, dream analysis, dream symbols, spiritual dreams, ${guide.title.toLowerCase()}">
    <meta name="author" content="Dream Interpretation Platform">
    <meta name="robots" content="index, follow">
    <meta name="theme-color" content="#8B5CF6">
    
    <!-- Open Graph Meta Tags -->
    <meta property="og:title" content="${guide.title} - Dream Interpretation Guide">
    <meta property="og:description" content="${guide.description}">
    <meta property="og:type" content="article">
    <meta property="og:image" content="/assets/images/og-dream-guides.jpg">
    
    <!-- Favicon -->
    <link rel="icon" type="image/x-icon" href="assets/images/favicon.ico">
    
    <!-- Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    fontFamily: {
                        'inter': ['Inter', 'sans-serif'],
                    },
                    colors: {
                        'glass': 'rgba(255, 255, 255, 0.1)',
                    }
                }
            }
        }
    </script>
    
    <!-- Font Awesome Icons -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
    
    <!-- Inter Font -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    
    <!-- Custom CSS -->
    <link rel="stylesheet" href="assets/css/main.min.css">
</head>
<body>
    <!-- Navigation Header -->
    <nav class="fixed top-0 left-0 right-0 z-50 glass-card mx-4 mt-4 rounded-2xl">
        <div class="container mx-auto px-6 py-4">
            <div class="flex items-center justify-between">
                <!-- Logo -->
                <div class="flex items-center space-x-3">
                    <div class="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                        <i class="fas fa-moon text-white text-lg"></i>
                    </div>
                    <span class="text-xl font-bold gradient-text">DreamWise</span>
                </div>
                
                <!-- Desktop Navigation -->
                <div class="hidden md:flex items-center space-x-8">
                    <a href="index.html" class="text-white hover:text-purple-300 transition-colors duration-300 font-medium">Home</a>
                    <a href="browse.html" class="text-white hover:text-purple-300 transition-colors duration-300 font-medium">Browse A-Z</a>
                    <a href="categories.html" class="text-white hover:text-purple-300 transition-colors duration-300 font-medium">Categories</a>
                    <a href="insights.html" class="text-white hover:text-purple-300 transition-colors duration-300 font-medium">Daily Insights</a>
                </div>
                
                <!-- Mobile Menu Button -->
                <button class="md:hidden mobile-menu-toggle text-white hover:text-purple-300 transition-colors duration-300">
                    <i class="fas fa-bars text-xl"></i>
                </button>
            </div>
            
            <!-- Mobile Navigation Menu -->
            <div class="mobile-menu hidden md:hidden mt-4 pt-4 border-t border-white/20">
                <div class="flex flex-col space-y-3">
                    <a href="index.html" class="text-white hover:text-purple-300 transition-colors duration-300 font-medium py-2">Home</a>
                    <a href="browse.html" class="text-white hover:text-purple-300 transition-colors duration-300 font-medium py-2">Browse A-Z</a>
                    <a href="categories.html" class="text-white hover:text-purple-300 transition-colors duration-300 font-medium py-2">Categories</a>
                    <a href="insights.html" class="text-white hover:text-purple-300 transition-colors duration-300 font-medium py-2">Daily Insights</a>
                </div>
            </div>
        </div>
    </nav>

    <!-- Page Header -->
    <section class="pt-32 pb-16 relative">
        <div class="container mx-auto px-6 text-center">
            <div class="glass-card max-w-4xl mx-auto p-8">
                <div class="w-20 h-20 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center mx-auto mb-6">
                    <i class="${guide.icon} text-white text-3xl"></i>
                </div>
                <h1 class="text-4xl md:text-5xl font-bold mb-6">
                    ${guide.title}
                </h1>
                <p class="text-xl text-gray-300 mb-4">
                    ${guide.description}
                </p>
                <div class="flex justify-center mt-8">
                    <a href="dream-guides.html" class="text-purple-300 hover:text-purple-200 transition-colors duration-300">
                        <i class="fas fa-arrow-left mr-2"></i> Back to All Guides
                    </a>
                </div>
            </div>
        </div>
    </section>

    <!-- Main Content -->
    <main class="py-16">
        <div class="container mx-auto px-6">
            <div class="max-w-4xl mx-auto">
                ${guide.sections.map((section, index) => `
                <div class="glass-card p-8 mb-8 hover-scale">
                    <h2 class="text-2xl font-bold mb-6 gradient-text">${section.title}</h2>
                    ${section.content}
                </div>
                `).join('')}
                
                <!-- Next Steps -->
                <div class="glass-card p-8 mt-12">
                    <h2 class="text-2xl font-bold mb-6 gradient-text">Next Steps</h2>
                    <p class="text-gray-300 mb-6">Continue your dream interpretation journey with these resources:</p>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <a href="dream-guides.html" class="glass-card hover-scale p-4 text-center group">
                            <div class="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                                <i class="fas fa-book text-white"></i>
                            </div>
                            <h3 class="font-semibold mb-2">More Dream Guides</h3>
                            <p class="text-sm text-gray-400">Explore our complete collection of dream interpretation guides</p>
                        </a>
                        
                        <a href="symbol-library.html" class="glass-card hover-scale p-4 text-center group">
                            <div class="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
                                <i class="fas fa-search text-white"></i>
                            </div>
                            <h3 class="font-semibold mb-2">Symbol Library</h3>
                            <p class="text-sm text-gray-400">Browse our comprehensive dictionary of dream symbols</p>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </main>

    <!-- Footer Container - Loaded dynamically -->
    <div id="footer-container"></div>

    <!-- JavaScript -->
    <script src="assets/js/main.min.js"></script>
    <script src="assets/js/components.js"></script>
</body>
</html>`;
}

// 创建所有详细页面
guideDetails.forEach(guide => {
    const filename = `guide-${guide.id}.html`;
    const content = createGuideDetailTemplate(guide);
    fs.writeFileSync(filename, content);
    console.log(`✅ 创建详细指南页面: ${filename}`);
});

// 更新主Dream Guides页面，添加链接到详细页面
console.log('');
console.log('📝 更新Dream Guides主页面，添加详细页面链接...');

// 读取当前Dream Guides页面
let guidesPageContent = fs.readFileSync('dream-guides.html', 'utf8');

// 为每个指南部分添加"Read More"链接
guideDetails.forEach(guide => {
    const linkHtml = `<a href="guide-${guide.id}.html" class="inline-block mt-4 text-purple-300 hover:text-purple-200 transition-colors duration-300">Read Full Guide <i class="fas fa-arrow-right ml-1"></i></a>`;
    
    // 查找指南部分并添加链接
    const sectionRegex = new RegExp(`<h2 class="text-2xl font-bold">${guide.title}</h2>[\\s\\S]*?</ul>\\s*</div>`, 'g');
    guidesPageContent = guidesPageContent.replace(sectionRegex, (match) => {
        return match.replace('</div>', `${linkHtml}</div>`);
    });
});

// 保存更新后的Dream Guides页面
fs.writeFileSync('dream-guides.html', guidesPageContent);
console.log('✅ Dream Guides主页面更新完成，添加了详细页面链接');

console.log('');
console.log('🎉 Dream Guides详细页面创建完成！');
console.log('');
console.log('创建的详细页面：');
guideDetails.forEach(guide => {
    console.log(`📄 guide-${guide.id}.html - ${guide.title}`);
});

console.log('');
console.log('📝 下一步建议：');
console.log('1. 为其余的指南主题创建详细页面');
console.log('2. 创建Dream Blog详细文章页面');
console.log('3. 明确Community页面的定位和功能');