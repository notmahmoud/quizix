export default function QuestionTypeSelector({ type, onChange }) {
  return (
    <div>
      <label className="block text-xs font-medium text-muted mb-1">Type</label>
      <select 
        value={type}
        onChange={(e) => onChange(e.target.value)}
        className="form-input appearance-none bg-white"
        style={{ padding: '8px 12px', fontSize: '0.875rem' }}
      >
        <option value="MCQ">Multiple Choice</option>
        <option value="TF">True / False</option>
        <option value="LONG">Long Answer</option>
      </select>
    </div>
  );
}
