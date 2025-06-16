// Environment configuration
// These are your Supabase project credentials
// The values are loaded from the .env file in the project root
// Use EXPO_PUBLIC_ prefix to make env variables available in the app
import Constants from 'expo-constants';

// Type for environment variables
interface ExpoConstants {
  expoConfig?: {
    extra?: {
      supabaseUrl?: string;
      supabaseAnonKey?: string;
    };
  };
}

// Supabase configuration
// For security, we store these in the .env file instead of hardcoding them
const fallbackSupabaseUrl = "YOUR_SUPABASE_URL"; // This is a fallback, should use .env
const fallbackSupabaseKey = "YOUR_SUPABASE_ANON_KEY"; // This is a fallback, should use .env

// Get environment variables
const expoConstants = Constants as ExpoConstants;

// Use environment variables from Constants or process.env as a fallback
export const SUPABASE_URL = 
  process.env.EXPO_PUBLIC_SUPABASE_URL || 
  expoConstants?.expoConfig?.extra?.supabaseUrl ||
  fallbackSupabaseUrl;

export const SUPABASE_ANON_KEY = 
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 
  expoConstants?.expoConfig?.extra?.supabaseAnonKey ||
  fallbackSupabaseKey;

// App configuration
export const APP_NAME = process.env.EXPO_PUBLIC_APP_NAME || "Tamagotchi";
export const APP_VERSION = process.env.EXPO_PUBLIC_APP_VERSION || "1.0.0";

// Other environment variables
export const IS_DEVELOPMENT = __DEV__;
