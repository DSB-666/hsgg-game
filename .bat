@echo off
chcp 65001 >nul
title OSS同步工具

echo.
echo ==========================================
echo           OSS同步工具
echo ==========================================
echo.

:: 使用你提供的 Git Bash 路径
set "GIT_BASH=C:\Program Files\Git\usr\bin\bash.exe"

if not exist "%GIT_BASH%" (
    echo [错误] 未找到 Git Bash
    pause
    exit /b 1
)

if not exist ".\.git\hooks\post-push" (
    echo [错误] 未找到 post-push 脚本
    pause
    exit /b 1
)

echo [成功] 环境检查通过
echo [信息] 开始同步到阿里云OSS...
echo.

:: 分步进度显示
echo ▓▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒ 10%%
echo [状态] 初始化Git Bash...
timeout /t 1 >nul

echo ▓▓▓▓▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒ 20%%
echo [状态] 设置OSS环境变量...
timeout /t 1 >nul

echo ▓▓▓▓▓▓▓▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒ 30%%
echo [状态] 扫描项目文件...
timeout /t 1 >nul

echo ▓▓▓▓▓▓▓▓▓▓▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒ 40%%
echo [状态] 排除.git和.github目录...
timeout /t 1 >nul

echo ▓▓▓▓▓▓▓▓▓▓▓▓▓▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒ 50%%
echo [状态] 连接到OSS存储桶...
timeout /t 1 >nul

echo ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▒▒▒▒▒▒▒▒▒▒▒▒▒▒ 60%%
echo [状态] 开始文件同步...
timeout /t 1 >nul

echo ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ 100%%
echo [状态] 执行同步命令...
echo.

:: 执行同步
"%GIT_BASH%" -c "./.git/hooks/post-push"
set "result=%errorlevel%"

echo.
if %result% equ 0 (
    echo [成功] ✅ 文件同步到OSS成功!
    echo [信息] 所有文件已同步到阿里云OSS
    echo [信息] 已排除.git和.github目录
) else (
    echo [失败] ❌ OSS同步失败! 错误代码: %result%
)

echo.
pause