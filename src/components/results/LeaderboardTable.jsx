import { Trophy } from 'lucide-react';

export default function LeaderboardTable({ leaderboard, uid, leaderboardEnabled }) {
  if (!leaderboardEnabled) {
    return (
      <div className="glass-card p-6 text-center text-slate-400">
        Leaderboard is disabled for this room.
      </div>
    );
  }

  return (
    <div className="glass-card rounded-2xl overflow-hidden">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-dark-bg border-b border-dark-border">
            <th className="py-4 px-6 font-semibold text-slate-400 text-sm">Rank</th>
            <th className="py-4 px-6 font-semibold text-slate-400 text-sm">Student</th>
            <th className="py-4 px-6 font-semibold text-slate-400 text-sm text-right">Score</th>
          </tr>
        </thead>
        <tbody>
          {leaderboard.map((student, idx) => (
            <tr key={idx} className={`border-b border-dark-border/50 last:border-0 hover:bg-dark-bg/30 transition-colors ${student.id === uid ? 'bg-primary-start/5' : ''}`}>
              <td className="py-4 px-6">
                {student.rank === 1 ? <Trophy className="w-5 h-5 text-yellow-500" /> :
                 student.rank === 2 ? <Trophy className="w-5 h-5 text-slate-300" /> :
                 student.rank === 3 ? <Trophy className="w-5 h-5 text-amber-600" /> :
                 <span className="text-slate-500 font-medium pl-1">{student.rank}</span>}
              </td>
              <td className="py-4 px-6 font-medium text-white flex items-center gap-2">
                {student.name}
                {student.id === uid && <span className="px-2 py-0.5 rounded bg-primary-start/20 text-primary-start text-[10px] uppercase font-bold tracking-wider ml-2">You</span>}
              </td>
              <td className="py-4 px-6 text-right font-bold text-accent">{student.score}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
