import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';

export default function SessionHeader({ currentQuestionIndex, totalQuestions, timeLeft, globalTimeLeft, settings }) {
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;
  const hasPerQuestion = settings?.timePerQuestionEnabled || settings?.timePerQuestionToggle;

  return (
    <header className="sticky top-0 z-50" style={{ background: '#FFFFFF', borderBottom: '1px solid #E5E7EB' }}>
      <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="text-sm font-medium text-muted tracking-widest uppercase">
          Question {currentQuestionIndex + 1} of {totalQuestions}
        </div>
        
        <div className="flex items-center gap-4">
          {settings?.globalTimerEnabled && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-gray-200">
              <Clock className={`w-4 h-4 ${globalTimeLeft <= 60 ? 'text-red-500 animate-pulse' : 'text-teal'}`} />
              <span className={`font-mono font-medium text-sm ${globalTimeLeft <= 60 ? 'text-red-500' : 'text-gray-900'}`}>
                {Math.floor(globalTimeLeft / 60).toString().padStart(2, '0')}:{(globalTimeLeft % 60).toString().padStart(2, '0')}
              </span>
              <span className="text-[10px] font-medium uppercase tracking-wider text-muted ml-1 hidden sm:block">Total</span>
            </div>
          )}
          
          {hasPerQuestion && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-gray-200">
              <Clock className={`w-4 h-4 ${timeLeft <= 5 ? 'text-red-500 animate-pulse' : 'text-muted'}`} />
              <span className={`font-mono font-medium text-sm ${timeLeft <= 5 ? 'text-red-500' : 'text-gray-900'}`}>
                00:{timeLeft?.toString().padStart(2, '0')}
              </span>
            </div>
          )}
        </div>
      </div>
      
      <div className="w-full h-1 bg-gray-100">
        <motion.div 
          className="h-full bg-teal"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
    </header>
  );
}
