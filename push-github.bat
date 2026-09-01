@echo off
chcp 65001 >nul
title Nucleon - Push to GitHub
cd /d "%~dp0"
powershell.exe -NoLogo -NoProfile -ExecutionPolicy Bypass -File "%~dp0push-github.ps1"
echo.
echo Script finished. Press any key to close.
pause
