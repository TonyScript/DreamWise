#!/usr/bin/env node

const fs = require('fs');

console.log('🔧 创建Dream Blog详细文章页面...');

// Blog文章配置
const blogArticles = [
    {
        id: 'recurring-dreams',
        title: 'Understanding Recurring Dreams: What They Mean',
        author: 'Dr. Sarah Chen',
        date: 'January 15, 2025',
        category: 'Dream Analysis',
        image: 'recurring-dreams.jpg',
        description: 'Explore the spiritual and psychological significance of recurring dreams and how to interpret their messages.',
        content: `
            <p class="mb-4">Recurring dreams are one of the most fascinating phenomena in dream psychology. When the same dream themes, symbols, or narratives appear repeatedly in our sleep, they often carry significant messages that our subconscious mind is trying to communicate.</p>
            
            <h3 class="text-xl font-bold mb-3 mt-6">Why Dreams Recur</h3>
            
            <p class="mb-4">Recurring dreams typically emerge for several key reasons:</p>
            
            <ul class="list-disc pl-6 mb-6 space-y-2">
                <li><strong>Unresolved issues</strong> - The most common cause of recurring dreams is unaddressed emotional or psychological concerns. Your mind continues to process these issues during sleep until they're resolved.</li>
                <li><strong>Life transitions</strong> - Major changes in your life can trigger recurring dreams as your subconscious processes these shifts.</li>
                <li><strong>Spiritual messages</strong> - From a spiritual perspective, recurring dreams may represent divine guidance or messages that require your attention.</li>
                <li><strong>Psychological growth</strong> - Some recurring dreams mark stages in your psychological development and transformation.</li>
            </ul>
            
            <h3 class="text-xl font-bold mb-3 mt-6">Common Recurring Dream Themes</h3>
            
            <p class="mb-4">While recurring dreams are highly personal, certain themes appear frequently across different cultures and individuals:</p>
            
            <div class="glass-card p-6 mb-6">
                <h4 class="font-bold mb-2">Being Chased</h4>
                <p>Often represents avoiding a person or issue in your waking life. The nature of the pursuer and your emotions during the chase provide important clues to its meaning.</p>
            </div>
            
            <div class="glass-card p-6 mb-6">
                <h4 class="font-bold mb-2">Falling</h4>
                <p>Typically symbolizes insecurity, anxiety, or feeling out of control. The context of the fall and whether you land safely are significant interpretive factors.</p>
            </div>
            
            <div class="glass-card p-6 mb-6">
                <h4 class="font-bold mb-2">Flying</h4>
                <p>Usually represents freedom, transcendence, or spiritual ascension. Difficulties in flying often reflect obstacles to personal growth.</p>
            </div>
            
            <div class="glass-card p-6 mb-6">
                <h4 class="font-bold mb-2">Being Unprepared</h4>
                <p>Dreams of being late for an exam or appearing in public unprepared often reflect anxiety about performance or fear of failure.</p>
            </div>
            
            <h3 class="text-xl font-bold mb-3 mt-6">Spiritual Perspectives on Recurring Dreams</h3>
            
            <p class="mb-4">Many spiritual traditions view recurring dreams as significant communications:</p>
            
            <ul class="list-disc pl-6 mb-6 space-y-2">
                <li><strong>Divine guidance</strong> - Some traditions interpret recurring dreams as messages from God or spiritual guides.</li>
                <li><strong>Soul lessons</strong> - Recurring dreams may represent karmic patterns or soul-level learning opportunities.</li>
                <li><strong>Prophetic insights</strong> - In some cases, recurring dreams contain prophetic elements or warnings about future events.</li>
                <li><strong>Ancestral wisdom</strong> - Dreams that recur may sometimes carry messages from ancestors or collective wisdom.</li>
            </ul>
            
            <h3 class="text-xl font-bold mb-3 mt-6">How to Work with Recurring Dreams</h3>
            
            <p class="mb-4">To understand and potentially resolve recurring dreams, try these approaches:</p>
            
            <ol class="list-decimal pl-6 mb-6 space-y-2">
                <li><strong>Document the details</strong> - Record every instance of the recurring dream, noting any variations or developments.</li>
                <li><strong>Identify triggers</strong> - Notice if certain life events or emotions tend to precede the dream.</li>
                <li><strong>Dialogue with dream figures</strong> - Through meditation or journaling, engage with characters from your recurring dreams.</li>
                <li><strong>Look for resolution patterns</strong> - Pay attention to how the dream evolves over time, which may reflect your progress in addressing the underlying issue.</li>
                <li><strong>Consider professional guidance</strong> - Sometimes, working with a dream analyst or therapist can provide valuable insights.</li>
            </ol>
            
            <div class="bg-purple-900/30 border border-purple-500/30 rounded-lg p-6 mb-6">
                <h4 class="font-bold mb-2">Case Study: The Recurring Tsunami Dream</h4>
                <p class="mb-3">Maria experienced a recurring dream of a tsunami for over two years. Initially, she would panic and try to outrun the wave, always waking in fear. Through dream work, she realized the tsunami represented overwhelming emotions she was avoiding in her waking life.</p>
                <p>As she began addressing these emotions through therapy, her dream changed. In later versions, she found herself able to surf the wave or watch it from a safe distance. Eventually, the dream stopped recurring altogether once she had fully processed her emotional challenges.</p>
            </div>
            
            <h3 class="text-xl font-bold mb-3 mt-6">Conclusion</h3>
            
            <p class="mb-4">Recurring dreams are powerful messengers from our subconscious mind and potentially from spiritual realms. By paying attention to these dreams and working with them consciously, we can gain profound insights, resolve inner conflicts, and support our spiritual and psychological growth.</p>
            
            <p>Remember that the resolution of a recurring dream often coincides with a breakthrough or healing in your waking life. When approached with curiosity and respect, these dreams can be valuable guides on your journey.</p>
        `
    },
    {
        id: 'flying-dreams',
        title: 'The Spiritual Significance of Flying Dreams',
        author: 'Michael Rainwater',
        date: 'January 10, 2025',
        category: 'Spiritual Interpretation',
        image: 'flying-dreams.jpg',
        description: 'Discover the profound spiritual meanings behind dreams of flying and what they reveal about your soul\'s journey.',
        content: `
            <p class="mb-4">Flying dreams are among the most exhilarating and spiritually significant dream experiences. The sensation of soaring through the air, free from earthly constraints, often leaves a profound impression that lingers long after waking.</p>
            
            <p class="mb-4">These dreams have been recorded throughout human history and across diverse cultures, consistently associated with spiritual transcendence, freedom, and expanded consciousness.</p>
            
            <h3 class="text-xl font-bold mb-3 mt-6">The Universal Appeal of Flying Dreams</h3>
            
            <p class="mb-4">Flying dreams touch something fundamental in the human spirit. They connect us to our deepest longing for freedom and transcendence. In these dreams, we experience:</p>
            
            <ul class="list-disc pl-6 mb-6 space-y-2">
                <li><strong>Liberation from physical limitations</strong> - The body's constraints fall away</li>
                <li><strong>Expanded perspective</strong> - Seeing the world from a higher vantage point</li>
                <li><strong>Altered consciousness</strong> - A state between earthly and spiritual realms</li>
                <li><strong>Profound joy</strong> - An ecstatic sense of freedom and possibility</li>
            </ul>
            
            <div class="glass-card p-6 mb-6">
                <h4 class="font-bold mb-2">Types of Flying Dreams</h4>
                <p class="mb-3">Flying dreams manifest in various forms, each with distinct spiritual implications:</p>
                <ul class="list-disc pl-6 space-y-1">
                    <li><strong>Effortless soaring</strong> - Often represents spiritual mastery and divine connection</li>
                    <li><strong>Struggling to stay airborne</strong> - May indicate spiritual challenges or doubts</li>
                    <li><strong>Flying with others</strong> - Can symbolize spiritual community or shared journey</li>
                    <li><strong>Flying to escape danger</strong> - Often reflects transcending earthly problems</li>
                    <li><strong>Flying toward a destination</strong> - May represent spiritual seeking or divine purpose</li>
                </ul>
            </div>
            
            <h3 class="text-xl font-bold mb-3 mt-6">Flying Dreams Across Spiritual Traditions</h3>
            
            <p class="mb-4">Different spiritual traditions offer unique perspectives on the meaning of flying dreams:</p>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div class="glass-card p-4">
                    <h4 class="font-bold mb-2">Shamanic Traditions</h4>
                    <p>Flying dreams are often interpreted as soul journeys or spiritual travels between worlds. Shamans intentionally cultivate these experiences for healing and wisdom-gathering.</p>
                </div>
                
                <div class="glass-card p-4">
                    <h4 class="font-bold mb-2">Buddhist Perspective</h4>
                    <p>Flying in dreams may represent liberation from attachment and the achievement of spiritual lightness. It can symbolize progress on the path to enlightenment.</p>
                </div>
                
                <div class="glass-card p-4">
                    <h4 class="font-bold mb-2">Christian Mysticism</h4>
                    <p>Flying dreams can represent the soul's ascension toward God or divine revelation. They may be interpreted as spiritual gifts or moments of grace.</p>
                </div>
                
                <div class="glass-card p-4">
                    <h4 class="font-bold mb-2">Islamic Dream Tradition</h4>
                    <p>Flying high in dreams is often associated with spiritual elevation and religious devotion. The height and ease of flight may indicate one's spiritual status.</p>
                </div>
            </div>
            
            <h3 class="text-xl font-bold mb-3 mt-6">Spiritual Messages in Flying Dreams</h3>
            
            <p class="mb-4">When interpreted through a spiritual lens, flying dreams often convey important messages:</p>
            
            <ol class="list-decimal pl-6 mb-6 space-y-2">
                <li><strong>Spiritual awakening</strong> - Flying dreams often coincide with periods of spiritual growth and awakening.</li>
                <li><strong>Transcendence of limitations</strong> - They may appear when you're ready to move beyond self-imposed restrictions.</li>
                <li><strong>Connection to higher guidance</strong> - Flying can symbolize your soul's connection to divine wisdom.</li>
                <li><strong>Life purpose alignment</strong> - These dreams may emerge when you're aligning with your soul's purpose.</li>
                <li><strong>Expanded consciousness</strong> - They often reflect an expansion of awareness beyond ordinary reality.</li>
            </ol>
            
            <div class="bg-purple-900/30 border border-purple-500/30 rounded-lg p-6 mb-6">
                <h4 class="font-bold mb-2">Personal Reflection: Flying Dream Journal</h4>
                <p class="mb-3">To deepen your understanding of your flying dreams, consider keeping a specialized journal with these prompts:</p>
                <ul class="list-disc pl-6">
                    <li>How did the flying feel? Effortless, challenging, joyful, frightening?</li>
                    <li>What was the landscape below? What might it represent in your spiritual journey?</li>
                    <li>Were you flying toward something or away from something?</li>
                    <li>Were you alone or with others?</li>
                    <li>What emotions lingered after waking?</li>
                    <li>What spiritual changes are occurring in your waking life?</li>
                </ul>
            </div>
            
            <h3 class="text-xl font-bold mb-3 mt-6">Cultivating Flying Dreams</h3>
            
            <p class="mb-4">If you wish to experience more flying dreams or deepen their spiritual significance, consider these practices:</p>
            
            <ul class="list-disc pl-6 mb-6 space-y-2">
                <li><strong>Meditation on lightness</strong> - Before sleep, meditate on the sensation of becoming lighter than air.</li>
                <li><strong>Dream incubation</strong> - Set an intention to fly in your dreams as you fall asleep.</li>
                <li><strong>Lucid dreaming techniques</strong> - Learn to become conscious within your dreams, which can enable intentional flying.</li>
                <li><strong>Spiritual practices</strong> - Regular meditation, prayer, or energy work can increase the frequency of spiritually significant dreams.</li>
                <li><strong>Dream sharing circles</strong> - Discussing flying dreams in a supportive community can enhance their meaning and frequency.</li>
            </ul>
            
            <h3 class="text-xl font-bold mb-3 mt-6">Conclusion</h3>
            
            <p class="mb-4">Flying dreams offer a precious glimpse into our spiritual nature and potential. They remind us that we are more than physical beings bound by earthly limitations. Whether you view them as symbolic psychological experiences or actual spiritual journeys, these dreams can be profound catalysts for growth and transformation.</p>
            
            <p>By paying attention to your flying dreams and working with them intentionally, you may discover new dimensions of spiritual insight and experience the boundless freedom that is your birthright as a spiritual being.</p>
        `
    }
];

