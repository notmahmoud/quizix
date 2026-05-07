import { motion } from 'framer-motion';

export default function PerformanceByTopic({ topics }) {
  return (
    <div>
      <h3 className="text-xl font-bold text-white mb-4">Performance by Topic</h3>
      {topics.length === 0 ? (
        <p className="text-slate-400">No topic data available.</p>
      ) : (
        <div className="glass-card p-6 rounded-2xl space-y-6">
          {topics.map((topic, idx) => {
            const percent = topic.total > 0 ? Math.round((topic.correct / topic.total) * 100) : 0;
            return (
              <div key={idx}>
                <div className="flex justify-between items-end mb-2">
                  <span className="font-medium text-slate-300">{topic.name}</span>
                  <span className="text-sm font-bold text-white">{topic.correct} / {topic.total}</span>
                </div>
                <div className="w-full h-3 bg-dark-bg rounded-full overflow-hidden border border-dark-border">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${percent}%` }}
                    transition={{ duration: 1, delay: idx * 0.1 }}
                    className={`h-full rounded-full ${percent >= 70 ? 'bg-emerald-500' : percent >= 50 ? 'bg-yellow-500' : 'bg-error'}`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
