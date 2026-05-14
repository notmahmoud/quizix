# Quizix Platform

This project is a real-time quiz application built with React, Vite, Tailwind CSS, and Firebase. It includes features like AI-assisted question generation using the Groq API.

## Prerequisites

Before running the application, make sure you have the following installed on your machine:
- **Node.js** (version 18.x or higher recommended)
- **npm** (Node Package Manager)

## Setup Instructions

1. **Navigate to the project directory**
   Open your terminal and navigate to the root directory of this project.

2. **Install dependencies**
   Run the following command to install all required packages:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   The project requires a `.env.local` file in the root directory to connect to Firebase and the Groq API. 
   Create a `.env.local` file and add the following environment variables (fill in your actual credentials if they are not already set):

   ```env
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_firebase_app_id
   VITE_FIREBASE_DATABASE_URL=your_firebase_database_url
   VITE_GROQ_API_KEY=your_groq_api_key
   ```
   *(Note: For the graduation project submission, the `.env.local` file may already be included in the submission package. If so, you can skip this step.)*

## Running the Application

To start the development server and view the project in your browser, run the following command:

```bash
npm run dev
```
