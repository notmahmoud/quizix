# Quizix Presentation Preparation Guide

This document contains potential questions your supervisor might ask during your graduation project presentation, along with suggested answers based on your codebase. It also includes advice on how to review your code effectively.

## 🧠 Potential Supervisor Questions & Answers

### 1. Architecture & Design Patterns
**Q: I noticed you use a lot of custom hooks (e.g., `useQuizSession`, `useAIGenerator`). Why did you choose this architecture?**
**A:** This is known as the "thin component" architecture. I separated the complex business logic, Firebase listeners, and API calls into custom React hooks. This keeps my UI components clean, focused strictly on rendering, and makes the logic highly reusable and easier to test.

### 2. Real-Time Synchronization (Firebase)
**Q: How do you handle real-time updates when a student submits an answer?**
**A:** I use the Firebase Realtime Database. When a student answers a question, the `useQuizSession` hook calls Firebase's `update()` method to modify the specific student's `answers` node. Meanwhile, the host is actively listening to the room's data via `subscribeToRoom` (using Firebase's `onValue` under the hood), which instantly updates the host's UI without needing to refresh.

### 3. AI Integration & Prompt Engineering
**Q: How do you ensure the AI generates questions in the exact format your app needs?**
**A:** I use a specifically engineered prompt sent to the Groq API (using the `llama-3.1-8b-instant` model). I instruct the AI to return *only* a JSON array with specific fields (`text`, `type`, `options`, `correct`, `tag`). Furthermore, I wrote post-processing logic in `useAIGenerator.js` that catches missing options or formatting errors and automatically corrects them (for example, ensuring Multiple Choice questions always have exactly 4 options).

### 4. Security & Environment Variables
**Q: How did you secure your API keys?**
**A:** I stored sensitive credentials, like the Groq API key, in a `.env.local` file using the `VITE_` prefix (`VITE_GROQ_API_KEY`). This file is added to `.gitignore` to prevent it from being pushed to the repository, ensuring the keys are not exposed publicly in the source code.

### 5. Application State & Timers
**Q: How does the global timer work across different clients?**
**A:** The host sets the global timer in the Firebase room settings. When the `useQuizSession` hook loads on the student side, it reads this value and initializes a local countdown. If the timer hits zero, the application automatically triggers the `handleAutoSubmit` function, saving the student's current progress to Firebase and redirecting them to the results page.

---

## 📖 Advice for Reviewing Your Code

To be fully prepared, you shouldn't just read files randomly. Follow this structured review strategy:

1. **Follow the User Journey:**
   - **Start at Landing Page:** Look at how a user decides to Create a Room or Join a Room.
   - **Trace the Host Flow:** Read `src/pages/CreateQuiz.jsx` -> `src/hooks/useCreateQuiz.js` -> `src/hooks/useAIGenerator.js`. Understand how a quiz is built and saved to Firebase.
   - **Trace the Student Flow:** Read `src/pages/JoinRoom.jsx` -> `src/pages/QuizSession.jsx` -> `src/hooks/useQuizSession.js`. Understand how they connect to the room and how their answers are sent back to the database.

2. **Master Your Custom Hooks:**
   Your custom hooks are the "brain" of your app. Make sure you can explain every major function inside:
   - `useAIGenerator.js`: Be prepared to explain the `fetch` call to the Groq API and the JSON regex parsing: `raw.match(/\[[\s\S]*\]/)`.
   - `useQuizSession.js`: Be ready to explain how `subscribeToRoom` sets up the real-time listener and how `handleAutoSubmit` calculates the final score.

3. **Be Ready to Explain Edge Cases:**
   Supervisors love asking "What happens if...?" questions to test your understanding:
   - *What happens if the AI returns broken JSON?* (Answer: Your code catches the error in a `catch` block and shows a fallback error message on the UI).
   - *What happens if the timer runs out while answering?* (Answer: `handleAutoSubmit` fires automatically, submitting whatever they have completed).

> [!TIP]
> **Practice explaining your code out loud.** Open a file like `useQuizSession.js` and try explaining what lines 27-40 do as if you were talking to a classmate. This builds immense confidence for the presentation!
