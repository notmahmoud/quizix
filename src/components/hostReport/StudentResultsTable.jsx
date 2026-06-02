import { ArrowRight } from 'lucide-react';

export default function StudentResultsTable({ students, onSelectStudent }) {
  return (
    <div>
      <h2 className="text-xl font-medium text-gray-900 mb-6 letter-spacing[-0.5px]">Student Results</h2>
      <div className="card overflow-hidden" style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: 10 }}>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white border-b border-gray-200">
              <th className="py-4 px-6 font-medium text-muted text-sm">Student</th>
              <th className="py-4 px-6 font-medium text-muted text-sm">Score</th>
              <th className="py-4 px-6 font-medium text-muted text-sm">Status</th>
              <th className="py-4 px-6"></th>
            </tr>
          </thead>
          <tbody>
            {students.length === 0 ? (
              <tr>
                <td colSpan="4" className="py-8 text-center text-muted">
                  No students have joined yet.
                </td>
              </tr>
            ) : (
              students.map((student) => (
                <tr
                  key={student.id}
                  onClick={() => onSelectStudent(student)}
                  className="border-b border-gray-200 last:border-0 hover:bg-bg/20 transition-colors cursor-pointer group"
                >
                  <td className="py-4 px-6 font-medium text-gray-900 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-teal-light border border-teal/20 flex items-center justify-center text-teal text-xs font-medium uppercase shrink-0">
                      {student.name ? student.name.charAt(0) : '?'}
                    </div>
                    {student.name}
                  </td>
                  <td className="py-4 px-6 font-medium">
                    {student.score !== undefined && student.score !== null ? (
                      <span className={student.score >= 60 ? 'text-teal font-semibold' : 'text-red-500'}>{student.score}%</span>
                    ) : (
                      <span className="text-muted">-</span>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-2 py-1 rounded text-[10px] font-medium uppercase ${student.status === 'finished' ? 'bg-teal-light text-teal border border-teal/10' : 'bg-gray-100 border border-gray-200 text-muted'}`}>
                      {student.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <span className="text-teal font-medium opacity-0 group-hover:opacity-100 flex items-center justify-end gap-1 transition-opacity text-sm">
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
