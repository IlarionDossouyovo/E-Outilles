# ============================================================
#  E-Outilles - Mise a jour locale (PowerShell)
#  Usage : ouvrir PowerShell dans C:\E-Outilles puis executer :
#     Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
#     .\scripts\update.ps1
#  (Arretez d'abord 'npm run dev' : Prisma ne peut pas regenerer son
#   moteur tant que le serveur le verrouille.)
# ============================================================

$ErrorActionPreference = "Stop"

# Prisma remplace query_engine-windows.dll.node a chaque generate ; si un
# serveur Next.js tourne, Windows verrouille le fichier et la commande echoue
# en EPERM. On refuse donc de continuer tant que le port 3003 est occupe.
$busy = Get-NetTCPConnection -LocalPort 3003 -State Listen -ErrorAction SilentlyContinue
if ($busy) {
    Write-Host "Le port 3003 est utilise (serveur 'npm run dev' probablement actif)." -ForegroundColor Red
    Write-Host "Arretez-le (Ctrl+C dans sa fenetre) puis relancez ce script." -ForegroundColor Red
    Write-Host "Pour liberer d'urgence : Get-Process node | Stop-Process -Force" -ForegroundColor Yellow
    exit 1
}

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

# AGENT_ACCESS_CODE : code du tableau de bord Agents IA. On en genere un si
# absent/placeholder et on l'affiche, sinon l'admin ne peut pas valider l'acces.
$envLines = @(Get-Content ".env" -ErrorAction SilentlyContinue)
$codeLine = -1
$codeOk = $false
for ($i = 0; $i -lt $envLines.Count; $i++) {
    if ($envLines[$i] -match "^\s*AGENT_ACCESS_CODE\s*=\s*(.*)$") {
        $codeLine = $i
        $value = $Matches[1].Trim()
        if ($value -and $value -notmatch "changez|votre|CHANGE|code-secret") { $codeOk = $true; $agentCode = $value }
    }
}
if (-not $codeOk) {
    $chars = (48..122) | ForEach-Object { [char]$_ } | Where-Object { $_ -match "[A-Za-z0-9]" }
    $agentCode = -join (1..16 | ForEach-Object { $chars | Get-Random })
    if ($codeLine -ge 0) {
        $envLines[$codeLine] = "AGENT_ACCESS_CODE=$agentCode"
        Set-Content ".env" $envLines
    } else {
        Add-Content ".env" "AGENT_ACCESS_CODE=$agentCode"
    }
    Write-Host ""
    Write-Host "Code d'acces Agents IA genere : $agentCode" -ForegroundColor Yellow
    Write-Host "Notez-le : il faudra le saisir sur la page /agent." -ForegroundColor Yellow
    Write-Host ""
}

# OLLAMA_API_URL : le chatbot utilise Ollama en secours de Google AI. Si un
# serveur Ollama local repond, on l'active automatiquement (aucune saisie).
function Test-Ollama {
    try {
        Invoke-RestMethod "http://localhost:11434/api/tags" -TimeoutSec 2 -ErrorAction Stop | Out-Null
        return $true
    } catch { return $false }
}

$ollamaUp = Test-Ollama

# Ollama installe mais pas demarre : on le lance en arriere-plan puis on
# re-teste. Sur Windows l'app de bureau le demarre d'habitude ; ceci couvre
# le cas ou seul le binaire CLI est present.
if (-not $ollamaUp) {
    $ollamaCmd = Get-Command ollama -ErrorAction SilentlyContinue
    if ($ollamaCmd) {
        Write-Host "Ollama installe mais non joignable - demarrage..." -ForegroundColor Yellow
        Start-Process -FilePath $ollamaCmd.Source -ArgumentList "serve" -WindowStyle Hidden | Out-Null
        for ($i = 0; $i -lt 10; $i++) {
            Start-Sleep -Seconds 1
            if (Test-Ollama) { $ollamaUp = $true; break }
        }
    }
}

if ($ollamaUp) {
    # Modele de chat : on verifie qu'il est bien telecharge, sinon on le pull.
    $modelName = "llama3.2"
    try {
        $models = & ollama list 2>$null
        if (-not ($models -match [regex]::Escape($modelName))) {
            Write-Host "Telechargement du modele Ollama '$modelName' (peut prendre quelques minutes)..." -ForegroundColor Yellow
            & ollama pull $modelName
        }
    } catch {
        Write-Host "Verification du modele Ollama ignoree (CLI 'ollama' indisponible)." -ForegroundColor Yellow
    }

    $envLines = @(Get-Content ".env" -ErrorAction SilentlyContinue)
    $ollamaLine = -1
    for ($i = 0; $i -lt $envLines.Count; $i++) {
        if ($envLines[$i] -match "^\s*OLLAMA_API_URL\s*=") { $ollamaLine = $i }
    }
    if ($ollamaLine -ge 0) {
        $envLines[$ollamaLine] = "OLLAMA_API_URL=http://localhost:11434"
    } else {
        $envLines += "OLLAMA_API_URL=http://localhost:11434"
    }
    if (-not ($envLines -match "^\s*OLLAMA_CHAT_MODEL\s*=")) {
        $envLines += "OLLAMA_CHAT_MODEL=llama3.2:latest"
    }
    Set-Content ".env" $envLines
    Write-Host "Ollama detecte - active dans .env." -ForegroundColor Green
} else {
    Write-Host "Ollama non joignable sur localhost:11434 - laisse desactive (Google AI + demo actifs)." -ForegroundColor Yellow
    Write-Host "Pour l'activer : installez Ollama (winget install Ollama.Ollama), lancez-le, puis relancez ce script." -ForegroundColor Yellow
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
Write-Host "Espace admin : http://localhost:3003/admin (connectez-vous avec le compte admin)" -ForegroundColor Green
Write-Host "Code Agents IA (page /agent) : $agentCode" -ForegroundColor Green
