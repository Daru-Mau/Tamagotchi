# Supabase Pet Interactions Table Setup Guide
# This PowerShell script provides instructions for adding the pet_interactions table to your Supabase project

Write-Host @"
 _____      _     _____       _                      _   _                 
|  _  |___ | |_  |     |___ _|_|___ ___ ___ ___ ___| |_|_|___ ___ ___ ___ 
|   __| -_|_  _| |  |  |   | | |_ -|  _| .'|  _|_ -|  _| | . |   |_ -|_ -|
|__|  |___| |_|  |_____|_|_|_|_|___|_| |__,|___|___|_| |_|___|_|_|___|___|
                                                                          
"@ -ForegroundColor Cyan

Write-Host "Supabase Pet Interactions Table Setup" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Cyan

# Instructions for manual SQL execution in Supabase
Write-Host "`nThis script will guide you to set up the pet_interactions table in your Supabase project.`n" -ForegroundColor White

Write-Host "Instructions:" -ForegroundColor Yellow
Write-Host "1. Log in to your Supabase dashboard at https://app.supabase.com" -ForegroundColor White
Write-Host "2. Select your Tamagotchi project" -ForegroundColor White
Write-Host "3. Navigate to the SQL Editor section" -ForegroundColor White
Write-Host "4. Create a new SQL query" -ForegroundColor White
Write-Host "5. Copy and paste the SQL from the pet-interactions-table.sql file" -ForegroundColor White
Write-Host "6. Run the query to create the table and related functions" -ForegroundColor White
Write-Host "7. Verify the table was created by viewing your database tables" -ForegroundColor White

# Ask if user wants to open the SQL file
$openFile = Read-Host "`nDo you want to open the pet-interactions-table.sql file now? (y/n)"
if ($openFile -eq "y" -or $openFile -eq "Y") {
    try {
        notepad.exe ".\pet-interactions-table.sql"
    }
    catch {
        Write-Host "Could not open the file with Notepad. Please open it manually." -ForegroundColor Red
    }
}

# Ask if user wants to test the connection again after setting up the table
$testConnection = Read-Host "`nWould you like to test the Supabase connection after you've set up the table? (y/n)"
if ($testConnection -eq "y" -or $testConnection -eq "Y") {
    Write-Host "`nAfter you've created the pet_interactions table, run the following command to test the connection:" -ForegroundColor Cyan
    Write-Host "cd frontend" -ForegroundColor White
    Write-Host "node test-supabase-cjs.js`n" -ForegroundColor White
}

Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "1. Update your frontend code to use the new pet_interactions table" -ForegroundColor White
Write-Host "2. Test the interactions functionality in your app" -ForegroundColor White
Write-Host "3. Continue developing your Tamagotchi app with real-time pet status updates`n" -ForegroundColor White

Write-Host "For more information on Supabase Row Level Security and permissions, see:" -ForegroundColor Yellow
Write-Host "https://supabase.com/docs/guides/auth/row-level-security" -ForegroundColor Gray
