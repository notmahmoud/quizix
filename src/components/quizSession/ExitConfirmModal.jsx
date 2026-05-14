import { motion, AnimatePresence } from 'framer-motion';

export default function ExitConfirmModal({ show, onConfirm, onCancel }) {
  return (
    <AnimatePresence>
      {show && (
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
            <div className="w-14 h-14 rounded-full bg-error/10 border border-error/20 flex items-center justify-center mx-auto mb-5">
              <span className="text-2xl text-error">🚪</span>
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Leave Quiz?</h2>
            <p className="text-slate-400 mb-8">
              Are you sure you want to exit? Your progress will be lost and you will have to start over.
            </p>
            <div className="flex gap-3">
              <button onClick={onCancel} className="flex-1 btn-secondary py-3">
                Stay
              </button>
              <button onClick={onConfirm} className="flex-1 bg-error hover:bg-error/90 text-white font-medium rounded-xl py-3 transition-colors">
                Leave
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
