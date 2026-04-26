import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Copy, Share2, Play, Users, BarChart3, CheckCircle2, UserPlus } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { subscribeToRoom, endRoomSession, updateHostedRoomStudentCount } from '../lib/db';
import { ref, update } from 'firebase/database';
import { db } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';

export default function HostLobby() {
  const { currentUser } = useAuth();
  const { code } = useParams();
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [roomStatus, setRoomStatus] = useState('waiting'); // waiting, active, finished
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Subscribe to room in RTDB
    const unsubscribe = subscribeToRoom(code, (roomData) => {
      if (roomData) {
        setRoomStatus(roomData.status || 'waiting');
        if (roomData.students) {
          const studentList = Object.entries(roomData.students).map(([id, s]) => ({ id, ...s }));
          setStudents(studentList);
          if (currentUser) {
            updateHostedRoomStudentCount(code, currentUser.uid, studentList.length).catch(console.error);
          }
        } else {
          setStudents([]);
          if (currentUser) {
            updateHostedRoomStudentCount(code, currentUser.uid, 0).catch(console.error);
          }
        }
      }
    });

    return () => unsubscribe();
  }, [code]);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleStartQuiz = async () => {
    // Update room status in RTDB to 'active'
    const roomRef = ref(db, `rooms/${code}`);
    await update(roomRef, { status: 'active' });
  };

  const handleEndSession = async () => {
    if (currentUser) {
      await endRoomSession(code, currentUser.uid, students.length);
    }
  };

  const handleViewReport = () => {
    navigate(`/room/${code}/report`, { replace: true });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'waiting':
        return <span className="px-2 py-1 bg-slate-500/10 text-slate-400 border border-slate-500/20 rounded text-xs font-bold uppercase tracking-wider">Waiting</span>;
      case 'answering':
        return (
          <span className="px-2 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></span> Answering
          </span>
        );
      case 'finished':
        return <span className="px-2 py-1 bg-accent/10 text-accent border border-accent/20 rounded text-xs font-bold uppercase tracking-wider">Finished</span>;
      case 'disconnected':
        return <span className="px-2 py-1 bg-error/10 text-error border border-error/20 rounded text-xs font-bold uppercase tracking-wider">Disconnected</span>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-12">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Host Lobby</h1>
            <p className="text-slate-400">Waiting for students to join your quiz.</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="flex items-center bg-dark-surface border border-dark-border rounded-xl overflow-hidden">
              <div className="px-6 py-3 border-r border-dark-border bg-dark-bg/50">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1">Room Code</span>
                <span className="text-3xl font-mono font-bold text-primary-start tracking-wider">{code}</span>
              </div>
              <button 
                onClick={handleCopyCode}
                className="px-4 py-3 hover:bg-dark-border/50 transition-colors h-full flex flex-col items-center justify-center text-slate-400 hover:text-white"
              >
                {copied ? <CheckCircle2 className="w-5 h-5 text-accent" /> : <Copy className="w-5 h-5" />}
                <span className="text-[10px] uppercase font-bold mt-1">{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            
            <button className="h-full px-4 py-3 rounded-xl border border-dark-border bg-dark-surface text-slate-400 hover:text-white hover:bg-dark-border/50 transition-colors flex flex-col items-center justify-center">
              <Share2 className="w-5 h-5" />
              <span className="text-[10px] uppercase font-bold mt-1">Share</span>
            </button>
          </div>
        </div>

        {/* Action Bar */}
        <div className="glass-card p-6 rounded-2xl flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-3 text-slate-300">
            <div className="w-10 h-10 rounded-full bg-dark-bg border border-dark-border flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-bold text-white">{students.length}</span> students joined
            </div>
          </div>
          
          {roomStatus === 'waiting' && (
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
              <button 
                onClick={handleEndSession}
                className="px-6 py-3 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 font-bold transition-colors w-full sm:w-auto"
              >
                End Session
              </button>
              <button 
                onClick={handleStartQuiz}
                disabled={students.length === 0}
                className="btn-primary flex items-center justify-center gap-2 px-8 py-3 w-full sm:w-auto"
              >
                Start Quiz <Play className="w-5 h-5 fill-current" />
              </button>
            </div>
          )}

          {roomStatus === 'active' && (
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
              <div className="px-6 py-3 rounded-xl border border-primary-start/50 bg-primary-start/10 text-primary-start font-bold flex items-center justify-center gap-3 w-full sm:w-auto">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-start opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-primary-start"></span>
                </span>
                Quiz is Live
              </div>
              <button 
                onClick={handleEndSession}
                className="px-6 py-3 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 font-bold transition-colors w-full sm:w-auto"
              >
                End Session
              </button>
            </div>
          )}

          {roomStatus === 'finished' && (
            <button 
              onClick={handleViewReport}
              className="btn-primary bg-gradient-to-r from-accent to-emerald-400 hover:shadow-accent/25 flex items-center gap-2 px-8 py-3 w-full sm:w-auto"
            >
              View Full Report <BarChart3 className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Student Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {students.map((student, idx) => (
            <motion.div 
              key={student.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              className="interactive-card p-4 rounded-xl flex flex-col relative overflow-hidden group cursor-pointer"
            >
              {roomStatus === 'active' && student.status === 'finished' && (
                 <div className="absolute inset-0 bg-dark-bg/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10">
                   <div className="text-center">
                     <span className="text-xs font-bold text-slate-400 uppercase">Score Preview</span>
                     <div className="text-2xl font-bold text-accent">{student.score}%</div>
                   </div>
                 </div>
              )}
              
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-start/20 to-primary-end/20 border border-primary-start/30 flex items-center justify-center text-primary-start font-bold">
                  {student.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                </div>
                <h3 className="font-semibold text-white truncate">{student.name}</h3>
              </div>
              
              <div className="flex justify-between items-center mt-auto pt-4 border-t border-dark-border">
                {getStatusBadge(student.status)}
              </div>
            </motion.div>
          ))}
          
          {students.length === 0 && (
            <div className="col-span-full py-20 text-center flex flex-col items-center">
              <div className="w-20 h-20 bg-dark-surface border border-dark-border rounded-full flex items-center justify-center mb-4">
                <Users className="w-8 h-8 text-slate-600" />
              </div>
              <p className="text-slate-400 font-medium text-lg">Waiting for the first student...</p>
              <p className="text-slate-500 text-sm mt-2 max-w-md">Share the room code above with your students. They can join by visiting the explore page or entering the code.</p>
            </div>
          )}
        </div>

      </main>
      
      <Footer />
    </div>
  );
}
