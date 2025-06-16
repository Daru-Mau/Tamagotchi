@echo off
REM Expo Mobile Testing Launcher
color 0B

echo  _____                   __  __       _     _ _      
echo ^|  ___|                 ^|  \/  ^|     ^| ^|   (_) ^|     
echo ^| ^|____  ___ __   ___   ^| \  / ^| ___ ^| ^|__  _^| ^| ___ 
echo ^|  __\ \/ / '_ \ / _ \  ^| ^|\/^| ^|/ _ \^| '_ \^| ^| ^|/ _ \
echo ^| ^|___^>  ^<^| ^|_) ^| (_) ^| ^| ^|  ^| ^| (_) ^| ^|_) ^| ^| ^|  __/
echo \____/_/\_\ .__/ \___/  ^|_^|  ^|_^|\___/^|_.__/^|_^|_^|\___|
echo           ^| ^|                                        
echo           ^|_^|                                        

color 0A
echo Tamagotchi Mobile Testing Launcher
color 0B
echo ================================

REM Check if frontend directory exists
if not exist frontend\ (
    color 0C
    echo Error: frontend directory not found!
    pause
    exit /b 1
)

REM Check if node_modules exists, if not, install dependencies
if not exist frontend\node_modules\ (
    color 0E
    echo Node modules not found. Installing dependencies...
    cd frontend
    call npm install
    if %errorlevel% neq 0 (
        color 0C
        echo Failed to install dependencies!
        pause
        exit /b 1
    )
    cd ..
)

REM Check Supabase credentials in environment file
set envFile=frontend\src\config\env.ts
if exist %envFile% (
    findstr /C:"your-project-id.supabase.co" %envFile% >nul
    if not errorlevel 1 (
        color 0E
        echo.
        echo Warning: Default Supabase credentials detected!
        echo You need to set up your Supabase credentials before testing with real data.
        echo You can:
        echo 1. Run the setup script: node setup-supabase-credentials.js
        echo 2. Manually update frontend\src\config\env.ts with your Supabase project details
        echo 3. See supabase-setup-guide.md for complete setup instructions
        echo.
        
        set /p confirm="Do you want to continue with default credentials? (y/n): "
        if /i not "%confirm%"=="y" (
            echo Exiting. Please set up your Supabase credentials before testing.
            pause
            exit /b 1
        )
    ) else (
        color 0A
        echo ✓ Custom Supabase credentials detected
        color 0B
    )
)

REM Ask if user wants to test Supabase connection
set /p testSupabase="Do you want to test the Supabase connection before launching? (y/n): "
if /i "%testSupabase%"=="y" (
    color 0B
    echo Testing Supabase connection...
    cd frontend
    node test-supabase-enhanced.js
    set testResult=%errorlevel%
    cd ..
    
    if %testResult% neq 0 (
        color 0C
        echo.
        echo Supabase connection test failed!
        set /p confirm="Do you want to continue anyway? (y/n): "
        if /i not "%confirm%"=="y" (
            echo Exiting. Please fix your Supabase connection issues before testing.
            pause
            exit /b 1
        )
    ) else (
        color 0A
        echo ✓ Supabase connection test passed!
        color 0B
    )
)

REM Ask which connection mode to use
echo.
echo Choose a connection mode for Expo:
echo 1. Tunnel ^(best for mobile testing, works across networks^)
echo 2. LAN ^(requires device to be on same network^)
echo 3. Local ^(localhost only, for emulators^)
echo 4. Default ^(let Expo choose^)

set /p modeChoice="Enter your choice (1-4): "

cd frontend

if "%modeChoice%"=="1" (
    echo.
    echo Starting Expo with tunnel mode ^(best for mobile testing^)...
    call npx expo start --tunnel
) else if "%modeChoice%"=="2" (
    echo.
    echo Starting Expo with LAN mode...
    call npx expo start --lan
) else if "%modeChoice%"=="3" (
    echo.
    echo Starting Expo with local mode ^(localhost only^)...
    call npx expo start --localhost
) else (
    echo.
    echo Starting Expo in default mode...
    call npx expo start
)

cd ..
pause
