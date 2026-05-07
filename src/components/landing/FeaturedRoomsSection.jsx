import { Link } from 'react-router-dom';
import { ArrowRight, Users, Loader2 } from 'lucide-react';

export default function FeaturedRoomsSection({ featuredRooms, isLoading }) {
  return (
    <section className="py-24 border-t border-dark-border/50 bg-dark-surface/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-bold mb-2">Featured Rooms</h2>
            <p className="text-slate-400">Join active public quizzes happening right now.</p>
          </div>
          <Link to="/explore" className="hidden sm:flex items-center gap-2 text-primary-start hover:text-primary-end font-medium transition-colors">
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="w-8 h-8 text-primary-start animate-spin" />
          </div>
        ) : featuredRooms.length === 0 ? (
          <div className="glass-card p-10 rounded-2xl text-center border-dashed">
            <p className="text-slate-400">No public rooms available right now. Be the first to host one!</p>
            <Link to="/create" className="btn-primary inline-flex mt-6">Host a Quiz</Link>
          </div>
        ) : (
          <div className="flex overflow-x-auto pb-8 -mx-4 px-4 sm:mx-0 sm:px-0 gap-6 snap-x hide-scrollbar">
            {featuredRooms.map((room) => (
              <Link to={`/room/${room.id}/quiz?solo=true`} key={room.id} className="snap-start shrink-0 w-[300px] interactive-card p-6 rounded-2xl flex flex-col group cursor-pointer block">
                <div className="flex flex-wrap gap-2 mb-4">
                  {room.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-dark-border text-slate-300">
                      {tag}
                    </span>
                  ))}
                  {room.tags.length > 3 && (
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-dark-bg border border-dark-border text-slate-400">
                      +{room.tags.length - 3} more
                    </span>
                  )}
                </div>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary-start transition-colors line-clamp-2">
                  {room.title}
                </h3>
                <div className="text-sm text-slate-400 mb-6 flex-1">
                  By {room.creator} • {room.questions} Qs
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-dark-border">
                  <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                    <Users className="w-3.5 h-3.5" />
                    {room.joined.toLocaleString()} joined
                  </div>
                  <div className="flex items-center gap-1 text-xs font-bold text-primary-start group-hover:translate-x-1 transition-transform">
                    Join <ArrowRight className="w-3 h-3" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
