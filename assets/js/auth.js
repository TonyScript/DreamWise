/**
 * DreamWise Authentication System
 * Handles user authentication, token management, and API communication
 */

class AuthManager {
    constructor() {
        // 动态获取当前域名和端口，适应不同环境
        const currentHost = window.location.hostname;
        // 后端API地址，如果是本地开发环境，使用localhost:3000
        this.baseURL = (currentHost === 'localhost' || currentHost === '127.0.0.1') 
            ? 'http://localhost:3000/api' 
            : `${window.location.protocol}//${currentHost}:3000/api`;
        
        console.log('API Base URL:', this.baseURL);
        this.token = localStorage.getItem('dreamwise_token');
        this.user = null;
        this.isInitialized = false;
        this.serverAvailable = false;
        
        // Initialize on page load
        this.init();
    }

    async init() {
        // Check if server is available
        try {
            await this.checkServerHealth();
            this.serverAvailable = true;
            
            if (this.token) {
                try {
                    await this.verifyToken();
                } catch (error) {
                    console.error('Token verification failed:', error);
                    this.logout();
                }
            }
        } catch (error) {
            console.warn('Backend server not available. Running in demo mode.');
            this.serverAvailable = false;
        }
        
        this.isInitialized = true;
        this.updateUI();
        
        // 监听头像更新
        this.setupAvatarUpdateListener();
    }

