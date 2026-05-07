export default function MCQOptions({ q, updateQuestion, updateOption }) {
  return (
    <div className="space-y-3">
      {q.options.map((opt, oIndex) => (
        <div key={oIndex} className={`flex items-center gap-3 p-3 rounded-xl border ${q.correct === oIndex ? 'border-accent bg-accent/5' : 'border-dark-border bg-dark-surface'}`}>
          <input 
            type="radio" 
            name={`correct-${q.id}`}
            checked={q.correct === oIndex}
            onChange={() => updateQuestion(q.id, 'correct', oIndex)}
            className="w-4 h-4 text-accent border-slate-600 focus:ring-accent focus:ring-offset-dark-surface bg-transparent"
          />
          <input 
            type="text" 
            value={opt}
            onChange={(e) => updateOption(q.id, oIndex, e.target.value)}
            placeholder={`Option ${oIndex + 1}`}
            className="flex-1 bg-transparent border-none outline-none text-sm text-white placeholder-slate-600 focus:ring-0"
          />
        </div>
      ))}
    </div>
  );
}
