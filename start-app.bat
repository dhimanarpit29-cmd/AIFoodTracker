@echo off
echo ========================================
echo 🚀 Starting FoodAppBB Application
echo ========================================
echo.

echo 📦 Installing dependencies (if needed)...
call npm run install-all
echo.

echo 🔧 Starting Backend Server (Port 5000)...
start "Backend Server" cmd /k "cd server && npm run dev"

timeout /t 3 /nobreak > nul

echo 🌐 Starting Frontend Client (Port 3000)...
start "Frontend Client" cmd /k "cd client && npm start"

echo.
echo ========================================
echo ✅ Application Started Successfully!
echo ========================================
echo.
echo 📋 Access Points:
echo • Frontend: http://localhost:3000
echo • Backend API: http://localhost:5000
echo • Health Check: http://localhost:5000/api/health
echo.
echo Press any key to exit...
pause > nul
