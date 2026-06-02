import { motion } from 'framer-motion';
import { LayoutDashboard, Users, Trophy } from 'lucide-react';

export default function DashboardStats({ stats }) {
  const cards = [
    { label: 'Total Hosted', value: stats.totalHosted, unit: 'quizzes', icon: LayoutDashboard, iconBg: '#E6FAF8', iconColor: '#0D9488', delay: 0 },
    { label: 'Total Students', value: stats.totalStudents, unit: 'reached', icon: Users, iconBg: '#E6FAF8', iconColor: '#0D9488', delay: 0.05 },
    { label: 'Avg. Personal Score', value: `${stats.averageScore}%`, unit: '', icon: Trophy, iconBg: '#FFFBEB', iconColor: '#F59E0B', delay: 0.1 },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      {cards.map((card) => (
        <motion.div
          key={card.label}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: card.delay }}
          className="card flex items-center gap-4"
          style={{ padding: '20px', background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '10px' }}
        >
          <div style={{ width: 44, height: 44, borderRadius: 8, background: card.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <card.icon style={{ width: 22, height: 22, color: card.iconColor }} />
          </div>
          <div>
            <p style={{ fontSize: '0.8125rem', color: '#4B5563', marginBottom: 2 }}>{card.label}</p>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 500, color: '#111827' }}>
              {card.value}{' '}
              {card.unit && <span style={{ fontSize: '0.875rem', fontWeight: 450, color: '#4B5563' }}>{card.unit}</span>}
            </h3>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
