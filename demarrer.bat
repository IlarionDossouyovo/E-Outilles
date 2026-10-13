@echo off
REM E-Outilles - double-cliquez pour demarrer automatiquement.
REM Passe -Prod pour lancer le build de production.
setlocal
cd /d "%~dp0"
set "PS=powershell"
where pwsh >nul 2>nul && set "PS=pwsh"
%PS% -NoProfile -ExecutionPolicy Bypass -File ".\scripts\start.ps1" %*
pause
