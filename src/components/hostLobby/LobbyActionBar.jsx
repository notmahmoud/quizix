import { Users, Play, BarChart3 } from 'lucide-react';

export default function LobbyActionBar({ students, roomStatus, onStart, onEnd, onViewReport }) {
  return (
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
          <button onClick={onEnd} className="px-6 py-3 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 font-bold transition-colors w-full sm:w-auto">
            End Session
          </button>
          <button onClick={onStart} disabled={students.length === 0} className="btn-primary flex items-center justify-center gap-2 px-8 py-3 w-full sm:w-auto">
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
          <button onClick={onEnd} className="px-6 py-3 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 font-bold transition-colors w-full sm:w-auto">
            End Session
          </button>
        </div>
      )}

      {roomStatus === 'finished' && (
        <button onClick={onViewReport} className="btn-primary bg-gradient-to-r from-accent to-emerald-400 hover:shadow-accent/25 flex items-center gap-2 px-8 py-3 w-full sm:w-auto">
          View Full Report <BarChart3 className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}
