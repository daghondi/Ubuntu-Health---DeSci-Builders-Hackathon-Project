# Ubuntu Health - Video Demo Recording Script
# PowerShell automation for capturing user flows

Write-Host "🎬 Ubuntu Health - Video Demo Recording Setup" -ForegroundColor Cyan
Write-Host "=====================================================" -ForegroundColor Cyan

# Check if HTTP server is running
Write-Host "`n📡 Checking local server status..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8080" -UseBasicParsing -TimeoutSec 5
    Write-Host "✅ Local server is running on port 8080" -ForegroundColor Green
} catch {
    Write-Host "❌ Local server not detected. Starting HTTP server..." -ForegroundColor Red
    Write-Host "💡 Run this command in a separate terminal: python -m http.server 8080" -ForegroundColor Yellow
    Write-Host "   Then press any key to continue..." -ForegroundColor Yellow
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
}

Write-Host "`n🎯 Demo Recording Sequence:" -ForegroundColor Cyan

# Demo URLs and descriptions
$demoSequence = @(
    @{
        Name = "Patient Perspective (Sarah Chen)"
        URL = "http://localhost:8080/hackathon-demo.html"
        Description = "Record Sarah's $400K CAR-T therapy journey"
        Duration = "2-3 minutes"
    },
    @{
        Name = "Donor Dashboard"
        URL = "http://localhost:8080/desci-demo.html"
        Description = "Record sponsor matching and funding process"
        Duration = "2-3 minutes"
    },
    @{
        Name = "Terminal Demo (Medical Professional)"
        Command = "node desci-demo-terminal.js"
        Description = "Record provider milestone verification"
        Duration = "1-2 minutes"
    }
)

foreach ($demo in $demoSequence) {
    Write-Host "`n🎭 $($demo.Name)" -ForegroundColor Green
    Write-Host "   📝 $($demo.Description)" -ForegroundColor White
    Write-Host "   ⏱️  Duration: $($demo.Duration)" -ForegroundColor Yellow
    
    if ($demo.URL) {
        Write-Host "   🌐 URL: $($demo.URL)" -ForegroundColor Cyan
        Write-Host "   📋 Press ENTER to open in browser..." -ForegroundColor Yellow
        Read-Host
        Start-Process $demo.URL
    }
    
    if ($demo.Command) {
        Write-Host "   💻 Command: $($demo.Command)" -ForegroundColor Cyan
        Write-Host "   📋 Press ENTER to run terminal demo..." -ForegroundColor Yellow
        Read-Host
        # Don't auto-run, just show the command
        Write-Host "   ▶️  Run this in terminal: $($demo.Command)" -ForegroundColor Magenta
    }
    
    Write-Host "   🎥 Start your screen recording NOW" -ForegroundColor Red
    Write-Host "   ✅ Press ENTER when recording is complete..." -ForegroundColor Yellow
    Read-Host
}

Write-Host "`n🎬 Key Recording Reminders:" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan

$recordingTips = @(
    "📹 Record at 1920x1080 resolution minimum",
    "🔊 Test audio levels before starting",
    "⏰ Pause 2-3 seconds between clicks",
    "🎯 Highlight important UI elements",
    "💰 Emphasize key numbers: $400K, 95% success, 312% ROI",
    "🔒 Show blockchain verification animations",
    "📊 Capture milestone completion confirmations",
    "🧬 Focus on CAR-T therapy specifics"
)

foreach ($tip in $recordingTips) {
    Write-Host "   $tip" -ForegroundColor White
}

Write-Host "`n📊 Success Metrics to Highlight:" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan

$metrics = @{
    "Sarah's Treatment Cost" = "$400,000"
    "Tumor Reduction Success" = "95%"
    "Average Sponsor ROI" = "312%"
    "Active Research Studies" = "12"
    "Treatment Success Rate" = "85%"
    "Treatment Duration" = "6 weeks"
}

foreach ($metric in $metrics.GetEnumerator()) {
    Write-Host "   💡 $($metric.Key): $($metric.Value)" -ForegroundColor Yellow
}

Write-Host "`n🚀 Platform Technical Highlights:" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan

$techHighlights = @(
    "✅ 3 Production-ready Rust/Solana smart contracts",
    "✅ 5 DeSci tracks completely covered",
    "✅ Multi-format demos (Web, Terminal, React)",
    "✅ Real-time blockchain milestone verification",
    "✅ Privacy-preserving research contribution",
    "✅ Network State infrastructure relevance"
)

foreach ($highlight in $techHighlights) {
    Write-Host "   $highlight" -ForegroundColor Green
}

Write-Host "`n🎯 Video Structure Overview:" -ForegroundColor Cyan
Write-Host "============================" -ForegroundColor Cyan

Write-Host "   🎭 Act 1: Patient Crisis (Sarah needs $400K CAR-T therapy)" -ForegroundColor White
Write-Host "   💰 Act 2: Community Funding (3 sponsors commit $400K)" -ForegroundColor White
Write-Host "   🏥 Act 3: Medical Treatment (Dr. Weber provides care)" -ForegroundColor White
Write-Host "   🎉 Act 4: Success & Impact (95% tumor reduction + research)" -ForegroundColor White
Write-Host "   🌟 Act 5: Global Platform Impact (Network State infrastructure)" -ForegroundColor White

Write-Host "`n🎬 Ready to create your Ubuntu Health video demonstration!" -ForegroundColor Green
Write-Host "📧 For questions, refer to VIDEO_USER_FLOW_SCRIPT.md" -ForegroundColor Yellow
Write-Host "📚 Full production details in VIDEO_PRODUCTION_GUIDE.md" -ForegroundColor Yellow

Write-Host "`n✨ Happy filming! Your video will showcase the future of decentralized healthcare! ✨" -ForegroundColor Magenta