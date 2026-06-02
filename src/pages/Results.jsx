import { Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import useResults from '../hooks/useResults';
import ResultsHeader from '../components/results/ResultsHeader';
import ResultsTabs from '../components/results/ResultsTabs';
import PerformanceByTopic from '../components/results/PerformanceByTopic';
import AnswerReview from '../components/results/AnswerReview';
import LeaderboardTable from '../components/results/LeaderboardTable';

export default function Results() {
  const { code, uid, isSoloAttempt, activeTab, setActiveTab, roomData, result } = useResults();

  if (!roomData) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#FAF9F7' }}>
        <Loader2 className="w-8 h-8 text-teal animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#FAF9F7' }}>
      <Navbar />
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <ResultsHeader score={result.score} code={code} />
        <ResultsTabs
          activeTab={activeTab} setActiveTab={setActiveTab}
          isSoloAttempt={isSoloAttempt}
          leaderboardEnabled={roomData.settings?.leaderboardEnabled === true}
        />

        <div className="mb-12">
          {activeTab === 'overview' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12">
              <PerformanceByTopic topics={result.topics} />
              <AnswerReview review={result.review} />
            </motion.div>
          )}
          {activeTab === 'leaderboard' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <LeaderboardTable
                leaderboard={result.leaderboard}
                uid={uid}
                leaderboardEnabled={roomData.settings?.leaderboardEnabled !== false}
              />
            </motion.div>
          )}
        </div>

        <div className="flex justify-center">
          <Link to="/dashboard" className="btn-secondary flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
