# 🚀 One-Click Deployment Script for tale-verse.app
# This script deploys both frontend and backend with custom domains

param(
    [string]$JwtSecret = "your-super-secret-jwt-key-minimum-32-characters-ubuntu-health-2025"
)

Write-Host "🚀 Deploying Ubuntu Health to tale-verse.app..." -ForegroundColor Green
Write-Host "=====================================================" -ForegroundColor Cyan

# Check prerequisites
Write-Host "🔍 Checking prerequisites..." -ForegroundColor Yellow

# Check if in correct directory
if (!(Test-Path "production-platform\frontend\package.json")) {
    Write-Host "❌ Error: Please run this script from the project root directory" -ForegroundColor Red
    Write-Host "Expected to find: production-platform/frontend/package.json" -ForegroundColor Red
    exit 1
}

# Install CLIs if needed
Write-Host "📦 Installing deployment tools..." -ForegroundColor Yellow

# Install Vercel CLI
if (!(Get-Command vercel -ErrorAction SilentlyContinue)) {
    Write-Host "Installing Vercel CLI..." -ForegroundColor Cyan
    npm install -g vercel
}

# Install Railway CLI
if (!(Get-Command railway -ErrorAction SilentlyContinue)) {
    Write-Host "Installing Railway CLI..." -ForegroundColor Cyan
    npm install -g @railway/cli
}

Write-Host "✅ Prerequisites ready!" -ForegroundColor Green

# =====================================
# STEP 1: DEPLOY FRONTEND TO VERCEL
# =====================================

Write-Host "`n🎨 STEP 1: Deploying Frontend to Vercel..." -ForegroundColor Magenta
Write-Host "=============================================" -ForegroundColor Cyan

# Login to Vercel
Write-Host "🔐 Please login to Vercel if prompted..." -ForegroundColor Yellow
vercel login

# Deploy frontend
Set-Location "production-platform\frontend"
Write-Host "🚀 Deploying frontend..." -ForegroundColor Yellow

# Set environment variables for Vercel
Write-Host "🔧 Setting environment variables..." -ForegroundColor Yellow
vercel env add NEXT_PUBLIC_API_URL "https://api.tale-verse.app" production
vercel env add NEXT_PUBLIC_SOLANA_NETWORK "devnet" production
vercel env add NEXT_PUBLIC_SOLANA_RPC_URL "https://api.devnet.solana.com" production

# Deploy to production
Write-Host "🚀 Deploying to production..." -ForegroundColor Yellow
vercel --prod --yes

# Add custom domain
Write-Host "🌐 Adding custom domain..." -ForegroundColor Yellow
vercel domains add www.tale-verse.app

Write-Host "✅ Frontend deployed to Vercel!" -ForegroundColor Green
Set-Location "..\.."

# =====================================
# STEP 2: DEPLOY BACKEND TO RAILWAY
# =====================================

Write-Host "`n🛠️ STEP 2: Deploying Backend to Railway..." -ForegroundColor Magenta
Write-Host "==========================================" -ForegroundColor Cyan

# Login to Railway
Write-Host "🔐 Please login to Railway if prompted..." -ForegroundColor Yellow
railway login

# Deploy backend
Set-Location "production-platform\backend"
Write-Host "🚀 Deploying backend..." -ForegroundColor Yellow

# Initialize Railway project
railway project create ubuntu-health-api

# Set environment variables
Write-Host "🔧 Setting environment variables..." -ForegroundColor Yellow
railway variables set NODE_ENV="production"
railway variables set PORT="3001"
railway variables set JWT_SECRET="$JwtSecret"
railway variables set CORS_ORIGIN="https://www.tale-verse.app,https://tale-verse.app"
railway variables set SOLANA_RPC_URL="https://api.devnet.solana.com"
railway variables set SOLANA_COMMITMENT="confirmed"

# Deploy
Write-Host "🚀 Deploying to Railway..." -ForegroundColor Yellow
railway up --detach

# Add custom domain
Write-Host "🌐 Adding custom domain..." -ForegroundColor Yellow
Write-Host "⚠️  Manual step: Add 'api.tale-verse.app' domain in Railway dashboard" -ForegroundColor Yellow
Write-Host "    Go to: https://railway.app → Your Project → Settings → Networking → Custom Domain" -ForegroundColor Yellow

Write-Host "✅ Backend deployed to Railway!" -ForegroundColor Green
Set-Location "..\.."

# =====================================
# STEP 3: VERIFICATION & NEXT STEPS
# =====================================

Write-Host "`n🎉 DEPLOYMENT COMPLETE!" -ForegroundColor Green
Write-Host "========================" -ForegroundColor Cyan

Write-Host "`n📋 Your Deployed URLs:" -ForegroundColor Yellow
Write-Host "Frontend: https://www.tale-verse.app" -ForegroundColor Cyan
Write-Host "Backend:  https://api.tale-verse.app (after domain setup)" -ForegroundColor Cyan

Write-Host "`n🌐 DNS Configuration Needed:" -ForegroundColor Yellow
Write-Host "1. Add CNAME record: www.tale-verse.app → cname.vercel-dns.com" -ForegroundColor White
Write-Host "2. Add CNAME record: api.tale-verse.app → [Railway domain from dashboard]" -ForegroundColor White

Write-Host "`n✅ Test Your Deployment:" -ForegroundColor Yellow
Write-Host "1. Visit: https://www.tale-verse.app" -ForegroundColor White
Write-Host "2. Connect wallet (Phantom/Solflare)" -ForegroundColor White
Write-Host "3. Login and verify authentication works" -ForegroundColor White

Write-Host "`n🚀 Your Ubuntu Health platform is now LIVE!" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Cyan