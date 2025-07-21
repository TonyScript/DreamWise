#!/usr/bin/env node

const fs = require('fs');

console.log('🔧 创建Resources区域的页面...');

// 页面配置
const resourcePages = [
    {
        filename: 'dream-guides.html',
        title: 'Dream Guides - Complete Guide to Dream Interpretation',
        description: 'Comprehensive guides to understanding and interpreting your dreams across different cultures and spiritual traditions.',
        heading: 'Dream Interpretation Guides',
        subtitle: 'Master the art of dream analysis with our comprehensive guides',
        content: [
            {
                title: 'Getting Started with Dream Interpretation',
                icon: 'fas fa-play-circle',
                description: 'Learn the fundamentals of dream analysis and how to begin your journey into understanding your subconscious mind.',
                points: [
                    'Keep a dream journal by your bedside',
                    'Record dreams immediately upon waking',
                    'Note emotions, colors, and recurring symbols',
                    'Look for patterns across multiple dreams',
                    'Consider personal associations with symbols'
                ]
            },
            {
                title: 'Understanding Dream Symbols',
                icon: 'fas fa-eye',
                description: 'Decode the symbolic language of your dreams and understand what your subconscious is trying to communicate.',
                points: [
                    'Universal symbols vs. personal meanings',
                    'Cultural and religious symbol variations',
                    'Archetypal symbols from collective unconscious',
                    'How context changes symbol meaning',
                    'Emotional resonance of dream symbols'
                ]
            },
            {
                title: 'Multi-Faith Dream Perspectives',
                icon: 'fas fa-globe',
                description: 'Explore how different spiritual traditions interpret dreams and their significance in various cultures.',
                points: [
                    'Christian dream interpretation traditions',
                    'Islamic perspectives on dream meanings',
                    'Hindu and Buddhist dream philosophy',
                    'Indigenous and shamanic dream wisdom',
                    'Modern psychological approaches'
                ]
            },
            {
                title: 'Advanced Dream Analysis Techniques',
                icon: 'fas fa-brain',
                description: 'Develop sophisticated skills for deeper dream interpretation and spiritual insight.',
                points: [
                    'Lucid dreaming and conscious dream work',
                    'Dream incubation for guidance',
                    'Working with recurring dreams',
                    'Nightmare transformation techniques',
                    'Prophetic and precognitive dreams'
                ]
            }
        ]
    },
    {
        filename: 'spiritual-meanings.html',
        title: 'Spiritual Meanings - Deep Spiritual Interpretations of Dreams',
        description: 'Discover the profound spiritual meanings behind your dreams and their connection to your soul\'s journey.',
        heading: 'Spiritual Dream Meanings',
        subtitle: 'Uncover the sacred messages hidden in your dreams',
        content: [
            {
                title: 'Divine Communication Through Dreams',
                icon: 'fas fa-praying-hands',
                description: 'Understanding how the divine realm communicates with us through the symbolic language of dreams.',
                points: [
                    'Recognizing divine messages in dreams',
                    'Angels and spiritual guides in dreams',
                    'Prophetic dreams and their significance',
                    'Dreams as answers to prayers',
                    'Spiritual calling through dream visions'
                ]
            },
            {
                title: 'Soul Journey and Life Purpose',
                icon: 'fas fa-route',
                description: 'How dreams reveal your soul\'s path and guide you toward your highest purpose and spiritual growth.',
                points: [
                    'Dreams revealing life mission',
                    'Past life memories in dreams',
                    'Soul contracts and spiritual lessons',
                    'Karmic patterns shown in dreams',
                    'Spiritual evolution through dream work'
                ]
            },
            {
                title: 'Chakras and Energy in Dreams',
                icon: 'fas fa-circle-notch',
                description: 'Understanding how your energy centers and spiritual body manifest in your dream experiences.',
                points: [
                    'Chakra imbalances reflected in dreams',
                    'Energy healing through dream work',
                    'Aura colors and meanings in dreams',
                    'Spiritual protection in dream states',
                    'Kundalini awakening dream experiences'
                ]
            },
            {
                title: 'Sacred Symbols and Archetypes',
                icon: 'fas fa-star-and-crescent',
                description: 'Explore the deep spiritual significance of sacred symbols that appear in your dreams.',
                points: [
                    'Religious symbols across traditions',
                    'Archetypal figures and their meanings',
                    'Sacred geometry in dreams',
                    'Animal spirit guides and totems',
                    'Elemental symbolism and spiritual meaning'
                ]
            }
        ]
    },
    {
        filename: 'symbol-library.html',
        title: 'Symbol Library - Comprehensive Dream Symbol Dictionary',
        description: 'Extensive library of dream symbols with detailed meanings from multiple spiritual and cultural perspectives.',
        heading: 'Dream Symbol Library',
        subtitle: 'Comprehensive collection of dream symbols and their meanings',
        content: [
            {
                title: 'Animal Symbols',
                icon: 'fas fa-paw',
                description: 'Discover the spiritual significance of animals that appear in your dreams.',
                points: [
                    'Domestic animals: cats, dogs, horses',
                    'Wild animals: lions, bears, wolves',
                    'Birds: eagles, doves, owls, ravens',
                    'Reptiles: snakes, lizards, turtles',
                    'Insects: butterflies, spiders, bees'
                ]
            },
            {
                title: 'Natural Elements',
                icon: 'fas fa-leaf',
                description: 'Understanding the meaning of natural elements and phenomena in dreams.',
                points: [
                    'Water: oceans, rivers, rain, floods',
                    'Fire: flames, candles, lightning',
                    'Earth: mountains, caves, gardens',
                    'Air: wind, storms, clouds',
                    'Celestial: sun, moon, stars'
                ]
            },
            {
                title: 'Human Figures',
                icon: 'fas fa-users',
                description: 'Interpreting the appearance of different people and figures in your dreams.',
                points: [
                    'Family members and their significance',
                    'Strangers and unknown figures',
                    'Authority figures: teachers, leaders',
                    'Spiritual figures: angels, guides',
                    'Shadow figures and their meaning'
                ]
            },
            {
                title: 'Objects and Artifacts',
                icon: 'fas fa-cube',
                description: 'Common objects in dreams and their symbolic interpretations.',
                points: [
                    'Religious objects: crosses, prayer beads',
                    'Tools and instruments: keys, mirrors',
                    'Vehicles: cars, boats, airplanes',
                    'Buildings: houses, churches, schools',
                    'Personal items: clothes, jewelry, books'
                ]
            }
        ]
    },
    {
        filename: 'faith-perspectives.html',
        title: 'Faith Perspectives - Multi-Religious Dream Interpretation',
        description: 'Explore how different faith traditions understand and interpret dreams across various religious perspectives.',
        heading: 'Multi-Faith Dream Perspectives',
        subtitle: 'Understanding dreams through diverse spiritual traditions',
        content: [
            {
                title: 'Christian Dream Interpretation',
                icon: 'fas fa-cross',
                description: 'Biblical and Christian theological perspectives on dreams and their spiritual significance.',
                points: [
                    'Biblical dreams: Joseph, Daniel, Mary',
                    'Dreams as divine revelation',
                    'Discerning God\'s voice in dreams',
                    'Prophetic dreams in Christianity',
                    'Prayer and dream interpretation'
                ]
            },
            {
                title: 'Islamic Dream Wisdom',
                icon: 'fas fa-star-and-crescent',
                description: 'Islamic teachings on dreams, their classification, and proper interpretation methods.',
                points: [
                    'True dreams (Ru\'ya) from Allah',
                    'Dreams from the self (Nafs)',
                    'Dreams from Satan (Shaytan)',
                    'Prophet Muhammad\'s dream teachings',
                    'Islamic dream interpretation ethics'
                ]
            },
            {
                title: 'Hindu and Buddhist Perspectives',
                icon: 'fas fa-om',
                description: 'Eastern spiritual traditions and their understanding of dreams and consciousness.',
                points: [
                    'Dreams and karma in Hindu philosophy',
                    'Buddhist view of dream consciousness',
                    'Yoga Nidra and dream states',
                    'Tibetan dream yoga practices',
                    'Reincarnation memories in dreams'
                ]
            },
            {
                title: 'Indigenous and Shamanic Wisdom',
                icon: 'fas fa-feather-alt',
                description: 'Traditional indigenous approaches to dreams and their role in spiritual guidance.',
                points: [
                    'Dreams as spirit world communication',
                    'Vision quests and dream seeking',
                    'Animal spirit guides in dreams',
                    'Healing dreams and medicine',
                    'Ancestral wisdom through dreams'
                ]
            }
        ]
    },
    {
        filename: 'dream-blog.html',
        title: 'Dream Blog - Latest Insights and Dream Analysis',
        description: 'Stay updated with the latest insights, research, and stories about dream interpretation and spiritual meanings.',
        heading: 'Dream Interpretation Blog',
        subtitle: 'Latest insights, stories, and research in dream analysis',
        content: [
            {
                title: 'Recent Dream Analysis Articles',
                icon: 'fas fa-newspaper',
                description: 'Latest articles exploring dream meanings, spiritual insights, and interpretation techniques.',
                points: [
                    'Understanding Recurring Dreams: What They Mean',
                    'The Spiritual Significance of Flying Dreams',
                    'Water Dreams Across Different Cultures',
                    'Nightmares: Transforming Fear into Wisdom',
                    'Prophetic Dreams: Separating Truth from Fantasy'
                ]
            },
            {
                title: 'Dream Research and Studies',
                icon: 'fas fa-microscope',
                description: 'Scientific research and studies on dreams, sleep, and consciousness.',
                points: [
                    'Neuroscience of dreaming and REM sleep',
                    'Cultural variations in dream interpretation',
                    'Psychological benefits of dream analysis',
                    'Lucid dreaming research findings',
                    'Dreams and emotional processing'
                ]
            },
            {
                title: 'Community Dream Stories',
                icon: 'fas fa-users',
                description: 'Real dream experiences shared by our community members and their interpretations.',
                points: [
                    'Healing dreams that changed lives',
                    'Prophetic dreams that came true',
                    'Dreams that provided spiritual guidance',
                    'Recurring dreams and their resolution',
                    'Dreams connecting with deceased loved ones'
                ]
            },
            {
                title: 'Seasonal Dream Patterns',
                icon: 'fas fa-calendar-alt',
                description: 'How dreams change with seasons, moon phases, and spiritual calendar events.',
                points: [
                    'Full moon dreams and their intensity',
                    'Holiday and seasonal dream themes',
                    'Dreams during spiritual seasons',
                    'Anniversary and memorial dreams',
                    'New year and transformation dreams'
                ]
            }
        ]
    },
    {
        filename: 'community.html',
        title: 'Dream Community - Connect with Fellow Dreamers',
        description: 'Join our community of dream enthusiasts, share experiences, and learn from others on their spiritual journey.',
        heading: 'Dream Interpretation Community',
        subtitle: 'Connect, share, and learn with fellow dream explorers',
        content: [
            {
                title: 'Community Guidelines',
                icon: 'fas fa-handshake',
                description: 'Creating a safe and respectful space for sharing dream experiences and interpretations.',
                points: [
                    'Respect all spiritual and cultural perspectives',
                    'Share dreams with sensitivity and care',
                    'Offer interpretations as suggestions, not absolutes',
                    'Maintain confidentiality and privacy',
                    'Support others with kindness and wisdom'
                ]
            },
            {
                title: 'Dream Sharing Circles',
                icon: 'fas fa-circle',
                description: 'Virtual and local gatherings where community members share and explore dreams together.',
                points: [
                    'Weekly online dream sharing sessions',
                    'Monthly themed dream discussions',
                    'Local meetup groups in major cities',
                    'Special sessions for recurring dreams',
                    'Guided meditation and dream work'
                ]
            },
            {
                title: 'Expert Guidance',
                icon: 'fas fa-graduation-cap',
                description: 'Access to experienced dream interpreters and spiritual counselors from various traditions.',
                points: [
                    'Certified dream analysts and counselors',
                    'Multi-faith spiritual advisors',
                    'Psychology and therapy professionals',
                    'Indigenous wisdom keepers',
                    'Experienced lucid dream practitioners'
                ]
            },
            {
                title: 'Learning Resources',
                icon: 'fas fa-book-open',
                description: 'Educational materials, workshops, and courses to deepen your dream interpretation skills.',
                points: [
                    'Beginner dream interpretation courses',
                    'Advanced spiritual dream work',
                    'Cultural dream interpretation workshops',
                    'Lucid dreaming training programs',
                    'Dream journal writing techniques'
                ]
            }
        ]
    }
];

