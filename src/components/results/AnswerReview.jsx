import { Check, X } from 'lucide-react';

export default function AnswerReview({ review }) {
  return (
    <div>
      <h3 className="text-xl font-bold text-white mb-4">Answer Review</h3>
      <div className="space-y-4">
        {review.length === 0 ? (
          <p className="text-slate-400">No answers recorded for review.</p>
        ) : (
          review.map((q, idx) => (
            <div key={idx} className={`interactive-card p-6 rounded-2xl border-l-4 ${q.isCorrect ? 'border-l-emerald-500' : 'border-l-error'}`}>
              <div className="flex items-start gap-4">
                <div className={`mt-1 flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${q.isCorrect ? 'bg-emerald-500/20 text-emerald-400' : 'bg-error/20 text-error'}`}>
                  {q.isCorrect ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start gap-4 mb-3">
                    <h4 className="font-semibold text-white">{idx + 1}. {q.text}</h4>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded bg-dark-border text-slate-300 whitespace-nowrap">
                      {q.tag}
                    </span>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4 text-sm">
                    <div className={`p-3 rounded-lg border ${q.isCorrect ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-error/5 border-error/20'}`}>
                      <span className={`block mb-1 uppercase text-[10px] font-bold tracking-wider ${q.isCorrect ? 'text-emerald-500/70' : 'text-error/70'}`}>Your Answer</span>
                      <span className={`font-medium ${q.isCorrect ? 'text-emerald-400' : 'text-error'}`}>{q.studentAnswer}</span>
                    </div>
                    <div className="p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
                      <span className="text-emerald-500/70 block mb-1 uppercase text-[10px] font-bold tracking-wider">Correct Answer</span>
                      <span className="text-emerald-400 font-medium">{q.correctAnswer}</span>
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
