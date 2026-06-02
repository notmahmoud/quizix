import { Copy, Share2, CheckCircle2 } from 'lucide-react';

export default function LobbyHeader({ code, copied, onCopy }) {
  return (
    <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-12">
      <div>
        <h1 className="text-3xl font-medium text-gray-900 mb-2 letter-spacing[-0.5px]">Host Lobby</h1>
        <p className="text-muted">Waiting for students to join your quiz room.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <div className="flex items-center bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="px-6 py-3 border-r border-gray-200 bg-white">
            <span className="text-[10px] uppercase font-medium text-muted tracking-wider block mb-1">Room Code</span>
            <span className="text-3xl font-mono font-medium text-teal tracking-wider">{code}</span>
          </div>
          <button
            onClick={onCopy}
            className="px-4 py-3 hover:bg-bg transition-colors h-full flex flex-col items-center justify-center text-muted hover:text-gray-900"
          >
            {copied ? <CheckCircle2 className="w-5 h-5 text-teal" /> : <Copy className="w-5 h-5" />}
            <span className="text-[10px] uppercase font-medium mt-1">{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>

        <button className="h-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-muted hover:text-gray-900 hover:bg-bg transition-colors flex flex-col items-center justify-center">
          <Share2 className="w-5 h-5" />
          <span className="text-[10px] uppercase font-medium mt-1">Share</span>
        </button>
      </div>
    </div>
  );
}
