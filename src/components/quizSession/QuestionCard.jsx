export default function QuestionCard({ question, questionIndex, answer, onAnswer, cardRef }) {
  const isAnswered = answer !== undefined;

  return (
    <div
      id={`question-${questionIndex}`}
      ref={cardRef}
      className={`interactive-card p-6 rounded-2xl border transition-all duration-200 scroll-mt-24
        ${isAnswered ? 'border-accent/30' : 'border-dark-border'}
      `}
    >
      {/* Question Header */}
      <div className="flex items-start justify-between gap-4 mb-5">
        <div className="flex items-center gap-3">
          <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0
            ${isAnswered ? 'bg-accent/20 text-accent' : 'bg-dark-bg text-slate-400'}`}
          >
            {questionIndex + 1}
          </span>
          <h3 className="text-white font-semibold leading-snug">{question.text}</h3>
        </div>
        {question.tag && (
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded bg-dark-bg border border-dark-border text-slate-400 whitespace-nowrap shrink-0">
            {question.tag}
          </span>
        )}
      </div>

      {/* MCQ Options */}
      {question.type === 'MCQ' && (
        <div className="space-y-3">
          {(question.options || []).map((opt, idx) => {
            const isSelected = answer === idx;
            return (
              <button
                key={idx}
                onClick={() => onAnswer(question.id, idx)}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-150 flex items-center gap-3 group
                  ${isSelected
                    ? 'border-primary-start bg-primary-start/10 shadow-[0_0_16px_rgba(99,102,241,0.12)]'
                    : 'border-dark-border bg-dark-surface hover:border-slate-500'
                  }`}
              >
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-sm font-bold shrink-0
                  ${isSelected ? 'bg-primary-start text-white' : 'bg-dark-bg text-slate-400 group-hover:bg-slate-700'}`}
                >
                  {String.fromCharCode(65 + idx)}
                </div>
                <span className={`font-medium ${isSelected ? 'text-white' : 'text-slate-300'}`}>{opt}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* True / False */}
      {question.type === 'TF' && (
        <div className="flex gap-4">
          {['True', 'False'].map((opt, idx) => {
            const isSelected = answer === idx;
            return (
              <button
                key={idx}
                onClick={() => onAnswer(question.id, idx)}
                className={`flex-1 py-4 rounded-xl border-2 font-bold text-lg transition-all duration-150
                  ${isSelected
                    ? 'border-primary-start bg-primary-start/10 text-white shadow-[0_0_16px_rgba(99,102,241,0.12)]'
                    : 'border-dark-border bg-dark-surface text-slate-400 hover:border-slate-500 hover:text-slate-200'
                  }`}
              >
                {opt}
              </button>
            );
          })}
        </div>
      )}

      {/* Long Answer */}
      {question.type === 'LONG' && (
        <textarea
          rows={4}
          value={answer ?? ''}
          onChange={e => onAnswer(question.id, e.target.value)}
          placeholder="Type your answer here..."
          className="w-full bg-dark-bg border border-dark-border rounded-xl p-4 text-slate-300 placeholder-slate-600 focus:outline-none focus:border-primary-start/50 resize-none transition-colors"
        />
      )}
    </div>
  );
}
