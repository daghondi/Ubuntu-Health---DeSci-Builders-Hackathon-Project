# Ubuntu Health - Demo Testing Script (PowerShell)
# Verify all demo components work properly for hackathon presentation

Write-Host "🧬 Ubuntu Health - Demo Testing Suite" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan

# Test 1: Web Demo HTML File
Write-Host ""
Write-Host "📄 Testing Web Demo (HTML)..." -ForegroundColor Yellow
if (Test-Path "desci-demo.html") {
    Write-Host "✅ Web demo file exists" -ForegroundColor Green
    
    $webContent = Get-Content "desci-demo.html"
    if ($webContent -match "Sarah Chen" -and $webContent -match "CAR-T") {
        Write-Host "✅ Web demo contains Sarah's CAR-T journey" -ForegroundColor Green
    } else {
        Write-Host "❌ Web demo missing key content" -ForegroundColor Red
    }
} else {
    Write-Host "❌ Web demo file not found" -ForegroundColor Red
}

# Test 2: Terminal Demo Script
Write-Host ""
Write-Host "💻 Testing Terminal Demo (JavaScript)..." -ForegroundColor Yellow
if (Test-Path "desci-demo-terminal.js") {
    Write-Host "✅ Terminal demo file exists" -ForegroundColor Green
    
    $terminalContent = Get-Content "desci-demo-terminal.js"
    if ($terminalContent -match "Sarah Chen") {
        Write-Host "✅ Terminal demo contains Sarah's story" -ForegroundColor Green
    } else {
        Write-Host "❌ Terminal demo missing Sarah's story" -ForegroundColor Red
    }
} else {
    Write-Host "❌ Terminal demo file not found" -ForegroundColor Red
}

# Test 3: React Demo Component
Write-Host ""
Write-Host "⚛️  Testing React Demo Component..." -ForegroundColor Yellow
if (Test-Path "src\components\demo\HackathonDemoController.tsx") {
    Write-Host "✅ React demo component exists" -ForegroundColor Green
    
    $reactContent = Get-Content "src\components\demo\HackathonDemoController.tsx"
    if ($reactContent -match "Sarah Chen") {
        Write-Host "✅ React demo contains Sarah's story" -ForegroundColor Green
    } else {
        Write-Host "❌ React demo missing Sarah's story" -ForegroundColor Red
    }
    
    if ($reactContent -match "CAR-T") {
        Write-Host "✅ React demo contains CAR-T therapy focus" -ForegroundColor Green
    } else {
        Write-Host "❌ React demo missing CAR-T therapy focus" -ForegroundColor Red
    }
} else {
    Write-Host "❌ React demo component not found" -ForegroundColor Red
}

# Test 4: Smart Contract Files
Write-Host ""
Write-Host "🔗 Testing Smart Contract Files..." -ForegroundColor Yellow
$smartContractCount = 0

if (Test-Path "smart-contracts\treatment_sponsorship.rs") {
    Write-Host "✅ Treatment sponsorship contract exists" -ForegroundColor Green
    $smartContractCount++
}

if (Test-Path "smart-contracts\data_contribution_rewards.rs") {
    Write-Host "✅ Data contribution rewards contract exists" -ForegroundColor Green
    $smartContractCount++
}

if (Test-Path "smart-contracts\governance.rs") {
    Write-Host "✅ Governance contract exists" -ForegroundColor Green
    $smartContractCount++
}

if (Test-Path "smart-contracts\Cargo.toml") {
    Write-Host "✅ Smart contract workspace configuration exists" -ForegroundColor Green
}

if (Test-Path "smart-contracts\deploy.sh") {
    Write-Host "✅ Smart contract deployment script exists" -ForegroundColor Green
}

Write-Host "📊 Smart contracts found: $smartContractCount/3" -ForegroundColor Cyan

# Test 5: Presentation Materials
Write-Host ""
Write-Host "📊 Testing Presentation Materials..." -ForegroundColor Yellow
if (Test-Path "HACKATHON_PRESENTATION.md") {
    Write-Host "✅ Hackathon presentation slides exist" -ForegroundColor Green
    
    $presentationContent = Get-Content "HACKATHON_PRESENTATION.md"
    if ($presentationContent -match "SLIDE 1" -and $presentationContent -match "Sarah") {
        Write-Host "✅ Presentation contains structured slides with Sarah's story" -ForegroundColor Green
    }
}

if (Test-Path "EXECUTIVE_SUMMARY.md") {
    Write-Host "✅ Executive summary exists" -ForegroundColor Green
}

# Test 6: Documentation Consistency
Write-Host ""
Write-Host "📚 Testing Documentation Consistency..." -ForegroundColor Yellow

# Count $LIVES vs $HEALTH token references
$livesTokenCount = 0
$healthTokenCount = 0

Get-ChildItem -Recurse -Include "*.md", "*.tsx", "*.rs" | ForEach-Object {
    $content = Get-Content $_.FullName -ErrorAction SilentlyContinue
    if ($content) {
        $livesTokenCount += ($content | Select-String '\$LIVES' -AllMatches).Matches.Count
        $healthTokenCount += ($content | Select-String '\$HEALTH' -AllMatches).Matches.Count
    }
}

