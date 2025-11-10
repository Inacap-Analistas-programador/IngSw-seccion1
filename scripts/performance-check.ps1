# Performance Budget Check Script
param(
    [string]$Mode = "dev"
)

Write-Host "🚀 Starting Performance Budget Check..." -ForegroundColor Green

# Navigate to frontend directory
Set-Location "frontend"

# Install dependencies if needed
if (!(Test-Path "node_modules")) {
    Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
    npm install
}

# Build for production if not in dev mode
if ($Mode -eq "prod") {
    Write-Host "🔨 Building for production..." -ForegroundColor Yellow
    npm run build
}

# Run Lighthouse CI
Write-Host "🔍 Running Lighthouse performance audit..." -ForegroundColor Yellow
try {
    if ($Mode -eq "dev") {
        # Start dev server and run audit
        Start-Process -FilePath "npm" -ArgumentList "run", "dev" -WindowStyle Hidden
        Start-Sleep -Seconds 10
        npm run perf:audit
    } else {
        # Use preview server for production build
        npm run perf:audit
    }
    
    Write-Host "✅ Performance audit completed successfully!" -ForegroundColor Green
} catch {
    Write-Host "❌ Performance audit failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Return to root directory
Set-Location ".."