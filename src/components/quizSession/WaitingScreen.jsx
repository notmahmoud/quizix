import { Clock } from 'lucide-react';

export default function WaitingScreen() {
  return (
    <div className="min-h-screen bg-dark-bg flex flex-col items-center justify-center p-4 text-center">
      <div className="w-24 h-24 bg-dark-surface border border-dark-border rounded-full flex items-center justify-center mb-6 shadow-lg shadow-primary-start/20">
        <Clock className="w-12 h-12 text-primary-start animate-pulse" />
      </div>
      <h1 className="text-3xl font-bold text-white mb-4">Waiting for Host</h1>
      <p className="text-lg text-slate-400">The quiz will begin shortly when the host starts the session.</p>
    </div>
  );
}
