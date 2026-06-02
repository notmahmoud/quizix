import { Users, Target, Activity } from 'lucide-react';

export default function OverviewCards({ overview }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
      <div className="card flex items-center gap-4" style={{ padding: '20px', background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: 10 }}>
        <div className="w-12 h-12 rounded-xl bg-teal-light flex items-center justify-center">
          <Users className="w-6 h-6 text-teal" />
        </div>
        <div>
          <p className="text-sm font-medium text-muted">Total Students</p>
          <h3 className="text-2xl font-medium text-gray-900">{overview.totalStudents}</h3>
        </div>
      </div>

      <div className="card flex items-center gap-4" style={{ padding: '20px', background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: 10 }}>
        <div className="w-12 h-12 rounded-xl bg-teal-light flex items-center justify-center">
          <Target className="w-6 h-6 text-teal" />
        </div>
        <div>
          <p className="text-sm font-medium text-muted">Class Average</p>
          <h3 className="text-2xl font-medium text-gray-900">{overview.averageScore}%</h3>
        </div>
      </div>

      <div className="card flex items-center gap-4" style={{ padding: '20px', background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: 10 }}>
        <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center">
          <Activity className="w-6 h-6 text-amber-500" />
        </div>
        <div>
          <p className="text-sm font-medium text-muted">Pass Rate (&gt;60%)</p>
          <h3 className="text-2xl font-medium text-gray-900">{overview.passRate}%</h3>
        </div>
      </div>
    </div>
  );
}
