// Supabase Connection Test
import "react-native-url-polyfill/auto.js";
import { supabase } from "./src/services/supabase";

// Simple function to test connection to Supabase
async function testSupabaseConnection() {
  try {
    console.log("Testing connection to Supabase...");

    // Check if we can connect to Supabase
    const { data, error } = await supabase
      .from("pets")
      .select("count")
      .limit(1);

    if (error) {
      console.error("❌ Supabase connection failed:", error.message);
      return false;
    }

    console.log("✅ Supabase connection successful!");
    console.log("Database response:", data);
    return true;
  } catch (error) {
    console.error("❌ Unexpected error:", error);
    return false;
  }
}

// Run the test
testSupabaseConnection().then((success) => {
  if (!success) {
    console.log("\nTroubleshooting tips:");
    console.log(
      "1. Check your SUPABASE_URL and SUPABASE_ANON_KEY in src/config/env.ts"
    );
    console.log("2. Make sure your Supabase project is running");
    console.log(
      '3. Verify that the "pets" table exists in your Supabase database'
    );
    console.log("4. Check network connectivity to your Supabase instance");
  }
});
