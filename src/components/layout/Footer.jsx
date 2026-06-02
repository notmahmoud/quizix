import { Sparkles } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{ borderTop: '1px solid #E5E7EB', background: '#FFFFFF' }} className="mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Sparkles style={{ width: 16, height: 16, color: '#0D9488' }} />
            <span style={{ fontWeight: 500, color: '#111827', fontSize: '0.9rem' }}>Quizix</span>
          </div>
          <p style={{ fontSize: '0.875rem', color: '#4B5563' }}>
            &copy; {new Date().getFullYear()} Quizix Platform. All rights reserved.
          </p>
          <div className="flex gap-5">
            <a href="#" style={{ fontSize: '0.875rem', color: '#4B5563' }} className="hover:text-gray-900 transition-colors">Privacy</a>
            <a href="#" style={{ fontSize: '0.875rem', color: '#4B5563' }} className="hover:text-gray-900 transition-colors">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
