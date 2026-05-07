import { Users, Target, Activity } from 'lucide-react';

export default function OverviewCards({ overview }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
      <div className="interactive-card p-6 flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-primary-start/20 flex items-center justify-center">
          <Users className="w-6 h-6 text-primary-start" />
        </div>
        <div>
          <p className="text-sm font-medium text-slate-400">Total Students</p>
          <h3 className="text-2xl font-bold text-white">{overview.totalStudents}</h3>
        </div>
      </div>
      <div className="interactive-card p-6 flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center">
          <Target className="w-6 h-6 text-accent" />
        </div>
        <div>
          <p className="text-sm font-medium text-slate-400">Class Average</p>
          <h3 className="text-2xl font-bold text-white">{overview.averageScore}%</h3>
        </div>
      </div>
      <div className="interactive-card p-6 flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-yellow-500/20 flex items-center justify-center">
          <Activity className="w-6 h-6 text-yellow-500" />
        </div>
        <div>
          <p className="text-sm font-medium text-slate-400">Pass Rate (&gt;60%)</p>
          <h3 className="text-2xl font-bold text-white">{overview.passRate}%</h3>
        </div>
      </div>
    </div>
  );
}
