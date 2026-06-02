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
      <div className="min-h-screen flex items-center justify-center flex-col gap-3" style={{ background: '#FAF9F7' }}>
        <Loader2 style={{ width: 28, height: 28, color: '#0D9488' }} className="animate-spin" />
        <p style={{ color: '#4B5563', fontSize: '0.9375rem' }}>Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#FAF9F7' }}>
      <Navbar />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8" style={{ padding: '40px 1rem' }}>
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 500, color: '#111827', marginBottom: '0.25rem' }}>
              Welcome back, {displayName}
            </h1>
            <p style={{ color: '#4B5563', fontSize: '0.9375rem' }}>Here's what's happening with your quizzes today.</p>
          </div>
          <Link to="/create" className="btn-primary flex items-center justify-center gap-2">
            <Plus style={{ width: 16, height: 16 }} /> Create New Quiz
          </Link>
        </div>

        <DashboardStats stats={stats} />

        <div className="grid lg:grid-cols-2 gap-8">
          <HostedRoomsList activeRooms={activeRooms} pastRooms={pastRooms} />
          <JoinedRoomsList joinedRooms={joinedRooms} currentUserId={currentUser?.uid} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
