import { ArrowRight } from 'lucide-react';

export default function StudentResultsTable({ students, onSelectStudent }) {
  return (
    <div>
      <h2 className="text-xl font-bold text-white mb-6">Student Results</h2>
      <div className="glass-card rounded-2xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-dark-bg border-b border-dark-border">
              <th className="py-4 px-6 font-semibold text-slate-400 text-sm">Student</th>
              <th className="py-4 px-6 font-semibold text-slate-400 text-sm">Score</th>
              <th className="py-4 px-6 font-semibold text-slate-400 text-sm">Status</th>
              <th className="py-4 px-6"></th>
            </tr>
          </thead>
          <tbody>
            {students.length === 0 ? (
              <tr>
                <td colSpan="4" className="py-8 text-center text-slate-400">
                  No students have joined yet.
                </td>
              </tr>
            ) : (
              students.map((student) => (
                <tr 
                  key={student.id}
                  onClick={() => onSelectStudent(student)}
                  className="border-b border-dark-border/50 last:border-0 hover:bg-dark-bg/50 transition-colors cursor-pointer group"
                >
                  <td className="py-4 px-6 font-medium text-white flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary-start/20 flex items-center justify-center text-primary-start text-xs font-bold uppercase shrink-0">
                      {student.name ? student.name.charAt(0) : '?'}
                    </div>
                    {student.name}
                  </td>
                  <td className="py-4 px-6 font-bold">
                    {student.score !== undefined && student.score !== null ? (
                      <span className={student.score >= 60 ? 'text-emerald-400' : 'text-error'}>{student.score}%</span>
                    ) : (
                      <span className="text-slate-500">-</span>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${student.status === 'finished' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-dark-bg border border-dark-border text-slate-400'}`}>
                      {student.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <span className="text-primary-start font-medium opacity-0 group-hover:opacity-100 flex items-center justify-end gap-1 transition-opacity text-sm">
                      View Details <ArrowRight className="w-4 h-4" />
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
