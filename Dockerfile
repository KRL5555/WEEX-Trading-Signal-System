# WEEX Trading Signal System - Docker 部署

FROM python:3.10-slim

WORKDIR /app

# 安装系统依赖
RUN apt-get update && apt-get install -y \
    curl \
    git \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# 安装Node.js
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs

# 克隆项目
RUN git clone https://github.com/KRL5555/WEEX-Trading-Signal-System.git .

# 安装后端依赖
WORKDIR /app/backend
RUN pip install --no-cache-dir -r requirements.txt

# 安装前端依赖
WORKDIR /app/frontend
RUN npm install

# 暴露端口
EXPOSE 8000 3000

# 启动脚本
WORKDIR /app
COPY docker-entrypoint.sh .
RUN chmod +x docker-entrypoint.sh

ENTRYPOINT ["./docker-entrypoint.sh"]
