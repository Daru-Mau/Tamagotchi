# Expo Mobile Testing Launcher
# This script helps start Expo for mobile device testing

Write-Host @"
 _____                   __  __       _     _ _      
|  ___|                 |  \/  |     | |   (_) |     
| |____  ___ __   ___   | \  / | ___ | |__  _| | ___ 
|  __\ \/ / '_ \ / _ \  | |\/| |/ _ \| '_ \| | |/ _ \
| |___>  <| |_) | (_) | | |  | | (_) | |_) | | |  __/
\____/_/\_\ .__/ \___/  |_|  |_|\___/|_.__/|_|_|\___|
          | |                                        
          |_|                                        
"@ -ForegroundColor Cyan

Write-Host "Tamagotchi Mobile Testing Launcher" -ForegroundColor Green
Write-Host "================================`n" -ForegroundColor Cyan

# Check if frontend directory exists
if (-Not (Test-Path -Path ".\frontend")) {
    Write-Host "Error: frontend directory not found!" -ForegroundColor Red
    Read-Host -Prompt "Press Enter to exit"
    exit 1
}

# Function to check node_modules
function Test-NodeModules {
    if (-Not (Test-Path -Path ".\frontend\node_modules")) {
        Write-Host "Node modules not found. Installing dependencies..." -ForegroundColor Yellow
        Set-Location -Path ".\frontend"
        npm install
        if ($LASTEXITCODE -ne 0) {
            Write-Host "Failed to install dependencies!" -ForegroundColor Red
            Read-Host -Prompt "Press Enter to exit"
            exit 1
        }
        Set-Location -Path ".."
    }
}

# Check if Expo CLI is installed
function Test-ExpoCLI {
    try {
        $expoVersion = Invoke-Expression "npx expo --version" 2>&1
        if ($LASTEXITCODE -ne 0) {
            Write-Host "Installing Expo CLI..." -ForegroundColor Yellow
            Invoke-Expression "npm install -g expo-cli" 2>&1
        } else {
            Write-Host "✓ Expo CLI found: $expoVersion" -ForegroundColor Green
        }
    } catch {
        Write-Host "Installing Expo CLI..." -ForegroundColor Yellow
        Invoke-Expression "npm install -g expo-cli" 2>&1
    }
}

# Function to check Supabase env.ts
function Test-SupabaseConfig {
    $envFile = ".\frontend\src\config\env.ts"
    if (Test-Path -Path $envFile) {
        $envContent = Get-Content -Path $envFile -Raw
        if ($envContent -match "your-project-id.supabase.co" -or $envContent -match "your-anon-key") {
            Write-Host "`n🚨 Warning: Default Supabase credentials detected!" -ForegroundColor Yellow
            Write-Host "You need to set up your Supabase credentials before testing with real data." -ForegroundColor Yellow
            Write-Host "You can:"
            Write-Host "1. Run the setup script: node setup-supabase-credentials.js"
            Write-Host "2. Manually update frontend\src\config\env.ts with your Supabase project details"
            Write-Host "3. See supabase-setup-guide.md for complete setup instructions`n"

            $confirm = Read-Host -Prompt "Do you want to continue with default credentials? (y/n)"
            if ($confirm -ne "y") {
                Write-Host "Exiting. Please set up your Supabase credentials before testing." -ForegroundColor Red
                exit 1
            }
        } else {
            Write-Host "✓ Custom Supabase credentials detected" -ForegroundColor Green
        }
    }
}

# Function to test Supabase connection
function Test-SupabaseConnection {
    Write-Host "Testing Supabase connection..." -ForegroundColor Cyan
    Set-Location -Path ".\frontend"
    node test-supabase-enhanced.js
    $testResult = $LASTEXITCODE
    Set-Location -Path ".."
    
    if ($testResult -ne 0) {
        Write-Host "`n🚨 Supabase connection test failed!" -ForegroundColor Red
        $confirm = Read-Host -Prompt "Do you want to continue anyway? (y/n)"
        if ($confirm -ne "y") {
            Write-Host "Exiting. Please fix your Supabase connection issues before testing." -ForegroundColor Red
            exit 1
        }
    } else {
        Write-Host "✓ Supabase connection test passed!" -ForegroundColor Green
    }
}

# Function to launch Expo
function Start-Expo {
    param (
        [string]$Mode = "default"
    )
    
    Set-Location -Path ".\frontend"
    
    switch ($Mode) {
        "tunnel" {
            Write-Host "`nStarting Expo with tunnel mode (best for mobile testing)..." -ForegroundColor Cyan
            npx expo start --tunnel
        }
        "lan" {
            Write-Host "`nStarting Expo with LAN mode..." -ForegroundColor Cyan
            npx expo start --lan
        }
        "local" {
            Write-Host "`nStarting Expo with local mode (localhost only)..." -ForegroundColor Cyan
            npx expo start --localhost
        }
        default {
            Write-Host "`nStarting Expo in default mode..." -ForegroundColor Cyan
            npx expo start
        }
    }
}

# Main script execution
Test-NodeModules
Test-ExpoCLI
Test-SupabaseConfig

# Ask if user wants to test Supabase connection
$testSupabase = Read-Host -Prompt "Do you want to test the Supabase connection before launching? (y/n)"
if ($testSupabase -eq "y") {
    Test-SupabaseConnection
}

# Ask which connection mode to use
Write-Host "`nChoose a connection mode for Expo:" -ForegroundColor Cyan
Write-Host "1. Tunnel (best for mobile testing, works across networks)"
Write-Host "2. LAN (requires device to be on same network)"
Write-Host "3. Local (localhost only, for emulators)"
Write-Host "4. Default (let Expo choose)"

$modeChoice = Read-Host -Prompt "Enter your choice (1-4)"

switch ($modeChoice) {
    "1" { Start-Expo -Mode "tunnel" }
    "2" { Start-Expo -Mode "lan" }
    "3" { Start-Expo -Mode "local" }
    default { Start-Expo }
}
