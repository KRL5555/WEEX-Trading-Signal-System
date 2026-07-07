@echo off
chcp 65001 > nul
setlocal enabledelayedexpansion

REM WEEX Trading Signal System - Windows 10 一键安装向导
REM 作者: KRL5555
REM 系统: Windows 10/11

set INSTALL_DIR=D:\WEEX-Trading-Signal-System
set PYTHON_URL=https://www.python.org/ftp/python/3.10.13/python-3.10.13-amd64.exe
set NODEJS_URL=https://nodejs.org/dist/v18.18.0/node-v18.18.0-x64.msi
set GIT_URL=https://github.com/git-for-windows/git/releases/download/v2.42.0.windows.1/Git-2.42.0-64-bit.exe

echo.
echo ========================================
echo   WEEX Trading Signal System
echo   Windows 10 一键安装向导
echo ========================================
echo.

REM 检查管理员权限
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo ❌ 需要管理员权限！
    echo 请右键选择"以管理员身份运行"
    pause
    exit /b 1
)

echo ✅ 检测到管理员权限
echo.

REM 步骤1: 检查并安装Python
echo [步骤 1/5] 检查Python...
python --version >nul 2>&1
if %errorLevel% neq 0 (
    echo ⏳ Python未安装，开始下载...
    echo 下载地址: %PYTHON_URL%
    powershell -Command "& {(New-Object System.Net.ServicePointManager).SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; (New-Object System.Net.WebClient).DownloadFile('%PYTHON_URL%', 'python-installer.exe')}"
    echo ⏳ 安装Python中...
    python-installer.exe /quiet InstallAllUsers=1 PrependPath=1 Include_pip=1 Include_dev=1
    del python-installer.exe
    echo ✅ Python安装完成
) else (
    echo ✅ Python已安装
    python --version
)
echo.

REM 步骤2: 检查并安装Node.js
echo [步骤 2/5] 检查Node.js...
node --version >nul 2>&1
if %errorLevel% neq 0 (
    echo ⏳ Node.js未安装，开始下载...
    powershell -Command "& {(New-Object System.Net.ServicePointManager).SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; (New-Object System.Net.WebClient).DownloadFile('%NODEJS_URL%', 'nodejs-installer.msi')}"
    echo ⏳ 安装Node.js中...
    msiexec /i nodejs-installer.msi /quiet
    del nodejs-installer.msi
    echo ✅ Node.js安装完成
) else (
    echo ✅ Node.js已安装
    node --version
)
echo.

REM 步骤3: 检查并安装Git
echo [步骤 3/5] 检查Git...
git --version >nul 2>&1
if %errorLevel% neq 0 (
    echo ⏳ Git未安装，开始下载...
    powershell -Command "& {(New-Object System.Net.ServicePointManager).SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; (New-Object System.Net.WebClient).DownloadFile('%GIT_URL%', 'git-installer.exe')}"
    echo ⏳ 安装Git中...
    git-installer.exe /VERYSILENT /NORESTART
    del git-installer.exe
    echo ✅ Git安装完成
) else (
    echo ✅ Git已安装
    git --version
)
echo.

REM 步骤4: 克隆项目
echo [步骤 4/5] 克隆项目代码...
if exist "%INSTALL_DIR%" (
    echo 📂 项目已存在: %INSTALL_DIR%
) else (
    echo ⏳ 克隆项目中...
    git clone https://github.com/KRL5555/WEEX-Trading-Signal-System.git "%INSTALL_DIR%"
    echo ✅ 项目克隆完成
)
echo.

REM 步骤5: 安装依赖
echo [步骤 5/5] 安装项目依赖...
cd /d "%INSTALL_DIR%\backend"

echo ⏳ 创建Python虚拟环境...
python -m venv venv
call venv\Scripts\activate.bat

echo ⏳ 安装Python依赖...
pip install --upgrade pip
pip install -r requirements.txt

echo ⏳ 复制环境配置文件...
if not exist .env (
    copy .env.example .env
    echo ✅ 已生成 .env 配置文件
)

cd /d "%INSTALL_DIR%\frontend"
echo ⏳ 安装前端依赖...
call npm install

echo.
echo ========================================
echo   ✅ 安装完成！
echo ========================================
echo.
echo 📂 安装位置: %INSTALL_DIR%
echo.
echo 🚀 启动应用:
echo   1. 运行 start-app.bat（自动启动前后端）
echo   2. 或手动启动:
echo      - 后端: cd backend && venv\Scripts\activate && python main.py
echo      - 前端: cd frontend && npm start
echo.
echo 🌐 访问地址:
echo   - 前端: http://localhost:3000
echo   - 后端API: http://localhost:8000
echo.
echo ⚙️  配置说明:
echo   编辑文件: %INSTALL_DIR%\backend\.env
echo   添加你的邮箱授权码和API密钥
echo.
pause
