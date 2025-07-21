Docker 部署 DreamWise 网站详细指南

既然你已经在服务器上使用 Docker 部署了多个网站，那么使用 Docker 部署 DreamWise 确实是一个合理的选择，可以保持管理的一致性。下面我将提供一个详细的、手把手的部署指南，即使你不熟悉服务器和 Docker 技术也能顺利完成。



完整部署步骤

步骤 1: 准备本地项目文件

首先，我们需要在本地准备好项目文件，并创建必要的 Docker 配置文件。



创建 Dockerfile



在项目根目录创建一个名为 Dockerfile 的文件（注意没有扩展名）：



# 在项目根目录执行

touch Dockerfile

使用文本编辑器打开 Dockerfile，添加以下内容：



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

创建 Nginx 配置文件



在项目根目录创建一个名为 nginx.conf 的文件：



touch nginx.conf

添加以下内容：



server {

    listen 80;

    server_name localhost;

    root /usr/share/nginx/html;

    index index.html;

    

    # 启用 gzip 压缩

    gzip on;

    gzip_types text/plain text/css application/javascript image/svg+xml;

    

    location / {

        try_files $uri $uri/ /index.html;

    }

    

    # 设置缓存控制

    location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {

        expires 30d;

    }

    

    # 安全设置

    add_header X-Content-Type-Options nosniff;

    add_header X-Frame-Options SAMEORIGIN;

    add_header X-XSS-Protection "1; mode=block";

}

创建 .dockerignore 文件



创建一个 .dockerignore 文件来排除不需要的文件：



touch .dockerignore

添加以下内容：



.git

.gitignore

node_modules

Dockerfile

.dockerignore

*.md

*.zip

检查并移除本地环境引用



确保项目中没有硬编码的本地环境引用（如 localhost 或 127.0.0.1）：



grep -r "localhost" .

grep -r "127.0.0.1" .

如果找到任何引用，请将它们替换为相对路径或适当的占位符。



创建 docker-compose.yml 文件



为了简化部署和管理，创建一个 docker-compose.yml 文件：



touch docker-compose.yml

添加以下内容：



version: '3'



services:

  dreamwise:

    build: .

    container_name: dreamwise-web

    restart: always

    ports:

      - "8100:80"  # 将容器的 80 端口映射到主机的 8100 端口，可以根据需要更改

    volumes:

      - ./logs:/var/log/nginx  # 将 Nginx 日志映射到本地目录

步骤 2: 打包项目文件

将所有项目文件（包括新创建的 Docker 配置文件）打包成一个 ZIP 文件：



zip -r dreamwise.zip . -x "*.git*" -x "node_modules/*" -x "*.DS_Store"

步骤 3: 上传到服务器

使用 SCP 上传文件



scp dreamwise.zip root@your-racknerd-server-ip:/root/

替换 your-racknerd-server-ip 为你的服务器 IP 地址。系统会提示你输入密码。



如果你使用的是 Windows，可以使用 WinSCP 或其他 SFTP 客户端上传文件。



步骤 4: 连接到服务器

使用 SSH 连接到你的服务器：



ssh root@your-racknerd-server-ip

输入密码后，你将登录到服务器。



步骤 5: 在服务器上准备项目

创建项目目录



mkdir -p /opt/dreamwise

解压项目文件



unzip /root/dreamwise.zip -d /opt/dreamwise

cd /opt/dreamwise

步骤 6: 使用 Docker Compose 构建和启动容器

确保 Docker 和 Docker Compose 已安装



检查 Docker 是否已安装：



docker --version

检查 Docker Compose 是否已安装：



docker-compose --version

如果没有安装 Docker Compose，可以使用以下命令安装：



apt update

apt install docker-compose -y

构建和启动 Docker 容器



cd /opt/dreamwise

docker-compose up -d --build

-d 参数表示在后台运行容器，--build 参数表示先构建镜像再启动容器。



检查容器是否正常运行



docker ps

你应该能看到一个名为 dreamwise-web 的容器正在运行。



步骤 7: 测试网站

使用 curl 测试网站是否可访问



