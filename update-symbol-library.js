#!/usr/bin/env node

const fs = require('fs');

console.log('🔧 更新Symbol Library页面，添加缺少的类别...');

// 读取当前Symbol Library页面
let symbolLibraryContent = fs.readFileSync('symbol-library.html', 'utf8');

// 找到最后一个类别卡片的结束位置
const lastCardEndIndex = symbolLibraryContent.lastIndexOf('</div>\n                \n            </div>');

// 添加两个新的类别卡片
const newCategories = `</div>
                
                <div class="glass-card p-8 hover-scale">
                    <div class="flex items-center mb-6">
                        <div class="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center mr-4">
                            <i class="fas fa-running text-white text-2xl"></i>
                        </div>
                        <h2 class="text-2xl font-bold">Actions and Events</h2>
                    </div>
                    
                    <p class="text-gray-300 mb-6 leading-relaxed">
                        Interpreting common actions and events that occur in dreams and their spiritual significance.
                    </p>
                    
                    <ul class="space-y-3">
                        <li class="flex items-start">
                            <div class="w-2 h-2 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 mt-2 mr-3 flex-shrink-0"></div>
                            <span class="text-gray-400">Movement: flying, falling, running, swimming</span>
                        </li>
                        
                        <li class="flex items-start">
                            <div class="w-2 h-2 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 mt-2 mr-3 flex-shrink-0"></div>
                            <span class="text-gray-400">Transitions: birth, death, marriage, graduation</span>
                        </li>
                        
                        <li class="flex items-start">
                            <div class="w-2 h-2 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 mt-2 mr-3 flex-shrink-0"></div>
                            <span class="text-gray-400">Searching: lost items, people, or places</span>
                        </li>
                        
                        <li class="flex items-start">
                            <div class="w-2 h-2 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 mt-2 mr-3 flex-shrink-0"></div>
                            <span class="text-gray-400">Conflict: fighting, arguing, escaping</span>
                        </li>
                        
                        <li class="flex items-start">
                            <div class="w-2 h-2 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 mt-2 mr-3 flex-shrink-0"></div>
                            <span class="text-gray-400">Transformation: changing forms, aging, healing</span>
                        </li>
                    </ul>
                </div>
                
                <div class="glass-card p-8 hover-scale">
                    <div class="flex items-center mb-6">
                        <div class="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center mr-4">
                            <i class="fas fa-palette text-white text-2xl"></i>
                        </div>
                        <h2 class="text-2xl font-bold">Colors and Sensations</h2>
                    </div>
                    
                    <p class="text-gray-300 mb-6 leading-relaxed">
                        Understanding the symbolic meaning of colors, textures, and physical sensations in dreams.
                    </p>
                    
                    <ul class="space-y-3">
                        <li class="flex items-start">
                            <div class="w-2 h-2 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 mt-2 mr-3 flex-shrink-0"></div>
                            <span class="text-gray-400">Primary colors: red, blue, yellow and their meanings</span>
                        </li>
                        
                        <li class="flex items-start">
                            <div class="w-2 h-2 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 mt-2 mr-3 flex-shrink-0"></div>
                            <span class="text-gray-400">Light and darkness: brightness, shadows, darkness</span>
                        </li>
                        
                        <li class="flex items-start">
                            <div class="w-2 h-2 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 mt-2 mr-3 flex-shrink-0"></div>
                            <span class="text-gray-400">Physical feelings: pain, pleasure, weightlessness</span>
                        </li>
                        
                        <li class="flex items-start">
                            <div class="w-2 h-2 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 mt-2 mr-3 flex-shrink-0"></div>
                            <span class="text-gray-400">Temperature: heat, cold, warmth and their symbolism</span>
                        </li>
                        
                        <li class="flex items-start">
                            <div class="w-2 h-2 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 mt-2 mr-3 flex-shrink-0"></div>
                            <span class="text-gray-400">Textures: smooth, rough, sticky, fluid sensations</span>
                        </li>
                    </ul>
                </div>
                
            </div>`;

// 替换最后一个卡片的结束标签和后面的内容
symbolLibraryContent = symbolLibraryContent.substring(0, lastCardEndIndex) + newCategories + symbolLibraryContent.substring(lastCardEndIndex + 44);

// 保存更新后的Symbol Library页面
fs.writeFileSync('symbol-library.html', symbolLibraryContent);
console.log('✅ Symbol Library页面更新完成，添加了两个新类别');

console.log('');
console.log('🎉 添加的新类别:');
console.log('1. Actions and Events - 动作和事件符号');
console.log('2. Colors and Sensations - 颜色和感觉符号');
console.log('');
console.log('📝 现在Symbol Library页面有6个完整的符号类别:');
console.log('1. Animal Symbols - 动物符号');
console.log('2. Natural Elements - 自然元素');
console.log('3. Human Figures - 人物形象');
console.log('4. Objects and Artifacts - 物品和文物');
console.log('5. Actions and Events - 动作和事件');
console.log('6. Colors and Sensations - 颜色和感觉');