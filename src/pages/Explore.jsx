import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Users, ArrowRight, BookOpen, Loader2 } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { getPublicRooms } from '../lib/db';

export default function Explore() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('All');
  const [publicRooms, setPublicRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchRooms() {
      try {
        setIsLoading(true);
        const rooms = await getPublicRooms();
        setPublicRooms(rooms);
      } catch (error) {
        console.error("Failed to fetch public rooms:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchRooms();
  }, []);

  const allTags = ['All', ...new Set(publicRooms.flatMap(room => room.tags))].sort();
  const filteredRooms = publicRooms.filter(room => {
    const matchesSearch = room.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          room.creator.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTag = selectedTag === 'All' || room.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col" style={{ background: '#FAF9F7' }}>
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center gap-3">
          <Loader2 style={{ width: 28, height: 28, color: '#0D9488' }} className="animate-spin" />
          <p style={{ color: '#111827' }}>Finding public quizzes...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#FAF9F7' }}>
      <Navbar />
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8" style={{ padding: '64px 1rem' }}>

        {/* Header */}
        <div className="mb-10">
          <div className="max-w-xl mb-8">
            <h1 style={{ fontSize: '1.75rem', fontWeight: 500, color: '#111827', marginBottom: '0.5rem', letterSpacing: '-0.5px' }}>Explore Quizzes</h1>
            <p style={{ color: '#111827', lineHeight: 1.6 }}>Discover and join public quizzes created by the Quizix community.</p>
          </div>

          <div className="flex flex-col md:flex-row gap-3 max-w-2xl">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search style={{ height: 16, width: 16, color: '#111827' }} />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
                placeholder="Search by title..."
              />
            </div>
            <div className="w-full md:w-52 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Filter style={{ height: 15, width: 15, color: '#111827' }} />
              </div>
              <select
                value={selectedTag}
                onChange={(e) => setSelectedTag(e.target.value)}
                className="form-input appearance-none"
                style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem', color: '#111827' }}
              >
                {allTags.map(tag => (
                  <option key={tag} value={tag}>{tag}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <svg style={{ width: 14, height: 14, color: '#111827' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Results count */}
        <div className="mb-5">
          <p style={{ fontSize: '0.875rem', color: '#111827' }}>
            {filteredRooms.length} {filteredRooms.length === 1 ? 'result' : 'results'} found
          </p>
        </div>

        {filteredRooms.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRooms.map((room) => (
              <div key={room.id} className="card flex flex-col justify-between hover:border-teal transition-colors">
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-3 flex-wrap">
                    {room.tags.map(tag => (
                      <span key={tag} className="badge-ended" style={{ fontSize: '10px', padding: '2px 6px' }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: 500, color: '#111827', marginBottom: '0.5rem', lineHeight: 1.4 }}>
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
                    className="btn-secondary group flex items-center justify-center w-full"
                    style={{ padding: '10px 16px', fontSize: '0.875rem' }}
                  >
                    <span>Join Solo</span>
                    <ArrowRight style={{ width: 14, height: 14 }} className="ml-1.5 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card py-20 text-center max-w-3xl mx-auto">
            <Search style={{ width: 36, height: 36, color: '#9CA3AF', margin: '0 auto 1rem' }} />
            <h3 style={{ fontSize: '1.125rem', fontWeight: 500, color: '#111827', marginBottom: '0.5rem' }}>
              {publicRooms.length === 0 ? "No public rooms available" : "No quizzes found"}
            </h3>
            <p style={{ color: '#111827', fontSize: '0.9375rem' }}>
              {publicRooms.length === 0
                ? "There are currently no active public quizzes."
                : "We couldn't find any public rooms matching your criteria."}
            </p>
            {publicRooms.length > 0 && (
              <button
                onClick={() => { setSearchTerm(''); setSelectedTag('All'); }}
                className="btn-secondary mt-5"
              >
                Clear filters
              </button>
            )}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
