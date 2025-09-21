# 🔧 Domain Conflict Resolution Script for tale-verse.app

Write-Host "🔧 Resolving tale-verse.app domain conflict..." -ForegroundColor Yellow
Write-Host "=============================================" -ForegroundColor Cyan

Write-Host "`n📋 MANUAL STEPS REQUIRED:" -ForegroundColor Yellow
Write-Host "Since the domain is assigned to another project, please follow these steps:`n" -ForegroundColor White

Write-Host "1. 🌐 Open Vercel Dashboard:" -ForegroundColor Cyan
Write-Host "   https://vercel.com/dashboard" -ForegroundColor White

Write-Host "`n2. 🔍 Find the conflicting project:" -ForegroundColor Cyan
Write-Host "   - Look for project named 'tale-verse' or similar" -ForegroundColor White
Write-Host "   - Or search for projects using 'tale-verse.app'" -ForegroundColor White

Write-Host "`n3. 🗑️ Remove domain from old project:" -ForegroundColor Cyan
Write-Host "   - Go to: Project → Settings → Domains" -ForegroundColor White
Write-Host "   - Find 'tale-verse.app' and click 'Remove'" -ForegroundColor White
Write-Host "   - Confirm removal" -ForegroundColor White

Write-Host "`n4. ➕ Add domain to Ubuntu Health project:" -ForegroundColor Cyan
Write-Host "   - Go to: ubuntu-health-frontend → Settings → Domains" -ForegroundColor White
Write-Host "   - Add domain: 'tale-verse.app'" -ForegroundColor White
Write-Host "   - Add domain: 'www.tale-verse.app'" -ForegroundColor White

Write-Host "`n5. 🔄 Or delete the old project entirely:" -ForegroundColor Cyan
Write-Host "   - Go to old project → Settings → Advanced" -ForegroundColor White
Write-Host "   - Click 'Delete Project'" -ForegroundColor White
Write-Host "   - Type project name to confirm" -ForegroundColor White

Write-Host "`n⚡ ALTERNATIVE - Quick CLI Resolution:" -ForegroundColor Magenta
Write-Host "If you want to use a different domain temporarily:" -ForegroundColor White

# Try alternative domains
$alternativeDomains = @(
    "ubuntu-health.tale-verse.app",
    "health.tale-verse.app",
    "app.tale-verse.app"
)

Write-Host "`n🎯 Try these alternative domains:" -ForegroundColor Yellow
foreach ($domain in $alternativeDomains) {
    Write-Host "   vercel domains add $domain" -ForegroundColor Cyan
}

Write-Host "`n📞 Or continue with current working URL:" -ForegroundColor Green
Write-Host "   Your app is already live at:" -ForegroundColor White
Write-Host "   https://ubuntu-health-frontend.vercel.app" -ForegroundColor Cyan

Write-Host "`nPress Enter after you've resolved the domain conflict in the dashboard..." -ForegroundColor Yellow
Read-Host

# Try adding the domain again
Write-Host "`n🚀 Attempting to add tale-verse.app domain..." -ForegroundColor Green
try {
    vercel domains add tale-verse.app
    Write-Host "✅ Successfully added tale-verse.app!" -ForegroundColor Green
} catch {
    Write-Host "❌ Still conflicted. Please complete manual steps above." -ForegroundColor Red
}

try {
    vercel domains add www.tale-verse.app
    Write-Host "✅ Successfully added www.tale-verse.app!" -ForegroundColor Green
} catch {
    Write-Host "❌ Still conflicted. Please complete manual steps above." -ForegroundColor Red
}

Write-Host "`n🎉 Once domains are added, your app will be live at:" -ForegroundColor Green
Write-Host "   https://tale-verse.app" -ForegroundColor Cyan
Write-Host "   https://www.tale-verse.app" -ForegroundColor Cyan