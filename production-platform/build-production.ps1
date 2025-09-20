#!/usr/bin/env pwsh
# Ubuntu Health - Build Production

Write-Host "🏗️ Building Ubuntu Health Production" -ForegroundColor Green

Write-Host "Building backend..." -ForegroundColor Cyan
Set-Location backend
npm run build

Write-Host "Building frontend..." -ForegroundColor Cyan
Set-Location ../frontend
npm run build

Write-Host "Type checking..." -ForegroundColor Cyan
npm run type-check

Set-Location ..
Write-Host "✅ Production build complete!" -ForegroundColor Green
