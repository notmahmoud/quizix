import { Link } from 'react-router-dom';
import { History, ArrowRight } from 'lucide-react';

export default function JoinedRoomsList({ joinedRooms, currentUserId }) {
  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <History className="w-5 h-5 text-accent" />
          Recently Joined
        </h2>
      </div>
      <div className="space-y-4">
        {joinedRooms.length === 0 ? (
          <div className="glass-card p-8 rounded-xl text-center border-dashed">
            <p className="text-slate-400 mb-4">You haven't participated in any quizzes.</p>
            <Link to="/explore" className="text-primary-start hover:text-primary-end font-medium inline-flex items-center gap-1">
              Explore active rooms <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          joinedRooms.map((room) => (
            <Link key={room.id} to={`/room/${room.id}/results/${currentUserId}`}>
              <div className="interactive-card p-5 rounded-xl flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-bold text-white text-lg mb-1">{room.title}</h3>
                  <div className="text-sm text-slate-400">
                    Host: {room.host} • {new Date(room.date).toLocaleDateString()}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-slate-400 mb-1">Score</div>
                  <div className="text-xl font-bold text-accent">{room.score}%</div>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </section>
  );
}
