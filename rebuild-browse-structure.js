const fs = require('fs');

console.log('🔧 Rebuilding browse.html structure...\n');

// Read the current browse.html to extract the header and navigation parts
let content = fs.readFileSync('browse.html', 'utf8');

// Extract everything up to the main content area
const headerEndIndex = content.indexOf('<main class="py-16">');
const headerContent = content.substring(0, headerEndIndex);

// Extract the footer and closing tags
const footerStartIndex = content.indexOf('    <!-- Footer Container - Loaded dynamically -->');
const footerContent = content.substring(footerStartIndex);

// Define all dream symbols organized by letter with correct data
const dreamsByLetter = {
    'A': [
        { name: 'airplane', icon: 'fas fa-plane', color: 'from-blue-500 to-cyan-500', title: 'Airplane', desc: 'Journey & aspirations' },
        { name: 'altar', icon: 'fas fa-church', color: 'from-yellow-500 to-orange-500', title: 'Altar', desc: 'Sacred worship' },
        { name: 'angel', icon: 'fas fa-feather', color: 'from-yellow-500 to-orange-500', title: 'Angel', desc: 'Divine guidance' },
        { name: 'anger', icon: 'fas fa-fire', color: 'from-red-500 to-orange-500', title: 'Anger', desc: 'Emotional release' },
        { name: 'animal', icon: 'fas fa-paw', color: 'from-green-500 to-teal-500', title: 'Animal', desc: 'Instincts & nature' },
        { name: 'ant', icon: 'fas fa-bug', color: 'from-amber-500 to-yellow-500', title: 'Ant', desc: 'Hard work & unity' },
        { name: 'anxiety', icon: 'fas fa-heart', color: 'from-gray-500 to-slate-500', title: 'Anxiety', desc: 'Inner fears' },
        { name: 'apple', icon: 'fas fa-apple-alt', color: 'from-red-500 to-pink-500', title: 'Apple', desc: 'Knowledge & temptation' },
        { name: 'arms', icon: 'fas fa-hand', color: 'from-pink-500 to-rose-500', title: 'Arms', desc: 'Strength & embrace' }
    ],
    'B': [
        { name: 'baby', icon: 'fas fa-baby', color: 'from-pink-500 to-rose-500', title: 'Baby', desc: 'New beginnings' },
        { name: 'back', icon: 'fas fa-user', color: 'from-gray-500 to-slate-500', title: 'Back', desc: 'Support & burden' },
        { name: 'bag', icon: 'fas fa-shopping-bag', color: 'from-brown-500 to-amber-600', title: 'Bag', desc: 'Possessions & identity' },
        { name: 'baptism', icon: 'fas fa-water', color: 'from-blue-500 to-cyan-500', title: 'Baptism', desc: 'Spiritual cleansing' },
        { name: 'bat', icon: 'fas fa-bat', color: 'from-gray-700 to-black', title: 'Bat', desc: 'Intuition & rebirth' },
        { name: 'beach', icon: 'fas fa-umbrella-beach', color: 'from-yellow-400 to-orange-400', title: 'Beach', desc: 'Relaxation & boundary' },
        { name: 'bear', icon: 'fas fa-paw', color: 'from-brown-600 to-amber-700', title: 'Bear', desc: 'Strength & protection' },
        { name: 'bed', icon: 'fas fa-bed', color: 'from-indigo-500 to-purple-500', title: 'Bed', desc: 'Rest & intimacy' },
        { name: 'bee', icon: 'fas fa-bug', color: 'from-yellow-500 to-amber-500', title: 'Bee', desc: 'Hard work & community' },
        { name: 'betrayal', icon: 'fas fa-heart-broken', color: 'from-red-600 to-orange-600', title: 'Betrayal', desc: 'Trust broken' },
        { name: 'bible', icon: 'fas fa-book', color: 'from-amber-600 to-yellow-600', title: 'Bible', desc: 'Divine wisdom' },
        { name: 'bird', icon: 'fas fa-dove', color: 'from-sky-500 to-blue-500', title: 'Bird', desc: 'Freedom & spirit' },
        { name: 'blessing', icon: 'fas fa-hands', color: 'from-yellow-400 to-white', title: 'Blessing', desc: 'Divine favor' },
        { name: 'blood', icon: 'fas fa-tint', color: 'from-red-600 to-red-800', title: 'Blood', desc: 'Life force & sacrifice' },
        { name: 'bones', icon: 'fas fa-bone', color: 'from-gray-400 to-gray-600', title: 'Bones', desc: 'Foundation & mortality' },
        { name: 'book', icon: 'fas fa-book', color: 'from-blue-500 to-indigo-500', title: 'Book', desc: 'Knowledge & wisdom' },
        { name: 'bottle', icon: 'fas fa-wine-bottle', color: 'from-green-500 to-teal-500', title: 'Bottle', desc: 'Containment & preservation' },
        { name: 'box', icon: 'fas fa-box', color: 'from-amber-500 to-orange-500', title: 'Box', desc: 'Hidden secrets' },
        { name: 'bread', icon: 'fas fa-bread-slice', color: 'from-yellow-500 to-amber-500', title: 'Bread', desc: 'Nourishment & sustenance' },
        { name: 'bridge', icon: 'fas fa-bridge', color: 'from-gray-500 to-slate-500', title: 'Bridge', desc: 'Connection & transition' },
        { name: 'butterfly', icon: 'fas fa-butterfly', color: 'from-pink-500 to-purple-500', title: 'Butterfly', desc: 'Transformation & rebirth' }
    ],
    'F': [
        { name: 'face', icon: 'fas fa-user', color: 'from-pink-500 to-rose-500', title: 'Face', desc: 'Identity & expression' },
        { name: 'faith', icon: 'fas fa-cross', color: 'from-yellow-400 to-white', title: 'Faith', desc: 'Spiritual belief' },
        { name: 'fear', icon: 'fas fa-ghost', color: 'from-gray-700 to-black', title: 'Fear', desc: 'Anxiety & worry' },
        { name: 'feet', icon: 'fas fa-shoe-prints', color: 'from-brown-500 to-amber-600', title: 'Feet', desc: 'Foundation & journey' },
        { name: 'fire', icon: 'fas fa-fire', color: 'from-orange-500 to-red-500', title: 'Fire', desc: 'Passion & destruction' },
        { name: 'fish', icon: 'fas fa-fish', color: 'from-blue-500 to-cyan-500', title: 'Fish', desc: 'Abundance & spirituality' },
        { name: 'flower', icon: 'fas fa-flower', color: 'from-pink-500 to-rose-500', title: 'Flower', desc: 'Beauty & growth' },
        { name: 'flying', icon: 'fas fa-feather', color: 'from-sky-500 to-blue-500', title: 'Flying', desc: 'Freedom & transcendence' },
        { name: 'flowers', icon: 'fas fa-seedling', color: 'from-pink-500 to-rose-500', title: 'Flowers', desc: 'Beauty & growth' },
        { name: 'food', icon: 'fas fa-utensils', color: 'from-orange-500 to-red-500', title: 'Food', desc: 'Nourishment & satisfaction' },
        { name: 'forest', icon: 'fas fa-tree', color: 'from-green-500 to-emerald-500', title: 'Forest', desc: 'Nature & mystery' },
        { name: 'forgiveness', icon: 'fas fa-heart', color: 'from-pink-500 to-rose-500', title: 'Forgiveness', desc: 'Healing & release' },
        { name: 'fox', icon: 'fas fa-paw', color: 'from-orange-500 to-red-500', title: 'Fox', desc: 'Cunning & intelligence' },
        { name: 'frog', icon: 'fas fa-frog', color: 'from-green-500 to-teal-500', title: 'Frog', desc: 'Transformation & cleansing' }
    ]
};

