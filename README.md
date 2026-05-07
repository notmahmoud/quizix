# QUIZIX — AI-Powered Quiz Platform
# PROJECT CONTEXT FOR AI ASSISTANTS — READ FULLY BEFORE TOUCHING ANYTHING

---

## ⚠️ CRITICAL RULES — NEVER BREAK THESE

1. NEVER use localStorage for quiz state, room state, or user data
2. NEVER add mock/hardcoded data anywhere — empty state UI only
3. NEVER change Tailwind classes or styling without being asked
4. NEVER combine multiple features into one file
5. NEVER touch firebase.js or db.js unless explicitly asked
6. NEVER change any React Router routes without being asked
7. ALWAYS use { replace: true } when navigating to final destination pages
8. ALWAYS load page data from Firebase using useParams() only
9. ALWAYS ask to confirm before refactoring more than one file at a time
10. ALWAYS show only changed files in your response — never the full codebase

---

## What This Project Is

Quizix is a real-time AI-powered quiz platform built as a graduation project.
A host/teacher creates a quiz room, students join with a code, answer questions
live in a free-navigation exam layout, and see results with topic breakdowns.

Key differentiator: AI question generation using Groq API (Llama 3.1).
Think Kahoot but more advanced, professional, and AI-powered.

---

## Tech Stack

- React (Vite)
- React Router v6
- Firebase Auth (email/password)
- Firebase Realtime Database (NOT Firestore — no credit card available)
- Tailwind CSS
- Framer Motion (page transitions and animations)
- Lucide React (icons)
- Groq API with Llama 3.1 (AI question generation)

---

## Design Language — Never Change Without Being Asked

