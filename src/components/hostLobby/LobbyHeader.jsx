import { Copy, Share2, CheckCircle2 } from 'lucide-react';

export default function LobbyHeader({ code, copied, onCopy }) {
  return (
    <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-12">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Host Lobby</h1>
        <p className="text-slate-400">Waiting for students to join your quiz.</p>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <div className="flex items-center bg-dark-surface border border-dark-border rounded-xl overflow-hidden">
          <div className="px-6 py-3 border-r border-dark-border bg-dark-bg/50">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1">Room Code</span>
            <span className="text-3xl font-mono font-bold text-primary-start tracking-wider">{code}</span>
          </div>
          <button 
            onClick={onCopy}
            className="px-4 py-3 hover:bg-dark-border/50 transition-colors h-full flex flex-col items-center justify-center text-slate-400 hover:text-white"
          >
            {copied ? <CheckCircle2 className="w-5 h-5 text-accent" /> : <Copy className="w-5 h-5" />}
            <span className="text-[10px] uppercase font-bold mt-1">{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
        
        <button className="h-full px-4 py-3 rounded-xl border border-dark-border bg-dark-surface text-slate-400 hover:text-white hover:bg-dark-border/50 transition-colors flex flex-col items-center justify-center">
          <Share2 className="w-5 h-5" />
          <span className="text-[10px] uppercase font-bold mt-1">Share</span>
        </button>
      </div>
    </div>
  );
}
