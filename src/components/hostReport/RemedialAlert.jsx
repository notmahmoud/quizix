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
          <div className="bg-red-50 border border-red-200 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4" style={{ padding: '20px' }}>
            <div className="flex items-start gap-3 text-red-800">
              <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5 text-red-600" />
              <div>
                <h4 className="font-medium text-red-950">Attention Required</h4>
                <p className="text-sm text-red-800 mt-0.5">
                  The class average for <span className="font-medium text-red-950">"{weakTopics[0].name}"</span> is {weakTopics[0].average}%. Would you like to create a remedial session for students who struggled?
                </p>
              </div>
            </div>
            <button
              onClick={() => onStartRemedial(weakTopics[0].name)}
              className="whitespace-nowrap px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors cursor-pointer"
            >
              Start New Session
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