// 创建页面模板
function createPageTemplate(page) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    <!-- SEO Meta Tags -->
    <title>${page.title}</title>
    <meta name="description" content="${page.description}">
    <meta name="keywords" content="dream interpretation, spiritual meanings, dream analysis, dream symbols, multi-faith perspectives">
    <meta name="author" content="Dream Interpretation Platform">
    <meta name="robots" content="index, follow">
    <meta name="theme-color" content="#8B5CF6">
    
    <!-- Open Graph Meta Tags -->
    <meta property="og:title" content="${page.title}">
    <meta property="og:description" content="${page.description}">
    <meta property="og:type" content="website">
    <meta property="og:image" content="/assets/images/og-${page.filename.replace('.html', '')}.jpg">
    
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
                <h1 class="text-4xl md:text-5xl font-bold mb-6">
                    ${page.heading}
                </h1>
                <p class="text-xl text-gray-300 mb-4">
                    ${page.subtitle}
                </p>
                <p class="text-lg text-gray-400 max-w-2xl mx-auto">
                    ${page.description}
                </p>
            </div>
        </div>
    </section>

    <!-- Main Content -->
    <main class="py-16">
        <div class="container mx-auto px-6">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                ${page.content.map(section => `
                <div class="glass-card p-8 hover-scale">
                    <div class="flex items-center mb-6">
                        <div class="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center mr-4">
                            <i class="${section.icon} text-white text-2xl"></i>
                        </div>
                        <h2 class="text-2xl font-bold">${section.title}</h2>
                    </div>
                    
                    <p class="text-gray-300 mb-6 leading-relaxed">
                        ${section.description}
                    </p>
                    
                    <ul class="space-y-3">
                        ${section.points.map(point => `
                        <li class="flex items-start">
                            <div class="w-2 h-2 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 mt-2 mr-3 flex-shrink-0"></div>
                            <span class="text-gray-400">${point}</span>
                        </li>
                        `).join('')}
                    </ul>
                </div>
                `).join('')}
            </div>
            
            <!-- Call to Action -->
            <div class="mt-16 text-center">
                <div class="glass-card max-w-2xl mx-auto p-8">
                    <h3 class="text-2xl font-bold mb-4">Ready to Explore Your Dreams?</h3>
                    <p class="text-gray-300 mb-6">
                        Start your journey of dream interpretation and spiritual discovery today.
                    </p>
                    <div class="flex flex-col sm:flex-row gap-4 justify-center">
                        <a href="browse.html" class="btn-primary">
                            <i class="fas fa-search mr-2"></i>
                            Browse Dream Dictionary
                        </a>
                        <a href="categories.html" class="btn-secondary">
                            <i class="fas fa-list mr-2"></i>
                            Explore Categories
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

// 创建所有页面
resourcePages.forEach(page => {
    const content = createPageTemplate(page);
    fs.writeFileSync(page.filename, content);
    console.log(`✅ 创建页面: ${page.filename}`);
});

console.log('');
console.log('🎉 所有Resources页面创建完成！');
console.log('');
console.log('创建的页面：');
resourcePages.forEach(page => {
    console.log(`📄 ${page.filename} - ${page.title}`);
});

console.log('');
console.log('📝 注意事项：');
console.log('- 所有页面都包含完整的导航和Footer组件');
console.log('- 内容结构统一，易于维护');
console.log('- SEO优化，包含适当的meta标签');
console.log('- 响应式设计，适配移动端');
console.log('- Dream Journal链接已在footer中隐藏');