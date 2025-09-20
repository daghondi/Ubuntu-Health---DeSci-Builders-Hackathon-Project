# Ubuntu Health - Production Platform Setup Script
# Run this script to initialize the complete development environment

Write-Host "🚀 Ubuntu Health - Production Platform Setup" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Green

# Check prerequisites
Write-Host "`n📋 Checking Prerequisites..." -ForegroundColor Yellow

# Check Node.js
$nodeVersion = node --version 2>$null
if ($nodeVersion) {
    Write-Host "✅ Node.js: $nodeVersion" -ForegroundColor Green
} else {
    Write-Host "❌ Node.js not found. Please install Node.js 18+ from https://nodejs.org/" -ForegroundColor Red
    exit 1
}

# Check PostgreSQL
$postgresVersion = psql --version 2>$null
if ($postgresVersion) {
    Write-Host "✅ PostgreSQL: $postgresVersion" -ForegroundColor Green
} else {
    Write-Host "⚠️ PostgreSQL not detected. Please install PostgreSQL 14+ for production database" -ForegroundColor Yellow
}

# Check Git
$gitVersion = git --version 2>$null
if ($gitVersion) {
    Write-Host "✅ Git: $gitVersion" -ForegroundColor Green
} else {
    Write-Host "❌ Git not found. Please install Git from https://git-scm.com/" -ForegroundColor Red
    exit 1
}

Write-Host "`n🔧 Setting up Backend..." -ForegroundColor Yellow
Set-Location backend

# Install backend dependencies
Write-Host "Installing backend dependencies..." -ForegroundColor Cyan
npm install

# Setup environment file
if (-not (Test-Path ".env")) {
    Write-Host "Creating backend .env file..." -ForegroundColor Cyan
    Copy-Item ".env.example" ".env"
    Write-Host "⚠️ Please edit backend/.env with your configuration" -ForegroundColor Yellow
}

# Setup database (if PostgreSQL is available)
if ($postgresVersion) {
    Write-Host "Setting up database..." -ForegroundColor Cyan
    npm run db:generate
    Write-Host "✅ Database schema generated" -ForegroundColor Green
} else {
    Write-Host "⚠️ Skipping database setup - PostgreSQL not available" -ForegroundColor Yellow
}

Write-Host "`n🖥️ Setting up Frontend..." -ForegroundColor Yellow
Set-Location ../frontend

# Install frontend dependencies
Write-Host "Installing frontend dependencies..." -ForegroundColor Cyan
npm install

# Setup Next.js environment
if (-not (Test-Path ".env.local")) {
    Write-Host "Creating frontend .env.local file..." -ForegroundColor Cyan
    @"
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com
NEXT_PUBLIC_SOLANA_NETWORK=devnet
"@ | Out-File -FilePath ".env.local" -Encoding UTF8
}

Write-Host "`n⚙️ Setting up Smart Contracts..." -ForegroundColor Yellow
Set-Location ../smart-contracts

# Check for Rust and Anchor
$rustVersion = rustc --version 2>$null
if ($rustVersion) {
    Write-Host "✅ Rust: $rustVersion" -ForegroundColor Green
} else {
    Write-Host "⚠️ Rust not found. Install from https://rustup.rs/ for smart contract development" -ForegroundColor Yellow
}

$anchorVersion = anchor --version 2>$null
if ($anchorVersion) {
    Write-Host "✅ Anchor: $anchorVersion" -ForegroundColor Green
} else {
    Write-Host "⚠️ Anchor CLI not found. Install with: npm install -g @coral-xyz/anchor-cli" -ForegroundColor Yellow
}

Write-Host "`n📁 Creating development directories..." -ForegroundColor Yellow
Set-Location ..

# Create additional directories for development
$directories = @(
    "logs",
    "uploads", 
    "keypairs",
    "docs/api",
    "tests/integration",
    "scripts/deployment"
)

foreach ($dir in $directories) {
    if (-not (Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force
        Write-Host "✅ Created directory: $dir" -ForegroundColor Green
    }
}

# Create development scripts
Write-Host "`n📜 Creating development scripts..." -ForegroundColor Yellow

# Create start-dev script
@"
#!/usr/bin/env pwsh
# Ubuntu Health - Start Development Environment

Write-Host "🚀 Starting Ubuntu Health Development Environment" -ForegroundColor Green

# Start backend in background
Write-Host "Starting backend API..." -ForegroundColor Cyan
Start-Process pwsh -ArgumentList "-Command", "cd backend; npm run dev" -WindowStyle Normal

# Wait a moment for backend to start
Start-Sleep -Seconds 3

# Start frontend
Write-Host "Starting frontend application..." -ForegroundColor Cyan
Start-Process pwsh -ArgumentList "-Command", "cd frontend; npm run dev" -WindowStyle Normal

Write-Host "🌟 Development environment started!" -ForegroundColor Green
Write-Host "Backend API: http://localhost:3001" -ForegroundColor Yellow
Write-Host "Frontend App: http://localhost:3000" -ForegroundColor Yellow
Write-Host "API Health: http://localhost:3001/health" -ForegroundColor Yellow

# Keep script running
Write-Host "`nPress Ctrl+C to stop all services" -ForegroundColor Red
try {
    while ($true) {
        Start-Sleep -Seconds 1
    }
} catch {
    Write-Host "`nStopping development environment..." -ForegroundColor Yellow
}
"@ | Out-File -FilePath "start-dev.ps1" -Encoding UTF8

# Create build script
@"
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
"@ | Out-File -FilePath "build-production.ps1" -Encoding UTF8

Write-Host "`n✅ Setup Complete!" -ForegroundColor Green
Write-Host "==================" -ForegroundColor Green

Write-Host "`n🚀 Quick Start Commands:" -ForegroundColor Yellow
Write-Host "  ./start-dev.ps1        - Start development environment" -ForegroundColor Cyan
Write-Host "  ./build-production.ps1 - Build for production" -ForegroundColor Cyan
Write-Host "  cd backend && npm run db:studio - Open database GUI" -ForegroundColor Cyan

Write-Host "`n📚 Important Files to Configure:" -ForegroundColor Yellow
Write-Host "  backend/.env           - Backend configuration" -ForegroundColor Cyan
Write-Host "  frontend/.env.local    - Frontend configuration" -ForegroundColor Cyan

Write-Host "`n🌐 Development URLs:" -ForegroundColor Yellow
Write-Host "  Frontend:  http://localhost:3000" -ForegroundColor Cyan
Write-Host "  Backend:   http://localhost:3001" -ForegroundColor Cyan
Write-Host "  API Docs:  http://localhost:3001/api-docs" -ForegroundColor Cyan
Write-Host "  Health:    http://localhost:3001/health" -ForegroundColor Cyan

Write-Host "`n📖 Next Steps:" -ForegroundColor Yellow
Write-Host "  1. Configure backend/.env with your database URL" -ForegroundColor White
Write-Host "  2. Run database migrations: cd backend && npm run db:migrate" -ForegroundColor White
Write-Host "  3. Start development: ./start-dev.ps1" -ForegroundColor White
Write-Host "  4. Deploy smart contracts to devnet" -ForegroundColor White
Write-Host "  5. Implement first API endpoints and frontend components" -ForegroundColor White

Write-Host "`n🌟 Ubuntu Health production platform is ready for development!" -ForegroundColor Green