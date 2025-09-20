# Ubuntu Health Deployment Script (PowerShell)
# This script helps deploy the Ubuntu Health platform to tale-verse.app

param(
    [Parameter(Position=0)]
    [ValidateSet("all", "frontend", "backend", "info")]
    [string]$Target = "all"
)

Write-Host "🚀 Ubuntu Health Deployment Script" -ForegroundColor Green
Write-Host "==================================" -ForegroundColor Green

# Check if we're in the right directory
if (-not (Test-Path "production-platform")) {
    Write-Host "❌ Error: Please run this script from the project root directory" -ForegroundColor Red
    exit 1
}

function Deploy-Frontend {
    Write-Host "📦 Deploying Frontend to Vercel..." -ForegroundColor Yellow
    Set-Location "production-platform/frontend"
    
    # Install dependencies if needed
    if (-not (Test-Path "node_modules")) {
        Write-Host "📥 Installing frontend dependencies..." -ForegroundColor Blue
        npm install
    }
    
    # Build for production
    Write-Host "🔨 Building frontend..." -ForegroundColor Blue
    npm run build
    
    # Deploy to Vercel (requires Vercel CLI)
    if (Get-Command vercel -ErrorAction SilentlyContinue) {
        Write-Host "🚀 Deploying to Vercel..." -ForegroundColor Green
        vercel --prod --confirm
    } else {
        Write-Host "⚠️  Vercel CLI not found. Please install: npm i -g vercel" -ForegroundColor Yellow
        Write-Host "📋 Manual deployment steps:" -ForegroundColor Cyan
        Write-Host "   1. Install Vercel CLI: npm i -g vercel" -ForegroundColor White
        Write-Host "   2. Run: vercel login" -ForegroundColor White
        Write-Host "   3. Run: vercel --prod" -ForegroundColor White
    }
    
    Set-Location "../.."
}

function Prepare-Backend {
    Write-Host "⚙️  Preparing Backend for deployment..." -ForegroundColor Yellow
    Set-Location "production-platform/backend"
    
    # Install dependencies if needed
    if (-not (Test-Path "node_modules")) {
        Write-Host "📥 Installing backend dependencies..." -ForegroundColor Blue
        npm install
    }
    
    # Build TypeScript
    Write-Host "🔨 Building backend..." -ForegroundColor Blue
    npm run build
    
    Write-Host "✅ Backend prepared for deployment" -ForegroundColor Green
    Write-Host "📋 Next steps for backend deployment:" -ForegroundColor Cyan
    Write-Host "   1. Choose hosting platform (Railway, DigitalOcean, AWS, etc.)" -ForegroundColor White
    Write-Host "   2. Set up PostgreSQL database" -ForegroundColor White
    Write-Host "   3. Configure environment variables" -ForegroundColor White
    Write-Host "   4. Deploy using platform-specific method" -ForegroundColor White
    
    Set-Location "../.."
}

function Show-DeploymentInfo {
    Write-Host ""
    Write-Host "🌐 Deployment Information" -ForegroundColor Green
    Write-Host "========================" -ForegroundColor Green
    Write-Host "Frontend URL: https://www.tale-verse.app" -ForegroundColor Cyan
    Write-Host "Backend API: https://api.tale-verse.app" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "📋 Required Environment Variables:" -ForegroundColor Yellow
    Write-Host "Frontend (.env.local):" -ForegroundColor Magenta
    Write-Host "  NEXT_PUBLIC_API_URL=https://api.tale-verse.app" -ForegroundColor White
    Write-Host "  NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com" -ForegroundColor White
    Write-Host ""
    Write-Host "Backend (.env):" -ForegroundColor Magenta
    Write-Host "  NODE_ENV=production" -ForegroundColor White
    Write-Host "  DATABASE_URL=postgresql://..." -ForegroundColor White
    Write-Host "  JWT_SECRET=your-secure-secret" -ForegroundColor White
    Write-Host "  CORS_ORIGIN=https://www.tale-verse.app" -ForegroundColor White
    Write-Host ""
    Write-Host "📚 Full deployment guide: DEPLOYMENT_GUIDE.md" -ForegroundColor Blue
}

# Main deployment flow
switch ($Target) {
    "frontend" {
        Deploy-Frontend
    }
    "backend" {
        Prepare-Backend
    }
    "info" {
        Show-DeploymentInfo
    }
    default {
        Write-Host "🔄 Full deployment preparation..." -ForegroundColor Blue
        Deploy-Frontend
        Prepare-Backend
        Show-DeploymentInfo
    }
}

Write-Host ""
Write-Host "✅ Deployment script completed!" -ForegroundColor Green
Write-Host "🎯 Ready to deploy to tale-verse.app" -ForegroundColor Green