# 快速构建EXE的脚本
# 使用方法: python build_quick.py

import subprocess
import sys
import os

print("\n" + "="*60)
print("  WEEX Trading Signal System - EXE 快速构建工具")
print("="*60 + "\n")

print("📋 这个脚本将帮助你快速构建 EXE 安装程序\n")

print("前置要求:")
print("  1. Python 3.8+")
print("  2. pip (Python包管理器)")
print("  3. 网络连接\n")

print("开始构建...\n")

# 步骤1: 安装PyInstaller
print("[步骤 1] 安装 PyInstaller...")
try:
    subprocess.run([sys.executable, "-m", "pip", "install", "pyinstaller", "-q"], check=True)
    print("✅ PyInstaller 安装完成\n")
except:
    print("❌ PyInstaller 安装失败\n")
    sys.exit(1)

# 步骤2: 构建EXE
print("[步骤 2] 构建 EXE...")
try:
    subprocess.run([
        sys.executable, "-m", "PyInstaller",
        "installer_v2.py",
        "--onefile",
        "--windowed",
        "--name=WEEX-Installer",
        "--distpath=./dist",
        "--buildpath=./build",
        "--specpath=.",
        "--add-data=.",
    ], check=True)
    print("✅ EXE 构建完成\n")
except Exception as e:
    print(f"❌ EXE 构建失败: {e}\n")
    sys.exit(1)

# 步骤3: 检查文件
print("[步骤 3] 检查文件...")
exe_path = "dist/WEEX-Installer.exe"
if os.path.exists(exe_path):
    size_mb = os.path.getsize(exe_path) / (1024 * 1024)
    print(f"✅ EXE 文件已生成\n")
    print(f"📂 文件位置: {os.path.abspath(exe_path)}")
    print(f"📊 文件大小: {size_mb:.2f} MB\n")
    print("🎉 构建成功！")
    print("\n现在你可以:")
    print(f"  1. 找到 {exe_path}")
    print("  2. 双击运行 EXE")
    print("  3. 按照向导完成安装\n")
else:
    print(f"❌ 未找到 EXE 文件: {exe_path}\n")
    sys.exit(1)

print("="*60)
