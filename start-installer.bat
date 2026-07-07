@echo off
chcp 65001 > nul
echo.
echo ========================================
echo   WEEX Trading Signal System
echo   安装向导启动中...
echo ========================================
echo.

REM 检查Python是否已安装
python --version >nul 2>&1
if %errorLevel% neq 0 (
    echo 正在安装Python...
    REM 下载并安装Python的逻辑
    echo Python安装失败，请先手动安装Python 3.10+
    pause
    exit /b 1
)

REM 启动安装向导
python installer.py

if %errorLevel% neq 0 (
    echo 安装向导启动失败
    pause
    exit /b 1
)

echo.
echo 安装向导已关闭
pause
