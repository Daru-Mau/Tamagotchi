# Test the Supabase connection
Write-Host "Tamagotchi App - Supabase Connection Test" -ForegroundColor Cyan
Write-Host "=======================================" -ForegroundColor Cyan

# Navigate to frontend directory
Set-Location -Path ".\frontend"

Write-Host "`nRunning Supabase connection test..." -ForegroundColor Yellow
Write-Host "This will verify if your app can connect to Supabase.`n" -ForegroundColor Yellow

# Run the test script
npx node test-supabase.js

# Return to the main directory
Set-Location -Path ".."

Read-Host -Prompt "`nPress Enter to exit"
