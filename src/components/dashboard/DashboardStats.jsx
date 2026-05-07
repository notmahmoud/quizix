import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutDashboard, Users, Trophy } from 'lucide-react';

export default function DashboardStats({ stats }) {
  const cards = [
    { label: 'Total Hosted', value: `${stats.totalHosted}`, unit: 'quizzes', icon: LayoutDashboard, color: 'bg-primary-start/20', iconColor: 'text-primary-start', delay: 0 },
    { label: 'Total Students', value: `${stats.totalStudents}`, unit: 'reached', icon: Users, color: 'bg-accent/20', iconColor: 'text-accent', delay: 0.1 },
    { label: 'Avg. Personal Score', value: `${stats.averageScore}%`, unit: '', icon: Trophy, color: 'bg-yellow-500/20', iconColor: 'text-yellow-500', delay: 0.2 },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
      {cards.map((card) => (
        <motion.div
          key={card.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: card.delay }}
          className="interactive-card p-6 flex items-center gap-4"
        >
          <div className={`w-12 h-12 rounded-xl ${card.color} flex items-center justify-center`}>
            <card.icon className={`w-6 h-6 ${card.iconColor}`} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-400">{card.label}</p>
            <h3 className="text-2xl font-bold text-white">{card.value} <span className="text-sm font-normal text-slate-500">{card.unit}</span></h3>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