curl [http://localhost:8100](http://localhost:8100)

如果返回 HTML 内容，说明网站已经成功部署。



从外部访问网站



在浏览器中输入 [http://your-server-ip:8100](http://your-server-ip:8100) 来访问网站。



步骤 8: 配置反向代理（可选）

如果你想使用域名访问网站，或者已经有其他网站在运行，可以配置 Nginx 反向代理：



安装 Nginx（如果尚未安装）



apt update

apt install nginx -y

创建 Nginx 配置文件



nano /etc/nginx/sites-available/dreamwise

添加以下内容：



server {

    listen 80;

    server_name dreamwise.yourdomain.com;  # 替换为你的域名

    

    location / {

        proxy_pass http://localhost:8100;

        proxy_set_header Host $host;

        proxy_set_header X-Real-IP $remote_addr;

        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;

        proxy_set_header X-Forwarded-Proto $scheme;

    }

}

启用站点配置



ln -s /etc/nginx/sites-available/dreamwise /etc/nginx/sites-enabled/

nginx -t

systemctl reload nginx

配置 SSL（强烈推荐）



apt install certbot python3-certbot-nginx -y

certbot --nginx -d dreamwise.yourdomain.com

按照提示完成 SSL 证书的配置。



步骤 9: 设置自动更新和备份

创建备份脚本



mkdir -p /opt/scripts

nano /opt/scripts/backup-dreamwise.sh

添加以下内容：



#!/bin/bash



# 创建备份目录

mkdir -p /opt/backups/dreamwise



# 备份日期

DATE=$(date +%Y%m%d-%H%M%S)



# 备份网站文件

tar -czf /opt/backups/dreamwise/dreamwise-$DATE.tar.gz -C /opt/dreamwise .



# 保留最近 7 个备份

ls -t /opt/backups/dreamwise/dreamwise-*.tar.gz | tail -n +8 | xargs rm -f

设置执行权限：



chmod +x /opt/scripts/backup-dreamwise.sh

设置定时任务



crontab -e

添加以下内容（每周日凌晨 2 点执行备份）：



0 2 * * 0 /opt/scripts/backup-dreamwise.sh > /var/log/backup-dreamwise.log 2>&1

步骤 10: 更新网站的流程

当你需要更新网站内容时，可以按照以下步骤操作：



在本地更新项目文件



打包更新后的文件



zip -r dreamwise-update.zip . -x "*.git*" -x "node_modules/*" -x "*.DS_Store"

上传到服务器



scp dreamwise-update.zip root@your-server-ip:/root/

在服务器上应用更新



# 备份当前版本

cd /opt/dreamwise

docker-compose down

tar -czf /opt/backups/dreamwise/pre-update-$(date +%Y%m%d-%H%M%S).tar.gz .



# 解压新版本

rm -rf /opt/dreamwise/*

unzip /root/dreamwise-update.zip -d /opt/dreamwise



# 重新构建和启动容器

cd /opt/dreamwise

docker-compose up -d --build

验证更新



curl [http://localhost:8100](http://localhost:8100)

常见问题解决

问题 1: 容器无法启动

检查 Docker 日志：



docker logs dreamwise-web

问题 2: 网站无法访问

检查端口是否正确映射：



docker-compose ps

检查防火墙是否允许该端口：



ufw status

如果端口被阻止，允许该端口：



ufw allow 8100

问题 3: 网站显示不正确

检查 Nginx 配置和日志：



docker exec -it dreamwise-web cat /var/log/nginx/error.log

问题 4: SSL 证书问题

重新运行 Certbot：



certbot --nginx -d dreamwise.yourdomain.com

管理命令速查表

以下是一些常用的 Docker 管理命令：



查看所有容器：docker ps -a

启动容器：docker-compose -f /opt/dreamwise/docker-compose.yml up -d

停止容器：docker-compose -f /opt/dreamwise/docker-compose.yml down

重启容器：docker-compose -f /opt/dreamwise/docker-compose.yml restart

查看容器日志：docker logs dreamwise-web

进入容器：docker exec -it dreamwise-web /bin/sh

总结

通过以上步骤，你已经成功地将 DreamWise 网站部署到了 Docker 容器中，并配置了必要的安全措施和自动备份。这种部署方式与你现有的其他 Docker 容器保持一致，便于统一管理。



如果在部署过程中遇到任何问题，可以查看相关日志文件或容器状态来进行故障排除。定期备份也确保了你的网站数据安全。





