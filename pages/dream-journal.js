/**
 * Dream Journal JavaScript
 * Handles dream journal functionality including CRUD operations, analytics, and UI interactions
 */

class DreamJournal {
    constructor() {
        this.currentPage = 1;
        this.currentFilters = {};
        this.dreams = [];
        this.stats = {};
        
        this.init();
    }

    async init() {
        // Wait for auth manager to initialize
        await this.waitForAuth();
        
        // Check authentication
        if (!authManager.isAuthenticated()) {
            console.log('User not authenticated, redirecting...');
            window.location.href = '../index-new.html';
            return;
        }

        // Set today's date as default
        document.getElementById('dreamDateInput').value = new Date().toISOString().split('T')[0];

        // Load initial data
        await this.loadStats();
        await this.loadDreams();

        // Setup event listeners
        this.setupEventListeners();
    }
    
    // Wait for auth manager to be ready
    async waitForAuth() {
        return new Promise((resolve) => {
            if (typeof authManager !== 'undefined' && authManager.isInitialized) {
                resolve();
            } else {
                const checkAuth = () => {
                    if (typeof authManager !== 'undefined' && authManager.isInitialized) {
                        resolve();
                    } else {
                        setTimeout(checkAuth, 100);
                    }
                };
                checkAuth();
            }
        });
    }

    setupEventListeners() {
        // Tab switching
        document.querySelectorAll('.tab-button').forEach(button => {
            button.addEventListener('click', (e) => {
                const tab = e.target.dataset.tab;
                this.switchTab(tab);
            });
        });

        // Dream form submission
        document.getElementById('dreamForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveDream();
        });

        // Filters
        document.getElementById('filterCategory').addEventListener('change', (e) => {
            this.currentFilters.category = e.target.value;
            this.loadDreams();
        });

        document.getElementById('filterMood').addEventListener('change', (e) => {
            this.currentFilters.mood = e.target.value;
            this.loadDreams();
        });

