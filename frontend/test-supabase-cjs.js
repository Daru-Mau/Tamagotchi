// Supabase Connection Test (CommonJS version)
const fs = require("fs");
const path = require("path");
const { createClient } = require("@supabase/supabase-js");

// Find and read the env.ts file to extract credentials
const ENV_FILE_PATH = path.join(__dirname, "src", "config", "env.ts");

console.log(`Reading environment from: ${ENV_FILE_PATH}`);

// Read and parse the env.ts file to extract Supabase credentials
let SUPABASE_URL = "";
let SUPABASE_ANON_KEY = "";

try {
  const envFileContent = fs.readFileSync(ENV_FILE_PATH, "utf8");

  // Use regex to extract the URL and key
  const urlMatch = envFileContent.match(
    /export const SUPABASE_URL\s*=\s*["'](.+?)["']/
  );
  const keyMatch = envFileContent.match(
    /export const SUPABASE_ANON_KEY\s*=\s*["'](.+?)["']/
  );

  if (urlMatch && urlMatch[1]) {
    SUPABASE_URL = urlMatch[1];
  } else {
    console.error("❌ Could not find SUPABASE_URL in env.ts");
    console.error("Please make sure your env.ts file has the correct format.");
    process.exit(1);
  }

  if (keyMatch && keyMatch[1]) {
    SUPABASE_ANON_KEY = keyMatch[1];
  } else {
    console.error("❌ Could not find SUPABASE_ANON_KEY in env.ts");
    console.error("Please make sure your env.ts file has the correct format.");
    process.exit(1);
  }
} catch (error) {
  console.error(`❌ Error reading env.ts file: ${error.message}`);
  console.error("Please make sure the file exists at: " + ENV_FILE_PATH);
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
      "  1. Check your SUPABASE_URL and SUPABASE_ANON_KEY in src/config/env.ts"
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
