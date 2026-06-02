import { Users, Play, BarChart3 } from 'lucide-react';

export default function LobbyActionBar({ students, roomStatus, onStart, onEnd, onViewReport }) {
  return (
    <div className="card flex flex-col sm:flex-row items-center justify-between mb-8 gap-4" style={{ padding: '20px', background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: 10 }}>
      <div className="flex items-center gap-3 text-muted">
        <div className="w-10 h-10 rounded-full bg-bg border border-gray-200 flex items-center justify-center">
          <Users className="w-5 h-5 text-muted" />
        </div>
        <div>
          <span className="text-xl font-medium text-gray-900">{students.length}</span> students joined
        </div>
      </div>

      {roomStatus === 'waiting' && (
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <button onClick={onEnd} className="px-6 py-3 rounded-xl border border-red-200 text-red-500 hover:bg-red-50 font-medium transition-colors w-full sm:w-auto cursor-pointer">
            End Session
          </button>
          <button onClick={onStart} disabled={students.length === 0} className="btn-primary flex items-center justify-center gap-2 px-8 py-3 w-full sm:w-auto">
            Start Quiz <Play className="w-5 h-5 fill-current" />
          </button>
        </div>
      )}

      {roomStatus === 'active' && (
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <div className="px-6 py-3 rounded-xl border border-teal/20 bg-teal-light text-teal font-medium flex items-center justify-center gap-3 w-full sm:w-auto">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-teal"></span>
            </span>
            Quiz is Live
          </div>
          <button onClick={onEnd} className="px-6 py-3 rounded-xl border border-red-200 text-red-500 hover:bg-red-50 font-medium transition-colors w-full sm:w-auto cursor-pointer">
            End Session
          </button>
        </div>
      )}

      {roomStatus === 'finished' && (
        <button onClick={onViewReport} className="btn-primary flex items-center gap-2 px-8 py-3 w-full sm:w-auto">
          View Full Report <BarChart3 className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}
