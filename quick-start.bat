# WEEX Trading Signal System - 快速启动脚本
# 如果你已经安装了项目，直接运行这个文件启动应用

@echo off
chcp 65001 > nul
setlocal enabledelayedexpansion

echo.
echo ========================================
echo   WEEX Trading Signal System
echo   快速启动脚本
echo ========================================
echo.

REM 自动检测安装目录
set "INSTALL_DIR=D:\WEEX-Trading-Signal-System"

if not exist "%INSTALL_DIR%" (
    echo ❌ 项目目录不存在: %INSTALL_DIR%
    echo.
    echo 请先运行 WEEX-Installer.exe 进行安装
    pause
    exit /b 1
)

echo 📂 项目位置: %INSTALL_DIR%
echo.

echo 🚀 启动后端服务 (http://localhost:8000)...
cd /d "%INSTALL_DIR%\backend"
start cmd /k "call venv\Scripts\activate.bat && python main.py"

timeout /t 3

echo 🚀 启动前端应用 (http://localhost:3000)...
cd /d "%INSTALL_DIR%\frontend"
start cmd /k "npm start"

echo.
echo ✅ 应用已启动！
echo.
echo 🌐 访问地址:
echo    - 前端: http://localhost:3000
echo    - 后端: http://localhost:8000
echo.
echo ⏳ 等待 5-10 秒，浏览器会自动打开...
echo.

timeout /t 5

start http://localhost:3000

pause
