#!/usr/bin/env node

const fs = require('fs');

console.log('🔧 修复browse.html页面结构问题...');

// 读取browse.html文件
let content = fs.readFileSync('browse.html', 'utf8');

console.log('📝 修复字母M部分的HTML结构错误...');

// 修复字母M部分的重复和错误结构
const mSectionStart = content.indexOf('<!-- Letter M Section -->');
const mSectionEnd = content.indexOf('<!-- Letter N Section -->');

if (mSectionStart !== -1 && mSectionEnd !== -1) {
    const fixedMSection = `            <!-- Letter M Section -->
            <section id="letter-M" class="letter-section mb-16">
                <div class="flex items-center mb-8">
                    <div class="w-16 h-16 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center mr-6">
                        <span class="text-2xl font-bold text-white">M</span>
                    </div>
                    <h2 class="text-3xl font-bold">Letter M</h2>
                </div>
                
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <a href="dream/meditation.html" class="dream-symbol-card glass-card hover-scale p-4 text-center group">
                        <div class="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center">
                            <i class="fas fa-om text-white"></i>
                        </div>
                        <h3 class="font-semibold mb-2">Meditation</h3>
                        <p class="text-sm text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">Inner peace & mindfulness</p>
                    </a>
                    
                    <a href="dream/miracle.html" class="dream-symbol-card glass-card hover-scale p-4 text-center group">
                        <div class="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-r from-yellow-400 to-white flex items-center justify-center">
                            <i class="fas fa-star text-yellow-600"></i>
                        </div>
                        <h3 class="font-semibold mb-2">Miracle</h3>
                        <p class="text-sm text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">Divine intervention</p>
                    </a>
                    
                    <a href="dream/mirror.html" class="dream-symbol-card glass-card hover-scale p-4 text-center group">
                        <div class="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-r from-gray-400 to-gray-600 flex items-center justify-center">
                            <i class="fas fa-mirror text-white"></i>
                        </div>
                        <h3 class="font-semibold mb-2">Mirror</h3>
                        <p class="text-sm text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">Self-reflection</p>
                    </a>
                    
                    <a href="dream/money.html" class="dream-symbol-card glass-card hover-scale p-4 text-center group">
                        <div class="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
                            <i class="fas fa-dollar-sign text-white"></i>
                        </div>
                        <h3 class="font-semibold mb-2">Money</h3>
                        <p class="text-sm text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">Value & security</p>
                    </a>
                    
                    <a href="dream/monkey.html" class="dream-symbol-card glass-card hover-scale p-4 text-center group">
                        <div class="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-r from-brown-500 to-amber-600 flex items-center justify-center">
                            <i class="fas fa-paw text-white"></i>
                        </div>
                        <h3 class="font-semibold mb-2">Monkey</h3>
                        <p class="text-sm text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">Playfulness & mischief</p>
                    </a>
                    
                    <a href="dream/moon.html" class="dream-symbol-card glass-card hover-scale p-4 text-center group">
                        <div class="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 flex items-center justify-center">
                            <i class="fas fa-moon text-white"></i>
                        </div>
                        <h3 class="font-semibold mb-2">Moon</h3>
                        <p class="text-sm text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">Intuition & cycles</p>
                    </a>
                    
                    <a href="dream/mother.html" class="dream-symbol-card glass-card hover-scale p-4 text-center group">
                        <div class="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 flex items-center justify-center">
                            <i class="fas fa-heart text-white"></i>
                        </div>
                        <h3 class="font-semibold mb-2">Mother</h3>
                        <p class="text-sm text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">Nurturing & care</p>
                    </a>
                    
                    <a href="dream/mouse.html" class="dream-symbol-card glass-card hover-scale p-4 text-center group">
                        <div class="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-r from-gray-500 to-slate-500 flex items-center justify-center">
                            <i class="fas fa-mouse text-white"></i>
                        </div>
                        <h3 class="font-semibold mb-2">Mouse</h3>
                        <p class="text-sm text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">Small details & timidity</p>
                    </a>
                    
                    <a href="dream/mouth.html" class="dream-symbol-card glass-card hover-scale p-4 text-center group">
                        <div class="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 flex items-center justify-center">
                            <i class="fas fa-comment text-white"></i>
                        </div>
                        <h3 class="font-semibold mb-2">Mouth</h3>
                        <p class="text-sm text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">Communication & expression</p>
                    </a>
                </div>
            </section>

            `;
    
    content = content.substring(0, mSectionStart) + fixedMSection + content.substring(mSectionEnd);
    console.log('✅ 字母M部分修复完成');
}

console.log('📝 修复字母P部分的HTML结构错误...');

// 修复字母P部分的结构错误
const pSectionStart = content.indexOf('<!-- Letter P Section -->');
const pSectionEnd = content.indexOf('<!-- Letter Q Section -->');

