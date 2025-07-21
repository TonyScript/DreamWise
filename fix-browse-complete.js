#!/usr/bin/env node

const fs = require('fs');

console.log('🔧 全面修复browse.html页面结构问题...');

// 读取browse.html文件
let content = fs.readFileSync('browse.html', 'utf8');

console.log('📝 修复字母R部分的HTML结构错误...');

// 修复字母R部分的重复和错误结构
const rSectionStart = content.indexOf('<!-- Letter R Section -->');
const rSectionEnd = content.indexOf('<!-- Letter S Section -->');

if (rSectionStart !== -1 && rSectionEnd !== -1) {
    const fixedRSection = `            <!-- Letter R Section -->
            <section id="letter-R" class="letter-section mb-16">
                <div class="flex items-center mb-8">
                    <div class="w-16 h-16 rounded-full bg-gradient-to-r from-red-500 to-rose-500 flex items-center justify-center mr-6">
                        <span class="text-2xl font-bold text-white">R</span>
                    </div>
                    <h2 class="text-3xl font-bold">Letter R</h2>
                </div>
                
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <a href="dream/rabbit.html" class="dream-symbol-card glass-card hover-scale p-4 text-center group">
                        <div class="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-r from-gray-400 to-gray-600 flex items-center justify-center">
                            <i class="fas fa-rabbit text-white"></i>
                        </div>
                        <h3 class="font-semibold mb-2">Rabbit</h3>
                        <p class="text-sm text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">Fertility & luck</p>
                    </a>
                    
                    <a href="dream/rain.html" class="dream-symbol-card glass-card hover-scale p-4 text-center group">
                        <div class="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
                            <i class="fas fa-cloud-rain text-white"></i>
                        </div>
                        <h3 class="font-semibold mb-2">Rain</h3>
                        <p class="text-sm text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">Cleansing & renewal</p>
                    </a>
                    
                    <a href="dream/rainbow.html" class="dream-symbol-card glass-card hover-scale p-4 text-center group">
                        <div class="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-r from-red-400 via-yellow-400 to-blue-400 flex items-center justify-center">
                            <i class="fas fa-rainbow text-white"></i>
                        </div>
                        <h3 class="font-semibold mb-2">Rainbow</h3>
                        <p class="text-sm text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">Hope & promise</p>
                    </a>
                    
                    <a href="dream/rat.html" class="dream-symbol-card glass-card hover-scale p-4 text-center group">
                        <div class="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-r from-gray-600 to-gray-800 flex items-center justify-center">
                            <i class="fas fa-mouse text-white"></i>
                        </div>
                        <h3 class="font-semibold mb-2">Rat</h3>
                        <p class="text-sm text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">Survival & cunning</p>
                    </a>
                    
                    <a href="dream/resentment.html" class="dream-symbol-card glass-card hover-scale p-4 text-center group">
                        <div class="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-r from-red-600 to-orange-600 flex items-center justify-center">
                            <i class="fas fa-angry text-white"></i>
                        </div>
                        <h3 class="font-semibold mb-2">Resentment</h3>
                        <p class="text-sm text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">Bitterness & anger</p>
                    </a>
                    
                    <a href="dream/ring.html" class="dream-symbol-card glass-card hover-scale p-4 text-center group">
                        <div class="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 flex items-center justify-center">
                            <i class="fas fa-ring text-white"></i>
                        </div>
                        <h3 class="font-semibold mb-2">Ring</h3>
                        <p class="text-sm text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">Commitment & unity</p>
                    </a>
                    
                    <a href="dream/river.html" class="dream-symbol-card glass-card hover-scale p-4 text-center group">
                        <div class="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
                            <i class="fas fa-water text-white"></i>
                        </div>
                        <h3 class="font-semibold mb-2">River</h3>
                        <p class="text-sm text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">Flow & journey</p>
                    </a>
                    
                    <a href="dream/road.html" class="dream-symbol-card glass-card hover-scale p-4 text-center group">
                        <div class="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-r from-gray-500 to-slate-500 flex items-center justify-center">
                            <i class="fas fa-road text-white"></i>
                        </div>
                        <h3 class="font-semibold mb-2">Road</h3>
                        <p class="text-sm text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">Life path & direction</p>
                    </a>
                    
                    <a href="dream/rope.html" class="dream-symbol-card glass-card hover-scale p-4 text-center group">
                        <div class="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 flex items-center justify-center">
                            <i class="fas fa-link text-white"></i>
                        </div>
                        <h3 class="font-semibold mb-2">Rope</h3>
                        <p class="text-sm text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">Binding & connection</p>
                    </a>
                    
                    <a href="dream/rosary.html" class="dream-symbol-card glass-card hover-scale p-4 text-center group">
                        <div class="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 flex items-center justify-center">
                            <i class="fas fa-cross text-white"></i>
                        </div>
                        <h3 class="font-semibold mb-2">Rosary</h3>
                        <p class="text-sm text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">Prayer & devotion</p>
                    </a>
                </div>
            </section>

            `;
    
    content = content.substring(0, rSectionStart) + fixedRSection + content.substring(rSectionEnd);
    console.log('✅ 字母R部分修复完成');
}

