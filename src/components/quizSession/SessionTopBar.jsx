import { Clock, ChevronLeft } from 'lucide-react';

function formatTime(seconds) {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

export default function SessionTopBar({ title, globalTimeLeft, totalTime, answeredCount, totalQuestions, onSubmit, isSubmitting, onExit }) {
  const pct = totalTime > 0 ? (globalTimeLeft / totalTime) * 100 : 100;
  const isWarning = pct <= 20;
  const isDanger = pct <= 10;

  const timerBg = isDanger ? '#FEF2F2' : isWarning ? '#FFFBEB' : '#FAF9F7';
  const timerBorder = isDanger ? '#FECACA' : isWarning ? '#FDE68A' : '#E5E7EB';
  const timerColor = isDanger ? '#EF4444' : isWarning ? '#F59E0B' : '#111827';

  return (
    <header style={{ background: '#FFFFFF', borderBottom: '1px solid #E5E7EB' }} className="sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Left */}
        <div className="flex-1 flex items-center gap-2 min-w-0">
          <button
            onClick={onExit}
            className="flex items-center justify-center rounded-lg transition-colors hover:bg-gray-100 flex-shrink-0"
            style={{ width: 34, height: 34, color: '#4B5563' }}
            title="Leave Quiz"
          >
            <ChevronLeft style={{ width: 18, height: 18 }} />
          </button>
          <h1 style={{ fontSize: '0.9375rem', fontWeight: 500, color: '#111827' }} className="truncate hidden sm:block" title={title}>
            {title}
          </h1>
        </div>

        {/* Timer */}
        <div className="flex-1 flex justify-center">
          {globalTimeLeft !== null && (
            <div
              className="flex items-center gap-2 font-mono font-medium"
              style={{
                padding: '6px 16px',
                borderRadius: 8,
                border: `1px solid ${timerBorder}`,
                background: timerBg,
                color: timerColor,
                fontSize: '1.125rem',
                animation: isDanger ? 'pulse 1s infinite' : undefined
              }}
            >
              <Clock style={{ width: 16, height: 16, flexShrink: 0 }} />
              {formatTime(globalTimeLeft)}
            </div>
          )}
        </div>

        {/* Right */}
        <div className="flex-1 flex items-center justify-end gap-3 min-w-0">
          <span style={{ fontSize: '0.8125rem', color: '#4B5563', whiteSpace: 'nowrap' }} className="hidden md:block">
            {answeredCount} / {totalQuestions} answered
          </span>
          <button
            onClick={onSubmit}
            disabled={answeredCount === 0 || isSubmitting}
            className="btn-primary whitespace-nowrap"
            style={{ padding: '7px 16px', fontSize: '0.875rem' }}
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </div>
    </header>
  );
}
