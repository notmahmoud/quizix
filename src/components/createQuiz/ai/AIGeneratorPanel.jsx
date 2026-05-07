import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import AIGeneratorForm from './AIGeneratorForm';

export default function AIGeneratorPanel({ aiGenerator }) {
  const { aiPanelOpen, setAiPanelOpen } = aiGenerator;

  return (
    <div className="bg-dark-bg border border-accent/30 rounded-xl overflow-hidden mb-6 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
      <button
        onClick={() => setAiPanelOpen(!aiPanelOpen)}
        className="w-full flex items-center justify-between p-4 bg-accent/5 hover:bg-accent/10 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-accent" />
          <span className="font-medium text-white">Generate Questions with AI</span>
        </div>
        {aiPanelOpen ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
      </button>
      
      <AnimatePresence>
        {aiPanelOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-4 border-t border-accent/20 space-y-4">
              <AIGeneratorForm aiGenerator={aiGenerator} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
