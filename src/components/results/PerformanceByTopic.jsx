import { motion } from 'framer-motion';

export default function PerformanceByTopic({ topics }) {
  return (
    <div>
      <h3 className="text-xl font-medium text-gray-900 mb-4" style={{ letterSpacing: '-0.5px' }}>Performance by Topic</h3>
      {topics.length === 0 ? (
        <p className="text-muted">No topic data available.</p>
      ) : (
        <div className="space-y-6" style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: 10, padding: '20px' }}>
          {topics.map((topic, idx) => {
            const percent = topic.total > 0 ? Math.round((topic.correct / topic.total) * 100) : 0;
            return (
              <div key={idx}>
                <div className="flex justify-between items-end mb-2">
                  <span className="font-medium text-gray-900">{topic.name}</span>
                  <span className="text-sm font-medium text-muted">{topic.correct} / {topic.total}</span>
                </div>
                <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden border border-gray-200">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percent}%` }}
                    transition={{ duration: 1, delay: idx * 0.1 }}
                    className={`h-full rounded-full ${percent >= 70 ? 'bg-teal' : percent >= 50 ? 'bg-amber-400' : 'bg-red-500'}`}
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
