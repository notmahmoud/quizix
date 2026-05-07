import { Link } from 'react-router-dom';
import { Users, ArrowRight, Activity } from 'lucide-react';

export default function HostedRoomsList({ activeRooms, pastRooms }) {
  return (
    <div className="space-y-10">
      {/* Currently Active Rooms */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="relative flex h-3 w-3 mr-1">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-accent"></span>
            </span>
            Currently Active Rooms
          </h2>
        </div>
        <div className="space-y-4">
          {activeRooms.length > 0 ? (
            activeRooms.map(room => (
              <div key={room.id} className="interactive-card p-5 rounded-xl border-accent/30 bg-accent/5">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-white text-lg mb-1">{room.title}</h3>
                    <p className="text-sm text-slate-400">Room Code: <span className="font-mono text-white tracking-widest">{room.id}</span></p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-bold uppercase tracking-wide">
                    {room.status === 'waiting' ? 'Waiting in Lobby' : 'In Progress'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-sm text-slate-300">
                    <Users className="w-4 h-4" /> {room.students || 0} joined
                  </div>
                  <Link to={`/room/${room.id}/host`} className="btn-primary py-2 px-4 text-sm flex items-center gap-2">
                    Manage Room <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="glass-card p-6 rounded-xl text-center border-dashed">
              <p className="text-slate-400 text-sm">No quizzes yet.</p>
            </div>
          )}
        </div>
      </section>

      {/* Past Hosted Rooms */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary-start" />
            Past Hosted Quizzes
          </h2>
        </div>
        <div className="space-y-4">
          {pastRooms.length === 0 ? (
            <div className="glass-card p-8 rounded-xl text-center border-dashed">
              <p className="text-slate-400 mb-4">No quizzes yet.</p>
            </div>
          ) : (
            pastRooms.map((room) => (
              <Link key={room.id} to={`/room/${room.id}/report`}>
                <div className="interactive-card p-5 rounded-xl flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-white text-lg mb-1">{room.title}</h3>
                    <div className="flex items-center gap-4 text-sm text-slate-400">
                      <span>{new Date(room.createdAt).toLocaleDateString()}</span>
                      <span className="flex items-center gap-1"><Users className="w-4 h-4" /> {room.students || 0}</span>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-accent/10 text-accent border border-accent/20 text-xs font-bold uppercase tracking-wide">
                    Finished
                  </span>
                </div>
              </Link>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