// Letter colors for section headers
const letterColors = {
    'A': 'from-purple-500 to-pink-500',
    'B': 'from-blue-500 to-teal-500',
    'C': 'from-green-500 to-emerald-500',
    'D': 'from-yellow-500 to-orange-500',
    'E': 'from-red-500 to-pink-500',
    'F': 'from-orange-500 to-red-500',
    'G': 'from-green-600 to-emerald-600',
    'H': 'from-purple-600 to-indigo-600',
    'I': 'from-indigo-500 to-purple-500',
    'J': 'from-teal-500 to-cyan-500',
    'K': 'from-amber-500 to-yellow-500',
    'L': 'from-rose-500 to-pink-500',
    'M': 'from-slate-500 to-gray-500',
    'N': 'from-emerald-500 to-green-500',
    'O': 'from-orange-500 to-amber-500',
    'P': 'from-purple-500 to-violet-500',
    'Q': 'from-cyan-500 to-blue-500',
    'R': 'from-red-500 to-rose-500',
    'S': 'from-sky-500 to-blue-500',
    'T': 'from-teal-500 to-emerald-500',
    'U': 'from-violet-500 to-purple-500',
    'V': 'from-green-500 to-teal-500',
    'W': 'from-blue-500 to-indigo-500',
    'X': 'from-gray-500 to-slate-500',
    'Y': 'from-yellow-500 to-amber-500',
    'Z': 'from-purple-500 to-pink-500'
};

function createDreamCard(dream) {
    return `                    <a href="dream/${dream.name}.html" class="dream-symbol-card glass-card hover-scale p-4 text-center group">
                        <div class="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-r ${dream.color} flex items-center justify-center">
                            <i class="${dream.icon} text-white"></i>
                        </div>
                        <h3 class="font-semibold mb-2">${dream.title}</h3>
                        <p class="text-sm text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">${dream.desc}</p>
                    </a>`;
}

function createLetterSection(letter, dreams) {
    const color = letterColors[letter] || 'from-gray-500 to-slate-500';
    const dreamCards = dreams.map(dream => createDreamCard(dream)).join('\n                    \n');
    
    return `            <!-- Letter ${letter} Section -->
            <section id="letter-${letter}" class="letter-section mb-16">
                <div class="flex items-center mb-8">
                    <div class="w-16 h-16 rounded-full bg-gradient-to-r ${color} flex items-center justify-center mr-6">
                        <span class="text-2xl font-bold text-white">${letter}</span>
                    </div>
                    <h2 class="text-3xl font-bold">Letter ${letter}</h2>
                </div>
                
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
${dreamCards}
                </div>
            </section>`;
}

// Build the main content
let mainContent = `    <!-- Dream Symbols Content -->
    <main class="py-16">
        <div class="container mx-auto px-6">
`;

// Add sections for letters that have dreams
Object.keys(dreamsByLetter).forEach(letter => {
    mainContent += createLetterSection(letter, dreamsByLetter[letter]) + '\n\n';
});

mainContent += `        </div>
    </main>

`;

// Combine all parts
const newContent = headerContent + mainContent + footerContent;

// Write the rebuilt file
fs.writeFileSync('browse.html', newContent);

console.log('✅ Successfully rebuilt browse.html structure');
console.log('📊 Sections created:');
Object.keys(dreamsByLetter).forEach(letter => {
    console.log(`   ${letter}: ${dreamsByLetter[letter].length} dreams`);
});
console.log('\n🎉 Browse page structure is now clean and correct!');