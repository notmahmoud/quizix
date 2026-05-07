import { motion, AnimatePresence } from 'framer-motion';

export default function TimeWarningToast({ show }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-error/10 border border-error/40 text-error font-bold px-6 py-3 rounded-2xl shadow-xl backdrop-blur-sm flex items-center gap-3 text-sm"
        >
          <span className="text-base animate-pulse">⏰</span>
          Time's up! Submitting your answers...
        </motion.div>
      )}
    </AnimatePresence>
  );
}
