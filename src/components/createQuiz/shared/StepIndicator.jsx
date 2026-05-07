import { Settings, ListChecks, Rocket } from 'lucide-react';

export default function StepIndicator({ step }) {
  return (
    <div className="flex items-center justify-between mb-10 relative">
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-dark-border -z-10"></div>
      <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-primary-start transition-all duration-300 -z-10" style={{ width: `${((step - 1) / 2) * 100}%` }}></div>
      
      {[
        { num: 1, icon: Settings, label: 'Settings' },
        { num: 2, icon: ListChecks, label: 'Questions' },
        { num: 3, icon: Rocket, label: 'Launch' },
      ].map((s) => (
        <div key={s.num} className="flex flex-col items-center">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center border-4 border-dark-bg transition-colors ${step >= s.num ? 'bg-primary-start text-white' : 'bg-dark-surface border-dark-border text-slate-500'}`}>
            <s.icon className="w-5 h-5" />
          </div>
          <span className={`mt-2 text-xs font-bold uppercase tracking-wider ${step >= s.num ? 'text-primary-start' : 'text-slate-500'}`}>{s.label}</span>
        </div>
      ))}
    </div>
  );
}