    // Check server health
    async checkServerHealth() {
        try {
            const response = await fetch(`${this.baseURL}/health`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                mode: 'cors' // 明确指定使用CORS
            });
            
            if (!response.ok) {
                console.error('Health check failed:', response.status, response.statusText);
                throw new Error('Server not available');
            }
            
            return response.json();
        } catch (error) {
            console.error('Health check error:', error);
            throw error;
        }
    }

    // API request helper with authentication
    async apiRequest(endpoint, options = {}) {
        // If server is not available, return demo data or show error
        if (!this.serverAvailable) {
            if (endpoint === '/auth/login' || endpoint === '/auth/register') {
                showNotification('Backend server is not running. Please start the server first.', 'error');
                throw new Error('Backend server not available');
            }
            // Return demo data for other endpoints
            return this.getDemoData(endpoint);
        }

        const url = `${this.baseURL}${endpoint}`;
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        };

        if (this.token) {
            config.headers.Authorization = `Bearer ${this.token}`;
        }

        try {
            const response = await fetch(url, config);
            
            // Handle network errors
            if (!response) {
                throw new Error('Network error - please check if the server is running');
            }
            
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || `Request failed with status ${response.status}`);
            }

            return data;
        } catch (error) {
            console.error('API request failed:', error);
            
            // Provide more helpful error messages
            if (error.name === 'TypeError' && error.message.includes('fetch')) {
                throw new Error('Cannot connect to server. Please make sure the backend server is running on http://localhost:3000');
            }
            
            throw error;
        }
    }

    // Demo data for when server is not available
    getDemoData(endpoint) {
        const demoData = {
            '/journal/my-dreams': { dreams: [], pagination: { page: 1, total: 0 } },
            '/journal/stats/overview': { 
                stats: { 
                    totalDreams: 0, 
                    avgLucidity: 0, 
                    avgVividness: 0, 
                    mostCommonMood: null,
                    topCategories: []
                } 
            },
            '/community': { posts: [], pagination: { page: 1, total: 0 } },
            '/community/meta/categories': { 
                categories: [
                    'General Discussion', 'Dream Interpretation', 'Spiritual Perspectives',
                    'Lucid Dreaming', 'Nightmares', 'Recurring Dreams'
                ] 
            }
        };
        
        return Promise.resolve(demoData[endpoint] || {});
    }

    // Send registration verification code
    async sendRegistrationCode(email, username) {
        try {
            const response = await this.apiRequest('/auth/send-registration-code', {
                method: 'POST',
                body: JSON.stringify({ email, username })
            });
            return response;
        } catch (error) {
            throw error;
        }
    }

    // Register new user with verification code
    async register(userData) {
        try {
            const response = await this.apiRequest('/auth/register', {
                method: 'POST',
                body: JSON.stringify(userData)
            });

            this.setAuthData(response.token, response.user);
            return response;
        } catch (error) {
            throw error;
        }
    }

    // Login user
    async login(credentials) {
        try {
            const response = await this.apiRequest('/auth/login', {
                method: 'POST',
                body: JSON.stringify(credentials)
            });

            this.setAuthData(response.token, response.user);
            return response;
        } catch (error) {
            throw error;
        }
    }

    // Logout user
    async logout() {
        try {
            if (this.token) {
                await this.apiRequest('/auth/logout', {
                    method: 'POST'
                });
            }
        } catch (error) {
            console.error('Logout request failed:', error);
        } finally {
            this.clearAuthData();
        }
    }

    // Verify token validity with improved error handling
    async verifyToken() {
        try {
            const response = await this.apiRequest('/auth/verify');
            this.user = response.user;
            return response;
        } catch (error) {
            console.warn('Token verification failed:', error.message);
            
            // Only clear auth data if it's a definitive authentication failure
            // Don't clear on network errors or server unavailability
            if (error.message.includes('Invalid token') || 
                error.message.includes('Token expired') ||
                error.message.includes('Unauthorized')) {
                this.clearAuthData();
            }
            
            throw error;
        }
    }

    // Refresh token
    async refreshToken() {
        try {
            const response = await this.apiRequest('/auth/refresh', {
                method: 'POST'
            });
            this.token = response.token;
            localStorage.setItem('dreamwise_token', this.token);
            return response;
        } catch (error) {
            this.logout();
            throw error;
        }
    }

    // Set authentication data
    setAuthData(token, user) {
        this.token = token;
        this.user = user;
        localStorage.setItem('dreamwise_token', token);
        localStorage.setItem('dreamwise_user', JSON.stringify(user));
        this.updateUI();
        
        // 触发登录成功事件
        document.dispatchEvent(new CustomEvent('userLoggedIn', {
            detail: { user, token }
        }));
    }

    // Clear authentication data
    clearAuthData() {
        this.token = null;
        this.user = null;
        localStorage.removeItem('dreamwise_token');
        localStorage.removeItem('dreamwise_user');
        this.updateUI();
        
        // 触发登出事件
        document.dispatchEvent(new CustomEvent('userLoggedOut'));
    }

    // Check if user is authenticated
    isAuthenticated() {
        return !!this.token && !!this.user;
    }

    // Get current user
    getCurrentUser() {
        return this.user;
    }

    // Update UI based on authentication state
    updateUI() {
        const authButtons = document.querySelectorAll('[data-auth-show]');
        const guestButtons = document.querySelectorAll('[data-guest-show]');
        const userInfo = document.querySelectorAll('[data-user-info]');

        authButtons.forEach(btn => {
            btn.style.display = this.isAuthenticated() ? 'block' : 'none';
        });

        guestButtons.forEach(btn => {
            btn.style.display = this.isAuthenticated() ? 'none' : 'block';
        });

        if (this.user) {
            userInfo.forEach(element => {
                const field = element.dataset.userInfo;
                if (field === 'username') {
                    element.textContent = this.user.username;
                } else if (field === 'displayName') {
                    element.textContent = this.user.profile?.displayName || this.user.username;
                } else if (field === 'email') {
                    element.textContent = this.user.email;
                }
            });
            
            // 更新头像
            this.updateUserAvatar();
        }

        // Dispatch custom event for other components
        document.dispatchEvent(new CustomEvent('authStateChanged', {
            detail: {
                isAuthenticated: this.isAuthenticated(),
                user: this.user
            }
        }));
    }
    
    // 更新用户头像
    updateUserAvatar() {
        const avatarImages = document.querySelectorAll('[data-user-avatar]');
        const avatarPlaceholders = document.querySelectorAll('[data-user-avatar-placeholder]');
        const avatarImagesLarge = document.querySelectorAll('[data-user-avatar-large]');
        const avatarPlaceholdersLarge = document.querySelectorAll('[data-user-avatar-placeholder-large]');
        
        const avatarUrl = this.user?.profile?.avatar;
        
        if (avatarUrl) {
            const fullAvatarUrl = `${this.baseURL.replace('/api', '')}${avatarUrl}`;
            
            // 更新小头像
            avatarImages.forEach(img => {
                img.src = fullAvatarUrl;
                img.classList.remove('hidden');
            });
            avatarPlaceholders.forEach(placeholder => {
                placeholder.classList.add('hidden');
            });
            
            // 更新大头像
            avatarImagesLarge.forEach(img => {
                img.src = fullAvatarUrl;
                img.classList.remove('hidden');
            });
            avatarPlaceholdersLarge.forEach(placeholder => {
                placeholder.classList.add('hidden');
            });
        } else {
            // 显示占位符
            avatarImages.forEach(img => {
                img.classList.add('hidden');
            });
            avatarPlaceholders.forEach(placeholder => {
                placeholder.classList.remove('hidden');
            });
            
            avatarImagesLarge.forEach(img => {
                img.classList.add('hidden');
            });
            avatarPlaceholdersLarge.forEach(placeholder => {
                placeholder.classList.remove('hidden');
            });
        }
    }
    
    // 设置头像更新监听器
    setupAvatarUpdateListener() {
        // 监听 localStorage 变化（用于跨页面通信）
        window.addEventListener('storage', (e) => {
            if (e.key === 'user_avatar_updated') {
                console.log('检测到头像更新，重新获取用户信息...');
                // 重新获取用户信息以更新头像
                this.verifyToken().then(() => {
                    this.updateUI();
                    console.log('头像更新完成');
                }).catch(console.error);
                
                // 清除标记
                localStorage.removeItem('user_avatar_updated');
            }
        });
        
        // 监听同页面的头像更新（用于同一页面内的更新）
        const checkAvatarUpdate = () => {
            const avatarUpdated = localStorage.getItem('user_avatar_updated');
            if (avatarUpdated) {
                console.log('检测到同页面头像更新...');
                this.verifyToken().then(() => {
                    this.updateUI();
                    console.log('同页面头像更新完成');
                }).catch(console.error);
                
                localStorage.removeItem('user_avatar_updated');
            }
        };
        
        // 每秒检查一次
        setInterval(checkAvatarUpdate, 1000);
        
        // 页面获得焦点时也检查一次
        window.addEventListener('focus', checkAvatarUpdate);
    }

    // Show login modal
    showLoginModal() {
        const modal = document.getElementById('loginModal');
        if (modal) {
            modal.classList.remove('hidden');
            modal.classList.add('flex');
        }
    }

    // Show register modal
    showRegisterModal() {
        const modal = document.getElementById('registerModal');
        if (modal) {
            modal.classList.remove('hidden');
            modal.classList.add('flex');
        }
    }

    // Hide modals
    hideModals() {
        const modals = document.querySelectorAll('.auth-modal');
        modals.forEach(modal => {
            modal.classList.add('hidden');
            modal.classList.remove('flex');
        });
    }
}

