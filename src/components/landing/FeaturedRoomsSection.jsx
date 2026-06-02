import { Link } from 'react-router-dom';
import { ArrowRight, Loader2, BookOpen, Users } from 'lucide-react';

export default function FeaturedRoomsSection({ featuredRooms, isLoading }) {
  return (
    <section style={{ padding: '96px 0', borderBottom: '1px solid #E5E7EB', background: '#FFFFFF' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 500, color: '#111827', marginBottom: '0.375rem', letterSpacing: '-0.5px' }}>Featured Rooms</h2>
            <p style={{ color: '#111827', fontSize: '0.9375rem' }}>Join active public quizzes happening right now.</p>
          </div>
          <Link
            to="/explore"
            className="flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-teal-hover"
            style={{ color: '#0D9488' }}
          >
            View all <ArrowRight style={{ width: 14, height: 14 }} />
          </Link>
        </div>

        {/* Card Layout */}
        {isLoading ? (
          <div className="flex justify-center py-10">
            <Loader2 style={{ width: 28, height: 28, color: '#0D9488' }} className="animate-spin" />
          </div>
        ) : featuredRooms.length === 0 ? (
          <div className="card p-10 text-center max-w-3xl mx-auto" style={{ borderStyle: 'dashed' }}>
            <p style={{ color: '#111827' }}>No public rooms available right now. Be the first to host one!</p>
            <Link to="/create" className="btn-primary inline-flex mt-5">Host a Quiz</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredRooms.slice(0, 4).map((room) => (
              <div key={room.id} className="card flex flex-col justify-between hover:border-teal transition-colors group">
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-3 flex-wrap">
                    {room.tags.slice(0, 2).map(tag => (
                      <span key={tag} className="badge-ended" style={{ fontSize: '10px', padding: '2px 6px' }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: 500, color: '#111827', marginBottom: '0.5rem' }} className="group-hover:text-teal transition-colors">
                    {room.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-3 text-sm" style={{ color: '#111827' }}>
                    <span className="flex items-center gap-1"><BookOpen style={{ width: 13, height: 13 }} /> {room.questions} Qs</span>
                    <span style={{ color: '#E5E7EB' }}>•</span>
                    <span className="flex items-center gap-1"><Users style={{ width: 13, height: 13 }} /> {room.joined.toLocaleString()} joined</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end">
                  <Link
                    to={`/room/${room.id}/quiz?solo=true`}
                    className="flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-teal-hover w-full justify-center"
                    style={{ color: '#0D9488', padding: '8px 0' }}
                  >
                    Join Quiz <ArrowRight style={{ width: 14, height: 14 }} className="group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
