# PowerShell script to start FoodAppBB application
Write-Host "========================================" -ForegroundColor Green
Write-Host "🚀 Starting FoodAppBB Application" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

Write-Host "📦 Installing dependencies (if needed)..." -ForegroundColor Yellow
& npm run install-all
Write-Host ""

Write-Host "🔧 Starting Backend Server (Port 5000)..." -ForegroundColor Cyan
Start-Process "cmd" -ArgumentList "/k cd server && npm run dev" -WindowStyle Normal

Start-Sleep -Seconds 3

Write-Host "🌐 Starting Frontend Client (Port 3000)..." -ForegroundColor Cyan
Start-Process "cmd" -ArgumentList "/k cd client && npm start" -WindowStyle Normal

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "✅ Application Started Successfully!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Access Points:" -ForegroundColor Yellow
Write-Host "• Frontend: http://localhost:3000" -ForegroundColor White
Write-Host "• Backend API: http://localhost:5000" -ForegroundColor White
Write-Host "• Health Check: http://localhost:5000/api/health" -ForegroundColor White
Write-Host ""
Write-Host "Press any key to exit..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
