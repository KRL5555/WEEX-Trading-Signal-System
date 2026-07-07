import tkinter as tk
from tkinter import ttk, messagebox, filedialog
import subprocess
import os
import sys
import threading
from pathlib import Path
import json
from datetime import datetime
import webbrowser
import time

class WEEXInstallerGUI:
    def __init__(self, root):
        self.root = root
        self.root.title("WEEX Trading Signal System - 一键安装")
        self.root.geometry("800x700")
        self.root.resizable(False, False)
        self.root.configure(bg="#0f172a")
        
        # 配置样式
        style = ttk.Style()
        style.theme_use('clam')
        style.configure("TFrame", background="#0f172a")
        style.configure("TLabel", background="#0f172a", foreground="#e2e8f0", font=("Segoe UI", 10))
        style.configure("Title.TLabel", background="#0f172a", foreground="#3b82f6", font=("Segoe UI", 18, "bold"))
        style.configure("Subtitle.TLabel", background="#0f172a", foreground="#94a3b8", font=("Segoe UI", 11))
        style.configure("Success.TLabel", background="#0f172a", foreground="#10b981", font=("Segoe UI", 11))
        style.configure("Error.TLabel", background="#0f172a", foreground="#ef4444", font=("Segoe UI", 11))
        
        self.install_dir = "D:\\WEEX-Trading-Signal-System"
        self.is_installing = False
        self.log_content = []
        
        self.create_ui()
        self.center_window()
    
    def center_window(self):
        """窗口居中显示"""
        self.root.update_idletasks()
        x = (self.root.winfo_screenwidth() // 2) - (800 // 2)
        y = (self.root.winfo_screenheight() // 2) - (700 // 2)
        self.root.geometry(f'+{x}+{y}')
    
    def create_ui(self):
        """创建用户界面"""
        
        # 标题
        title_frame = ttk.Frame(self.root)
        title_frame.pack(fill="x", padx=20, pady=20)
        
        title_label = ttk.Label(title_frame, text="🚀 WEEX Trading Signal System", style="Title.TLabel")
        title_label.pack()
        
        subtitle_label = ttk.Label(title_frame, text="Windows 10/11 一键安装向导", style="Subtitle.TLabel")
        subtitle_label.pack(pady=5)
        
        # 安装路径选择
        path_frame = ttk.LabelFrame(self.root, text="📂 安装位置", padding=10)
        path_frame.pack(fill="x", padx=20, pady=10)
        
        path_inner = ttk.Frame(path_frame)
        path_inner.pack(fill="x")
        
        ttk.Label(path_inner, text="安装路径:").pack(side="left", padx=5)
        
        self.path_var = tk.StringVar(value=self.install_dir)
        path_entry = ttk.Entry(path_inner, textvariable=self.path_var, width=45)
        path_entry.pack(side="left", padx=5, fill="x", expand=True)
        
        browse_btn = ttk.Button(path_inner, text="浏览", command=self.choose_path, width=8)
        browse_btn.pack(side="left", padx=5)
        
        # 安装组件选择
        components_frame = ttk.LabelFrame(self.root, text="⚙️  选择组件", padding=10)
        components_frame.pack(fill="x", padx=20, pady=10)
        
        self.python_var = tk.BooleanVar(value=True)
        self.nodejs_var = tk.BooleanVar(value=True)
        self.git_var = tk.BooleanVar(value=True)
        
        ttk.Checkbutton(components_frame, text="✅ Python 3.10 (后端需要)", variable=self.python_var).pack(anchor="w", pady=5)
        ttk.Checkbutton(components_frame, text="✅ Node.js 18 (前端需要)", variable=self.nodejs_var).pack(anchor="w", pady=5)
        ttk.Checkbutton(components_frame, text="✅ Git (版本控制需要)", variable=self.git_var).pack(anchor="w", pady=5)
        
        # 日志输出区域
        log_frame = ttk.LabelFrame(self.root, text="📋 安装日志", padding=10)
        log_frame.pack(fill="both", expand=True, padx=20, pady=10)
        
        scrollbar = ttk.Scrollbar(log_frame)
        scrollbar.pack(side="right", fill="y")
        
        self.log_text = tk.Text(
            log_frame,
            height=12,
            width=80,
            bg="#1e293b",
            fg="#e2e8f0",
            font=("Courier", 9),
            yscrollcommand=scrollbar.set
        )
        self.log_text.pack(fill="both", expand=True)
        scrollbar.config(command=self.log_text.yview)
        
        # 按钮区域
        button_frame = ttk.Frame(self.root)
        button_frame.pack(fill="x", padx=20, pady=15)
        
        self.install_btn = ttk.Button(
            button_frame,
            text="🚀 开始安装",
            command=self.start_install,
            width=20
        )
        self.install_btn.pack(side="left", padx=5)
        
        self.launch_btn = ttk.Button(
            button_frame,
            text="▶️  启动应用",
            command=self.launch_app,
            width=20,
            state="disabled"
        )
        self.launch_btn.pack(side="left", padx=5)
        
        exit_btn = ttk.Button(
            button_frame,
            text="❌ 退出",
            command=self.root.quit,
            width=20
        )
        exit_btn.pack(side="left", padx=5)
        
        # 进度条
        self.progress_var = tk.DoubleVar()
        progress_bar = ttk.Progressbar(
            self.root,
            variable=self.progress_var,
            maximum=100,
            mode="determinate"
        )
        progress_bar.pack(fill="x", padx=20, pady=5)
        
        # 状态标签
        self.status_label = ttk.Label(self.root, text="准备就绪", style="Success.TLabel")
        self.status_label.pack(padx=20, pady=5)
        
        # 初始日志
        self.log("🎉 欢迎使用 WEEX Trading Signal System 安装向导")
        self.log("📝 当前安装路径: " + self.install_dir)
        self.log("")
        self.log("⚠️  注意：")
        self.log("  • 需要管理员权限运行此程序")
        self.log("  • 安装过程可能需要 10-30 分钟")
        self.log("  • 请勿关闭此窗口，直到安装完成")
        self.log("")
        self.log("✅ 准备就绪，点击'开始安装'开始安装过程")
    
    def choose_path(self):
        """选择安装路径"""
        path = filedialog.askdirectory(
            title="选择安装目录",
            initialdir="D:\\"
        )
        if path:
            self.path_var.set(path)
            self.install_dir = path
            self.log("📝 安装路径已更改: " + path)
    
    def log(self, message):
        """写入日志"""
        timestamp = datetime.now().strftime("%H:%M:%S")
        log_message = f"[{timestamp}] {message}"
        self.log_text.insert(tk.END, log_message + "\n")
        self.log_text.see(tk.END)
        self.log_text.update()
        self.log_content.append(log_message)
    
    def start_install(self):
        """开始安装"""
        if self.is_installing:
            messagebox.showwarning("警告", "安装已在进行中")
            return
        
        self.is_installing = True
        self.install_btn.config(state="disabled")
        self.log("")
        self.log("🚀 开始安装过程...")
        self.log("")
        
        # 在后台线程中执行安装
        thread = threading.Thread(target=self.install_thread)
        thread.daemon = True
        thread.start()
    
    def install_thread(self):
        """安装线程"""
        try:
            install_dir = self.path_var.get()
            
            # 步骤1: 检查Python
            self.update_progress(10)
            self.log("[步骤 1/6] 检查 Python 3.10...")
            if self.check_python():
                self.log("✅ Python 已安装")
            else:
                self.log("⚠️  Python 未安装，请先手动安装")
                self.log("   下载地址: https://www.python.org/downloads/")
                messagebox.showwarning("需要Python", "请先安装 Python 3.10+\n下载地址: https://www.python.org/downloads/")
            
            # 步骤2: 检查Node.js
            self.update_progress(20)
            self.log("[步骤 2/6] 检查 Node.js 18...")
            if self.check_nodejs():
                self.log("✅ Node.js 已安装")
            else:
                self.log("⚠️  Node.js 未安装，请先手动安装")
                self.log("   下载地址: https://nodejs.org/")
                messagebox.showwarning("需要Node.js", "请先安装 Node.js 18+\n下载地址: https://nodejs.org/")
            
            # 步骤3: 检查Git
            self.update_progress(30)
            self.log("[步骤 3/6] 检查 Git...")
            if self.check_git():
                self.log("✅ Git 已安装")
            else:
                self.log("⚠️  Git 未安装，请先手动安装")
                self.log("   下载地址: https://git-scm.com/")
                messagebox.showwarning("需要Git", "请先安装 Git\n下载地址: https://git-scm.com/")
            
            # 步骤4: 克隆项目
            self.update_progress(40)
            self.log("[步骤 4/6] 克隆项目代码...")
            self.clone_project(install_dir)
            self.log("✅ 项目代码已克隆")
            
            # 步骤5: 安装依赖
            self.update_progress(60)
            self.log("[步骤 5/6] 安装 Python 依赖...")
            self.install_python_deps(install_dir)
            self.log("✅ Python 依赖已安装")
            
            # 步骤6: 安装前端依赖
            self.update_progress(80)
            self.log("[步骤 6/6] 安装前端依赖...")
            self.install_frontend_deps(install_dir)
            self.log("✅ 前端依赖已安装")
            
            # 完成
            self.update_progress(100)
            self.log("")
            self.log("🎉 安装完成！")
            self.log("")
            self.log("📂 安装位置: " + install_dir)
            self.log("")
            self.log("✨ 现在可以点击'启动应用'开始使用")
            self.log("   或手动启动:")
            self.log(f"   cd {install_dir}")
            self.log("   start-app.bat")
            
            self.update_status("安装完成！", "#10b981")
            self.launch_btn.config(state="normal")
            
            messagebox.showinfo(
                "成功",
                f"安装完成！\n\n"
                f"安装位置: {install_dir}\n\n"
                f"现在可以点击'启动应用'开始使用"
            )
        
        except Exception as e:
            self.log(f"")
            self.log(f"❌ 安装失败: {str(e)}")
            self.update_status("安装失败", "#ef4444")
            messagebox.showerror("错误", f"安装过程中出现错误:\n{str(e)}")
        
        finally:
            self.is_installing = False
            self.install_btn.config(state="normal")
    
    def check_python(self):
        """检查Python是否已安装"""
        try:
            result = subprocess.run(
                ["python", "--version"],
                capture_output=True,
                text=True,
                timeout=5
            )
            if result.returncode == 0:
                version = result.stdout.strip()
                self.log(f"   {version}")
                return True
        except:
            pass
        return False
    
    def check_nodejs(self):
        """检查Node.js是否已安装"""
        try:
            result = subprocess.run(
                ["node", "--version"],
                capture_output=True,
                text=True,
                timeout=5
            )
            if result.returncode == 0:
                version = result.stdout.strip()
                self.log(f"   {version}")
                return True
        except:
            pass
        return False
    
    def check_git(self):
        """检查Git是否已安装"""
        try:
            result = subprocess.run(
                ["git", "--version"],
                capture_output=True,
                text=True,
                timeout=5
            )
            if result.returncode == 0:
                version = result.stdout.strip()
                self.log(f"   {version}")
                return True
        except:
            pass
        return False
    
    def clone_project(self, install_dir):
        """克隆项目"""
        if os.path.exists(install_dir):
            self.log("   项目已存在")
            return
        
        self.log("   正在克隆 https://github.com/KRL5555/WEEX-Trading-Signal-System.git...")
        try:
            os.makedirs(os.path.dirname(install_dir), exist_ok=True)
            result = subprocess.run([
                "git", "clone",
                "https://github.com/KRL5555/WEEX-Trading-Signal-System.git",
                install_dir
            ], capture_output=True, text=True, timeout=300)
            
            if result.returncode != 0:
                raise Exception(result.stderr)
        except Exception as e:
            self.log(f"   ⚠️  克隆失败: {str(e)}")
            raise
    
    def install_python_deps(self, install_dir):
        """安装Python依赖"""
        backend_dir = os.path.join(install_dir, "backend")
        
        try:
            # 创建虚拟环境
            self.log("   创建虚拟环境...")
            subprocess.run(
                [sys.executable, "-m", "venv", "venv"],
                cwd=backend_dir,
                capture_output=True,
                check=True,
                timeout=120
            )
            
            # 安装依赖
            self.log("   安装依赖包 (这可能需要几分钟)...")
            pip_path = os.path.join(backend_dir, "venv", "Scripts", "pip")
            subprocess.run(
                [pip_path, "install", "-r", "requirements.txt"],
                cwd=backend_dir,
                capture_output=True,
                check=True,
                timeout=600
            )
        except Exception as e:
            self.log(f"   ⚠️  Python依赖安装出错: {str(e)}")
            raise
    
    def install_frontend_deps(self, install_dir):
        """安装前端依赖"""
        frontend_dir = os.path.join(install_dir, "frontend")
        
        try:
            self.log("   运行 npm install (这可能需要几分钟)...")
            result = subprocess.run(
                ["npm", "install"],
                cwd=frontend_dir,
                capture_output=True,
                text=True,
                timeout=600
            )
            
            if result.returncode != 0:
                raise Exception(result.stderr)
        except Exception as e:
            self.log(f"   ⚠️  前端依赖安装出错: {str(e)}")
            raise
    
    def launch_app(self):
        """启动应用"""
        install_dir = self.path_var.get()
        
        if not os.path.exists(install_dir):
            messagebox.showerror("错误", f"项目目录不存在: {install_dir}")
            return
        
        self.log("")
        self.log("🚀 启动应用...")
        
        try:
            # 启动后端
            backend_dir = os.path.join(install_dir, "backend")
            python_exe = os.path.join(backend_dir, "venv", "Scripts", "python.exe")
            
            if os.path.exists(python_exe):
                self.log("⏳ 启动后端服务 (http://localhost:8000)...")
                subprocess.Popen(
                    [python_exe, "main.py"],
                    cwd=backend_dir,
                    creationflags=subprocess.CREATE_NEW_CONSOLE
                )
            else:
                self.log("⚠️  Python虚拟环境未找到")
            
            # 等待后端启动
            time.sleep(3)
            
            # 启动前端
            frontend_dir = os.path.join(install_dir, "frontend")
            self.log("⏳ 启动前端应用 (http://localhost:3000)...")
            subprocess.Popen(
                ["npm", "start"],
                cwd=frontend_dir,
                creationflags=subprocess.CREATE_NEW_CONSOLE
            )
            
            self.log("✅ 应用已启动")
            self.log("")
            self.log("🌐 访问地址:")
            self.log("   - 前端: http://localhost:3000")
            self.log("   - 后端: http://localhost:8000")
            self.log("")
            self.log("⏳ 等待5秒，浏览器会自动打开...")
            
            # 打开浏览器
            time.sleep(5)
            webbrowser.open("http://localhost:3000")
            
        except Exception as e:
            messagebox.showerror("错误", f"启动应用失败:\n{str(e)}")
            self.log(f"❌ 启动失败: {str(e)}")
    
    def update_progress(self, value):
        """更新进度条"""
        self.progress_var.set(value)
        self.root.update()
    
    def update_status(self, message, color):
        """更新状态标签"""
        self.status_label.config(text=message, foreground=color)
        self.root.update()


if __name__ == "__main__":
    root = tk.Tk()
    app = WEEXInstallerGUI(root)
    root.mainloop()
