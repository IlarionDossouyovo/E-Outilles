# ============================================================
#  E-Outilles - Mise a jour locale (PowerShell)
#  Usage : ouvrir PowerShell dans C:\E-Outilles puis executer :
#     powershell -ExecutionPolicy Bypass -File .\scripts\update.ps1
# ============================================================

$ErrorActionPreference = "Stop"

Write-Host "== 1/7 Recuperation du code ==" -ForegroundColor Cyan
git fetch origin
git checkout fix/finalisation-build-admin-auth
git pull origin fix/finalisation-build-admin-auth

Write-Host "== 2/7 Installation des dependances ==" -ForegroundColor Cyan
npm install

Write-Host "== 3/7 Configuration (.env) ==" -ForegroundColor Cyan
if (-not (Test-Path ".env")) {
    if (Test-Path ".env.example") {
        Copy-Item ".env.example" ".env"
        Write-Host "Fichier .env cree depuis .env.example - renseignez SESSION_SECRET, STRIPE_* et AGENT_ACCESS_CODE." -ForegroundColor Yellow
    }
} else {
    Write-Host ".env deja present - conserve." -ForegroundColor Yellow
}

Write-Host "== 4/7 Generation du client Prisma ==" -ForegroundColor Cyan
npx prisma generate

Write-Host "== 5/7 Application des migrations ==" -ForegroundColor Cyan
npx prisma migrate deploy

Write-Host "== 6/7 Base de donnees de demonstration (optionnel) ==" -ForegroundColor Cyan
if (Test-Path "prisma\dev.db") {
    Write-Host "dev.db deja present - seed ignore (supprimez prisma\dev.db pour reinitialiser)." -ForegroundColor Yellow
} else {
    npx prisma db seed
}

Write-Host "== 7/7 Verification du build ==" -ForegroundColor Cyan
npm run build

Write-Host ""
Write-Host "Termine. Lancez le serveur avec : npm run dev" -ForegroundColor Green
Write-Host "Comptes de demo : admin@e-outilles.com / admin123  -  demo@e-outilles.com / demo123" -ForegroundColor Green
