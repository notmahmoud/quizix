import { Plus } from 'lucide-react';
import QuestionCard from './QuestionCard';

export default function QuestionsList({ questions, addQuestion, updateQuestion, updateOption, removeQuestion, moveQuestion }) {
  return (
    <>
      {questions.map((q, qIndex) => (
        <QuestionCard 
          key={q.id}
          q={q} 
          qIndex={qIndex} 
          updateQuestion={updateQuestion} 
          updateOption={updateOption} 
          removeQuestion={removeQuestion} 
          moveQuestion={moveQuestion} 
          isFirst={qIndex === 0} 
        />
      ))}

      <button 
        onClick={addQuestion}
        className="w-full py-4 border-2 border-dashed border-gray-200 rounded-xl text-muted font-medium hover:border-teal hover:text-teal transition-colors flex items-center justify-center gap-2 bg-white"
      >
        <Plus className="w-5 h-5" /> Add Question
      </button>
    </>
  );
}
