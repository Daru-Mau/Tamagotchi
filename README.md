# Tamagotchi Mobile App

## Overview

This project is a custom Tamagotchi game developed as a mobile application using React Native with TypeScript for the frontend and Python with Flask for the backend. The application allows users to interact with a virtual pet, manage its needs, and engage in various gameplay activities.

## Technologies Used

- **Frontend**: React Native with TypeScript, Expo

  - Development Environment: Expo
  - State Management: Redux with Redux Toolkit
  - UI Framework: React Native Paper
  - Navigation: React Navigation
  - Animation: Lottie React Native
  - HTTP Client: Axios
  - Local Storage: AsyncStorage
  - Database Client: Supabase JS Client

- **Backend**: Supabase (replacing the previous Flask backend)

  - Database: PostgreSQL (provided by Supabase)
  - Authentication: Supabase Auth
  - API: Supabase REST API
  - Storage: Supabase Storage

- **Online Technologies**:
  - **Backend Hosting**: Supabase (PostgreSQL database + Auth + Storage)
  - **Authentication**: Supabase Auth
  - **Real-time Communication**: Firebase Realtime Database or Socket.IO
  - **Storage**: AWS S3 (for pet images and animations)
  - **Notifications**: Firebase Cloud Messaging (FCM)
  - **Analytics**: Google Analytics for Firebase

## Getting Started

### Prerequisites

- Node.js (v14 or newer)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- Expo Go app on your mobile device (available on App Store or Google Play)
- Supabase account (https://supabase.com)

### Setup

1. **Clone the repository**

   ```
   git clone <repository-url>
   cd Tamagotchi
   ```

2. **Setup Supabase**

   - Create a new project on [Supabase](https://supabase.com/dashboard)
   - Create a `pets` table with the following columns:
     - id (uuid, primary key)
     - name (text)
     - pet_type (text)
     - age (integer)
     - happiness (integer)
     - hunger (integer)
     - created_at (timestamp with time zone)
     - last_interaction (timestamp with time zone)
     - user_id (uuid, foreign key to auth.users)
   - Get your Supabase URL and anon key from Settings > API

3. **Configure Environment Variables**

   - Update the values in `frontend/src/config/env.ts` with your Supabase credentials

4. **Install dependencies**

   ```
   cd frontend
   npm install
   ```

5. **Start the app**

   ```
   npm start
   ```

   Or use the launcher scripts:

   ```
   # On Windows
   ./start-app.bat

   # Or with PowerShell
   ./start-app.ps1
   ```

6. **Run on your device**
   - Scan the QR code with Expo Go app on your mobile device
   - Or press 'a' to run on an Android emulator if you have one set up
   - Or press 'i' to run on an iOS simulator if you're on macOS

## Project Structure

```
tamagotchi-mobile-app
├── frontend
│   ├── src
│   │   ├── assets
│   │   │   ├── animations     # Lottie animation files
│   │   │   └── images         # Image assets
│   │   ├── components
│   │   │   ├── Pet           # Pet-related components
│   │   │   └── UI            # Reusable UI components
│   │   ├── config            # Environment configuration
│   │   ├── screens           # Screen components
│   │   ├── services          # API and Supabase services
│   │   ├── store             # Redux store and slices
│   │   ├── types             # TypeScript type definitions
│   │   └── App.tsx           # Main app component
│   ├── package.json
│   ├── tsconfig.json
│   └── metro.config.js
├── start-app.bat             # Windows launcher script
└── start-app.ps1             # PowerShell launcher script
│   │   ├── controllers
│   │   ├── models
│   │   ├── routes
│   │   └── app.py
│   ├── requirements.txt
│   └── venv
├── .gitignore
├── README.md
└── LICENSE
```

## Setup Instructions

1. **Clone the repository**:

   ```bash
   git clone https://github.com/yourusername/Tamagotchi.git
   cd Tamagotchi
   ```

2. **Set up the frontend**:

   - Navigate to the `frontend` directory:
     ```bash
     cd frontend
     ```
   - Install dependencies:
     ```bash
     npm install
     ```

3. **Set up the backend**:

   - Navigate to the `backend` directory:
     ```bash
     cd ../backend
     ```
   - Create a virtual environment (if not already created):
     ```bash
     python -m venv venv
     ```
   - Activate the virtual environment:
     - On Windows:
       ```bash
       .\venv\Scripts\activate
       ```
     - On macOS/Linux:
       ```bash
       source venv/bin/activate
       ```
   - Install backend dependencies:
     ```bash
     pip install -r requirements.txt
     ```
   - Create a `.env` file in the backend directory:
     ```bash
     echo "SECRET_KEY=your_secret_key_here" > .env
     echo "FLASK_ENV=development" >> .env
     ```

4. **Run the application**:

   - Start the backend server (from the backend directory with venv activated):
     ```bash
     python src/app.py
     ```
   - In a separate terminal, start the frontend development server:

     ```bash
     cd frontend
     npm start
     ```

   - For mobile development:

     ```bash
     # To run on Android
     npm run android

     # To run on iOS
     npm run ios
     ```

## Features

### Core Tamagotchi Features

- **Pet Creation**: Create and customize your virtual pet with different appearances and traits
- **Care Mechanics**: Feed, play with, and clean up after your pet to maintain its health and happiness
- **Life Cycle**: Watch your pet grow from baby to adult based on your care
- **Statistics Tracking**: Monitor hunger, happiness, health, and age metrics
- **Daily Activities**: Engage in different activities with your pet like games, walks, and training

### Multiplayer Features

- **Pet Playdates**: Schedule playdates with your partner's pet
- **Gift Exchange**: Send gifts and items to each other's pets
- **Shared Care**: Collaborate on pet care responsibilities
- **Pet Messages**: Leave messages for your partner through your pet

### Technical Features

- **Real-time Updates**: Synchronize pet status between devices
- **Offline Support**: Continue playing even when offline with local data sync
- **Push Notifications**: Get alerts when your pet needs attention or when your partner interacts with it
- **Data Persistence**: Save and load pet status and progress

## License

This project is licensed under the MIT License. See the LICENSE file for more details.
