import { motion } from 'framer-motion';

export default function ResultsHeader({ score, code }) {
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="text-center mb-10">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', bounce: 0.5 }}
        className="inline-block relative mb-6"
      >
        <svg className="w-40 h-40 transform -rotate-90">
          <circle
            cx="80"
            cy="80"
            r={radius}
            className="stroke-gray-200"
            strokeWidth="10"
            fill="none"
          />
          <motion.circle
            cx="80"
            cy="80"
            r={radius}
            className={score >= 70 ? "stroke-teal" : score >= 50 ? "stroke-amber-400" : "stroke-red-500"}
            strokeWidth="10"
            fill="none"
            strokeLinecap="round"
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            style={{ strokeDasharray: circumference }}
          />
        </svg>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
          <span className="text-4xl font-semibold text-gray-900">{score}%</span>
        </div>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-medium text-gray-900 mb-2 letter-spacing[-0.5px]"
      >
        {score >= 80 ? 'Excellent work!' : score >= 50 ? 'Good effort!' : 'Needs more practice'}
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-muted"
      >
        You completed the quiz in Room <span className="font-mono font-semibold text-teal">{code}</span>
      </motion.p>
    </div>
  );
}
