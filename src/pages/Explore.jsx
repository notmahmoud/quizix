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

  // Extract all unique tags
  const allTags = ['All', ...new Set(publicRooms.flatMap(room => room.tags))].sort();

  // Filter rooms
  const filteredRooms = publicRooms.filter(room => {
    const matchesSearch = room.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          room.creator.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTag = selectedTag === 'All' || room.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-dark-bg">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <Loader2 className="w-8 h-8 text-primary-start animate-spin" />
          <p className="text-slate-400">Finding public quizzes...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Header & Search */}
        <div className="mb-12">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h1 className="text-4xl font-extrabold text-white mb-4">Explore Quizzes</h1>
            <p className="text-lg text-slate-400">Discover and join thousands of public quizzes created by the Quizix community.</p>
          </div>

          <div className="flex flex-col md:flex-row gap-4 max-w-4xl mx-auto">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-500" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-dark-surface border border-dark-border rounded-xl focus:ring-2 focus:ring-primary-start/50 focus:border-primary-start outline-none transition-all text-white shadow-lg"
                placeholder="Search by title or creator..."
              />
            </div>
            <div className="w-full md:w-64 relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Filter className="h-5 w-5 text-slate-500" />
              </div>
              <select
                value={selectedTag}
                onChange={(e) => setSelectedTag(e.target.value)}
                className="w-full pl-12 pr-10 py-4 bg-dark-surface border border-dark-border rounded-xl focus:ring-2 focus:ring-primary-start/50 focus:border-primary-start outline-none transition-all text-white shadow-lg appearance-none"
              >
                {allTags.map(tag => (
                  <option key={tag} value={tag}>{tag}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </div>
        </div>

        {/* Results Grid */}
        <div className="mb-6 flex justify-between items-end">
          <h2 className="text-xl font-bold text-white">
            {filteredRooms.length} {filteredRooms.length === 1 ? 'result' : 'results'} found
          </h2>
        </div>

        {filteredRooms.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRooms.map(room => (
              <div key={room.id} className="interactive-card p-6 rounded-2xl flex flex-col group">
                <div className="flex gap-2 mb-4 flex-wrap">
                  {room.tags.map(tag => (
                    <span key={tag} className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded bg-dark-border text-slate-300">
                      {tag}
                    </span>
                  ))}
                </div>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary-start transition-colors line-clamp-2">
                  {room.title}
                </h3>
                
                <div className="flex items-center gap-2 mb-6 text-sm text-slate-400">
                  <div className="w-6 h-6 rounded-full bg-primary-start/20 flex items-center justify-center text-primary-start text-xs font-bold uppercase">
                    {room.creator.charAt(0).toUpperCase()}
                  </div>
                  <span>By {room.creator}</span>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                  <div className="flex items-center gap-2 text-slate-400">
                    <BookOpen className="w-4 h-4" /> {room.questions} Qs
                  </div>
                  <div className="flex items-center gap-2 text-slate-400">
                    <Users className="w-4 h-4" /> {room.joined.toLocaleString()}
                  </div>
                </div>

                <div className="mt-auto pt-4 border-t border-dark-border">
                  <Link to={`/room/${room.id}/quiz?solo=true`} className="w-full flex items-center justify-between text-primary-start font-bold group-hover:translate-x-1 transition-transform">
                    Join Solo <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center glass-card rounded-2xl">
            <Search className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">
              {publicRooms.length === 0 ? "No public rooms available" : "No quizzes found"}
            </h3>
            <p className="text-slate-400">
              {publicRooms.length === 0 
                ? "There are currently no active public quizzes." 
                : "We couldn't find any public rooms matching your criteria."}
            </p>
            {publicRooms.length > 0 && (
              <button 
                onClick={() => { setSearchTerm(''); setSelectedTag('All'); }}
                className="mt-6 btn-secondary"
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
