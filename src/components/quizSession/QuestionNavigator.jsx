export default function QuestionNavigator({ questions, answers, activeIndex, onJump }) {
  return (
    <div className="flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0 lg:pr-2">
      <span className="hidden lg:block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 shrink-0">Questions</span>
      <div className="flex flex-row lg:flex-col gap-2">
        {questions.map((q, idx) => {
          const isAnswered = answers[q.id] !== undefined;
          const isActive = idx === activeIndex;
          return (
            <button
              key={q.id ?? idx}
              onClick={() => onJump(idx)}
              title={`Question ${idx + 1}`}
              className={`
                shrink-0 w-9 h-9 rounded-full text-sm font-bold transition-all duration-200
                flex items-center justify-center border-2
                ${isActive
                  ? 'border-primary-start bg-primary-start text-white shadow-[0_0_12px_rgba(99,102,241,0.4)] scale-110'
                  : isAnswered
                    ? 'border-accent bg-accent/20 text-accent'
                    : 'border-dark-border bg-dark-surface text-slate-400 hover:border-slate-500 hover:text-slate-300'
                }
              `}
            >
              {idx + 1}
            </button>
          );
        })}
      </div>
    </div>
  );
}
