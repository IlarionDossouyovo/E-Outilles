@echo off
chcp 65001 >nul
echo ======================================
echo   E-Outilles - Mise a jour
echo ======================================
echo.

echo [1/4] Installation des dependances...
call npm install

echo.
echo [2/4] Generation Prisma...
call npx prisma generate

echo.
echo [3/4] Construction du projet...
call npm run build

echo.
echo ======================================
echo   Termine!
echo ======================================
echo.
echo Lancer le serveur: npm run dev
echo Site: http://localhost:3003
echo.
pause
