import { Link } from 'react-router-dom';
import { Plus, Loader2 } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import useDashboard from '../hooks/useDashboard';
import DashboardStats from '../components/dashboard/DashboardStats';
import HostedRoomsList from '../components/dashboard/HostedRoomsList';
import JoinedRoomsList from '../components/dashboard/JoinedRoomsList';

export default function Dashboard() {
  const { currentUser, isLoading, displayName, stats, activeRooms, pastRooms, joinedRooms } = useDashboard();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center flex-col gap-4">
        <Loader2 className="w-8 h-8 text-primary-start animate-spin" />
        <p className="text-slate-400">Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Welcome back, {displayName}!</h1>
            <p className="text-slate-400">Here's what's happening with your quizzes today.</p>
          </div>
          <Link to="/create" className="btn-primary flex items-center justify-center gap-2 px-6">
            <Plus className="w-5 h-5" /> Create New Quiz
          </Link>
        </div>

        <DashboardStats stats={stats} />

        <div className="grid lg:grid-cols-2 gap-10">
          <HostedRoomsList activeRooms={activeRooms} pastRooms={pastRooms} />
          <JoinedRoomsList joinedRooms={joinedRooms} currentUserId={currentUser?.uid} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
