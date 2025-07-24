/**
 * 透明玻璃风格通知系统
 * 显示在页面中央，5秒后自动消失
 */

class GlassNotification {
    constructor() {
        this.notifications = [];
        this.container = null;
        this.init();
    }

    init() {
        // 创建通知容器
        this.container = document.createElement('div');
        this.container.id = 'glass-notification-container';
        this.container.className = 'fixed top-24 left-1/2 transform -translate-x-1/2 pointer-events-none z-[9999] w-full max-w-md px-4';
        document.body.appendChild(this.container);
    }

    show(message, type = 'info', duration = 5000) {
        const notification = this.createNotification(message, type);
        this.container.appendChild(notification);
        this.notifications.push(notification);

        // 只对通知本身启用指针事件，不影响页面其他元素
        notification.style.pointerEvents = 'auto';

        // 动画显示
        setTimeout(() => {
            notification.classList.remove('opacity-0', 'scale-95', 'translate-y-4');
            notification.classList.add('opacity-100', 'scale-100', 'translate-y-0');
        }, 10);

        // 自动消失
        setTimeout(() => {
            this.hide(notification);
        }, duration);

        return notification;
    }

    createNotification(message, type) {
        const notification = document.createElement('div');
        
        // 基础样式
        notification.className = `
            glass-notification
            relative
            w-full
            p-6
            rounded-2xl
            shadow-2xl
            backdrop-blur-xl
            border
            transform
            transition-all
            duration-300
            ease-out
            opacity-0
            scale-95
            translate-y-4
            pointer-events-auto
            mb-4
        `;

        // 根据类型设置颜色
        const typeStyles = {
            success: {
                bg: 'bg-green-500/20',
                border: 'border-green-400/30',
                icon: 'fas fa-check-circle',
                iconColor: 'text-green-400',
                textColor: 'text-green-100'
            },
            error: {
                bg: 'bg-red-500/20',
                border: 'border-red-400/30',
                icon: 'fas fa-exclamation-circle',
                iconColor: 'text-red-400',
                textColor: 'text-red-100'
            },
            warning: {
                bg: 'bg-yellow-500/20',
                border: 'border-yellow-400/30',
                icon: 'fas fa-exclamation-triangle',
                iconColor: 'text-yellow-400',
                textColor: 'text-yellow-100'
            },
            info: {
                bg: 'bg-blue-500/20',
                border: 'border-blue-400/30',
                icon: 'fas fa-info-circle',
                iconColor: 'text-blue-400',
                textColor: 'text-blue-100'
            }
        };

        const style = typeStyles[type] || typeStyles.info;
        notification.classList.add(style.bg, style.border);

        notification.innerHTML = `
            <div class="flex items-start space-x-4">
                <div class="flex-shrink-0">
                    <i class="${style.icon} ${style.iconColor} text-xl"></i>
                </div>
                <div class="flex-1 min-w-0">
                    <p class="${style.textColor} text-sm font-medium leading-relaxed">
                        ${message}
                    </p>
                </div>
                <button class="flex-shrink-0 ml-4 text-white/60 hover:text-white/90 transition-colors duration-200" onclick="glassNotification.hide(this.closest('.glass-notification'))">
                    <i class="fas fa-times text-sm"></i>
                </button>
            </div>
            
            <!-- 进度条 -->
            <div class="absolute bottom-0 left-0 right-0 h-1 bg-white/10 rounded-b-2xl overflow-hidden">
                <div class="progress-bar h-full ${style.iconColor.replace('text-', 'bg-')} transition-all duration-[5000ms] ease-linear w-full"></div>
            </div>
        `;

        // 启动进度条动画
        setTimeout(() => {
            const progressBar = notification.querySelector('.progress-bar');
            if (progressBar) {
                progressBar.style.width = '0%';
            }
        }, 100);

        return notification;
    }

    hide(notification) {
        if (!notification || !notification.parentElement) return;

        // 动画隐藏
        notification.classList.remove('opacity-100', 'scale-100', 'translate-y-0');
        notification.classList.add('opacity-0', 'scale-95', 'translate-y-4');

        // 移除元素
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
            
            // 移除数组中的引用
            const index = this.notifications.indexOf(notification);
            if (index > -1) {
                this.notifications.splice(index, 1);
            }

            // 容器始终保持pointer-events-none，只有通知本身可以点击
        }, 300);
    }

    // 清除所有通知
    clearAll() {
        this.notifications.forEach(notification => {
            this.hide(notification);
        });
    }
}

// 创建全局实例
const glassNotification = new GlassNotification();

// 全局函数，方便调用
function showNotification(message, type = 'info', duration = 5000) {
    return glassNotification.show(message, type, duration);
}

// 导出以便其他模块使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { GlassNotification, showNotification };
}