import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Users, Play, Star, Trophy, Loader2 } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { getPublicRooms } from '../lib/db';

// Animation variants
const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

export default function Landing() {
  const [featuredRooms, setFeaturedRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchRooms() {
      try {
        const rooms = await getPublicRooms();
        // Just take the first few for the landing page
        setFeaturedRooms(rooms.slice(0, 4));
      } catch (error) {
        console.error("Failed to fetch featured rooms:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchRooms();
  }, []);

  return (
    <>
      <Navbar />
      
      <main className="flex-1 flex flex-col">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-20 pb-32">
          {/* Background Glows */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-start/20 rounded-full blur-[120px] -z-10" />
          <div className="absolute bottom-0 right-1/4 w-[30rem] h-[30rem] bg-accent/10 rounded-full blur-[120px] -z-10" />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              
              {/* Left Content */}
              <motion.div 
                className="max-w-2xl"
                initial="hidden"
                animate="show"
                variants={staggerContainer}
              >
                <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-dark-surface border border-dark-border mb-6">
                  <span className="flex h-2 w-2 rounded-full bg-accent animate-pulse"></span>
                  <span className="text-xs font-medium text-slate-300">Quizix 2.0 is now live</span>
                </motion.div>
                
                <motion.h1 variants={fadeUp} className="text-5xl lg:text-7xl font-extrabold tracking-tight mb-6 leading-tight">
                  Engage your audience with <br/>
                  <span className="text-gradient">real-time quizzes.</span>
                </motion.h1>
                
                <motion.p variants={fadeUp} className="text-lg text-slate-400 mb-10 max-w-xl leading-relaxed">
                  Create, host, and participate in interactive learning experiences. 
                  Designed for educators, teams, and communities who demand a premium experience.
                </motion.p>
                
                <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4">
                  <Link to="/create" className="btn-primary flex items-center justify-center gap-2 text-lg">
                    Host a Quiz <ArrowRight className="w-5 h-5" />
                  </Link>
                  <Link to="/join" className="btn-secondary flex items-center justify-center gap-2 text-lg">
                    Join a Quiz <Play className="w-5 h-5" />
                  </Link>
                </motion.div>
                
                <motion.div variants={fadeUp} className="mt-10 flex items-center gap-4 text-sm text-slate-500 font-medium">
                  <div className="flex -space-x-2">
                    {[1,2,3,4].map(i => (
                      <div key={i} className="w-8 h-8 rounded-full border-2 border-dark-bg bg-dark-surface flex items-center justify-center">
                        <Users className="w-4 h-4 text-slate-400" />
                      </div>
                    ))}
                  </div>
                  <p>Over 10,000+ players joined today</p>
                </motion.div>
              </motion.div>

              {/* Right Graphic (Mockup) */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, x: 50 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                className="relative lg:h-[500px] flex items-center justify-center"
              >
                <div className="absolute inset-0 bg-gradient-to-tr from-primary-start/20 to-primary-end/20 rounded-3xl blur-3xl -z-10"></div>
                
                {/* Floating Mockup Card 1 (Main Question) */}
                <motion.div 
                  animate={{ y: [0, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                  className="interactive-card w-full max-w-md p-6 rounded-2xl relative z-10"
                >
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Question 4 of 10</span>
                    <span className="px-2 py-1 rounded bg-dark-bg text-accent text-xs font-mono font-bold border border-accent/20">00:15</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-6">What is the time complexity of binary search?</h3>
                  
                  <div className="space-y-3">
                    {['O(n)', 'O(n log n)', 'O(log n)', 'O(1)'].map((opt, idx) => (
                      <div key={idx} className={`p-4 rounded-xl border transition-all ${idx === 2 ? 'border-accent bg-accent/10' : 'border-dark-border bg-dark-bg'}`}>
                        <div className="flex items-center gap-3">
                          <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${idx === 2 ? 'border-accent bg-accent' : 'border-slate-600'}`}>
                            {idx === 2 && <div className="w-2 h-2 rounded-full bg-white" />}
                          </div>
                          <span className={idx === 2 ? 'text-accent font-medium' : 'text-slate-300'}>{opt}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Floating Mockup Card 2 (Leaderboard peek) */}
                <motion.div 
                  animate={{ y: [0, 15, 0] }}
                  transition={{ repeat: Infinity, duration: 8, ease: "easeInOut", delay: 1 }}
                  className="absolute -bottom-10 -left-10 interactive-card w-64 p-4 rounded-xl z-20 hidden md:block"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <Trophy className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm font-bold text-white">Live Ranks</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-300">1. Alex.dev</span>
                      <span className="font-mono text-accent">4,200</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-300">2. Sarah</span>
                      <span className="font-mono text-slate-400">3,850</span>
                    </div>
                  </div>
                </motion.div>
                
              </motion.div>
            </div>
          </div>
        </section>

        {/* Featured Rooms Section */}
        <section className="py-24 border-t border-dark-border/50 bg-dark-surface/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-end mb-10">
              <div>
                <h2 className="text-3xl font-bold mb-2">Featured Rooms</h2>
                <p className="text-slate-400">Join active public quizzes happening right now.</p>
              </div>
              <Link to="/explore" className="hidden sm:flex items-center gap-2 text-primary-start hover:text-primary-end font-medium transition-colors">
                View all <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {isLoading ? (
              <div className="flex justify-center py-10">
                <Loader2 className="w-8 h-8 text-primary-start animate-spin" />
              </div>
            ) : featuredRooms.length === 0 ? (
              <div className="glass-card p-10 rounded-2xl text-center border-dashed">
                <p className="text-slate-400">No public rooms available right now. Be the first to host one!</p>
                <Link to="/create" className="btn-primary inline-flex mt-6">Host a Quiz</Link>
              </div>
            ) : (
              <div className="flex overflow-x-auto pb-8 -mx-4 px-4 sm:mx-0 sm:px-0 gap-6 snap-x hide-scrollbar">
                {featuredRooms.map((room) => (
                  <Link to={`/room/${room.id}/quiz?solo=true`} key={room.id} className="snap-start shrink-0 w-[300px] interactive-card p-6 rounded-2xl flex flex-col group cursor-pointer block">
                    <div className="flex flex-wrap gap-2 mb-4">
                      {room.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-dark-border text-slate-300">
                          {tag}
                        </span>
                      ))}
                      {room.tags.length > 3 && (
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-dark-bg border border-dark-border text-slate-400">
                          +{room.tags.length - 3} more
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary-start transition-colors line-clamp-2">
                      {room.title}
                    </h3>
                    <div className="text-sm text-slate-400 mb-6 flex-1">
                      By {room.creator} • {room.questions} Qs
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-dark-border">
                      <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                        <Users className="w-3.5 h-3.5" />
                        {room.joined.toLocaleString()} joined
                      </div>
                      <div className="flex items-center gap-1 text-xs font-bold text-primary-start group-hover:translate-x-1 transition-transform">
                        Join <ArrowRight className="w-3 h-3" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      
      <Footer />
    </>
  );
}