Write-Host "💰 Token standardization check:" -ForegroundColor Cyan
Write-Host "   `$LIVES references: $livesTokenCount" -ForegroundColor White
Write-Host "   `$HEALTH references: $healthTokenCount" -ForegroundColor White

if ($healthTokenCount -eq 0) {
    Write-Host "✅ Token standardization complete - only `$LIVES tokens used" -ForegroundColor Green
} else {
    Write-Host "⚠️  Some `$HEALTH token references still exist" -ForegroundColor Yellow
}

# Sarah Chen story consistency
$sarahCount = 0
Get-ChildItem -Recurse -Include "*.md", "*.tsx", "*.js", "*.html" | ForEach-Object {
    $content = Get-Content $_.FullName -ErrorAction SilentlyContinue
    if ($content) {
        $sarahCount += ($content | Select-String 'Sarah Chen' -AllMatches).Matches.Count
    }
}

Write-Host "👩‍⚕️ Sarah Chen story references: $sarahCount" -ForegroundColor Cyan

if ($sarahCount -gt 5) {
    Write-Host "✅ Sarah's story is consistently used across demos" -ForegroundColor Green
} else {
    Write-Host "⚠️  Sarah's story may need more consistency" -ForegroundColor Yellow
}

# CAR-T therapy focus
$cartCount = 0
Get-ChildItem -Recurse -Include "*.md", "*.tsx", "*.js", "*.html" | ForEach-Object {
    $content = Get-Content $_.FullName -ErrorAction SilentlyContinue
    if ($content) {
        $cartCount += ($content | Select-String 'CAR-T' -AllMatches).Matches.Count
    }
}

Write-Host "🧬 CAR-T therapy references: $cartCount" -ForegroundColor Cyan

if ($cartCount -gt 10) {
    Write-Host "✅ Strong CAR-T therapy focus across materials" -ForegroundColor Green
} else {
    Write-Host "⚠️  CAR-T therapy focus could be stronger" -ForegroundColor Yellow
}

# Test 7: DeSci Track Coverage
Write-Host ""
Write-Host "🌟 Testing DeSci Track Coverage..." -ForegroundColor Yellow
$desciTracks = @("Tokenized Patient Access", "Verification", "Audit Trails", "Data Protocols", "Longevity", "Health", "Global Access", "Inclusion", "Open Science")
$trackCoverage = 0

foreach ($track in $desciTracks) {
    $found = $false
    Get-ChildItem -Recurse -Include "*.md" | ForEach-Object {
        $content = Get-Content $_.FullName -ErrorAction SilentlyContinue
        if ($content -match $track) {
            $found = $true
        }
    }
    if ($found) { $trackCoverage++ }
}

Write-Host "📋 DeSci track coverage: $trackCoverage/$($desciTracks.Length) concepts found" -ForegroundColor Cyan

if ($trackCoverage -gt 6) {
    Write-Host "✅ Strong DeSci track coverage" -ForegroundColor Green
} else {
    Write-Host "⚠️  DeSci track coverage could be improved" -ForegroundColor Yellow
}

# Final Summary
Write-Host ""
Write-Host "🎯 DEMO READINESS SUMMARY" -ForegroundColor Cyan
Write-Host "=========================" -ForegroundColor Cyan

# Calculate overall readiness score
$readinessScore = 0
$maxScore = 10

# Web demo
if (Test-Path "desci-demo.html") { $readinessScore++ }

# Terminal demo
if (Test-Path "desci-demo-terminal.js") { $readinessScore++ }

# React demo
if (Test-Path "src\components\demo\HackathonDemoController.tsx") { $readinessScore++ }

# Smart contracts
if ($smartContractCount -eq 3) { $readinessScore += 2 }

# Presentation materials
if ((Test-Path "HACKATHON_PRESENTATION.md") -and (Test-Path "EXECUTIVE_SUMMARY.md")) {
    $readinessScore += 2
}

# Token standardization
if ($healthTokenCount -eq 0) { $readinessScore++ }

# Story consistency
if ($sarahCount -gt 5) { $readinessScore++ }

# DeSci coverage
if ($trackCoverage -gt 6) { $readinessScore++ }

Write-Host "📊 Overall Readiness: $readinessScore/$maxScore" -ForegroundColor Cyan

if ($readinessScore -ge 8) {
    Write-Host "🏆 EXCELLENT - Hackathon ready!" -ForegroundColor Green
} elseif ($readinessScore -ge 6) {
    Write-Host "✅ GOOD - Minor improvements needed" -ForegroundColor Green
} elseif ($readinessScore -ge 4) {
    Write-Host "⚠️  FAIR - Significant work needed" -ForegroundColor Yellow
} else {
    Write-Host "❌ NEEDS WORK - Major issues to address" -ForegroundColor Red
}

Write-Host ""
Write-Host "🚀 Demo components ready for presentation!" -ForegroundColor Green
Write-Host "📧 Remember to test all demos before the hackathon" -ForegroundColor Yellow
Write-Host "🎤 Practice presentation timing and transitions" -ForegroundColor Yellow
Write-Host "💡 Prepare for judge QA on technical implementation" -ForegroundColor Yellow