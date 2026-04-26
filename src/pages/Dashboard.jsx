import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Users, LayoutDashboard, History, Trophy, ArrowRight, Activity, Loader2 } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { useAuth } from '../context/AuthContext';
import { getUserHostedRooms, getUserJoinedRooms } from '../lib/db';

export default function Dashboard() {
  const { currentUser } = useAuth();
  const [hostedRooms, setHostedRooms] = useState([]);
  const [joinedRooms, setJoinedRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) return;

    async function fetchData() {
      try {
        setIsLoading(true);
        const [hosted, joined] = await Promise.all([
          getUserHostedRooms(currentUser.uid),
          getUserJoinedRooms(currentUser.uid)
        ]);
        
        // Sort by date/createdAt descending
        hosted.sort((a, b) => b.createdAt - a.createdAt);
        joined.sort((a, b) => b.date - a.date);

        setHostedRooms(hosted);
        setJoinedRooms(joined);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [currentUser]);

  // Compute stats
  const totalHosted = hostedRooms.length;
  // Approximation for total students reached across hosted rooms (assuming students count is kept up to date)
  const totalStudents = hostedRooms.reduce((acc, room) => acc + (room.students || 0), 0);
  
  // Calculate average score across all joined rooms where user took a quiz
  const roomsWithScores = joinedRooms.filter(r => r.score !== undefined && r.score !== null);
  const averageScore = roomsWithScores.length > 0 
    ? Math.round(roomsWithScores.reduce((acc, r) => acc + r.score, 0) / roomsWithScores.length) 
    : 0;

  const activeRooms = hostedRooms.filter(r => r.status === 'waiting' || r.status === 'active');
  const pastRooms = hostedRooms.filter(r => r.status === 'finished');

  const displayName = currentUser?.displayName || currentUser?.email?.split('@')[0] || 'User';

  if (isLoading) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center flex-col gap-4">
        <Loader2 className="w-8 h-8 text-primary-start animate-spin" />
        <p className="text-slate-400">Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Welcome back, {displayName}!</h1>
            <p className="text-slate-400">Here's what's happening with your quizzes today.</p>
          </div>
          <Link to="/create" className="btn-primary flex items-center justify-center gap-2 px-6">
            <Plus className="w-5 h-5" />
            Create New Quiz
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="interactive-card p-6 flex items-center gap-4"
          >
            <div className="w-12 h-12 rounded-xl bg-primary-start/20 flex items-center justify-center">
              <LayoutDashboard className="w-6 h-6 text-primary-start" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-400">Total Hosted</p>
              <h3 className="text-2xl font-bold text-white">{totalHosted} <span className="text-sm font-normal text-slate-500">quizzes</span></h3>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="interactive-card p-6 flex items-center gap-4"
          >
            <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center">
              <Users className="w-6 h-6 text-accent" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-400">Total Students</p>
              <h3 className="text-2xl font-bold text-white">{totalStudents} <span className="text-sm font-normal text-slate-500">reached</span></h3>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="interactive-card p-6 flex items-center gap-4"
          >
            <div className="w-12 h-12 rounded-xl bg-yellow-500/20 flex items-center justify-center">
              <Trophy className="w-6 h-6 text-yellow-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-400">Avg. Personal Score</p>
              <h3 className="text-2xl font-bold text-white">{averageScore}%</h3>
            </div>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-2 gap-10">
          {/* Active / Hosted Rooms */}
          <div className="space-y-10">
            {/* Currently Active Room */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <span className="relative flex h-3 w-3 mr-1">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-accent"></span>
                  </span>
                  Currently Active Rooms
                </h2>
              </div>
              <div className="space-y-4">
                {activeRooms.length > 0 ? (
                  activeRooms.map(room => (
                    <div key={room.id} className="interactive-card p-5 rounded-xl border-accent/30 bg-accent/5">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-bold text-white text-lg mb-1">{room.title}</h3>
                          <p className="text-sm text-slate-400">Room Code: <span className="font-mono text-white tracking-widest">{room.id}</span></p>
                        </div>
                        <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-bold uppercase tracking-wide">
                          {room.status === 'waiting' ? 'Waiting in Lobby' : 'In Progress'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-sm text-slate-300">
                          <Users className="w-4 h-4" /> {room.students || 0} joined
                        </div>
                        <Link to={`/room/${room.id}/host`} className="btn-primary py-2 px-4 text-sm flex items-center gap-2">
                          Manage Room <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="glass-card p-6 rounded-xl text-center border-dashed">
                    <p className="text-slate-400 text-sm">No quizzes yet.</p>
                  </div>
                )}
              </div>
            </section>

            {/* Past Hosted Rooms */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Activity className="w-5 h-5 text-primary-start" />
                  Past Hosted Quizzes
                </h2>
              </div>
            <div className="space-y-4">
              {pastRooms.length === 0 ? (
                <div className="glass-card p-8 rounded-xl text-center border-dashed">
                  <p className="text-slate-400 mb-4">No quizzes yet.</p>
                </div>
              ) : (
                pastRooms.map((room) => (
                  <Link key={room.id} to={`/room/${room.id}/report`}>
                    <div className="interactive-card p-5 rounded-xl flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-bold text-white text-lg mb-1">{room.title}</h3>
                        <div className="flex items-center gap-4 text-sm text-slate-400">
                          <span>{new Date(room.createdAt).toLocaleDateString()}</span>
                          <span className="flex items-center gap-1"><Users className="w-4 h-4" /> {room.students || 0}</span>
                        </div>
                      </div>
                      <div>
                        <span className="px-3 py-1 rounded-full bg-accent/10 text-accent border border-accent/20 text-xs font-bold uppercase tracking-wide">
                          Finished
                        </span>
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </section>
          </div>

          {/* Joined Rooms */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <History className="w-5 h-5 text-accent" />
                Recently Joined
              </h2>
            </div>
            <div className="space-y-4">
              {joinedRooms.length === 0 ? (
                <div className="glass-card p-8 rounded-xl text-center border-dashed">
                  <p className="text-slate-400 mb-4">You haven't participated in any quizzes.</p>
                  <Link to="/explore" className="text-primary-start hover:text-primary-end font-medium inline-flex items-center gap-1">
                    Explore active rooms <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              ) : (
                joinedRooms.map((room) => (
                  <Link key={room.id} to={`/room/${room.id}/results/${currentUser?.uid}`}>
                    <div className="interactive-card p-5 rounded-xl flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-bold text-white text-lg mb-1">{room.title}</h3>
                        <div className="text-sm text-slate-400">
                          Host: {room.host} • {new Date(room.date).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-slate-400 mb-1">Score</div>
                        <div className="text-xl font-bold text-accent">{room.score}%</div>
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