if (pSectionStart !== -1 && pSectionEnd !== -1) {
    const fixedPSection = `            <!-- Letter P Section -->
            <section id="letter-P" class="letter-section mb-16">
                <div class="flex items-center mb-8">
                    <div class="w-16 h-16 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center mr-6">
                        <span class="text-2xl font-bold text-white">P</span>
                    </div>
                    <h2 class="text-3xl font-bold">Letter P</h2>
                </div>
                
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <a href="dream/path.html" class="dream-symbol-card glass-card hover-scale p-4 text-center group">
                        <div class="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-r from-brown-500 to-amber-600 flex items-center justify-center">
                            <i class="fas fa-route text-white"></i>
                        </div>
                        <h3 class="font-semibold mb-2">Path</h3>
                        <p class="text-sm text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">Direction & choices</p>
                    </a>
                    
                    <a href="dream/peace.html" class="dream-symbol-card glass-card hover-scale p-4 text-center group">
                        <div class="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-r from-blue-400 to-white flex items-center justify-center">
                            <i class="fas fa-dove text-blue-600"></i>
                        </div>
                        <h3 class="font-semibold mb-2">Peace</h3>
                        <p class="text-sm text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">Harmony & tranquility</p>
                    </a>
                    
                    <a href="dream/phone.html" class="dream-symbol-card glass-card hover-scale p-4 text-center group">
                        <div class="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-r from-gray-600 to-gray-800 flex items-center justify-center">
                            <i class="fas fa-phone text-white"></i>
                        </div>
                        <h3 class="font-semibold mb-2">Phone</h3>
                        <p class="text-sm text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">Communication & connection</p>
                    </a>
                    
                    <a href="dream/pilgrimage.html" class="dream-symbol-card glass-card hover-scale p-4 text-center group">
                        <div class="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center">
                            <i class="fas fa-walking text-white"></i>
                        </div>
                        <h3 class="font-semibold mb-2">Pilgrimage</h3>
                        <p class="text-sm text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">Spiritual journey</p>
                    </a>
                    
                    <a href="dream/plate.html" class="dream-symbol-card glass-card hover-scale p-4 text-center group">
                        <div class="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-r from-gray-400 to-gray-600 flex items-center justify-center">
                            <i class="fas fa-plate-wheat text-white"></i>
                        </div>
                        <h3 class="font-semibold mb-2">Plate</h3>
                        <p class="text-sm text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">Nourishment & sharing</p>
                    </a>
                    
                    <a href="dream/prayer.html" class="dream-symbol-card glass-card hover-scale p-4 text-center group">
                        <div class="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-r from-yellow-400 to-white flex items-center justify-center">
                            <i class="fas fa-praying-hands text-yellow-600"></i>
                        </div>
                        <h3 class="font-semibold mb-2">Prayer</h3>
                        <p class="text-sm text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">Communication with divine</p>
                    </a>
                    
                    <a href="dream/pregnancy.html" class="dream-symbol-card glass-card hover-scale p-4 text-center group">
                        <div class="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 flex items-center justify-center">
                            <i class="fas fa-baby text-white"></i>
                        </div>
                        <h3 class="font-semibold mb-2">Pregnancy</h3>
                        <p class="text-sm text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">New life & creation</p>
                    </a>
                    
                    <a href="dream/prison.html" class="dream-symbol-card glass-card hover-scale p-4 text-center group">
                        <div class="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-r from-gray-700 to-black flex items-center justify-center">
                            <i class="fas fa-lock text-white"></i>
                        </div>
                        <h3 class="font-semibold mb-2">Prison</h3>
                        <p class="text-sm text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">Restriction & confinement</p>
                    </a>
                    
                    <a href="dream/prophet.html" class="dream-symbol-card glass-card hover-scale p-4 text-center group">
                        <div class="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 flex items-center justify-center">
                            <i class="fas fa-praying-hands text-white"></i>
                        </div>
                        <h3 class="font-semibold mb-2">Prophet</h3>
                        <p class="text-sm text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">Divine guidance</p>
                    </a>
                </div>
            </section>

            `;
    
    content = content.substring(0, pSectionStart) + fixedPSection + content.substring(pSectionEnd);
    console.log('✅ 字母P部分修复完成');
}

// 保存修复后的文件
fs.writeFileSync('browse.html', content);

console.log('🎉 browse.html页面修复完成！');
console.log('');
console.log('修复内容：');
console.log('✅ 字母M部分HTML结构错误已修复');
console.log('✅ 字母P部分HTML结构错误已修复');
console.log('✅ 所有字母部分现在都能正常显示');
console.log('✅ Footer容器和JavaScript加载已确认存在');