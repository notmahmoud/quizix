import { motion, AnimatePresence } from 'framer-motion';

export default function ExitConfirmModal({ show, onConfirm, onCancel }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.25)' }} onClick={onCancel} />
          <motion.div
            initial={{ scale: 0.96, opacity: 0, y: 12 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.96, opacity: 0, y: 12 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            className="card relative text-center"
            style={{ maxWidth: 380, width: '100%', padding: '2rem' }}
          >
            <div style={{ width: 52, height: 52, borderRadius: '50%', background: '#FEF2F2', border: '1px solid #FECACA', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
              <span style={{ fontSize: '1.5rem' }}>🚪</span>
            </div>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#111827', marginBottom: '0.5rem' }}>Leave Quiz?</h2>
            <p style={{ color: '#4B5563', fontSize: '0.9375rem', marginBottom: '1.75rem', lineHeight: 1.6 }}>
              Are you sure you want to exit? Your progress will be lost and you will have to start over.
            </p>
            <div className="flex gap-3">
              <button onClick={onCancel} className="btn-secondary flex-1 justify-center" style={{ padding: '10px' }}>Stay</button>
              <button
                onClick={onConfirm}
                style={{ flex: 1, background: '#EF4444', color: '#fff', border: 'none', borderRadius: 7, padding: '10px', fontWeight: 500, cursor: 'pointer', fontSize: '0.9375rem', transition: 'background 150ms' }}
              >
                Leave
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