        // Modal close on backdrop click
        document.getElementById('dreamModal').addEventListener('click', (e) => {
            if (e.target.id === 'dreamModal') {
                this.closeDreamModal();
            }
        });
    }

    switchTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('.tab-button').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // Update tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(`${tabName}Tab`).classList.add('active');

        // Load analytics if switching to analytics tab
        if (tabName === 'analytics') {
            this.loadAnalytics();
        }
    }

    async loadStats() {
        try {
            const response = await authManager.apiRequest('/journal/stats/overview');
            this.stats = response.stats;
            this.updateStatsDisplay();
        } catch (error) {
            console.error('Failed to load stats:', error);
        }
    }

    updateStatsDisplay() {
        document.getElementById('totalDreams').textContent = this.stats.totalDreams || 0;
        document.getElementById('avgLucidity').textContent = this.stats.avgLucidity || 0;
        document.getElementById('avgVividness').textContent = this.stats.avgVividness || 0;
        document.getElementById('mostCommonMood').textContent = this.stats.mostCommonMood || '-';
    }

    async loadDreams() {
        const dreamsList = document.getElementById('dreamsList');
        const emptyState = document.getElementById('emptyState');
        const loading = dreamsList.querySelector('.loading');

        loading.style.display = 'block';
        emptyState.style.display = 'none';

        try {
            const params = new URLSearchParams({
                page: this.currentPage,
                limit: 10,
                ...this.currentFilters
            });

            const response = await authManager.apiRequest(`/journal/my-dreams?${params}`);
            this.dreams = response.dreams;

            if (this.dreams.length === 0) {
                loading.style.display = 'none';
                emptyState.style.display = 'block';
            } else {
                this.renderDreams();
                loading.style.display = 'none';
            }
        } catch (error) {
            console.error('Failed to load dreams:', error);
            loading.style.display = 'none';
            showNotification('Failed to load dreams', 'error');
        }
    }

    renderDreams() {
        const dreamsList = document.getElementById('dreamsList');
        dreamsList.innerHTML = '';

        this.dreams.forEach(dream => {
            const dreamElement = this.createDreamElement(dream);
            dreamsList.appendChild(dreamElement);
        });
    }

    createDreamElement(dream) {
        const div = document.createElement('div');
        div.className = 'dream-entry cursor-pointer';
        div.onclick = () => this.openDreamModal(dream);

        const dreamDate = new Date(dream.dreamDate).toLocaleDateString();
        const moodClass = dream.mood?.overall ? `mood-${dream.mood.overall}` : 'mood-neutral';
        
        div.innerHTML = `
            <div class="flex justify-between items-start mb-3">
                <h3 class="text-lg font-semibold">${dream.title}</h3>
                <div class="flex items-center space-x-2">
                    <span class="mood-indicator ${moodClass}"></span>
                    <span class="text-sm text-gray-400">${dreamDate}</span>
                </div>
            </div>
            
            <p class="text-gray-300 mb-3 line-clamp-2">${dream.content.substring(0, 150)}${dream.content.length > 150 ? '...' : ''}</p>
            
            <div class="flex justify-between items-center">
                <div class="flex flex-wrap">
                    ${dream.categories.map(cat => `<span class="category-tag">${cat}</span>`).join('')}
                </div>
                <div class="flex items-center space-x-4 text-sm text-gray-400">
                    ${dream.lucidityLevel > 0 ? `<span><i class="fas fa-eye mr-1"></i>${dream.lucidityLevel}/10</span>` : ''}
                    ${dream.vividness > 0 ? `<span><i class="fas fa-palette mr-1"></i>${dream.vividness}/10</span>` : ''}
                    <span><i class="fas fa-${dream.privacy === 'private' ? 'lock' : dream.privacy === 'public' ? 'globe' : 'users'} mr-1"></i>${dream.privacy}</span>
                </div>
            </div>
        `;

        return div;
    }

    async saveDream() {
        const form = document.getElementById('dreamForm');
        const formData = new FormData(form);
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;

        try {
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Saving...';
            submitBtn.disabled = true;

            // Prepare dream data
            const dreamData = {
                title: formData.get('title'),
                content: formData.get('content'),
                dreamDate: formData.get('dreamDate') || new Date().toISOString(),
                mood: {
                    before: formData.get('moodBefore') || '',
                    after: formData.get('moodAfter') || '',
                    overall: formData.get('moodOverall') || ''
                },
                lucidityLevel: parseInt(formData.get('lucidityLevel')) || 0,
                vividness: parseInt(formData.get('vividness')) || 0,
                sleepQuality: parseInt(formData.get('sleepQuality')) || 0,
                categories: formData.getAll('categories'),
                spiritualPerspective: formData.get('spiritualPerspective') || '',
                tags: formData.get('tags') ? formData.get('tags').split(',').map(tag => tag.trim()) : [],
                privacy: formData.get('privacy') || 'private'
            };

            const response = await authManager.apiRequest('/journal', {
                method: 'POST',
                body: JSON.stringify(dreamData)
            });

            showNotification('Dream saved successfully!', 'success');
            form.reset();
            
            // Reset sliders
            document.getElementById('lucidityValue').textContent = '0';
            document.getElementById('vividnessValue').textContent = '5';
            document.getElementById('sleepQualityValue').textContent = '5';
            
            // Reload data
            await this.loadStats();
            await this.loadDreams();
            
            // Switch to dreams tab
            this.switchTab('dreams');

        } catch (error) {
            console.error('Failed to save dream:', error);
            showNotification(error.message || 'Failed to save dream', 'error');
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }

    async loadAnalytics() {
        const topCategoriesEl = document.getElementById('topCategories');
        const dreamTrendsEl = document.getElementById('dreamTrends');

        if (this.stats.topCategories && this.stats.topCategories.length > 0) {
            topCategoriesEl.innerHTML = this.stats.topCategories.map(cat => `
                <div class="flex justify-between items-center py-2">
                    <span>${cat.category}</span>
                    <span class="text-purple-400 font-semibold">${cat.count}</span>
                </div>
            `).join('');
        } else {
            topCategoriesEl.innerHTML = '<div class="text-gray-400">No categories data yet</div>';
        }

        // Simple trends display
        if (this.stats.totalDreams > 0) {
            dreamTrendsEl.innerHTML = `
                <div class="space-y-3">
                    <div class="flex justify-between">
                        <span>Average Lucidity:</span>
                        <span class="text-purple-400">${this.stats.avgLucidity}/10</span>
                    </div>
                    <div class="flex justify-between">
                        <span>Average Vividness:</span>
                        <span class="text-purple-400">${this.stats.avgVividness}/10</span>
                    </div>
                    <div class="flex justify-between">
                        <span>Average Sleep Quality:</span>
                        <span class="text-purple-400">${this.stats.avgSleepQuality}/10</span>
                    </div>
                    <div class="flex justify-between">
                        <span>Most Common Mood:</span>
                        <span class="text-purple-400 capitalize">${this.stats.mostCommonMood || 'None'}</span>
                    </div>
                </div>
            `;
        } else {
            dreamTrendsEl.innerHTML = '<div class="text-gray-400">Record more dreams to see trends</div>';
        }
    }

    openDreamModal(dream) {
        const modal = document.getElementById('dreamModal');
        const modalTitle = document.getElementById('modalTitle');
        const modalContent = document.getElementById('modalContent');

        modalTitle.textContent = dream.title;
        
        const dreamDate = new Date(dream.dreamDate).toLocaleDateString();
        const moodClass = dream.mood?.overall ? `mood-${dream.mood.overall}` : 'mood-neutral';
        
        modalContent.innerHTML = `
            <div class="space-y-6">
                <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-3">
                        <span class="mood-indicator ${moodClass}"></span>
                        <span class="text-gray-400">${dreamDate}</span>
                    </div>
                    <div class="flex items-center space-x-4 text-sm">
                        ${dream.lucidityLevel > 0 ? `<span class="text-purple-400"><i class="fas fa-eye mr-1"></i>Lucidity: ${dream.lucidityLevel}/10</span>` : ''}
                        ${dream.vividness > 0 ? `<span class="text-blue-400"><i class="fas fa-palette mr-1"></i>Vividness: ${dream.vividness}/10</span>` : ''}
                        ${dream.sleepQuality > 0 ? `<span class="text-green-400"><i class="fas fa-bed mr-1"></i>Sleep: ${dream.sleepQuality}/10</span>` : ''}
                    </div>
                </div>
                
                <div>
                    <h4 class="font-semibold mb-2">Dream Description</h4>
                    <p class="text-gray-300 leading-relaxed">${dream.content}</p>
                </div>
                
                ${dream.categories.length > 0 ? `
                    <div>
                        <h4 class="font-semibold mb-2">Categories</h4>
                        <div class="flex flex-wrap">
                            ${dream.categories.map(cat => `<span class="category-tag">${cat}</span>`).join('')}
                        </div>
                    </div>
                ` : ''}
                
                ${dream.tags.length > 0 ? `
                    <div>
                        <h4 class="font-semibold mb-2">Tags</h4>
                        <div class="flex flex-wrap">
                            ${dream.tags.map(tag => `<span class="category-tag">${tag}</span>`).join('')}
                        </div>
                    </div>
                ` : ''}
                
                ${dream.spiritualPerspective ? `
                    <div>
                        <h4 class="font-semibold mb-2">Spiritual Perspective</h4>
                        <p class="text-purple-400">${dream.spiritualPerspective}</p>
                    </div>
                ` : ''}
                
                ${dream.mood.before || dream.mood.after ? `
                    <div>
                        <h4 class="font-semibold mb-2">Mood Journey</h4>
                        <div class="grid grid-cols-2 gap-4 text-sm">
                            ${dream.mood.before ? `<div><span class="text-gray-400">Before Sleep:</span> <span class="capitalize">${dream.mood.before}</span></div>` : ''}
                            ${dream.mood.after ? `<div><span class="text-gray-400">After Dream:</span> <span class="capitalize">${dream.mood.after}</span></div>` : ''}
                        </div>
                    </div>
                ` : ''}
                
                <div class="flex justify-between items-center pt-4 border-t border-white/10">
                    <span class="text-sm text-gray-400">
                        <i class="fas fa-${dream.privacy === 'private' ? 'lock' : dream.privacy === 'public' ? 'globe' : 'users'} mr-1"></i>
                        ${dream.privacy.charAt(0).toUpperCase() + dream.privacy.slice(1)}
                    </span>
                    <div class="flex space-x-2">
                        <button class="btn-secondary" onclick="editDream('${dream._id}')">
                            <i class="fas fa-edit mr-1"></i>Edit
                        </button>
                        <button class="btn-secondary text-red-400" onclick="deleteDream('${dream._id}')">
                            <i class="fas fa-trash mr-1"></i>Delete
                        </button>
                    </div>
                </div>
            </div>
        `;

        modal.classList.add('active');
    }

    closeDreamModal() {
        document.getElementById('dreamModal').classList.remove('active');
    }

    async deleteDream(dreamId) {
        if (!confirm('Are you sure you want to delete this dream? This action cannot be undone.')) {
            return;
        }

        try {
            await authManager.apiRequest(`/journal/${dreamId}`, {
                method: 'DELETE'
            });

            showNotification('Dream deleted successfully', 'success');
            this.closeDreamModal();
            await this.loadStats();
            await this.loadDreams();
        } catch (error) {
            console.error('Failed to delete dream:', error);
            showNotification(error.message || 'Failed to delete dream', 'error');
        }
    }

    resetForm() {
        document.getElementById('dreamForm').reset();
        document.getElementById('dreamDateInput').value = new Date().toISOString().split('T')[0];
        document.getElementById('lucidityValue').textContent = '0';
        document.getElementById('vividnessValue').textContent = '5';
        document.getElementById('sleepQualityValue').textContent = '5';
    }
}

// Global functions for modal actions
function switchTab(tabName) {
    dreamJournal.switchTab(tabName);
}

function closeDreamModal() {
    dreamJournal.closeDreamModal();
}

function editDream(dreamId) {
    // TODO: Implement edit functionality
    showNotification('Edit functionality coming soon!', 'info');
}

function deleteDream(dreamId) {
    dreamJournal.deleteDream(dreamId);
}

function resetForm() {
    dreamJournal.resetForm();
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.dreamJournal = new DreamJournal();
});