import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Target, Activity, AlertTriangle, Download, Loader2, X, Check, ArrowRight } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { subscribeToRoom } from '../lib/db';

export default function HostReport() {
  const { code } = useParams();
  const navigate = useNavigate();
  const [roomData, setRoomData] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    const unsubscribe = subscribeToRoom(code, (data) => {
      if (data) setRoomData(data);
    });
    return () => unsubscribe();
  }, [code]);

  if (!roomData) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary-start animate-spin" />
      </div>
    );
  }

  // Calculate Report
  const allStudents = roomData.students ? Object.entries(roomData.students).map(([id, s]) => ({ id, ...s })) : [];
  const finishedStudents = allStudents.filter(s => s.status === 'finished');

  const totalStudents = allStudents.length;
  const averageScore = finishedStudents.length > 0 
    ? Math.round(finishedStudents.reduce((acc, s) => acc + (s.score || 0), 0) / finishedStudents.length) 
    : 0;
  const passRate = finishedStudents.length > 0
    ? Math.round((finishedStudents.filter(s => (s.score || 0) >= 60).length / finishedStudents.length) * 100)
    : 0;

  const topicMap = {};
  finishedStudents.forEach(s => {
    if (s.breakdown) {
      Object.entries(s.breakdown).forEach(([topic, score]) => {
        if (!topicMap[topic]) topicMap[topic] = { totalScore: 0, count: 0 };
        topicMap[topic].totalScore += score;
        topicMap[topic].count += 1;
      });
    }
  });

  const topics = Object.entries(topicMap).map(([name, data]) => ({
    name,
    average: Math.round(data.totalScore / data.count)
  }));

  const report = {
    overview: { totalStudents, averageScore, passRate },
    topics,
    students: allStudents
  };

  // Find topics that need remediation (average < 50%)
  const weakTopics = report.topics.filter(t => t.average < 50);

  const handleRemedialSession = (topicName) => {
    alert(`Starting a new remedial session for ${topicName}`);
  };

  // Render Modal Logic
  const renderStudentModal = () => {
    if (!selectedStudent) return null;
    const student = selectedStudent;
    
    const questions = roomData.questions || [];
    let totalPoints = 0;
    let earnedPoints = 0;
    
    const tagStats = {};
    const questionResults = [];
    
    questions.forEach((q, qIndex) => {
      const qPoints = q.points || 10;
      const tag = q.tag || 'General';
      const studentAns = student.answers ? student.answers[q.id] : undefined;
      const isCorrect = studentAns === q.correct;
      
      totalPoints += qPoints;
      if (isCorrect) earnedPoints += qPoints;
      
      if (!tagStats[tag]) tagStats[tag] = { total: 0, earned: 0 };
      tagStats[tag].total += qPoints;
      if (isCorrect) tagStats[tag].earned += qPoints;
      
      let formattedStudentAns = '-';
      let formattedCorrectAns = '-';
      
      if (q.type === 'MCQ' || q.type === 'TF') {
        if (q.type === 'TF') {
          formattedStudentAns = studentAns === 0 ? 'True' : studentAns === 1 ? 'False' : '-';
          formattedCorrectAns = q.correct === 0 ? 'True' : 'False';
        } else {
          formattedStudentAns = studentAns !== undefined && q.options ? q.options[studentAns] : '-';
          formattedCorrectAns = q.options ? q.options[q.correct] : '-';
        }
      } else {
        formattedStudentAns = studentAns || '-';
        formattedCorrectAns = 'Manual Grading';
      }

      questionResults.push({
        index: qIndex + 1,
        text: q.text,
        tag: tag,
        isCorrect,
        studentAns: formattedStudentAns,
        correctAns: formattedCorrectAns,
        pointsEarned: isCorrect ? qPoints : 0,
        pointsTotal: qPoints
      });
    });

    const percentScore = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0;
    
    const radius = 24;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentScore / 100) * circumference;

    return (
      <AnimatePresence>
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedStudent(null)} />
          <motion.div 
            initial={{ y: 50, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 20, opacity: 0, scale: 0.95 }}
            className="relative w-full max-w-3xl max-h-[90vh] bg-dark-bg border border-dark-border rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* 1. STUDENT HEADER */}
            <div className="p-6 border-b border-dark-border flex items-center justify-between bg-dark-surface shrink-0">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-primary-start/20 flex items-center justify-center text-primary-start text-xl font-bold uppercase border border-primary-start/30 shadow-[0_0_15px_rgba(99,102,241,0.2)] shrink-0">
                  {student.name ? student.name.charAt(0) : '?'}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white mb-1">{student.name}</h2>
                  <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-wider">
                    <span className={`px-2 py-0.5 rounded border ${student.status === 'finished' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'}`}>
                      {student.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="items-center gap-3 hidden sm:flex">
                  <div className="text-right">
                    <div className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-0.5">Score</div>
                    <div className="text-lg font-bold text-white">{earnedPoints} <span className="text-slate-500 text-sm">/ {totalPoints}</span></div>
                  </div>
                  <div className="relative w-14 h-14">
                    <svg className="w-14 h-14 transform -rotate-90">
                      <circle cx="28" cy="28" r={radius} className="stroke-dark-border" strokeWidth="4" fill="none" />
                      <circle
                        cx="28" cy="28" r={radius}
                        className={percentScore >= 60 ? "stroke-emerald-500" : "stroke-error"}
                        strokeWidth="4" fill="none" strokeLinecap="round"
                        style={{ strokeDasharray: circumference, strokeDashoffset }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-[11px] font-bold text-white">{percentScore}%</span>
                    </div>
                  </div>
                </div>
                
                <button onClick={() => setSelectedStudent(null)} className="p-2 bg-dark-bg rounded-lg border border-dark-border hover:bg-dark-border hover:text-white transition-colors text-slate-400 self-start sm:self-auto">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="p-6 overflow-y-auto flex-1 space-y-10 custom-scrollbar">
              
              {/* 2. TOPIC BREAKDOWN */}
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4">Topic Performance</h3>
                <div className="grid gap-3">
                  {Object.entries(tagStats).map(([topic, stats]) => {
                    const percent = stats.total > 0 ? Math.round((stats.earned / stats.total) * 100) : 0;
                    const isWeak = percent < 50;
                    return (
                      <div key={topic} className={`p-4 rounded-xl border ${isWeak ? 'bg-error/5 border-error/20' : 'bg-dark-surface border-dark-border'}`}>
                        <div className="flex justify-between items-center mb-3">
                          <span className={`font-bold ${isWeak ? 'text-error' : 'text-slate-300'}`}>{topic}</span>
                          <span className={`font-bold ${isWeak ? 'text-error' : 'text-white'}`}>{stats.earned} <span className="text-slate-500 text-sm">/ {stats.total}</span></span>
                        </div>
                        <div className="w-full h-2 bg-dark-bg rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${isWeak ? 'bg-error' : 'bg-emerald-500'}`}
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 3. ANSWER REVIEW */}
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4">Detailed Review</h3>
                <div className="space-y-4">
                  {questionResults.map((qr, idx) => (
                    <div key={idx} className={`p-5 rounded-xl border-l-4 ${qr.isCorrect ? 'bg-emerald-500/5 border-l-emerald-500 border-y border-r border-emerald-500/20' : 'bg-error/5 border-l-error border-y border-r border-error/20'}`}>
                      <div className="flex items-start gap-4">
                        <div className={`mt-0.5 flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${qr.isCorrect ? 'bg-emerald-500/20 text-emerald-400' : 'bg-error/20 text-error'}`}>
                          {qr.isCorrect ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start gap-4 mb-3">
                            <h4 className="font-semibold text-white leading-relaxed">
                              {qr.index}. {qr.text}
                            </h4>
                            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded bg-dark-bg border border-dark-border text-slate-400 whitespace-nowrap shrink-0">
                              {qr.tag}
                            </span>
                          </div>
                          
                          <div className="grid sm:grid-cols-2 gap-3 text-sm">
                            <div className={`p-3 rounded-lg border ${qr.isCorrect ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-error/10 border-error/20'}`}>
                              <span className={`block mb-1 uppercase text-[10px] font-bold tracking-wider ${qr.isCorrect ? 'text-emerald-500/70' : 'text-error/70'}`}>Student Answer</span>
                              <span className={`font-medium ${qr.isCorrect ? 'text-emerald-400' : 'text-error'}`}>{qr.studentAns}</span>
                            </div>
                            {!qr.isCorrect && (
                              <div className="p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
                                <span className="text-emerald-500/70 block mb-1 uppercase text-[10px] font-bold tracking-wider">Correct Answer</span>
                                <span className="text-emerald-400 font-medium">{qr.correctAns}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  };

  return (
    <div className="min-h-screen flex flex-col relative">
      <Navbar />
      
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Quiz Report</h1>
            <p className="text-slate-400">Analytics for Room <span className="font-mono text-white">{code}</span></p>
          </div>
          <button className="btn-secondary flex items-center justify-center gap-2">
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>

        {/* Remedial Alert */}
        <AnimatePresence>
          {weakTopics.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mb-8 overflow-hidden"
            >
              <div className="bg-error/10 border border-error/20 p-4 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3 text-error">
                  <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold">Attention Required</h4>
                    <p className="text-sm">The class average for <span className="font-bold">"{weakTopics[0].name}"</span> is {weakTopics[0].average}%. Would you like to create a remedial session for students who struggled?</p>
                  </div>
                </div>
                <button 
                  onClick={() => handleRemedialSession(weakTopics[0].name)}
                  className="whitespace-nowrap px-4 py-2 bg-error text-white rounded-lg text-sm font-bold shadow-lg hover:bg-error/80 transition-colors"
                >
                  Start New Session
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="interactive-card p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary-start/20 flex items-center justify-center">
              <Users className="w-6 h-6 text-primary-start" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-400">Total Students</p>
              <h3 className="text-2xl font-bold text-white">{report.overview.totalStudents}</h3>
            </div>
          </div>
          <div className="interactive-card p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center">
              <Target className="w-6 h-6 text-accent" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-400">Class Average</p>
              <h3 className="text-2xl font-bold text-white">{report.overview.averageScore}%</h3>
            </div>
          </div>
          <div className="interactive-card p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-yellow-500/20 flex items-center justify-center">
              <Activity className="w-6 h-6 text-yellow-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-400">Pass Rate (&gt;60%)</p>
              <h3 className="text-2xl font-bold text-white">{report.overview.passRate}%</h3>
            </div>
          </div>
        </div>

        {/* Topic Performance Bar Chart */}
        <div className="mb-12">
          <h2 className="text-xl font-bold text-white mb-6">Topic Performance</h2>
          {report.topics.length === 0 ? (
            <div className="glass-card p-6 rounded-2xl text-slate-400">
              No topic data available yet. Waiting for students to finish...
            </div>
          ) : (
            <div className="glass-card p-6 rounded-2xl space-y-6">
              {report.topics.map((topic, idx) => (
                <div key={idx}>
                  <div className="flex justify-between items-end mb-2">
                    <span className="font-medium text-slate-300">{topic.name}</span>
                    <span className={`text-sm font-bold ${topic.average < 50 ? 'text-error' : 'text-white'}`}>{topic.average}%</span>
                  </div>
                  <div className="w-full h-4 bg-dark-bg rounded-full overflow-hidden border border-dark-border">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${topic.average}%` }}
                      transition={{ duration: 1, delay: idx * 0.1 }}
                      className={`h-full rounded-full ${topic.average >= 70 ? 'bg-accent' : topic.average >= 50 ? 'bg-yellow-500' : 'bg-error'}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Student List Table */}
        <div>
          <h2 className="text-xl font-bold text-white mb-6">Student Results</h2>
          <div className="glass-card rounded-2xl overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-dark-bg border-b border-dark-border">
                  <th className="py-4 px-6 font-semibold text-slate-400 text-sm">Student</th>
                  <th className="py-4 px-6 font-semibold text-slate-400 text-sm">Score</th>
                  <th className="py-4 px-6 font-semibold text-slate-400 text-sm">Status</th>
                  <th className="py-4 px-6"></th>
                </tr>
              </thead>
              <tbody>
                {report.students.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="py-8 text-center text-slate-400">
                      No students have joined yet.
                    </td>
                  </tr>
                ) : (
                  report.students.map((student) => (
                    <tr 
                      key={student.id}
                      onClick={() => setSelectedStudent(student)}
                      className="border-b border-dark-border/50 last:border-0 hover:bg-dark-bg/50 transition-colors cursor-pointer group"
                    >
                      <td className="py-4 px-6 font-medium text-white flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary-start/20 flex items-center justify-center text-primary-start text-xs font-bold uppercase shrink-0">
                          {student.name ? student.name.charAt(0) : '?'}
                        </div>
                        {student.name}
                      </td>
                      <td className="py-4 px-6 font-bold">
                        {student.score !== undefined && student.score !== null ? (
                          <span className={student.score >= 60 ? 'text-emerald-400' : 'text-error'}>{student.score}%</span>
                        ) : (
                          <span className="text-slate-500">-</span>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${student.status === 'finished' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-dark-bg border border-dark-border text-slate-400'}`}>
                          {student.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <span className="text-primary-start font-medium opacity-0 group-hover:opacity-100 flex items-center justify-end gap-1 transition-opacity text-sm">
                          View Details <ArrowRight className="w-4 h-4" />
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </main>
      
      {renderStudentModal()}

      <Footer />
    </div>
  );
}
