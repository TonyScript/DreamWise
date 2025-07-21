const fs = require('fs');

// Missing dreams data with appropriate icons, colors, and descriptions
const missingDreams = {
    'B': [
        { name: 'book', icon: 'fas fa-book', color: 'from-blue-500 to-indigo-500', title: 'Book', description: 'Knowledge & wisdom' },
        { name: 'bottle', icon: 'fas fa-wine-bottle', color: 'from-green-500 to-teal-500', title: 'Bottle', description: 'Containment & preservation' },
        { name: 'box', icon: 'fas fa-box', color: 'from-amber-500 to-orange-500', title: 'Box', description: 'Hidden secrets' },
        { name: 'bread', icon: 'fas fa-bread-slice', color: 'from-yellow-500 to-amber-500', title: 'Bread', description: 'Nourishment & sustenance' },
        { name: 'bridge', icon: 'fas fa-bridge', color: 'from-gray-500 to-slate-500', title: 'Bridge', description: 'Connection & transition' },
        { name: 'butterfly', icon: 'fas fa-butterfly', color: 'from-pink-500 to-purple-500', title: 'Butterfly', description: 'Transformation & rebirth' }
    ],
    'F': [
        { name: 'flowers', icon: 'fas fa-seedling', color: 'from-pink-500 to-rose-500', title: 'Flowers', description: 'Beauty & growth' },
        { name: 'food', icon: 'fas fa-utensils', color: 'from-orange-500 to-red-500', title: 'Food', description: 'Nourishment & satisfaction' },
        { name: 'forest', icon: 'fas fa-tree', color: 'from-green-500 to-emerald-500', title: 'Forest', description: 'Nature & mystery' },
        { name: 'forgiveness', icon: 'fas fa-heart', color: 'from-pink-500 to-rose-500', title: 'Forgiveness', description: 'Healing & release' },
        { name: 'fox', icon: 'fas fa-paw', color: 'from-orange-500 to-red-500', title: 'Fox', description: 'Cunning & intelligence' },
        { name: 'frog', icon: 'fas fa-frog', color: 'from-green-500 to-teal-500', title: 'Frog', description: 'Transformation & cleansing' }
    ],
    'H': [
        { name: 'hands', icon: 'fas fa-hands', color: 'from-pink-500 to-rose-500', title: 'Hands', description: 'Action & creation' }
    ],
    'L': [
        { name: 'loneliness', icon: 'fas fa-user', color: 'from-gray-500 to-slate-500', title: 'Loneliness', description: 'Isolation & reflection' },
        { name: 'love', icon: 'fas fa-heart', color: 'from-pink-500 to-red-500', title: 'Love', description: 'Connection & affection' }
    ],
    'M': [
        { name: 'mouse', icon: 'fas fa-mouse', color: 'from-gray-500 to-slate-500', title: 'Mouse', description: 'Small details & timidity' },
        { name: 'mouth', icon: 'fas fa-comment', color: 'from-pink-500 to-rose-500', title: 'Mouth', description: 'Communication & expression' }
    ],
    'P': [
        { name: 'prophet', icon: 'fas fa-praying-hands', color: 'from-yellow-500 to-orange-500', title: 'Prophet', description: 'Divine guidance' }
    ],
    'R': [
        { name: 'rope', icon: 'fas fa-link', color: 'from-amber-500 to-yellow-500', title: 'Rope', description: 'Binding & connection' },
        { name: 'rosary', icon: 'fas fa-cross', color: 'from-yellow-500 to-orange-500', title: 'Rosary', description: 'Prayer & devotion' }
    ],
    'T': [
        { name: 'turtle', icon: 'fas fa-turtle', color: 'from-green-500 to-teal-500', title: 'Turtle', description: 'Patience & longevity' }
    ]
};

function createDreamCard(dream) {
    return `                    <a href="dream/${dream.name}.html" class="dream-symbol-card glass-card hover-scale p-4 text-center group">
                        <div class="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-r ${dream.color} flex items-center justify-center">
                            <i class="${dream.icon} text-white"></i>
                        </div>
                        <h3 class="font-semibold mb-2">${dream.title}</h3>
                        <p class="text-sm text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">${dream.description}</p>
                    </a>`;
}

// Read browse.html
let browseContent = fs.readFileSync('browse.html', 'utf8');

// Add missing dreams to each section
Object.keys(missingDreams).forEach(letter => {
    const dreams = missingDreams[letter];
    const sectionRegex = new RegExp(`(<!-- Letter ${letter} Section -->.*?<div class="grid grid-cols-2 md:grid-cols-4 gap-4">)(.*?)(</div>)`, 's');
    
    const match = browseContent.match(sectionRegex);
    if (match) {
        const existingCards = match[2];
        const newCards = dreams.map(dream => createDreamCard(dream)).join('\n                    \n');
        
        const updatedSection = match[1] + existingCards + '\n                    \n' + newCards + '\n                ' + match[3];
        browseContent = browseContent.replace(sectionRegex, updatedSection);
        
        console.log(`✅ Added ${dreams.length} missing dreams to section ${letter}: ${dreams.map(d => d.name).join(', ')}`);
    } else {
        console.log(`⚠️  Could not find section ${letter}`);
    }
});

// Write updated content
fs.writeFileSync('browse.html', browseContent);

console.log('\n🎉 All missing dreams have been added to browse.html!');
console.log('📊 Total added dreams:', Object.values(missingDreams).flat().length);