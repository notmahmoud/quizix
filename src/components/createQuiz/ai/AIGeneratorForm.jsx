import { Loader2, Sparkles } from 'lucide-react';

export default function AIGeneratorForm({ aiGenerator }) {
  const {
    aiTopic, setAiTopic,
    aiDifficulty, setAiDifficulty,
    aiCount, setAiCount,
    aiType, setAiType,
    isGenerating,
    aiError, aiSuccess,
    generate
  } = aiGenerator;

  return (
    <>
      {aiError && (
        <div className="p-3 bg-error/10 border border-error/20 text-error rounded-lg text-sm">
          {aiError}
        </div>
      )}
      {aiSuccess && (
        <div className="p-3 bg-accent/10 border border-accent/20 text-accent rounded-lg text-sm">
          {aiSuccess}
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className="block text-xs font-medium text-slate-400 mb-1">Topic</label>
          <input 
            type="text" 
            value={aiTopic}
            onChange={(e) => setAiTopic(e.target.value)}
            placeholder="e.g. World War 2, Photosynthesis"
            className="w-full bg-dark-surface border border-dark-border rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-accent"
          />
        </div>
        
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1">Difficulty</label>
          <select 
            value={aiDifficulty}
            onChange={(e) => setAiDifficulty(e.target.value)}
            className="w-full bg-dark-surface border border-dark-border rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-accent"
          >
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1">How many questions (1-10)</label>
          <input 
            type="number" 
            min="1"
            max="10"
            value={aiCount}
            onChange={(e) => {
              let val = parseInt(e.target.value);
              if (val < 1) val = 1;
              if (val > 10) val = 10;
              setAiCount(val || 1);
            }}
            className="w-full bg-dark-surface border border-dark-border rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-accent"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-xs font-medium text-slate-400 mb-1">Question Type</label>
          <select 
            value={aiType}
            onChange={(e) => setAiType(e.target.value)}
            className="w-full bg-dark-surface border border-dark-border rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-accent"
          >
            <option value="MCQ">MCQ</option>
            <option value="True or False">True or False</option>
            <option value="Mixed">Mixed</option>
          </select>
        </div>
      </div>

      <button 
        onClick={generate}
        disabled={isGenerating}
        className="w-full mt-4 bg-accent/20 hover:bg-accent/30 text-accent border border-accent/50 font-medium py-2 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
      >
        {isGenerating ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5" />
            Generate Questions
          </>
        )}
      </button>
    </>
  );
}
