import { motion } from 'framer-motion';

export default function TopicPerformanceChart({ topics }) {
  return (
    <div className="mb-12">
      <h2 className="text-xl font-medium text-gray-900 mb-6 letter-spacing[-0.5px]">Topic Performance</h2>
      {topics.length === 0 ? (
        <div className="card text-muted" style={{ padding: '20px', background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: 10 }}>
          No topic data available yet. Waiting for students to finish...
        </div>
      ) : (
        <div className="card space-y-6" style={{ padding: '20px', background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: 10 }}>
          {topics.map((topic, idx) => (
            <div key={idx}>
              <div className="flex justify-between items-end mb-2">
                <span className="font-medium text-gray-900">{topic.name}</span>
                <span className={`text-sm font-medium ${topic.average < 50 ? 'text-red-600' : 'text-gray-900'}`}>{topic.average}%</span>
              </div>
              <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden border border-gray-200">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${topic.average}%` }}
                  transition={{ duration: 1, delay: idx * 0.1 }}
                  className={`h-full rounded-full ${topic.average >= 70 ? 'bg-teal' : topic.average >= 50 ? 'bg-amber-400' : 'bg-red-500'}`}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
