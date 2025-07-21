FROM nginx:alpine

# 复制网站文件到 Nginx 默认目录
COPY . /usr/share/nginx/html

# 删除默认的 Nginx 配置
RUN rm /etc/nginx/conf.d/default.conf

# 复制自定义 Nginx 配置
COPY nginx.conf /etc/nginx/conf.d/

# 暴露 80 端口
EXPOSE 80

# 启动 Nginx
CMD ["nginx", "-g", "daemon off;"]
