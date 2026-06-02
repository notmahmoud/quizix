import { motion } from 'framer-motion';
import { CheckCircle2, Loader2 } from 'lucide-react';

export default function SubmittingOverlay() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center" style={{ background: '#FAF9F7' }}>
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', bounce: 0.4 }}
        className="w-24 h-24 rounded-full bg-teal-light flex items-center justify-center mb-6"
        style={{ border: '1px solid #0D9488' }}
      >
        <CheckCircle2 className="w-12 h-12 text-teal" />
      </motion.div>
      <h2 className="text-2xl font-medium text-gray-900 mb-2" style={{ letterSpacing: '-0.5px' }}>Quiz Submitted!</h2>
      <p className="text-muted">Calculating your results...</p>
    </div>
  );
}
