#!/usr/bin/pwsh
# Fresh deployment of Ubuntu Health with working API routes

Write-Host "🚀 Starting completely fresh deployment of Ubuntu Health..." -ForegroundColor Green

# Ensure we're in the right directory
Set-Location "D:\Ubuntu Health - DeSci Builders Hackathon Project\Ubuntu-Health---DeSci-Builders-Hackathon-Project\production-platform\frontend"

# Remove any existing Vercel config
Remove-Item -Recurse -Force .vercel -ErrorAction SilentlyContinue

Write-Host "📦 Creating new Vercel project..." -ForegroundColor Yellow

# Deploy with a clean name
vercel --prod --yes

Write-Host "✅ Fresh deployment completed!" -ForegroundColor Green

# Show the deployment URL
Write-Host "🔗 Check the deployment URL above for the API endpoints!" -ForegroundColor Cyan
Write-Host "📋 Next step: Configure the custom domain tale-verse.app" -ForegroundColor Yellow