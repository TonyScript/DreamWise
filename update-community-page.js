#!/usr/bin/env node

const fs = require('fs');

console.log('🔧 更新Community页面定位和功能...');

// 新的Community页面内容
const communityPageContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    <!-- SEO Meta Tags -->
    <title>Dream Community - Connect with Fellow Dreamers | DreamWise</title>
    <meta name="description" content="Join our dream interpretation community to share experiences, learn from experts, and connect with fellow dreamers on their spiritual journey.">
    <meta name="keywords" content="dream community, dream sharing, dream interpretation, dream forum, dream experts, spiritual dreams">
    <meta name="author" content="Dream Interpretation Platform">
    <meta name="robots" content="index, follow">
    <meta name="theme-color" content="#8B5CF6">
    
    <!-- Open Graph Meta Tags -->
    <meta property="og:title" content="Dream Community - Connect with Fellow Dreamers">
    <meta property="og:description" content="Join our dream interpretation community to share experiences, learn from experts, and connect with fellow dreamers on their spiritual journey.">
    <meta property="og:type" content="website">
    <meta property="og:image" content="/assets/images/og-community.jpg">
    
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
                    Dream <span class="gradient-text">Community</span>
                </h1>
                <p class="text-xl text-gray-300 mb-4">
                    Connect, share, and learn with fellow dream explorers
                </p>
                <p class="text-lg text-gray-400 max-w-2xl mx-auto">
                    Join our vibrant community of dreamers to share experiences, gain insights from experts, and deepen your understanding of dream interpretation.
                </p>
            </div>
        </div>
    </section>

    <!-- Community Features -->
    <section class="py-16">
        <div class="container mx-auto px-6">
            <h2 class="text-3xl font-bold text-center mb-12">Community Features</h2>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div class="glass-card p-8 hover-scale text-center">
                    <div class="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center mx-auto mb-6">
                        <i class="fas fa-comments text-white text-2xl"></i>
                    </div>
                    <h3 class="text-xl font-bold mb-4">Dream Forums</h3>
                    <p class="text-gray-300 mb-6">Engage in discussions about dream interpretation, share your experiences, and get feedback from community members.</p>
                    <a href="#forums" class="btn-primary">
                        <i class="fas fa-arrow-right mr-2"></i>
                        Explore Forums
                    </a>
                </div>
                
                <div class="glass-card p-8 hover-scale text-center">
                    <div class="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center mx-auto mb-6">
                        <i class="fas fa-calendar-alt text-white text-2xl"></i>
                    </div>
                    <h3 class="text-xl font-bold mb-4">Virtual Events</h3>
                    <p class="text-gray-300 mb-6">Join online workshops, dream sharing circles, and expert-led sessions to deepen your dream interpretation skills.</p>
                    <a href="#events" class="btn-primary">
                        <i class="fas fa-arrow-right mr-2"></i>
                        View Schedule
                    </a>
                </div>
                
                <div class="glass-card p-8 hover-scale text-center">
                    <div class="w-16 h-16 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center mx-auto mb-6">
                        <i class="fas fa-user-graduate text-white text-2xl"></i>
                    </div>
                    <h3 class="text-xl font-bold mb-4">Expert Connect</h3>
                    <p class="text-gray-300 mb-6">Get personalized dream interpretations and guidance from our network of experienced dream analysts and spiritual counselors.</p>
                    <a href="#experts" class="btn-primary">
                        <i class="fas fa-arrow-right mr-2"></i>
                        Meet Experts
                    </a>
                </div>
            </div>
        </div>
    </section>

    <!-- Forums Section -->
    <section id="forums" class="py-16 bg-purple-900/20">
        <div class="container mx-auto px-6">
            <h2 class="text-3xl font-bold mb-12">Dream Discussion Forums</h2>
            
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <!-- Forum Categories -->
                <div class="glass-card p-8">
                    <h3 class="text-2xl font-bold mb-6">Popular Categories</h3>
                    
                    <div class="space-y-4">
                        <a href="#" class="block glass-card p-4 hover-scale">
                            <div class="flex justify-between items-center">
                                <div>
                                    <h4 class="font-semibold">Recurring Dreams</h4>
                                    <p class="text-sm text-gray-400">Discuss patterns and meanings in recurring dream themes</p>
                                </div>
                                <div class="text-purple-300 text-sm">
                                    <span>124 topics</span>
                                </div>
                            </div>
                        </a>
                        
                        <a href="#" class="block glass-card p-4 hover-scale">
                            <div class="flex justify-between items-center">
                                <div>
                                    <h4 class="font-semibold">Spiritual Symbols</h4>
                                    <p class="text-sm text-gray-400">Explore religious and spiritual imagery in dreams</p>
                                </div>
                                <div class="text-purple-300 text-sm">
                                    <span>98 topics</span>
                                </div>
                            </div>
                        </a>
                        
                        <a href="#" class="block glass-card p-4 hover-scale">
                            <div class="flex justify-between items-center">
                                <div>
                                    <h4 class="font-semibold">Lucid Dreaming</h4>
                                    <p class="text-sm text-gray-400">Techniques and experiences with conscious dreaming</p>
                                </div>
                                <div class="text-purple-300 text-sm">
                                    <span>156 topics</span>
                                </div>
                            </div>
                        </a>
                        
                        <a href="#" class="block glass-card p-4 hover-scale">
                            <div class="flex justify-between items-center">
                                <div>
                                    <h4 class="font-semibold">Prophetic Dreams</h4>
                                    <p class="text-sm text-gray-400">Discussions about predictive and precognitive dreams</p>
                                </div>
                                <div class="text-purple-300 text-sm">
                                    <span>87 topics</span>
                                </div>
                            </div>
                        </a>
                    </div>
                    
                    <div class="mt-8 text-center">
                        <a href="#" class="btn-secondary">
                            <i class="fas fa-list mr-2"></i>
                            View All Categories
                        </a>
                    </div>
                </div>
                
                <!-- Recent Discussions -->
                <div class="glass-card p-8">
                    <h3 class="text-2xl font-bold mb-6">Recent Discussions</h3>
                    
                    <div class="space-y-6">
                        <div class="glass-card p-4">
                            <div class="flex items-start">
                                <div class="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center mr-3 flex-shrink-0">
                                    <span class="text-white text-xs font-bold">JM</span>
                                </div>
                                <div>
                                    <h4 class="font-semibold">Flying dreams and spiritual awakening</h4>
                                    <p class="text-sm text-gray-400 mb-2">I've been having recurring flying dreams that coincide with my spiritual practices...</p>
                                    <div class="flex items-center text-xs text-gray-500">
                                        <span>Posted by Jessica M.</span>
                                        <span class="mx-2">•</span>
                                        <span>2 hours ago</span>
                                        <span class="mx-2">•</span>
                                        <span>12 replies</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="glass-card p-4">
                            <div class="flex items-start">
                                <div class="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center mr-3 flex-shrink-0">
                                    <span class="text-white text-xs font-bold">RT</span>
                                </div>
                                <div>
                                    <h4 class="font-semibold">Water symbols across different faiths</h4>
                                    <p class="text-sm text-gray-400 mb-2">I'm researching how water appears in dreams across different religious traditions...</p>
                                    <div class="flex items-center text-xs text-gray-500">
                                        <span>Posted by Robert T.</span>
                                        <span class="mx-2">•</span>
                                        <span>Yesterday</span>
                                        <span class="mx-2">•</span>
                                        <span>24 replies</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="glass-card p-4">
                            <div class="flex items-start">
                                <div class="w-10 h-10 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center mr-3 flex-shrink-0">
                                    <span class="text-white text-xs font-bold">AK</span>
                                </div>
                                <div>
                                    <h4 class="font-semibold">Dream journaling techniques that work</h4>
                                    <p class="text-sm text-gray-400 mb-2">After trying various methods, I've found these approaches most effective for dream recall...</p>
                                    <div class="flex items-center text-xs text-gray-500">
                                        <span>Posted by Aisha K.</span>
                                        <span class="mx-2">•</span>
                                        <span>3 days ago</span>
                                        <span class="mx-2">•</span>
                                        <span>18 replies</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="mt-8 text-center">
                        <a href="#" class="btn-secondary">
                            <i class="fas fa-comments mr-2"></i>
                            Join Discussion
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Events Section -->
    <section id="events" class="py-16">
        <div class="container mx-auto px-6">
            <h2 class="text-3xl font-bold mb-12">Upcoming Virtual Events</h2>
            
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div class="glass-card p-6 hover-scale">
                    <div class="text-purple-300 mb-2">January 25, 2025 • 7:00 PM EST</div>
                    <h3 class="text-xl font-bold mb-3">Dream Sharing Circle: Spiritual Guidance</h3>
                    <p class="text-gray-300 mb-4">Join our monthly dream sharing circle focused on dreams that provide spiritual guidance and insight.</p>
                    <div class="flex items-center mb-4">
                        <div class="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center mr-2">
                            <i class="fas fa-user text-white text-xs"></i>
                        </div>
                        <span class="text-sm">Hosted by Dr. Maya Johnson</span>
                    </div>
                    <a href="#" class="btn-primary w-full text-center">
                        <i class="fas fa-calendar-plus mr-2"></i>
                        Register
                    </a>
                </div>
                
                <div class="glass-card p-6 hover-scale">
                    <div class="text-purple-300 mb-2">February 3, 2025 • 2:00 PM EST</div>
                    <h3 class="text-xl font-bold mb-3">Workshop: Lucid Dreaming Techniques</h3>
                    <p class="text-gray-300 mb-4">Learn practical methods to achieve lucid dreaming and how to use this state for spiritual growth.</p>
                    <div class="flex items-center mb-4">
                        <div class="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center mr-2">
                            <i class="fas fa-user text-white text-xs"></i>
                        </div>
                        <span class="text-sm">Hosted by James Rivera</span>
                    </div>
                    <a href="#" class="btn-primary w-full text-center">
                        <i class="fas fa-calendar-plus mr-2"></i>
                        Register
                    </a>
                </div>
                
                <div class="glass-card p-6 hover-scale">
                    <div class="text-purple-300 mb-2">February 12, 2025 • 6:30 PM EST</div>
                    <h3 class="text-xl font-bold mb-3">Expert Panel: Multi-Faith Dream Perspectives</h3>
                    <p class="text-gray-300 mb-4">Join spiritual leaders from different traditions as they discuss dream interpretation across faiths.</p>
                    <div class="flex items-center mb-4">
                        <div class="w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center mr-2">
                            <i class="fas fa-users text-white text-xs"></i>
                        </div>
                        <span class="text-sm">Multiple Hosts</span>
                    </div>
                    <a href="#" class="btn-primary w-full text-center">
                        <i class="fas fa-calendar-plus mr-2"></i>
                        Register
                    </a>
                </div>
            </div>
            
            <div class="mt-12 text-center">
                <a href="#" class="btn-secondary">
                    <i class="fas fa-calendar-alt mr-2"></i>
                    View All Events
                </a>
            </div>
        </div>
    </section>

    <!-- Expert Connect Section -->
    <section id="experts" class="py-16 bg-purple-900/20">
        <div class="container mx-auto px-6">
            <h2 class="text-3xl font-bold mb-12">Connect with Dream Experts</h2>
            
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div class="glass-card p-6 hover-scale">
                    <div class="flex items-center mb-4">
                        <div class="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center mr-4">
                            <i class="fas fa-user text-white text-xl"></i>
                        </div>
                        <div>
                            <h3 class="text-xl font-bold">Dr. Sarah Chen</h3>
                            <p class="text-purple-300">Dream Psychologist</p>
                        </div>
                    </div>
                    <p class="text-gray-300 mb-4">Specializes in recurring dreams and their psychological significance. Ph.D. in Psychology with 15 years of clinical experience.</p>
                    <div class="flex space-x-2 mb-4">
                        <span class="px-2 py-1 bg-purple-900/50 rounded-full text-xs">Recurring Dreams</span>
                        <span class="px-2 py-1 bg-purple-900/50 rounded-full text-xs">Nightmares</span>
                        <span class="px-2 py-1 bg-purple-900/50 rounded-full text-xs">Trauma</span>
                    </div>
                    <a href="#" class="btn-primary w-full text-center">
                        <i class="fas fa-calendar-check mr-2"></i>
                        Book Session
                    </a>
                </div>
                
                <div class="glass-card p-6 hover-scale">
                    <div class="flex items-center mb-4">
                        <div class="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center mr-4">
                            <i class="fas fa-user text-white text-xl"></i>
                        </div>
                        <div>
                            <h3 class="text-xl font-bold">Rabbi David Goldstein</h3>
                            <p class="text-purple-300">Spiritual Dream Interpreter</p>
                        </div>
                    </div>
                    <p class="text-gray-300 mb-4">Expert in Judaic dream interpretation traditions with deep knowledge of Kabbalah and biblical dream symbolism.</p>
                    <div class="flex space-x-2 mb-4">
                        <span class="px-2 py-1 bg-purple-900/50 rounded-full text-xs">Biblical Symbols</span>
                        <span class="px-2 py-1 bg-purple-900/50 rounded-full text-xs">Prophetic Dreams</span>
                        <span class="px-2 py-1 bg-purple-900/50 rounded-full text-xs">Kabbalah</span>
                    </div>
                    <a href="#" class="btn-primary w-full text-center">
                        <i class="fas fa-calendar-check mr-2"></i>
                        Book Session
                    </a>
                </div>
                
                <div class="glass-card p-6 hover-scale">
                    <div class="flex items-center mb-4">
                        <div class="w-16 h-16 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center mr-4">
                            <i class="fas fa-user text-white text-xl"></i>
                        </div>
                        <div>
                            <h3 class="text-xl font-bold">Amara Okafor</h3>
                            <p class="text-purple-300">Shamanic Dream Worker</p>
                        </div>
                    </div>
                    <p class="text-gray-300 mb-4">Trained in indigenous dream work traditions with focus on ancestral connections and healing through dreamtime.</p>
                    <div class="flex space-x-2 mb-4">
                        <span class="px-2 py-1 bg-purple-900/50 rounded-full text-xs">Animal Guides</span>
                        <span class="px-2 py-1 bg-purple-900/50 rounded-full text-xs">Ancestral Dreams</span>
                        <span class="px-2 py-1 bg-purple-900/50 rounded-full text-xs">Healing</span>
                    </div>
                    <a href="#" class="btn-primary w-full text-center">
                        <i class="fas fa-calendar-check mr-2"></i>
                        Book Session
                    </a>
                </div>
            </div>
            
            <div class="mt-12 text-center">
                <a href="#" class="btn-secondary">
                    <i class="fas fa-users mr-2"></i>
                    View All Experts
                </a>
            </div>
        </div>
    </section>

    <!-- Join Community CTA -->
    <section class="py-16">
        <div class="container mx-auto px-6 text-center">
            <div class="glass-card max-w-3xl mx-auto p-8">
                <h2 class="text-3xl font-bold mb-6">Join Our Dream Community</h2>
                <p class="text-xl text-gray-300 mb-8">
                    Connect with fellow dreamers, share your experiences, and deepen your understanding of dream interpretation.
                </p>
                
                <form class="max-w-md mx-auto">
                    <div class="mb-4">
                        <input type="text" placeholder="Your Name" class="w-full px-4 py-3 bg-purple-900/30 border border-purple-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50">
                    </div>
                    <div class="mb-4">
                        <input type="email" placeholder="Your Email" class="w-full px-4 py-3 bg-purple-900/30 border border-purple-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50">
                    </div>
                    <button type="submit" class="btn-primary w-full">
                        <i class="fas fa-user-plus mr-2"></i>
                        Create Free Account
                    </button>
                    <p class="text-sm text-gray-400 mt-4">
                        By joining, you agree to our <a href="terms-of-service.html" class="text-purple-300 hover:text-purple-200">Terms of Service</a> and <a href="privacy-policy.html" class="text-purple-300 hover:text-purple-200">Privacy Policy</a>.
                    </p>
                </form>
            </div>
        </div>
    </section>

    <!-- Footer Container - Loaded dynamically -->
    <div id="footer-container"></div>

    <!-- JavaScript -->
    <script src="assets/js/main.min.js"></script>
    <script src="assets/js/components.js"></script>
</body>
</html>`;

// 保存新的Community页面
fs.writeFileSync('community.html', communityPageContent);
console.log('✅ Community页面更新完成');

console.log('');
console.log('🎉 Community页面定位已明确！');
console.log('');
console.log('📝 Community页面新定位:');
console.log('1. 梦境讨论论坛 - 用户可以分享和讨论梦境体验');
console.log('2. 虚拟活动平台 - 提供在线工作坊和分享圈');
console.log('3. 专家连接服务 - 用户可以与梦境解释专家交流');
console.log('');
console.log('📊 页面功能:');
console.log('- 论坛分类和最近讨论展示');
console.log('- 即将举行的虚拟活动日历');
console.log('- 梦境解释专家介绍和预约功能');
console.log('- 社区注册表单');
console.log('');
console.log('📝 注意事项:');
console.log('目前这些功能是静态展示，实际功能需要后端支持');
console.log('未来可以集成真实的论坛、活动注册和专家预约系统');