- Dark mode first
- Background: #0a0a0f
- Cards: #111118
- Borders: #1e1e2e
- Primary accent: indigo/violet gradient (#6366f1 to #8b5cf6)
- Success: emerald #10b981
- Error: red #ef4444
- Font: Inter
- Generous spacing — never cramped
- Glassmorphism used sparingly
- Framer Motion for page transitions and card stagger animations
- Skeleton loaders for loading states — never spinners
- Every interactive element has hover state and 150ms transition
- Fully responsive — mobile first

---

## Environment Variables

Located in .env.local (hidden file, exists in project root):
---

## Features — Current Status

### ✅ Working:
- Landing page with hero, feature badges, CTA buttons
- Auth (signup/login) with real display names saved to Firebase
- Quiz creation multi-step form (settings → questions → review)
- AI question generation via Groq API (Llama 3.1-8b-instant)
- Host lobby with real-time student cards and status badges
- Student waiting screen ("Waiting for host to start")
- Quiz session (free navigation layout, all questions visible,
  global timer, real-time answer saving to Firebase)
- Student results page (score ring, topic breakdown, answer review)
- Host report page with student card modal
- Student modal showing full answer review per topic
- Dashboard (real Firebase data, hosted/joined rooms, stats)
- Explore page (public rooms only, isPublic === true)
- Notifications bell with unread indicator
- Leaderboard (live sessions only, when host enables it)
- About and Vision as smooth scroll sections on landing page

### ❌ Known Issues / In Progress:
- Student profile click on host report modal needs testing
- Explore page solo attempt flow needs end-to-end testing
- Firebase security rules still in test mode (tighten before presentation)

### 🗑️ Deliberately Removed:
- Per-question timer (removed, only global timer remains)
- Re-test feature (too complex, removed intentionally)
- Realtime Database replaced Firestore (no credit card available)

---

## AI Question Generation

- Provider: Groq API (free, no credit card, works globally)
- Model: llama-3.1-8b-instant
- Endpoint: https://api.groq.com/openai/v1/chat/completions
- Max questions per generation: 10
- Total questions per quiz: unlimited
- Key stored in: VITE_GROQ_API_KEY
- JSON cleaning before parse:
  content.replace(/```json/g,'').replace(/```/g,'').trim()
- On 429 error: wait 5 seconds and retry once

---

## Quiz Session Design

- Free navigation — all questions visible on one scrollable page
- Question navigator: numbered circles (answered/unanswered/current)
- One global countdown timer in top bar
- Timer turns orange under 20% remaining
- Timer turns red and pulses under 10% remaining
- Auto-submit on timer zero with 5 second warning toast
- Answers save to Firebase in real time as student selects
- Submit confirmation modal if questions are unanswered
- Navigate to results with { replace: true } after submit

---

## Explore Page Logic

- Shows only rooms where isPublic === true and status === "finished"
- Free to join without code (solo attempt flow)
- Solo attempt: no lobby, straight to questions, saves to soloAttempts
- Leaderboard hidden on solo attempts regardless of settings
- Search by title and filter by topic tag

---

## How To Continue Working On This Project

1. Read this file completely first
2. Read src/lib/firebase.js and src/lib/db.js to verify Firebase paths
3. Read the specific component you are about to change
4. Tell me what you understood before touching anything
5. Make ONE change at a time
6. Show only changed files in your response
7. Wait for confirmation before moving to the next change

## If Adding A New Feature:
- Create a new hook in src/hooks/ for the logic
- Create a new folder in src/components/{featureName}/ for the UI
- Keep the page file under 30 lines
- Follow the dark theme design language exactly
- Write to Firebase using the established path patterns
- Never add mock data — use empty states

---

## Presentation Demo Flow (For Reference)

1. Open landing page — show AI badge and hero
2. Sign up as host on laptop
3. Create quiz — use AI generation live ("Solar System", 5 questions, MCQ)
4. Launch room — show room code
5. Join on phone as student — host sees card appear live
6. Host starts quiz — student screen switches instantly
7. Answer questions on phone — show free navigation
8. Submit — show results with topic breakdown
9. Host clicks student card — show full modal with answer review
10. Show explore page with public rooms

This demo flow shows every major feature in under 5 minutes.


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

---

## Codebase Refactoring

All pages over 200 lines were fully refactored into a granular component + custom hook architecture. Zero functional, styling, or Firebase changes were made.

### Rules Applied
- State remains in custom hooks (never in child components)
- Child components receive all data via props only
- Every page file is now under 50 lines (imports + JSX shell only)
- All logic (state, handlers, Firebase calls) lives in `src/hooks/`
- All UI blocks (modals, charts, cards, form sections) live in `src/components/<pageName>/`

---

### Phase 1 — CreateQuiz.jsx (752 → 41 lines)

**Hook extracted:**
- `src/hooks/useCreateQuiz.js` — All state, question CRUD handlers, validation, Firebase room creation
- `src/hooks/useAIGenerator.js` — All Groq API fetch logic, retry on 429, question validation & parsing

**Components extracted:**
| File | Description |
|---|---|
| `src/components/createQuiz/shared/StepIndicator.jsx` | Step 1/2/3 progress bar |
| `src/components/createQuiz/shared/FooterActions.jsx` | Back / Next / Launch buttons |
| `src/components/createQuiz/steps/SettingsStep.jsx` | Step 1 — all settings fields & toggles |
| `src/components/createQuiz/steps/QuestionsStep.jsx` | Step 2 — renders AI panel + questions list |
| `src/components/createQuiz/steps/ReviewStep.jsx` | Step 3 — launch preview summary |
| `src/components/createQuiz/questions/QuestionsList.jsx` | Maps over questions, renders each card + Add button |
| `src/components/createQuiz/questions/QuestionCard.jsx` | Single question card wrapper |
| `src/components/createQuiz/questions/MCQOptions.jsx` | 4-option MCQ inputs with radio selection |
| `src/components/createQuiz/questions/TrueFalseOptions.jsx` | True/False correct answer selector |
| `src/components/createQuiz/questions/QuestionTypeSelector.jsx` | MCQ / TF / Long Answer type switcher |
| `src/components/createQuiz/ai/AIGeneratorPanel.jsx` | Collapsible AI generator container |
| `src/components/createQuiz/ai/AIGeneratorForm.jsx` | Topic, difficulty, count, type inputs + generate button |

---

### Phase 2 — HostReport.jsx (431 → 40 lines)

**Hook extracted:**
- `src/hooks/useHostReport.js` — Firebase subscription, all report calculations (avg score, pass rate, topic map, leaderboard)

**Components extracted:**
| File | Description |
|---|---|
| `src/components/hostReport/HostReportHeader.jsx` | Title and Export CSV button |
| `src/components/hostReport/RemedialAlert.jsx` | Conditional alert for weak topics |
| `src/components/hostReport/OverviewCards.jsx` | 3 stat cards (students, average, pass rate) |
| `src/components/hostReport/TopicPerformanceChart.jsx` | Animated bar chart by topic |
| `src/components/hostReport/StudentResultsTable.jsx` | Clickable student results table |
| `src/components/hostReport/StudentModal.jsx` | Per-student detailed review modal |

---

### Phase 3 — Results.jsx (329 → 45 lines)

**Hook extracted:**
- `src/hooks/useResults.js` — Firebase + solo attempt subscriptions, score calc, topic breakdown, leaderboard sort

**Components extracted:**
| File | Description |
|---|---|
| `src/components/results/ResultsHeader.jsx` | Animated circular score display |
| `src/components/results/ResultsTabs.jsx` | Overview / Leaderboard tab switcher |
| `src/components/results/PerformanceByTopic.jsx` | Animated topic progress bars |
| `src/components/results/AnswerReview.jsx` | Per-question correct/incorrect review cards |
| `src/components/results/LeaderboardTable.jsx` | Ranked leaderboard table with trophy icons |

---

### Phase 4 — QuizSession.jsx (306 → 42 lines)

**Hook extracted:**
- `src/hooks/useQuizSession.js` — Firebase subscription, per-question + global timers, answer tracking, score calculation, submit to RTDB

**Components extracted:**
| File | Description |
|---|---|
| `src/components/quizSession/SessionHeader.jsx` | Sticky progress bar + per-question & global timers |
| `src/components/quizSession/QuestionSlide.jsx` | Animated question card with MCQ/TF answer options |
| `src/components/quizSession/SubmittingOverlay.jsx` | "Quiz Submitted!" confirmation overlay |
| `src/components/quizSession/WaitingScreen.jsx` | "Waiting for Host" holding screen |

---

### Phase 5 — Dashboard.jsx (255 → 35 lines)

**Hook extracted:**
- `src/hooks/useDashboard.js` — Firebase data fetch, stats calculation (total hosted, students, avg score), room filtering

**Components extracted:**
| File | Description |
|---|---|
| `src/components/dashboard/DashboardStats.jsx` | 3 animated stat cards |
| `src/components/dashboard/HostedRoomsList.jsx` | Active rooms + past hosted rooms sections |
| `src/components/dashboard/JoinedRoomsList.jsx` | Recently joined quizzes list |

---

### Phase 6 — Landing.jsx (226 → 13 lines)

**Hook extracted:**
- `src/hooks/useLanding.js` — Public rooms fetch for featured section

**Components extracted:**
| File | Description |
|---|---|
| `src/components/landing/HeroSection.jsx` | Full hero with animated mockup cards |
| `src/components/landing/FeaturedRoomsSection.jsx` | Horizontal scroll of public quiz cards |

---

### Phase 7 — HostLobby.jsx (225 → 28 lines)

**Hook extracted:**
- `src/hooks/useHostLobby.js` — Firebase subscription, copy code, start/end session handlers, status badge renderer

**Components extracted:**
| File | Description |
|---|---|
| `src/components/hostLobby/LobbyHeader.jsx` | Room code display with copy button |
| `src/components/hostLobby/LobbyActionBar.jsx` | Student count + Start/End/View Report actions |
| `src/components/hostLobby/StudentGrid.jsx` | Animated student card grid with status badges |
