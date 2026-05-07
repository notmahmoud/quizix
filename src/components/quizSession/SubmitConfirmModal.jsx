import { motion, AnimatePresence } from 'framer-motion';

export default function SubmitConfirmModal({ unansweredCount, onConfirm, onCancel }) {
  return (
    <AnimatePresence>
      {unansweredCount !== null && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onCancel} />
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            className="relative bg-dark-bg border border-dark-border rounded-2xl p-8 max-w-sm w-full shadow-2xl text-center"
          >
            <div className="w-14 h-14 rounded-full bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center mx-auto mb-5">
              <span className="text-2xl">⚠️</span>
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Submit Quiz?</h2>
            <p className="text-slate-400 mb-8">
              You have <span className="text-white font-bold">{unansweredCount}</span> unanswered question{unansweredCount > 1 ? 's' : ''}. Submit anyway?
            </p>
            <div className="flex gap-3">
              <button onClick={onCancel} className="flex-1 btn-secondary py-3">
                Go Back
              </button>
              <button onClick={onConfirm} className="flex-1 btn-primary py-3">
                Submit
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
