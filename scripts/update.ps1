# ============================================================
#  E-Outilles - Mise a jour locale (PowerShell)
#  Usage : ouvrir PowerShell dans C:\E-Outilles puis executer :
#     powershell -ExecutionPolicy Bypass -File .\scripts\update.ps1
# ============================================================

$ErrorActionPreference = "Stop"

Write-Host "== 1/6 Recuperation du code ==" -ForegroundColor Cyan
git fetch origin
git checkout fix/finalisation-build-admin-auth
git pull origin fix/finalisation-build-admin-auth

Write-Host "== 2/6 Installation des dependances ==" -ForegroundColor Cyan
npm install

Write-Host "== 3/6 Generation du client Prisma ==" -ForegroundColor Cyan
npx prisma generate

Write-Host "== 4/6 Application des migrations ==" -ForegroundColor Cyan
npx prisma migrate deploy

Write-Host "== 5/6 Base de donnees de demonstration (optionnel) ==" -ForegroundColor Cyan
if (Test-Path "prisma\dev.db") {
    Write-Host "dev.db deja present - seed ignore (supprimez prisma\dev.db pour reinitialiser)." -ForegroundColor Yellow
} else {
    npx prisma db seed
}

Write-Host "== 6/6 Verification du build ==" -ForegroundColor Cyan
npm run build

Write-Host ""
Write-Host "Termine. Lancez le serveur avec : npm run dev" -ForegroundColor Green
Write-Host "Comptes de demo : admin@e-outilles.com / admin123  -  demo@e-outilles.com / demo123" -ForegroundColor Green
