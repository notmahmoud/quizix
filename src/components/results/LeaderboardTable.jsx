import { Trophy } from 'lucide-react';

export default function LeaderboardTable({ leaderboard, uid, leaderboardEnabled }) {
  if (!leaderboardEnabled) {
    return (
      <div className="text-center text-muted" style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: 10, padding: '24px' }}>
        Leaderboard is disabled for this room.
      </div>
    );
  }

  return (
    <div style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: 10, overflow: 'hidden' }}>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-gray-200" style={{ background: '#FAF9F7' }}>
            <th className="py-4 px-6 font-medium text-muted text-sm">Rank</th>
            <th className="py-4 px-6 font-medium text-muted text-sm">Student</th>
            <th className="py-4 px-6 font-medium text-muted text-sm text-right">Score</th>
          </tr>
        </thead>
        <tbody>
          {leaderboard.map((student, idx) => (
            <tr
              key={idx}
              className={`border-b border-gray-200 last:border-0 transition-colors ${student.id === uid ? 'bg-teal-light/40' : 'hover:bg-bg/30'}`}
            >
              <td className="py-4 px-6">
                {student.rank === 1 ? <Trophy className="w-5 h-5 text-amber-400" /> :
                 student.rank === 2 ? <Trophy className="w-5 h-5 text-gray-400" /> :
                 student.rank === 3 ? <Trophy className="w-5 h-5 text-amber-600" /> :
                 <span className="text-muted font-medium pl-1">{student.rank}</span>}
              </td>
              <td className="py-4 px-6 font-medium text-gray-900 flex items-center gap-2">
                {student.name}
                {student.id === uid && (
                  <span className="px-2 py-0.5 rounded bg-teal-light text-teal text-[10px] uppercase font-medium tracking-wider ml-2 border border-teal/10">
                    You
                  </span>
                )}
              </td>
              <td className="py-4 px-6 text-right font-semibold text-teal">{student.score}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
