export default function TrueFalseOptions({ q, updateQuestion }) {
  return (
    <div className="flex gap-4">
      {['True', 'False'].map((val, idx) => (
        <button
          key={val}
          onClick={() => updateQuestion(q.id, 'correct', idx)}
          className={`flex-1 py-3 rounded-xl border font-medium text-sm transition-colors ${q.correct === idx ? 'border-accent bg-accent/10 text-accent' : 'border-dark-border bg-dark-surface text-slate-400 hover:border-slate-500'}`}
        >
          {val}
        </button>
      ))}
    </div>
  );
}
