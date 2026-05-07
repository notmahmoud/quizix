import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

export default function SubmittingOverlay() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="w-24 h-24 rounded-full bg-accent/20 text-accent flex items-center justify-center mb-6"
      >
        <CheckCircle2 className="w-12 h-12" />
      </motion.div>
      <h2 className="text-2xl font-bold text-white mb-2">Quiz Submitted!</h2>
      <p className="text-slate-400">Calculating your results...</p>
    </div>
  );
}
