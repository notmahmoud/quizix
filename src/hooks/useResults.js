import { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { subscribeToRoom } from '../lib/db';
import { db } from '../lib/firebase';
import { ref, get } from 'firebase/database';
import { useAuth } from '../context/AuthContext';

/**
 * useResults — data hook for the Results page
 *
 * The Results page is shown after a student submits their quiz.
 * It supports two modes, determined by the ?solo=true query parameter:
 *
 *  LIVE mode  — student data lives under rooms/{code}/students/{uid}
 *  SOLO mode  — student data lives under users/{uid}/soloAttempts/{code}
 *
 * Responsibilities:
 *  - Subscribes to the room for live data (questions, leaderboard, etc.)
 *  - Fetches solo attempt data separately (one-time read) when in solo mode
 *  - Builds the full result object: score, per-topic breakdown, answer review, leaderboard
 */
export default function useResults() {
  const { code, uid } = useParams(); // room code and student uid from the URL
  const location = useLocation();
  const { currentUser } = useAuth();
  
  // Detect solo mode from the URL query string (set by useQuizSession when navigating here)
  const isSoloAttempt = new URLSearchParams(location.search).get('solo') === 'true';

  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'leaderboard'
  const [roomData, setRoomData] = useState(null);
  const [soloData, setSoloData] = useState(null); // only populated in solo mode

  // Subscribe to real-time room data to get questions and other students' scores
  useEffect(() => {
    const unsubscribe = subscribeToRoom(code, (data) => {
      if (data) setRoomData(data);
    });
    return () => unsubscribe();
  }, [code]);

  // In solo mode, the student's answers/score are not under the room's students node
  // but under users/{uid}/soloAttempts/{code} — so we fetch that separately
  useEffect(() => {
    if (!currentUser || !code) return;
    const fetchSoloData = async () => {
      const soloRef = ref(db, `users/${currentUser.uid}/soloAttempts/${code}`);
      const snapshot = await get(soloRef);
      if (snapshot.exists()) {
        setSoloData(snapshot.val());
      }
    };
    fetchSoloData();
  }, [code, currentUser]);

  // Resolve the student's data — prefer the room node (live mode),
  // fall back to the solo attempt, fall back to null if neither is ready yet
  const studentData = (roomData?.students && roomData.students[uid]) || soloData || null;
  const questions = roomData?.questions || [];
  
  // Build the result object incrementally — starts with just the score,
  // then topics, review, and leaderboard are added as data becomes available
  const result = {
    score: studentData?.score || 0,
    topics: [],
    review: [],
    leaderboard: []
  };

  if (studentData && studentData.answers) {
    // ── Per-topic breakdown ────────────────────────────────────────────────
    // Group questions by their tag, then count correct vs total for each tag
    const topicMap = {};
    questions.forEach((q) => {
      const tag = q.tag || 'General';
      if (!topicMap[tag]) topicMap[tag] = { name: tag, correct: 0, total: 0 };
      
      topicMap[tag].total += 1;
      if (studentData.answers[q.id] === q.correct) {
        topicMap[tag].correct += 1;
      }

      // ── Answer review ──────────────────────────────────────────────────
      // Convert the stored index values back into human-readable text
      const studentAnsIdx = studentData.answers[q.id];
      const isCorrect = studentAnsIdx === q.correct;
      let studentAnswerText = 'Not Answered';
      let correctAnswerText = 'Unknown';
      
      if (q.type === 'MCQ') {
        // Look up the option text by index
        studentAnswerText = studentAnsIdx !== undefined ? q.options[studentAnsIdx] : 'Not Answered';
        correctAnswerText = q.options[q.correct];
      } else if (q.type === 'TF') {
        // TF options are not stored on the question — they're always ["True", "False"]
        const tfOptions = ['True', 'False'];
        studentAnswerText = studentAnsIdx !== undefined ? tfOptions[studentAnsIdx] : 'Not Answered';
        correctAnswerText = tfOptions[q.correct];
      }

      result.review.push({
        id: q.id,
        text: q.text,
        tag: tag,
        studentAnswer: studentAnswerText,
        correctAnswer: correctAnswerText,
        isCorrect: isCorrect
      });
    });
    
    result.topics = Object.values(topicMap);
  }

  // ── Leaderboard ──────────────────────────────────────────────────────────
  // Only available in live mode — solo attempts are private and don't contribute to the leaderboard
  if (roomData?.students) {
    const allStudents = Object.entries(roomData.students).map(([id, s]) => ({
      id,
      name: s.name || 'Anonymous',
      score: s.score || 0,
    }));
    
    // Sort descending by score so rank 1 is the highest scorer
    allStudents.sort((a, b) => b.score - a.score);
    
    result.leaderboard = allStudents.map((s, idx) => ({
      rank: idx + 1,
      id: s.id,
      name: s.name,
      score: s.score
    }));
  }

  return {
    code,
    uid,
    isSoloAttempt,
    activeTab,
    setActiveTab,
    roomData,
    result
  };
}
