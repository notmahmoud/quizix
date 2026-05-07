import AIGeneratorPanel from '../ai/AIGeneratorPanel';
import QuestionsList from '../questions/QuestionsList';

export default function QuestionsStep({ 
  questions, addQuestion, updateQuestion, updateOption, removeQuestion, moveQuestion,
  aiGenerator 
}) {
  return (
    <div className="space-y-6">
      <AIGeneratorPanel aiGenerator={aiGenerator} />
      <QuestionsList 
        questions={questions}
        addQuestion={addQuestion}
        updateQuestion={updateQuestion}
        updateOption={updateOption}
        removeQuestion={removeQuestion}
        moveQuestion={moveQuestion}
      />
    </div>
  );
}
