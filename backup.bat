@echo off
chcp 65001 >nul
echo ======================================
echo   E-Outilles - Sauvegarde
echo ======================================
echo.

if not exist "backups" mkdir backups

set DATETIME=%date:~0,4%%date:~5,2%%date:~8,2%_%time:~0,2%%time:~3,2%%time:~6,2%
set DATETIME=%DATETIME: =0%

echo [1/2] Sauvegarde base de donnees...
copy prisma\dev.db backups\dev.db.%DATETIME%

echo.
echo [2/2] Sauvegarde configuration...
copy .env backups\.env.%DATETIME%

echo.
echo ======================================
echo   Sauvegardes creees:
echo ======================================
dir backups /b

echo.
pause
