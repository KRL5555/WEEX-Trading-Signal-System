@echo off
chcp 65001 > nul

REM 快速启动脚本 - WEEX Trading Signal System

set INSTALL_DIR=D:\WEEX-Trading-Signal-System

echo.
echo ========================================
echo   WEEX Trading Signal System
echo   启动中...
echo ========================================
echo.

echo ⏳ 启动后端服务 (http://localhost:8000)...
cd /d "%INSTALL_DIR%\backend"
start cmd /k "call venv\Scripts\activate.bat && python main.py"

timeout /t 3

echo ⏳ 启动前端应用 (http://localhost:3000)...
cd /d "%INSTALL_DIR%\frontend"
start cmd /k "npm start"

echo.
echo ✅ 应用已启动！
echo.
echo 打开浏览器访问: http://localhost:3000
echo.
pause
