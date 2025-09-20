# Ubuntu Health - Apply Biotech Theme Script
# Updates existing demos with new Infinita City inspired design

Write-Host "🧬 Ubuntu Health - Applying Biotech Theme" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Green

Write-Host "`n🎨 Theme Features:" -ForegroundColor Cyan
Write-Host "  ✅ Biotech green color palette (#00D084)" -ForegroundColor White
Write-Host "  ✅ Infinita City inspired layout" -ForegroundColor White
Write-Host "  ✅ Modern typography (Inter font)" -ForegroundColor White
Write-Host "  ✅ Gradient backgrounds and animations" -ForegroundColor White
Write-Host "  ✅ Professional biotech aesthetic" -ForegroundColor White

Write-Host "`n🚀 Available Demos:" -ForegroundColor Cyan
Write-Host "  1. New Biotech Theme Demo (biotech-theme-demo.html)" -ForegroundColor Yellow
Write-Host "  2. Original Hackathon Demo (hackathon-demo.html)" -ForegroundColor Yellow
Write-Host "  3. DeSci Demo (desci-demo.html)" -ForegroundColor Yellow
Write-Host "  4. Terminal Demo (node desci-demo-terminal.js)" -ForegroundColor Yellow

Write-Host "`n🎯 Color Palette:" -ForegroundColor Cyan
Write-Host "  Primary Green:   #00D084" -ForegroundColor Green
Write-Host "  Dark Green:      #00A86B" -ForegroundColor DarkGreen
Write-Host "  Light Green:     #4AE4B0" -ForegroundColor Green
Write-Host "  Accent Green:    #7BF5CD" -ForegroundColor Green
Write-Host "  Neon Green:      #39FF14" -ForegroundColor Green

Write-Host "`n📱 Demo URLs:" -ForegroundColor Cyan
Write-Host "  • Biotech Theme:  http://localhost:8080/biotech-theme-demo.html" -ForegroundColor White
Write-Host "  • Hackathon Demo: http://localhost:8080/hackathon-demo.html" -ForegroundColor White
Write-Host "  • DeSci Demo:     http://localhost:8080/desci-demo.html" -ForegroundColor White

Write-Host "`n🎬 What You'll See:" -ForegroundColor Cyan
Write-Host "  🧬 Modern biotech aesthetic inspired by Infinita City" -ForegroundColor White
Write-Host "  💚 Professional green color scheme replacing pink" -ForegroundColor White
Write-Host "  ✨ Smooth animations and hover effects" -ForegroundColor White
Write-Host "  📊 Sarah's $400K CAR-T therapy journey" -ForegroundColor White
Write-Host "  🔬 Advanced medical treatment focus" -ForegroundColor White
Write-Host "  🌐 Network State infrastructure relevance" -ForegroundColor White

Write-Host "`n📋 Key Design Elements:" -ForegroundColor Cyan
Write-Host "  • Clean hero section with gradient backgrounds" -ForegroundColor White
Write-Host "  • Card-based layout with hover animations" -ForegroundColor White
Write-Host "  • Modern typography and spacing" -ForegroundColor White
Write-Host "  • Biotech-themed icons and imagery" -ForegroundColor White
Write-Host "  • Responsive design for all devices" -ForegroundColor White

$choice = Read-Host "`n🚀 Which demo would you like to open? (1-4, or 'all' for all demos)"

switch ($choice) {
    "1" {
        Write-Host "`n🧬 Opening Biotech Theme Demo..." -ForegroundColor Green
        Start-Process "http://localhost:8080/biotech-theme-demo.html"
    }
    "2" {
        Write-Host "`n🎭 Opening Hackathon Demo..." -ForegroundColor Green
        Start-Process "http://localhost:8080/hackathon-demo.html"
    }
    "3" {
        Write-Host "`n🔬 Opening DeSci Demo..." -ForegroundColor Green
        Start-Process "http://localhost:8080/desci-demo.html"
    }
    "4" {
        Write-Host "`n💻 Terminal Demo Instructions:" -ForegroundColor Green
        Write-Host "   Run: node desci-demo-terminal.js" -ForegroundColor Yellow
        Write-Host "   This shows Sarah's complete journey in terminal format" -ForegroundColor White
    }
    "all" {
        Write-Host "`n🌟 Opening all web demos..." -ForegroundColor Green
        Start-Process "http://localhost:8080/biotech-theme-demo.html"
        Start-Sleep -Seconds 1
        Start-Process "http://localhost:8080/hackathon-demo.html"
        Start-Sleep -Seconds 1
        Start-Process "http://localhost:8080/desci-demo.html"
        Write-Host "`n💻 For terminal demo, run: node desci-demo-terminal.js" -ForegroundColor Yellow
    }
    default {
        Write-Host "`n🧬 Opening default Biotech Theme Demo..." -ForegroundColor Green
        Start-Process "http://localhost:8080/biotech-theme-demo.html"
    }
}

Write-Host "`n✨ Theme Features Showcase:" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green
Write-Host "  🎨 Biotech green gradients and animations" -ForegroundColor White
Write-Host "  💳 Professional card layouts with hover effects" -ForegroundColor White
Write-Host "  📊 Real treatment statistics and success metrics" -ForegroundColor White
Write-Host "  🔗 Smooth navigation and user interactions" -ForegroundColor White
Write-Host "  📱 Fully responsive design for all screen sizes" -ForegroundColor White

Write-Host "`n🎯 Sarah's CAR-T Journey Highlights:" -ForegroundColor Green
Write-Host "====================================" -ForegroundColor Green
Write-Host "  💔 Crisis: $400K treatment needed, insurance denied" -ForegroundColor White
Write-Host "  🔍 Discovery: CAR-T therapy at Swiss Cancer Institute" -ForegroundColor White
Write-Host "  🤝 Funding: 3 sponsors commit full $400K" -ForegroundColor White
Write-Host "  🏥 Treatment: 6-week therapy with blockchain verification" -ForegroundColor White
Write-Host "  🎉 Success: 95% tumor reduction, full remission" -ForegroundColor White

Write-Host "`n🧬 Ready to showcase Ubuntu Health with professional biotech theming!" -ForegroundColor Green
Write-Host "🎬 Perfect for video recording and hackathon presentations!" -ForegroundColor Magenta