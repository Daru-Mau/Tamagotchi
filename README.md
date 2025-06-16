# Tamagotchi Mobile App

## Overview

This project is a custom Tamagotchi game developed as a mobile application using React Native with TypeScript for the frontend and Python with Flask for the backend. The application allows users to interact with a virtual pet, manage its needs, and engage in various gameplay activities.

## Technologies Used

- **Frontend**: React Native with TypeScript

  - State Management: Redux with Redux Toolkit
  - UI Framework: React Native Paper
  - Navigation: React Navigation
  - Animation: Lottie React Native
  - HTTP Client: Axios
  - Local Storage: AsyncStorage

- **Backend**: Python with Flask

  - API Framework: Flask with Flask-CORS
  - Database: SQLite (development) / MongoDB (production option)
  - Authentication: JWT (JSON Web Tokens)
  - Validation: Marshmallow

- **Online Technologies**:
  - **Backend Hosting**: Heroku or AWS Elastic Beanstalk
  - **Database**: MongoDB Atlas (cloud database)
  - **Authentication**: Auth0 or Firebase Authentication
  - **Real-time Communication**: Firebase Realtime Database or Socket.IO
  - **Storage**: AWS S3 (for pet images and animations)
  - **Notifications**: Firebase Cloud Messaging (FCM)
  - **Analytics**: Google Analytics for Firebase

## Project Structure

```
tamagotchi-mobile-app
├── frontend
│   ├── src
│   │   ├── assets
│   │   ├── components
│   │   ├── screens
│   │   ├── services
│   │   ├── store
│   │   ├── types
│   │   └── App.tsx
│   ├── package.json
│   ├── tsconfig.json
│   └── metro.config.js
├── backend
│   ├── src
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
