#!/usr/bin/env node
/**
 * This script helps update your Supabase credentials in the env.ts file
 * Run this script with: node setup-supabase-credentials.js
 */

const fs = require("fs");
const path = require("path");
const readline = require("readline");

// Find the project root directory
const findProjectRoot = (currentDir) => {
  // Check if we're in the project root by looking for the frontend directory
  if (fs.existsSync(path.join(currentDir, "frontend"))) {
    return currentDir;
  }

  // Check if we're already in the frontend directory
  if (
    path.basename(currentDir) === "frontend" &&
    fs.existsSync(path.join(currentDir, "src"))
  ) {
    return path.dirname(currentDir);
  }

  // We didn't find the project root
  return null;
};

// Determine project root based on current directory
const currentDir = process.cwd();
const projectRoot = findProjectRoot(currentDir);

if (!projectRoot) {
  console.error("❌ Error: Could not locate project root directory.");
  console.error(
    "Please run this script from the project root or frontend directory."
  );
  process.exit(1);
}

const ENV_FILE_PATH = path.join(
  projectRoot,
  "frontend",
  "src",
  "config",
  "env.ts"
);

// Check if env.ts exists
if (!fs.existsSync(ENV_FILE_PATH)) {
  console.error(`❌ Error: Could not find env.ts file at ${ENV_FILE_PATH}`);
  console.error("Please make sure the file exists.");
  process.exit(1);
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log("\n🦕 Supabase Credentials Setup Helper 🦕\n");
console.log(
  "This script will update your Supabase credentials in the env.ts file"
);
console.log(
  "You can find your credentials in your Supabase project dashboard:"
);
console.log("Project Settings > API\n");

// Read the current env.ts file
fs.readFile(ENV_FILE_PATH, "utf8", (err, data) => {
  if (err) {
    console.error("Error reading env.ts file:", err);
    rl.close();
    return;
  }

  rl.question(
    "Enter your Supabase Project URL (e.g., https://abcdefghijklm.supabase.co): ",
    (projectUrl) => {
      rl.question("Enter your Supabase anon/public key: ", (anonKey) => {
        // Update the env.ts file
        let updatedData = data;

        // Update Project URL
        updatedData = updatedData.replace(
          /export const SUPABASE_URL = "(.*?)";/,
          `export const SUPABASE_URL = "${projectUrl}";`
        );

        // Update Anon Key
        updatedData = updatedData.replace(
          /export const SUPABASE_ANON_KEY = "(.*?)";/,
          `export const SUPABASE_ANON_KEY = "${anonKey}";`
        );

        // Write updated content back to the file
        fs.writeFile(ENV_FILE_PATH, updatedData, "utf8", (writeErr) => {
          if (writeErr) {
            console.error("Error writing to env.ts file:", writeErr);
            rl.close();
            return;
          }

          console.log("\n✅ Supabase credentials updated successfully!");
          console.log(`Updated file: ${ENV_FILE_PATH}`);
          console.log("\nYou can now run the app with:");
          console.log("  cd frontend");
          console.log("  npm start\n");

          rl.close();
        });
      });
    }
  );
});