// 创建博客文章模板
function createBlogArticleTemplate(article) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    <!-- SEO Meta Tags -->
    <title>${article.title} | Dream Interpretation Blog</title>
    <meta name="description" content="${article.description}">
    <meta name="keywords" content="dream interpretation, ${article.category.toLowerCase()}, ${article.title.toLowerCase()}, dream analysis, spiritual dreams">
    <meta name="author" content="${article.author}">
    <meta name="robots" content="index, follow">
    <meta name="theme-color" content="#8B5CF6">
    
    <!-- Open Graph Meta Tags -->
    <meta property="og:title" content="${article.title} | Dream Interpretation Blog">
    <meta property="og:description" content="${article.description}">
    <meta property="og:type" content="article">
    <meta property="og:image" content="/assets/images/blog/${article.image}">
    <meta property="article:published_time" content="${article.date}">
    <meta property="article:author" content="${article.author}">
    <meta property="article:section" content="${article.category}">
    
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

    <!-- Article Header -->
    <section class="pt-32 pb-8 relative">
        <div class="container mx-auto px-6">
            <div class="glass-card max-w-4xl mx-auto p-8">
                <div class="flex items-center space-x-2 text-sm text-purple-300 mb-4">
                    <span>${article.category}</span>
                    <span>•</span>
                    <span>${article.date}</span>
                </div>
                
                <h1 class="text-3xl md:text-4xl font-bold mb-6">
                    ${article.title}
                </h1>
                
                <div class="flex items-center mb-8">
                    <div class="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center mr-3">
                        <i class="fas fa-user text-white text-sm"></i>
                    </div>
                    <span class="text-gray-300">${article.author}</span>
                </div>
                
                <div class="flex justify-between items-center">
                    <a href="dream-blog.html" class="text-purple-300 hover:text-purple-200 transition-colors duration-300">
                        <i class="fas fa-arrow-left mr-2"></i> Back to Blog
                    </a>
                    
                    <div class="flex space-x-3">
                        <a href="#" class="text-gray-400 hover:text-purple-300 transition-colors duration-300">
                            <i class="fab fa-facebook-f"></i>
                        </a>
                        <a href="#" class="text-gray-400 hover:text-purple-300 transition-colors duration-300">
                            <i class="fab fa-twitter"></i>
                        </a>
                        <a href="#" class="text-gray-400 hover:text-purple-300 transition-colors duration-300">
                            <i class="fab fa-pinterest"></i>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Article Content -->
    <main class="py-8">
        <div class="container mx-auto px-6">
            <div class="max-w-4xl mx-auto">
                <div class="glass-card p-8 mb-8">
                    <div class="prose prose-invert max-w-none">
                        ${article.content}
                    </div>
                </div>
                
                <!-- Author Bio -->
                <div class="glass-card p-8 mb-8">
                    <div class="flex items-start">
                        <div class="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center mr-4 flex-shrink-0">
                            <i class="fas fa-user text-white text-xl"></i>
                        </div>
                        <div>
                            <h3 class="text-xl font-bold mb-2">About ${article.author}</h3>
                            <p class="text-gray-300">Dream interpretation specialist with over 15 years of experience studying the spiritual and psychological significance of dreams. Passionate about helping people understand the messages their subconscious mind is trying to communicate.</p>
                        </div>
                    </div>
                </div>
                
                <!-- Related Articles -->
                <div class="glass-card p-8">
                    <h3 class="text-2xl font-bold mb-6">Related Articles</h3>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <a href="blog-water-dreams.html" class="glass-card hover-scale p-4 group">
                            <h4 class="font-semibold mb-2 group-hover:text-purple-300 transition-colors duration-300">Water Dreams Across Different Cultures</h4>
                            <p class="text-sm text-gray-400">Explore how water symbols in dreams are interpreted across various spiritual traditions.</p>
                        </a>
                        
                        <a href="blog-nightmares.html" class="glass-card hover-scale p-4 group">
                            <h4 class="font-semibold mb-2 group-hover:text-purple-300 transition-colors duration-300">Nightmares: Transforming Fear into Wisdom</h4>
                            <p class="text-sm text-gray-400">Learn how to work with frightening dreams to uncover their transformative potential.</p>
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

