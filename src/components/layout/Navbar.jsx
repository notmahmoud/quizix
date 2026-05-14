import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Sparkles, User, LogOut, LayoutDashboard, ChevronDown } from 'lucide-react';
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
    <nav className="border-b border-dark-border bg-dark-bg/80 backdrop-blur-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-gradient-primary p-1.5 rounded-lg group-hover:shadow-[0_0_15px_rgba(99,102,241,0.5)] transition-shadow">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight text-white">Quizix</span>
          </Link>

          {/* Center Links (Hidden on mobile) */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/explore" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Explore</Link>
            <a href="#vision" onClick={scrollToSection('vision')} className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Mission</a>
            <a href="#about" onClick={scrollToSection('about')} className="text-sm font-medium text-slate-300 hover:text-white transition-colors">About</a>
          </div>

          {/* Auth Actions */}
          <div className="flex items-center gap-4 relative">
            {currentUser ? (
              <div className="relative">
                <button 
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 hover:bg-dark-surface p-1.5 rounded-lg transition-colors border border-transparent hover:border-dark-border"
                >
                  <div className="w-8 h-8 rounded-full bg-primary-start/20 flex items-center justify-center border border-primary-start/30">
                    <User className="w-4 h-4 text-primary-start" />
                  </div>
                  <span className="text-sm font-medium text-white hidden sm:block">
                    {currentUser.displayName || currentUser.email?.split('@')[0] || 'User'}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {dropdownOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-40"
                      onClick={() => setDropdownOpen(false)}
                    ></div>
                    <div className="absolute right-0 mt-2 w-48 interactive-card rounded-xl shadow-xl z-50 py-2 border border-dark-border">
                      <Link 
                        to="/dashboard" 
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-dark-surface transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        Dashboard
                      </Link>
                      <div className="h-px bg-dark-border my-1 w-full"></div>
                      <button 
                        onClick={() => {
                          setDropdownOpen(false);
                          logout();
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <>
                <Link to="/login" className="btn-secondary py-2 px-4 text-sm">Log in</Link>
                <Link to="/signup" className="btn-primary py-2 px-4 text-sm">Sign up</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
