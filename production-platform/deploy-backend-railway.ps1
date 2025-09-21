# Railway Deployment Script for Ubuntu Health Backend (PowerShell)

Write-Host "🚀 Deploying Ubuntu Health Backend to Railway..." -ForegroundColor Green

# Check if Railway CLI is installed
if (!(Get-Command railway -ErrorAction SilentlyContinue)) {
    Write-Host "Installing Railway CLI..." -ForegroundColor Yellow
    npm install -g @railway/cli
}

# Login to Railway (if not already logged in)
Write-Host "Please login to Railway if prompted..." -ForegroundColor Yellow
railway login

# Initialize Railway project
Set-Location "production-platform\backend"
railway project create ubuntu-health-api

# Set environment variables
Write-Host "Setting environment variables..." -ForegroundColor Yellow
railway variables set NODE_ENV=production
railway variables set PORT=3001
railway variables set JWT_SECRET="your-super-secret-jwt-key-minimum-32-characters-here"
railway variables set CORS_ORIGIN="https://www.tale-verse.app,https://tale-verse.app"
railway variables set SOLANA_RPC_URL="https://api.devnet.solana.com"
railway variables set SOLANA_COMMITMENT="confirmed"

# Deploy
Write-Host "Deploying to Railway..." -ForegroundColor Yellow
railway up

Write-Host "✅ Backend deployed! Check Railway dashboard for domain setup." -ForegroundColor Green
Write-Host "Next: Add custom domain 'api.tale-verse.app' in Railway dashboard" -ForegroundColor Cyan