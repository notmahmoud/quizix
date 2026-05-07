import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';

export default function SessionHeader({ currentQuestionIndex, totalQuestions, timeLeft, globalTimeLeft, settings }) {
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;
  const hasPerQuestion = settings?.timePerQuestionEnabled || settings?.timePerQuestionToggle;

  return (
    <header className="border-b border-dark-border bg-dark-bg/80 backdrop-blur-lg sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="text-sm font-bold text-slate-400 tracking-widest uppercase">
          Question {currentQuestionIndex + 1} of {totalQuestions}
        </div>
        
        <div className="flex items-center gap-4">
          {settings?.globalTimerEnabled && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-dark-bg border border-primary-start/30 shadow-[0_0_15px_rgba(99,102,241,0.15)]">
              <Clock className={`w-4 h-4 ${globalTimeLeft <= 60 ? 'text-error animate-pulse' : 'text-primary-start'}`} />
              <span className={`font-mono font-bold text-sm ${globalTimeLeft <= 60 ? 'text-error' : 'text-primary-start'}`}>
                {Math.floor(globalTimeLeft / 60).toString().padStart(2, '0')}:{(globalTimeLeft % 60).toString().padStart(2, '0')}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 ml-1 hidden sm:block">Total</span>
            </div>
          )}
          
          {hasPerQuestion && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-dark-surface border border-dark-border">
              <Clock className={`w-4 h-4 ${timeLeft <= 5 ? 'text-error animate-pulse' : 'text-slate-400'}`} />
              <span className={`font-mono font-bold text-sm ${timeLeft <= 5 ? 'text-error' : 'text-slate-300'}`}>
                00:{timeLeft?.toString().padStart(2, '0')}
              </span>
            </div>
          )}
        </div>
      </div>
      
      <div className="w-full h-1 bg-dark-border">
        <motion.div 
          className="h-full bg-primary-start"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
    </header>
  );
}