// Initialize global auth manager
const authManager = new AuthManager();

// Login form handler
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const submitBtn = loginForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            
            try {
                submitBtn.textContent = 'Signing in...';
                submitBtn.disabled = true;

                const formData = new FormData(loginForm);
                const credentials = {
                    email: formData.get('email'),
                    password: formData.get('password')
                };

                await authManager.login(credentials);
                authManager.hideModals();
                
                // Show success message
                showNotification('Welcome back!', 'success');
                
            } catch (error) {
                showNotification(error.message, 'error');
            } finally {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        });
    }

    if (registerForm) {
        const step1 = document.getElementById('registerStep1');
        const step2 = document.getElementById('registerStep2');
        const sendVerificationBtn = document.getElementById('sendVerificationBtn');
        const backToStep1Btn = document.getElementById('backToStep1');
        const resendCodeBtn = document.getElementById('resendCode');
        
        let registrationData = {};

        // Step 1: Send verification code
        if (sendVerificationBtn) {
            sendVerificationBtn.addEventListener('click', async function() {
                const originalText = sendVerificationBtn.textContent;
                
                try {
                    sendVerificationBtn.textContent = 'Sending code...';
                    sendVerificationBtn.disabled = true;

                    const formData = new FormData(registerForm);
                    const username = formData.get('username');
                    const email = formData.get('email');
                    const password = formData.get('password');
                    const confirmPassword = formData.get('confirmPassword');

                    // Validate form data
                    if (!username || !email || !password || !confirmPassword) {
                        throw new Error('Please fill in all fields');
                    }

                    if (password !== confirmPassword) {
                        throw new Error('Passwords do not match');
                    }

                    if (password.length < 6) {
                        throw new Error('Password must be at least 6 characters long');
                    }

                    // Store registration data for step 2
                    registrationData = { username, email, password };

                    // Send verification code
                    await authManager.sendRegistrationCode(email, username);
                    
                    // Show step 2
                    step1.classList.add('hidden');
                    step2.classList.remove('hidden');
                    
                    showNotification('Verification code sent to your email!', 'success');
                    
                } catch (error) {
                    showNotification(error.message, 'error');
                } finally {
                    sendVerificationBtn.textContent = originalText;
                    sendVerificationBtn.disabled = false;
                }
            });
        }

        // Step 2: Complete registration
        registerForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const submitBtn = document.getElementById('completeRegistration');
            const originalText = submitBtn.textContent;
            
            try {
                submitBtn.textContent = 'Creating account...';
                submitBtn.disabled = true;

                const formData = new FormData(registerForm);
                const verificationCode = formData.get('verificationCode');

                if (!verificationCode || verificationCode.length !== 6) {
                    throw new Error('Please enter a valid 6-digit verification code');
                }

                // Complete registration with verification code
                const userData = {
                    ...registrationData,
                    verificationCode
                };

                await authManager.register(userData);
                authManager.hideModals();
                
                // Reset form
                registerForm.reset();
                step2.classList.add('hidden');
                step1.classList.remove('hidden');
                
                // Show success message
                showNotification('Account created successfully! Welcome to DreamWise!', 'success');
                
            } catch (error) {
                showNotification(error.message, 'error');
            } finally {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        });

        // Back to step 1
        if (backToStep1Btn) {
            backToStep1Btn.addEventListener('click', function() {
                step2.classList.add('hidden');
                step1.classList.remove('hidden');
            });
        }

        // Resend verification code
        if (resendCodeBtn) {
            resendCodeBtn.addEventListener('click', async function() {
                const originalText = resendCodeBtn.textContent;
                
                try {
                    resendCodeBtn.textContent = 'Sending...';
                    resendCodeBtn.disabled = true;

                    await authManager.sendRegistrationCode(registrationData.email, registrationData.username);
                    showNotification('Verification code resent!', 'success');
                    
                } catch (error) {
                    showNotification(error.message, 'error');
                } finally {
                    resendCodeBtn.textContent = originalText;
                    resendCodeBtn.disabled = false;
                }
            });
        }
    }

    // Modal close handlers
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal-backdrop')) {
            authManager.hideModals();
        }
        
        if (e.target.classList.contains('modal-close')) {
            authManager.hideModals();
        }
    });

    // Auth button handlers
    document.addEventListener('click', function(e) {
        if (e.target.matches('[data-action="login"]')) {
            e.preventDefault();
            authManager.showLoginModal();
        }
        
        if (e.target.matches('[data-action="register"]')) {
            e.preventDefault();
            authManager.showRegisterModal();
        }
        
        if (e.target.matches('[data-action="logout"]')) {
            e.preventDefault();
            authManager.logout();
            showNotification('You have been logged out', 'info');
        }
    });
});

// 保留原有的 showNotification 函数以兼容旧代码，但使用新的通知系统
function showNotification(message, type = 'info') {
    // 如果新的通知系统可用，使用它
    if (typeof glassNotification !== 'undefined') {
        return glassNotification.show(message, type);
    }
    
    // 否则使用原有的通知系统作为后备
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm transition-all duration-300 transform translate-x-full`;
    
    const colors = {
        success: 'bg-green-500 text-white',
        error: 'bg-red-500 text-white',
        warning: 'bg-yellow-500 text-black',
        info: 'bg-blue-500 text-white'
    };
    
    notification.className += ` ${colors[type] || colors.info}`;
    notification.innerHTML = `
        <div class="flex items-center justify-between">
            <span>${message}</span>
            <button class="ml-4 text-white hover:text-gray-200" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.classList.remove('translate-x-full');
    }, 100);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.classList.add('translate-x-full');
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 300);
    }, 5000);
}

// Export for use in other modules
window.authManager = authManager;
window.showNotification = showNotification;