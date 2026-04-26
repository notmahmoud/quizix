import { Sparkles } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-dark-border bg-dark-bg/50 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary-start" />
            <span className="font-semibold text-white">Quizix</span>
          </div>
          <p className="text-sm text-slate-400">
            &copy; {new Date().getFullYear()} Quizix Platform. All rights reserved.
          </p>
          <div className="flex gap-4">
            <a href="#" className="text-sm text-slate-400 hover:text-white transition-colors">Privacy</a>
            <a href="#" className="text-sm text-slate-400 hover:text-white transition-colors">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
