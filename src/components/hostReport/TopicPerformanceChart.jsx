import { motion } from 'framer-motion';

export default function TopicPerformanceChart({ topics }) {
  return (
    <div className="mb-12">
      <h2 className="text-xl font-bold text-white mb-6">Topic Performance</h2>
      {topics.length === 0 ? (
        <div className="glass-card p-6 rounded-2xl text-slate-400">
          No topic data available yet. Waiting for students to finish...
        </div>
      ) : (
        <div className="glass-card p-6 rounded-2xl space-y-6">
          {topics.map((topic, idx) => (
            <div key={idx}>
              <div className="flex justify-between items-end mb-2">
                <span className="font-medium text-slate-300">{topic.name}</span>
                <span className={`text-sm font-bold ${topic.average < 50 ? 'text-error' : 'text-white'}`}>{topic.average}%</span>
              </div>
              <div className="w-full h-4 bg-dark-bg rounded-full overflow-hidden border border-dark-border">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${topic.average}%` }}
                  transition={{ duration: 1, delay: idx * 0.1 }}
                  className={`h-full rounded-full ${topic.average >= 70 ? 'bg-accent' : topic.average >= 50 ? 'bg-yellow-500' : 'bg-error'}`}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
