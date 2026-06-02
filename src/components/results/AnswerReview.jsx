import { Check, X } from 'lucide-react';

export default function AnswerReview({ review }) {
  return (
    <div>
      <h3 className="text-xl font-medium text-gray-900 mb-4" style={{ letterSpacing: '-0.5px' }}>Answer Review</h3>
      <div className="space-y-4">
        {review.length === 0 ? (
          <p className="text-muted">No answers recorded for review.</p>
        ) : (
          review.map((q, idx) => (
            <div
              key={idx}
              style={{
                background: '#FFFFFF',
                border: '1px solid #E5E7EB',
                borderRadius: 10,
                borderLeft: `4px solid ${q.isCorrect ? '#0D9488' : '#EF4444'}`,
                padding: '20px',
              }}
            >
              <div className="flex items-start gap-4">
                <div className={`mt-1 flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${q.isCorrect ? 'bg-teal-light text-teal' : 'bg-red-100 text-red-700'}`}>
                  {q.isCorrect ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-4 mb-3">
                    <h4 className="font-medium text-gray-900">{idx + 1}. {q.text}</h4>
                    <span className="badge-ended text-[10px] font-medium uppercase tracking-wider px-2 py-0.5 whitespace-nowrap">
                      {q.tag}
                    </span>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4 text-sm">
                    <div className={`p-3 rounded-lg border ${q.isCorrect ? 'bg-teal-light/40 border-teal/20' : 'bg-red-50/30 border-red-200'}`}>
                      <span className={`block mb-1 uppercase text-[10px] font-medium tracking-wider ${q.isCorrect ? 'text-teal' : 'text-red-700'}`}>Your Answer</span>
                      <span className={`font-medium ${q.isCorrect ? 'text-teal' : 'text-red-800'}`}>{q.studentAnswer}</span>
                    </div>
                    <div className="p-3 rounded-lg bg-teal-light/40 border border-teal/20">
                      <span className="text-teal block mb-1 uppercase text-[10px] font-medium tracking-wider">Correct Answer</span>
                      <span className="text-teal font-medium">{q.correctAnswer}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
