// App configuration for Expo
// This file is used to configure the app.json file dynamically
// It allows us to use environment variables safely
import "dotenv/config";

export default {
  expo: {
    name: process.env.EXPO_PUBLIC_APP_NAME || "Tamagotchi",
    slug: "tamagotchi-mobile-app",
    version: process.env.EXPO_PUBLIC_APP_VERSION || "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    updates: {
      fallbackToCacheTimeout: 0,
    },
    assetBundlePatterns: ["**/*"],
    ios: {
      supportsTablet: true,
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#FFFFFF",
      },
    },
    web: {
      favicon: "./assets/favicon.png",
    },
    extra: {
      // Avoid storing actual keys directly in this file
      // Instead, pull them from .env file which is not committed to git
      supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL,
      supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
      eas: {
        projectId: "your-project-id",
      },
    },
  },
};
