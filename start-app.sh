#!/bin/bash
# Tamagotchi App Launcher for macOS/Linux

# ANSI color codes
GREEN='\033[0;32m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Display header
echo -e "${CYAN}"
echo "╔════════════════════════════════════════╗"
echo "║       Tamagotchi App Launcher          ║"
echo "╚════════════════════════════════════════╝"
echo -e "${NC}"

# Check if the environment file exists and has valid credentials
ENV_FILE="./frontend/src/config/env.ts"
if [ -f "$ENV_FILE" ]; then
    if grep -q "your-project-id.supabase.co" "$ENV_FILE"; then
        echo -e "${YELLOW}Warning: It looks like you haven't set up your Supabase credentials yet.${NC}"
        echo -e "You should run ${GREEN}node setup-supabase-credentials.js${NC} first."
        
        read -p "Do you want to continue anyway? (y/n) " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            echo -e "${RED}Exiting.${NC}"
            exit 1
        fi
    fi
else
    echo -e "${RED}Error: Environment file not found at $ENV_FILE${NC}"
    exit 1
fi

# Navigate to the frontend directory
cd ./frontend || { echo -e "${RED}Error: frontend directory not found!${NC}"; exit 1; }

# Check if node_modules exists, if not, install dependencies
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}Node modules not found. Installing dependencies...${NC}"
    npm install || { echo -e "${RED}Failed to install dependencies!${NC}"; exit 1; }
fi

# Start the application
echo -e "${GREEN}Starting Expo development server...${NC}"
echo -e "${CYAN}You can scan the QR code with your Expo Go app to test on your device${NC}"
echo

# Run the Expo start command
npm start
