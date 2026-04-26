# Quizix Platform

Quizix is a real-time, interactive quiz platform similar to Kahoot. It allows educators and hosts to create engaging quizzes, manage live lobbies, and track student performance in real-time. Students can join using a unique room code or explore public quizzes for solo practice.

## Core Features

- **Real-Time Synchronization**: Built entirely on Firebase Realtime Database for instantaneous updates across all connected clients.
- **Role-Based Workflows**:
  - **Hosts**: Create quizzes with customizable settings (timers, leaderboards, public/private visibility). Manage a live lobby, start the quiz, and view comprehensive performance reports.
  - **Students**: Join active rooms via a secure room code, participate in timed sessions, and receive instant feedback and calculated scores upon completion.
- **Explore & Solo Attempts**: Hosts can choose to make finished quizzes "public." These quizzes appear on the Explore page, allowing anyone to practice solo without needing a live host.
- **Dynamic Dashboard**: Users have personalized dashboards showing their hosted room history, total students reached, recently joined quizzes, and average scores.

## Tech Stack

- **Frontend Framework**: React (Vite)
- **Routing**: React Router v6
- **Authentication**: Firebase Auth (Email/Password & Google)
- **Database**: Firebase Realtime Database
- **Styling**: Tailwind CSS with custom design tokens
- **Animations**: Framer Motion
- **Icons**: Lucide React

## Application Architecture

The platform strictly uses Firebase Realtime Database. Data is structured to support both global room operations and individual user analytics efficiently:

### Realtime Database Structure

```json
{
  "rooms": {
    "{roomCode}": {
      "title": "React Basics",
      "hostId": "...",
      "hostName": "John Doe",
      "status": "waiting | active | finished",
      "settings": {
        "timePerQuestionToggle": true,
        "timePerQuestion": 30,
        "isPublic": true,
        "leaderboardEnabled": true
      },
      "questions": [ ... ],
      "students": {
        "{uid}": {
          "name": "Jane",
          "status": "finished",
          "answers": { ... },
          "score": 85,
          "breakdown": { ... }
        }
      }
    }
  },
  "users": {
    "{uid}": {
      "displayName": "John Doe",
      "email": "john@example.com",
      "hostedRooms": {
        "{roomCode}": {
          "title": "React Basics",
          "status": "finished",
          "students": 15,
          "createdAt": 1714068300000
        }
      },
      "joinedRooms": {
        "{roomCode}": {
          "title": "History Quiz",
          "host": "Mr. Smith",
          "score": 90,
          "date": 1714068300000
        }
      },
      "soloAttempts": {
        "{roomCode}": {
          "score": 100,
          "finishedAt": 1714068300000
        }
      }
    }
  }
}
```

## Running Locally

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Firebase**
   Ensure your `src/lib/firebase.js` is populated with your Firebase project credentials. You must enable Auth (Email/Password & Google) and Realtime Database in your Firebase Console.

3. **Start Development Server**
   ```bash
   npm run dev
   ```

## Design Philosophy
Quizix emphasizes a modern, premium "dark mode" aesthetic. We utilize a sleek indigo/violet gradient as our primary accent, complemented by glassmorphism effects and smooth micro-animations powered by Framer Motion. Every interactive element provides immediate visual feedback to ensure a highly engaging user experience.
