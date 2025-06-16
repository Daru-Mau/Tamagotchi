@echo off
color 0B
echo  _____                                   _       _     _ 
echo ^|_   _^|                                 ^| ^|     ^| ^|   (_)
echo   ^| ^| __ _ _ __ ___   __ _  __ _  ___  ^| ^|_ ___^| ^|__  _ 
echo   ^| ^|/ _` ^| '_ ` _ \ / _` ^|/ _` ^|/ _ \ ^| __/ __^| '_ \^| ^|
echo   ^| ^| (_^| ^| ^| ^| ^| ^| ^| (_^| ^| (_^| ^| (_) ^|^| ^|_\__ \ ^| ^| ^| ^|
echo   \_/\__,_^|_^| ^|_^| ^|_^|\__,_^|\__, ^|\___/  \__^|___/_^| ^|_^|_^|
echo                             __/ ^|                       
echo                            ^|___/                        

echo App Launcher
echo =====================

REM Check if frontend directory exists
if not exist frontend\ (
    color 0C
    echo Error: frontend directory not found. Make sure you're running this from the root project directory.
    pause
    exit /b 1
)

REM Check if package.json exists
if not exist frontend\package.json (
    color 0C
    echo Error: package.json not found in the frontend directory. Project structure may be incorrect.
    pause
    exit /b 1
)

REM Check Supabase credentials in environment file
set envFile=frontend\src\config\env.ts
if exist %envFile% (
    findstr /C:"your-project-id.supabase.co" %envFile% >nul
    if not errorlevel 1 (
        color 0E
        echo.
        echo Warning: You haven't set up your Supabase credentials yet!
        echo You can run the setup script with: node setup-supabase-credentials.js
        echo Or manually update credentials in: frontend\src\config\env.ts
        echo.
        
        set /p confirm="Do you want to continue without setting up Supabase? (y/n): "
        if /i not "%confirm%"=="y" (
            echo.
            echo Exiting. Please set up your Supabase credentials before running the app.
            pause
            exit /b 1
        )
    )
) else (
    echo Warning: Environment file not found at %envFile%
)

REM Remind about Supabase credentials
color 0E
echo.
echo Reminder: Make sure you've updated your Supabase credentials in src/config/env.ts!
echo If you haven't created a Supabase project yet, visit: https://supabase.com/dashboard
echo.

REM Navigate to the frontend directory
cd frontend

REM Show helpful information about Expo
color 0D
echo Helpful tips:
echo * Press 'a' to run on an Android emulator
echo * Press 'i' to run on an iOS simulator (macOS only)
echo * Press 'w' to run in a web browser
echo * Press 'r' to reload the app
echo * Press 'm' to toggle the menu
echo * Press 'e' to switch between local and tunnel connection
echo * Scan the QR code with Expo Go app to run on your device
echo.

color 0A
echo Starting Expo dev server...
npm start

REM This line will only execute if npm start exits
color 0E
echo.
echo Expo server has stopped.
pause
