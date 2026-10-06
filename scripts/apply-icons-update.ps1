# ============================================================
#  E-Outilles - Application de la mise a jour "emojis -> <Icon>"
#  Ouvrir PowerShell dans le dossier du projet, puis :
#     powershell -ExecutionPolicy Bypass -File .\scripts\apply-icons-update.ps1
# ============================================================

$ErrorActionPreference = "Stop"
$Branch = "fix/finalisation-build-admin-auth"

Write-Host "== 1/6 Recuperation du code ==" -ForegroundColor Cyan
git fetch origin
git checkout $Branch
git pull origin $Branch

Write-Host "== 2/6 Dependances ==" -ForegroundColor Cyan
npm install

Write-Host "== 3/6 Prisma (client + migrations) ==" -ForegroundColor Cyan
npx prisma generate
npx prisma migrate deploy

Write-Host "== 4/6 Verification .env ==" -ForegroundColor Cyan
if (-not (Test-Path ".env")) {
    Copy-Item ".env.example" ".env"
    Write-Host ".env cree depuis .env.example : renseignez GOOGLE_AI_API_KEY, SESSION_SECRET, STRIPE_*." -ForegroundColor Yellow
} else {
    $keys = @("GOOGLE_AI_API_KEY", "SESSION_SECRET", "STRIPE_SECRET_KEY", "STRIPE_WEBHOOK_SECRET")
    foreach ($k in $keys) {
        if (-not (Select-String -Path ".env" -Pattern "^$k=" -Quiet)) {
            Write-Host "  [manquant] $k" -ForegroundColor Yellow
        }
    }
    Write-Host ".env present (cle API Google AI requise pour le chatbot)." -ForegroundColor Green
}

Write-Host "== 5/6 Lint + Build ==" -ForegroundColor Cyan
npx next lint --dir src
npm run build

Write-Host "== 6/6 Termine ==" -ForegroundColor Green
Write-Host "Lancer le serveur : npm run dev   (http://localhost:3003)" -ForegroundColor Green
Write-Host "Comptes de demo : admin@e-outilles.com / admin123  -  demo@e-outilles.com / demo123" -ForegroundColor Green
