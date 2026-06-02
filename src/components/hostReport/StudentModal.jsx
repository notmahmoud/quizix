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
  }, [student, roomCode]);

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
          <div className="absolute inset-0 bg-black/40" onClick={onClose} />
          <motion.div
            initial={{ y: 40, opacity: 0, scale: 0.96 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 20, opacity: 0, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            className="relative w-full max-w-3xl max-h-[90vh] bg-white border border-gray-200 rounded-2xl shadow-xl flex flex-col overflow-hidden"
          >
            {/* HEADER */}
            <div className="p-5 border-b border-gray-200 flex items-center justify-between bg-white shrink-0 gap-4">
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-12 h-12 rounded-full bg-teal-light border border-teal/20 flex items-center justify-center text-teal text-lg font-medium uppercase shrink-0">
                  {student.name ? student.name.charAt(0) : '?'}
                </div>
                <div className="min-w-0">
                  <h2 className="text-lg font-medium text-gray-900 truncate">{student.name}</h2>
                  <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-medium uppercase tracking-wider border ${student.status === 'finished' ? 'bg-teal-light text-teal border-teal/20' : 'bg-amber-50 text-amber-600 border-amber-200'}`}>
                    {student.status}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4 shrink-0">
                {!loading && studentData && (
                  <div className="hidden sm:flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-[10px] font-medium text-muted uppercase tracking-wider">Score</div>
                      <div className="text-base font-medium text-gray-900">{earnedPoints} <span className="text-muted text-sm">/ {totalPoints}</span></div>
                    </div>
                    <div className="relative w-16 h-16">
                      <svg className="w-16 h-16 -rotate-90">
                        <circle cx="32" cy="32" r={radius} className="stroke-gray-100" strokeWidth="5" fill="none" />
                        <circle cx="32" cy="32" r={radius}
                          className={percentScore >= 60 ? 'stroke-teal' : 'stroke-red-500'}
                          strokeWidth="5" fill="none" strokeLinecap="round"
                          style={{ strokeDasharray: circumference, strokeDashoffset }}
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-xs font-semibold text-gray-900">{percentScore}%</span>
                      </div>
                    </div>
                  </div>
                )}
                <button onClick={onClose} className="p-2 rounded-lg border border-gray-200 text-muted hover:bg-bg hover:text-gray-900 transition-colors cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* BODY */}
            {loading ? (
              <div className="flex-1 flex items-center justify-center p-10 bg-white">
                <Loader2 className="w-8 h-8 text-teal animate-spin" />
              </div>
            ) : (
              <div className="p-6 overflow-y-auto flex-1 space-y-10 bg-white">

                {/* TOPIC BREAKDOWN */}
                <div>
                  <h3 className="text-[10px] font-medium uppercase tracking-wider text-muted mb-4">Topic Performance</h3>
                  {Object.keys(tagStats).length === 0 ? (
                    <p className="text-muted text-sm">No topic data available.</p>
                  ) : (
                    <div className="grid gap-3">
                      {Object.entries(tagStats).map(([topic, stats]) => {
                        const pct = stats.total > 0 ? Math.round((stats.earned / stats.total) * 100) : 0;
                        const isWeak = pct < 50;
                        return (
                          <div key={topic} className={`p-4 rounded-xl border ${isWeak ? 'bg-red-50/50 border-red-200' : 'bg-bg/40 border-gray-200'}`}>
                            <div className="flex justify-between items-center mb-2">
                              <span className={`font-medium text-sm ${isWeak ? 'text-red-700' : 'text-gray-900'}`}>{topic}</span>
                              <span className={`text-sm font-medium ${isWeak ? 'text-red-700' : 'text-gray-900'}`}>{stats.earned}<span className="text-muted font-normal"> / {stats.total}</span></span>
                            </div>
                            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div className={`h-full rounded-full transition-all ${isWeak ? 'bg-red-500' : 'bg-teal'}`} style={{ width: `${pct}%` }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* ANSWER REVIEW */}
                <div>
                  <h3 className="text-[10px] font-medium uppercase tracking-wider text-muted mb-4">Detailed Review</h3>
                  {questionResults.length === 0 ? (
                    <p className="text-muted text-sm">No answers recorded.</p>
                  ) : (
                    <div className="space-y-3">
                      {questionResults.map((qr, idx) => (
                        <div key={idx} className={`p-4 rounded-xl border-l-4 ${qr.isCorrect ? 'bg-teal-light/20 border-l-teal border border-teal/10' : 'bg-red-50/20 border-l-red-500 border border-red-200'}`}>
                          <div className="flex items-start gap-3">
                            <div className={`mt-0.5 shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${qr.isCorrect ? 'bg-teal-light text-teal' : 'bg-red-100 text-red-700'}`}>
                              {qr.isCorrect ? <Check className="w-3 h-3 font-medium" /> : <X className="w-3 h-3 font-medium" />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-start gap-3 mb-3">
                                <h4 className="font-medium text-gray-900 text-sm leading-relaxed">{qr.index}. {qr.text}</h4>
                                <span className="badge-ended text-[10px] uppercase font-medium tracking-wider px-2 py-0.5 whitespace-nowrap shrink-0">{qr.tag}</span>
                              </div>
                              <div className="grid sm:grid-cols-2 gap-2 text-sm">
                                <div className={`p-2.5 rounded-lg border ${qr.isCorrect ? 'bg-teal-light/40 border-teal/20' : 'bg-red-50/50 border-red-200'}`}>
                                  <span className={`block mb-1 text-[10px] font-medium uppercase tracking-wider ${qr.isCorrect ? 'text-teal' : 'text-red-700'}`}>Your Answer</span>
                                  <span className={`font-medium ${qr.isCorrect ? 'text-teal' : 'text-red-800'}`}>{qr.studentAnsText}</span>
                                </div>
                                <div className="p-2.5 rounded-lg bg-teal-light/40 border border-teal/20">
                                  <span className="block mb-1 text-[10px] font-medium uppercase tracking-wider text-teal">Correct Answer</span>
                                  <span className="font-medium text-teal">{qr.correctAnsText}</span>
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
            <div className="p-4 border-t border-gray-200 bg-white shrink-0 flex items-center justify-between gap-4">
              <button onClick={onClose} className="btn-secondary px-5 py-2 text-sm">
                Close
              </button>
              {weakTopicsCount > 0 && (
                <span className="flex items-center gap-2 text-sm font-medium text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-lg">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-amber-500" />
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
