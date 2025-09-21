# Quick DNS Verification for New Vercel IP Requirements
# Run this AFTER updating your DNS records

Write-Host "🔍 Checking updated DNS configuration..." -ForegroundColor Cyan
Write-Host ""

# Check root domain for new IP
Write-Host "1. Checking tale-verse.app A record (should be 216.198.79.1)..." -ForegroundColor Yellow
$rootResult = nslookup "tale-verse.app" 2>&1
Write-Host $rootResult -ForegroundColor Gray

if ($rootResult -match "216.198.79.1") {
    Write-Host "✅ SUCCESS: Root domain using NEW Vercel IP!" -ForegroundColor Green
} elseif ($rootResult -match "76.76.19.19") {
    Write-Host "❌ STILL OLD: DNS still shows old IP - change may be propagating" -ForegroundColor Yellow
} else {
    Write-Host "⚠️  UNKNOWN: Unexpected IP found - check your DNS provider" -ForegroundColor Red
}

Write-Host ""

# Check www subdomain  
Write-Host "2. Checking www.tale-verse.app CNAME..." -ForegroundColor Yellow
$wwwResult = nslookup "www.tale-verse.app" 2>&1
Write-Host $wwwResult -ForegroundColor Gray

if ($wwwResult -match "cname.vercel-dns.com") {
    Write-Host "✅ SUCCESS: www subdomain correctly configured!" -ForegroundColor Green
} else {
    Write-Host "❌ ISSUE: www subdomain not pointing to Vercel CNAME" -ForegroundColor Red
}

Write-Host ""
Write-Host "📋 NEXT STEPS:" -ForegroundColor Cyan
Write-Host "1. If you see ✅ for root domain: Check Vercel dashboard - 'Invalid Configuration' should be gone" -ForegroundColor Green
Write-Host "2. If you see ❌ STILL OLD: Wait 15 more minutes for DNS propagation" -ForegroundColor Yellow  
Write-Host "3. If both ✅: Try adding domain in Vercel again - should work now!" -ForegroundColor Green