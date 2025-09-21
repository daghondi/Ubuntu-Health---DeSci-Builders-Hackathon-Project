# DNS Configuration Checker for tale-verse.app

Write-Host "🌐 tale-verse.app DNS Configuration Checker" -ForegroundColor Cyan
Write-Host "===========================================" -ForegroundColor Cyan
Write-Host ""

# Function to check DNS record
function Test-DNSRecord {
    param($Domain, $RecordType)
    try {
        $result = Resolve-DnsName -Name $Domain -Type $RecordType -ErrorAction Stop
        return $result
    } catch {
        return $null
    }
}

# Check current DNS status
Write-Host "📋 Current DNS Status:" -ForegroundColor Yellow
Write-Host "----------------------" -ForegroundColor Yellow

# Check www subdomain
Write-Host -NoNewline "   www.tale-verse.app (CNAME): "
$wwwRecord = Test-DNSRecord -Domain "www.tale-verse.app" -RecordType "CNAME"
if ($wwwRecord -and $wwwRecord.NameHost -like "*vercel*") {
    Write-Host "✅ CONFIGURED" -ForegroundColor Green
    Write-Host "      Target: $($wwwRecord.NameHost)" -ForegroundColor Gray
} elseif ($wwwRecord) {
    Write-Host "⚠️  CONFIGURED (Wrong target)" -ForegroundColor Yellow
    Write-Host "      Current: $($wwwRecord.NameHost)" -ForegroundColor Gray
    Write-Host "      Expected: cname.vercel-dns.com" -ForegroundColor Gray
} else {
    Write-Host "❌ NOT CONFIGURED" -ForegroundColor Red
}

# Check root domain
Write-Host -NoNewline "   tale-verse.app (A): "
$rootRecord = Test-DNSRecord -Domain "tale-verse.app" -RecordType "A"
if ($rootRecord -and $rootRecord.IPAddress -eq "76.76.19.19") {
    Write-Host "✅ CONFIGURED" -ForegroundColor Green
    Write-Host "      IP: $($rootRecord.IPAddress)" -ForegroundColor Gray
} elseif ($rootRecord) {
    Write-Host "⚠️  CONFIGURED (Different IP)" -ForegroundColor Yellow
    Write-Host "      Current: $($rootRecord.IPAddress)" -ForegroundColor Gray
    Write-Host "      Expected: 76.76.19.19" -ForegroundColor Gray
} else {
    Write-Host "❌ NOT CONFIGURED" -ForegroundColor Red
}

Write-Host ""

# Test if site is accessible
Write-Host "🌍 Site Accessibility:" -ForegroundColor Yellow
Write-Host "----------------------" -ForegroundColor Yellow

# Test www subdomain
Write-Host -NoNewline "   https://www.tale-verse.app: "
try {
    $response = Invoke-WebRequest -Uri "https://www.tale-verse.app" -UseBasicParsing -TimeoutSec 10 -ErrorAction Stop
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ ACCESSIBLE" -ForegroundColor Green
    } else {
        Write-Host "⚠️  RESPONDING ($($response.StatusCode))" -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ NOT ACCESSIBLE" -ForegroundColor Red
    Write-Host "      Error: $($_.Exception.Message)" -ForegroundColor Gray
}

# Test API endpoint
Write-Host -NoNewline "   https://www.tale-verse.app/api/health: "
try {
    $apiResponse = Invoke-RestMethod -Uri "https://www.tale-verse.app/api/health" -TimeoutSec 10 -ErrorAction Stop
    if ($apiResponse.status -eq "healthy") {
        Write-Host "✅ API WORKING" -ForegroundColor Green
    } else {
        Write-Host "⚠️  API RESPONDING" -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ API NOT ACCESSIBLE" -ForegroundColor Red
}

Write-Host ""

# Provide guidance based on results
Write-Host ""
if (-not $wwwRecord) {
    Write-Host "🔧 DNS Configuration Needed:" -ForegroundColor Red
    Write-Host "=============================" -ForegroundColor Red
    Write-Host ""
    Write-Host "You need to add these DNS records at your domain registrar:" -ForegroundColor White
    Write-Host ""
    Write-Host "Record 1:" -ForegroundColor Cyan
    Write-Host "  Type: CNAME" -ForegroundColor Gray
    Write-Host "  Name: www" -ForegroundColor Gray
    Write-Host "  Value: cname.vercel-dns.com" -ForegroundColor Gray
    Write-Host "  TTL: 300" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Record 2:" -ForegroundColor Cyan
    Write-Host "  Type: A" -ForegroundColor Gray
    Write-Host "  Name: @ (or leave blank)" -ForegroundColor Gray
    Write-Host "  Value: 76.76.19.19" -ForegroundColor Gray
    Write-Host "  TTL: 300" -ForegroundColor Gray
    Write-Host ""
    Write-Host "After adding DNS records:" -ForegroundColor Yellow
    Write-Host "1. Wait 5-30 minutes for propagation" -ForegroundColor Gray
    Write-Host "2. Run this script again to verify" -ForegroundColor Gray
    Write-Host "3. Add custom domain in Vercel dashboard" -ForegroundColor Gray
}
elseif ($wwwRecord -and $wwwRecord.NameHost -like "*vercel*") {
    Write-Host "🎉 DNS Configuration Complete!" -ForegroundColor Green
    Write-Host "==============================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Yellow
    Write-Host "1. Go to Vercel Dashboard" -ForegroundColor Gray
    Write-Host "2. Select project: ubuntu-health-frontend" -ForegroundColor Gray
    Write-Host "3. Go to Settings → Domains" -ForegroundColor Gray
    Write-Host "4. Add domain: www.tale-verse.app" -ForegroundColor Gray
    Write-Host "5. Wait for SSL certificate generation" -ForegroundColor Gray
}
else {
    Write-Host "⚠️  DNS Partially Configured" -ForegroundColor Yellow
    Write-Host "=============================" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Please check your DNS records and ensure they match:" -ForegroundColor White
    Write-Host "www.tale-verse.app → CNAME → cname.vercel-dns.com" -ForegroundColor Gray
    Write-Host "tale-verse.app → A → 76.76.19.19" -ForegroundColor Gray
}

Write-Host ""
Write-Host "📞 Need Help?" -ForegroundColor Cyan
Write-Host "- Check DNS propagation online" -ForegroundColor Gray
Write-Host "- Contact your domain registrar support" -ForegroundColor Gray
Write-Host "- Vercel documentation for custom domains" -ForegroundColor Gray