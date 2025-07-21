const fs = require('fs');

// 需要修复的梦象页面
const dreamPages = [
  'dream/water.html',
  'dream/snake.html',
  'dream/flying.html',
  'dream/death.html',
  'dream/fire.html',
  'dream/house.html',
  'dream/baby.html'
];

// 修复Related Dream Symbols区域的布局
dreamPages.forEach(page => {
  try {
    console.log(`正在修复页面: ${page}`);
    
    // 读取文件内容
    const content = fs.readFileSync(page, 'utf8');
    
    // 提取页面名称（不含扩展名）
    const pageName = page.split('/').pop().replace('.html', '');
    
    // 查找Related Dream Symbols区域
    const relatedDreamsSection = content.match(/<section class="related-dreams-section py-16"[^>]*>([\s\S]*?)<\/section>/);
    
    if (!relatedDreamsSection) {
      console.log(`未找到Related Dream Symbols区域: ${page}`);
      return;
    }
    
    // 创建新的Related Dream Symbols区域
    // 根据图片中的样式，使用深蓝色背景、简洁的图标和文本布局
    const newRelatedDreamsSection = `
    <!-- Related Dreams Section -->
    <section class="related-dreams-section py-16" style="background-color: #0f172a;">
        <div class="related-dreams-container container mx-auto px-6">
            <h2 class="text-3xl font-bold text-center mb-12">
                Related <span class="gradient-text">Dream Symbols</span>
            </h2>
            
            <div class="flex flex-wrap justify-center gap-6">
                <!-- Water Dreams -->
                <a href="water.html" class="glass-card hover-scale p-6 text-center w-56 ${pageName === 'water' ? 'border-2 border-blue-400' : ''}" style="min-height: auto;">
                    <div class="w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
                        <i class="fas fa-water text-white text-xl"></i>
                    </div>
                    <h3 class="font-bold mb-2">Water</h3>
                </a>
                
                <!-- Fire Dreams -->
                <a href="fire.html" class="glass-card hover-scale p-6 text-center w-56 ${pageName === 'fire' ? 'border-2 border-orange-400' : ''}" style="min-height: auto;">
                    <div class="w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center">
                        <i class="fas fa-fire text-white text-xl"></i>
                    </div>
                    <h3 class="font-bold mb-2">Fire</h3>
                </a>
                
                <!-- Snake Dreams -->
                <a href="snake.html" class="glass-card hover-scale p-6 text-center w-56 ${pageName === 'snake' ? 'border-2 border-pink-400' : ''}" style="min-height: auto;">
                    <div class="w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 flex items-center justify-center">
                        <i class="fas fa-dragon text-white text-xl"></i>
                    </div>
                    <h3 class="font-bold mb-2">Snake</h3>
                </a>
                
                <!-- Flying Dreams -->
                <a href="flying.html" class="glass-card hover-scale p-6 text-center w-56 ${pageName === 'flying' ? 'border-2 border-purple-400' : ''}" style="min-height: auto;">
                    <div class="w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center">
                        <i class="fas fa-dove text-white text-xl"></i>
                    </div>
                    <h3 class="font-bold mb-2">Flying</h3>
                </a>
                
                <!-- Death Dreams -->
                <a href="death.html" class="glass-card hover-scale p-6 text-center w-56 ${pageName === 'death' ? 'border-2 border-gray-400' : ''}" style="min-height: auto;">
                    <div class="w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-r from-gray-600 to-gray-800 flex items-center justify-center">
                        <i class="fas fa-skull text-white text-xl"></i>
                    </div>
                    <h3 class="font-bold mb-2">Death</h3>
                </a>
                
                <!-- House Dreams -->
                <a href="house.html" class="glass-card hover-scale p-6 text-center w-56 ${pageName === 'house' ? 'border-2 border-green-400' : ''}" style="min-height: auto;">
                    <div class="w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
                        <i class="fas fa-home text-white text-xl"></i>
                    </div>
                    <h3 class="font-bold mb-2">House</h3>
                </a>
                
                <!-- Baby Dreams -->
                <a href="baby.html" class="glass-card hover-scale p-6 text-center w-56 ${pageName === 'baby' ? 'border-2 border-yellow-400' : ''}" style="min-height: auto;">
                    <div class="w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-r from-yellow-500 to-amber-500 flex items-center justify-center">
                        <i class="fas fa-baby text-white text-xl"></i>
                    </div>
                    <h3 class="font-bold mb-2">Baby</h3>
                </a>
            </div>
        </div>
    </section>
    `;
    
    // 更新文件内容
    const updatedContent = content.replace(relatedDreamsSection[0], newRelatedDreamsSection);
    
    // 写入文件
    fs.writeFileSync(page, updatedContent, 'utf8');
    
    console.log(`已修复页面: ${page}`);
  } catch (error) {
    console.error(`修复页面时出错: ${page}`, error);
  }
});