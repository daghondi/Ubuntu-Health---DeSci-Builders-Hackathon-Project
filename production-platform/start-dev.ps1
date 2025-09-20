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
Write-Host "
Press Ctrl+C to stop all services" -ForegroundColor Red
try {
    while (True) {
        Start-Sleep -Seconds 1
    }
} catch {
    Write-Host "
Stopping development environment..." -ForegroundColor Yellow
}
