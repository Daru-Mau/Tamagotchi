# Supabase Connection Test Helper
# This script helps you test your Supabase connection in PowerShell

Write-Host @"
 _____                   _                     _____         _   
|   __|_ _ ___ ___ _____| |_ ___ ___ ___      |_   _|___ ___| |_ 
|__   | | | . | .'| . . | . | .'|  _| -_|       | | | -_|_ -|  _|
|_____|___|  _|__,|_____|___|__,|___|___|       |_| |___|___|_|  
        |_|                                                      
"@ -ForegroundColor Cyan

Write-Host "Supabase Connection Test" -ForegroundColor Green
Write-Host "=====================`n" -ForegroundColor Cyan

# Function to check if a file exists
function Test-ConfigFile {
    param (
        [string]$FilePath
    )
    
    if (-Not (Test-Path -Path $FilePath)) {
        Write-Host "❌ Error: Could not find file at $FilePath" -ForegroundColor Red
        return $false
    }
    return $true
}

# Function to check if a module is installed
function Test-ModuleInstalled {
    param (
        [string]$ModuleName
    )
    
    try {
        $npmList = npm list $ModuleName --depth=0 2>$null
        if ($npmList -match $ModuleName) {
            return $true
        }
        return $false
    } catch {
        return $false
    }
}

# Check if we're in the frontend directory
$frontendDir = $PWD.Path
$isInFrontend = $false

if ((Split-Path -Leaf $frontendDir) -ne "frontend") {
    $frontendPath = Join-Path -Path $frontendDir -ChildPath "frontend"
    
    if (Test-Path -Path $frontendPath) {
        Write-Host "Changing to frontend directory..." -ForegroundColor Yellow
        Set-Location -Path $frontendPath
        $frontendDir = $frontendPath
        $isInFrontend = $true
    } else {
        Write-Host "❌ Error: Not in frontend directory and couldn't find frontend subfolder." -ForegroundColor Red
        Write-Host "Please run this script from the project root or frontend directory." -ForegroundColor Red
        exit 1
    }
} else {
    $isInFrontend = $true
}

# Check for required config file
$envFile = Join-Path -Path $frontendDir -ChildPath "src\config\env.ts"
if (-Not (Test-ConfigFile -FilePath $envFile)) {
    exit 1
}

# Check for required npm packages
$requiredPackages = @('@supabase/supabase-js')
$missingPackages = @()

foreach ($package in $requiredPackages) {
    if (-Not (Test-ModuleInstalled -ModuleName $package)) {
        $missingPackages += $package
    }
}

if ($missingPackages.Count -gt 0) {
    Write-Host "Installing missing packages: $($missingPackages -join ', ')" -ForegroundColor Yellow
    npm install $missingPackages
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to install required packages." -ForegroundColor Red
        exit 1
    }
}

# Run the test script
Write-Host "`nRunning Supabase connection test...`n" -ForegroundColor Cyan

# Check if the CommonJS test script exists, create it if it doesn't
$testScript = Join-Path -Path $frontendDir -ChildPath "test-supabase-cjs.js"
if (-Not (Test-Path -Path $testScript)) {
    Write-Host "Creating CommonJS test script..." -ForegroundColor Yellow
    # Create script content here (simplified version)
    $scriptContent = @'
// Supabase Connection Test (CommonJS version)
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Find and read the env.ts file to extract credentials
const ENV_FILE_PATH = path.join(__dirname, 'src', 'config', 'env.ts');
let SUPABASE_URL = '';
let SUPABASE_ANON_KEY = '';

try {
  const envFileContent = fs.readFileSync(ENV_FILE_PATH, 'utf8');
  
  // Use regex to extract the URL and key
  const urlMatch = envFileContent.match(/export const SUPABASE_URL\s*=\s*["'](.+?)["']/);
  const keyMatch = envFileContent.match(/export const SUPABASE_ANON_KEY\s*=\s*["'](.+?)["']/);
  
  if (urlMatch && urlMatch[1]) SUPABASE_URL = urlMatch[1];
  if (keyMatch && keyMatch[1]) SUPABASE_ANON_KEY = keyMatch[1];
} catch (error) {
  console.error(`❌ Error reading env.ts file: ${error.message}`);
  process.exit(1);
}

console.log(`Testing connection to Supabase: ${SUPABASE_URL}`);
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function testConnection() {
  try {
    const { data, error } = await supabase.from('pets').select('count').limit(1);
    
    if (error) throw error;
    
    console.log('✅ Successfully connected to Supabase!');
    return true;
  } catch (err) {
    console.error('❌ Failed to connect:', err.message);
    return false;
  }
}

testConnection();
'@
    Set-Content -Path $testScript -Value $scriptContent -Encoding UTF8
}

# Run the test
node $testScript

if ($LASTEXITCODE -ne 0) {
    Write-Host "`n❌ Supabase connection test failed!" -ForegroundColor Red
    Write-Host "`nTroubleshooting tips:" -ForegroundColor Yellow
    Write-Host "1. Check your SUPABASE_URL and SUPABASE_ANON_KEY in src/config/env.ts" -ForegroundColor Yellow
    Write-Host "2. Make sure your Supabase project is running" -ForegroundColor Yellow
    Write-Host "3. Verify that the 'pets' table exists in your Supabase database" -ForegroundColor Yellow
    Write-Host "4. See supabase-setup-guide.md for more information" -ForegroundColor Yellow
    exit 1
} else {
    Write-Host "`n✅ Supabase connection test passed!" -ForegroundColor Green
    Write-Host "`nYou can now run your app with:" -ForegroundColor Cyan
    Write-Host "  cd frontend" -ForegroundColor Cyan
    Write-Host "  npm start" -ForegroundColor Cyan
}
