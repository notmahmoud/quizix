export default function TrueFalseOptions({ q, updateQuestion }) {
  return (
    <div className="flex gap-4">
      {['True', 'False'].map((val, idx) => (
        <button
          key={val}
          onClick={() => updateQuestion(q.id, 'correct', idx)}
          className={`flex-1 py-3 rounded-xl border font-medium text-sm transition-colors ${q.correct === idx ? 'border-teal bg-teal-light text-teal' : 'border-gray-200 bg-white text-muted hover:border-teal'}`}
        >
          {val}
        </button>
      ))}
    </div>
  );
}
