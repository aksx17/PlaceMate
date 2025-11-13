@echo off
REM PlaceMate Setup Script for Windows
REM This script automates the setup process for PlaceMate

echo.
echo ===============================================
echo      PlaceMate Setup Script v1.0
echo   AI-Powered Placement Companion
echo ===============================================
echo.

REM Check if Node.js is installed
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed. Please install Node.js 18+ first.
    exit /b 1
)

echo [OK] Node.js is installed: 
node -v

REM Install dependencies
echo.
echo [INFO] Installing dependencies (this may take a few minutes)...
call npm install

echo.
echo [INFO] Installing backend dependencies...
cd backend
call npm install
cd ..

echo.
echo [INFO] Installing frontend dependencies...
cd frontend
call npm install
cd ..

echo.
echo [OK] All dependencies installed successfully!

REM Setup environment files
echo.
echo [INFO] Setting up environment files...

if not exist "backend\.env" (
    copy "backend\.env.example" "backend\.env"
    echo [OK] Created backend\.env file
    echo.
    echo [WARNING] IMPORTANT: Edit backend\.env and add your API keys!
    echo.
    echo Required API keys:
    echo   1. GEMINI_API_KEY - Get from https://makersuite.google.com/app/apikey
    echo   2. GITHUB_TOKEN - Get from GitHub Settings -^> Developer settings -^> Tokens
    echo   3. MONGODB_URI - Use MongoDB Atlas (recommended for Windows)
    echo.
) else (
    echo [INFO] backend\.env already exists
)

if not exist "frontend\.env" (
    copy "frontend\.env.example" "frontend\.env"
    echo [OK] Created frontend\.env file
) else (
    echo [INFO] frontend\.env already exists
)

REM Create temp directory
if not exist "backend\temp" mkdir "backend\temp"
echo [OK] Created temp directory for PDFs

echo.
echo ===============================================
echo           Setup Complete! 🎉
echo ===============================================
echo.

echo [INFO] Next Steps:
echo.
echo 1. Edit backend\.env and add your API keys
echo.
echo 2. Run the application:
echo    npm run dev
echo.
echo 3. Open your browser:
echo    http://localhost:3000
echo.

echo [WARNING] Don't forget to add your API keys in backend\.env before running!

echo.
echo For detailed setup instructions, see SETUP_GUIDE.md
echo For quick start guide, see QUICK_START.md
echo.
pause
