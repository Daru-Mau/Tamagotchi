# Tamagotchi App - Supabase Integration & Mobile Testing Tools

This README explains the various scripts and tools available to help you set up Supabase and test your Tamagotchi app on mobile devices.

## 📋 Available Scripts

### Supabase Setup Tools

| Script                          | Purpose                                                            |
| ------------------------------- | ------------------------------------------------------------------ |
| `setup-supabase-credentials.js` | Interactive script to update your Supabase credentials in `env.ts` |
| `test-supabase.js`              | Basic script to test Supabase connection                           |
| `test-supabase-enhanced.js`     | Advanced Supabase testing script with detailed diagnostics         |

### App Launchers

| Script          | Purpose                                 |
| --------------- | --------------------------------------- |
| `start-app.bat` | Windows batch file launcher for the app |
| `start-app.ps1` | PowerShell launcher for the app         |
| `start-app.sh`  | Bash launcher for macOS/Linux           |

### Mobile Testing Tools

| Script                  | Purpose                                                  |
| ----------------------- | -------------------------------------------------------- |
| `start-expo-mobile.bat` | Windows batch file launcher optimized for mobile testing |
| `start-expo-mobile.ps1` | PowerShell launcher optimized for mobile testing         |

### Documentation

| File                      | Purpose                                             |
| ------------------------- | --------------------------------------------------- |
| `supabase-setup-guide.md` | Comprehensive guide to setting up Supabase          |
| `expo-testing-guide.md`   | Detailed instructions for testing on mobile devices |
| `README-launchers.md`     | This file - explains the available scripts          |

## 🚀 Quick Start Guide

### Setting Up Supabase

1. Create a Supabase project at [supabase.com](https://supabase.com/dashboard)
2. Update your credentials:
   ```
   node setup-supabase-credentials.js
   ```
3. Test your connection:
   ```
   cd frontend
   node test-supabase-enhanced.js
   ```
4. See `supabase-setup-guide.md` for complete setup instructions

### Testing on Mobile Devices

1. Run the mobile testing launcher:

   - Windows Command Prompt: `start-expo-mobile.bat`
   - PowerShell: `.\start-expo-mobile.ps1`

2. Follow the prompts to choose a connection method:

   - Tunnel: Best for mobile testing, works across networks
   - LAN: Requires device to be on same network
   - Local: For emulators only

3. Scan the QR code with your mobile device

   - Android: Use Expo Go app's QR scanner
   - iOS: Use the Camera app

4. See `expo-testing-guide.md` for detailed testing instructions

## 🔍 Troubleshooting

If you encounter issues:

1. **Supabase Connection Problems**:

   - Verify your credentials in `frontend/src/config/env.ts`
   - Make sure your Supabase project is active
   - Check that the database tables have been created
   - Verify no IP restrictions in Supabase dashboard

2. **Expo/Mobile Testing Issues**:
   - Try different connection methods (especially tunnel mode)
   - Make sure Expo Go app is up-to-date
   - Check your firewall settings
   - Try running with `--clear` flag: `npx expo start --tunnel --clear`
