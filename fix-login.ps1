# Run this in PowerShell to fix the login page issue

# Stop any running Next.js processes
Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force

# Clean all caches
Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force node_modules/.cache -ErrorAction SilentlyContinue

# Fetch latest from GitHub (branche de travail)
$Branch = "fix/finalisation-build-admin-auth"
git fetch origin $Branch
git checkout $Branch
git pull origin $Branch

# Clean install
npm ci

# Build
npm run build

# Start
npm run dev
