/**
 * Community JavaScript
 * Handles community functionality including posts, comments, and interactions
 */

class CommunityManager {
    constructor() {
        this.currentPage = 1;
        this.currentFilters = {};
        this.posts = [];
        this.categories = [];
        
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

        // Load initial data
        await this.loadCategories();
        await this.loadPosts();
        await this.loadCommunityStats();

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
        // Filter and sort handlers
        document.getElementById('sortBy').addEventListener('change', (e) => {
            this.currentFilters.sort = e.target.value;
            this.loadPosts();
        });

        document.getElementById('filterCategory').addEventListener('change', (e) => {
            this.currentFilters.category = e.target.value;
            this.loadPosts();
        });

        document.getElementById('filterType').addEventListener('change', (e) => {
            this.currentFilters.type = e.target.value;
            this.loadPosts();
        });

        // Search with debounce
        let searchTimeout;
        document.getElementById('searchInput').addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                this.currentFilters.q = e.target.value;
                this.loadPosts();
            }, 500);
        });

        // Create post form
        document.getElementById('createPostForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.createPost();
        });

        // Modal backdrop clicks
        document.getElementById('createPostModal').addEventListener('click', (e) => {
            if (e.target.id === 'createPostModal') {
                this.closeCreatePostModal();
            }
        });

        document.getElementById('postModal').addEventListener('click', (e) => {
            if (e.target.id === 'postModal') {
                this.closePostModal();
            }
        });
    }

    async loadCategories() {
        try {
            const response = await authManager.apiRequest('/community/meta/categories');
            this.categories = response.categories;
            
            // Populate category selects
            const categorySelects = [
                document.getElementById('filterCategory'),
                document.getElementById('postCategorySelect')
            ];

            categorySelects.forEach(select => {
                // Clear existing options (except first one for filter)
                if (select.id === 'filterCategory') {
                    select.innerHTML = '<option value="">All Categories</option>';
                } else {
                    select.innerHTML = '<option value="">Select category</option>';
                }

                this.categories.forEach(category => {
                    const option = document.createElement('option');
                    option.value = category;
                    option.textContent = category;
                    select.appendChild(option);
                });
            });

            // Update sidebar categories
            this.updateCategoriesList();
        } catch (error) {
            console.error('Failed to load categories:', error);
        }
    }

    updateCategoriesList() {
        const categoriesList = document.getElementById('categoriesList');
        categoriesList.innerHTML = this.categories.map(category => `
            <div class="flex justify-between items-center py-1 cursor-pointer hover:text-purple-400 transition-colors"
                 onclick="filterByCategory('${category}')">
                <span class="text-sm">${category}</span>
                <i class="fas fa-chevron-right text-xs"></i>
            </div>
        `).join('');
    }

    async loadPosts() {
        const postsFeed = document.getElementById('postsFeed');
        const emptyState = document.getElementById('emptyState');
        const loading = postsFeed.querySelector('.loading');

        loading.style.display = 'block';
        emptyState.style.display = 'none';

        try {
            const params = new URLSearchParams({
                page: this.currentPage,
                limit: 10,
                ...this.currentFilters
            });

            const response = await authManager.apiRequest(`/community?${params}`);
            this.posts = response.posts;

            if (this.posts.length === 0) {
                loading.style.display = 'none';
                emptyState.style.display = 'block';
            } else {
                this.renderPosts();
                loading.style.display = 'none';
            }
        } catch (error) {
            console.error('Failed to load posts:', error);
            loading.style.display = 'none';
            showNotification('Failed to load posts', 'error');
        }
    }

    renderPosts() {
        const postsFeed = document.getElementById('postsFeed');
        postsFeed.innerHTML = '';

        this.posts.forEach(post => {
            const postElement = this.createPostElement(post);
            postsFeed.appendChild(postElement);
        });
    }

    createPostElement(post) {
        const div = document.createElement('div');
        div.className = 'post-card cursor-pointer';
        div.onclick = () => this.openPostModal(post);

        const createdDate = new Date(post.createdAt).toLocaleDateString();
        const timeAgo = this.getTimeAgo(new Date(post.createdAt));

        div.innerHTML = `
            <div class="flex justify-between items-start mb-3">
                <div class="flex items-center space-x-3">
                    <div class="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                        <span class="text-sm font-semibold">${post.author.username.charAt(0).toUpperCase()}</span>
                    </div>
                    <div>
                        <div class="font-medium">${post.author.profile?.displayName || post.author.username}</div>
                        <div class="text-sm text-gray-400">${timeAgo}</div>
                    </div>
                </div>
                <div class="flex items-center space-x-2">
                    <span class="type-badge type-${post.type}">${post.type}</span>
                    <span class="category-tag">${post.category}</span>
                </div>
            </div>
            
            <h3 class="text-lg font-semibold mb-2">${post.title}</h3>
            <p class="text-gray-300 mb-3 line-clamp-3">${post.content.substring(0, 200)}${post.content.length > 200 ? '...' : ''}</p>
            
            <div class="flex justify-between items-center">
                <div class="flex flex-wrap">
                    ${post.tags.map(tag => `<span class="category-tag">${tag}</span>`).join('')}
                </div>
                <div class="flex items-center space-x-4 text-sm text-gray-400">
                    <span><i class="fas fa-eye mr-1"></i>${post.views}</span>
                    <span><i class="fas fa-heart mr-1"></i>${post.likeCount}</span>
                    <span><i class="fas fa-comment mr-1"></i>${post.commentCount}</span>
                </div>
            </div>
        `;

        return div;
    }

    async createPost() {
        const form = document.getElementById('createPostForm');
        const formData = new FormData(form);
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;

        try {
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Posting...';
            submitBtn.disabled = true;

            const postData = {
                title: formData.get('title'),
                content: formData.get('content'),
                type: formData.get('type'),
                category: formData.get('category'),
                tags: formData.get('tags') ? formData.get('tags').split(',').map(tag => tag.trim()) : [],
                spiritualPerspective: formData.get('spiritualPerspective') || ''
            };

            const response = await authManager.apiRequest('/community', {
                method: 'POST',
                body: JSON.stringify(postData)
            });

            showNotification('Post created successfully!', 'success');
            form.reset();
            this.closeCreatePostModal();
            
            // Reload posts
            await this.loadPosts();
            await this.loadCommunityStats();

        } catch (error) {
            console.error('Failed to create post:', error);
            showNotification(error.message || 'Failed to create post', 'error');
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }

    async loadCommunityStats() {
        try {
            // This would be a real API call in production
            // For now, we'll use mock data
            const stats = {
                totalPosts: Math.floor(Math.random() * 1000) + 500,
                activeMembers: Math.floor(Math.random() * 200) + 100,
                totalComments: Math.floor(Math.random() * 5000) + 2000,
                todaysPosts: Math.floor(Math.random() * 20) + 5
            };

            document.getElementById('totalPosts').textContent = stats.totalPosts;
            document.getElementById('activeMembers').textContent = stats.activeMembers;
            document.getElementById('totalComments').textContent = stats.totalComments;
            document.getElementById('todaysPosts').textContent = stats.todaysPosts;
        } catch (error) {
            console.error('Failed to load community stats:', error);
        }
    }

    async openPostModal(post) {
        const modal = document.getElementById('postModal');
        const modalTitle = document.getElementById('postModalTitle');
        const modalContent = document.getElementById('postModalContent');

        modalTitle.textContent = post.title;
        
        const createdDate = new Date(post.createdAt).toLocaleDateString();
        const timeAgo = this.getTimeAgo(new Date(post.createdAt));

        modalContent.innerHTML = `
            <div class="space-y-6">
                <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-3">
                        <div class="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                            <span class="font-semibold">${post.author.username.charAt(0).toUpperCase()}</span>
                        </div>
                        <div>
                            <div class="font-medium">${post.author.profile?.displayName || post.author.username}</div>
                            <div class="text-sm text-gray-400">${timeAgo} • ${createdDate}</div>
                        </div>
                    </div>
                    <div class="flex items-center space-x-2">
                        <span class="type-badge type-${post.type}">${post.type}</span>
                        <span class="category-tag">${post.category}</span>
                    </div>
                </div>
                
                <div>
                    <p class="text-gray-300 leading-relaxed whitespace-pre-wrap">${post.content}</p>
                </div>
                
                ${post.tags.length > 0 ? `
                    <div>
                        <h4 class="font-semibold mb-2">Tags</h4>
                        <div class="flex flex-wrap">
                            ${post.tags.map(tag => `<span class="category-tag">${tag}</span>`).join('')}
                        </div>
                    </div>
                ` : ''}
                
                ${post.spiritualPerspective ? `
                    <div>
                        <h4 class="font-semibold mb-2">Spiritual Perspective</h4>
                        <p class="text-purple-400">${post.spiritualPerspective}</p>
                    </div>
                ` : ''}
                
                <div class="flex items-center justify-between pt-4 border-t border-white/10">
                    <div class="flex items-center space-x-6">
                        <button class="flex items-center space-x-2 text-gray-400 hover:text-red-400 transition-colors" 
                                onclick="toggleLike('${post._id}')">
                            <i class="fas fa-heart ${post.isLiked ? 'text-red-400' : ''}"></i>
                            <span>${post.likeCount}</span>
                        </button>
                        <span class="flex items-center space-x-2 text-gray-400">
                            <i class="fas fa-comment"></i>
                            <span>${post.commentCount}</span>
                        </span>
                        <span class="flex items-center space-x-2 text-gray-400">
                            <i class="fas fa-eye"></i>
                            <span>${post.views}</span>
                        </span>
                    </div>
                    
                    ${authManager.getCurrentUser()._id === post.author._id ? `
                        <div class="flex space-x-2">
                            <button class="btn-secondary text-blue-400" onclick="editPost('${post._id}')">
                                <i class="fas fa-edit mr-1"></i>Edit
                            </button>
                            <button class="btn-secondary text-red-400" onclick="deletePost('${post._id}')">
                                <i class="fas fa-trash mr-1"></i>Delete
                            </button>
                        </div>
                    ` : ''}
                </div>
                
                <!-- Comments Section -->
                <div class="border-t border-white/10 pt-6">
                    <h4 class="font-semibold mb-4">Comments (${post.commentCount})</h4>
                    
                    <!-- Add Comment Form -->
                    <div class="mb-6">
                        <textarea id="commentInput" placeholder="Share your thoughts..." 
                                  class="form-input min-h-[80px] mb-3"></textarea>
                        <button onclick="addComment('${post._id}')" class="btn-primary">
                            <i class="fas fa-paper-plane mr-2"></i>
                            Comment
                        </button>
                    </div>
                    
                    <!-- Comments List -->
                    <div id="commentsList" class="space-y-4">
                        ${post.comments.map(comment => this.createCommentHTML(comment)).join('')}
                    </div>
                </div>
            </div>
        `;

        modal.classList.add('active');
    }

    createCommentHTML(comment) {
        const timeAgo = this.getTimeAgo(new Date(comment.createdAt));
        
        return `
            <div class="bg-white/5 rounded-lg p-4">
                <div class="flex items-center space-x-3 mb-2">
                    <div class="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
                        <span class="text-sm font-semibold">${comment.author.username.charAt(0).toUpperCase()}</span>
                    </div>
                    <div>
                        <div class="font-medium text-sm">${comment.author.profile?.displayName || comment.author.username}</div>
                        <div class="text-xs text-gray-400">${timeAgo}</div>
                    </div>
                </div>
                <p class="text-gray-300 text-sm">${comment.content}</p>
            </div>
        `;
    }

    openCreatePostModal() {
        document.getElementById('createPostModal').classList.add('active');
    }

    closeCreatePostModal() {
        document.getElementById('createPostModal').classList.remove('active');
    }

    closePostModal() {
        document.getElementById('postModal').classList.remove('active');
    }

    getTimeAgo(date) {
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);
        
        if (diffInSeconds < 60) return 'just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
        if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
        
        return date.toLocaleDateString();
    }

    filterByCategory(category) {
        document.getElementById('filterCategory').value = category;
        this.currentFilters.category = category;
        this.loadPosts();
    }

    filterByType(type) {
        document.getElementById('filterType').value = type;
        this.currentFilters.type = type;
        this.loadPosts();
    }
}

// Global functions for modal actions
function openCreatePostModal() {
    communityManager.openCreatePostModal();
}

function closeCreatePostModal() {
    communityManager.closeCreatePostModal();
}

function closePostModal() {
    communityManager.closePostModal();
}

function filterByCategory(category) {
    communityManager.filterByCategory(category);
}

function filterByType(type) {
    communityManager.filterByType(type);
}

function toggleLike(postId) {
    // TODO: Implement like functionality
    showNotification('Like functionality coming soon!', 'info');
}

function addComment(postId) {
    // TODO: Implement comment functionality
    showNotification('Comment functionality coming soon!', 'info');
}

function editPost(postId) {
    // TODO: Implement edit functionality
    showNotification('Edit functionality coming soon!', 'info');
}

function deletePost(postId) {
    // TODO: Implement delete functionality
    showNotification('Delete functionality coming soon!', 'info');
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.communityManager = new CommunityManager();
});