# ============================================================
#  E-Outilles - Demarrage automatique (PowerShell)
#  Usage : dans C:\E-Outilles
#     powershell -ExecutionPolicy Bypass -File .\scripts\start.ps1
#  Options :
#     -Prod        build + serveur de production (npm start)
#     -NoBrowser   ne pas ouvrir le navigateur
#  Fait tout : dependances, .env, Prisma (generate/migrate/seed),
#  Ollama, puis lance le serveur sur http://localhost:3003
# ============================================================

param(
    [switch]$Prod,
    [switch]$NoBrowser
)

$ErrorActionPreference = "Stop"
$Port = 3003
$BaseUrl = "http://localhost:$Port"

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

# --- 4. Prisma (generate + migrate + seed idempotent) -------
Write-Host "== Prisma ==" -ForegroundColor Cyan
npx prisma generate
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

if (Wait-Http -Url $BaseUrl -TimeoutSec 90) {
    Write-Host "Serveur pret : $BaseUrl" -ForegroundColor Green
    Write-Host "Admin : $BaseUrl/admin  (admin@e-outilles.com / admin123)" -ForegroundColor Green
    Write-Host "Demo  : demo@e-outilles.com / demo123" -ForegroundColor Green
    if (-not $NoBrowser) { Start-Process $BaseUrl }
} else {
    Write-Host "Le serveur n'a pas repondu a temps. Verifiez la fenetre npm ouverte." -ForegroundColor Red
    exit 1
}
