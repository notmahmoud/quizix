export default function QuestionNavigator({ questions, answers, activeIndex, onJump }) {
  return (
    <div className="flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0 lg:pr-2">
      <span className="hidden lg:block section-label mb-2 shrink-0">Questions</span>
      <div className="flex flex-row lg:flex-col gap-2">
        {questions.map((q, idx) => {
          const isAnswered = answers[q.id] !== undefined;
          const isActive = idx === activeIndex;
          return (
            <button
              key={q.id ?? idx}
              onClick={() => onJump(idx)}
              title={`Question ${idx + 1}`}
              style={{
                width: 34, height: 34, borderRadius: 8, fontSize: '0.8125rem', fontWeight: 500,
                flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: isActive
                  ? '2px solid #0D9488'
                  : isAnswered
                    ? '2px solid #0D9488'
                    : '1px solid #E5E7EB',
                background: isActive
                  ? '#0D9488'
                  : isAnswered
                    ? '#E6FAF8'
                    : '#FFFFFF',
                color: isActive ? '#FFFFFF' : isAnswered ? '#0D9488' : '#4B5563',
                cursor: 'pointer',
                transition: 'all 150ms ease',
                transform: isActive ? 'scale(1.08)' : 'none',
              }}
            >
              {idx + 1}
            </button>
          );
        })}
      </div>
    </div>
  );
}
