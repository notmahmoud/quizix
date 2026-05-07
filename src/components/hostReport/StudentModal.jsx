import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, AlertTriangle, Loader2 } from 'lucide-react';
import { db } from '../../lib/firebase';
import { ref, get } from 'firebase/database';

export default function StudentModal({ student, roomCode, onClose }) {
  const [studentData, setStudentData] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!student) return;
    setLoading(true);
    setStudentData(null);
    setQuestions([]);
    const fetchData = async () => {
      try {
        const [sSnap, qSnap] = await Promise.all([
          get(ref(db, `rooms/${roomCode}/students/${student.id}`)),
          get(ref(db, `rooms/${roomCode}/questions`))
        ]);
        setStudentData(sSnap.exists() ? { id: student.id, ...sSnap.val() } : student);
        setQuestions(qSnap.exists() ? qSnap.val() : []);
      } catch (err) {
        console.error(err);
        setStudentData(student);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [student?.id, roomCode]);

  let totalPoints = 0, earnedPoints = 0;
  const tagStats = {};
  const questionResults = [];

  if (studentData && questions.length) {
    questions.forEach((q, qIndex) => {
      const qPoints = q.points || 10;
      const tag = q.tag || 'General';
      const ans = studentData.answers ? studentData.answers[q.id] : undefined;
      const isCorrect = ans === q.correct;
      totalPoints += qPoints;
      if (isCorrect) earnedPoints += qPoints;
      if (!tagStats[tag]) tagStats[tag] = { total: 0, earned: 0 };
      tagStats[tag].total += qPoints;
      if (isCorrect) tagStats[tag].earned += qPoints;

      let studentAnsText = 'Not Answered', correctAnsText = '-';
      if (q.type === 'TF') {
        studentAnsText = ans === 0 ? 'True' : ans === 1 ? 'False' : 'Not Answered';
        correctAnsText = q.correct === 0 ? 'True' : 'False';
      } else if (q.type === 'MCQ') {
        studentAnsText = ans !== undefined && q.options ? (q.options[ans] ?? 'Not Answered') : 'Not Answered';
        correctAnsText = q.options ? q.options[q.correct] : '-';
      } else {
        studentAnsText = ans || 'Not Answered';
        correctAnsText = 'Manual Grading';
      }
      questionResults.push({ index: qIndex + 1, text: q.text, tag, isCorrect, studentAnsText, correctAnsText });
    });
  }

  const percentScore = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0;
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentScore / 100) * circumference;
  const weakTopicsCount = Object.values(tagStats).filter(s => s.total > 0 && Math.round((s.earned / s.total) * 100) < 50).length;

  return (
    <AnimatePresence>
      {student && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
        >
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            initial={{ y: 40, opacity: 0, scale: 0.96 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 20, opacity: 0, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            className="relative w-full max-w-3xl max-h-[90vh] bg-dark-bg border border-dark-border rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* HEADER */}
            <div className="p-5 border-b border-dark-border flex items-center justify-between bg-dark-surface shrink-0 gap-4">
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-12 h-12 rounded-full bg-primary-start/20 border border-primary-start/30 flex items-center justify-center text-primary-start text-lg font-bold uppercase shrink-0">
                  {student.name ? student.name.charAt(0) : '?'}
                </div>
                <div className="min-w-0">
                  <h2 className="text-lg font-bold text-white truncate">{student.name}</h2>
                  <span className={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${student.status === 'finished' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'}`}>
                    {student.status}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4 shrink-0">
                {!loading && studentData && (
                  <div className="hidden sm:flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Score</div>
                      <div className="text-base font-bold text-white">{earnedPoints} <span className="text-slate-500 text-sm">/ {totalPoints}</span></div>
                    </div>
                    <div className="relative w-16 h-16">
                      <svg className="w-16 h-16 -rotate-90">
                        <circle cx="32" cy="32" r={radius} className="stroke-dark-border" strokeWidth="5" fill="none" />
                        <circle cx="32" cy="32" r={radius}
                          className={percentScore >= 60 ? 'stroke-emerald-500' : 'stroke-error'}
                          strokeWidth="5" fill="none" strokeLinecap="round"
                          style={{ strokeDasharray: circumference, strokeDashoffset }}
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-xs font-bold text-white">{percentScore}%</span>
                      </div>
                    </div>
                  </div>
                )}
                <button onClick={onClose} className="p-2 rounded-lg border border-dark-border text-slate-400 hover:bg-dark-border hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* BODY */}
            {loading ? (
              <div className="flex-1 flex items-center justify-center p-10">
                <Loader2 className="w-8 h-8 text-primary-start animate-spin" />
              </div>
            ) : (
              <div className="p-6 overflow-y-auto flex-1 space-y-10 custom-scrollbar">

                {/* TOPIC BREAKDOWN */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">Topic Performance</h3>
                  {Object.keys(tagStats).length === 0 ? (
                    <p className="text-slate-500 text-sm">No topic data available.</p>
                  ) : (
                    <div className="grid gap-3">
                      {Object.entries(tagStats).map(([topic, stats]) => {
                        const pct = stats.total > 0 ? Math.round((stats.earned / stats.total) * 100) : 0;
                        const isWeak = pct < 50;
                        return (
                          <div key={topic} className={`p-4 rounded-xl border ${isWeak ? 'bg-error/5 border-error/20' : 'bg-dark-surface border-dark-border'}`}>
                            <div className="flex justify-between items-center mb-2">
                              <span className={`font-semibold text-sm ${isWeak ? 'text-error' : 'text-slate-300'}`}>{topic}</span>
                              <span className={`text-sm font-bold ${isWeak ? 'text-error' : 'text-white'}`}>{stats.earned}<span className="text-slate-500 font-normal"> / {stats.total}</span></span>
                            </div>
                            <div className="w-full h-2 bg-dark-bg rounded-full overflow-hidden">
                              <div className={`h-full rounded-full transition-all ${isWeak ? 'bg-error' : 'bg-emerald-500'}`} style={{ width: `${pct}%` }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* ANSWER REVIEW */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">Detailed Review</h3>
                  {questionResults.length === 0 ? (
                    <p className="text-slate-500 text-sm">No answers recorded.</p>
                  ) : (
                    <div className="space-y-3">
                      {questionResults.map((qr, idx) => (
                        <div key={idx} className={`p-4 rounded-xl border-l-4 ${qr.isCorrect ? 'bg-emerald-500/5 border-l-emerald-500 border border-emerald-500/15' : 'bg-error/5 border-l-error border border-error/15'}`}>
                          <div className="flex items-start gap-3">
                            <div className={`mt-0.5 shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${qr.isCorrect ? 'bg-emerald-500/20 text-emerald-400' : 'bg-error/20 text-error'}`}>
                              {qr.isCorrect ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-start gap-3 mb-3">
                                <h4 className="font-semibold text-white text-sm leading-relaxed">{qr.index}. {qr.text}</h4>
                                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-dark-bg border border-dark-border text-slate-400 whitespace-nowrap shrink-0">{qr.tag}</span>
                              </div>
                              <div className="grid sm:grid-cols-2 gap-2 text-sm">
                                <div className={`p-2.5 rounded-lg border ${qr.isCorrect ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-error/10 border-error/20'}`}>
                                  <span className={`block mb-1 text-[10px] font-bold uppercase tracking-wider ${qr.isCorrect ? 'text-emerald-500/70' : 'text-error/70'}`}>Your Answer</span>
                                  <span className={`font-medium ${qr.isCorrect ? 'text-emerald-400' : 'text-error'}`}>{qr.studentAnsText}</span>
                                </div>
                                <div className="p-2.5 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
                                  <span className="block mb-1 text-[10px] font-bold uppercase tracking-wider text-emerald-500/70">Correct Answer</span>
                                  <span className="font-medium text-emerald-400">{qr.correctAnsText}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* FOOTER */}
            <div className="p-4 border-t border-dark-border bg-dark-surface shrink-0 flex items-center justify-between gap-4">
              <button onClick={onClose} className="btn-secondary px-5 py-2 text-sm">
                Close
              </button>
              {weakTopicsCount > 0 && (
                <span className="flex items-center gap-2 text-sm font-medium text-yellow-400 bg-yellow-500/10 border border-yellow-500/20 px-3 py-1.5 rounded-lg">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  Struggling in {weakTopicsCount} topic{weakTopicsCount > 1 ? 's' : ''}
                </span>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
