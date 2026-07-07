#!/bin/bash

# Docker 启动脚本

echo "Starting WEEX Trading Signal System..."

# 启动后端
echo "Starting backend on port 8000..."
cd /app/backend
python main.py &

# 启动前端
echo "Starting frontend on port 3000..."
cd /app/frontend
npm start &

# 保持容器运行
wait