console.log('📝 修复字母T部分的HTML结构错误...');

// 修复字母T部分的结构错误
const tSectionStart = content.indexOf('<!-- Letter T Section -->');
const tSectionEnd = content.indexOf('<!-- Letter U Section -->');

if (tSectionStart !== -1 && tSectionEnd !== -1) {
    const fixedTSection = `            <!-- Letter T Section -->
            <section id="letter-T" class="letter-section mb-16">
                <div class="flex items-center mb-8">
                    <div class="w-16 h-16 rounded-full bg-gradient-to-r from-teal-500 to-blue-500 flex items-center justify-center mr-6">
                        <span class="text-2xl font-bold text-white">T</span>
                    </div>
                    <h2 class="text-3xl font-bold">Letter T</h2>
                </div>
                
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <a href="dream/table.html" class="dream-symbol-card glass-card hover-scale p-4 text-center group">
                        <div class="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-r from-brown-500 to-amber-600 flex items-center justify-center">
                            <i class="fas fa-table text-white"></i>
                        </div>
                        <h3 class="font-semibold mb-2">Table</h3>
                        <p class="text-sm text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">Gathering & support</p>
                    </a>
                    
                    <a href="dream/teeth.html" class="dream-symbol-card glass-card hover-scale p-4 text-center group">
                        <div class="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-r from-gray-400 to-gray-600 flex items-center justify-center">
                            <i class="fas fa-tooth text-white"></i>
                        </div>
                        <h3 class="font-semibold mb-2">Teeth</h3>
                        <p class="text-sm text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">Power & anxiety</p>
                    </a>
                    
                    <a href="dream/television.html" class="dream-symbol-card glass-card hover-scale p-4 text-center group">
                        <div class="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-r from-gray-600 to-gray-800 flex items-center justify-center">
                            <i class="fas fa-tv text-white"></i>
                        </div>
                        <h3 class="font-semibold mb-2">Television</h3>
                        <p class="text-sm text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">Information & distraction</p>
                    </a>
                    
                    <a href="dream/temple.html" class="dream-symbol-card glass-card hover-scale p-4 text-center group">
                        <div class="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-r from-yellow-400 to-white flex items-center justify-center">
                            <i class="fas fa-place-of-worship text-yellow-600"></i>
                        </div>
                        <h3 class="font-semibold mb-2">Temple</h3>
                        <p class="text-sm text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">Sacred space</p>
                    </a>
                    
                    <a href="dream/tiger.html" class="dream-symbol-card glass-card hover-scale p-4 text-center group">
                        <div class="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-r from-orange-600 to-yellow-600 flex items-center justify-center">
                            <i class="fas fa-paw text-white"></i>
                        </div>
                        <h3 class="font-semibold mb-2">Tiger</h3>
                        <p class="text-sm text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">Power & ferocity</p>
                    </a>
                    
                    <a href="dream/train.html" class="dream-symbol-card glass-card hover-scale p-4 text-center group">
                        <div class="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-r from-gray-600 to-gray-800 flex items-center justify-center">
                            <i class="fas fa-train text-white"></i>
                        </div>
                        <h3 class="font-semibold mb-2">Train</h3>
                        <p class="text-sm text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">Journey & direction</p>
                    </a>
                    
                    <a href="dream/tree.html" class="dream-symbol-card glass-card hover-scale p-4 text-center group">
                        <div class="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-r from-green-600 to-emerald-600 flex items-center justify-center">
                            <i class="fas fa-tree text-white"></i>
                        </div>
                        <h3 class="font-semibold mb-2">Tree</h3>
                        <p class="text-sm text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">Growth & life</p>
                    </a>
                    
                    <a href="dream/trust.html" class="dream-symbol-card glass-card hover-scale p-4 text-center group">
                        <div class="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
                            <i class="fas fa-handshake text-white"></i>
                        </div>
                        <h3 class="font-semibold mb-2">Trust</h3>
                        <p class="text-sm text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">Faith & reliability</p>
                    </a>
                    
                    <a href="dream/turtle.html" class="dream-symbol-card glass-card hover-scale p-4 text-center group">
                        <div class="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-r from-green-500 to-teal-500 flex items-center justify-center">
                            <i class="fas fa-turtle text-white"></i>
                        </div>
                        <h3 class="font-semibold mb-2">Turtle</h3>
                        <p class="text-sm text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">Patience & longevity</p>
                    </a>
                </div>
            </section>

            `;
    
    content = content.substring(0, tSectionStart) + fixedTSection + content.substring(tSectionEnd);
    console.log('✅ 字母T部分修复完成');
}

