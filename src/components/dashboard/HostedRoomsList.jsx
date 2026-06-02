import { Link } from 'react-router-dom';
import { Users, ArrowRight, Activity } from 'lucide-react';

export default function HostedRoomsList({ activeRooms, pastRooms }) {
  return (
    <div className="space-y-8">
      {/* Active Rooms */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#0D9488', display: 'inline-block' }} className="animate-pulse" />
          <h2 style={{ fontSize: '1rem', fontWeight: 500, color: '#111827' }}>Currently Active Rooms</h2>
        </div>
        <div className="space-y-3">
          {activeRooms.length > 0 ? (
            activeRooms.map(room => (
              <div key={room.id} className="card" style={{ borderColor: '#0D9488', padding: '20px' }}>
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 style={{ fontWeight: 500, color: '#111827', marginBottom: 2 }}>{room.title}</h3>
                    <p style={{ fontSize: '0.8125rem', color: '#4B5563' }}>
                      Room Code: <span style={{ fontFamily: 'monospace', fontWeight: 600, color: '#111827', letterSpacing: '0.1em' }}>{room.id}</span>
                    </p>
                  </div>
                  <span className="badge-active">
                    {room.status === 'waiting' ? 'In Lobby' : 'In Progress'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5" style={{ fontSize: '0.875rem', color: '#4B5563' }}>
                    <Users style={{ width: 14, height: 14 }} /> {room.students || 0} joined
                  </div>
                  <Link to={`/room/${room.id}/host`} className="btn-primary flex items-center gap-1.5" style={{ padding: '6px 14px', fontSize: '0.875rem' }}>
                    Manage <ArrowRight style={{ width: 13, height: 13 }} />
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="card text-center" style={{ borderStyle: 'dashed', padding: '20px' }}>
              <p style={{ color: '#4B5563', fontSize: '0.9375rem' }}>No active rooms right now.</p>
            </div>
          )}
        </div>
      </section>

      {/* Past Rooms */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Activity style={{ width: 16, height: 16, color: '#4B5563' }} />
          <h2 style={{ fontSize: '1rem', fontWeight: 500, color: '#111827' }}>Past Hosted Quizzes</h2>
        </div>
        <div className="space-y-3">
          {pastRooms.length === 0 ? (
            <div className="card text-center" style={{ borderStyle: 'dashed', padding: '20px' }}>
              <p style={{ color: '#4B5563' }}>No quizzes hosted yet.</p>
            </div>
          ) : (
            pastRooms.map((room) => (
              <Link key={room.id} to={`/room/${room.id}/report`} className="block">
                <div className="interactive-card flex items-center justify-between" style={{ padding: '20px' }}>
                  <div>
                    <h3 style={{ fontWeight: 500, color: '#111827', marginBottom: 2 }}>{room.title}</h3>
                    <div className="flex items-center gap-3" style={{ fontSize: '0.8125rem', color: '#4B5563' }}>
                      <span>{new Date(room.createdAt).toLocaleDateString()}</span>
                      <span className="flex items-center gap-1"><Users style={{ width: 12, height: 12 }} /> {room.students || 0}</span>
                    </div>
                  </div>
                  <span className="badge-ended">Finished</span>
                </div>
              </Link>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
