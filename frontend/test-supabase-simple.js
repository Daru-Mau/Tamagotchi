/**
 * Simplified Supabase Connection Test
 * Run with: node test-supabase-simple.js
 */
const fs = require("fs");
const path = require("path");
const { createClient } = require("@supabase/supabase-js");

// Find and read the env.ts file to extract credentials
const ENV_FILE_PATH = path.join(__dirname, "src", "config", "env.ts");
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
    console.error("Could not find SUPABASE_URL in env.ts");
    process.exit(1);
  }

  if (keyMatch && keyMatch[1]) {
    SUPABASE_ANON_KEY = keyMatch[1];
  } else {
    console.error("Could not find SUPABASE_ANON_KEY in env.ts");
    process.exit(1);
  }
} catch (error) {
  console.error(`Error reading env.ts file: ${error.message}`);
  process.exit(1);
}

// Create Supabase client
console.log(`Testing connection to ${SUPABASE_URL}`);
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Test the connection
async function testConnection() {
  try {
    // Test basic connection
    console.log("Connecting to Supabase...");
    const { data, error } = await supabase.from("pets").select("count");

    if (error) {
      console.error(`❌ Connection failed: ${error.message}`);
      return false;
    }

    console.log("✅ Connection successful!");
    console.log(`Database response: ${JSON.stringify(data)}`);

    return true;
  } catch (err) {
    console.error(`❌ Unexpected error: ${err.message}`);
    return false;
  }
}

// Run the test
testConnection()
  .then((success) => {
    if (success) {
      console.log("✅ Your Supabase setup is working correctly!");
    } else {
      console.log(
        "❌ Unable to connect to Supabase. Please check your configuration."
      );
      process.exit(1);
    }
  })
  .catch((err) => {
    console.error(`❌ Test failed with error: ${err.message}`);
    process.exit(1);
  });
