import { Clock } from 'lucide-react';

function formatTime(seconds) {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

export default function SessionTopBar({ title, globalTimeLeft, totalTime, answeredCount, totalQuestions, onSubmit, isSubmitting }) {
  const pct = totalTime > 0 ? (globalTimeLeft / totalTime) * 100 : 100;
  const isWarning = pct <= 20;
  const isDanger = pct <= 10;

  return (
    <header className="sticky top-0 z-40 bg-dark-bg/90 backdrop-blur-lg border-b border-dark-border">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Title */}
        <h1 className="text-sm font-bold text-white truncate max-w-[30%] hidden sm:block">{title}</h1>

        {/* Global Timer */}
        <div className="flex-1 flex justify-center">
          {globalTimeLeft !== null && (
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full border font-mono font-bold text-xl transition-colors
              ${isDanger
                ? 'border-error/50 bg-error/10 text-error animate-pulse'
                : isWarning
                  ? 'border-orange-500/50 bg-orange-500/10 text-orange-400'
                  : 'border-dark-border bg-dark-surface text-white'
              }`}
            >
              <Clock className="w-5 h-5 shrink-0" />
              {formatTime(globalTimeLeft)}
            </div>
          )}
        </div>

        {/* Submit */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-medium text-slate-400 hidden sm:block whitespace-nowrap">
            {answeredCount} / {totalQuestions} answered
          </span>
          <button
            onClick={onSubmit}
            disabled={answeredCount === 0 || isSubmitting}
            className="btn-primary px-4 py-2 text-sm disabled:opacity-40 whitespace-nowrap"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Quiz'}
          </button>
        </div>
      </div>
    </header>
  );
}
