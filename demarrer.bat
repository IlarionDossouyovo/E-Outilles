@echo off
REM E-Outilles - double-cliquez pour demarrer automatiquement.
REM Passe -Prod pour lancer le build de production.
cd /d "%~dp0"
powershell -NoProfile -ExecutionPolicy Bypass -File ".\scripts\start.ps1" %*
pause
