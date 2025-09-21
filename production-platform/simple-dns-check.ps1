Write-Host "🌐 tale-verse.app DNS Configuration Checker" -ForegroundColor Cyan
Write-Host "===========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "📋 Checking DNS Configuration..." -ForegroundColor Yellow
Write-Host ""

# Check www subdomain
Write-Host -NoNewline "Checking www.tale-verse.app: "
try {
    $wwwRecord = Resolve-DnsName -Name "www.tale-verse.app" -Type CNAME -ErrorAction Stop
    if ($wwwRecord.NameHost -like "*vercel*") {
        Write-Host "✅ CONFIGURED CORRECTLY" -ForegroundColor Green
        Write-Host "   Target: $($wwwRecord.NameHost)" -ForegroundColor Gray
    } else {
        Write-Host "⚠️  CONFIGURED (Wrong target)" -ForegroundColor Yellow
        Write-Host "   Current: $($wwwRecord.NameHost)" -ForegroundColor Gray
        Write-Host "   Expected: cname.vercel-dns.com" -ForegroundColor Gray
    }
} catch {
    Write-Host "❌ NOT CONFIGURED" -ForegroundColor Red
    Write-Host "   Need to add CNAME record" -ForegroundColor Gray
}

# Check root domain
Write-Host -NoNewline "Checking tale-verse.app: "
try {
    $rootRecord = Resolve-DnsName -Name "tale-verse.app" -Type A -ErrorAction Stop
    if ($rootRecord.IPAddress -eq "76.76.19.19") {
        Write-Host "✅ CONFIGURED CORRECTLY" -ForegroundColor Green
        Write-Host "   IP: $($rootRecord.IPAddress)" -ForegroundColor Gray
    } else {
        Write-Host "⚠️  CONFIGURED (Different IP)" -ForegroundColor Yellow
        Write-Host "   Current: $($rootRecord.IPAddress)" -ForegroundColor Gray
        Write-Host "   Expected: 76.76.19.19" -ForegroundColor Gray
    }
} catch {
    Write-Host "❌ NOT CONFIGURED" -ForegroundColor Red
    Write-Host "   Need to add A record" -ForegroundColor Gray
}

Write-Host ""
Write-Host "🌍 Testing Site Accessibility..." -ForegroundColor Yellow
Write-Host ""

# Test www subdomain
Write-Host -NoNewline "Testing https://www.tale-verse.app: "
try {
    $response = Invoke-WebRequest -Uri "https://www.tale-verse.app" -UseBasicParsing -TimeoutSec 10 -ErrorAction Stop
    Write-Host "✅ ACCESSIBLE" -ForegroundColor Green
} catch {
    Write-Host "❌ NOT ACCESSIBLE" -ForegroundColor Red
}

Write-Host ""
Write-Host "🔧 REQUIRED DNS RECORDS:" -ForegroundColor Red
Write-Host "=========================" -ForegroundColor Red
Write-Host ""
Write-Host "At your domain registrar for tale-verse.app, add:" -ForegroundColor White
Write-Host ""
Write-Host "Record 1 (CNAME):" -ForegroundColor Cyan
Write-Host "  Name/Host: www" -ForegroundColor Gray
Write-Host "  Type: CNAME" -ForegroundColor Gray
Write-Host "  Value: cname.vercel-dns.com" -ForegroundColor Gray
Write-Host "  TTL: 300" -ForegroundColor Gray
Write-Host ""
Write-Host "Record 2 (A):" -ForegroundColor Cyan
Write-Host "  Name/Host: @ (or blank for root)" -ForegroundColor Gray
Write-Host "  Type: A" -ForegroundColor Gray
Write-Host "  Value: 76.76.19.19" -ForegroundColor Gray
Write-Host "  TTL: 300" -ForegroundColor Gray
Write-Host ""
Write-Host "📋 NEXT STEPS:" -ForegroundColor Yellow
Write-Host "1. Add the DNS records above at your registrar" -ForegroundColor Gray
Write-Host "2. Wait 5-30 minutes for DNS propagation" -ForegroundColor Gray
Write-Host "3. Run this script again to verify" -ForegroundColor Gray
Write-Host "4. Add custom domain in Vercel dashboard" -ForegroundColor Gray
Write-Host "5. Your site will be live at https://www.tale-verse.app" -ForegroundColor Gray