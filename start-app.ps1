Write-Host @"
 _____                                   _       _     _ 
|_   _|                                 | |     | |   (_)
  | | __ _ _ __ ___   __ _  __ _  ___  | |_ ___| |__  _ 
  | |/ _`` | '_ `` _ \ / _`` |/ _`` |/ _ \ | __/ __| '_ \| |
  | | (_| | | | | | | (_| | (_| | (_) || |_\__ \ | | | |
  \_/\__,_|_| |_| |_|\__,_|\__, |\___/  \__|___/_| |_|_|
                            __/ |                       
                           |___/                        
"@ -ForegroundColor Cyan

Write-Host "App Launcher" -ForegroundColor Green
Write-Host "=====================`n" -ForegroundColor Cyan

# Check if frontend directory exists
if (-Not (Test-Path -Path ".\frontend")) {
    Write-Host "Error: frontend directory not found. Make sure you're running this from the root project directory." -ForegroundColor Red
    Read-Host -Prompt "Press Enter to exit"
    exit 1
}

# Check if package.json exists
if (-Not (Test-Path -Path ".\frontend\package.json")) {
    Write-Host "Error: package.json not found in the frontend directory. Project structure may be incorrect." -ForegroundColor Red
    Read-Host -Prompt "Press Enter to exit"
    exit 1
}

# Check Supabase credentials in environment file
$envFile = ".\frontend\src\config\env.ts"
if (Test-Path -Path $envFile) {
    $envContent = Get-Content -Path $envFile -Raw
    if ($envContent -match "your-project-id.supabase.co" -or $envContent -match "your-anon-key") {
        Write-Host "`n🚨 Warning: You haven't set up your Supabase credentials yet!" -ForegroundColor Yellow
        Write-Host "You can run the setup script with: node setup-supabase-credentials.js" -ForegroundColor Yellow
        Write-Host "Or manually update credentials in: frontend\src\config\env.ts" -ForegroundColor Yellow
        
        $confirm = Read-Host -Prompt "`nDo you want to continue without setting up Supabase? (y/n)"
        if ($confirm -ne "y") {
            Write-Host "`nExiting. Please set up your Supabase credentials before running the app." -ForegroundColor Red
            exit 1
        }
    }
} else {
    Write-Host "Warning: Environment file not found at $envFile" -ForegroundColor Yellow
}

# Navigate to the frontend directory
Set-Location -Path ".\frontend"

# Show helpful information about Expo
Write-Host "Helpful tips:" -ForegroundColor Magenta
Write-Host "• Press 'a' to run on an Android emulator" -ForegroundColor White
Write-Host "• Press 'i' to run on an iOS simulator (macOS only)" -ForegroundColor White
Write-Host "• Press 'w' to run in a web browser" -ForegroundColor White
Write-Host "• Press 'r' to reload the app" -ForegroundColor White
Write-Host "• Press 'm' to toggle the menu" -ForegroundColor White
Write-Host "• Press 'e' to switch between local and tunnel connection" -ForegroundColor White
Write-Host "• Scan the QR code with Expo Go app to run on your device`n" -ForegroundColor White

Write-Host "Starting Expo dev server..." -ForegroundColor Green
npm start

# This line will only execute if npm start exits
Write-Host "`nExpo server has stopped." -ForegroundColor Yellow
Read-Host -Prompt "Press Enter to exit"
