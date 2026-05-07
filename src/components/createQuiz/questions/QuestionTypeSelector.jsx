export default function QuestionTypeSelector({ type, onChange }) {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-500 mb-1">Type</label>
      <select 
        value={type}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-dark-surface border border-dark-border rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-primary-start"
      >
        <option value="MCQ">Multiple Choice</option>
        <option value="TF">True / False</option>
        <option value="LONG">Long Answer</option>
      </select>
    </div>
  );
}
