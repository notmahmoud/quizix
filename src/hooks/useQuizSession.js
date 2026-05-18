// useState     → local state (answers, timer, UI flags)
// useEffect    → side-effects (room subscription, countdown timer)
// useRef       → mutable reference to DOM elements (for smooth-scroll navigation)
// useCallback  → memoize handleAutoSubmit so it can safely be used in the timer's dependency array
import { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { subscribeToRoom, submitAnswers, submitSoloAnswers } from '../lib/db';
import { db } from '../lib/firebase';
import { ref, update } from 'firebase/database';

/**
 * useQuizSession — the most complex hook in the project.
 *
 * Handles everything that happens while a student is actively taking a quiz:
 *  - Subscribing to real-time room data (questions, status, timer settings)
 *  - Running a global countdown timer that auto-submits when it hits zero
 *  - Tracking and saving answers in real-time to Firebase as the student selects them
 *  - Submitting the final score + per-topic breakdown when the quiz is done
 *  - Supporting both LIVE mode (waiting for the host to start) and SOLO mode (immediate start)
 *
 * LIVE mode: student joins via a room code shared by a host
 * SOLO mode: student re-takes a finished public quiz from the Explore page (?solo=true in URL)
 */
export default function useQuizSession() {
  const { code } = useParams();         // room code from URL, e.g. /room/ABC123/quiz
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useAuth();

  // Detect solo mode from the URL query string: /room/ABC123/quiz?solo=true
  const isSolo = new URLSearchParams(location.search).get('solo') === 'true';

  // Use the logged-in user's UID, or fall back to 'guest' for unauthenticated users
  const uid = currentUser?.uid || 'guest';

  // ─── State ────────────────────────────────────────────────────────────────────

  const [roomData, setRoomData] = useState(null);        // the full room object from Firebase
  const [answers, setAnswers] = useState({});             // { [questionId]: selectedOptionIndex }
  const [globalTimeLeft, setGlobalTimeLeft] = useState(null); // seconds remaining (null = no timer)
  const [timerInitialized, setTimerInitialized] = useState(false); // prevents re-seeding the timer on re-renders
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false); // shown when student tries to submit with unanswered questions
  const [showWarningToast, setShowWarningToast] = useState(false); // shown at 5 seconds remaining
  const [activeIndex, setActiveIndex] = useState(0);     // index of the currently highlighted question in the sidebar
  const questionRefs = useRef([]);                        // array of DOM refs — one per question card, used for smooth scrolling

  // ─── Effect 1: Subscribe to room ──────────────────────────────────────────────
  // Listens to real-time changes on rooms/{code} in Firebase.
  // In LIVE mode this is how the student knows when the host starts the quiz (status → 'active').
  useEffect(() => {
    const unsub = subscribeToRoom(code, (data) => {
      if (data) {
        setRoomData(data);

        // Initialize the global timer only once, the first time we receive room data.
        // We read the timer value from room settings and convert minutes → seconds.
        // After the first initialization, subsequent room updates don't reset the timer.
        if (!timerInitialized && data.settings?.globalTimerEnabled) {
          setGlobalTimeLeft((data.settings.globalTimer || 10) * 60); // default 10 minutes
          setTimerInitialized(true);
        } else if (!timerInitialized) {
          // Timer is disabled — mark as initialized so the quiz can still function
          setTimerInitialized(true);
        }
      }
    });
    return () => unsub(); // cleanup: stop listening when student leaves the page
  }, [code, timerInitialized]);

  // ─── handleAutoSubmit (memoized with useCallback) ─────────────────────────────
  // This function is called both by the countdown timer (when it hits 0) and by
  // handleSubmitRequest (when the student manually submits with all questions answered).
  // useCallback ensures a stable reference so it can be included in the timer effect's
  // dependency array without causing an infinite re-render loop.
  const handleAutoSubmit = useCallback(async () => {
    // Guard against double-submission (e.g. timer fires while student also clicks submit)
    if (isSubmitting) return;
    setIsSubmitting(true);
    setShowWarningToast(false);
    setShowConfirmModal(false);

    const questions = roomData?.questions || [];
    let totalPoints = 0, earnedPoints = 0;
    const tagStats = {}; // accumulates per-topic points for the breakdown

    // Evaluate every question against the student's answers
    questions.forEach((q) => {
      const qPoints = q.points || 10;
      const tag = q.tag || 'General';
      const isCorrect = answers[q.id] === q.correct; // compare selected index to correct index

      totalPoints += qPoints;
      if (isCorrect) earnedPoints += qPoints;

      // Group earned/total points by topic tag for the breakdown chart
      if (!tagStats[tag]) tagStats[tag] = { total: 0, earned: 0 };
      tagStats[tag].total += qPoints;
      if (isCorrect) tagStats[tag].earned += qPoints;
    });

    // Final score as a percentage (0–100)
    const finalScore = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0;

    // Convert per-topic raw points into percentage scores for the breakdown
    const breakdown = {};
    Object.keys(tagStats).forEach(tag => {
      breakdown[tag] = tagStats[tag].total > 0
        ? Math.round((tagStats[tag].earned / tagStats[tag].total) * 100) : 0;
    });

    try {
      const roomSummary = { title: roomData?.title || 'Untitled', hostName: roomData?.hostName || 'Unknown' };

      if (isSolo) {
        // Solo: save under users/{uid}/soloAttempts (no host-visible record needed)
        await submitSoloAnswers(code, uid, answers, finalScore, breakdown);
      } else {
        // Live: save under the room's students node so the host can see it in the report
        await submitAnswers(code, uid, answers, finalScore, breakdown, roomSummary);
      }

      // Navigate to the results page; replace: true removes the quiz from browser history
      // so the back button doesn't return to an already-submitted quiz
      navigate(`/room/${code}/results/${uid}${isSolo ? '?solo=true' : ''}`, { replace: true });
    } catch (err) {
      console.error('Submit failed:', err);
      setIsSubmitting(false); // allow retry if submission fails
    }
  }, [isSubmitting, roomData, answers, isSolo, code, uid, navigate]);

  // ─── Effect 2: Global countdown timer ─────────────────────────────────────────
  // Decrements globalTimeLeft by 1 every second using a recursive setTimeout pattern
  // (safer than setInterval in React because it clears itself on each render cycle).
  useEffect(() => {
    // Only run the timer if it has been initialized and a time value exists
    if (globalTimeLeft === null || isSubmitting || !timerInitialized) return;

    // In LIVE mode, only count down while the room is active.
    // In SOLO mode, start counting immediately (no host to wait for).
    const isActive = isSolo || roomData?.status === 'active';
    if (!isActive) return;

    if (globalTimeLeft === 0) {
      // Time's up — auto-submit whatever answers have been selected
      // eslint-disable-next-line react-hooks/set-state-in-effect
      handleAutoSubmit();
      return;
    }

    // Show the 5-second warning toast — use setTimeout(..., 0) to defer the state
    // update outside the current render cycle and avoid the React warning about
    // "cannot update a component while rendering a different component"
    if (globalTimeLeft === 5) {
      setTimeout(() => setShowWarningToast(true), 0);
    }

    // Schedule the next tick in 1 second, then clean up when the effect re-runs
    const t = setTimeout(() => setGlobalTimeLeft(s => s - 1), 1000);
    return () => clearTimeout(t);
  }, [globalTimeLeft, isSubmitting, timerInitialized, roomData?.status, isSolo, handleAutoSubmit]);

  // ─── handleSelectAnswer ────────────────────────────────────────────────────────
  // Called whenever the student clicks an answer option.
  // Does two things simultaneously:
  //  1. Updates local state so the UI re-renders immediately with the selected answer highlighted
  //  2. Writes the answer to Firebase in real-time so the host can see progress live
  const handleSelectAnswer = (questionId, value) => {
    const newAnswers = { ...answers, [questionId]: value };
    setAnswers(newAnswers);

    // Real-time Firebase save
    if (!isSolo) {
      // LIVE mode: update both the answer and mark the student's status as 'answering'
      // (this makes the student's row show as "in progress" on the host lobby)
      update(ref(db, `rooms/${code}/students/${uid}`), { 
        [`answers/${questionId}`]: value,
        status: 'answering'
      }).catch(console.error);
    } else {
      // SOLO mode: only save the answer — no status update needed since there's no host watching
      update(ref(db, `rooms/${code}/students/${uid}/answers`), { [questionId]: value }).catch(console.error);
    }
  };

  // Scrolls smoothly to the question at the given index and highlights it in the sidebar.
  // questionRefs.current[index] is the DOM node of that question card.
  const scrollToQuestion = (index) => {
    setActiveIndex(index);
    questionRefs.current[index]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Called when the student clicks the "Submit" button.
  // If they have unanswered questions, show a confirmation modal first.
  // If all questions are answered, submit immediately.
  const handleSubmitRequest = () => {
    const questions = roomData?.questions || [];
    const answeredCount = Object.keys(answers).length;
    if (answeredCount < questions.length) {
      setShowConfirmModal(true);  // warn the student about unanswered questions
    } else {
      handleAutoSubmit();         // all answered — go ahead and submit
    }
  };

  // Derived values used by the UI to show progress (e.g. "3 / 10 answered")
  const answeredCount = Object.keys(answers).length;
  const totalQuestions = roomData?.questions?.length || 0;

  return {
    code, uid, isSolo,
    roomData, answers, answeredCount, totalQuestions,
    globalTimeLeft,
    isSubmitting,
    showConfirmModal, setShowConfirmModal,
    showWarningToast,
    activeIndex, setActiveIndex,
    questionRefs,
    handleSelectAnswer, scrollToQuestion,
    handleSubmitRequest, handleAutoSubmit
  };
}
