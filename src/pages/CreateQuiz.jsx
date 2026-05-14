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
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-white mb-2">Create a New Quiz</h1>
          <p className="text-slate-400">Follow the steps below to build and launch your quiz room.</p>
        </div>

        <div className="bg-dark-surface border border-dark-border rounded-2xl p-8">
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
