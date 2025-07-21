#!/usr/bin/env node

const fs = require('fs');

console.log('🔧 创建额外的Dream Guides详细页面...');

// 额外的Dream Guides详细页面配置
const additionalGuides = [
    {
        id: 'multi-faith-perspectives',
        title: 'Multi-Faith Dream Perspectives',
        description: 'Explore how different spiritual traditions interpret dreams and their significance in various cultures.',
        icon: 'fas fa-globe',
        sections: [
            {
                title: 'Christian Dream Interpretation',
                content: `<p class="mb-4">Christianity has a rich tradition of dream interpretation dating back to biblical times. In the Christian tradition, dreams are often seen as a way God communicates with believers.</p>
                <p class="mb-4">Key aspects of Christian dream interpretation include:</p>
                <ul class="list-disc pl-6 mb-4 space-y-2">
                    <li>Biblical precedents (Joseph, Daniel, Solomon)</li>
                    <li>Symbolic language as divine communication</li>
                    <li>Moral and spiritual guidance through dreams</li>
                    <li>Prophetic dreams as warnings or promises</li>
                    <li>Discernment between divine dreams and ordinary dreams</li>
                </ul>
                <p>Many Christians believe that dreams can provide spiritual direction, comfort, and insight when interpreted through prayer and biblical understanding.</p>`
            },
            {
                title: 'Islamic Dream Traditions',
                content: `<p class="mb-4">Dream interpretation holds a special place in Islamic tradition, with the Prophet Muhammad himself providing guidance on understanding dreams.</p>
                <p class="mb-4">Islamic dream interpretation is categorized into three types:</p>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div class="bg-blue-900/30 p-4 rounded-lg">
                        <h4 class="text-lg font-semibold text-blue-300 mb-2">Ru'ya (True Dreams)</h4>
                        <p>Divine dreams from Allah that contain truth and guidance</p>
                    </div>
                    <div class="bg-gray-800/50 p-4 rounded-lg">
                        <h4 class="text-lg font-semibold text-gray-300 mb-2">Hulm (Ordinary Dreams)</h4>
                        <p>Dreams from one's own psyche reflecting daily thoughts</p>
                    </div>
                    <div class="bg-red-900/30 p-4 rounded-lg">
                        <h4 class="text-lg font-semibold text-red-300 mb-2">Adghath (Confused Dreams)</h4>
                        <p>Dreams influenced by Satan or evil spirits</p>
                    </div>
                </div>
                <p>Islamic scholars have developed extensive dream symbol dictionaries, with interpretations often considering the dreamer's personal circumstances and spiritual state.</p>`
            },
            {
                title: 'Hindu and Buddhist Perspectives',
                content: `<p class="mb-4">Eastern traditions like Hinduism and Buddhism view dreams as important aspects of consciousness and spiritual development.</p>
                <p class="mb-4">In these traditions, dreams may be understood as:</p>
                <ul class="list-disc pl-6 mb-4 space-y-2">
                    <li><strong>Reflections of karma</strong> - Past actions manifesting in dream consciousness</li>
                    <li><strong>States of consciousness</strong> - One of several states of awareness</li>
                    <li><strong>Opportunities for practice</strong> - Especially in dream yoga traditions</li>
                    <li><strong>Glimpses of past lives</strong> - Memories from previous incarnations</li>
                    <li><strong>Messages from deities</strong> - Divine communication through symbolic imagery</li>
                </ul>
                <p class="mb-4">Buddhist dream yoga practices teach practitioners to recognize the dream state while dreaming (lucid dreaming) as a step toward recognizing the illusory nature of all phenomena.</p>
                <p>Hindu traditions often associate dreams with the subtle body and its movement during sleep, with certain dreams considered auspicious or inauspicious.</p>`
            },
            {
                title: 'Indigenous and Shamanic Wisdom',
                content: `<p class="mb-4">Indigenous cultures worldwide have developed sophisticated dream practices that honor dreams as direct connections to the spirit world.</p>
                <p class="mb-4">Common elements in indigenous dream work include:</p>
                <div class="bg-gradient-to-r from-green-900/30 to-blue-900/30 p-6 rounded-lg mb-6">
                    <h4 class="text-lg font-semibold text-green-300 mb-4">Key Indigenous Dream Practices</h4>
                    <div class="space-y-4">
                        <div class="flex items-start">
                            <div class="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold mr-4 mt-1">1</div>
                            <div>
                                <strong class="text-white">Dream incubation</strong> - Setting intentions for specific dream guidance
                            </div>
                        </div>
                        <div class="flex items-start">
                            <div class="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold mr-4 mt-1">2</div>
                            <div>
                                <strong class="text-white">Community dream sharing</strong> - Dreams as messages for the entire community
                            </div>
                        </div>
                        <div class="flex items-start">
                            <div class="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold mr-4 mt-1">3</div>
                            <div>
                                <strong class="text-white">Animal spirit guides</strong> - Animals in dreams as messengers and teachers
                            </div>
                        </div>
                        <div class="flex items-start">
                            <div class="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold mr-4 mt-1">4</div>
                            <div>
                                <strong class="text-white">Ancestral communication</strong> - Dreams as a bridge to ancestral wisdom
                            </div>
                        </div>
                    </div>
                </div>
                <p>Many indigenous traditions view dreams not as mere psychological phenomena but as actual journeys of the soul or spirit into other realms of reality.</p>`
            }
        ]
    },
    {
        id: 'advanced-techniques',
        title: 'Advanced Dream Analysis Techniques',
        description: 'Develop sophisticated skills for deeper dream interpretation and spiritual insight.',
        icon: 'fas fa-brain',
        sections: [
            {
                title: 'Lucid Dreaming Practices',
                content: `<p class="mb-4">Lucid dreaming—becoming aware that you're dreaming while in the dream state—opens powerful possibilities for spiritual growth and dream work.</p>
                <p class="mb-4">Techniques to develop lucid dreaming include:</p>
                <div class="space-y-4 mb-6">
                    <div class="glass-card p-4">
                        <h4 class="font-bold mb-2">Reality Testing</h4>
                        <p>Regularly questioning whether you're dreaming during waking hours to build the habit of reality checking in dreams. Common tests include trying to push your finger through your palm or checking text twice to see if it changes.</p>
                    </div>
                    <div class="glass-card p-4">
                        <h4 class="font-bold mb-2">MILD Technique</h4>
                        <p>Mnemonic Induction of Lucid Dreams involves setting a strong intention to remember you're dreaming before sleep, often by repeating an affirmation like "I will realize I'm dreaming."</p>
                    </div>
                    <div class="glass-card p-4">
                        <h4 class="font-bold mb-2">Wake Back to Bed</h4>
                        <p>Waking up after 5-6 hours of sleep, staying awake for 20-30 minutes while focusing on lucid dreaming, then returning to sleep often induces lucidity.</p>
                    </div>
                    <div class="glass-card p-4">
                        <h4 class="font-bold mb-2">Dream Journaling</h4>
                        <p>Detailed recording of dreams increases dream recall and awareness, making lucidity more likely over time.</p>
                    </div>
                </div>
                <p>Once lucid, you can consciously explore dream symbolism, ask questions of dream figures, or practice spiritual techniques within the dream state.</p>`
            },
            {
                title: 'Dream Incubation Methods',
                content: `<p class="mb-4">Dream incubation is the practice of intentionally influencing dream content to receive guidance on specific questions or issues.</p>
                <p class="mb-4">This ancient practice has been used across cultures for thousands of years and involves:</p>
                <ul class="list-disc pl-6 mb-4 space-y-2">
                    <li><strong>Question formulation</strong> - Crafting clear, meaningful questions</li>
                    <li><strong>Intention setting</strong> - Focusing on the question before sleep</li>
                    <li><strong>Symbolic preparation</strong> - Using objects related to your question</li>
                    <li><strong>Sacred space creation</strong> - Preparing your sleep environment</li>
                    <li><strong>Receptive mindset</strong> - Cultivating openness to guidance</li>
                </ul>
                <div class="bg-purple-900/30 border border-purple-500/30 rounded-lg p-6 mb-6">
                    <h4 class="font-bold mb-2">Dream Incubation Ritual</h4>
                    <ol class="list-decimal pl-6 space-y-2">
                        <li>Write your question on paper and place it under your pillow</li>
                        <li>Meditate on the question for 5-10 minutes before sleep</li>
                        <li>Visualize receiving an answer in your dreams</li>
                        <li>Keep your dream journal and pen ready beside your bed</li>
                        <li>Record any dreams immediately upon waking</li>
                    </ol>
                </div>
                <p>Dream incubation is particularly effective for spiritual guidance, creative problem-solving, and healing insights.</p>`
            },
            {
                title: 'Working with Recurring Dreams',
                content: `<p class="mb-4">Recurring dreams often contain profound messages that require special attention and techniques to fully understand and integrate.</p>
                <p class="mb-4">Advanced approaches to recurring dreams include:</p>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div class="bg-blue-900/30 p-6 rounded-lg">
                        <h4 class="text-lg font-semibold text-blue-300 mb-3">Active Imagination</h4>
                        <p class="mb-3">A Jungian technique where you consciously continue the dream while awake, dialoguing with dream figures to uncover deeper meanings.</p>
                        <p class="text-sm text-gray-400"><strong>Best for:</strong> Understanding complex emotional content</p>
                    </div>
                    <div class="bg-green-900/30 p-6 rounded-lg">
                        <h4 class="text-lg font-semibold text-green-300 mb-3">Dream Reentry</h4>
                        <p class="mb-3">Meditation technique where you visualize reentering the dream to explore it further or change its outcome.</p>
                        <p class="text-sm text-gray-400"><strong>Best for:</strong> Transforming nightmares and finding resolution</p>
                    </div>
                    <div class="bg-purple-900/30 p-6 rounded-lg">
                        <h4 class="text-lg font-semibold text-purple-300 mb-3">Timeline Analysis</h4>
                        <p class="mb-3">Tracking recurring dreams over time to identify patterns, triggers, and evolution of the dream's content.</p>
                        <p class="text-sm text-gray-400"><strong>Best for:</strong> Understanding developmental processes</p>
                    </div>
                    <div class="bg-amber-900/30 p-6 rounded-lg">
                        <h4 class="text-lg font-semibold text-amber-300 mb-3">Embodiment Work</h4>
                        <p class="mb-3">Physically expressing or enacting elements of the dream to access bodily wisdom about its meaning.</p>
                        <p class="text-sm text-gray-400"><strong>Best for:</strong> Accessing non-verbal understanding</p>
                    </div>
                </div>
                <p>The resolution of recurring dreams often marks significant psychological or spiritual growth, as they typically appear to highlight unresolved issues or important life transitions.</p>`
            },
            {
                title: 'Integrating Dream Wisdom',
                content: `<p class="mb-4">The ultimate purpose of advanced dream work is not just interpretation but integration—bringing dream insights into waking life in meaningful ways.</p>
                <p class="mb-4">Effective integration practices include:</p>
                <ul class="list-disc pl-6 mb-6 space-y-2">
                    <li><strong>Creative expression</strong> - Translating dream imagery into art, writing, music, or movement</li>
                    <li><strong>Ritual enactment</strong> - Creating ceremonies based on significant dreams</li>
                    <li><strong>Contemplative practice</strong> - Meditating on dream symbols and insights</li>
                    <li><strong>Concrete actions</strong> - Taking specific steps inspired by dream guidance</li>
                    <li><strong>Relationship healing</strong> - Applying dream insights to interpersonal situations</li>
                </ul>
                <div class="bg-yellow-900/20 border border-yellow-500/30 p-6 rounded-lg mb-6">
                    <h4 class="text-lg font-semibold text-yellow-300 mb-3">Integration Journal Practice</h4>
                    <p class="mb-3">For each significant dream, answer these questions:</p>
                    <ol class="list-decimal pl-6 space-y-2">
                        <li>What is the core message or insight from this dream?</li>
                        <li>How does this relate to my current life situation?</li>
                        <li>What specific action can I take based on this insight?</li>
                        <li>How might this dream be guiding my spiritual development?</li>
                        <li>What would change in my life if I fully embraced this dream's wisdom?</li>
                    </ol>
                </div>
                <p>True mastery of dream work comes not from collecting interpretations but from allowing dreams to transform your waking consciousness and daily choices.</p>`
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
additionalGuides.forEach(guide => {
    const filename = `guide-${guide.id}.html`;
    const content = createGuideDetailTemplate(guide);
    fs.writeFileSync(filename, content);
    console.log(`✅ 创建详细指南页面: ${filename}`);
});

// 更新Dream Guides页面，修复布局并添加链接到新的详细页面
console.log('');
console.log('📝 更新Dream Guides主页面，修复布局并添加新页面链接...');

// 读取当前Dream Guides页面
let guidesPageContent = fs.readFileSync('dream-guides.html', 'utf8');

// 修复Multi-Faith Dream Perspectives部分
guidesPageContent = guidesPageContent.replace(
    /<div class="glass-card p-8 hover-scale group cursor-pointer transition-all duration-300 hover:bg-purple-900\/20">\s*<div class="flex items-center mb-6">\s*<div class="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center mr-4">\s*<i class="fas fa-globe text-white text-2xl"><\/i>\s*<\/div>\s*<h2 class="text-2xl font-bold group-hover:text-purple-300 transition-colors">Multi-Faith Dream Perspectives <span class="text-sm text-purple-400">\(Coming Soon\)<\/span><\/h2>/,
    `<a href="guide-multi-faith-perspectives.html" class="glass-card p-8 hover-scale block group transition-all duration-300 hover:bg-purple-900/20">
                    <div class="flex items-center mb-6">
                        <div class="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                            <i class="fas fa-globe text-white text-2xl"></i>
                        </div>
                        <h2 class="text-2xl font-bold group-hover:text-purple-300 transition-colors">Multi-Faith Dream Perspectives</h2>`
);

// 修复Advanced Dream Analysis Techniques部分
guidesPageContent = guidesPageContent.replace(
    /<div class="glass-card p-8 hover-scale group cursor-pointer transition-all duration-300 hover:bg-purple-900\/20">\s*<div class="flex items-center mb-6">\s*<div class="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center mr-4">\s*<i class="fas fa-brain text-white text-2xl"><\/i>\s*<\/div>\s*<h2 class="text-2xl font-bold group-hover:text-purple-300 transition-colors">Advanced Dream Analysis Techniques <span class="text-sm text-purple-400">\(Coming Soon\)<\/span><\/h2>/,
    `<a href="guide-advanced-techniques.html" class="glass-card p-8 hover-scale block group transition-all duration-300 hover:bg-purple-900/20">
                    <div class="flex items-center mb-6">
                        <div class="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                            <i class="fas fa-brain text-white text-2xl"></i>
                        </div>
                        <h2 class="text-2xl font-bold group-hover:text-purple-300 transition-colors">Advanced Dream Analysis Techniques</h2>`
);

// 保存更新后的Dream Guides页面
fs.writeFileSync('dream-guides.html', guidesPageContent);
console.log('✅ Dream Guides主页面更新完成，修复了布局并添加了新页面链接');

console.log('');
console.log('🎉 额外的Dream Guides详细页面创建完成！');
console.log('');
console.log('创建的详细页面：');
additionalGuides.forEach(guide => {
    console.log(`📄 guide-${guide.id}.html - ${guide.title}`);
});

console.log('');
console.log('📝 下一步：更新Symbol Library页面，添加缺少的类别');