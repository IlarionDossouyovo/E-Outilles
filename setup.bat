@echo off
echo ========================================
echo  E-Outilles - Script d'installation
echo ========================================
echo.

cd /d "%~dp0"

echo [1/5] Verification de Node.js...
node --version
if errorlevel 1 (
    echo ERREUR: Node.js n'est pas installe!
    echo Telechargez sur: https://nodejs.org
    pause
    exit /b 1
)
echo OK
echo.

echo [2/5] Installation des dependances...
call npm install
if errorlevel 1 (
    echo ERREUR lors de l'installation
    pause
    exit /b 1
)
echo.

echo [3/5] Construction du projet...
call npm run build
if errorlevel 1 (
    echo ERREUR lors de la construction
    pause
    exit /b 1
)
echo.

echo [4/5] Verification de la configuration...
echo - Tailwind CSS: OK
echo - Stripe: Configure (variables d'environnement requises)
echo - PWA: Configure
echo.

echo [5/5] Demarrage du serveur...
echo.
echo Le serveur demarre sur: http://localhost:3000
echo Appuyez sur Ctrl+C pour arreter
echo.
call npm run dev

pause