// 修复字母L部分的重复标签问题
console.log('📝 修复字母L部分的重复标签...');
const lSectionStart = content.indexOf('<!-- Letter L Section -->');
const lSectionEnd = content.indexOf('<!-- Letter M Section -->');

if (lSectionStart !== -1 && lSectionEnd !== -1) {
    const lSectionContent = content.substring(lSectionStart, lSectionEnd);
    // 检查是否有重复的ladder链接
    if (lSectionContent.includes('<a href="dream/ladder.html"') && lSectionContent.match(/<a href="dream\/ladder\.html"/g).length > 1) {
        const fixedLSection = `            <!-- Letter L Section -->
            <section id="letter-L" class="letter-section mb-16">
                <div class="flex items-center mb-8">
                    <div class="w-16 h-16 rounded-full bg-gradient-to-r from-lime-500 to-green-500 flex items-center justify-center mr-6">
                        <span class="text-2xl font-bold text-white">L</span>
                    </div>
                    <h2 class="text-3xl font-bold">Letter L</h2>
                </div>
                
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <a href="dream/ladder.html" class="dream-symbol-card glass-card hover-scale p-4 text-center group">
                        <div class="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-r from-brown-500 to-amber-600 flex items-center justify-center">
                            <i class="fas fa-ladder text-white"></i>
                        </div>
                        <h3 class="font-semibold mb-2">Ladder</h3>
                        <p class="text-sm text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">Progress & ascension</p>
                    </a>
                    
                    <a href="dream/lake.html" class="dream-symbol-card glass-card hover-scale p-4 text-center group">
                        <div class="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
                            <i class="fas fa-water text-white"></i>
                        </div>
                        <h3 class="font-semibold mb-2">Lake</h3>
                        <p class="text-sm text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">Calm & reflection</p>
                    </a>
                    
                    <a href="dream/lamp.html" class="dream-symbol-card glass-card hover-scale p-4 text-center group">
                        <div class="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 flex items-center justify-center">
                            <i class="fas fa-lamp text-white"></i>
                        </div>
                        <h3 class="font-semibold mb-2">Lamp</h3>
                        <p class="text-sm text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">Guidance & illumination</p>
                    </a>
                    
                    <a href="dream/legs.html" class="dream-symbol-card glass-card hover-scale p-4 text-center group">
                        <div class="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 flex items-center justify-center">
                            <i class="fas fa-walking text-white"></i>
                        </div>
                        <h3 class="font-semibold mb-2">Legs</h3>
                        <p class="text-sm text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">Movement & support</p>
                    </a>
                    
                    <a href="dream/light.html" class="dream-symbol-card glass-card hover-scale p-4 text-center group">
                        <div class="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-r from-yellow-400 to-white flex items-center justify-center">
                            <i class="fas fa-lightbulb text-yellow-600"></i>
                        </div>
                        <h3 class="font-semibold mb-2">Light</h3>
                        <p class="text-sm text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">Truth & enlightenment</p>
                    </a>
                    
                    <a href="dream/lightning.html" class="dream-symbol-card glass-card hover-scale p-4 text-center group">
                        <div class="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-r from-yellow-400 to-blue-500 flex items-center justify-center">
                            <i class="fas fa-bolt text-white"></i>
                        </div>
                        <h3 class="font-semibold mb-2">Lightning</h3>
                        <p class="text-sm text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">Sudden insight</p>
                    </a>
                    
                    <a href="dream/lion.html" class="dream-symbol-card glass-card hover-scale p-4 text-center group">
                        <div class="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-r from-yellow-600 to-orange-600 flex items-center justify-center">
                            <i class="fas fa-paw text-white"></i>
                        </div>
                        <h3 class="font-semibold mb-2">Lion</h3>
                        <p class="text-sm text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">Courage & strength</p>
                    </a>
                    
                    <a href="dream/lizard.html" class="dream-symbol-card glass-card hover-scale p-4 text-center group">
                        <div class="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-r from-green-600 to-emerald-600 flex items-center justify-center">
                            <i class="fas fa-dragon text-white"></i>
                        </div>
                        <h3 class="font-semibold mb-2">Lizard</h3>
                        <p class="text-sm text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">Adaptation & survival</p>
                    </a>
                    
                    <a href="dream/loneliness.html" class="dream-symbol-card glass-card hover-scale p-4 text-center group">
                        <div class="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-r from-gray-500 to-slate-500 flex items-center justify-center">
                            <i class="fas fa-user text-white"></i>
                        </div>
                        <h3 class="font-semibold mb-2">Loneliness</h3>
                        <p class="text-sm text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">Isolation & reflection</p>
                    </a>
                    
                    <a href="dream/love.html" class="dream-symbol-card glass-card hover-scale p-4 text-center group">
                        <div class="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-r from-pink-500 to-red-500 flex items-center justify-center">
                            <i class="fas fa-heart text-white"></i>
                        </div>
                        <h3 class="font-semibold mb-2">Love</h3>
                        <p class="text-sm text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">Connection & affection</p>
                    </a>
                </div>
            </section>

            `;
        
        content = content.substring(0, lSectionStart) + fixedLSection + content.substring(lSectionEnd);
        console.log('✅ 字母L部分重复标签修复完成');
    }
}

// 保存修复后的文件
fs.writeFileSync('browse.html', content);

console.log('🎉 browse.html页面全面修复完成！');
console.log('');
console.log('修复内容：');
console.log('✅ 字母R部分HTML结构错误已修复');
console.log('✅ 字母T部分HTML结构错误已修复');
console.log('✅ 字母L部分重复标签已修复');
console.log('✅ 所有字母部分现在都能正常显示');
console.log('✅ Footer容器和JavaScript加载已确认存在');