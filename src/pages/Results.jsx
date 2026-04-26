import { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trophy, Check, X, ArrowLeft, BarChart2, Loader2 } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { subscribeToRoom } from '../lib/db';
import { db } from '../lib/firebase';
import { ref, get } from 'firebase/database';
import { useAuth } from '../context/AuthContext';

export default function Results() {
  const { code, uid } = useParams();
  const location = useLocation();
  const { currentUser } = useAuth();
  
  const isSoloAttempt = new URLSearchParams(location.search).get('solo') === 'true';
  const [activeTab, setActiveTab] = useState('overview'); // overview, leaderboard
  const [roomData, setRoomData] = useState(null);
  const [soloData, setSoloData] = useState(null);

  useEffect(() => {
    const unsubscribe = subscribeToRoom(code, (data) => {
      if (data) setRoomData(data);
    });
    return () => unsubscribe();
  }, [code]);

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

  if (!roomData) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary-start animate-spin" />
      </div>
    );
  }

  const studentData = (roomData.students && roomData.students[uid]) || soloData || null;
  const questions = roomData.questions || [];
  
  // Calculate dynamic results if studentData is available
  const result = {
    score: studentData?.score || 0,
    topics: [],
    review: [],
    leaderboard: []
  };

  if (studentData && studentData.answers) {
    // Topic breakdown calculation based on student answers
    const topicMap = {};
    questions.forEach((q) => {
      const tag = q.tag || 'General';
      if (!topicMap[tag]) topicMap[tag] = { name: tag, correct: 0, total: 0 };
      
      topicMap[tag].total += 1;
      if (studentData.answers[q.id] === q.correct) {
        topicMap[tag].correct += 1;
      }

      // Review data
      const studentAnsIdx = studentData.answers[q.id];
      const isCorrect = studentAnsIdx === q.correct;
      let studentAnswerText = 'Not Answered';
      let correctAnswerText = 'Unknown';
      
      if (q.type === 'MCQ') {
        studentAnswerText = studentAnsIdx !== undefined ? q.options[studentAnsIdx] : 'Not Answered';
        correctAnswerText = q.options[q.correct];
      } else if (q.type === 'TF') {
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

  // Leaderboard Calculation
  if (roomData.students) {
    const allStudents = Object.entries(roomData.students).map(([id, s]) => ({
      id,
      name: s.name || 'Anonymous',
      score: s.score || 0,
    }));
    
    // Sort descending by score
    allStudents.sort((a, b) => b.score - a.score);
    
    result.leaderboard = allStudents.map((s, idx) => ({
      rank: idx + 1,
      id: s.id,
      name: s.name,
      score: s.score
    }));
  }

  // Calculate circumference for circular progress
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (result.score / 100) * circumference;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Header */}
        <div className="text-center mb-10">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', bounce: 0.5 }}
            className="inline-block relative mb-6"
          >
            <svg className="w-40 h-40 transform -rotate-90">
              <circle
                cx="80"
                cy="80"
                r={radius}
                className="stroke-dark-border"
                strokeWidth="12"
                fill="none"
              />
              <motion.circle
                cx="80"
                cy="80"
                r={radius}
                className={result.score >= 70 ? "stroke-accent" : result.score >= 50 ? "stroke-yellow-500" : "stroke-error"}
                strokeWidth="12"
                fill="none"
                strokeLinecap="round"
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                style={{ strokeDasharray: circumference }}
              />
            </svg>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
              <span className="text-4xl font-extrabold text-white">{result.score}%</span>
            </div>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-white mb-2"
          >
            {result.score >= 80 ? 'Excellent work!' : result.score >= 50 ? 'Good effort!' : 'Needs more practice'}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-slate-400"
          >
            You completed the quiz in Room <span className="font-mono text-white">{code}</span>
          </motion.p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-dark-border mb-8">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart2 },
            (!isSoloAttempt && roomData.settings?.leaderboardEnabled === true) && { id: 'leaderboard', label: 'Leaderboard', icon: Trophy }
          ].filter(Boolean).map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors relative ${
                activeTab === tab.id ? 'text-primary-start' : 'text-slate-400 hover:text-white'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
              {activeTab === tab.id && (
                <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-start" />
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="mb-12">
          {activeTab === 'overview' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12">
              <div>
                <h3 className="text-xl font-bold text-white mb-4">Performance by Topic</h3>
                {result.topics.length === 0 ? (
                  <p className="text-slate-400">No topic data available.</p>
                ) : (
                  <div className="glass-card p-6 rounded-2xl space-y-6">
                    {result.topics.map((topic, idx) => {
                      const percent = topic.total > 0 ? Math.round((topic.correct / topic.total) * 100) : 0;
                      return (
                        <div key={idx}>
                          <div className="flex justify-between items-end mb-2">
                            <span className="font-medium text-slate-300">{topic.name}</span>
                            <span className="text-sm font-bold text-white">{topic.correct} / {topic.total}</span>
                          </div>
                          <div className="w-full h-3 bg-dark-bg rounded-full overflow-hidden border border-dark-border">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${percent}%` }}
                              transition={{ duration: 1, delay: idx * 0.1 }}
                              className={`h-full rounded-full ${percent >= 70 ? 'bg-emerald-500' : percent >= 50 ? 'bg-yellow-500' : 'bg-error'}`}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div>
                <h3 className="text-xl font-bold text-white mb-4">Answer Review</h3>
                <div className="space-y-4">
                  {result.review.length === 0 ? (
                    <p className="text-slate-400">No answers recorded for review.</p>
                  ) : (
                    result.review.map((q, idx) => (
                      <div key={idx} className={`interactive-card p-6 rounded-2xl border-l-4 ${q.isCorrect ? 'border-l-emerald-500' : 'border-l-error'}`}>
                        <div className="flex items-start gap-4">
                          <div className={`mt-1 flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${q.isCorrect ? 'bg-emerald-500/20 text-emerald-400' : 'bg-error/20 text-error'}`}>
                            {q.isCorrect ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start gap-4 mb-3">
                              <h4 className="font-semibold text-white">{idx + 1}. {q.text}</h4>
                              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded bg-dark-border text-slate-300 whitespace-nowrap">
                                {q.tag}
                              </span>
                            </div>
                            <div className="grid sm:grid-cols-2 gap-4 text-sm">
                              <div className={`p-3 rounded-lg border ${q.isCorrect ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-error/5 border-error/20'}`}>
                                <span className={`block mb-1 uppercase text-[10px] font-bold tracking-wider ${q.isCorrect ? 'text-emerald-500/70' : 'text-error/70'}`}>Your Answer</span>
                                <span className={`font-medium ${q.isCorrect ? 'text-emerald-400' : 'text-error'}`}>{q.studentAnswer}</span>
                              </div>
                              <div className="p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
                                <span className="text-emerald-500/70 block mb-1 uppercase text-[10px] font-bold tracking-wider">Correct Answer</span>
                                <span className="text-emerald-400 font-medium">{q.correctAnswer}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'leaderboard' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {roomData.settings?.leaderboardEnabled === false ? (
                <div className="glass-card p-6 text-center text-slate-400">
                  Leaderboard is disabled for this room.
                </div>
              ) : (
                <div className="glass-card rounded-2xl overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-dark-bg border-b border-dark-border">
                        <th className="py-4 px-6 font-semibold text-slate-400 text-sm">Rank</th>
                        <th className="py-4 px-6 font-semibold text-slate-400 text-sm">Student</th>
                        <th className="py-4 px-6 font-semibold text-slate-400 text-sm text-right">Score</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.leaderboard.map((student, idx) => (
                        <tr key={idx} className={`border-b border-dark-border/50 last:border-0 hover:bg-dark-bg/30 transition-colors ${student.id === uid ? 'bg-primary-start/5' : ''}`}>
                          <td className="py-4 px-6">
                            {student.rank === 1 ? <Trophy className="w-5 h-5 text-yellow-500" /> : 
                             student.rank === 2 ? <Trophy className="w-5 h-5 text-slate-300" /> :
                             student.rank === 3 ? <Trophy className="w-5 h-5 text-amber-600" /> : 
                             <span className="text-slate-500 font-medium pl-1">{student.rank}</span>}
                          </td>
                          <td className="py-4 px-6 font-medium text-white flex items-center gap-2">
                            {student.name}
                            {student.id === uid && <span className="px-2 py-0.5 rounded bg-primary-start/20 text-primary-start text-[10px] uppercase font-bold tracking-wider ml-2">You</span>}
                          </td>
                          <td className="py-4 px-6 text-right font-bold text-accent">{student.score}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </motion.div>
          )}
        </div>

        <div className="flex justify-center">
          <Link to="/dashboard" className="btn-secondary flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
        </div>

      </main>
      
      <Footer />
    </div>
  );
}
