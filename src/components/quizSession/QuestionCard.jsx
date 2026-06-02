export default function QuestionCard({ question, questionIndex, answer, onAnswer, cardRef }) {
  const isAnswered = answer !== undefined;

  return (
    <div
      id={`question-${questionIndex}`}
      ref={cardRef}
      className="card scroll-mt-24 transition-all duration-200"
      style={{
        padding: '20px',
        borderColor: isAnswered ? '#0D9488' : '#E5E7EB',
        background: '#FFFFFF',
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-5">
        <div className="flex items-center gap-3">
          <span
            style={{
              width: 30, height: 30, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.8125rem', fontWeight: 500, flexShrink: 0,
              background: isAnswered ? '#E6FAF8' : '#FAF9F7',
              color: isAnswered ? '#0D9488' : '#4B5563',
              border: isAnswered ? '1px solid #0D9488' : '1px solid #E5E7EB',
            }}
          >
            {questionIndex + 1}
          </span>
          <h3 style={{ color: '#111827', fontWeight: 500, lineHeight: 1.5, fontSize: '1rem' }}>{question.text}</h3>
        </div>
        {question.tag && (
          <span className="badge-ended shrink-0" style={{ whiteSpace: 'nowrap', padding: '2px 6px', fontSize: '10px' }}>
            {question.tag}
          </span>
        )}
      </div>

      {/* MCQ */}
      {question.type === 'MCQ' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {(question.options || []).map((opt, idx) => {
            const isSelected = answer === idx;
            return (
              <button
                key={idx}
                onClick={() => onAnswer(question.id, idx)}
                style={{
                  width: '100%', textAlign: 'left', padding: '12px 16px', borderRadius: 8,
                  border: isSelected ? '1px solid #0D9488' : '1px solid #E5E7EB',
                  background: isSelected ? '#E6FAF8' : '#FFFFFF',
                  display: 'flex', alignItems: 'center', gap: 12,
                  cursor: 'pointer', transition: 'all 150ms ease',
                }}
                onMouseEnter={e => { if (!isSelected) e.currentTarget.style.borderColor = '#0D9488'; }}
                onMouseLeave={e => { if (!isSelected) e.currentTarget.style.borderColor = '#E5E7EB'; }}
              >
                <div style={{
                  width: 28, height: 28, borderRadius: 6, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: isSelected ? '#0D9488' : '#FAF9F7',
                  color: isSelected ? '#FFFFFF' : '#4B5563',
                  fontSize: '0.8125rem', fontWeight: 500,
                }}>
                  {String.fromCharCode(65 + idx)}
                </div>
                <span style={{ color: isSelected ? '#0D9488' : '#111827', fontWeight: isSelected ? 500 : 400, fontSize: '0.9375rem' }}>
                  {opt}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* True/False */}
      {question.type === 'TF' && (
        <div style={{ display: 'flex', gap: 12 }}>
          {['True', 'False'].map((opt, idx) => {
            const isSelected = answer === idx;
            return (
              <button
                key={idx}
                onClick={() => onAnswer(question.id, idx)}
                style={{
                  flex: 1, padding: '14px', borderRadius: 8, fontWeight: 500, fontSize: '1rem',
                  border: isSelected ? '1px solid #0D9488' : '1px solid #E5E7EB',
                  background: isSelected ? '#E6FAF8' : '#FFFFFF',
                  color: isSelected ? '#0D9488' : '#4B5563',
                  cursor: 'pointer', transition: 'all 150ms ease',
                }}
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
          className="form-input"
          style={{ resize: 'none' }}
        />
      )}
    </div>
  );
}
