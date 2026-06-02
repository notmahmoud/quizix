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
        <h1 className="text-3xl sm:text-4xl font-medium text-gray-900 mb-10 leading-tight text-center" style={{ letterSpacing: '-0.5px' }}>
          {question.text}
        </h1>

        <div className="space-y-4 mb-10">
          {options.map((opt, idx) => {
            const isSelected = answers[question.id] === idx;
            return (
              <button
                key={idx}
                onClick={() => onSelectAnswer(question.id, idx)}
                className={`w-full text-left p-5 rounded-xl border-2 transition-all duration-200 group cursor-pointer ${
                  isSelected
                    ? 'border-teal bg-teal-light'
                    : 'border-gray-200 bg-white hover:border-teal'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-medium text-sm flex-shrink-0 ${
                    isSelected ? 'bg-teal text-white' : 'bg-bg text-muted group-hover:bg-teal-light group-hover:text-teal'
                  }`}>
                    {String.fromCharCode(65 + idx)}
                  </div>
                  <span className={`text-lg font-medium ${isSelected ? 'text-teal' : 'text-gray-900'}`}>
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
            className="btn-primary flex items-center gap-2 px-10 py-4 text-lg disabled:opacity-40"
          >
            {isLast ? 'Submit Quiz' : 'Next Question'}
            {isLast ? <CheckCircle2 className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
