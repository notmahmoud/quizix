import { Link } from 'react-router-dom';
import { History, ArrowRight } from 'lucide-react';

export default function JoinedRoomsList({ joinedRooms, currentUserId }) {
  return (
    <section>
      <div className="flex items-center gap-2 mb-4">
        <History style={{ width: 16, height: 16, color: '#4B5563' }} />
        <h2 style={{ fontSize: '1rem', fontWeight: 500, color: '#111827' }}>Recently Joined</h2>
      </div>
      <div className="space-y-3">
        {joinedRooms.length === 0 ? (
          <div className="card text-center" style={{ borderStyle: 'dashed', padding: '20px' }}>
            <p style={{ color: '#4B5563', marginBottom: '0.75rem' }}>You haven't participated in any quizzes.</p>
            <Link to="/explore" className="inline-flex items-center gap-1 text-sm font-medium hover:text-teal-hover" style={{ color: '#0D9488' }}>
              Explore active rooms <ArrowRight style={{ width: 13, height: 13 }} />
            </Link>
          </div>
        ) : (
          joinedRooms.map((room) => (
            <Link key={room.id} to={`/room/${room.id}/results/${currentUserId}`} className="block">
              <div className="interactive-card flex items-center justify-between" style={{ padding: '20px' }}>
                <div>
                  <h3 style={{ fontWeight: 500, color: '#111827', marginBottom: 2 }}>{room.title}</h3>
                  <div style={{ fontSize: '0.8125rem', color: '#4B5563' }}>
                    Host: {room.host} • {new Date(room.date).toLocaleDateString()}
                  </div>
                </div>
                <div className="text-right">
                  <div style={{ fontSize: '0.8125rem', color: '#4B5563', marginBottom: 2 }}>Score</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 600, color: '#0D9488' }}>{room.score}%</div>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </section>
  );
}
