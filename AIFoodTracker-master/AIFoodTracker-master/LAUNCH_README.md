# 🚀 FoodAppBB Application Launcher

This guide explains how to start both the backend and frontend of your FoodAppBB application together.

## 📁 Files Created

- `package.json` - Root package.json with scripts to run both services
- `start-app.bat` - Windows batch file launcher
- `start-app.ps1` - PowerShell launcher script
- `start-app.html` - HTML launcher with buttons (open in browser)

## 🎯 Quick Start Options

### Option 1: HTML Button Launcher (Recommended)
1. Open `start-app.html` in your web browser
2. Click the "🚀 Launch with Batch File" button
3. Two terminal windows will open automatically:
   - Backend server (Port 5000)
   - Frontend client (Port 3000)

### Option 2: Command Line
```bash
# Install all dependencies (if needed)
npm run install-all

# Start both services
npm start

# Or for development with auto-reload
npm run dev
```

### Option 3: Direct Script Execution
**Windows Command Prompt:**
```cmd
start-app.bat
```

**PowerShell:**
```powershell
.\start-app.ps1
```

## 🌐 Access Points

Once started, you can access:

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000
- **Health Check:** http://localhost:5000/api/health

## 🔧 Individual Services

If you need to run services separately:

```bash
# Backend only
npm run server
# or for development
npm run server:dev

# Frontend only
npm run client
# or for development
npm run client:dev
```

## 📋 Features

- **Concurrent Execution:** Both services start simultaneously
- **Auto-dependency Installation:** Scripts check and install dependencies
- **Development Mode:** Hot reload for both frontend and backend
- **Error Handling:** Clear error messages and status updates
- **Multiple Launch Options:** Choose your preferred method

## 🛠️ Troubleshooting

1. **Port Conflicts:** Make sure ports 3000 and 5000 are available
2. **Dependencies:** Run `npm run install-all` if you encounter missing modules
3. **Permissions:** Run PowerShell as Administrator if you encounter permission issues
4. **Firewall:** Allow Node.js through Windows Firewall if needed

## 📞 Support

If you encounter issues:
1. Check that all dependencies are installed
2. Ensure no other applications are using ports 3000/5000
3. Try running the HTML launcher first (most user-friendly)
4. Check the terminal output for specific error messages

---

**Happy coding! 🍽️**
