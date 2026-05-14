import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Play, Trophy } from 'lucide-react';

const staggerContainer = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-20 pb-32 -mt-[35px]">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-start/20 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 right-1/4 w-[30rem] h-[30rem] bg-accent/10 rounded-full blur-[120px] -z-10" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Content */}
          <motion.div className="max-w-2xl" initial="hidden" animate="show" variants={staggerContainer}>
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-dark-surface border border-dark-border mb-6">
              <span className="flex h-2 w-2 rounded-full bg-accent animate-pulse"></span>
              <span className="text-xs font-medium text-slate-300">Quizix is now live</span>
            </motion.div>
            
            <motion.h1 variants={fadeUp} className="text-5xl lg:text-7xl font-extrabold tracking-tight mb-6 leading-tight">
              AI-Powered Quizzes.<br/>
              <span className="text-gradient">Live Results. Zero Effort.</span>
            </motion.h1>
            
            <motion.p variants={fadeUp} className="text-lg text-slate-400 mb-10 max-w-xl leading-relaxed">
              Create, host, and participate in interactive learning experiences. Generate questions instantly with AI or build your own. Designed for educators, teams, and communities.
            </motion.p>
            
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4">
              <Link to="/create" className="btn-primary flex items-center justify-center gap-2 text-lg">
                Host a Quiz <ArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/join" className="btn-secondary flex items-center justify-center gap-2 text-lg">
                Join a Quiz <Play className="w-5 h-5" />
              </Link>
            </motion.div>
            
            <motion.div variants={fadeUp} className="mt-10 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-0">
              {[
                { emoji: '⚡', label: 'AI Question Generation' },
                { emoji: '📊', label: 'Real-Time Results' },
                { emoji: '🏆', label: 'Live Leaderboards' },
              ].map((badge, idx) => (
                <div key={badge.label} className="flex items-center">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-dark-border bg-dark-surface text-xs font-medium text-slate-400">
                    <span>{badge.emoji}</span> {badge.label}
                  </span>
                  {idx < 2 && (
                    <span className="hidden sm:block mx-3 text-dark-border select-none">·</span>
                  )}
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Graphic */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, x: 50 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="relative lg:h-[500px] flex items-center justify-center"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-primary-start/20 to-primary-end/20 rounded-3xl blur-3xl -z-10"></div>
            
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
  );
}
