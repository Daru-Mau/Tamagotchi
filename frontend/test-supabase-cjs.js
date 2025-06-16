// Supabase Connection Test (CommonJS version)
const fs = require("fs");
const path = require("path");
const { createClient } = require("@supabase/supabase-js");

// Check if dotenv is installed
try {
  require("dotenv").config();
} catch (error) {
  console.log("dotenv module not found, skipping .env loading");
}

// Find and read env files to extract credentials
const ENV_FILE_PATH = path.join(__dirname, ".env");
const ENV_TS_PATH = path.join(__dirname, "src", "config", "env.ts");

console.log(
  `Looking for credentials in environment variables, .env, and env.ts...`
);

// Read credentials from environment variables or .env file
let SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || "";
let SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || "";

// If environment variables are not set, try to read from .env file directly
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  try {
    console.log(`Reading from .env file: ${ENV_FILE_PATH}`);
    const envFileContent = fs.readFileSync(ENV_FILE_PATH, "utf8");

    // Parse .env file content
    const envLines = envFileContent.split("\n");
    for (const line of envLines) {
      if (line.startsWith("EXPO_PUBLIC_SUPABASE_URL=")) {
        SUPABASE_URL = line.split("=")[1].trim();
      }
      if (line.startsWith("EXPO_PUBLIC_SUPABASE_ANON_KEY=")) {
        SUPABASE_ANON_KEY = line.split("=")[1].trim();
      }
    }
  } catch (err) {
    console.log("Could not read .env file, trying env.ts as fallback...");
  }
}

// If still not found, try to read from env.ts as a fallback
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  try {
    console.log(`Reading from env.ts file: ${ENV_TS_PATH}`);
    const envTsContent = fs.readFileSync(ENV_TS_PATH, "utf8");
    // Look for fallback values or any values we can extract
    const urlFallbackMatch = envTsContent.match(
      /fallbackSupabaseUrl\s*=\s*["'](.+?)["']/
    );
    const keyFallbackMatch = envTsContent.match(
      /fallbackSupabaseKey\s*=\s*["'](.+?)["']/
    );

    // Also try direct constant declarations as a last resort
    const urlDirectMatch = envTsContent.match(
      /SUPABASE_URL\s*=\s*["'](.+?)["']/
    );
    const keyDirectMatch = envTsContent.match(
      /SUPABASE_ANON_KEY\s*=\s*["'](.+?)["']/
    );

    if (
      urlFallbackMatch &&
      urlFallbackMatch[1] &&
      urlFallbackMatch[1] !== "YOUR_SUPABASE_URL"
    ) {
      SUPABASE_URL = urlFallbackMatch[1];
    } else if (urlDirectMatch && urlDirectMatch[1]) {
      SUPABASE_URL = urlDirectMatch[1];
    }

    if (
      keyFallbackMatch &&
      keyFallbackMatch[1] &&
      keyFallbackMatch[1] !== "YOUR_SUPABASE_ANON_KEY"
    ) {
      SUPABASE_ANON_KEY = keyFallbackMatch[1];
    } else if (keyDirectMatch && keyDirectMatch[1]) {
      SUPABASE_ANON_KEY = keyDirectMatch[1];
    }
  } catch (err) {
    console.error("Failed to read env.ts file:", err.message);
  }
}

// Check if we've found valid credentials
if (!SUPABASE_URL || SUPABASE_URL === "YOUR_SUPABASE_URL") {
  console.error(
    "❌ Could not find valid SUPABASE_URL in environment variables, .env or env.ts"
  );
  console.log(
    "Please make sure your .env file has EXPO_PUBLIC_SUPABASE_URL set."
  );
  process.exit(1);
}

if (!SUPABASE_ANON_KEY || SUPABASE_ANON_KEY === "YOUR_SUPABASE_ANON_KEY") {
  console.error(
    "❌ Could not find valid SUPABASE_ANON_KEY in environment variables, .env or env.ts"
  );
  console.log(
    "Please make sure your .env file has EXPO_PUBLIC_SUPABASE_ANON_KEY set."
  );
  process.exit(1);
}

// Display Supabase configuration
console.log("\n📋 Supabase Configuration:");
console.log(`  URL: ${SUPABASE_URL}`);
console.log(
  `  Key: ${SUPABASE_ANON_KEY.substring(0, 5)}...${SUPABASE_ANON_KEY.substring(
    SUPABASE_ANON_KEY.length - 5
  )}`
);

// Create Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Comprehensive function to test Supabase connection and features
async function testSupabase() {
  console.log("\n🔍 Running Supabase connection tests...");

  // Test 1: Basic Connection
  try {
    console.log("\n📡 Test 1: Basic Connection");
    console.log("  Querying the 'pets' table...");

    const { data, error } = await supabase
      .from("pets")
      .select("count")
      .limit(1);

    if (error) {
      console.error("  ❌ Connection test failed:", error.message);
      throw error;
    }

    console.log("  ✅ Connection test passed!");
    console.log("  Database response:", data);
  } catch (error) {
    console.error(
      "  ❌ Connection test failed with unexpected error:",
      error.message
    );
    return false;
  }

  // Test 2: Authentication System
  try {
    console.log("\n🔐 Test 2: Authentication System");
    const { data, error } = await supabase.auth.getSession();

    if (error) {
      console.warn("  ⚠️ Auth system check returned an error:", error.message);
      console.warn("  This may be expected if no user is logged in");
    } else {
      console.log("  ✅ Auth system is working correctly");
      if (data.session) {
        console.log("  User is currently logged in");
      } else {
        console.log("  No active user session");
      }
    }
  } catch (error) {
    console.error(
      "  ⚠️ Auth test failed with unexpected error:",
      error.message
    );
  }

  // Test 3: Database Schema
  try {
    console.log("\n📊 Test 3: Database Schema");

    // Check for 'pets' table
    const { data: petsData, error: petsError } = await supabase
      .from("pets")
      .select("*")
      .limit(0);

    if (petsError) {
      console.error(`  ❌ 'pets' table check failed: ${petsError.message}`);
    } else {
      console.log(`  ✅ 'pets' table exists and is accessible`);
    }

    // Check for 'pet_interactions' table (if implemented)
    const { data: interactionsData, error: interactionsError } = await supabase
      .from("pet_interactions")
      .select("*")
      .limit(0);

    if (interactionsError) {
      console.warn(
        `  ⚠️ 'pet_interactions' table check failed: ${interactionsError.message}`
      );
      console.warn(
        "  This table may not be implemented yet or you may not have permissions"
      );
    } else {
      console.log(`  ✅ 'pet_interactions' table exists and is accessible`);
    }
  } catch (error) {
    console.error(
      "  ⚠️ Schema test failed with unexpected error:",
      error.message
    );
  }

  console.log("\n🎉 Supabase connection tests completed!");
  return true;
}

// Run the test
testSupabase().then((success) => {
  if (!success) {
    console.log("\n🛠️ Troubleshooting tips:");
    console.log(
      "  1. Check your EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY in .env"
    );
    console.log("  2. Make sure your Supabase project is running");
    console.log("  3. Verify that your tables exist in your Supabase database");
    console.log("  4. Check network connectivity to your Supabase instance");
    console.log("\n📚 For more help, see the supabase-setup-guide.md file");

    process.exit(1);
  } else {
    console.log(
      "\n✨ Your Supabase setup looks good! You can now run your app"
    );
  }
});
