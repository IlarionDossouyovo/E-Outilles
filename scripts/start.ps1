# ============================================================
#  E-Outilles - Demarrage automatique (PowerShell)
#  Usage : dans C:\E-Outilles
#     powershell -ExecutionPolicy Bypass -File .\scripts\start.ps1
#  Options :
#     -Prod        build + serveur de production (npm start)
#     -NoBrowser   ne pas ouvrir le navigateur
#     -Clean       vide .next et les caches npm avant de demarrer
#  Fait tout : dependances, .env, Prisma (generate/migrate/seed),
#  Ollama, puis lance le serveur sur http://localhost:3003
# ============================================================

param(
    [switch]$Prod,
    [switch]$NoBrowser,
    [switch]$Clean
)

$ErrorActionPreference = "Stop"
$Port = 3003
$BaseUrl = "http://localhost:$Port"

# -Clean : supprime les artefacts regenerables pour liberer de l'espace
# (utile quand le disque affiche ENOSPC). Ne touche ni la base ni le code.
if ($Clean) {
    Write-Host "== Nettoyage (.next, caches npm) ==" -ForegroundColor Cyan
    foreach ($dir in @('.next', 'node_modules\.cache')) {
        if (Test-Path $dir) { Remove-Item -Recurse -Force $dir -ErrorAction SilentlyContinue }
    }
    npm cache clean --force 2>$null | Out-Null
    Write-Host "Nettoyage termine." -ForegroundColor Green
}

function Test-PortBusy {
    param([int]$Port)
    return [bool](Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue)
}

function Test-Ollama {
    try {
        Invoke-RestMethod "http://localhost:11434/api/tags" -TimeoutSec 2 -ErrorAction Stop | Out-Null
        return $true
    } catch { return $false }
}

function Wait-Http {
    param([string]$Url, [int]$TimeoutSec = 60)
    for ($i = 0; $i -lt $TimeoutSec; $i++) {
        try {
            $r = Invoke-WebRequest $Url -UseBasicParsing -TimeoutSec 3 -ErrorAction Stop
            if ($r.StatusCode -ge 200 -and $r.StatusCode -lt 500) { return $true }
        } catch { }
        Start-Sleep -Seconds 1
    }
    return $false
}

Write-Host ""
Write-Host "=== E-Outilles - demarrage ===" -ForegroundColor Cyan

# --- 0. Deja en ligne ? -------------------------------------
if (Test-PortBusy -Port $Port) {
    Write-Host "Le port $Port repond deja - ouverture du navigateur." -ForegroundColor Yellow
    if (-not $NoBrowser) { Start-Process $BaseUrl }
    exit 0
}

# --- 1. Node / npm ------------------------------------------
if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
    Write-Host "npm introuvable. Installez Node.js LTS : https://nodejs.org" -ForegroundColor Red
    exit 1
}

# --- 1b. Espace disque (ENOSPC = disque plein) --------------
$drive = (Get-Item $PWD).PSDrive
$freeGB = [math]::Round($drive.Free / 1GB, 1)
if ($freeGB -lt 2) {
    Write-Host "Alerte : il ne reste que $freeGB Go libres sur $($drive.Name):." -ForegroundColor Red
    Write-Host "Next.js et Prisma ont besoin d'espace (build + moteurs). Liberez de la place :" -ForegroundColor Yellow
    Write-Host "  - Corbeille : vider la corbeille" -ForegroundColor Gray
    Write-Host "  - Fichiers temporaires : touche Windows + R -> tapez %temp% -> tout supprimer" -ForegroundColor Gray
    Write-Host "  - Caches npm : npm cache clean --force" -ForegroundColor Gray
    Write-Host "  - Caches Next : Remove-Item -Recurse -Force .next" -ForegroundColor Gray
    Write-Host "  - Ollama (modeles lourds) : ollama list puis ollama rm <modele>" -ForegroundColor Gray
    exit 1
}

# --- 2. Dependances -----------------------------------------
if (-not (Test-Path "node_modules")) {
    Write-Host "== Installation des dependances ==" -ForegroundColor Cyan
    npm install
}

# --- 3. Fichier .env ----------------------------------------
if (-not (Test-Path ".env")) {
    if (Test-Path ".env.example") {
        Copy-Item ".env.example" ".env"
        Write-Host ".env cree depuis .env.example - renseignez STRIPE_*, AGENT_ACCESS_CODE et GOOGLE_AI_API_KEY." -ForegroundColor Yellow
    } else {
        Write-Host ".env manquant et pas de .env.example." -ForegroundColor Red
        exit 1
    }
}

# --- 4. Prisma (generate si necessaire + migrate + seed) ----
Write-Host "== Prisma ==" -ForegroundColor Cyan

# `prisma generate` recopie un moteur de ~15 Mo. On ne le relance que si le
# client n'a pas encore ete genere (sinon il fait echouer tout le script
# quand le disque est plein, alors que le client existe deja).
$prismaClient = "node_modules\.prisma\client\index.js"
if (Test-Path $prismaClient) {
    Write-Host "Client Prisma deja genere - generate ignore." -ForegroundColor DarkGray
} else {
    npx prisma generate
}

npx prisma migrate deploy
npx prisma db seed

# --- 5. Ollama (demarre s'il est installe mais inactif) -----
$ollamaUp = Test-Ollama
if (-not $ollamaUp) {
    $ollamaCmd = Get-Command ollama -ErrorAction SilentlyContinue
    if ($ollamaCmd) {
        Write-Host "== Ollama installe mais inactif - demarrage ==" -ForegroundColor Cyan
        Start-Process -FilePath $ollamaCmd.Source -ArgumentList "serve" -WindowStyle Hidden | Out-Null
        for ($i = 0; $i -lt 10; $i++) {
            Start-Sleep -Seconds 1
            if (Test-Ollama) { $ollamaUp = $true; break }
        }
    }
}
if ($ollamaUp) {
    try {
        $models = & ollama list 2>$null
        if (-not ($models -match "llama3.2")) {
            Write-Host "Telechargement du modele Ollama 'llama3.2'..." -ForegroundColor Yellow
            & ollama pull llama3.2
        }
    } catch { }
    Write-Host "Ollama actif sur localhost:11434." -ForegroundColor Green
} else {
    Write-Host "Ollama absent - le chatbot utilisera Google AI puis le mode demo." -ForegroundColor Yellow
}

# --- 6. Build (uniquement en mode production) ---------------
if ($Prod) {
    Write-Host "== Build de production ==" -ForegroundColor Cyan
    npm run build
}

# --- 7. Lancement du serveur --------------------------------
$mode = if ($Prod) { "production (npm start)" } else { "developpement (npm run dev)" }
Write-Host "== Lancement du serveur $mode sur $BaseUrl ==" -ForegroundColor Cyan

if ($Prod) {
    Start-Process -FilePath "cmd.exe" -ArgumentList "/k npm start" | Out-Null
} else {
    Start-Process -FilePath "cmd.exe" -ArgumentList "/k npm run dev" | Out-Null
}

if (Wait-Http -Url $BaseUrl -TimeoutSec 120) {
    Write-Host "Serveur pret : $BaseUrl" -ForegroundColor Green
    Write-Host "Admin : $BaseUrl/admin  (admin@e-outilles.com / admin123)" -ForegroundColor Green
    Write-Host "Demo  : demo@e-outilles.com / demo123" -ForegroundColor Green
    if (-not $NoBrowser) { Start-Process $BaseUrl }
} else {
    Write-Host "Le serveur n'a pas repondu a temps. Verifiez la fenetre npm ouverte." -ForegroundColor Red
    exit 1
}
