import { useState, useEffect, useRef } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { subscribeToRoom, submitAnswers, submitSoloAnswers } from '../lib/db';
import { db } from '../lib/firebase';
import { ref, update } from 'firebase/database';

export default function useQuizSession() {
  const { code } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useAuth();
  const isSolo = new URLSearchParams(location.search).get('solo') === 'true';
  const uid = currentUser?.uid || 'guest';

  const [roomData, setRoomData] = useState(null);
  const [answers, setAnswers] = useState({});
  const [globalTimeLeft, setGlobalTimeLeft] = useState(null);
  const [timerInitialized, setTimerInitialized] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showWarningToast, setShowWarningToast] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const questionRefs = useRef([]);

  // Subscribe to room
  useEffect(() => {
    const unsub = subscribeToRoom(code, (data) => {
      if (data) {
        setRoomData(data);
        if (!timerInitialized && data.settings?.globalTimerEnabled) {
          setGlobalTimeLeft((data.settings.globalTimer || 10) * 60);
          setTimerInitialized(true);
        } else if (!timerInitialized) {
          setTimerInitialized(true);
        }
      }
    });
    return () => unsub();
  }, [code, timerInitialized]);

  // Global countdown
  useEffect(() => {
    if (globalTimeLeft === null || isSubmitting || !timerInitialized) return;
    const isActive = isSolo || roomData?.status === 'active';
    if (!isActive) return;

    if (globalTimeLeft === 0) {
      handleAutoSubmit();
      return;
    }
    if (globalTimeLeft === 5) setShowWarningToast(true);

    const t = setTimeout(() => setGlobalTimeLeft(s => s - 1), 1000);
    return () => clearTimeout(t);
  }, [globalTimeLeft, isSubmitting, timerInitialized, roomData?.status, isSolo]);

  // Save answer to Firebase in real-time
  const handleSelectAnswer = (questionId, value) => {
    const newAnswers = { ...answers, [questionId]: value };
    setAnswers(newAnswers);
    // Real-time Firebase save
    update(ref(db, `rooms/${code}/students/${uid}/answers`), { [questionId]: value }).catch(console.error);
  };

  const scrollToQuestion = (index) => {
    setActiveIndex(index);
    questionRefs.current[index]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleSubmitRequest = () => {
    const questions = roomData?.questions || [];
    const answeredCount = Object.keys(answers).length;
    if (answeredCount < questions.length) {
      setShowConfirmModal(true);
    } else {
      handleAutoSubmit();
    }
  };

  const handleAutoSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setShowWarningToast(false);
    setShowConfirmModal(false);

    const questions = roomData?.questions || [];
    let totalPoints = 0, earnedPoints = 0;
    const tagStats = {};

    questions.forEach((q) => {
      const qPoints = q.points || 10;
      const tag = q.tag || 'General';
      const isCorrect = answers[q.id] === q.correct;
      totalPoints += qPoints;
      if (isCorrect) earnedPoints += qPoints;
      if (!tagStats[tag]) tagStats[tag] = { total: 0, earned: 0 };
      tagStats[tag].total += qPoints;
      if (isCorrect) tagStats[tag].earned += qPoints;
    });

    const finalScore = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0;
    const breakdown = {};
    Object.keys(tagStats).forEach(tag => {
      breakdown[tag] = tagStats[tag].total > 0
        ? Math.round((tagStats[tag].earned / tagStats[tag].total) * 100) : 0;
    });

    try {
      const roomSummary = { title: roomData.title || 'Untitled', hostName: roomData.hostName || 'Unknown' };
      if (isSolo) {
        await submitSoloAnswers(code, uid, answers, finalScore, breakdown);
      } else {
        await submitAnswers(code, uid, answers, finalScore, breakdown, roomSummary);
      }
      navigate(`/room/${code}/results/${uid}${isSolo ? '?solo=true' : ''}`, { replace: true });
    } catch (err) {
      console.error('Submit failed:', err);
      setIsSubmitting(false);
    }
  };

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
