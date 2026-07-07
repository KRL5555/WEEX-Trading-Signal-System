#!/bin/bash

# WEEX Trading Signal System - macOS/Linux 安装脚本

INSTALL_DIR="$HOME/WEEX-Trading-Signal-System"

echo ""
echo "========================================"
echo "  WEEX Trading Signal System"
echo "  macOS/Linux 一键安装向导"
echo "========================================"
echo ""

# 检查Python
echo "[步骤 1/5] 检查Python..."
if ! command -v python3 &> /dev/null; then
    echo "❌ Python未安装"
    echo "请先安装Python 3.10+"
    exit 1
else
    echo "✅ Python已安装"
    python3 --version
fi
echo ""

# 检查Node.js
echo "[步骤 2/5] 检查Node.js..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js未安装"
    echo "请先安装Node.js"
    exit 1
else
    echo "✅ Node.js已安装"
    node --version
fi
echo ""

# 检查Git
echo "[步骤 3/5] 检查Git..."
if ! command -v git &> /dev/null; then
    echo "❌ Git未安装"
    exit 1
else
    echo "✅ Git已安装"
    git --version
fi
echo ""

# 克隆项目
echo "[步骤 4/5] 克隆项目代码..."
if [ -d "$INSTALL_DIR" ]; then
    echo "📂 项目已存在: $INSTALL_DIR"
else
    echo "⏳ 克隆项目中..."
    git clone https://github.com/KRL5555/WEEX-Trading-Signal-System.git "$INSTALL_DIR"
    echo "✅ 项目克隆完成"
fi
echo ""

# 安装依赖
echo "[步骤 5/5] 安装项目依赖..."
cd "$INSTALL_DIR/backend"

echo "⏳ 创建Python虚拟环境..."
python3 -m venv venv
source venv/bin/activate

echo "⏳ 安装Python依赖..."
pip install --upgrade pip
pip install -r requirements.txt

echo "⏳ 复制环境配置文件..."
if [ ! -f .env ]; then
    cp .env.example .env
    echo "✅ 已生成 .env 配置文件"
fi

cd "$INSTALL_DIR/frontend"
echo "⏳ 安装前端依赖..."
npm install

echo ""
echo "========================================"
echo "  ✅ 安装完成！"
echo "========================================"
echo ""
echo "📂 安装位置: $INSTALL_DIR"
echo ""
echo "🚀 启动应用:"
echo "   后端: cd $INSTALL_DIR/backend && source venv/bin/activate && python main.py"
echo "   前端: cd $INSTALL_DIR/frontend && npm start"
echo ""
echo "🌐 访问地址:"
echo "   - 前端: http://localhost:3000"
echo "   - 后端API: http://localhost:8000"
echo ""
