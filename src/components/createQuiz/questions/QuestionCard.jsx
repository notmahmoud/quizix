import { GripVertical, Trash2 } from 'lucide-react';
import QuestionTypeSelector from './QuestionTypeSelector';
import MCQOptions from './MCQOptions';
import TrueFalseOptions from './TrueFalseOptions';

export default function QuestionCard({ q, qIndex, updateQuestion, updateOption, removeQuestion, moveQuestion, isFirst }) {
  return (
    <div className="p-6 bg-white border border-gray-200 rounded-xl relative group mb-6">
      <div className="absolute right-4 top-4 flex gap-2">
        <button onClick={() => moveQuestion(qIndex, -1)} disabled={isFirst} className="p-1 text-muted hover:text-gray-900 disabled:opacity-30"><GripVertical className="w-4 h-4" /></button>
        <button onClick={() => removeQuestion(q.id)} className="p-1 text-muted hover:text-error"><Trash2 className="w-4 h-4" /></button>
      </div>

      <div className="mb-4">
        <span className="text-xs font-medium text-teal uppercase tracking-wider mb-2 block">Question {qIndex + 1}</span>
        <textarea 
          value={q.text}
          onChange={(e) => {
            updateQuestion(q.id, 'text', e.target.value);
            e.target.style.height = 'auto';
            e.target.style.height = e.target.scrollHeight + 'px';
          }}
          onFocus={(e) => {
            e.target.style.height = 'auto';
            e.target.style.height = e.target.scrollHeight + 'px';
          }}
          className="w-full sm:w-3/4 px-0 py-2 bg-transparent border-0 border-b border-gray-200 focus:border-teal focus:ring-0 outline-none transition-all text-gray-900 text-lg font-medium resize-none overflow-hidden placeholder-gray-400"
          placeholder="Type your question here..."
          rows={1}
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mb-6">
        <QuestionTypeSelector type={q.type} onChange={(val) => updateQuestion(q.id, 'type', val)} />
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-xs font-medium text-muted mb-1">Topic Tag</label>
            <input 
              type="text" 
              value={q.tag}
              onChange={(e) => updateQuestion(q.id, 'tag', e.target.value)}
              placeholder="e.g. Math"
              className="form-input"
              style={{ padding: '8px 12px', fontSize: '0.875rem' }}
            />
          </div>
          <div className="w-20">
            <label className="block text-xs font-medium text-muted mb-1">Points</label>
            <input 
              type="number" 
              value={q.points}
              onChange={(e) => updateQuestion(q.id, 'points', parseInt(e.target.value))}
              className="form-input text-center"
              style={{ padding: '8px 12px', fontSize: '0.875rem' }}
            />
          </div>
        </div>
      </div>

      {q.type === 'MCQ' && <MCQOptions q={q} updateQuestion={updateQuestion} updateOption={updateOption} />}
      {q.type === 'TF' && <TrueFalseOptions q={q} updateQuestion={updateQuestion} />}
      {q.type === 'LONG' && (
        <div className="p-4 rounded-xl border border-dashed border-gray-200 bg-bg text-center">
          <p className="text-sm text-muted">Students will write a free-text answer. Manually graded.</p>
        </div>
      )}
    </div>
  );
}
