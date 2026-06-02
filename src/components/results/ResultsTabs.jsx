import { motion } from 'framer-motion';
import { Trophy, BarChart2 } from 'lucide-react';

export default function ResultsTabs({ activeTab, setActiveTab, isSoloAttempt, leaderboardEnabled }) {
  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart2 },
    (!isSoloAttempt && leaderboardEnabled) && { id: 'leaderboard', label: 'Leaderboard', icon: Trophy }
  ].filter(Boolean);

  return (
    <div className="flex border-b border-gray-200 mb-8">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors relative ${
            activeTab === tab.id ? 'text-teal' : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          <tab.icon className="w-4 h-4" />
          {tab.label}
          {activeTab === tab.id && (
            <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal" />
          )}
        </button>
      ))}
    </div>
  );
}
