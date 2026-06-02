import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Brain, User, LogOut, LayoutDashboard, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const { currentUser, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const scrollToSection = (id) => (e) => {
    e.preventDefault();
    if (location.pathname === '/') {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/');
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    }
  };

  return (
    <nav style={{ background: '#fff', borderBottom: '1px solid #E5E7EB' }} className="sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div style={{ background: '#0D9488' }} className="p-1.5 rounded-lg">
              <Brain className="w-4 h-4 text-white" />
            </div>
            <span style={{ color: '#111827', fontWeight: 600, fontSize: '1rem', letterSpacing: '-0.3px' }}>
              Quizix
            </span>
          </Link>

          {/* Center Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/explore" style={{ color: '#111827', fontSize: '0.9375rem' }} className="hover:text-teal transition-colors font-medium">
              Explore
            </Link>
            <a href="#vision" onClick={scrollToSection('vision')} style={{ color: '#111827', fontSize: '0.9375rem' }} className="hover:text-teal transition-colors font-medium">
              Mission
            </a>
            <a href="#about" onClick={scrollToSection('about')} style={{ color: '#111827', fontSize: '0.9375rem' }} className="hover:text-teal transition-colors font-medium">
              About
            </a>
          </div>

          {/* Auth */}
          <div className="flex items-center gap-5 relative">
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors hover:bg-gray-50"
                  style={{ border: '1px solid #E5E7EB' }}
                >
                  <div
                    style={{ width: 28, height: 28, borderRadius: '50%', background: '#E6FAF8', border: '1px solid #0D9488', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    <User style={{ width: 14, height: 14, color: '#0D9488' }} />
                  </div>
                  <span style={{ fontSize: '0.875rem', fontWeight: 500, color: '#111827' }} className="hidden sm:block">
                    {currentUser.displayName || currentUser.email?.split('@')[0] || 'User'}
                  </span>
                  <ChevronDown style={{ width: 14, height: 14, color: '#4B5563', transition: 'transform 150ms', transform: dropdownOpen ? 'rotate(180deg)' : 'none' }} />
                </button>

                {dropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />
                    <div
                      className="absolute right-0 mt-1 w-44 z-50 py-1"
                      style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 10, boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}
                    >
                      <Link
                        to="/dashboard"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50 transition-colors"
                        style={{ color: '#111827' }}
                      >
                        <LayoutDashboard style={{ width: 15, height: 15, color: '#4B5563' }} />
                        Dashboard
                      </Link>
                      <div style={{ height: 1, background: '#E5E7EB', margin: '4px 0' }} />
                      <button
                        onClick={() => { setDropdownOpen(false); logout(); }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-red-50 transition-colors"
                        style={{ color: '#EF4444' }}
                      >
                        <LogOut style={{ width: 15, height: 15 }} />
                        Logout
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <>
                <Link to="/login" style={{ color: '#4B5563', fontSize: '0.9375rem' }} className="hover:text-gray-900 transition-colors font-medium">Log in</Link>
                <Link to="/signup" className="btn-primary py-1.5 px-4 text-sm" style={{ padding: '8px 16px' }}>Sign up</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
