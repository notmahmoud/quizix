import { motion } from 'framer-motion';
import { Trophy, BarChart2 } from 'lucide-react';

export default function ResultsTabs({ activeTab, setActiveTab, isSoloAttempt, leaderboardEnabled }) {
  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart2 },
    (!isSoloAttempt && leaderboardEnabled) && { id: 'leaderboard', label: 'Leaderboard', icon: Trophy }
  ].filter(Boolean);

  return (
    <div className="flex border-b border-dark-border mb-8">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors relative ${
            activeTab === tab.id ? 'text-primary-start' : 'text-slate-400 hover:text-white'
          }`}
        >
          <tab.icon className="w-4 h-4" />
          {tab.label}
          {activeTab === tab.id && (
            <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-start" />
          )}
        </button>
      ))}
    </div>
  );
}
