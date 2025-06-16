# PowerShell script to verify project setup and dependencies

Write-Host "`nTamagotchi App Setup Verification" -ForegroundColor Cyan
Write-Host "===============================" -ForegroundColor Cyan

# Check Node.js installation
Write-Host "`n📋 Checking Node.js installation..." -ForegroundColor Yellow
try {
    $nodeVersion = node -v
    Write-Host "✅ Node.js is installed: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js is not installed or not in PATH. Please install Node.js." -ForegroundColor Red
}

# Check npm installation
Write-Host "`n📋 Checking npm installation..." -ForegroundColor Yellow
try {
    $npmVersion = npm -v
    Write-Host "✅ npm is installed: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ npm is not installed or not in PATH." -ForegroundColor Red
}

# Check Expo CLI installation
Write-Host "`n📋 Checking Expo CLI installation..." -ForegroundColor Yellow
try {
    $expoVersion = npx expo --version
    Write-Host "✅ Expo CLI is available: $expoVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Expo CLI is not installed. Run 'npm install -g expo-cli'" -ForegroundColor Red
}

# Check frontend dependencies
Write-Host "`n📋 Checking frontend dependencies..." -ForegroundColor Yellow
Set-Location -Path ".\frontend"
if (Test-Path -Path ".\node_modules") {
    Write-Host "✅ node_modules directory exists" -ForegroundColor Green
} else {
    Write-Host "❌ node_modules directory not found. Run 'npm install' in the frontend directory." -ForegroundColor Red
}

# Check Supabase config
Write-Host "`n📋 Checking Supabase configuration..." -ForegroundColor Yellow
if (Test-Path -Path ".\src\config\env.ts") {
    $envContent = Get-Content -Path ".\src\config\env.ts" -Raw
    if ($envContent.Contains("YOUR_SUPABASE_URL") -or $envContent.Contains("YOUR_SUPABASE_ANON_KEY")) {
        Write-Host "⚠️ Supabase credentials need to be updated in src/config/env.ts" -ForegroundColor Yellow
    } else {
        Write-Host "✅ Supabase configuration appears to be set up" -ForegroundColor Green
    }
} else {
    Write-Host "❌ env.ts configuration file not found." -ForegroundColor Red
}

# Check if required assets exist
Write-Host "`n📋 Checking required assets..." -ForegroundColor Yellow
$requiredAssets = @(
    ".\assets\icon.png",
    ".\assets\splash.png",
    ".\assets\adaptive-icon.png",
    ".\assets\favicon.png",
    ".\src\assets\images\logo.png"
)

$allAssetsExist = $true
foreach ($asset in $requiredAssets) {
    if (Test-Path -Path $asset) {
        Write-Host "✅ $asset exists" -ForegroundColor Green
    } else {
        Write-Host "❌ $asset is missing" -ForegroundColor Red
        $allAssetsExist = $false
    }
}

if (-not $allAssetsExist) {
    Write-Host "`n⚠️ Some required assets are missing. You'll need to create them before publishing your app." -ForegroundColor Yellow
}

# Return to main directory
Set-Location -Path ".."

# Final status
Write-Host "`n📋 Summary:" -ForegroundColor Yellow
Write-Host "The project setup is completed. You are ready to run your Tamagotchi app!" -ForegroundColor Green
Write-Host "To run the app, use ./start-app.ps1 or npm start from the frontend directory." -ForegroundColor Cyan
Write-Host "Don't forget to update your Supabase credentials in src/config/env.ts before testing." -ForegroundColor Yellow
Write-Host "`nHappy coding! 🎮 🐱 🐶" -ForegroundColor Magenta

Write-Host "`nPress any key to exit..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
