import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

export default function QuestionSlide({ question, answers, onSelectAnswer, onNext, isLast }) {
  const options = question.type === 'TF' ? ['True', 'False'] : question.options;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={question.id}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="flex-1 flex flex-col"
      >
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-10 leading-tight text-center">
          {question.text}
        </h1>

        <div className="space-y-4 mb-10">
          {options.map((opt, idx) => {
            const isSelected = answers[question.id] === idx;
            return (
              <button
                key={idx}
                onClick={() => onSelectAnswer(question.id, idx)}
                className={`w-full text-left p-6 rounded-2xl border-2 transition-all duration-200 group relative overflow-hidden
                  ${isSelected 
                    ? 'border-primary-start bg-primary-start/10 shadow-[0_0_20px_rgba(99,102,241,0.15)]' 
                    : 'border-dark-border bg-dark-surface hover:border-slate-500'
                  }
                `}
              >
                <div className="flex items-center gap-4 relative z-10">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm
                    ${isSelected ? 'bg-primary-start text-white' : 'bg-dark-bg text-slate-400 group-hover:bg-slate-700'}
                  `}>
                    {String.fromCharCode(65 + idx)}
                  </div>
                  <span className={`text-lg font-medium ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                    {opt}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-auto flex justify-end">
          <button
            onClick={onNext}
            disabled={answers[question.id] === undefined}
            className="btn-primary flex items-center gap-2 px-10 py-4 text-lg"
          >
            {isLast ? 'Submit Quiz' : 'Next Question'}
            {isLast ? <CheckCircle2 className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
