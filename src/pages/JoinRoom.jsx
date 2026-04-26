import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, KeyRound, AlertCircle, Loader2 } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { useAuth } from '../context/AuthContext';
import { getRoom, updateStudentStatus } from '../lib/db';

export default function JoinRoom() {
  const [roomCode, setRoomCode] = useState('');
  const [error, setError] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const handleJoin = async (e) => {
    e.preventDefault();
    if (!roomCode.trim()) {
      setError('Please enter a room code');
      return;
    }
    
    setIsJoining(true);
    setError('');
    const code = roomCode.toUpperCase();
    
    try {
      const room = await getRoom(code);
      if (!room) {
        setError('Room not found. Please check the code.');
        setIsJoining(false);
        return;
      }

      // If user is logged in, register them in the room
      if (currentUser) {
        await updateStudentStatus(code, currentUser.uid, {
          name: currentUser.displayName || currentUser.email?.split('@')[0] || 'Unknown User',
          status: 'waiting',
          score: null
        });
      }

      navigate(`/room/${code}/quiz`, { replace: true });
    } catch (err) {
      console.error(err);
      setError('Failed to join room. Please try again.');
      setIsJoining(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="glass-card p-8 rounded-2xl relative overflow-hidden">
            {/* Background accent */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary-start/20 rounded-full blur-[50px] pointer-events-none" />
            
            <div className="text-center mb-8 relative z-10">
              <div className="w-16 h-16 bg-dark-bg border border-dark-border rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <KeyRound className="w-8 h-8 text-primary-start" />
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">Join a Room</h1>
              <p className="text-slate-400">Enter the room code provided by your host to join the quiz session.</p>
            </div>

            <form onSubmit={handleJoin} className="relative z-10">
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Room Code
                </label>
                <input
                  type="text"
                  value={roomCode}
                  onChange={(e) => {
                    setRoomCode(e.target.value.toUpperCase());
                    setError('');
                  }}
                  className={`w-full bg-dark-bg border ${error ? 'border-red-500 focus:ring-red-500/50' : 'border-dark-border focus:ring-primary-start/50 focus:border-primary-start'} rounded-xl px-4 py-4 text-center text-2xl font-mono text-white outline-none focus:ring-2 transition-all placeholder:text-slate-600 tracking-widest`}
                  placeholder="e.g. RM123"
                  maxLength={10}
                  autoComplete="off"
                />
                {error && (
                  <p className="mt-2 text-sm text-red-400 flex items-center gap-1 justify-center">
                    <AlertCircle className="w-4 h-4" /> {error}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full btn-primary flex items-center justify-center gap-2 py-4 text-lg"
              >
                Join Quiz <ArrowRight className="w-5 h-5" />
              </button>
            </form>
          </div>
        </motion.div>
      </main>
      
      <Footer />
    </div>
  );
}
