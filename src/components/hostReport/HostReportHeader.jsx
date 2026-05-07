import { Download } from 'lucide-react';

export default function HostReportHeader({ code }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Quiz Report</h1>
        <p className="text-slate-400">Analytics for Room <span className="font-mono text-white">{code}</span></p>
      </div>
      <button className="btn-secondary flex items-center justify-center gap-2">
        <Download className="w-4 h-4" /> Export CSV
      </button>
    </div>
  );
}
