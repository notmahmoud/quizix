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
        <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
          {aiError}
        </div>
      )}
      {aiSuccess && (
        <div className="p-3 bg-teal-light border border-teal/20 text-teal rounded-lg text-sm">
          {aiSuccess}
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className="block text-xs font-medium text-muted mb-1">Topic</label>
          <input 
            type="text" 
            value={aiTopic}
            onChange={(e) => setAiTopic(e.target.value)}
            placeholder="e.g. World War 2, Photosynthesis"
            className="form-input"
            style={{ padding: '8px 12px', fontSize: '0.875rem' }}
          />
        </div>
        
        <div>
          <label className="block text-xs font-medium text-muted mb-1">Difficulty</label>
          <select 
            value={aiDifficulty}
            onChange={(e) => setAiDifficulty(e.target.value)}
            className="form-input appearance-none bg-white"
            style={{ padding: '8px 12px', fontSize: '0.875rem' }}
          >
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-muted mb-1">How many questions (1-10)</label>
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
            className="form-input"
            style={{ padding: '8px 12px', fontSize: '0.875rem' }}
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-xs font-medium text-muted mb-1">Question Type</label>
          <select 
            value={aiType}
            onChange={(e) => setAiType(e.target.value)}
            className="form-input appearance-none bg-white"
            style={{ padding: '8px 12px', fontSize: '0.875rem' }}
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
        className="btn-primary w-full mt-4 gap-2"
        style={{ padding: '10px 22px', fontSize: '0.875rem' }}
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