// 创建所有博客文章页面
blogArticles.forEach(article => {
    const filename = `blog-${article.id}.html`;
    const content = createBlogArticleTemplate(article);
    fs.writeFileSync(filename, content);
    console.log(`✅ 创建博客文章页面: ${filename}`);
});

// 更新主Dream Blog页面，添加链接到文章页面
console.log('');
console.log('📝 更新Dream Blog主页面，添加文章链接...');

// 读取当前Dream Blog页面
let blogPageContent = fs.readFileSync('dream-blog.html', 'utf8');

// 为每个文章标题添加链接
blogArticles.forEach(article => {
    const titleText = article.title;
    const linkHtml = `<a href="blog-${article.id}.html" class="text-white hover:text-purple-300 transition-colors duration-300">${titleText}</a>`;
    
    // 替换文章标题为链接
    blogPageContent = blogPageContent.replace(titleText, linkHtml);
});

// 保存更新后的Dream Blog页面
fs.writeFileSync('dream-blog.html', blogPageContent);
console.log('✅ Dream Blog主页面更新完成，添加了文章链接');

console.log('');
console.log('🎉 Dream Blog文章页面创建完成！');
console.log('');
console.log('创建的文章页面：');
blogArticles.forEach(article => {
    console.log(`📄 blog-${article.id}.html - ${article.title}`);
});

console.log('');
console.log('📝 下一步建议：');
console.log('1. 创建更多博客文章页面');
console.log('2. 为Community页面创建更具体的功能和内容');
console.log('3. 确保所有内部链接正常工作');