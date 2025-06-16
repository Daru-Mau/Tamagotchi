# Testing Your Tamagotchi App on Mobile Devices with Expo

This comprehensive guide explains how to test your Tamagotchi app on real mobile devices using Expo Go.

## Prerequisites

1. **Development Environment Setup**:

   - Node.js (v16 or newer) installed on your computer
   - Supabase project set up (refer to `supabase-setup-guide.md`)

2. **Expo CLI** installed on your development machine:

   ```bash
   npm install -g expo-cli
   ```

3. **Expo Go App** installed on your mobile device:

   - [Android Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)
   - [iOS App Store](https://apps.apple.com/app/expo-go/id982107779)

4. **Required Environment Configuration**:
   - Supabase URL and anon key configured in `frontend/src/config/env.ts`
   ```powershell

   ```

# Run the dedicated Expo mobile launcher

.\start-expo-mobile.ps1

````

This launcher script will:
- Check if Expo CLI is installed
- Verify if Supabase credentials are set
- Optionally test your Supabase connection
- Let you choose the connection method (tunnel, LAN, or local)
- Start the Expo development server with the appropriate options

#### Option B: Use the standard app launcher:

```powershell
# Using PowerShell
.\start-app.ps1

# OR using the batch file
start-app.bat
````

#### Option C: Start Expo manually:

```bash
cd frontend
npx expo start
```

### 2. Connection Methods Explained

When using the mobile testing launcher, you'll be asked to choose a connection method:

- **Tunnel** (Recommended): Works across different networks, best for most situations
- **LAN**: Requires your phone to be on the same WiFi network as your computer
- **Local**: Only works with emulators/simulators running on your development machine

### 3. Testing on a Physical Device

1. **Ensure mobile device and computer connection:**

   1. **Android Emulator**:

   - Install [Android Studio](https://developer.android.com/studio)
   - Set up an Android Virtual Device (AVD) using the AVD Manager
   - Start your emulator before launching Expo
   - In the Expo terminal interface, press `a` to open on an Android emulator

2. **iOS Simulator** (macOS only):
   - Install [Xcode](https://apps.apple.com/app/xcode/id497799835) from the App Store
   - Open Xcode at least once and accept the terms
   - In the Expo terminal interface, press `i` to open on iOS simulator

### 5. Live Reloading & Hot Reloading

When testing with Expo Go:

- Your app will automatically reload when you save changes to your code
- You can shake your device to open the developer menu
- From the developer menu, you can:
  - Reload the app
  - Toggle fast refresh (hot reloading)
  - Open the JavaScript debugger

### 6. Common Issues & Troubleshooting

#### Connection Issues

**If the QR code doesn't work:**

- Make sure your device and computer are properly connected according to the chosen method
- Try switching connection methods (e.g., from LAN to Tunnel)
- Check your firewall settings if using LAN mode

**Tunnel connection issues:**

- Tunneling requires a working internet connection on both devices
- If tunnel fails, try:
  ```
  expo start --tunnel --clear
  ```

#### Supabase Connection Issues

If you encounter Supabase connection issues:

1. Verify your credentials in `frontend/src/config/env.ts`
2. Run the test script:
   ```
   cd frontend
   node test-supabase-enhanced.js
   ```
3. Check that your Supabase tables have been created correctly (see `supabase-setup-guide.md`)
4. Verify that your IP address isn't restricted in Supabase dashboard settings

### 7. Building for Production

When you're ready to create standalone builds for your app:

1. **For Android**:

   ```
   cd frontend
   expo build:android
   ```

2. **For iOS**:
   ```
   cd frontend
   expo build:ios
   ```

These commands will start the build process in the Expo cloud build service. Follow the prompts for additional configuration options.

## Additional Resources

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/docs/getting-started)
- [Supabase Documentation](https://supabase.com/docs)
- [Expo EAS Build Documentation](https://docs.expo.dev/build/introduction/) (for production builds)

2. With the Expo development server running:
   - Press `a` to open in an Android emulator
   - Press `i` to open in an iOS simulator (macOS only)

## Troubleshooting

- If the app fails to connect, check that both devices are on the same network
- Try using a tunnel connection by typing `e` in the Expo CLI
- If you encounter errors, check the Expo logs in the terminal window
- For Android-specific issues, try enabling USB debugging and connecting via USB

## Additional Resources

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/docs/getting-started)
