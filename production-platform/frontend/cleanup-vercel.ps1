#!/usr/bin/pwsh
# Clean up all Ubuntu Health projects from Vercel

Write-Host "🧹 Cleaning up all Ubuntu Health projects from Vercel..." -ForegroundColor Yellow

$projects = @(
    "ubuntu-health-api-fixed",
    "frontend", 
    "ubuntu-health-final",
    "ubuntu-health-frontend",
    "ubuntu-health-de-sci-builders-hackathon-project",
    "ubuntu-health-atlas"
)

foreach ($project in $projects) {
    Write-Host "🗑️  Deleting project: $project" -ForegroundColor Red
    # Use echo yes to automatically confirm deletion
    echo "yes" | vercel projects rm $project
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Successfully deleted $project" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Failed to delete $project (might not exist)" -ForegroundColor Yellow
    }
}

Write-Host "🎉 Cleanup completed! Ready for fresh deployment." -ForegroundColor Green