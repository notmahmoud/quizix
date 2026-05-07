import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';

export default function RemedialAlert({ weakTopics, onStartRemedial }) {
  return (
    <AnimatePresence>
      {weakTopics.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mb-8 overflow-hidden"
        >
          <div className="bg-error/10 border border-error/20 p-4 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3 text-error">
              <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold">Attention Required</h4>
                <p className="text-sm">The class average for <span className="font-bold">"{weakTopics[0].name}"</span> is {weakTopics[0].average}%. Would you like to create a remedial session for students who struggled?</p>
              </div>
            </div>
            <button 
              onClick={() => onStartRemedial(weakTopics[0].name)}
              className="whitespace-nowrap px-4 py-2 bg-error text-white rounded-lg text-sm font-bold shadow-lg hover:bg-error/80 transition-colors"
            >
              Start New Session
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
