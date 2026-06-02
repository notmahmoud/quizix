import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import AIGeneratorForm from './AIGeneratorForm';

export default function AIGeneratorPanel({ aiGenerator }) {
  const { aiPanelOpen, setAiPanelOpen } = aiGenerator;

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden mb-6">
      <button
        onClick={() => setAiPanelOpen(!aiPanelOpen)}
        className="w-full flex items-center justify-between p-4 bg-teal-light/20 hover:bg-teal-light/40 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-teal" />
          <span className="font-medium text-gray-900">Generate Questions with AI</span>
        </div>
        {aiPanelOpen ? <ChevronUp className="w-5 h-5 text-muted" /> : <ChevronDown className="w-5 h-5 text-muted" />}
      </button>
      
      <AnimatePresence>
        {aiPanelOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-4 border-t border-gray-200 space-y-4">
              <AIGeneratorForm aiGenerator={aiGenerator} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
