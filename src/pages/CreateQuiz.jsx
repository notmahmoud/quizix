import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import useCreateQuiz from '../hooks/useCreateQuiz';
import StepIndicator from '../components/createQuiz/shared/StepIndicator';
import FooterActions from '../components/createQuiz/shared/FooterActions';
import SettingsStep from '../components/createQuiz/steps/SettingsStep';
import QuestionsStep from '../components/createQuiz/steps/QuestionsStep';
import ReviewStep from '../components/createQuiz/steps/ReviewStep';

export default function CreateQuiz() {
  const {
    step, setStep,
    settings, handleSettingsChange,
    questions, addQuestion, updateQuestion, updateOption, removeQuestion, moveQuestion,
    isSubmitting, formError, setFormError,
    handleNextStep, handleLaunch,
    aiGenerator
  } = useCreateQuiz();

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#FAF9F7' }}>
      <Navbar />
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8" style={{ padding: '64px 1rem' }}>
        <div className="mb-8">
          <h1 style={{ fontSize: '1.5rem', fontWeight: 500, color: '#111827', marginBottom: '0.25rem', letterSpacing: '-0.5px' }}>Create a New Quiz</h1>
          <p style={{ color: '#4B5563', fontSize: '0.9375rem' }}>Follow the steps below to build and launch your quiz room.</p>
        </div>

        <div className="card" style={{ padding: '32px', background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: 10 }}>
          <StepIndicator step={step} />

          {step === 1 && (
            <SettingsStep settings={settings} handleSettingsChange={handleSettingsChange} />
          )}
          {step === 2 && (
            <QuestionsStep
              questions={questions}
              addQuestion={addQuestion}
              updateQuestion={updateQuestion}
              updateOption={updateOption}
              removeQuestion={removeQuestion}
              moveQuestion={moveQuestion}
              aiGenerator={aiGenerator}
            />
          )}
          {step === 3 && (
            <ReviewStep settings={settings} questions={questions} />
          )}

          <div className="mt-8">
            <FooterActions
              step={step}
              setStep={setStep}
              handleNextStep={handleNextStep}
              handleLaunch={handleLaunch}
              isSubmitting={isSubmitting}
              formError={formError}
              setFormError={setFormError}
            />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
