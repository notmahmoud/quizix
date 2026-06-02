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
    <div className="min-h-screen flex flex-col" style={{ background: '#FAF9F7' }}>
      <Navbar />
      <main className="flex-1 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full"
          style={{ maxWidth: 400 }}
        >
          <div className="card p-8">
            <div className="text-center mb-8">
              <div style={{ width: 56, height: 56, borderRadius: 12, background: '#E6FAF8', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
                <KeyRound style={{ width: 26, height: 26, color: '#0D9488' }} />
              </div>
              <h1 style={{ fontSize: '1.375rem', fontWeight: 500, color: '#111827', marginBottom: '0.375rem' }}>Join a Room</h1>
              <p style={{ fontSize: '0.9375rem', color: '#4B5563', lineHeight: 1.6 }}>
                Enter the room code provided by your host to join the quiz session.
              </p>
            </div>

            <form onSubmit={handleJoin}>
              <div className="mb-5">
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: 6 }}>
                  Room Code
                </label>
                <input
                  type="text"
                  value={roomCode}
                  onChange={(e) => {
                    setRoomCode(e.target.value.toUpperCase());
                    setError('');
                  }}
                  className="form-input text-center"
                  style={{
                    fontSize: '1.5rem',
                    fontFamily: 'monospace',
                    letterSpacing: '0.15em',
                    fontWeight: 600,
                    borderColor: error ? '#EF4444' : undefined,
                    boxShadow: error ? '0 0 0 1px #EF4444' : undefined
                  }}
                  placeholder="e.g. RM123"
                  maxLength={10}
                  autoComplete="off"
                />
                {error && (
                  <p className="mt-2 flex items-center justify-center gap-1.5" style={{ fontSize: '0.875rem', color: '#EF4444' }}>
                    <AlertCircle style={{ width: 14, height: 14 }} /> {error}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isJoining}
                className="btn-primary w-full justify-center gap-2"
                style={{ height: 46, fontSize: '1rem' }}
              >
                {isJoining ? (
                  <>Joining <Loader2 style={{ width: 16, height: 16 }} className="animate-spin" /></>
                ) : (
                  <>Join Quiz <ArrowRight style={{ width: 16, height: 16 }} /></>
                )}
              </button>
            </form>
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
