import { useState, useEffect } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { subscribeToRoom, submitAnswers, submitSoloAnswers } from '../lib/db';

export default function QuizSession() {
  const { code } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useAuth();
  
  const isSolo = new URLSearchParams(location.search).get('solo') === 'true';
  
  const [roomData, setRoomData] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [globalTimeLeft, setGlobalTimeLeft] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timersInitialized, setTimersInitialized] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeToRoom(code, (data) => {
      if (data) {
        setRoomData(data);
        if (!timersInitialized) {
          const hasPerQuestion = data.settings?.timePerQuestionEnabled || data.settings?.timePerQuestionToggle;
          if (hasPerQuestion) setTimeLeft(data.settings.timePerQuestion || 30);
          if (data.settings?.globalTimerEnabled) setGlobalTimeLeft((data.settings.globalTimer || 10) * 60);
          setTimersInitialized(true);
        }
      }
    });
    return () => unsubscribe();
  }, [code, timersInitialized]);

  // Per-question timer
  useEffect(() => {
    const hasPerQuestion = roomData?.settings?.timePerQuestionEnabled || roomData?.settings?.timePerQuestionToggle;
    const isActive = isSolo || roomData?.status === 'active';
    if (hasPerQuestion && isActive && !isSubmitting && timersInitialized) {
      if (timeLeft > 0) {
        const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
        return () => clearTimeout(timer);
      } else if (timeLeft === 0) {
        handleNext();
      }
    }
  }, [timeLeft, roomData, isSubmitting, isSolo, timersInitialized]);

  // Global timer
  useEffect(() => {
    const isActive = isSolo || roomData?.status === 'active';
    if (roomData?.settings?.globalTimerEnabled && isActive && !isSubmitting && timersInitialized) {
      if (globalTimeLeft > 0) {
        const timer = setTimeout(() => setGlobalTimeLeft(globalTimeLeft - 1), 1000);
        return () => clearTimeout(timer);
      } else if (globalTimeLeft === 0) {
        handleSubmit(); // Auto-submit when global time runs out
      }
    }
  }, [globalTimeLeft, roomData, isSubmitting, isSolo, timersInitialized]);

  if (!roomData) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary-start animate-spin" />
      </div>
    );
  }

  if (!isSolo && roomData.status === 'waiting') {
    return (
      <div className="min-h-screen bg-dark-bg flex flex-col items-center justify-center p-4 text-center">
        <div className="w-24 h-24 bg-dark-surface border border-dark-border rounded-full flex items-center justify-center mb-6 shadow-lg shadow-primary-start/20">
          <Clock className="w-12 h-12 text-primary-start animate-pulse" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-4">Waiting for Host</h1>
        <p className="text-lg text-slate-400">The quiz will begin shortly when the host starts the session.</p>
      </div>
    );
  }

  const questions = roomData.questions || [];
  const question = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  const handleSelectAnswer = (value) => {
    setAnswers({ ...answers, [question.id]: value });
  };

  const handleNext = () => {
    if (isLastQuestion) {
      handleSubmit();
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
      const hasPerQuestion = roomData?.settings?.timePerQuestionEnabled || roomData?.settings?.timePerQuestionToggle;
      if (hasPerQuestion) {
        setTimeLeft(roomData.settings.timePerQuestion || 30);
      }
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // Calculate Score and Breakdown
    let totalPoints = 0;
    let earnedPoints = 0;
    const tagStats = {};

    questions.forEach((q) => {
      const qPoints = q.points || 10;
      const tag = q.tag || 'General';
      const studentAns = answers[q.id];
      const isCorrect = studentAns === q.correct;
      
      totalPoints += qPoints;
      if (isCorrect) earnedPoints += qPoints;

      if (!tagStats[tag]) {
        tagStats[tag] = { total: 0, earned: 0 };
      }
      tagStats[tag].total += qPoints;
      if (isCorrect) tagStats[tag].earned += qPoints;
    });

    const finalScore = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0;
    
    const breakdown = {};
    Object.keys(tagStats).forEach(tag => {
      breakdown[tag] = tagStats[tag].total > 0 
        ? Math.round((tagStats[tag].earned / tagStats[tag].total) * 100) 
        : 0;
    });

    try {
      const roomSummary = {
        title: roomData.title || 'Untitled Quiz',
        hostName: roomData.hostName || 'Unknown Host'
      };
      
      if (isSolo) {
        await submitSoloAnswers(code, currentUser?.uid || 'guest', answers, finalScore, breakdown);
      } else {
        await submitAnswers(code, currentUser?.uid || 'guest', answers, finalScore, breakdown, roomSummary);
      }

      setTimeout(() => {
        navigate(`/room/${code}/results/${currentUser?.uid || 'guest'}${isSolo ? '?solo=true' : ''}`, { replace: true });
      }, 1500);
    } catch (error) {
      console.error("Failed to submit answers:", error);
      setIsSubmitting(false);
    }
  };

  if (!question) return null;

  return (
    <div className="min-h-screen bg-dark-bg flex flex-col">
      {/* Header / Progress Bar */}
      <header className="border-b border-dark-border bg-dark-bg/80 backdrop-blur-lg sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="text-sm font-bold text-slate-400 tracking-widest uppercase">
            Question {currentQuestionIndex + 1} of {questions.length}
          </div>
          
          <div className="flex items-center gap-4">
            {roomData.settings?.globalTimerEnabled && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-dark-bg border border-primary-start/30 shadow-[0_0_15px_rgba(99,102,241,0.15)]">
                <Clock className={`w-4 h-4 ${globalTimeLeft <= 60 ? 'text-error animate-pulse' : 'text-primary-start'}`} />
                <span className={`font-mono font-bold text-sm ${globalTimeLeft <= 60 ? 'text-error' : 'text-primary-start'}`}>
                  {Math.floor(globalTimeLeft / 60).toString().padStart(2, '0')}:{(globalTimeLeft % 60).toString().padStart(2, '0')}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 ml-1 hidden sm:block">Total</span>
              </div>
            )}
            
            {(roomData.settings?.timePerQuestionEnabled || roomData.settings?.timePerQuestionToggle) && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-dark-surface border border-dark-border">
                <Clock className={`w-4 h-4 ${timeLeft <= 5 ? 'text-error animate-pulse' : 'text-slate-400'}`} />
                <span className={`font-mono font-bold text-sm ${timeLeft <= 5 ? 'text-error' : 'text-slate-300'}`}>
                  00:{timeLeft?.toString().padStart(2, '0')}
                </span>
              </div>
            )}
          </div>
        </div>
        
        {/* Progress bar line */}
        <div className="w-full h-1 bg-dark-border">
          <motion.div 
            className="h-full bg-primary-start"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-12 sm:py-20 flex flex-col relative overflow-hidden">
        {isSubmitting ? (
          <div className="flex-1 flex flex-col items-center justify-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-24 h-24 rounded-full bg-accent/20 text-accent flex items-center justify-center mb-6"
            >
              <CheckCircle2 className="w-12 h-12" />
            </motion.div>
            <h2 className="text-2xl font-bold text-white mb-2">Quiz Submitted!</h2>
            <p className="text-slate-400">Calculating your results...</p>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={question.id}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="flex-1 flex flex-col"
            >
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-10 leading-tight text-center">
                {question.text}
              </h1>

              <div className="space-y-4 mb-10">
                {question.type === 'MCQ' && question.options.map((opt, idx) => {
                  const isSelected = answers[question.id] === idx;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectAnswer(idx)}
                      className={`w-full text-left p-6 rounded-2xl border-2 transition-all duration-200 group relative overflow-hidden
                        ${isSelected 
                          ? 'border-primary-start bg-primary-start/10 shadow-[0_0_20px_rgba(99,102,241,0.15)]' 
                          : 'border-dark-border bg-dark-surface hover:border-slate-500'
                        }
                      `}
                    >
                      <div className="flex items-center gap-4 relative z-10">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm
                          ${isSelected ? 'bg-primary-start text-white' : 'bg-dark-bg text-slate-400 group-hover:bg-slate-700'}
                        `}>
                          {String.fromCharCode(65 + idx)}
                        </div>
                        <span className={`text-lg font-medium ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                          {opt}
                        </span>
                      </div>
                    </button>
                  );
                })}

                {question.type === 'TF' && ['True', 'False'].map((opt, idx) => {
                  const isSelected = answers[question.id] === idx;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectAnswer(idx)}
                      className={`w-full text-left p-6 rounded-2xl border-2 transition-all duration-200 group relative overflow-hidden
                        ${isSelected 
                          ? 'border-primary-start bg-primary-start/10 shadow-[0_0_20px_rgba(99,102,241,0.15)]' 
                          : 'border-dark-border bg-dark-surface hover:border-slate-500'
                        }
                      `}
                    >
                      <div className="flex items-center gap-4 relative z-10">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm
                          ${isSelected ? 'bg-primary-start text-white' : 'bg-dark-bg text-slate-400 group-hover:bg-slate-700'}
                        `}>
                          {String.fromCharCode(65 + idx)}
                        </div>
                        <span className={`text-lg font-medium ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                          {opt}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="mt-auto flex justify-end">
                <button
                  onClick={handleNext}
                  disabled={answers[question.id] === undefined}
                  className="btn-primary flex items-center gap-2 px-10 py-4 text-lg"
                >
                  {isLastQuestion ? 'Submit Quiz' : 'Next Question'}
                  {isLastQuestion ? <CheckCircle2 className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        )}
      </main>
    </div>
  );
}
