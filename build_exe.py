# 构建EXE的Python脚本

import os
import sys
import subprocess
from pathlib import Path

def build_exe():
    """
    使用PyInstaller构建EXE
    
    需要先安装:
    pip install pyinstaller
    """
    
    print("\n" + "="*50)
    print("WEEX Trading Signal System - EXE 构建工具")
    print("="*50 + "\n")
    
    # 检查PyInstaller
    try:
        subprocess.run([sys.executable, "-m", "pip", "show", "pyinstaller"], 
                      capture_output=True, check=True)
        print("✅ PyInstaller 已安装")
    except:
        print("⚠️  PyInstaller 未安装，正在安装...")
        subprocess.run([sys.executable, "-m", "pip", "install", "pyinstaller"], 
                      check=True)
        print("✅ PyInstaller 安装完成")
    
    # 构建EXE
    print("\n🔨 正在构建 EXE...")
    result = subprocess.run([
        sys.executable, "-m", "PyInstaller",
        "installer.spec",
        "--distpath=./dist",
        "--buildpath=./build",
        "--specpath=."
    ])
    
    if result.returncode == 0:
        print("\n✅ EXE 构建成功！")
        print("\n📂 文件位置:")
        exe_path = Path("dist/WEEX-Installer.exe")
        if exe_path.exists():
            size_mb = exe_path.stat().st_size / (1024 * 1024)
            print(f"   {exe_path}")
            print(f"   大小: {size_mb:.2f} MB")
            print("\n📦 现在可以分发这个 EXE 文件了！")
            print("   用户只需要双击运行即可自动安装。")
        return True
    else:
        print("\n❌ EXE 构建失败")
        return False

if __name__ == "__main__":
    success = build_exe()
    sys.exit(0 if success else 1)
