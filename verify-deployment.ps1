# 🔍 Deployment Verification Script for tale-verse.app

Write-Host "🔍 Verifying tale-verse.app Deployment..." -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Cyan

# Test URLs
$frontendUrl = "https://www.tale-verse.app"
$backendHealthUrl = "https://api.tale-verse.app/health"
$backendDocsUrl = "https://api.tale-verse.app/api-docs"

Write-Host "`n📋 Testing Deployment..." -ForegroundColor Yellow

# Test frontend
Write-Host "`n🎨 Testing Frontend..." -ForegroundColor Magenta
try {
    $frontendResponse = Invoke-WebRequest -Uri $frontendUrl -Method GET -TimeoutSec 10
    if ($frontendResponse.StatusCode -eq 200) {
        Write-Host "✅ Frontend OK: $frontendUrl" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Frontend Status: $($frontendResponse.StatusCode)" -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ Frontend Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "   This is normal if DNS hasn't propagated yet" -ForegroundColor Yellow
}

# Test backend health
Write-Host "`n🛠️ Testing Backend Health..." -ForegroundColor Magenta
try {
    $healthResponse = Invoke-WebRequest -Uri $backendHealthUrl -Method GET -TimeoutSec 10
    if ($healthResponse.StatusCode -eq 200) {
        Write-Host "✅ Backend Health OK: $backendHealthUrl" -ForegroundColor Green
        $healthData = $healthResponse.Content | ConvertFrom-Json
        Write-Host "   Status: $($healthData.status)" -ForegroundColor Cyan
        Write-Host "   Environment: $($healthData.environment)" -ForegroundColor Cyan
    } else {
        Write-Host "⚠️  Backend Health Status: $($healthResponse.StatusCode)" -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ Backend Health Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "   This is normal if backend isn't deployed yet or DNS hasn't propagated" -ForegroundColor Yellow
}

# Test backend docs
Write-Host "`n📚 Testing Backend API Docs..." -ForegroundColor Magenta
try {
    $docsResponse = Invoke-WebRequest -Uri $backendDocsUrl -Method GET -TimeoutSec 10
    if ($docsResponse.StatusCode -eq 200) {
        Write-Host "✅ API Docs OK: $backendDocsUrl" -ForegroundColor Green
    } else {
        Write-Host "⚠️  API Docs Status: $($docsResponse.StatusCode)" -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ API Docs Error: $($_.Exception.Message)" -ForegroundColor Red
}

# DNS Check
Write-Host "`n🌐 Checking DNS Resolution..." -ForegroundColor Magenta
try {
    $dnsWww = Resolve-DnsName "www.tale-verse.app" -ErrorAction SilentlyContinue
    if ($dnsWww) {
        Write-Host "✅ DNS OK: www.tale-verse.app → $($dnsWww[0].IPAddress)" -ForegroundColor Green
    } else {
        Write-Host "⚠️  DNS not resolved: www.tale-verse.app" -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ DNS check failed for www.tale-verse.app" -ForegroundColor Red
}

try {
    $dnsApi = Resolve-DnsName "api.tale-verse.app" -ErrorAction SilentlyContinue
    if ($dnsApi) {
        Write-Host "✅ DNS OK: api.tale-verse.app → $($dnsApi[0].IPAddress)" -ForegroundColor Green
    } else {
        Write-Host "⚠️  DNS not resolved: api.tale-verse.app" -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ DNS check failed for api.tale-verse.app" -ForegroundColor Red
}

# Summary
Write-Host "`n📊 Deployment Status Summary:" -ForegroundColor Yellow
Write-Host "=============================" -ForegroundColor Cyan
Write-Host "Frontend URL:    $frontendUrl" -ForegroundColor White
Write-Host "Backend Health:  $backendHealthUrl" -ForegroundColor White
Write-Host "API Docs:        $backendDocsUrl" -ForegroundColor White

Write-Host "`n💡 If you see errors:" -ForegroundColor Yellow
Write-Host "1. DNS propagation can take 5-60 minutes" -ForegroundColor White
Write-Host "2. Make sure domains are added in Vercel/Railway dashboards" -ForegroundColor White
Write-Host "3. Check deployment logs in respective dashboards" -ForegroundColor White

Write-Host "`n🚀 Once everything is green, your platform is live!" -ForegroundColor Green