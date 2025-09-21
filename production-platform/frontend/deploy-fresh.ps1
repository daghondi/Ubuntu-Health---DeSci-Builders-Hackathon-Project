#!/usr/bin/pwsh
# Fresh deployment script for Ubuntu Health API

Write-Host "🚀 Deploying Ubuntu Health with working API routes..." -ForegroundColor Green

# Remove any existing Vercel configuration
Remove-Item -Recurse -Force .vercel -ErrorAction SilentlyContinue

# Create a fresh deployment with auto-detected settings
Write-Host "📦 Creating new Vercel project..." -ForegroundColor Yellow

# Deploy with explicit settings
vercel --prod --confirm --name "ubuntu-health-api-fixed" --yes

Write-Host "✅ Deployment completed!" -ForegroundColor Green
Write-Host "🔗 Testing API endpoint..." -ForegroundColor Yellow

# Wait a moment for deployment to propagate
Start-Sleep -Seconds 30

# Test the deployment (will be updated with actual URL after deployment)
Write-Host "🧪 Manual testing required - check the deployed URL for /api/health endpoint" -ForegroundColor Cyan