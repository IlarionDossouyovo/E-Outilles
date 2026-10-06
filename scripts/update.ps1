# ============================================================
#  E-Outilles - Mise a jour locale (PowerShell)
#  Usage : ouvrir PowerShell dans C:\E-Outilles puis executer :
#     powershell -ExecutionPolicy Bypass -File .\scripts\update.ps1
# ============================================================

$ErrorActionPreference = "Stop"

Write-Host "== 1/7 Recuperation du code ==" -ForegroundColor Cyan
git fetch origin
git checkout main
git pull origin main

Write-Host "== 2/7 Installation des dependances ==" -ForegroundColor Cyan
npm install

Write-Host "== 3/7 Configuration (.env) ==" -ForegroundColor Cyan
if (-not (Test-Path ".env")) {
    if (Test-Path ".env.example") {
        Copy-Item ".env.example" ".env"
        Write-Host "Fichier .env cree depuis .env.example - renseignez STRIPE_*, AGENT_ACCESS_CODE et GOOGLE_AI_API_KEY." -ForegroundColor Yellow
    }
} else {
    Write-Host ".env deja present - conserve." -ForegroundColor Yellow
}

# SESSION_SECRET : genere automatiquement une valeur forte si la variable est
# absente ou laissee sur une valeur d'exemple. Sans secret, les sessions
# utilisent un fallback non sur : acceptable en local, jamais en production.
$envLines = @(Get-Content ".env" -ErrorAction SilentlyContinue)
$secretLine = -1
$secretOk = $false
for ($i = 0; $i -lt $envLines.Count; $i++) {
    if ($envLines[$i] -match "^\s*SESSION_SECRET\s*=\s*(.*)$") {
        $secretLine = $i
        $value = $Matches[1].Trim()
        if ($value -and $value -notmatch "changez|votre|CHANGE") { $secretOk = $true }
    }
}
if (-not $secretOk) {
    $chars = (48..122) | ForEach-Object { [char]$_ } | Where-Object { $_ -match "[A-Za-z0-9]" }
    $secret = -join (1..48 | ForEach-Object { $chars | Get-Random })
    if ($secretLine -ge 0) {
        $envLines[$secretLine] = "SESSION_SECRET=$secret"
        Set-Content ".env" $envLines
    } else {
        Add-Content ".env" "SESSION_SECRET=$secret"
    }
    Write-Host "SESSION_SECRET genere dans .env." -ForegroundColor Green
}

Write-Host "== 4/7 Generation du client Prisma ==" -ForegroundColor Cyan
npx prisma generate

Write-Host "== 5/7 Application des migrations ==" -ForegroundColor Cyan
npx prisma migrate deploy

Write-Host "== 6/7 Base de donnees de demonstration (idempotent) ==" -ForegroundColor Cyan
# Le seed utilise des upsert : relancer ne cree pas de doublons.
# Indispensable si dev.db existe mais est vide (tables jamais migrees/seedees).
npx prisma db seed

Write-Host "== 7/7 Verification du build ==" -ForegroundColor Cyan
npm run build

Write-Host ""
Write-Host "Termine. Lancez le serveur avec : npm run dev" -ForegroundColor Green
Write-Host "Comptes de demo : admin@e-outilles.com / admin123  -  demo@e-outilles.com / demo123" -ForegroundColor Green
